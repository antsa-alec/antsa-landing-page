/**
 * 2026 redesign — align CMS content with the approved clinician-governed design.
 *
 * `applyRedesignContent(db)` is idempotent: content rows upsert by
 * (section_id,key); child tables are delete-then-insert by section. It is called
 * from seed.js (fresh environments) and from update-redesign-content.mjs
 * (existing/persistent DBs where the initial seed already ran).
 */
export function applyRedesignContent(db) {
  const getSectionId = (name) => {
    const row = db.prepare('SELECT id FROM sections WHERE name = ?').get(name);
    return row ? row.id : null;
  };
  const ensureSection = (name, order_index) => {
    db.prepare(
      `INSERT INTO sections (name, order_index) VALUES (?, ?)
       ON CONFLICT(name) DO UPDATE SET updated_at = CURRENT_TIMESTAMP`,
    ).run(name, order_index);
    return getSectionId(name);
  };
  const contentStmt = db.prepare(
    `INSERT INTO content (section_id, key, value, type) VALUES (?, ?, ?, ?)
     ON CONFLICT(section_id, key) DO UPDATE SET value = excluded.value, type = excluded.type, updated_at = CURRENT_TIMESTAMP`,
  );
  const setText = (sid, key, value) => contentStmt.run(sid, key, String(value), 'text');
  const setJson = (sid, key, value) => contentStmt.run(sid, key, JSON.stringify(value), 'json');

  const apply = db.transaction(() => {
    // ---- HEADER (create if missing; drives AppHeader CTAs via loadChromeData) ----
    const header = ensureSection('header', 0);
    setText(header, 'signin_url', 'https://au.antsa.ai/sign-in');
    setText(header, 'signin_label', 'Log in');
    setText(header, 'signup_url', 'https://antsa.ai/free-trial');
    setText(header, 'signup_label', 'Start free trial');
    setText(header, 'demo_url', 'https://calendly.com/sally-anne-mcc');
    setText(header, 'demo_label', 'Book a demo');

    // ---- HERO ----
    const hero = ensureSection('hero', 1);
    setText(hero, 'badge', 'Award-winning, clinician-governed mental health technology');
    setText(hero, 'title', 'Mental health care belongs in clinician hands. ANTSA keeps it there.');
    setJson(hero, 'title_highlights', ['Mental health', 'clinician', 'ANTSA']);
    setText(hero, 'description', 'ANTSA® helps clinicians reduce admin, support clients between sessions, and keep clinical oversight in one secure Australian platform.');
    setText(hero, 'subline', 'A tool for your practice, never a replacement for your judgement.');
    setText(hero, 'cta_primary', 'Book a demo');
    setText(hero, 'cta_primary_url', 'https://calendly.com/sally-anne-mcc');
    setText(hero, 'cta_secondary', 'Start free trial');
    setText(hero, 'cta_secondary_url', 'https://antsa.ai/free-trial');
    setText(hero, 'hero_desktop_image', '/landing/hero-clinician-client.webp');

    // ---- FEATURES ("See ANTSA in action") ----
    const features = ensureSection('features', 7);
    setText(features, 'title', 'One login for your whole practice');
    setText(features, 'subtitle', 'The core tools you use to support and monitor clients, during sessions and between them.');
    const palette = ['#48ABE2', '#1F9D8B', '#E0922C', '#7C6CE0', '#E0567F', '#2BB0C4', '#48ABE2', '#1F9D8B', '#E0922C'];
    const featureItems = [
      ['AI Scribe', 'Transcribes and summarises sessions so you finish notes faster, and review every word.', '/landing/screen-scribe.webp'],
      ['Client messaging', 'Secure, in-platform messaging that keeps client communication in one place.', '/landing/screen-messages.webp'],
      ['AI assistant', 'A practitioner-side assistant that helps you draft, summarise and stay organised.', '/landing/screen-assistant.webp'],
      ['Homework & tasks', 'Assign tasks, journals and activities clients can complete between sessions.', '/landing/screen-homework.webp'],
      ['Psychometrics', 'Send validated measures with automatic scoring for intake, review and monitoring.', '/landing/screen-psychometrics.webp'],
      ['Mood & engagement', 'See mood trends and engagement at a glance, without chasing reports.', '/landing/screen-mood.webp'],
      ['Telehealth', 'Built-in secure video, working alongside the AI Scribe. No separate platform.', '/landing/screen-calendar.webp'],
      ['ANTSAbot', 'Optional, clinician-governed AI support for reflection and psychoeducation between sessions.', '/landing/screen-chatbot.webp'],
      ['Mobile app', 'Clients access their tasks, mood check-ins and resources from a simple mobile app.', '/landing/screen-mobile.webp'],
    ];
    db.prepare('DELETE FROM feature_items WHERE section_id = ?').run(features);
    const featStmt = db.prepare(
      'INSERT INTO feature_items (section_id, title, description, icon, color, gradient, order_index, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    );
    featureItems.forEach(([title, desc, img], i) => featStmt.run(features, title, desc, '', palette[i], '', i, img));

    // ---- TEAM ----
    const team = ensureSection('team', 8);
    const members = [
      {
        name: 'Sally-Anne McCormack',
        role: 'Founder & CEO\nClinical Psychologist',
        bio: 'Sally-Anne saw the between-session gap in her own clinical practice. After 20 years as a psychologist, she built the platform she wished had existed for clinicians and clients to make between-session care more visible, structured and clinically governed.',
        socials: [['linkedin', 'https://www.linkedin.com/in/sallyannemccormack/'], ['website', 'https://www.sally-annemccormack.com.au/']],
      },
      {
        name: 'Kiera Macdonald',
        role: 'CCO, Chief Clinical Officer\nPsychologist (Clinical Registrar)',
        bio: 'Kiera knows what it looks like when a client arrives having had no support since last session. She helps shape ANTSA® through a strong clinical lens, ensuring the platform remains ethical, practical and grounded in real therapeutic work.',
        socials: [['linkedin', 'https://www.linkedin.com/in/kiera-macdonald-9a8b5b364/']],
      },
      {
        name: 'Amber Macdonald',
        role: 'CGO, Chief Governance Officer\nSenior Scientist / Lawyer',
        bio: 'Most platforms think about governance after the fact. Amber built it in from the start. Her background in science and law means ANTSA® is designed to withstand scrutiny before it reaches a client.',
        socials: [['linkedin', 'https://www.linkedin.com/in/amber--macdonald/']],
      },
      {
        name: 'Ben Smith',
        role: 'CTO, Chief Technology Officer\nAI Engineer',
        bio: "Ben leads ANTSA's technical architecture and AI systems. He joined because he believed in what clinician-governed AI could do. His work reflects a strong commitment to building technology that is safe, practical and clinically useful.",
        socials: [['linkedin', 'https://www.linkedin.com/company/antsa-mentalhealth/']],
      },
    ];
    const existingMembers = db.prepare('SELECT id FROM team_members WHERE section_id = ?').all(team);
    const delSoc = db.prepare('DELETE FROM team_member_socials WHERE team_member_id = ?');
    existingMembers.forEach((m) => delSoc.run(m.id));
    db.prepare('DELETE FROM team_members WHERE section_id = ?').run(team);
    const memStmt = db.prepare('INSERT INTO team_members (section_id, name, role, bio, order_index) VALUES (?, ?, ?, ?, ?)');
    const socStmt = db.prepare('INSERT INTO team_member_socials (team_member_id, platform, url, order_index) VALUES (?, ?, ?, ?)');
    members.forEach((m, i) => {
      const res = memStmt.run(team, m.name, m.role, m.bio, i);
      m.socials.forEach(([p, u], j) => socStmt.run(res.lastInsertRowid, p, u, j));
    });

    // ---- PRICING (names kept route-compatible so stripe-pricing feature lookup matches) ----
    const pricing = ensureSection('pricing', 9);
    const plans = [
      { name: 'Solo Practitioner', price: '$99', period: '/ month', featured: 1, features: ['Full platform access', 'Clinician-overseen AI chatbot', 'Practitioner AI assistant', 'AI Scribe & templates', 'Telehealth & session summaries', 'Mood & distress tracking', 'Secure messaging', 'Homework task assignment', 'Psychoeducation library', 'Automated reminders', 'Psychometric measures'] },
      { name: 'Clinic / Practice', price: '', period: 'Volume pricing for teams', featured: 0, features: ['Everything in solo practitioner', 'Reduced per-licence pricing', 'Multi-practitioner management', 'Practice-level reporting', 'Encrypted practitioner communication', 'Real-time reporting of practitioner usage'] },
      { name: 'Enterprise', price: '', period: 'For organisations at scale', featured: 0, features: ['Everything in clinic / practice', 'Custom integrations', 'Dedicated support', 'Service-level agreements', 'Custom deployment options'] },
    ];
    db.prepare('DELETE FROM pricing_plans WHERE section_id = ?').run(pricing);
    const planStmt = db.prepare('INSERT INTO pricing_plans (section_id, name, price, period, featured, features, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)');
    plans.forEach((p, i) => planStmt.run(pricing, p.name, p.price, p.period, p.featured, JSON.stringify(p.features), i));

    // ---- FAQ ----
    const faq = ensureSection('faq', 10);
    const faqs = [
      ['Is ANTSA a replacement for therapy?', 'No. ANTSA® is a clinical support platform that helps extend structured care between sessions. It does not replace therapy, diagnose conditions, make clinical decisions or operate independently of practitioner oversight.'],
      ['Is ANTSAbot optional?', 'Yes. ANTSAbot is completely optional. Clinicians decide whether it is appropriate for each client, and clients are asked to consent before using it. ANTSA® can still be used for AI Scribe, telehealth, homework, mood tracking, resources, secure messaging and other clinical workflow tools without ANTSAbot.'],
      ['Will ANTSA replace clinicians?', 'No. ANTSA® is built to bring clinicians into digital care, not remove them. It supports your clinical workflow and helps clients stay engaged between sessions, while clinical decisions and responsibility remain with you.'],
      ['Does ANTSAbot give independent advice?', 'No. ANTSAbot supports reflection, psychoeducation and engagement within a clinician-governed platform. It does not diagnose, provide independent therapy, create treatment plans or give medical advice.'],
      ['How is ANTSA different from a consumer AI tool?', 'ANTSA® is clinician-governed. Tools such as ANTSAbot are assigned by the practitioner, reviewable by the clinician and used within a governance framework, unlike consumer tools that operate without clinical oversight.'],
      ['Is client data used to train AI models?', 'No. Client data is not used to train AI models. Privacy and security are core to how ANTSA® is designed.'],
      ['Is client data secure?', 'Yes. ANTSA® is hosted on Australian servers and designed with privacy, encryption, two-factor authentication and consent-based sharing. It is aligned with the Australian Privacy Principles, HIPAA and GDPR, with ISO 27001 certification in progress.'],
    ];
    db.prepare('DELETE FROM faq_items WHERE section_id = ?').run(faq);
    const faqStmt = db.prepare('INSERT INTO faq_items (section_id, question, answer, order_index) VALUES (?, ?, ?, ?)');
    faqs.forEach(([q, a], i) => faqStmt.run(faq, q, a, i));

    // ---- FOOTER ----
    const footer = getSectionId('footer');
    if (footer) {
      setText(footer, 'copyright', 'Copyright © ANTSA® Pty Ltd 2026 (ABN: 77 664 161 237) (ACN: 664 161 237) · All rights reserved');
      setText(footer, 'description', 'Clinician-governed digital mental health support for the whole therapy journey.');
    }

    // ---- SOCIAL LINKS ----
    const socialStmt = db.prepare(
      `INSERT INTO social_links (platform, url, icon, order_index) VALUES (?, ?, ?, ?)
       ON CONFLICT(platform) DO UPDATE SET url = excluded.url, order_index = excluded.order_index`,
    );
    [
      ['instagram', 'https://www.instagram.com/antsa.app/', 0],
      ['facebook', 'https://www.facebook.com/ANTSAforProfessionals', 1],
      ['linkedin', 'https://www.linkedin.com/company/antsa-mentalhealth', 2],
      ['email', 'mailto:admin@antsa.com.au', 3],
    ].forEach(([p, u, o]) => socialStmt.run(p, u, '', o));
  });

  apply();
}
