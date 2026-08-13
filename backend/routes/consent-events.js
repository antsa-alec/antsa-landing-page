import express from 'express';
import db from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const ID_PATTERN = /^[a-zA-Z0-9-]{8,100}$/;
const CHOICES = new Set(['accept_all', 'reject_all', 'save_preferences', 'withdraw']);

router.post('/', (req, res) => {
  const { eventId, visitorId, timestamp, choice, categories, bannerVersion } = req.body ?? {};
  if (!ID_PATTERN.test(eventId ?? '') || !ID_PATTERN.test(visitorId ?? '')) {
    return res.status(400).json({ error: 'Invalid consent event identifier' });
  }
  if (!CHOICES.has(choice) || Number.isNaN(Date.parse(timestamp)) || typeof bannerVersion !== 'string' || bannerVersion.length > 80) {
    return res.status(400).json({ error: 'Invalid consent event' });
  }
  if (!categories || ['analytics', 'advertising', 'functional'].some((key) => typeof categories[key] !== 'boolean')) {
    return res.status(400).json({ error: 'Invalid consent categories' });
  }

  db.prepare(`
    INSERT OR IGNORE INTO consent_events (
      event_id, visitor_id, event_timestamp, choice, analytics, advertising, functional, banner_version
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    eventId,
    visitorId,
    new Date().toISOString(),
    choice,
    Number(categories.analytics),
    Number(categories.advertising),
    Number(categories.functional),
    bannerVersion,
  );
  return res.status(201).json({ stored: true, eventId });
});

router.get('/', authenticateToken, (req, res) => {
  const visitorId = typeof req.query.visitorId === 'string' ? req.query.visitorId : '';
  if (!ID_PATTERN.test(visitorId)) return res.status(400).json({ error: 'visitorId is required' });
  const events = db.prepare(`
    SELECT event_id, visitor_id, event_timestamp, choice, analytics, advertising, functional, banner_version
    FROM consent_events WHERE visitor_id = ? ORDER BY event_timestamp DESC
  `).all(visitorId);
  return res.json(events.map((event) => ({
    eventId: event.event_id,
    visitorId: event.visitor_id,
    timestamp: event.event_timestamp,
    choice: event.choice,
    categories: {
      analytics: Boolean(event.analytics),
      advertising: Boolean(event.advertising),
      functional: Boolean(event.functional),
    },
    bannerVersion: event.banner_version,
  })));
});

export default router;
