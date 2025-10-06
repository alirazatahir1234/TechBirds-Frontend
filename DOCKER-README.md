# TechBirds Docker Setup

This repository includes a complete Docker setup for the TechBirds frontend application with supporting services.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- [Docker Compose](https://docs.docker.com/compose/install/) (included with Docker Desktop)

## Quick Start

### Development Environment

```bash
# Start development environment
./docker-manage.sh dev

# Or manually:
docker-compose -f docker-compose.dev.yml up -d
```

**Access Points:**
- **Frontend**: http://localhost:5173
- **Database**: localhost:5432
- **Redis**: localhost:6379

### Production Environment

```bash
# Start production environment
./docker-manage.sh prod

# Or manually:
docker-compose -f docker-compose.prod.yml up -d
```

**Access Points:**
- **Frontend**: http://localhost:80
- **Database**: localhost:5432
- **Redis**: localhost:6379

## Docker Management Script

The `docker-manage.sh` script provides convenient commands for managing your Docker environment:

```bash
# Development
./docker-manage.sh dev          # Start development environment
./docker-manage.sh stop         # Stop all containers
./docker-manage.sh restart      # Restart containers
./docker-manage.sh logs         # View logs
./docker-manage.sh status       # Check container status

# Maintenance
./docker-manage.sh build        # Rebuild images
./docker-manage.sh clean        # Remove all containers and volumes
./docker-manage.sh shell        # Open shell in frontend container
./docker-manage.sh db-shell     # Open PostgreSQL shell

# Production
./docker-manage.sh prod         # Start production environment
```

## Services Overview

### Frontend (React + Vite)
- **Development**: Hot reloading enabled, source code mounted as volume
- **Production**: Optimized build served by Nginx
- **Port**: 5173 (dev) / 80 (prod)

### Database (PostgreSQL)
- **Image**: postgres:15-alpine
- **Database**: techbirds
- **User**: techbirds_user
- **Password**: techbirds_password
- **Port**: 5432

### Cache (Redis)
- **Image**: redis:7-alpine
- **Port**: 6379
- **Persistence**: Enabled with AOF

### Backend (Placeholder)
- **Note**: Currently set up as placeholder for your .NET backend
- **Port**: 5001 (when implemented)

## Configuration Files

### Docker Compose Files
- `docker-compose.yml` - Main compose file with all services
- `docker-compose.dev.yml` - Development-specific configuration
- `docker-compose.prod.yml` - Production-specific configuration

### Docker Files
- `Dockerfile` - Multi-stage build for development and production
- `.dockerignore` - Excludes unnecessary files from build context
- `nginx.conf` - Nginx configuration for production

### Database
- `docker/init-db.sql` - Database initialization script

## Development Workflow

1. **Start Development Environment**:
   ```bash
   ./docker-manage.sh dev
   ```

2. **Make Changes**: Edit your React code normally. Changes will be hot-reloaded.

3. **View Logs**:
   ```bash
   ./docker-manage.sh logs
   ```

4. **Database Access**:
   ```bash
   ./docker-manage.sh db-shell
   ```

5. **Container Shell Access**:
   ```bash
   ./docker-manage.sh shell
   ```

## Production Deployment

1. **Build and Start**:
   ```bash
   ./docker-manage.sh prod
   ```

2. **Access Application**: http://localhost

## Environment Variables

### Frontend (.env file)
```bash
VITE_API_URL=http://localhost:5001
NODE_ENV=development
```

### Database
```bash
POSTGRES_DB=techbirds
POSTGRES_USER=techbirds_user
POSTGRES_PASSWORD=techbirds_password
```

## Volumes

- `postgres_data` - Database data persistence
- `redis_data` - Redis data persistence
- `backend_data` - Backend application data (when implemented)

## Networking

All services communicate through the `techbirds-network` Docker network.

## Troubleshooting

### Container Won't Start
```bash
# Check logs
./docker-manage.sh logs

# Check container status
./docker-manage.sh status

# Rebuild images
./docker-manage.sh build
```

### Port Conflicts
If ports are already in use, modify the port mappings in the respective docker-compose files.

### Database Connection Issues
```bash
# Access database shell
./docker-manage.sh db-shell

# Check if database is running
docker ps | grep postgres
```

### Clean Start
```bash
# Remove everything and start fresh
./docker-manage.sh clean
./docker-manage.sh dev
```

## Adding Your Backend

When you're ready to integrate your .NET backend:

1. Create a `Dockerfile` in your backend directory
2. Update `docker-compose.yml` to mount your backend code
3. Update the backend service configuration
4. Ensure API endpoints match the proxy configuration

## Security Notes

- Default passwords are for development only
- Change all passwords in production
- Use environment variables for sensitive data
- Consider using Docker secrets for production deployments

## Performance Tips

- Use `.dockerignore` to exclude unnecessary files
- Leverage Docker layer caching
- Use multi-stage builds for optimized production images
- Monitor resource usage with `docker stats`