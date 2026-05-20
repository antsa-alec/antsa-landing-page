#!/usr/bin/env bash
# backend/scripts/smoke-ssr.sh — verify SSR is producing real content for all public routes.
set -euo pipefail

PORT="${PORT:-3001}"
BASE="http://localhost:${PORT}"

cleanup() {
  pkill -f "node backend/server.js" 2>/dev/null || true
}
trap cleanup EXIT

echo "🔨 Building frontend..."
npm run build >/dev/null

echo "🚀 Starting prod server on port ${PORT}..."
NODE_ENV=production PORT="${PORT}" node backend/server.js &
sleep 3

check_route() {
  local path="$1"
  local must_contain="$2"
  local body
  body=$(curl -sS --max-time 10 "${BASE}${path}")
  if grep -q '<div id="root"></div>' <<< "$body"; then
    echo "❌ ${path}: empty #root — SSR did not populate the page"
    return 1
  fi
  if ! grep -q "$must_contain" <<< "$body"; then
    echo "❌ ${path}: expected to find '${must_contain}'"
    return 1
  fi
  echo "✅ ${path}"
}

echo
echo "── Public routes (must SSR) ──"
check_route "/"                       '<h1'
check_route "/free-trial"             '<h1'
check_route "/help"                   '<h1'
check_route "/privacy-policy"         '<h1'
check_route "/terms-and-conditions"   '<h1'

echo
echo "── JSON-LD on home ──"
HOME_BODY=$(curl -sS "${BASE}/")
grep -q '"@type":"Organization"' <<< "$HOME_BODY" && echo "✅ Organization JSON-LD" || (echo "❌ Organization JSON-LD missing"; exit 1)

echo
echo "── Admin SPA (shell only is correct) ──"
ADMIN_BODY=$(curl -sS "${BASE}/admin")
if grep -q '<div id="root">' <<< "$ADMIN_BODY"; then
  echo "✅ /admin: SPA shell served"
else
  echo "❌ /admin: missing #root"; exit 1
fi

echo
echo "── API + discovery routes ──"
for p in /api/health /llms.txt /llms-full.txt /sitemap.xml /robots.txt; do
  code=$(curl -sS -o /dev/null -w '%{http_code}' "${BASE}${p}")
  if [ "$code" = "200" ]; then
    echo "✅ ${p} → 200"
  else
    echo "❌ ${p} → ${code}"; exit 1
  fi
done

echo
echo "🎉 All SSR smoke checks passed."
