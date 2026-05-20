#!/bin/bash
set -e

echo "🚀 Antsa Landing Page — startup"
echo "================================"

# ── Persistent storage ──────────────────────────────────────────────────────
# /home/data/ is an Azure Files-backed volume that survives ALL deployments
# and container restarts. Never write live data to /home/site/wwwroot/.
mkdir -p /home/data/uploads
mkdir -p /home/data/uploads/documents
echo "✅ Persistent directories ready: /home/data/"

# ── One-time migration (first deploy only) ───────────────────────────────────
# If there is a database bundled inside the deployment package AND no
# persistent database exists yet, copy it across. Once /home/data/content.db
# exists this block is skipped forever.
if [ ! -f /home/data/content.db ]; then
  if [ -f /home/site/wwwroot/backend/content.db ]; then
    echo "📦 First-run migration: copying database to persistent storage..."
    cp /home/site/wwwroot/backend/content.db /home/data/content.db
    echo "✅ Database migrated to /home/data/content.db"
  else
    echo "ℹ️  No existing database found — a fresh one will be seeded"
  fi
else
  DB_SIZE=$(du -sh /home/data/content.db 2>/dev/null | cut -f1)
  echo "✅ Persistent database found (${DB_SIZE}) — keeping existing data"
fi

# Migrate any existing uploads on first run (no-clobber so we never overwrite)
if [ -d /home/site/wwwroot/backend/uploads ]; then
  cp -rn /home/site/wwwroot/backend/uploads/. /home/data/uploads/ 2>/dev/null || true
fi

# ── Native module rebuild ─────────────────────────────────────────────────────
# Only backend's better-sqlite3 is loaded at runtime. The root copy was
# only needed during the Vite/Rollup build (so the SSR bundle could be
# emitted with 'better-sqlite3' marked as external). At runtime the chain
# dist/server/entries/* → backend/ssr/data-providers.js → backend/config/
# database.js resolves better-sqlite3 from backend/node_modules, never from
# the root. Trying to rebuild the root copy on Azure has historically failed
# (no prebuilt matched the Azure Node 20 image), so we leave it alone.
cd /home/site/wwwroot/backend
echo "🔨 Rebuilding better-sqlite3 in backend..."
npm rebuild better-sqlite3
echo "✅ Native module ready"

# ── Seed only on a truly fresh database ──────────────────────────────────────
SECTION_COUNT=$(node --input-type=module -e "
import Database from 'better-sqlite3';
const db = new Database('/home/data/content.db');
try {
  const row = db.prepare('SELECT COUNT(*) as cnt FROM sections').get();
  process.stdout.write(String(row.cnt));
} catch(e) {
  process.stdout.write('0');
} finally {
  db.close();
}
" 2>/dev/null || echo "0")

if [ "$SECTION_COUNT" = "0" ] || [ -z "$SECTION_COUNT" ]; then
  echo "🌱 Fresh database detected — running initial seed..."
  node scripts/seed.js
else
  echo "✅ Database has $SECTION_COUNT sections — skipping seed"
fi

echo ""
echo "💾 Database : /home/data/content.db"
echo "📁 Uploads  : /home/data/uploads/"
echo ""
echo "🚀 Starting server..."
exec node server.js
