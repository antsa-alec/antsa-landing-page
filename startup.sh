#!/bin/bash
cd /home/site/wwwroot/backend
echo "📦 Installing backend dependencies..."
npm install --production
echo "🔨 Rebuilding native modules for current Node version..."
npm rebuild better-sqlite3
echo "🌱 Running database seed..."
node scripts/seed.js
echo "🚀 Starting server..."
node server.js

