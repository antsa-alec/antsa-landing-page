#!/bin/bash

# ANTSA Landing Page Development Script
# Runs frontend (Vite) and backend (Express) with hot reload

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Port configuration (avoiding 3000, 3001)
FRONTEND_PORT=5173
BACKEND_PORT=5174

echo -e "${BLUE}🚀 Starting ANTSA Landing Page Development Environment${NC}"
echo -e "${YELLOW}Frontend (Vite): http://localhost:${FRONTEND_PORT}${NC}"
echo -e "${YELLOW}Backend (Express): http://localhost:${BACKEND_PORT}${NC}"
echo ""

# Function to cleanup processes on exit
cleanup() {
    echo -e "\n${RED}🛑 Shutting down services...${NC}"
    kill $(jobs -p) 2>/dev/null
    exit
}

# Trap CTRL+C and cleanup
trap cleanup SIGINT SIGTERM

# Check if node_modules exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
    cd backend && npm install && cd ..
fi

# Start backend with custom port
echo -e "${GREEN}🔧 Starting backend on port ${BACKEND_PORT}...${NC}"
cd backend
PORT=${BACKEND_PORT} npm run dev &
BACKEND_PID=$!
cd ..

# Give backend time to start
sleep 2

# Start frontend with custom port
echo -e "${GREEN}⚛️  Starting frontend on port ${FRONTEND_PORT}...${NC}"
VITE_BACKEND_PORT=${BACKEND_PORT} npm run dev -- --port ${FRONTEND_PORT} &
FRONTEND_PID=$!

echo ""
echo -e "${GREEN}✅ Development servers started!${NC}"
echo -e "${BLUE}Frontend: http://localhost:${FRONTEND_PORT}${NC}"
echo -e "${BLUE}Backend:  http://localhost:${BACKEND_PORT}${NC}"
echo ""
echo -e "${YELLOW}Press CTRL+C to stop all services${NC}"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
