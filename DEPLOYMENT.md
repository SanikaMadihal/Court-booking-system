# Vercel Deployment Guide

## Important: Database Configuration for Production

**⚠️ SQLite won't work on Vercel** because Vercel uses serverless functions that have read-only filesystems. You need to use a hosted database.

### Recommended Database Options (Free Tier Available)

#### Option 1: Vercel Postgres (Recommended)
Vercel's own PostgreSQL database with generous free tier.

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Storage** tab
4. Click **Create Database** → Choose **Postgres**
5. Vercel will automatically set `POSTGRES_URL` environment variable

**Update Prisma Schema:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

#### Option 2: Neon (PostgreSQL)
Serverless Postgres with 3GB free tier.

1. Sign up at https://neon.tech
2. Create a new project
3. Copy the connection string
4. Add to Vercel environment variables as `DATABASE_URL`

#### Option 3: PlanetScale (MySQL)
Serverless MySQL with 5GB free tier.

1. Sign up at https://planetscale.com
2. Create a new database
3. Copy the connection string
4. Update Prisma schema to use `mysql` provider

## Deployment Steps

### Step 1: Choose and Set Up Your Database

Pick one of the options above and get your database connection string.

### Step 2: Update Prisma Schema (if not using Vercel Postgres)

Edit `prisma/schema.prisma`:

**For PostgreSQL (Neon or Vercel Postgres):**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**For MySQL (PlanetScale):**
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
  relationMode = "prisma"
}
```

### Step 3: Push to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 4: Deploy to Vercel

#### Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com
2. Click **Add New** → **Project**
3. Import your GitHub repository: `sports-arena-court-booking`
4. Configure project:
   - **Framework Preset:** Next.js
   - **Build Command:** `prisma generate && next build`
   - **Output Directory:** `.next`

5. **Add Environment Variables** (click Environment Variables):
   ```
   DATABASE_URL=your_database_connection_string
   NEXTAUTH_URL=https://your-project.vercel.app
   NEXTAUTH_SECRET=your_secret_key_here_generate_a_long_random_string
   NODE_ENV=production
   ```

6. Click **Deploy**

#### Via Vercel CLI (Alternative)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_URL
vercel env add NEXTAUTH_SECRET
vercel env add NODE_ENV

# Deploy to production
vercel --prod
```

### Step 5: Initialize Database

After deployment, you need to create the tables:

**Option A: Using Vercel CLI**
```bash
# Set environment variables locally for the deployment
vercel env pull .env.production

# Push schema to production database
npx prisma db push

# Seed the database
npx prisma db seed
```

**Option B: Using Prisma Studio**
```bash
# Connect to production database
DATABASE_URL="your_production_db_url" npx prisma studio
```

**Option C: Add Migration as Build Step**
Update `package.json`:
```json
"scripts": {
  "build": "prisma generate && prisma db push --accept-data-loss && next build"
}
```

⚠️ **Warning:** This will run migrations on every deploy. Only use during initial setup.

### Step 6: Seed Production Database

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

### Build fails with "Can't reach database"
- Vercel needs `DATABASE_URL` at build time
- Add it to environment variables and redeploy

### Pages return 500 errors
- Check Vercel function logs
- Ensure all environment variables are set
- Verify database connection string

### "Prisma Client not found"
- Ensure `postinstall` script runs: `"postinstall": "prisma generate"`
- Check build logs to confirm Prisma generation

### Middleware errors
- Ensure `NEXTAUTH_SECRET` is set
- Check that it matches between build and runtime

## Quick Start Checklist

- [ ] Choose database provider (Vercel Postgres, Neon, or PlanetScale)
- [ ] Update `prisma/schema.prisma` with correct provider
- [ ] Create database and get connection string
- [ ] Push code to GitHub
- [ ] Import project to Vercel
- [ ] Add environment variables
- [ ] Deploy
- [ ] Run database migrations
- [ ] Seed database
- [ ] Test the deployment

## Cost Considerations

**Free Tier Limits:**
- **Vercel:** 100GB bandwidth, 6000 build minutes/month
- **Vercel Postgres:** 256MB storage, 60 compute hours
- **Neon:** 3GB storage, unlimited databases
- **PlanetScale:** 5GB storage, 1 billion row reads

All options are free for development and small projects!

## Next Steps

After deployment:
1. Set up custom domain (optional)
2. Configure analytics
3. Add monitoring (Vercel Analytics included)
4. Set up error tracking (Sentry)
5. Configure CI/CD for automatic deployments

---

Need help? Check:
- [Vercel Docs](https://vercel.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth Docs](https://next-auth.js.org)
