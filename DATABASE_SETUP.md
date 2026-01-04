# Database Setup Guide

## Overview
This project uses **PostgreSQL** for both local development and production (Vercel). This ensures consistency and avoids migration issues.

## Option 1: Local PostgreSQL (Recommended for Development)

### macOS Installation
```bash
# Install PostgreSQL via Homebrew
brew install postgresql@16

# Start PostgreSQL service
brew services start postgresql@16

# Create database
createdb sports_arena

# Verify connection
psql sports_arena
```

### Windows Installation
1. Download from [PostgreSQL.org](https://www.postgresql.org/download/windows/)
2. Run installer (default port 5432, remember your password)
3. Open pgAdmin or SQL Shell
4. Create database: `CREATE DATABASE sports_arena;`

### Linux Installation
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
sudo -u postgres createdb sports_arena
```

### Update .env
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sports_arena"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/sports_arena"
```
*Replace `postgres:postgres` with your actual username:password*

## Option 2: Free Hosted PostgreSQL (Easiest)

Perfect if you don't want to install PostgreSQL locally.

### Neon (Recommended - 3GB Free)
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project named "Sports Arena"
3. Copy the connection string
4. Paste into `.env`:
```env
DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/sports_arena?sslmode=require"
DIRECT_URL="postgresql://user:password@ep-xxx.neon.tech/sports_arena?sslmode=require"
```

### Supabase (Alternative - 500MB Free)
1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Project Settings → Database
4. Copy "Connection string" (Session mode)
5. Update `.env` with the connection string

### Vercel Postgres (For Production)
1. Go to [vercel.com/storage](https://vercel.com/storage)
2. Create a Postgres database
3. Vercel auto-sets `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING`
4. In Vercel project settings, add:
   - `DATABASE_URL` = `POSTGRES_PRISMA_URL`
   - `DIRECT_URL` = `POSTGRES_URL_NON_POOLING`

## Setup Database (After Configuring .env)

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database with test data
npx tsx prisma/seed.ts
```

Or use the combined command:
```bash
npm run db:setup
```

## Verify Setup

```bash
# Open Prisma Studio to browse data
npx prisma studio

# Or check in terminal
npx tsx -e "import { PrismaClient } from '@prisma/client'; const prisma = new PrismaClient(); prisma.user.findMany().then(users => console.log('Users:', users.length)).finally(() => prisma.\$disconnect())"
```

## Troubleshooting

### "Can't reach database server"
- Check PostgreSQL is running: `brew services list` (Mac) or `sudo systemctl status postgresql` (Linux)
- Verify port 5432 is not blocked
- Check username/password in connection string

### "SSL connection required"
For hosted databases (Neon, Supabase), add `?sslmode=require` to connection string

### "Relation does not exist"
Run migrations: `npx prisma migrate deploy`

### "Too many connections"
Use connection pooling (already configured via `DATABASE_URL` vs `DIRECT_URL`)

## Database URLs Explained

- **DATABASE_URL**: Pooled connection (used by app at runtime)
- **DIRECT_URL**: Direct connection (used for migrations)

For local PostgreSQL, both can be the same. For hosted services, Neon/Vercel provide separate URLs for optimal performance.
