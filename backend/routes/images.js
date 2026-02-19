import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import db, { PERSISTENT_DIR } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Store uploads in persistent directory so they survive deployments
const uploadsDir = join(PERSISTENT_DIR, 'uploads');
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}
console.log(`📁 Uploads directory: ${uploadsDir}`);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = file.originalname.split('.').pop();
    cb(null, `image-${uniqueSuffix}.${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Upload image endpoint
router.post('/upload', authenticateToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { sectionName, key } = req.body;

    if (!sectionName || !key) {
      // Delete uploaded file if validation fails
      unlinkSync(req.file.path);
      return res.status(400).json({ error: 'sectionName and key are required' });
    }

    // Get section
    const sectionStmt = db.prepare('SELECT id FROM sections WHERE name = ?');
    const section = sectionStmt.get(sectionName);

    if (!section) {
      unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Section not found' });
    }

    // Check if image already exists for this section+key
    const existingStmt = db.prepare('SELECT * FROM images WHERE section_id = ? AND key = ?');
    const existing = existingStmt.get(section.id, key);

    if (existing) {
      // Delete old file
      try {
        unlinkSync(join(PERSISTENT_DIR, existing.path));
      } catch (e) {
        console.error('Error deleting old file:', e);
      }

      // Update database record
      const updateStmt = db.prepare(`
        UPDATE images
        SET filename = ?, original_name = ?, mime_type = ?, size = ?, path = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      updateStmt.run(
        req.file.filename,
        req.file.originalname,
        req.file.mimetype,
        req.file.size,
        `uploads/${req.file.filename}`,
        existing.id
      );

      res.json({
        id: existing.id,
        filename: req.file.filename,
        path: `/api/images/${req.file.filename}`,
        message: 'Image updated successfully'
      });
    } else {
      // Insert new image record
      const insertStmt = db.prepare(`
        INSERT INTO images (section_id, key, filename, original_name, mime_type, size, path)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      const result = insertStmt.run(
        section.id,
        key,
        req.file.filename,
        req.file.originalname,
        req.file.mimetype,
        req.file.size,
        `uploads/${req.file.filename}`
      );

      res.json({
        id: result.lastInsertRowid,
        filename: req.file.filename,
        path: `/api/images/${req.file.filename}`,
        message: 'Image uploaded successfully'
      });
    }
  } catch (error) {
    console.error('Upload image error:', error);
    // Clean up uploaded file on error
    if (req.file) {
      try {
        unlinkSync(req.file.path);
      } catch (e) {
        console.error('Error cleaning up file:', e);
      }
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get image by filename (public)
router.get('/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filepath = join(uploadsDir, filename);

    if (!existsSync(filepath)) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.sendFile(filepath);
  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// List all images (protected)
router.get('/', authenticateToken, (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT i.*, s.name as section_name
      FROM images i
      LEFT JOIN sections s ON i.section_id = s.id
      ORDER BY i.created_at DESC
    `);
    const images = stmt.all();

    res.json(images.map(img => ({
      ...img,
      url: `/api/images/${img.filename}`
    })));
  } catch (error) {
    console.error('List images error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete image (protected)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;

    // Get image record
    const stmt = db.prepare('SELECT * FROM images WHERE id = ?');
    const image = stmt.get(id);

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete file
    try {
      const filepath = join(PERSISTENT_DIR, image.path);
      if (existsSync(filepath)) {
        unlinkSync(filepath);
      }
    } catch (e) {
      console.error('Error deleting file:', e);
    }

    // Delete database record
    const deleteStmt = db.prepare('DELETE FROM images WHERE id = ?');
    deleteStmt.run(id);

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

