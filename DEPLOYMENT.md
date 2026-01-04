# KLE Tech Sports Arena - Vercel Deployment Guide

## Prerequisites

✅ Project uses PostgreSQL (configured in `prisma/schema.prisma`)  
✅ Works locally and on Vercel  
✅ No SQLite migration needed

## Step 1: Choose PostgreSQL Database

### Option 1: Vercel Postgres (Recommended)
**Free tier:** 256 MB storage, 60 hours compute/month

1. Go to [vercel.com/storage](https://vercel.com/storage)
2. Create a new Postgres database
3. Vercel automatically sets these environment variables:
   - `POSTGRES_PRISMA_URL` (for app connections)
   - `POSTGRES_URL_NON_POOLING` (for migrations)

### Option 2: Neon (Alternative)
**Free tier:** 3 GB storage, always active

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project: "Sports Arena"
3. Copy **both** connection strings:
   - Pooled connection (ends with `?sslmode=require`)
   - Direct connection (from "Connection Details" → "Direct connection")

### Option 3: Supabase
**Free tier:** 500 MB storage, 2 GB transfer/month

1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Project Settings → Database
4. Copy connection strings from "Connection string" section

## Step 2: Push Code to GitHub

```bash
# Commit any pending changes
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

## Step 3: Deploy to Vercel

### Via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select `sports-arena-court-booking`
4. Configure project (auto-detected as Next.js):
   - **Framework Preset:** Next.js
   - **Build Command:** `prisma generate && next build` (default)
   - **Install Command:** `npm install`

5. **Add Environment Variables**

   **If using Vercel Postgres:**
   ```
   DATABASE_URL=${POSTGRES_PRISMA_URL}
   DIRECT_URL=${POSTGRES_URL_NON_POOLING}
   NEXTAUTH_URL=https://your-project-name.vercel.app
   NEXTAUTH_SECRET=<generate-random-32-chars>
   NODE_ENV=production
   ```

   **If using Neon/Supabase:**
   ```
   DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
   DIRECT_URL=postgresql://user:pass@host/db?sslmode=require
   NEXTAUTH_URL=https://your-project-name.vercel.app
   NEXTAUTH_SECRET=<generate-random-32-chars>
   NODE_ENV=production
   ```

   **Generate NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

6. Click **Deploy**

### Via Vercel CLI (Alternative)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## Step 4: Run Database Migrations

After first deployment, initialize the database:

**Option A: Using Vercel CLI (Recommended)**

```bash
# Pull production environment variables
vercel env pull .env.production

# Run migrations using DIRECT_URL (not pooled connection)
DIRECT_URL="your_direct_url_here" npx prisma migrate deploy

# Seed database with test data
DIRECT_URL="your_direct_url_here" npx tsx prisma/seed.ts
```

**Option B: Automatic Migrations on Deploy**

Update build command in Vercel project settings:

```bash
prisma generate && prisma migrate deploy && next build
```

⚠️ **Important Notes:**
- Use `DIRECT_URL` for migrations (direct connection), not `DATABASE_URL` (pooled)
- First deployment may fail until migrations run - this is expected
- After migrations complete, trigger a redeploy

## Step 5: Verify Deployment

1. Visit your deployed URL: `https://your-project-name.vercel.app`
2. Test login with credentials:
   - **User:** test@kletech.ac.in / test123
   - **Staff:** staff@kletech.ac.in / staff123
3. Check that booking system works
4. Verify staff features (manage bookings, penalties, events)

Create a Vercel Serverless Function to seed:

Create `app/api/admin/seed/route.ts`:
```typescript
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export async function POST(req: Request) {
  // Add authentication check here!
  const { authorization } = Object.fromEntries(req.headers)
  
  if (authorization !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Your seed logic here
  // ... (copy from prisma/seed.ts)

  return NextResponse.json({ success: true })
}
```

Then call it:
```bash
curl -X POST https://your-app.vercel.app/api/admin/seed \
  -H "Authorization: Bearer your_admin_secret"
```

## Environment Variables Summary

Add these to Vercel:

| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | Your database connection string | PostgreSQL/MySQL URL |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Your Vercel deployment URL |
| `NEXTAUTH_SECRET` | Generate random 32+ char string | Use `openssl rand -base64 32` |
| `NODE_ENV` | `production` | Node environment |
| `ADMIN_SECRET` | Random secret for seed endpoint | Optional, for seeding |

## Generate Secure Secret

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32
```

## Testing Deployment

After deployment:

1. Visit your Vercel URL
2. Try signing up for a new account
3. Try logging in
4. Test protected routes

## Troubleshooting

### Build Fails: "Can't reach database server"

**Cause:** Vercel can't connect to database during build

**Solution:**
- Ensure `DATABASE_URL` is set in environment variables
- For Neon/Supabase: add `?sslmode=require` to connection string
- Check database is not paused (Neon auto-pauses after inactivity)

### Deployment Succeeds but Pages Show 500 Errors

**Cause:** Database tables don't exist yet

**Solution:**
1. Run migrations: `DIRECT_URL="..." npx prisma migrate deploy`
2. Check Vercel function logs for specific error message
3. Verify all environment variables are correctly set

### "Invalid `prisma.client()` invocation"

**Cause:** Connection string format issue

**Solution:**
- Verify `DATABASE_URL` format: `postgresql://user:pass@host:port/db`
- Ensure no extra spaces or line breaks in connection string
- For pooled connections, use `?pgbouncer=true&connection_limit=1`

### Migrations Fail: "relation already exists"

**Cause:** Tables were manually created or migrations ran partially

**Solution:**
```bash
# Check migration status
DIRECT_URL="..." npx prisma migrate status

# Deploy only pending migrations
DIRECT_URL="..." npx prisma migrate deploy
```

### Function Timeout on First Load

**Cause:** Cold start with Prisma client generation

**Solution:**
- This is normal on first request after deployment
- Subsequent requests will be fast (< 100ms)
- Consider Vercel Pro for lower cold start times

### Can't Login After Deployment

**Cause:** Authentication configuration issue

**Solution:**
1. Verify `NEXTAUTH_SECRET` is set in Vercel environment variables
2. Ensure `NEXTAUTH_URL` matches deployment URL exactly (no trailing slash)
3. Check browser console for specific auth errors
4. Clear cookies and try again

## Environment Variables Reference

| Variable | Example | Required | Description |
|----------|---------|----------|-------------|
| `DATABASE_URL` | `postgresql://...?pgbouncer=true` | ✅ | Pooled connection for app |
| `DIRECT_URL` | `postgresql://...` | ✅ | Direct connection for migrations |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | ✅ | Your deployment URL |
| `NEXTAUTH_SECRET` | `<32+ chars>` | ✅ | `openssl rand -base64 32` |
| `NODE_ENV` | `production` | ✅ | Always production |

## Post-Deployment Checklist

- [ ] All environment variables configured in Vercel
- [ ] Database migrations completed successfully
- [ ] Test data seeded (test@kletech.ac.in, staff@kletech.ac.in)
- [ ] User login works
- [ ] Booking creation works
- [ ] Staff login works
- [ ] Staff can manage bookings and penalties
- [ ] Events display on homepage
- [ ] Calendar shows real-time availability

## Updating Deployment

```bash
# Make code changes locally
git add .
git commit -m "Your changes"
git push origin main

# Vercel auto-deploys on push to main
# Or manually trigger deployment:
vercel --prod
```

## Cost Considerations

**Free Tier Limits:**
- **Vercel:** 100GB bandwidth, 6000 build minutes/month, hobby projects
- **Vercel Postgres:** 256MB storage, 60 compute hours/month
- **Neon:** 3GB storage, unlimited databases, 0.5 CPU hours/month
- **Supabase:** 500MB storage, 2GB bandwidth, pauses after 1 week inactivity

All options are free for development and academic projects!

---

**Need help?**
- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth Documentation](https://next-auth.js.org)
- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Local database setup guide
