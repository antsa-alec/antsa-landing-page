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

// ===== FOOTER LINKS ROUTES =====

// Get all footer links (public)
router.get('/footer-links', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM footer_links ORDER BY order_index');
    const links = stmt.all();
    res.json({ links });
  } catch (error) {
    console.error('Get footer links error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create footer link (protected)
router.post('/footer-links', [
  authenticateToken,
  body('label').notEmpty().withMessage('Label is required'),
  body('url').notEmpty().withMessage('URL is required'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { label, url, order_index = 0 } = req.body;

    const stmt = db.prepare(`
      INSERT INTO footer_links (label, url, order_index)
      VALUES (?, ?, ?)
    `);

    const result = stmt.run(label, url, order_index);
    
    res.json({
      message: 'Footer link created successfully',
      link: {
        id: result.lastInsertRowid,
        label,
        url,
        order_index,
      }
    });
  } catch (error) {
    console.error('Create footer link error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update footer link (protected)
router.put('/footer-links/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { label, url, order_index = 0 } = req.body;

    const stmt = db.prepare(`
      UPDATE footer_links
      SET label = ?, url = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(label, url, order_index, id);
    
    res.json({ message: 'Footer link updated successfully' });
  } catch (error) {
    console.error('Update footer link error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete footer link (protected)
router.delete('/footer-links/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;

    const stmt = db.prepare('DELETE FROM footer_links WHERE id = ?');
    stmt.run(id);

    res.json({ message: 'Footer link deleted successfully' });
  } catch (error) {
    console.error('Delete footer link error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== SOCIAL LINKS ROUTES =====

// Get all social links (public)
router.get('/social-links', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM social_links ORDER BY order_index');
    const links = stmt.all();
    res.json({ links });
  } catch (error) {
    console.error('Get social links error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create social link (protected)
router.post('/social-links', [
  authenticateToken,
  body('platform').notEmpty().withMessage('Platform is required'),
  body('url').notEmpty().withMessage('URL is required'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { platform, url, order_index = 0 } = req.body;

    // Check if platform already exists (only one per platform)
    const existingStmt = db.prepare('SELECT * FROM social_links WHERE platform = ?');
    const existing = existingStmt.get(platform);

    if (existing) {
      return res.status(400).json({ error: 'A link for this platform already exists. Please edit or delete the existing one.' });
    }

    const stmt = db.prepare(`
      INSERT INTO social_links (platform, url, order_index)
      VALUES (?, ?, ?)
    `);

    const result = stmt.run(platform, url, order_index);
    
    res.json({
      message: 'Social link created successfully',
      link: {
        id: result.lastInsertRowid,
        platform,
        url,
        order_index,
      }
    });
  } catch (error) {
    console.error('Create social link error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update social link (protected)
router.put('/social-links/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { platform, url, order_index = 0 } = req.body;

    // Check if platform already exists for a different link
    const existingStmt = db.prepare('SELECT * FROM social_links WHERE platform = ? AND id != ?');
    const existing = existingStmt.get(platform, id);

    if (existing) {
      return res.status(400).json({ error: 'A link for this platform already exists.' });
    }

    const stmt = db.prepare(`
      UPDATE social_links
      SET platform = ?, url = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(platform, url, order_index, id);
    
    res.json({ message: 'Social link updated successfully' });
  } catch (error) {
    console.error('Update social link error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete social link (protected)
router.delete('/social-links/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;

    const stmt = db.prepare('DELETE FROM social_links WHERE id = ?');
    stmt.run(id);

    res.json({ message: 'Social link deleted successfully' });
  } catch (error) {
    console.error('Delete social link error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== TEAM MEMBER SOCIALS ROUTES =====

// Get social links for a team member (public)
router.get('/team/:teamMemberId/socials', (req, res) => {
  try {
    const { teamMemberId } = req.params;
    const stmt = db.prepare('SELECT * FROM team_member_socials WHERE team_member_id = ? ORDER BY order_index');
    const socials = stmt.all(teamMemberId);
    res.json({ socials });
  } catch (error) {
    console.error('Get team member socials error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add social link to team member (protected)
router.post('/team/:teamMemberId/socials', [
  authenticateToken,
  body('platform').notEmpty().withMessage('Platform is required'),
  body('url').notEmpty().withMessage('URL is required'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { teamMemberId } = req.params;
    const { platform, url, order_index = 0 } = req.body;

    // Check if platform already exists for this team member
    const existingStmt = db.prepare('SELECT * FROM team_member_socials WHERE team_member_id = ? AND platform = ?');
    const existing = existingStmt.get(teamMemberId, platform);

    if (existing) {
      return res.status(400).json({ error: 'A link for this platform already exists for this team member.' });
    }

    const stmt = db.prepare(`
      INSERT INTO team_member_socials (team_member_id, platform, url, order_index)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(teamMemberId, platform, url, order_index);
    
    res.json({
      message: 'Social link created successfully',
      social: {
        id: result.lastInsertRowid,
        team_member_id: teamMemberId,
        platform,
        url,
        order_index,
      }
    });
  } catch (error) {
    console.error('Create team member social error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update team member social link (protected)
router.put('/team/:teamMemberId/socials/:id', authenticateToken, (req, res) => {
  try {
    const { teamMemberId, id } = req.params;
    const { platform, url, order_index = 0 } = req.body;

    // Check if platform already exists for a different social link of this team member
    const existingStmt = db.prepare('SELECT * FROM team_member_socials WHERE team_member_id = ? AND platform = ? AND id != ?');
    const existing = existingStmt.get(teamMemberId, platform, id);

    if (existing) {
      return res.status(400).json({ error: 'A link for this platform already exists for this team member.' });
    }

    const stmt = db.prepare(`
      UPDATE team_member_socials
      SET platform = ?, url = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND team_member_id = ?
    `);

    stmt.run(platform, url, order_index, id, teamMemberId);
    
    res.json({ message: 'Social link updated successfully' });
  } catch (error) {
    console.error('Update team member social error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete team member social link (protected)
router.delete('/team/:teamMemberId/socials/:id', authenticateToken, (req, res) => {
  try {
    const { teamMemberId, id } = req.params;

    const stmt = db.prepare('DELETE FROM team_member_socials WHERE id = ? AND team_member_id = ?');
    stmt.run(id, teamMemberId);

    res.json({ message: 'Social link deleted successfully' });
  } catch (error) {
    console.error('Delete team member social error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== NAVIGATION ITEMS ROUTES =====

// Get all navigation items (public)
router.get('/nav-items', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM nav_items ORDER BY order_index');
    const items = stmt.all();
    
    // Build hierarchical structure (items with children)
    const topLevel = items.filter(item => !item.parent_id);
    const withChildren = topLevel.map(item => ({
      ...item,
      children: items.filter(child => child.parent_id === item.id)
    }));
    
    res.json({ items: withChildren });
  } catch (error) {
    console.error('Get nav items error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create navigation item (protected)
router.post('/nav-items', [
  authenticateToken,
  body('label').notEmpty().withMessage('Label is required'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { label, url, order_index = 0, parent_id = null, is_cta = 0, cta_style = 'default' } = req.body;

    const stmt = db.prepare(`
      INSERT INTO nav_items (label, url, order_index, parent_id, is_cta, cta_style)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(label, url, order_index, parent_id, is_cta ? 1 : 0, cta_style);
    
    res.json({
      message: 'Navigation item created successfully',
      item: {
        id: result.lastInsertRowid,
        label,
        url,
        order_index,
        parent_id,
        is_cta,
        cta_style,
      }
    });
  } catch (error) {
    console.error('Create nav item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bulk update navigation items order (protected) - MUST be before :id route
router.put('/nav-items/reorder', authenticateToken, (req, res) => {
  try {
    const { items } = req.body;

    const updateStmt = db.prepare(`
      UPDATE nav_items SET order_index = ?, parent_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `);

    const updateTransaction = db.transaction((navItems) => {
      navItems.forEach(({ id, order_index, parent_id }) => {
        updateStmt.run(order_index, parent_id, id);
      });
    });

    updateTransaction(items);
    
    res.json({ message: 'Navigation items reordered successfully' });
  } catch (error) {
    console.error('Reorder nav items error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update navigation item (protected)
router.put('/nav-items/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { label, url, order_index = 0, parent_id = null, is_cta = 0, cta_style = 'default' } = req.body;

    const stmt = db.prepare(`
      UPDATE nav_items
      SET label = ?, url = ?, order_index = ?, parent_id = ?, is_cta = ?, cta_style = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(label, url, order_index, parent_id, is_cta ? 1 : 0, cta_style, id);
    
    res.json({ message: 'Navigation item updated successfully' });
  } catch (error) {
    console.error('Update nav item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete navigation item (protected)
router.delete('/nav-items/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;

    // This will also delete children due to ON DELETE CASCADE
    const stmt = db.prepare('DELETE FROM nav_items WHERE id = ?');
    stmt.run(id);

    res.json({ message: 'Navigation item deleted successfully' });
  } catch (error) {
    console.error('Delete nav item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== SPONSORS ROUTES =====

// Get all sponsors (public)
router.get('/sponsors', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM sponsors ORDER BY order_index');
    const sponsors = stmt.all();
    
    // Also get sponsors section content
    const sectionStmt = db.prepare('SELECT id FROM sections WHERE name = ?');
    const section = sectionStmt.get('sponsors');
    
    let sectionContent = {};
    if (section) {
      const contentStmt = db.prepare('SELECT key, value FROM content WHERE section_id = ?');
      const contentRows = contentStmt.all(section.id);
      contentRows.forEach(row => {
        sectionContent[row.key] = row.value;
      });
    }
    
    res.json({ sponsors, sectionContent });
  } catch (error) {
    console.error('Get sponsors error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create sponsor (protected)
router.post('/sponsors', [
  authenticateToken,
  body('name').notEmpty().withMessage('Name is required'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, logo_url, website_url, order_index = 0 } = req.body;

    const stmt = db.prepare(`
      INSERT INTO sponsors (name, logo_url, website_url, order_index)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(name, logo_url || null, website_url || null, order_index);
    
    res.json({
      message: 'Sponsor created successfully',
      sponsor: {
        id: result.lastInsertRowid,
        name,
        logo_url,
        website_url,
        order_index,
      }
    });
  } catch (error) {
    console.error('Create sponsor error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update sponsors section content (protected) - MUST be before :id route
router.put('/sponsors/section-content', authenticateToken, (req, res) => {
  try {
    const { title, subtitle } = req.body;
    
    const sectionStmt = db.prepare('SELECT id FROM sections WHERE name = ?');
    const section = sectionStmt.get('sponsors');
    
    if (!section) {
      return res.status(404).json({ error: 'Sponsors section not found' });
    }

    const updateStmt = db.prepare(`
      INSERT INTO content (section_id, key, value, type, updated_at)
      VALUES (?, ?, ?, 'text', CURRENT_TIMESTAMP)
      ON CONFLICT(section_id, key) DO UPDATE SET
        value = excluded.value,
        updated_at = CURRENT_TIMESTAMP
    `);

    if (title !== undefined) updateStmt.run(section.id, 'title', title);
    if (subtitle !== undefined) updateStmt.run(section.id, 'subtitle', subtitle);
    
    res.json({ message: 'Sponsors section content updated successfully' });
  } catch (error) {
    console.error('Update sponsors section content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update sponsor (protected)
router.put('/sponsors/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { name, logo_url, website_url, order_index = 0 } = req.body;

    const stmt = db.prepare(`
      UPDATE sponsors
      SET name = ?, logo_url = ?, website_url = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(name, logo_url || null, website_url || null, order_index, id);
    
    res.json({ message: 'Sponsor updated successfully' });
  } catch (error) {
    console.error('Update sponsor error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete sponsor (protected)
router.delete('/sponsors/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;

    const stmt = db.prepare('DELETE FROM sponsors WHERE id = ?');
    stmt.run(id);

    res.json({ message: 'Sponsor deleted successfully' });
  } catch (error) {
    console.error('Delete sponsor error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== FAQ ROUTES =====

// Get all FAQ items (public)
router.get('/faq', (req, res) => {
  try {
    const sectionStmt = db.prepare('SELECT id FROM sections WHERE name = ?');
    const section = sectionStmt.get('faq');
    
    if (!section) {
      return res.json({ items: [], sectionContent: {} });
    }

    const itemsStmt = db.prepare('SELECT * FROM faq_items WHERE section_id = ? ORDER BY order_index');
    const items = itemsStmt.all(section.id);
    
    // Get FAQ section content
    const contentStmt = db.prepare('SELECT key, value FROM content WHERE section_id = ?');
    const contentRows = contentStmt.all(section.id);
    const sectionContent = {};
    contentRows.forEach(row => {
      sectionContent[row.key] = row.value;
    });
    
    res.json({ items, sectionContent });
  } catch (error) {
    console.error('Get FAQ items error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create FAQ item (protected)
router.post('/faq', [
  authenticateToken,
  body('question').notEmpty().withMessage('Question is required'),
  body('answer').notEmpty().withMessage('Answer is required'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const sectionStmt = db.prepare('SELECT id FROM sections WHERE name = ?');
    const section = sectionStmt.get('faq');
    
    if (!section) {
      return res.status(404).json({ error: 'FAQ section not found' });
    }

    const { question, answer, order_index = 0 } = req.body;

    const stmt = db.prepare(`
      INSERT INTO faq_items (section_id, question, answer, order_index)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(section.id, question, answer, order_index);
    
    res.json({
      message: 'FAQ item created successfully',
      item: {
        id: result.lastInsertRowid,
        section_id: section.id,
        question,
        answer,
        order_index,
      }
    });
  } catch (error) {
    console.error('Create FAQ item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update FAQ section content (protected) - MUST be before :id route
router.put('/faq/section-content', authenticateToken, (req, res) => {
  try {
    const { title, subtitle } = req.body;
    
    const sectionStmt = db.prepare('SELECT id FROM sections WHERE name = ?');
    const section = sectionStmt.get('faq');
    
    if (!section) {
      return res.status(404).json({ error: 'FAQ section not found' });
    }

    const updateStmt = db.prepare(`
      INSERT INTO content (section_id, key, value, type, updated_at)
      VALUES (?, ?, ?, 'text', CURRENT_TIMESTAMP)
      ON CONFLICT(section_id, key) DO UPDATE SET
        value = excluded.value,
        updated_at = CURRENT_TIMESTAMP
    `);

    if (title !== undefined) updateStmt.run(section.id, 'title', title);
    if (subtitle !== undefined) updateStmt.run(section.id, 'subtitle', subtitle);
    
    res.json({ message: 'FAQ section content updated successfully' });
  } catch (error) {
    console.error('Update FAQ section content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update FAQ item (protected)
router.put('/faq/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, order_index = 0 } = req.body;

    const stmt = db.prepare(`
      UPDATE faq_items
      SET question = ?, answer = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(question, answer, order_index, id);
    
    res.json({ message: 'FAQ item updated successfully' });
  } catch (error) {
    console.error('Update FAQ item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete FAQ item (protected)
router.delete('/faq/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;

    const stmt = db.prepare('DELETE FROM faq_items WHERE id = ?');
    stmt.run(id);

    res.json({ message: 'FAQ item deleted successfully' });
  } catch (error) {
    console.error('Delete FAQ item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== FOOTER CATEGORIES ROUTES =====

// Get all footer categories with links (public)
router.get('/footer-categories', (req, res) => {
  try {
    const categoriesStmt = db.prepare('SELECT * FROM footer_categories ORDER BY order_index');
    const categories = categoriesStmt.all();
    
    // Get links for each category
    const linksStmt = db.prepare('SELECT * FROM footer_links WHERE category_id = ? ORDER BY order_index');
    
    const categoriesWithLinks = categories.map(cat => ({
      ...cat,
      links: linksStmt.all(cat.id)
    }));
    
    // Also get uncategorized links
    const uncategorizedStmt = db.prepare('SELECT * FROM footer_links WHERE category_id IS NULL ORDER BY order_index');
    const uncategorizedLinks = uncategorizedStmt.all();
    
    res.json({ categories: categoriesWithLinks, uncategorizedLinks });
  } catch (error) {
    console.error('Get footer categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create footer category (protected)
router.post('/footer-categories', [
  authenticateToken,
  body('title').notEmpty().withMessage('Title is required'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, order_index = 0 } = req.body;

    const stmt = db.prepare(`
      INSERT INTO footer_categories (title, order_index)
      VALUES (?, ?)
    `);

    const result = stmt.run(title, order_index);
    
    res.json({
      message: 'Footer category created successfully',
      category: {
        id: result.lastInsertRowid,
        title,
        order_index,
      }
    });
  } catch (error) {
    console.error('Create footer category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update footer category (protected)
router.put('/footer-categories/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { title, order_index = 0 } = req.body;

    const stmt = db.prepare(`
      UPDATE footer_categories
      SET title = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(title, order_index, id);
    
    res.json({ message: 'Footer category updated successfully' });
  } catch (error) {
    console.error('Update footer category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete footer category (protected)
router.delete('/footer-categories/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;

    // Set category_id to NULL for links in this category
    db.prepare('UPDATE footer_links SET category_id = NULL WHERE category_id = ?').run(id);
    
    const stmt = db.prepare('DELETE FROM footer_categories WHERE id = ?');
    stmt.run(id);

    res.json({ message: 'Footer category deleted successfully' });
  } catch (error) {
    console.error('Delete footer category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update footer link category (protected)
router.put('/footer-links/:id/category', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { category_id } = req.body;

    const stmt = db.prepare(`
      UPDATE footer_links
      SET category_id = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(category_id || null, id);
    
    res.json({ message: 'Footer link category updated successfully' });
  } catch (error) {
    console.error('Update footer link category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

