#!/bin/bash

# TechBirds Docker Management Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker Desktop and try again."
        exit 1
    fi
}

# Function to check if Docker Compose is available
check_docker_compose() {
    if ! command -v docker-compose > /dev/null 2>&1; then
        print_error "Docker Compose is not installed. Please install Docker Compose and try again."
        exit 1
    fi
}

# Function to display help
show_help() {
    echo "TechBirds Docker Management Script"
    echo ""
    echo "Usage: ./docker-manage.sh [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  dev         Start development environment"
    echo "  prod        Start production environment"
    echo "  stop        Stop all containers"
    echo "  restart     Restart all containers"
    echo "  clean       Stop and remove all containers, networks, and volumes"
    echo "  logs        Show logs for all services"
    echo "  status      Show status of all containers"
    echo "  build       Build/rebuild all images"
    echo "  shell       Open shell in frontend container"
    echo "  db-shell    Open PostgreSQL shell"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./docker-manage.sh dev           # Start development environment"
    echo "  ./docker-manage.sh prod          # Start production environment"
    echo "  ./docker-manage.sh logs          # View logs"
    echo "  ./docker-manage.sh clean         # Clean up everything"
}

# Main script logic
case "$1" in
    "dev")
        check_docker
        check_docker_compose
        print_status "Starting TechBirds development environment..."
        docker-compose -f docker-compose.dev.yml up -d
        print_status "Development environment started!"
        print_info "Frontend: http://localhost:5173"
        print_info "Database: localhost:5432 (techbirds/techbirds_user/techbirds_password)"
        print_info "Redis: localhost:6379"
        ;;
    "prod")
        check_docker
        check_docker_compose
        print_status "Starting TechBirds production environment..."
        docker-compose -f docker-compose.prod.yml up -d
        print_status "Production environment started!"
        print_info "Frontend: http://localhost:80"
        print_info "Database: localhost:5432"
        print_info "Redis: localhost:6379"
        ;;
    "stop")
        print_status "Stopping all containers..."
        docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
        docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
        docker-compose down 2>/dev/null || true
        print_status "All containers stopped!"
        ;;
    "restart")
        print_status "Restarting containers..."
        $0 stop
        sleep 2
        $0 dev
        ;;
    "clean")
        print_warning "This will remove all containers, networks, and volumes. Are you sure? (y/N)"
        read -r response
        if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
            print_status "Cleaning up..."
            docker-compose -f docker-compose.dev.yml down -v --remove-orphans 2>/dev/null || true
            docker-compose -f docker-compose.prod.yml down -v --remove-orphans 2>/dev/null || true
            docker-compose down -v --remove-orphans 2>/dev/null || true
            docker system prune -f
            print_status "Cleanup complete!"
        else
            print_info "Cleanup cancelled."
        fi
        ;;
    "logs")
        if docker-compose -f docker-compose.dev.yml ps -q > /dev/null 2>&1; then
            docker-compose -f docker-compose.dev.yml logs -f
        elif docker-compose -f docker-compose.prod.yml ps -q > /dev/null 2>&1; then
            docker-compose -f docker-compose.prod.yml logs -f
        else
            print_error "No running containers found."
        fi
        ;;
    "status")
        print_info "Development containers:"
        docker-compose -f docker-compose.dev.yml ps 2>/dev/null || echo "No development containers running"
        echo ""
        print_info "Production containers:"
        docker-compose -f docker-compose.prod.yml ps 2>/dev/null || echo "No production containers running"
        ;;
    "build")
        check_docker
        check_docker_compose
        print_status "Building images..."
        docker-compose -f docker-compose.dev.yml build --no-cache
        print_status "Build complete!"
        ;;
    "shell")
        if docker ps | grep -q "techbirds-frontend-dev"; then
            print_status "Opening shell in development frontend container..."
            docker exec -it techbirds-frontend-dev /bin/sh
        elif docker ps | grep -q "techbirds-frontend-prod"; then
            print_status "Opening shell in production frontend container..."
            docker exec -it techbirds-frontend-prod /bin/sh
        else
            print_error "No frontend container is running."
        fi
        ;;
    "db-shell")
        if docker ps | grep -q "techbirds-db"; then
            print_status "Opening PostgreSQL shell..."
            docker exec -it techbirds-db-dev psql -U techbirds_user -d techbirds 2>/dev/null || \
            docker exec -it techbirds-db-prod psql -U techbirds_user -d techbirds
        else
            print_error "No database container is running."
        fi
        ;;
    "help"|"--help"|"-h"|"")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac