import './config/database.js';
import { runRedesignMigrations } from './scripts/migrate-redesign.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import contentRoutes from './routes/content.js';
import imageRoutes from './routes/images.js';
import documentRoutes from './routes/documents.js';
import stripePricingRoutes from './routes/stripe-pricing.js';
import helpRoutes from './routes/help.js';
import contactRoutes from './routes/contact.js';
import seoRoutes, { buildSeoBodyHtml, buildFaqJsonLd, loadAllSections, loadHelpArticles } from './routes/seo.js';
import { readFileSync } from 'fs';

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

runRedesignMigrations();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

console.log('🔐 CORS - Allowed origins:', allowedOrigins);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      return origin === allowedOrigin || 
             origin.startsWith(allowedOrigin) ||
             (process.env.NODE_ENV === 'development');
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`🚫 CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  exposedHeaders: ['Authorization'],
}));

// Prevent browsers and proxies from caching API responses
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/stripe', stripePricingRoutes);
app.use('/api/content/help', helpRoutes);
app.use('/api/contact', contactRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// SEO/discovery routes — served at root so crawlers and LLM agents can find them
// at the conventional locations (/llms.txt, /robots.txt, /sitemap.xml).
// These are generated dynamically from the CMS so they reflect live content.
app.use('/', seoRoutes);

// Serve static files from the dist directory (production)
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  // index: false so GET / falls through to our injection handler instead of
  // serving the un-injected dist/index.html.
  app.use(express.static(distPath, { index: false }));

  // Cache the built shell once. We only re-render the injected body per request,
  // not the file read.
  let cachedShell = null;
  const getShell = () => {
    if (!cachedShell) cachedShell = readFileSync(path.join(distPath, 'index.html'), 'utf8');
    return cachedShell;
  };

  // Inject live CMS content into the body so non-JS clients (LLM fetchers,
  // link previewers, archive bots) see meaningful content. React replaces
  // #root on mount, so users see no difference. Content reflects the latest
  // CMS edits because it's read from the DB on every request.
  app.get('*', (req, res) => {
    try {
      const sections = loadAllSections();
      const helpArticles = loadHelpArticles();
      const bodyHtml = buildSeoBodyHtml(sections, helpArticles);
      const faqLd = buildFaqJsonLd(sections);

      let html = getShell()
        .replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);

      if (faqLd) {
        const faqScript = `<script type="application/ld+json">${JSON.stringify(faqLd)}</script>`;
        html = html.replace('</head>', `${faqScript}</head>`);
      }

      res.set('Content-Type', 'text/html; charset=utf-8');
      res.set('Cache-Control', 'public, max-age=300');
      res.send(html);
    } catch (err) {
      console.error('SSR injection failed, serving plain shell:', err);
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS not allowed' });
  }
  
  if (err.message === 'Only image files are allowed') {
    return res.status(400).json({ error: err.message });
  }

  if (err.message === 'Only PDF, DOC, DOCX, and TXT files are allowed') {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? 'Configured' : 'WARNING: Not configured!'}`);
});

export default app;

