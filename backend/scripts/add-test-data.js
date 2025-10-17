import db from '../config/database.js';

console.log('🌱 Adding test data...');

try {
  // Get section IDs
  const teamSection = db.prepare('SELECT id FROM sections WHERE name = ?').get('team');
  const testimonialsSection = db.prepare('SELECT id FROM sections WHERE name = ?').get('testimonials');

  // Add more team members
  const teamStmt = db.prepare(`
    INSERT INTO team_members (section_id, name, role, bio, order_index)
    VALUES (?, ?, ?, ?, ?)
  `);

  const teamMembers = [
    {
      name: 'Dr. Michael Chen',
      role: 'Chief Technology Officer',
      bio: 'Former tech lead at Google Health. Passionate about using AI to improve mental healthcare accessibility.',
      order_index: 2
    },
    {
      name: 'Emma Williams',
      role: 'Head of Clinical Operations',
      bio: 'Licensed clinical psychologist with 12+ years experience. Ensures ANTSA meets the highest clinical standards.',
      order_index: 3
    },
    {
      name: 'James Rodriguez',
      role: 'Lead AI Engineer',
      bio: 'PhD in Machine Learning from MIT. Specializes in natural language processing and conversational AI.',
      order_index: 4
    }
  ];

  teamMembers.forEach(member => {
    teamStmt.run(teamSection.id, member.name, member.role, member.bio, member.order_index);
  });

  console.log('✅ Added team members');

  // Add testimonials
  const testimonialStmt = db.prepare(`
    INSERT INTO testimonials (section_id, name, role, content, rating, order_index)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Clinical Psychologist',
      content: 'ANTSA has transformed my practice. The AI assistant helps my clients stay engaged between sessions, and the automated transcription saves me hours every week.',
      rating: 5,
      order_index: 1
    },
    {
      name: 'Dr. Mark Thompson',
      role: 'Psychiatrist',
      content: 'The insights from jAImee conversations give me valuable context before sessions. It\'s like having an extra set of eyes on client wellbeing 24/7.',
      rating: 5,
      order_index: 2
    },
    {
      name: 'Lisa Martinez',
      role: 'Counselor',
      content: 'My clients love having access to jAImee between our sessions. They feel more supported, and I can see the positive impact in their progress.',
      rating: 5,
      order_index: 3
    },
    {
      name: 'Dr. David Lee',
      role: 'Clinical Social Worker',
      content: 'The AI scribe feature is a game-changer. I spend 80% less time on documentation and more time actually helping people. Worth every penny.',
      rating: 5,
      order_index: 4
    }
  ];

  testimonials.forEach(testimonial => {
    testimonialStmt.run(
      testimonialsSection.id,
      testimonial.name,
      testimonial.role,
      testimonial.content,
      testimonial.rating,
      testimonial.order_index
    );
  });

  console.log('✅ Added testimonials');
  console.log('🎉 Test data added successfully!');

} catch (error) {
  console.error('❌ Error adding test data:', error);
  process.exit(1);
}

