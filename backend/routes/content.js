import express from 'express';
import { body, validationResult } from 'express-validator';
import db from '../config/database.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all content (public)
router.get('/', optionalAuth, (req, res) => {
  try {
    // Get all sections
    const sectionsStmt = db.prepare('SELECT * FROM sections WHERE enabled = 1 ORDER BY order_index');
    const sections = sectionsStmt.all();

    // Get content for each section
    const contentStmt = db.prepare('SELECT * FROM content WHERE section_id = ?');
    const featuresStmt = db.prepare('SELECT * FROM feature_items WHERE section_id = ? ORDER BY order_index');
    const pricingStmt = db.prepare('SELECT * FROM pricing_plans WHERE section_id = ? ORDER BY order_index');
    const testimonialsStmt = db.prepare('SELECT * FROM testimonials WHERE section_id = ? ORDER BY order_index');
    const teamStmt = db.prepare('SELECT * FROM team_members WHERE section_id = ? ORDER BY order_index');

    const result = sections.map(section => {
      const content = {};
      const contentRows = contentStmt.all(section.id);
      
      contentRows.forEach(row => {
        try {
          content[row.key] = row.type === 'json' ? JSON.parse(row.value) : row.value;
        } catch (e) {
          content[row.key] = row.value;
        }
      });

      // Add specific section data
      if (section.name === 'features') {
        content.items = featuresStmt.all(section.id);
      } else if (section.name === 'pricing') {
        const plans = pricingStmt.all(section.id);
        content.plans = plans.map(plan => ({
          ...plan,
          features: plan.features ? JSON.parse(plan.features) : []
        }));
      } else if (section.name === 'testimonials') {
        content.items = testimonialsStmt.all(section.id);
      } else if (section.name === 'team') {
        content.members = teamStmt.all(section.id);
      }

      return {
        ...section,
        content,
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get content by section (public)
router.get('/section/:sectionName', (req, res) => {
  try {
    const { sectionName } = req.params;

    // Get section
    const sectionStmt = db.prepare('SELECT * FROM sections WHERE name = ?');
    const section = sectionStmt.get(sectionName);

    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }

    // Get content
    const contentStmt = db.prepare('SELECT * FROM content WHERE section_id = ?');
    const contentRows = contentStmt.all(section.id);

    const content = {};
    contentRows.forEach(row => {
      try {
        content[row.key] = row.type === 'json' ? JSON.parse(row.value) : row.value;
      } catch (e) {
        content[row.key] = row.value;
      }
    });

    // Add specific section data
    if (section.name === 'features') {
      const featuresStmt = db.prepare('SELECT * FROM feature_items WHERE section_id = ? ORDER BY order_index');
      content.items = featuresStmt.all(section.id);
    } else if (section.name === 'pricing') {
      const pricingStmt = db.prepare('SELECT * FROM pricing_plans WHERE section_id = ? ORDER BY order_index');
      const plans = pricingStmt.all(section.id);
      content.plans = plans.map(plan => ({
        ...plan,
        features: plan.features ? JSON.parse(plan.features) : []
      }));
    } else if (section.name === 'testimonials') {
      const testimonialsStmt = db.prepare('SELECT * FROM testimonials WHERE section_id = ? ORDER BY order_index');
      content.items = testimonialsStmt.all(section.id);
    } else if (section.name === 'team') {
      const teamStmt = db.prepare('SELECT * FROM team_members WHERE section_id = ? ORDER BY order_index');
      content.members = teamStmt.all(section.id);
    }

    res.json({
      ...section,
      content,
    });
  } catch (error) {
    console.error('Get section content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update content (protected)
router.put('/section/:sectionName', [
  authenticateToken,
  body('content').isObject().withMessage('Content must be an object'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { sectionName } = req.params;
    const { content } = req.body;

    // Get section
    const sectionStmt = db.prepare('SELECT * FROM sections WHERE name = ?');
    const section = sectionStmt.get(sectionName);

    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }

    // Update content in transaction
    const updateContentStmt = db.prepare(`
      INSERT INTO content (section_id, key, value, type, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(section_id, key) DO UPDATE SET
        value = excluded.value,
        type = excluded.type,
        updated_at = CURRENT_TIMESTAMP
    `);

    const updateTransaction = db.transaction((entries) => {
      entries.forEach(([key, value]) => {
        const type = typeof value === 'object' ? 'json' : 'text';
        const valueStr = type === 'json' ? JSON.stringify(value) : String(value);
        updateContentStmt.run(section.id, key, valueStr, type);
      });
    });

    updateTransaction(Object.entries(content));

    res.json({ message: 'Content updated successfully' });
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Feature items endpoints
router.post('/features', [
  authenticateToken,
  body('title').notEmpty(),
  body('description').notEmpty(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const sectionStmt = db.prepare('SELECT id FROM sections WHERE name = ?');
    const section = sectionStmt.get('features');

    const stmt = db.prepare(`
      INSERT INTO feature_items (section_id, title, description, icon, color, gradient, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const { title, description, icon, color, gradient, order_index = 0 } = req.body;
    const result = stmt.run(section.id, title, description, icon, color, gradient, order_index);

    res.json({ id: result.lastInsertRowid, message: 'Feature created successfully' });
  } catch (error) {
    console.error('Create feature error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/features/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, icon, color, gradient, order_index } = req.body;

    const stmt = db.prepare(`
      UPDATE feature_items
      SET title = ?, description = ?, icon = ?, color = ?, gradient = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(title, description, icon, color, gradient, order_index, id);
    res.json({ message: 'Feature updated successfully' });
  } catch (error) {
    console.error('Update feature error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/features/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM feature_items WHERE id = ?');
    stmt.run(id);
    res.json({ message: 'Feature deleted successfully' });
  } catch (error) {
    console.error('Delete feature error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Pricing plans endpoints
router.post('/pricing', [
  authenticateToken,
  body('name').notEmpty(),
  body('price').notEmpty(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const sectionStmt = db.prepare('SELECT id FROM sections WHERE name = ?');
    const section = sectionStmt.get('pricing');

    const stmt = db.prepare(`
      INSERT INTO pricing_plans (section_id, name, price, period, featured, features, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const { name, price, period, featured = 0, features = [], order_index = 0 } = req.body;
    const result = stmt.run(
      section.id,
      name,
      price,
      period,
      featured ? 1 : 0,
      JSON.stringify(features),
      order_index
    );

    res.json({ id: result.lastInsertRowid, message: 'Pricing plan created successfully' });
  } catch (error) {
    console.error('Create pricing plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/pricing/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, period, featured, features, order_index } = req.body;

    const stmt = db.prepare(`
      UPDATE pricing_plans
      SET name = ?, price = ?, period = ?, featured = ?, features = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(name, price, period, featured ? 1 : 0, JSON.stringify(features), order_index, id);
    res.json({ message: 'Pricing plan updated successfully' });
  } catch (error) {
    console.error('Update pricing plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/pricing/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM pricing_plans WHERE id = ?');
    stmt.run(id);
    res.json({ message: 'Pricing plan deleted successfully' });
  } catch (error) {
    console.error('Delete pricing plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Testimonials endpoints
router.post('/testimonials', [
  authenticateToken,
  body('name').notEmpty(),
  body('content').notEmpty(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const sectionStmt = db.prepare('SELECT id FROM sections WHERE name = ?');
    const section = sectionStmt.get('testimonials');

    const stmt = db.prepare(`
      INSERT INTO testimonials (section_id, name, role, content, rating, order_index)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const { name, role, content, rating = 5, order_index = 0 } = req.body;
    const result = stmt.run(section.id, name, role, content, rating, order_index);

    res.json({ id: result.lastInsertRowid, message: 'Testimonial created successfully' });
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/testimonials/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, content, rating, order_index } = req.body;

    const stmt = db.prepare(`
      UPDATE testimonials
      SET name = ?, role = ?, content = ?, rating = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(name, role, content, rating, order_index, id);
    res.json({ message: 'Testimonial updated successfully' });
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/testimonials/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM testimonials WHERE id = ?');
    stmt.run(id);
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Team members endpoints
router.post('/team', [
  authenticateToken,
  body('name').notEmpty(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const sectionStmt = db.prepare('SELECT id FROM sections WHERE name = ?');
    const section = sectionStmt.get('team');

    const stmt = db.prepare(`
      INSERT INTO team_members (section_id, name, role, bio, image_url, order_index)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const { name, role, bio, image_url, order_index = 0 } = req.body;
    const result = stmt.run(section.id, name, role, bio, image_url || null, order_index);

    res.json({ id: result.lastInsertRowid, message: 'Team member created successfully' });
  } catch (error) {
    console.error('Create team member error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/team/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, bio, image_url, order_index } = req.body;

    const stmt = db.prepare(`
      UPDATE team_members
      SET name = ?, role = ?, bio = ?, image_url = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(name, role, bio, image_url || null, order_index, id);
    res.json({ message: 'Team member updated successfully' });
  } catch (error) {
    console.error('Update team member error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/team/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM team_members WHERE id = ?');
    stmt.run(id);
    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Delete team member error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

