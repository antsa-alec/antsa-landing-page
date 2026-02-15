import bcrypt from 'bcryptjs';
import db from '../config/database.js';

async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create default admin user
    const username = 'admin';
    const existingUser = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

    if (existingUser) {
      console.log('⚠️  Admin user already exists. Skipping user creation.');
    } else {
      const tempPassword = 'TEMP_' + Date.now();
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(tempPassword, salt);
      db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run(username, passwordHash);
      console.log('✅ Created admin user');
      console.log(`   Username: ${username}`);
      console.log('   ⚠️  IMPORTANT: Run update-admin.js to set your password!');
    }

    // =========================================================================
    // SECTIONS
    // =========================================================================
    const sections = [
      { name: 'hero', order_index: 1 },
      { name: 'the-shift', order_index: 2 },
      { name: 'the-antsa', order_index: 3 },
      { name: 'features', order_index: 4 },
      { name: 'team', order_index: 5 },
      { name: 'pricing', order_index: 6 },
      { name: 'faq', order_index: 7 },
      { name: 'compliance', order_index: 8 },
      { name: 'footer', order_index: 9 },
    ];

    const sectionStmt = db.prepare(`
      INSERT INTO sections (name, order_index)
      VALUES (?, ?)
      ON CONFLICT(name) DO UPDATE SET order_index = excluded.order_index, updated_at = CURRENT_TIMESTAMP
    `);

    sections.forEach(section => {
      sectionStmt.run(section.name, section.order_index);
    });

    // Disable old sections that are no longer used
    const oldSections = ['testimonials', 'contact', 'why-antsa'];
    const disableStmt = db.prepare(`UPDATE sections SET enabled = 0 WHERE name = ?`);
    oldSections.forEach(name => disableStmt.run(name));

    console.log('✅ Created/updated sections');

    // Helper to get section ID
    const getSectionId = (name) => {
      const row = db.prepare('SELECT id FROM sections WHERE name = ?').get(name);
      if (!row) throw new Error(`Section '${name}' not found`);
      return row.id;
    };

    // Content upsert statement
    const contentStmt = db.prepare(`
      INSERT INTO content (section_id, key, value, type)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(section_id, key) DO UPDATE SET value = excluded.value, type = excluded.type, updated_at = CURRENT_TIMESTAMP
    `);

    // =========================================================================
    // HERO SECTION
    // =========================================================================
    const heroId = getSectionId('hero');
    const heroContent = [
      { key: 'badge', value: 'AI-Powered Mental Health Platform', type: 'text' },
      { key: 'title', value: 'Keeping mental health practitioners in the loop when care happens between sessions.', type: 'text' },
      { key: 'title_highlights', value: JSON.stringify(['in the loop', 'between sessions']), type: 'json' },
      { key: 'description', value: 'ANTSA is an Australian-built digital mental health system designed to support safe, supervised care between appointments. ANTSA brings AI within clinical governance, records, and duty-of-care frameworks, rather than leaving clients to use unregulated tools on their own.', type: 'text' },
      { key: 'cta_primary', value: 'Start Your Free Trial', type: 'text' },
      { key: 'cta_primary_url', value: 'https://au.antsa.ai/sign-in', type: 'text' },
      { key: 'cta_secondary', value: 'Book a Demo', type: 'text' },
      { key: 'cta_secondary_url', value: 'mailto:admin@antsa.com.au?subject=Book%20a%20Demo%20-%20ANTSA&body=Hi%20ANTSA%20team%2C%0A%0AI%E2%80%99d%20like%20to%20book%20a%20demo%20of%20the%20ANTSA%20platform.%0A%0APlease%20let%20me%20know%20your%20available%20times.%0A%0AThanks!', type: 'text' },
    ];

    heroContent.forEach(item => {
      contentStmt.run(heroId, item.key, item.value, item.type);
    });

    console.log('✅ Seeded hero content');

    // =========================================================================
    // THE SHIFT SECTION
    // =========================================================================
    const shiftId = getSectionId('the-shift');
    const shiftContent = [
      { key: 'badge', value: 'THE SHIFT IN MENTAL HEALTH CARE', type: 'text' },
      { key: 'title', value: 'Mental health care has already moved. Systems have not.', type: 'text' },
      { key: 'title_highlights', value: JSON.stringify(['already moved']), type: 'json' },
      { key: 'subtitle', value: 'Clients are using consumer AI tools, journalling apps, and chatbots between appointments. Conversations about distress, risk, and crisis are happening outside formal care pathways, without governance, or clinician visibility.', type: 'text' },
    ];

    shiftContent.forEach(item => {
      contentStmt.run(shiftId, item.key, item.value, item.type);
    });

    // Clear old feature items for the-shift section
    db.prepare('DELETE FROM feature_items WHERE section_id = ?').run(shiftId);

    const shiftItems = [
      {
        title: 'Care Has Shifted',
        description: 'Mental health support increasingly happens between sessions. Clients reflect, disclose, and seek advice in real time, often outside the consulting room.',
        icon: 'SwapOutlined',
        color: '#48abe2',
        gradient: 'linear-gradient(135deg, #48abe2 0%, #7ec8ed 100%)',
        order_index: 1,
      },
      {
        title: 'AI Is Already In Use',
        description: 'People are turning to consumer-facing chatbots and digital tools for mental health support. These tools are widely accessible, immediate, and unregulated within clinical frameworks.',
        icon: 'RobotOutlined',
        color: '#8b5cf6',
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
        order_index: 2,
      },
      {
        title: 'No Early Warning',
        description: 'Deterioration often occurs between appointments. Without structured monitoring, clinicians have no timely visibility of escalating distress.',
        icon: 'WarningOutlined',
        color: '#f59e0b',
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
        order_index: 3,
      },
      {
        title: 'Risk Is Not Reliably Managed',
        description: 'Generative AI tools are not designed for structured risk assessment, escalation protocols, or duty-of-care frameworks. Distress can be reinforced rather than clinically managed.',
        icon: 'ExclamationCircleOutlined',
        color: '#ef4444',
        gradient: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
        order_index: 4,
      },
      {
        title: 'Clinicians Are Being Cut Out',
        description: 'No visibility of what advice was given, how it was interpreted, or whether risk was present. Clinical judgement and formulation are excluded from digital interactions.',
        icon: 'DisconnectOutlined',
        color: '#ec4899',
        gradient: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
        order_index: 5,
      },
      {
        title: 'No Governance Mechanism',
        description: 'Mental health conversations are occurring at scale without oversight, accountability, or system-level governance. Quality of care is reduced when digital support operates outside clinical control.',
        icon: 'AuditOutlined',
        color: '#06b6d4',
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
        order_index: 6,
      },
    ];

    const featureStmt = db.prepare(`
      INSERT INTO feature_items (section_id, title, description, icon, color, gradient, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    shiftItems.forEach(item => {
      featureStmt.run(shiftId, item.title, item.description, item.icon, item.color, item.gradient, item.order_index);
    });

    console.log('✅ Seeded "The Shift" section');

    // =========================================================================
    // THE ANTSA SECTION
    // =========================================================================
    const antsaId = getSectionId('the-antsa');
    const antsaContent = [
      { key: 'badge', value: 'PROBLEM? WE HAVE THE ANTSA', type: 'text' },
      { key: 'title', value: 'The system that brings clinicians back into the loop.', type: 'text' },
      { key: 'title_highlights', value: JSON.stringify(['into the loop']), type: 'json' },
      { key: 'subtitle', value: 'Between-session care should not sit outside governance. It should sit inside your clinical system. ANTSA is purpose-built infrastructure for modern mental health practice.', type: 'text' },
      { key: 'care_loop_title', value: 'The ANTSA structured clinical care loop.', type: 'text' },
      { key: 'care_loop_subtitle', value: 'One loop. One record. Human oversight.', type: 'text' },
      { key: 'care_loop_steps', value: JSON.stringify([
        {
          step: '01',
          title: 'Assign',
          description: 'The practitioner assigns clinically appropriate between-session supports, including optional AI-assisted support, aligned to the client\'s treatment plan, goals, and current level of risk.',
        },
        {
          step: '02',
          title: 'Engage',
          description: 'The client engages with therapeutic activities between sessions and can access assigned AI-assisted support at any time, providing continuity and support outside appointments without replacing human care.',
        },
        {
          step: '03',
          title: 'Monitor',
          description: 'The practitioner can monitor client engagement, mood data, journalling, and interactions with assigned supports to identify patterns, progress, and signs of distress, all within a single integrated record.',
        },
        {
          step: '04',
          title: 'Review',
          description: 'The practitioner uses between-session insights to respond sooner to emerging needs rather than waiting for the next session. This supports earlier, more proportionate clinical responses.',
        },
      ]), type: 'json' },
    ];

    antsaContent.forEach(item => {
      contentStmt.run(antsaId, item.key, item.value, item.type);
    });

    // Clear old feature items for the-antsa section
    db.prepare('DELETE FROM feature_items WHERE section_id = ?').run(antsaId);

    const antsaItems = [
      {
        title: 'Between-Session Visibility',
        description: 'Mood tracking, engagement data and structured inputs give you insight into what is happening between sessions. You see patterns early, not after escalation.',
        icon: 'EyeOutlined',
        color: '#48abe2',
        gradient: 'linear-gradient(135deg, #48abe2 0%, #7ec8ed 100%)',
        order_index: 1,
      },
      {
        title: 'Practitioner-Governed AI',
        description: 'AI conversations are assigned by you. Interactions can be reviewed. Oversight remains with the practitioner. This is supported digital care, not independent AI advice.',
        icon: 'SafetyCertificateOutlined',
        color: '#10b981',
        gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
        order_index: 2,
      },
      {
        title: 'Structured Risk Awareness',
        description: 'ANTSA is designed with clinical escalation logic in mind. It supports early identification of deterioration rather than reactive crisis response.',
        icon: 'AlertOutlined',
        color: '#f59e0b',
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
        order_index: 3,
      },
      {
        title: 'Integrated Client Record',
        description: 'Client activity, tasks, and interactions are recorded within the clinical system. Between-session care becomes visible, accountable, and ethically contained.',
        icon: 'FileProtectOutlined',
        color: '#8b5cf6',
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
        order_index: 4,
      },
      {
        title: 'Reduced Administrative Burden',
        description: 'Integrated AI scribe, secure communication, telehealth, and client engagement tools sit in one system. Fewer subscriptions. Fewer logins. Less duplication.',
        icon: 'DashboardOutlined',
        color: '#ec4899',
        gradient: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
        order_index: 5,
      },
      {
        title: 'Governance By Design',
        description: 'Built by clinicians. Hosted securely in Australia. Aligned with professional standards and digital health responsibilities.',
        icon: 'ShieldOutlined',
        color: '#06b6d4',
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
        order_index: 6,
      },
    ];

    antsaItems.forEach(item => {
      featureStmt.run(antsaId, item.title, item.description, item.icon, item.color, item.gradient, item.order_index);
    });

    console.log('✅ Seeded "The ANTSA" section');

    // =========================================================================
    // FEATURES SECTION (9-item grid)
    // =========================================================================
    const featuresId = getSectionId('features');
    const featureContent = [
      { key: 'badge', value: 'FEATURES', type: 'text' },
      { key: 'title', value: 'Supporting safe and secure care between sessions.', type: 'text' },
      { key: 'title_highlights', value: JSON.stringify(['safe and secure']), type: 'json' },
      { key: 'subtitle', value: 'A governed digital mental health system that brings together the core tools practitioners use to support and monitor clients between appointments.', type: 'text' },
    ];

    featureContent.forEach(item => {
      contentStmt.run(featuresId, item.key, item.value, item.type);
    });

    // Clear and re-seed feature items
    db.prepare('DELETE FROM feature_items WHERE section_id = ?').run(featuresId);

    const features = [
      {
        title: 'Clinician-Overseen AI Chatbot',
        description: "The world's first practitioner-overseen AI therapy support chatbot. Available 24/7 to support clients between sessions with evidence-based conversations.",
        icon: 'RobotOutlined',
        color: '#48abe2',
        gradient: 'linear-gradient(135deg, #48abe2 0%, #7ec8ed 100%)',
        order_index: 1,
      },
      {
        title: 'AI Scribe & Templates',
        description: 'Transcribes sessions and generates comprehensive summaries, saving hours of paperwork. Focus on your clients while AI handles the documentation.',
        icon: 'FileTextOutlined',
        color: '#10b981',
        gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        order_index: 2,
      },
      {
        title: 'Telehealth & Session Summaries',
        description: 'Integrated video sessions with automatic transcription and summary generation. Conduct secure telehealth appointments with ease.',
        icon: 'VideoCameraOutlined',
        color: '#8b5cf6',
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
        order_index: 3,
      },
      {
        title: 'Psychometric Measures',
        description: 'Validated assessment tools to track client progress over time. Measure outcomes with standardised psychometric instruments.',
        icon: 'FormOutlined',
        color: '#f59e0b',
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        order_index: 4,
      },
      {
        title: 'Automated Reminders',
        description: 'Keep clients engaged with automated appointment and task reminders. Reduce no-shows and improve treatment adherence.',
        icon: 'BellOutlined',
        color: '#ef4444',
        gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        order_index: 5,
      },
      {
        title: 'Homework Task Assignment',
        description: 'Assign and track therapeutic homework. Monitor completion and engagement between sessions to support treatment goals.',
        icon: 'CheckSquareOutlined',
        color: '#06b6d4',
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
        order_index: 6,
      },
      {
        title: 'Psychoeducation Library',
        description: 'Curated psychoeducation resources to share with clients. Support learning and self-management between appointments.',
        icon: 'ReadOutlined',
        color: '#ec4899',
        gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
        order_index: 7,
      },
      {
        title: 'Mood & Distress Tracking',
        description: 'Monitor client mood and distress levels between sessions. Identify patterns and intervene early when needed.',
        icon: 'LineChartOutlined',
        color: '#14b8a6',
        gradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
        order_index: 8,
      },
      {
        title: 'Secure Messaging',
        description: 'Encrypted messaging between practitioner and client. Maintain communication within a secure, governed platform.',
        icon: 'MessageOutlined',
        color: '#6366f1',
        gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
        order_index: 9,
      },
    ];

    features.forEach(item => {
      featureStmt.run(featuresId, item.title, item.description, item.icon, item.color, item.gradient, item.order_index);
    });

    console.log('✅ Seeded features section');

    // =========================================================================
    // TEAM SECTION
    // =========================================================================
    const teamId = getSectionId('team');
    const teamContent = [
      { key: 'badge', value: 'OUR TEAM', type: 'text' },
      { key: 'title', value: 'Meet the experts behind ANTSA.', type: 'text' },
      { key: 'title_highlights', value: JSON.stringify(['experts']), type: 'json' },
      { key: 'subtitle', value: 'ANTSA is a female-owned Australian company founded by a clinical psychologist and built with her two daughters. Together, the team brings deep clinical insight, strong governance, and practical experience in digital health, designing infrastructure that scales without losing clinical accountability.', type: 'text' },
    ];

    teamContent.forEach(item => {
      contentStmt.run(teamId, item.key, item.value, item.type);
    });

    // Clear and re-seed team members
    db.prepare('DELETE FROM team_member_socials WHERE team_member_id IN (SELECT id FROM team_members WHERE section_id = ?)').run(teamId);
    db.prepare('DELETE FROM team_members WHERE section_id = ?').run(teamId);

    const teamMemberStmt = db.prepare(`
      INSERT INTO team_members (section_id, name, role, bio, order_index)
      VALUES (?, ?, ?, ?, ?)
    `);

    const teamSocialStmt = db.prepare(`
      INSERT INTO team_member_socials (team_member_id, platform, url)
      VALUES (?, ?, ?)
    `);

    const teamMembers = [
      {
        name: 'Sally-Anne McCormack',
        role: 'Founder & CEO, Clinical Psychologist',
        bio: 'Founder and CEO of ANTSA. A clinical psychologist with extensive experience in mental health practice, driving the vision for clinician-governed digital care infrastructure.',
        order_index: 1,
        socials: [{ platform: 'linkedin', url: 'https://www.linkedin.com/in/sally-anne-mccormack/' }],
      },
      {
        name: 'Kiera Macdonald',
        role: 'CCO, Clinical Psychologist',
        bio: 'Chief Clinical Officer bringing clinical psychology expertise to ensure ANTSA maintains the highest standards of clinical governance and evidence-based practice.',
        order_index: 2,
        socials: [{ platform: 'linkedin', url: 'https://www.linkedin.com/in/kiera-macdonald/' }],
      },
      {
        name: 'Amber Macdonald',
        role: 'CGO, Senior Scientist / Lawyer',
        bio: 'Chief Governance Officer combining scientific research and legal expertise to ensure ANTSA meets regulatory requirements and professional standards.',
        order_index: 3,
        socials: [{ platform: 'linkedin', url: 'https://www.linkedin.com/in/amber-macdonald/' }],
      },
      {
        name: 'Ben Smith',
        role: 'CTO, AI Engineer',
        bio: 'Chief Technology Officer leading the technical architecture and AI systems that power ANTSA\'s practitioner-governed digital care platform.',
        order_index: 4,
        socials: [],
      },
    ];

    teamMembers.forEach(member => {
      const result = teamMemberStmt.run(teamId, member.name, member.role, member.bio, member.order_index);
      const memberId = result.lastInsertRowid;
      member.socials.forEach(social => {
        teamSocialStmt.run(memberId, social.platform, social.url);
      });
    });

    console.log('✅ Seeded team section');

    // =========================================================================
    // PRICING SECTION
    // =========================================================================
    const pricingId = getSectionId('pricing');
    const pricingContent = [
      { key: 'badge', value: 'PRICING', type: 'text' },
      { key: 'title', value: 'Pricing should be simple.', type: 'text' },
      { key: 'title_highlights', value: JSON.stringify(['simple']), type: 'json' },
      { key: 'subtitle', value: 'One system. Full access. No hidden add-ons.', type: 'text' },
    ];

    pricingContent.forEach(item => {
      contentStmt.run(pricingId, item.key, item.value, item.type);
    });

    // Clear and re-seed pricing plans
    db.prepare('DELETE FROM pricing_plans WHERE section_id = ?').run(pricingId);

    const pricingStmt = db.prepare(`
      INSERT INTO pricing_plans (section_id, name, price, period, featured, features, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const pricingPlans = [
      {
        name: 'Solo Practitioner',
        price: '$79',
        period: '/month',
        featured: 1,
        features: JSON.stringify([
          'Full platform access',
          'AI chatbot (jAImee)',
          'AI Scribe & Templates',
          'Telehealth & Session Summaries',
          'Mood & Distress Tracking',
          'Secure Messaging',
          'Homework Task Assignment',
          'Psychoeducation Library',
          'Automated Reminders',
          'Psychometric Measures',
        ]),
        order_index: 1,
      },
      {
        name: 'Clinic / Practice',
        price: 'Contact Us',
        period: '',
        featured: 0,
        features: JSON.stringify([
          'Everything in Solo Practitioner',
          'Reduced per-licence pricing for practices with multiple practitioner licences',
          'Multi-practitioner management',
          'Practice-level reporting',
        ]),
        order_index: 2,
      },
      {
        name: 'Enterprise',
        price: 'Contact Us',
        period: '',
        featured: 0,
        features: JSON.stringify([
          'Everything in Clinic / Practice',
          'Custom integrations',
          'Dedicated support',
          'Service-level agreements',
          'Custom deployment options',
        ]),
        order_index: 3,
      },
    ];

    pricingPlans.forEach(plan => {
      pricingStmt.run(pricingId, plan.name, plan.price, plan.period, plan.featured, plan.features, plan.order_index);
    });

    console.log('✅ Seeded pricing section');

    // =========================================================================
    // FAQ SECTION
    // =========================================================================
    const faqId = getSectionId('faq');
    const faqContent = [
      { key: 'badge', value: 'FREQUENTLY ASKED QUESTIONS', type: 'text' },
      { key: 'title', value: 'Frequently Asked Questions', type: 'text' },
      { key: 'subtitle', value: 'Find answers to common questions about ANTSA.', type: 'text' },
    ];

    faqContent.forEach(item => {
      contentStmt.run(faqId, item.key, item.value, item.type);
    });

    // Clear and re-seed FAQ items
    db.prepare('DELETE FROM faq_items WHERE section_id = ?').run(faqId);

    const faqStmt = db.prepare(`
      INSERT INTO faq_items (section_id, question, answer, order_index)
      VALUES (?, ?, ?, ?)
    `);

    const faqItems = [
      {
        question: 'Is ANTSA a therapy replacement?',
        answer: 'No. ANTSA supports care between sessions. Clinical judgement, formulation, and responsibility remain with the practitioner. AI support is assigned and overseen within defined clinical parameters. Practitioners control access. Clients are invited into the system by their practitioner and engage only with assigned supports.',
        order_index: 1,
      },
      {
        question: 'Does ANTSA diagnose mental health conditions?',
        answer: 'No. ANTSA is a practitioner-governed digital support system. It does not diagnose, independently treat, or make autonomous clinical decisions. Practitioners remain responsible for clinical decision-making.',
        order_index: 2,
      },
      {
        question: 'How is ANTSA different from consumer AI tools?',
        answer: 'Consumer tools operate outside clinical systems. ANTSA sits inside your practice workflow. You assign supports, monitor engagement, review interactions, and retain accountability within a single integrated record.',
        order_index: 3,
      },
      {
        question: 'How does ANTSA help with risk management?',
        answer: 'ANTSA provides structured visibility into mood data, engagement patterns, and client interactions between sessions. This supports earlier identification of deterioration rather than reactive crisis response.',
        order_index: 4,
      },
      {
        question: 'Is the AI supervised in real time?',
        answer: 'No. Practitioners can review interactions after they occur. Oversight, feedback, and adjustment remain in your control.',
        order_index: 5,
      },
      {
        question: 'Is client data secure?',
        answer: 'Yes. ANTSA is hosted on secure Australian servers and aligned with Australian Privacy Principles and professional standards. Data is contained within your governed clinical system.',
        order_index: 6,
      },
      {
        question: 'Does ANTSA replace practitioner responsibility?',
        answer: 'No. Clinical judgement, regulatory compliance, and duty of care remain with the practitioner at all times. ANTSA is practitioner-controlled infrastructure. Compliance alignment reflects system design and data handling practices, not a transfer of professional responsibility.',
        order_index: 7,
      },
      {
        question: 'What happens if a client discloses risk in the platform?',
        answer: 'ANTSA supports visibility and structured monitoring. It does not replace crisis services. Practitioners retain responsibility for clinical response and escalation according to their professional standards.',
        order_index: 8,
      },
      {
        question: 'Does ANTSA include telehealth and note-taking?',
        answer: 'Yes. Telehealth, AI scribe, client engagement tools, mood tracking, and AI-assisted support are included within one system. There are no add-on feature tiers.',
        order_index: 9,
      },
      {
        question: 'Can ANTSA be used without assigning the AI chatbot?',
        answer: 'Yes. All AI-assisted components are practitioner-assigned. The system can be used for engagement, mood tracking, telehealth, and documentation without AI support if preferred.',
        order_index: 10,
      },
      {
        question: 'Can ANTSA be used in group practices or organisations?',
        answer: 'Yes. ANTSA supports solo practitioners, group practices and larger services. It is designed as governed infrastructure, making it suitable for structured service environments.',
        order_index: 11,
      },
      {
        question: 'Is client data used to train external AI models?',
        answer: 'No. Client data remains within the governed system and is not used to train public or external AI models.',
        order_index: 12,
      },
    ];

    faqItems.forEach(item => {
      faqStmt.run(faqId, item.question, item.answer, item.order_index);
    });

    console.log('✅ Seeded FAQ section');

    // =========================================================================
    // COMPLIANCE SECTION (badges above footer)
    // =========================================================================
    const complianceId = getSectionId('compliance');
    const complianceContent = [
      { key: 'badges', value: JSON.stringify([
        { title: 'GDPR Compliant', description: 'European data protection standards', icon: 'SafetyOutlined' },
        { title: 'Australian Privacy Principles', description: 'Hosted on Australian Servers', icon: 'GlobalOutlined' },
        { title: 'HIPAA Compliant', description: 'US healthcare data protection', icon: 'MedicineBoxOutlined' },
      ]), type: 'json' },
    ];

    complianceContent.forEach(item => {
      contentStmt.run(complianceId, item.key, item.value, item.type);
    });

    console.log('✅ Seeded compliance section');

    // =========================================================================
    // FOOTER SECTION
    // =========================================================================
    const footerId = getSectionId('footer');
    const footerContent = [
      { key: 'copyright', value: 'Copyright \u00A9 ANTSA Pty Ltd 2026 (ABN: 77 664 161 237) (ACN: 664 161 237) - All Rights Reserved.', type: 'text' },
      { key: 'description', value: 'Supporting safe, supervised care between appointments.', type: 'text' },
    ];

    footerContent.forEach(item => {
      contentStmt.run(footerId, item.key, item.value, item.type);
    });

    console.log('✅ Seeded footer content');

    // =========================================================================
    // SOCIAL LINKS
    // =========================================================================
    const socialStmt = db.prepare(`
      INSERT INTO social_links (platform, url, icon, order_index)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(platform) DO UPDATE SET url = excluded.url, icon = excluded.icon, order_index = excluded.order_index
    `);

    const socialLinks = [
      { platform: 'instagram', url: 'https://www.instagram.com/antsa.ai/', icon: 'InstagramOutlined', order_index: 1 },
      { platform: 'facebook', url: 'https://www.facebook.com/antsa.ai/', icon: 'FacebookOutlined', order_index: 2 },
      { platform: 'linkedin', url: 'https://www.linkedin.com/company/antsa-ai/', icon: 'LinkedinOutlined', order_index: 3 },
      { platform: 'email', url: 'mailto:admin@antsa.com.au', icon: 'MailOutlined', order_index: 4 },
    ];

    socialLinks.forEach(link => {
      socialStmt.run(link.platform, link.url, link.icon, link.order_index);
    });

    console.log('✅ Seeded social links');

    // =========================================================================
    // NAV ITEMS
    // =========================================================================
    db.prepare('DELETE FROM nav_items').run();

    const navStmt = db.prepare(`
      INSERT INTO nav_items (label, href, order_index)
      VALUES (?, ?, ?)
    `);

    const navItems = [
      { label: 'Home', href: '#hero', order_index: 1 },
      { label: 'The Shift', href: '#the-shift', order_index: 2 },
      { label: 'The ANTSA', href: '#the-antsa', order_index: 3 },
      { label: 'Features', href: '#features', order_index: 4 },
      { label: 'Our Team', href: '#team', order_index: 5 },
      { label: 'Pricing', href: '#pricing', order_index: 6 },
      { label: 'FAQ', href: '#faq', order_index: 7 },
    ];

    navItems.forEach(item => {
      navStmt.run(item.label, item.href, item.order_index);
    });

    console.log('✅ Seeded navigation items');

    // =========================================================================
    // FOOTER LINKS (Legal)
    // =========================================================================
    db.prepare('DELETE FROM footer_links').run();
    db.prepare('DELETE FROM footer_categories').run();

    const catStmt = db.prepare(`INSERT INTO footer_categories (name, order_index) VALUES (?, ?)`);
    const legalCatResult = catStmt.run('legal', 1);
    const legalCatId = legalCatResult.lastInsertRowid;

    const footerLinkStmt = db.prepare(`
      INSERT INTO footer_links (label, url, category_id, order_index)
      VALUES (?, ?, ?, ?)
    `);

    footerLinkStmt.run('Privacy Policy', '/privacy-policy', legalCatId, 1);
    footerLinkStmt.run('Terms & Conditions', '/terms-and-conditions', legalCatId, 2);

    console.log('✅ Seeded footer links');

    // =========================================================================
    // SETTINGS
    // =========================================================================
    const settingsStmt = db.prepare(`
      INSERT INTO settings (key, value)
      VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
    `);

    settingsStmt.run('ga_measurement_id', 'G-XXXXXXXXXX');
    settingsStmt.run('site_name', 'ANTSA');
    settingsStmt.run('site_tagline', 'Digital Mental Health Infrastructure');

    console.log('✅ Seeded settings');

    // =========================================================================
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Start the backend server: npm run dev');
    console.log('   2. Run update-admin.js to set your password');
    console.log('   3. Start customizing your content through the admin panel');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
