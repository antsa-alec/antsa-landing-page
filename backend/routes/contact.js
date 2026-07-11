import express from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

/**
 * POST /api/contact
 * Receives a help/support query from the marketing site chat widget and
 * delivers it to the support inbox, plus an acknowledgement to the sender.
 *
 * Delivery channel priority:
 *   1. Azure Communication Services (ACS) — the same email resource the main
 *      API uses (AZURE_EMAIL_CONNECTION_STRING_AU / AZURE_EMAIL_SENDER_AU).
 *   2. SMTP via nodemailer — legacy fallback, only if SMTP_HOST is set AND
 *      nodemailer is installed (it is an optional dep, hence the dynamic import).
 *   3. None configured — the submission is logged and the request FAILS (502)
 *      so the widget shows an error rather than a false "Message sent!".
 *
 * The support email carries the sender's address as reply-to, so the team can
 * reply directly. The acknowledgement to the sender is best-effort: it does not
 * affect the success of the request (what matters is that the team received it).
 */

const escapeHtml = (str) =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// Hard cap on ACS pollUntilDone — the SDK has no upper bound, so a single hung
// send would keep the request (and its resources) alive indefinitely. Mirrors
// the timeout guard in the main API's AzureCommunicationEmailService.
const ACS_POLL_TIMEOUT_MS = 30_000;

async function sendViaAcs({ connectionString, sender, recipient, name, email, message }) {
  const { EmailClient } = await import('@azure/communication-email');
  const client = new EmailClient(connectionString);

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');

  const withTimeout = async (poller) => {
    let timeoutHandle;
    const timeout = new Promise((_resolve, reject) => {
      timeoutHandle = setTimeout(
        () => reject(new Error(`ACS pollUntilDone timed out after ${ACS_POLL_TIMEOUT_MS}ms`)),
        ACS_POLL_TIMEOUT_MS,
      );
    });
    try {
      await Promise.race([poller.pollUntilDone(), timeout]);
    } finally {
      clearTimeout(timeoutHandle);
    }
  };

  // Support email — this is the one that MUST succeed for the request to succeed.
  const supportPoller = await client.beginSend({
    senderAddress: sender,
    content: {
      subject: `Website Contact: ${name}`,
      plainText: `New contact form submission from the ANTSA website.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h2>New Website Contact Form Submission</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      `,
    },
    recipients: { to: [{ address: recipient }] },
    // Lets the support team hit "Reply" and reach the sender directly.
    replyTo: [{ address: email, displayName: name }],
  });
  await withTimeout(supportPoller);

  // Acknowledgement to the sender — best-effort; a failure here must not fail
  // the request, because the team has already received the message.
  try {
    const ackPoller = await client.beginSend({
      senderAddress: sender,
      content: {
        subject: 'We received your message — ANTSA',
        plainText: `Hi ${name},\n\nThank you for reaching out to ANTSA. We've received your message and our team will get back to you shortly.\n\nBest regards,\nThe ANTSA Team`,
        html: `
          <p>Hi ${safeName},</p>
          <p>Thank you for reaching out to ANTSA. We've received your message and our team will get back to you shortly.</p>
          <br />
          <p>Best regards,<br />The ANTSA Team</p>
        `,
      },
      recipients: { to: [{ address: email }] },
    });
    await withTimeout(ackPoller);
  } catch (ackErr) {
    console.error('⚠️  Contact acknowledgement email failed (non-fatal):', ackErr.message);
  }
}

async function sendViaSmtp({ recipient, name, email, message }) {
  const nodemailer = await import('nodemailer');
  const transporter = nodemailer.default.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');
  const from = process.env.SMTP_FROM || 'noreply@antsa.com.au';

  // Support email — must succeed.
  await transporter.sendMail({
    from,
    to: recipient,
    replyTo: email,
    subject: `Website Contact: ${name}`,
    text: `New contact form submission from the ANTSA website.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `
      <h2>New Website Contact Form Submission</h2>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
      <hr />
      <p><strong>Message:</strong></p>
      <p>${safeMessage}</p>
    `,
  });

  // Acknowledgement — best-effort.
  try {
    await transporter.sendMail({
      from,
      to: email,
      subject: 'We received your message — ANTSA',
      text: `Hi ${name},\n\nThank you for reaching out to ANTSA. We've received your message and our team will get back to you shortly.\n\nBest regards,\nThe ANTSA Team`,
      html: `
        <p>Hi ${safeName},</p>
        <p>Thank you for reaching out to ANTSA. We've received your message and our team will get back to you shortly.</p>
        <br />
        <p>Best regards,<br />The ANTSA Team</p>
      `,
    });
  } catch (ackErr) {
    console.error('⚠️  Contact acknowledgement email failed (non-fatal):', ackErr.message);
  }
}

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('A valid email address is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, message } = req.body;
    const recipient = process.env.CONTACT_RECIPIENT || 'help@antsa.com.au';

    // Always log the submission first, so it is captured even if delivery fails.
    console.log('📩 New contact form submission:');
    console.log(`   Name:    ${name}`);
    console.log(`   Email:   ${email}`);
    console.log(`   Message: ${message.substring(0, 200)}${message.length > 200 ? '...' : ''}`);

    const acsConnectionString =
      process.env.AZURE_EMAIL_CONNECTION_STRING_AU || process.env.AZURE_EMAIL_CONNECTION_STRING;
    const acsSender = process.env.AZURE_EMAIL_SENDER_AU;

    try {
      if (acsConnectionString && acsSender) {
        await sendViaAcs({ connectionString: acsConnectionString, sender: acsSender, recipient, name, email, message });
        console.log(`✅ Contact email delivered via ACS to ${recipient}`);
      } else if (process.env.SMTP_HOST) {
        await sendViaSmtp({ recipient, name, email, message });
        console.log(`✅ Contact email delivered via SMTP to ${recipient}`);
      } else {
        // No delivery channel configured — do NOT pretend it worked.
        console.error(
          '❌ No email channel configured (set AZURE_EMAIL_CONNECTION_STRING_AU + AZURE_EMAIL_SENDER_AU, or SMTP_HOST). Submission logged only.',
        );
        return res.status(502).json({
          error: 'We could not send your message right now. Please email us directly at help@antsa.com.au.',
        });
      }
    } catch (error) {
      console.error('❌ Contact email delivery failed:', error.message);
      return res.status(502).json({
        error: 'We could not send your message right now. Please email us directly at help@antsa.com.au.',
      });
    }

    return res.json({
      success: true,
      message: 'Thank you for your message. We will get back to you shortly.',
    });
  }
);

export default router;
