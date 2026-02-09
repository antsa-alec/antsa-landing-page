import db from '../config/database.js';

console.log('Adding why-antsa section...');

try {
  // Check if section already exists
  const existingSection = db.prepare('SELECT * FROM sections WHERE name = ?').get('why-antsa');
  
  if (existingSection) {
    console.log('✅ why-antsa section already exists');
  } else {
    // Insert the section
    const insertSection = db.prepare(`
      INSERT INTO sections (name, enabled, order_index)
      VALUES (?, 1, 2)
    `);
    
    const result = insertSection.run('why-antsa');
    const sectionId = result.lastInsertRowid;
    
    console.log(`✅ Created why-antsa section with ID: ${sectionId}`);
    
    // Add default content
    const insertContent = db.prepare(`
      INSERT INTO content (section_id, key, value, type)
      VALUES (?, ?, ?, ?)
    `);
    
    insertContent.run(sectionId, 'title', 'Why ANTSA', 'text');
    insertContent.run(sectionId, 'subtitle', 'The trusted choice for mental health professionals', 'text');
    insertContent.run(sectionId, 'description', 'ANTSA is designed by clinicians, for clinicians. We understand the unique challenges of mental health practice and provide tools that enhance care while respecting professional autonomy.', 'text');
    
    // Add reasons as JSON
    const reasons = [
      {
        id: '1',
        title: 'Practitioner-Controlled',
        description: 'You maintain full control over client care. ANTSA provides tools that support your clinical judgment, not replace it.',
      },
      {
        id: '2',
        title: 'Evidence-Based',
        description: 'Built on proven therapeutic approaches and designed in consultation with mental health professionals.',
      },
      {
        id: '3',
        title: 'Secure & Compliant',
        description: 'HIPAA, GDPR, and Australian Privacy Principles compliant. Your data is encrypted and hosted securely.',
      },
      {
        id: '4',
        title: 'Seamless Integration',
        description: 'Fits naturally into your existing workflow without disrupting your practice or requiring extensive training.',
      },
    ];
    
    insertContent.run(sectionId, 'reasons', JSON.stringify(reasons), 'json');
    
    console.log('✅ Added default content to why-antsa section');
  }
  
  console.log('✅ Why ANTSA section setup complete!');
} catch (error) {
  console.error('❌ Error adding why-antsa section:', error);
  process.exit(1);
}
