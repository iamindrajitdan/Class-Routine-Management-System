# Class Routine Management System

A university-grade, cloud-ready platform for managing academic schedules with AI-assisted timetable optimization, conflict detection, and comprehensive reporting.

## Project Overview

This is a full-stack SaaS application designed for academic institutions to manage class routines, teacher schedules, classroom allocations, and student timetables with intelligent constraint solving and optimization.

**Status**: Phase 1 - Project Setup & Foundations

## Architecture

- **Backend**: Node.js/Express with TypeScript
- **Database**: PostgreSQL 14+
- **Cache**: Redis 7+
- **Frontend**: React 18+ with TypeScript
- **Optimization**: Python microservice with OR-Tools
- **Deployment**: Docker & Kubernetes

## Quick Start

```bash
# Clone repository
git clone https://github.com/iamindrajitdan/Class-Routine-Management-System.git
cd Class-Routine-Management-System

# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Start development environment
docker-compose up -d

# Run migrations
npm run migrate

# Start development server
npm run dev
```

## Documentation

- [Requirements](docs/requirements.md)
- [Design](docs/design.md)
- [API Documentation](docs/api.md)
- [Deployment Guide](docs/deployment.md)

## Requirements Traceability

All implementation tasks are traceable to specific requirements. See `.kiro/specs/class-routine-management/requirements.md` for complete requirements.

## License

Academic & Institutional Use

## Contact

For questions or support, contact the development team.
