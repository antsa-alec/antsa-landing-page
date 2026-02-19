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

// Store documents in persistent directory so they survive deployments
const documentsDir = join(PERSISTENT_DIR, 'uploads', 'documents');
if (!existsSync(documentsDir)) {
  mkdirSync(documentsDir, { recursive: true });
}

// Configure multer for document uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, documentsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = file.originalname.split('.').pop();
    cb(null, `document-${uniqueSuffix}.${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept PDF and common document formats
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, DOCX, and TXT files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Upload document endpoint
router.post('/upload', authenticateToken, upload.single('document'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { type } = req.body; // 'privacy' or 'terms'

    if (!type || !['privacy', 'terms'].includes(type)) {
      // Delete uploaded file if validation fails
      unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Type must be either "privacy" or "terms"' });
    }

    // Check if document already exists for this type
    const existingStmt = db.prepare('SELECT * FROM documents WHERE type = ?');
    const existing = existingStmt.get(type);

    if (existing) {
      // Delete old file
      try {
        const oldPath = join(PERSISTENT_DIR, existing.path);
        if (existsSync(oldPath)) {
          unlinkSync(oldPath);
        }
      } catch (e) {
        console.error('Error deleting old file:', e);
      }

      // Update database record
      const updateStmt = db.prepare(`
        UPDATE documents
        SET filename = ?, original_name = ?, mime_type = ?, size = ?, path = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      updateStmt.run(
        req.file.filename,
        req.file.originalname,
        req.file.mimetype,
        req.file.size,
        `uploads/documents/${req.file.filename}`,
        existing.id
      );

      res.json({
        id: existing.id,
        filename: req.file.filename,
        path: `/api/documents/${type}`,
        message: 'Document updated successfully'
      });
    } else {
      // Insert new document record
      const insertStmt = db.prepare(`
        INSERT INTO documents (type, filename, original_name, mime_type, size, path)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      const result = insertStmt.run(
        type,
        req.file.filename,
        req.file.originalname,
        req.file.mimetype,
        req.file.size,
        `uploads/documents/${req.file.filename}`
      );

      res.json({
        id: result.lastInsertRowid,
        filename: req.file.filename,
        path: `/api/documents/${type}`,
        message: 'Document uploaded successfully'
      });
    }
  } catch (error) {
    console.error('Upload document error:', error);
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

// Get document by type (public)
router.get('/:type', (req, res) => {
  try {
    const { type } = req.params;

    if (!['privacy', 'terms'].includes(type)) {
      return res.status(400).json({ error: 'Invalid document type' });
    }

    const stmt = db.prepare('SELECT * FROM documents WHERE type = ?');
    const document = stmt.get(type);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const filepath = join(PERSISTENT_DIR, document.path);

    if (!existsSync(filepath)) {
      return res.status(404).json({ error: 'Document file not found' });
    }

    // Set appropriate headers based on file type
    res.setHeader('Content-Type', document.mime_type);
    res.setHeader('Content-Disposition', `inline; filename="${document.original_name}"`);
    
    res.sendFile(filepath);
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get document info (without downloading)
router.get('/:type/info', (req, res) => {
  try {
    const { type } = req.params;

    if (!['privacy', 'terms'].includes(type)) {
      return res.status(400).json({ error: 'Invalid document type' });
    }

    const stmt = db.prepare('SELECT * FROM documents WHERE type = ?');
    const document = stmt.get(type);

    if (!document) {
      return res.json({ exists: false });
    }

    res.json({
      exists: true,
      id: document.id,
      type: document.type,
      originalName: document.original_name,
      mimeType: document.mime_type,
      size: document.size,
      updatedAt: document.updated_at,
      url: `/api/documents/${type}`
    });
  } catch (error) {
    console.error('Get document info error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete document (protected)
router.delete('/:type', authenticateToken, (req, res) => {
  try {
    const { type } = req.params;

    if (!['privacy', 'terms'].includes(type)) {
      return res.status(400).json({ error: 'Invalid document type' });
    }

    // Get document record
    const stmt = db.prepare('SELECT * FROM documents WHERE type = ?');
    const document = stmt.get(type);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Delete file
    try {
      const filepath = join(PERSISTENT_DIR, document.path);
      if (existsSync(filepath)) {
        unlinkSync(filepath);
      }
    } catch (e) {
      console.error('Error deleting file:', e);
    }

    // Delete database record
    const deleteStmt = db.prepare('DELETE FROM documents WHERE id = ?');
    deleteStmt.run(document.id);

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

