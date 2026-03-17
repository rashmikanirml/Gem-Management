# Gem Management Marketplace (SaaS)

A production-oriented starter monorepo for a gemstone marketplace with buyer, seller, and admin flows.

## Stack

- Frontend: Next.js 14 + TypeScript
- Backend: Express + TypeScript + Prisma
- Database: PostgreSQL
- Auth: JWT + RBAC (starter middleware)

## Repository Structure

- `docs/functional-technical-spec.md` - Functional + technical specification
- `backend/` - API server, Prisma schema, auth and RBAC middleware
- `frontend/` - Next.js UI shell for marketplace and dashboards

## Core Capabilities Included

- Role model: guest, user, admin
- Listing model with gem attributes (type, carats, color, clarity, origin, certification)
- Order, order item, review, and message domain tables
- API route structure matching the documented endpoints
- Admin moderation endpoints

## Quick Start

### 1) Backend

1. Copy `backend/.env.example` to `backend/.env`
2. Set `DATABASE_URL` and `JWT_SECRET`
3. Install and run:

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

API default URL: `http://localhost:4000`

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

App default URL: `http://localhost:3000`

## Notes

- This is a starter architecture intended for extension.
- Payment integration and real-time messaging are represented by clear extension points.
- Use HTTPS, rate limiting, input validation, and strong secrets in production.
