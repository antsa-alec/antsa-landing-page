import bcrypt from 'bcryptjs';
import db from '../config/database.js';

async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create default admin user
    const username = 'admin';
    // Note: This seed script is for initial database setup only.
    // Admin credentials are set via update-admin.js script with secure password.
    const tempPassword = 'TEMP_' + Date.now(); // Temporary password

    // Check if user already exists
    const existingUser = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

    if (existingUser) {
      console.log('⚠️  Admin user already exists. Skipping user creation.');
    } else {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(tempPassword, salt);

      db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run(username, passwordHash);
      console.log('✅ Created admin user');
      console.log(`   Username: ${username}`);
      console.log('   ⚠️  IMPORTANT: Run update-admin.js to set your password!');
    }

    // Create sections
    const sections = [
      { name: 'hero', order_index: 1 },
      { name: 'features', order_index: 2 },
      { name: 'pricing', order_index: 3 },
      { name: 'testimonials', order_index: 4 },
      { name: 'team', order_index: 5 },
      { name: 'contact', order_index: 6 },
      { name: 'footer', order_index: 7 },
    ];

    const sectionStmt = db.prepare(`
      INSERT INTO sections (name, order_index)
      VALUES (?, ?)
      ON CONFLICT(name) DO NOTHING
    `);

    sections.forEach(section => {
      sectionStmt.run(section.name, section.order_index);
    });

    console.log('✅ Created sections');

    // Get section IDs
    const getSectionId = (name) => {
      return db.prepare('SELECT id FROM sections WHERE name = ?').get(name).id;
    };

    // Seed hero content
    const heroId = getSectionId('hero');
    const heroContent = [
      { key: 'badge', value: 'AI-Powered Mental Health Platform', type: 'text' },
      { key: 'title', value: 'Transform Mental Healthcare', type: 'text' },
      { key: 'subtitle', value: 'With ANTSA', type: 'text' },
      { key: 'description', value: '24/7 AI mental health assistant support, automated transcription, and seamless video sessions. Reduce admin time by 80% while enhancing client care.', type: 'text' },
      { key: 'cta_primary', value: 'Start Free Trial', type: 'text' },
      { key: 'cta_secondary', value: 'Watch Demo', type: 'text' },
      { key: 'stats', value: JSON.stringify([
        { value: '500+', label: 'Clinicians' },
        { value: '10K+', label: 'Clients' },
        { value: '80%', label: 'Time Saved' },
      ]), type: 'json' },
    ];

    const contentStmt = db.prepare(`
      INSERT INTO content (section_id, key, value, type)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(section_id, key) DO NOTHING
    `);

    heroContent.forEach(item => {
      contentStmt.run(heroId, item.key, item.value, item.type);
    });

    console.log('✅ Seeded hero content');

    // Seed features
    const featuresId = getSectionId('features');
    const featureContent = [
      { key: 'badge', value: '✨ Platform Features', type: 'text' },
      { key: 'title', value: 'Powerful Features for Modern Mental Health Practice', type: 'text' },
      { key: 'subtitle', value: 'Everything you need to provide exceptional care while reducing administrative burden by up to 80%', type: 'text' },
    ];

    featureContent.forEach(item => {
      contentStmt.run(featuresId, item.key, item.value, item.type);
    });

    const features = [
      {
        title: 'jAImee',
        description: "The world's first clinician-overseen mental health assistant chatbot. Available 24/7 to support clients between sessions with evidence-based conversations.",
        icon: 'RobotOutlined',
        color: '#48abe2',
        gradient: 'linear-gradient(135deg, #48abe2 0%, #2196f3 100%)',
        order_index: 1,
      },
      {
        title: 'AI Scribe',
        description: 'Transcribes sessions and generates comprehensive summaries, saving hours of paperwork. Focus on your clients while AI handles the documentation.',
        icon: 'FileTextOutlined',
        color: '#10b981',
        gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        order_index: 2,
      },
      {
        title: 'kAI',
        description: 'An upcoming AI assistant that supports practitioners with real-time insights during sessions, helping deliver better therapeutic outcomes.',
        icon: 'ThunderboltOutlined',
        color: '#f59e0b',
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        order_index: 3,
      },
      {
        title: 'Practitioner Dashboard',
        description: 'Comprehensive dashboard with client insights, real-time mood tracking, and detailed reports to monitor progress and outcomes.',
        icon: 'DashboardOutlined',
        color: '#8b5cf6',
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
        order_index: 4,
      },
      {
        title: 'Client Tools',
        description: 'Empower clients with mood tracking, journaling, homework resources, and direct access to jAImee for continuous support.',
        icon: 'SmileOutlined',
        color: '#ec4899',
        gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
        order_index: 5,
      },
      {
        title: 'Homework Resources',
        description: 'Unlimited homework tasks and reminders to keep clients engaged and progressing between sessions.',
        icon: 'BookOutlined',
        color: '#06b6d4',
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
        order_index: 6,
      },
    ];

    const featureStmt = db.prepare(`
      INSERT INTO feature_items (section_id, title, description, icon, color, gradient, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT DO NOTHING
    `);

    features.forEach(feature => {
      featureStmt.run(
        featuresId,
        feature.title,
        feature.description,
        feature.icon,
        feature.color,
        feature.gradient,
        feature.order_index
      );
    });

    console.log('✅ Seeded features');

    // Seed contact content
    const contactId = getSectionId('contact');
    const contactContent = [
      { key: 'title', value: 'Get in Touch', type: 'text' },
      { key: 'subtitle', value: "We'd love to hear from you. Send us a message and we'll respond as soon as possible.", type: 'text' },
      { key: 'email', value: 'hello@antsa.com.au', type: 'text' },
      { key: 'phone', value: '+61 XXX XXX XXX', type: 'text' },
    ];

    contactContent.forEach(item => {
      contentStmt.run(contactId, item.key, item.value, item.type);
    });

    console.log('✅ Seeded contact content');

    // Seed footer content
    const footerId = getSectionId('footer');
    const footerContent = [
      { key: 'copyright', value: '© 2024 ANTSA. All rights reserved.', type: 'text' },
      { key: 'description', value: 'Transforming mental healthcare with AI-powered solutions.', type: 'text' },
    ];

    footerContent.forEach(item => {
      contentStmt.run(footerId, item.key, item.value, item.type);
    });

    console.log('✅ Seeded footer content');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Start the backend server: npm run dev');
    console.log('   2. Login with the admin credentials above');
    console.log('   3. Change the default password immediately!');
    console.log('   4. Start customizing your content through the admin panel');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();

