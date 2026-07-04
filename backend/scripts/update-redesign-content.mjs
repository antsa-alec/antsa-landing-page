/**
 * Apply the 2026 redesign CMS content to an EXISTING database (e.g. the
 * persistent prod DB that was seeded before the redesign, so the initial
 * seed no longer runs). Idempotent — safe to re-run.
 *
 *   node backend/scripts/update-redesign-content.mjs
 */
import db from '../config/database.js';
import { applyRedesignContent } from './redesign-content.mjs';

applyRedesignContent(db);
console.log('✅ Applied 2026 redesign content to content.db');
process.exit(0);
