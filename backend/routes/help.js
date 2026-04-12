import express from 'express';
import { body, validationResult } from 'express-validator';
import db from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// ─── Public: Get full help centre tree ───────────────────────────────────────
router.get('/', (req, res) => {
  try {
    const categories = db.prepare(
      'SELECT * FROM help_categories WHERE parent_id IS NULL ORDER BY order_index'
    ).all();

    const subCatStmt = db.prepare(
      'SELECT * FROM help_categories WHERE parent_id = ? ORDER BY order_index'
    );
    const articlesStmt = db.prepare(
      'SELECT * FROM help_articles WHERE category_id = ? ORDER BY order_index'
    );

    const tree = categories.map((cat) => {
      const subcategories = subCatStmt.all(cat.id).map((sub) => ({
        ...sub,
        articles: articlesStmt.all(sub.id),
      }));

      return {
        ...cat,
        articles: articlesStmt.all(cat.id),
        subcategories,
      };
    });

    res.json({ categories: tree });
  } catch (error) {
    console.error('Get help centre error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Admin: List all categories flat (for editor dropdowns) ──────────────────
router.get('/categories', authenticateToken, (req, res) => {
  try {
    const categories = db.prepare(
      'SELECT * FROM help_categories ORDER BY parent_id IS NOT NULL, parent_id, order_index'
    ).all();
    res.json({ categories });
  } catch (error) {
    console.error('Get help categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Admin: Create category ──────────────────────────────────────────────────
router.post('/categories',
  authenticateToken,
  body('name').notEmpty().withMessage('Name is required'),
  body('slug').notEmpty().withMessage('Slug is required'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { name, slug, description, icon, parent_id, order_index } = req.body;
      const result = db.prepare(
        'INSERT INTO help_categories (name, slug, description, icon, parent_id, order_index) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(name, slug, description || null, icon || null, parent_id || null, order_index || 0);

      const category = db.prepare('SELECT * FROM help_categories WHERE id = ?').get(result.lastInsertRowid);
      res.status(201).json({ category });
    } catch (error) {
      console.error('Create help category error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// ─── Admin: Update category ──────────────────────────────────────────────────
router.put('/categories/:id', authenticateToken, (req, res) => {
  try {
    const { name, slug, description, icon, parent_id, order_index } = req.body;
    db.prepare(
      'UPDATE help_categories SET name = ?, slug = ?, description = ?, icon = ?, parent_id = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).run(name, slug, description || null, icon || null, parent_id || null, order_index || 0, req.params.id);

    const category = db.prepare('SELECT * FROM help_categories WHERE id = ?').get(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json({ category });
  } catch (error) {
    console.error('Update help category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Admin: Delete category ──────────────────────────────────────────────────
router.delete('/categories/:id', authenticateToken, (req, res) => {
  try {
    const result = db.prepare('DELETE FROM help_categories WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Category not found' });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete help category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Admin: List all articles ────────────────────────────────────────────────
router.get('/articles', authenticateToken, (req, res) => {
  try {
    const articles = db.prepare(
      `SELECT a.*, c.name as category_name
       FROM help_articles a
       JOIN help_categories c ON a.category_id = c.id
       ORDER BY a.category_id, a.order_index`
    ).all();
    res.json({ articles });
  } catch (error) {
    console.error('Get help articles error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Admin: Create article ───────────────────────────────────────────────────
router.post('/articles',
  authenticateToken,
  body('title').notEmpty().withMessage('Title is required'),
  body('category_id').isInt().withMessage('Category ID is required'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { category_id, title, content, order_index } = req.body;
      const result = db.prepare(
        'INSERT INTO help_articles (category_id, title, content, order_index) VALUES (?, ?, ?, ?)'
      ).run(category_id, title, content || '', order_index || 0);

      const article = db.prepare('SELECT * FROM help_articles WHERE id = ?').get(result.lastInsertRowid);
      res.status(201).json({ article });
    } catch (error) {
      console.error('Create help article error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// ─── Admin: Update article ───────────────────────────────────────────────────
router.put('/articles/:id', authenticateToken, (req, res) => {
  try {
    const { category_id, title, content, order_index } = req.body;
    db.prepare(
      'UPDATE help_articles SET category_id = ?, title = ?, content = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).run(category_id, title, content || '', order_index || 0, req.params.id);

    const article = db.prepare('SELECT * FROM help_articles WHERE id = ?').get(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json({ article });
  } catch (error) {
    console.error('Update help article error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Admin: Delete article ───────────────────────────────────────────────────
router.delete('/articles/:id', authenticateToken, (req, res) => {
  try {
    const result = db.prepare('DELETE FROM help_articles WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Article not found' });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete help article error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
