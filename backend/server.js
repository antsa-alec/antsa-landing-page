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
import seoRoutes, { pingIndexNow } from './routes/seo.js';

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

// HSTS — TLS is terminated at Azure; harmless over http, honoured over https.
// includeSubDomains protects the whole antsa.ai / {country}.antsa.ai tree.
app.use((_req, res, next) => {
  res.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  next();
});

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
// Ping IndexNow when admin content changes so Bing/Copilot (and via Bing,
// ChatGPT) recrawl within minutes. Fire-and-forget after a successful write.
app.use('/api/content', (req, res, next) => {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    res.on('finish', () => {
      if (res.statusCode >= 200 && res.statusCode < 300) pingIndexNow();
    });
  }
  next();
});
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

// Serve static files and SSR (production)
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  const distClientPath = path.join(distPath, 'client');

  // Serve static assets built by Vike (JS chunks, CSS, fonts).
  app.use(express.static(distClientPath, { index: false }));

  // Admin SPA carve-out. Vike never sees /admin/*; we serve the admin
  // shell directly and React mounts client-side as today.
  // The admin SPA shell lives at dist/index.html (top-level Vite output),
  // not inside dist/client/ which is the Vike SSR client bundle.
  const adminShell = path.join(distPath, 'index.html');
  app.get('/admin', (_req, res) => {
    res.sendFile(adminShell);
  });
  app.get(/^\/admin\/.+$/, (_req, res) => {
    res.sendFile(adminShell);
  });

  // Everything else (the 5 public marketing routes) goes through Vike.
  // Vike's auto-discovery of dist/server/entry.mjs doesn't work in our
  // Azure App Service layout (server.js sits in backend/, dist/ sits in
  // the wwwroot above it). Import the production entry explicitly per
  // https://github.com/brillout/vite-plugin-server-entry#manual-import
  await import('../dist/server/entry.mjs');
  const { renderPage } = await import('vike/server');
  app.get('*', async (req, res, next) => {
    const pageContextInit = { urlOriginal: req.originalUrl, headersOriginal: req.headers };
    try {
      const pageContext = await renderPage(pageContextInit);
      const { httpResponse } = pageContext;
      if (!httpResponse) return next();
      res.status(httpResponse.statusCode);
      httpResponse.headers.forEach(([name, value]) => res.setHeader(name, value));
      res.setHeader('Cache-Control', 'no-store');
      httpResponse.pipe(res);
    } catch (err) {
      console.error('Vike SSR error:', err);
      res.status(500).sendFile(path.join(distClientPath, 'index.html'));
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

