.PHONY: up down build logs clean restart status

# Colors for output
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

# Environment variables
export PORT ?= 3001
export JWT_SECRET ?= antsa-super-secret-jwt-key-change-in-production-12345678
export NODE_ENV ?= development

##@ Development

up: ## Start the development stack (frontend + backend)
	@echo "$(GREEN)🚀 Starting ANTSA Landing Page Stack...$(NC)"
	@mkdir -p logs
	@echo "$(YELLOW)📦 Starting backend on port 3001...$(NC)"
	@(cd backend && PORT=$(PORT) JWT_SECRET=$(JWT_SECRET) NODE_ENV=$(NODE_ENV) node server.js) > logs/backend.log 2>&1 & echo $$! > logs/backend.pid
	@sleep 2
	@echo "$(YELLOW)📦 Starting frontend on port 3000...$(NC)"
	@npm run dev > logs/frontend.log 2>&1 & echo $$! > logs/frontend.pid
	@sleep 3
	@echo "$(GREEN)✅ Stack is up!$(NC)"
	@echo "$(GREEN)   Frontend: http://localhost:3000$(NC)"
	@echo "$(GREEN)   Backend:  http://localhost:3001$(NC)"
	@echo "$(YELLOW)💡 Run 'make logs' to view logs$(NC)"

down: ## Stop the development stack
	@echo "$(RED)🛑 Stopping ANTSA Landing Page Stack...$(NC)"
	@if [ -f logs/backend.pid ]; then \
		kill `cat logs/backend.pid` 2>/dev/null || true; \
		rm logs/backend.pid; \
		echo "$(GREEN)✅ Backend stopped$(NC)"; \
	fi
	@if [ -f logs/frontend.pid ]; then \
		kill `cat logs/frontend.pid` 2>/dev/null || true; \
		rm logs/frontend.pid; \
		echo "$(GREEN)✅ Frontend stopped$(NC)"; \
	fi
	@pkill -f "vite" 2>/dev/null || true
	@pkill -f "node.*server.js" 2>/dev/null || true
	@echo "$(GREEN)✅ Stack is down$(NC)"

restart: down up ## Restart the development stack

status: ## Check the status of the stack
	@echo "$(YELLOW)📊 Stack Status:$(NC)"
	@if [ -f logs/backend.pid ] && kill -0 `cat logs/backend.pid` 2>/dev/null; then \
		echo "$(GREEN)✅ Backend: Running (PID: `cat logs/backend.pid`)$(NC)"; \
	else \
		echo "$(RED)❌ Backend: Not running$(NC)"; \
	fi
	@if [ -f logs/frontend.pid ] && kill -0 `cat logs/frontend.pid` 2>/dev/null; then \
		echo "$(GREEN)✅ Frontend: Running (PID: `cat logs/frontend.pid`)$(NC)"; \
	else \
		echo "$(RED)❌ Frontend: Not running$(NC)"; \
	fi
	@echo ""
	@echo "$(YELLOW)Active processes:$(NC)"
	@ps aux | grep -E "(vite|node.*server.js)" | grep -v grep || echo "  No processes found"

logs: ## Tail logs for frontend and backend
	@echo "$(YELLOW)📝 Tailing logs (Ctrl+C to stop)...$(NC)"
	@tail -f logs/frontend.log logs/backend.log 2>/dev/null || echo "$(RED)No logs found. Is the stack running?$(NC)"

logs-frontend: ## View frontend logs only
	@tail -f logs/frontend.log 2>/dev/null || echo "$(RED)No frontend logs found$(NC)"

logs-backend: ## View backend logs only
	@tail -f logs/backend.log 2>/dev/null || echo "$(RED)No backend logs found$(NC)"

##@ Build

build: ## Build the frontend for production
	@echo "$(GREEN)🏗️  Building frontend for production...$(NC)"
	@npm run build
	@echo "$(GREEN)✅ Build complete! Output in dist/$(NC)"

##@ Utilities

clean: ## Clean up logs and build artifacts
	@echo "$(YELLOW)🧹 Cleaning up...$(NC)"
	@rm -rf logs/*.log logs/*.pid
	@rm -rf dist
	@rm -rf node_modules/.vite
	@echo "$(GREEN)✅ Cleanup complete$(NC)"

install: ## Install dependencies
	@echo "$(GREEN)📦 Installing dependencies...$(NC)"
	@npm install
	@cd backend && npm install
	@echo "$(GREEN)✅ Dependencies installed$(NC)"

seed: ## Seed the database with initial data
	@echo "$(GREEN)🌱 Seeding database...$(NC)"
	@cd backend && npm run seed
	@echo "$(GREEN)✅ Database seeded$(NC)"

help: ## Display this help message
	@awk 'BEGIN {FS = ":.*##"; printf "$(YELLOW)Usage:$(NC)\n  make $(GREEN)<target>$(NC)\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(YELLOW)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

.DEFAULT_GOAL := help

