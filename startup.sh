#!/bin/bash

# Ensure persistent data directory exists
mkdir -p /home/data/uploads
mkdir -p /home/data/uploads/documents

# Migrate old database and uploads from deployment dir to persistent storage
if [ -f /home/site/wwwroot/backend/content.db ] && [ ! -f /home/data/content.db ]; then
  echo "📦 Migrating existing database to persistent storage..."
  cp /home/site/wwwroot/backend/content.db /home/data/content.db
  echo "✅ Database migrated to /home/data/content.db"
fi

if [ -d /home/site/wwwroot/backend/uploads ] && [ "$(ls -A /home/site/wwwroot/backend/uploads 2>/dev/null)" ]; then
  echo "📦 Migrating existing uploads to persistent storage..."
  cp -rn /home/site/wwwroot/backend/uploads/* /home/data/uploads/ 2>/dev/null || true
  echo "✅ Uploads migrated to /home/data/uploads/"
fi

cd /home/site/wwwroot/backend

echo "📦 Installing backend dependencies..."
npm install --production

echo "🔨 Rebuilding native modules for current Node version..."
npm rebuild better-sqlite3

echo "💾 Database stored at: /home/data/content.db"
echo "📁 Uploads stored at: /home/data/uploads/"

# Only run seed if the database is brand new (no sections exist)
SECTION_COUNT=$(node --input-type=module -e "
import Database from 'better-sqlite3';
const db = new Database('/home/data/content.db');
try {
  const row = db.prepare('SELECT COUNT(*) as cnt FROM sections').get();
  console.log(row.cnt);
} catch(e) {
  console.log('0');
}
db.close();
" 2>/dev/null)

if [ "$SECTION_COUNT" = "0" ] || [ -z "$SECTION_COUNT" ]; then
  echo "🌱 Fresh database detected — running initial seed..."
  node scripts/seed.js
else
  echo "✅ Existing database found with $SECTION_COUNT sections — skipping seed"
fi

echo "🚀 Starting server..."
NODE_ENV=production node server.js
