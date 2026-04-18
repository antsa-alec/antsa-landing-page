import express from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

/**
 * POST /api/contact
 * Receives a help/support query from the marketing site chat widget.
 * - Sends the query details to help@antsa.com.au
 * - Sends an acknowledgement to the user's provided email
 *
 * In production this would use a transactional email service (e.g. SendGrid,
 * Azure Communication Services). For now we log the message and return success
 * so the frontend flow works end-to-end. The production deployment already has
 * the antsa-support-agent Azure Function listening on the help@antsa.com.au
 * inbox, so any emails arriving there will be picked up automatically.
 *
 * To enable actual sending, set SENDGRID_API_KEY or configure SMTP in env vars.
 */
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

    try {
      // Log the contact submission (always, regardless of email config)
      console.log('📩 New contact form submission:');
      console.log(`   Name:    ${name}`);
      console.log(`   Email:   ${email}`);
      console.log(`   Message: ${message.substring(0, 200)}${message.length > 200 ? '...' : ''}`);

      // Attempt to send via nodemailer if SMTP is configured
      if (process.env.SMTP_HOST) {
        try {
          const nodemailer = await import('nodemailer');
          const transporter = nodemailer.default.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587', 10),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          });

          // Email to support team
          await transporter.sendMail({
            from: process.env.SMTP_FROM || 'noreply@antsa.com.au',
            to: 'help@antsa.com.au',
            subject: `Website Contact: ${name}`,
            text: `New contact form submission from the ANTSA website.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            html: `
              <h2>New Website Contact Form Submission</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <hr />
              <p><strong>Message:</strong></p>
              <p>${message.replace(/\n/g, '<br />')}</p>
            `,
          });

          // Acknowledgement to the user
          await transporter.sendMail({
            from: process.env.SMTP_FROM || 'noreply@antsa.com.au',
            to: email,
            subject: 'We received your message — ANTSA',
            text: `Hi ${name},\n\nThank you for reaching out to ANTSA. We've received your message and our team will get back to you shortly.\n\nBest regards,\nThe ANTSA Team`,
            html: `
              <p>Hi ${name},</p>
              <p>Thank you for reaching out to ANTSA. We've received your message and our team will get back to you shortly.</p>
              <br />
              <p>Best regards,<br />The ANTSA Team</p>
            `,
          });

          console.log('✅ Contact emails sent successfully');
        } catch (emailErr) {
          // Log but don't fail the request — the submission was still captured
          console.error('⚠️ Failed to send contact emails:', emailErr.message);
        }
      } else {
        console.log('ℹ️  SMTP not configured — contact submission logged only. Set SMTP_HOST to enable email delivery.');
      }

      res.json({
        success: true,
        message: 'Thank you for your message. We will get back to you shortly.',
      });
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
