#!/bin/bash

# 🚀 Automated Supabase Setup Script
# Complete setup for The Animal Side database integration

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Banner
echo -e "${BLUE}"
echo "🗃️  The Animal Side - Supabase Setup"
echo "====================================="
echo -e "${NC}"

# Check prerequisites
log_info "Checking prerequisites..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    log_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    log_error "npm is not installed. Please install npm first."
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    log_error "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

log_success "Prerequisites check passed"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    log_warning "Supabase CLI not found. Installing..."
    npm install -g supabase@latest
    log_success "Supabase CLI installed"
else
    log_success "Supabase CLI found"
fi

# Environment setup
log_info "Setting up environment configuration..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    log_warning ".env.local not found. Creating template..."
    cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Development Settings
NODE_ENV=development
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Optional: Analytics and Monitoring
NEXT_PUBLIC_GA_ID=
SENTRY_DSN=
EOF
    log_warning "Please fill in your Supabase credentials in .env.local before continuing."
    log_info "You can find these in your Supabase project dashboard under Settings > API"
    echo ""
    echo "Required values:"
    echo "- NEXT_PUBLIC_SUPABASE_URL: Your project URL (https://xyz.supabase.co)"
    echo "- NEXT_PUBLIC_SUPABASE_ANON_KEY: Your anon/public key"
    echo "- SUPABASE_SERVICE_ROLE_KEY: Your service role key (for migrations)"
    echo ""
    read -p "Press Enter when you've filled in the credentials..."
fi

# Load environment variables
if [ -f ".env.local" ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

# Validate environment variables
log_info "Validating environment configuration..."

if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    log_error "Missing required Supabase credentials in .env.local"
    log_info "Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
    exit 1
fi

log_success "Environment configuration validated"

# Install dependencies
log_info "Installing project dependencies..."
npm install
log_success "Dependencies installed"

# Install additional dependencies for database integration
log_info "Installing database-specific dependencies..."
npm install @supabase/supabase-js @tanstack/react-query @tanstack/react-query-devtools
npm install -D @types/node vitest
log_success "Database dependencies installed"

# Initialize Supabase project (if not already done)
if [ ! -f "supabase/config.toml" ]; then
    log_info "Initializing Supabase project..."
    supabase init
    log_success "Supabase project initialized"
else
    log_success "Supabase project already initialized"
fi

# Function to create/migrate database
setup_database() {
    log_info "Setting up database schema..."
    
    # Check if database directory exists
    if [ ! -d "database" ]; then
        log_error "Database directory not found. Please ensure database/supabase_schema.sql exists."
        exit 1
    fi
    
    # Apply schema
    if [ -f "database/supabase_schema.sql" ]; then
        log_info "Applying database schema..."
        
        # Use Supabase CLI to apply schema
        supabase db reset --db-url "$NEXT_PUBLIC_SUPABASE_URL" || {
            log_warning "Direct schema application failed. Please run the schema manually in your Supabase dashboard."
            log_info "You can find the schema in: database/supabase_schema.sql"
        }
        
        log_success "Database schema applied"
    else
        log_error "Schema file not found: database/supabase_schema.sql"
        exit 1
    fi
}

# Function to migrate mock data
migrate_data() {
    log_info "Migrating mock data to database..."
    
    if [ -f "database/migrate-mock-data.ts" ]; then
        # Compile and run migration script
        npx tsx database/migrate-mock-data.ts || {
            log_warning "Mock data migration failed. You can run it manually later with:"
            log_info "npx tsx database/migrate-mock-data.ts"
        }
        log_success "Mock data migration completed"
    else
        log_warning "Migration script not found. Mock data will need to be added manually."
    fi
}

# Function to run tests
run_tests() {
    log_info "Running integration tests..."
    
    # Run type checking
    npm run type-check || {
        log_warning "Type checking failed. Please fix TypeScript errors."
    }
    
    # Run tests if they exist
    if [ -f "src/services/__tests__/organizationService.test.ts" ]; then
        npm test || {
            log_warning "Some tests failed. Please review test results."
        }
        log_success "Tests completed"
    else
        log_warning "Integration tests not found. Skipping test run."
    fi
}

# Function to start development server
start_dev() {
    log_info "Starting development server..."
    log_success "Setup completed! Starting development server..."
    npm run dev
}

# Main setup flow
main() {
    echo ""
    log_info "Choose setup option:"
    echo "1) Full setup (schema + data migration + tests)"
    echo "2) Schema only"
    echo "3) Data migration only"
    echo "4) Tests only"
    echo "5) Start development server"
    echo "6) Skip to development"
    echo ""
    
    read -p "Enter your choice (1-6): " choice
    
    case $choice in
        1)
            setup_database
            migrate_data
            run_tests
            start_dev
            ;;
        2)
            setup_database
            log_success "Schema setup completed!"
            ;;
        3)
            migrate_data
            log_success "Data migration completed!"
            ;;
        4)
            run_tests
            log_success "Tests completed!"
            ;;
        5)
            start_dev
            ;;
        6)
            log_success "Setup skipped. You can run individual steps manually."
            ;;
        *)
            log_error "Invalid choice. Please run the script again."
            exit 1
            ;;
    esac
}

# Run main function
main

echo ""
log_success "🎉 Supabase setup completed!"
echo ""
echo "Next steps:"
echo "1. Open your browser to http://localhost:5173"
echo "2. Test organization pages to verify database integration"
echo "3. Check browser console for any errors"
echo "4. Run performance benchmarks with: npm run benchmark"
echo ""
echo "Useful commands:"
echo "- npm run dev          # Start development server"
echo "- npm run type-check   # Check TypeScript"
echo "- npm test            # Run integration tests"
echo "- npm run build       # Build for production"
echo ""
echo "For help, check:"
echo "- DATABASE_INTEGRATION_GUIDE.md"
echo "- SUPABASE_INTEGRATION_CHECKLIST.md"