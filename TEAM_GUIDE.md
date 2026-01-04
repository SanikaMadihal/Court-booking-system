# KLE Tech Sports Arena - Team Guide

## First Time Setup

### 1. Clone the Repository
```bash
git clone https://github.com/hegdev13/sports-arena-court-booking.git
cd sports-arena-court-booking
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment
```bash
# Copy the example env file
cp .env.example .env

# The .env file is already configured for local development
# No changes needed for local testing!
```

### 4. Set Up Database
```bash
# This creates the database and adds test data
npm run db:setup
```

### 5. Start Development Server
```bash
npm run dev
```

Visit http://localhost:3000

### 6. Test the Application

**Student Account:**
- Email: `test@kletech.ac.in`
- Password: `test123`

**Staff Account:**
- Email: `staff@kletech.ac.in`
- Password: `staff123`

Or create a new student account at http://localhost:3000/signup

## Daily Workflow

### Before Starting Work
```bash
# Always pull latest changes first
git pull origin main

# Install any new dependencies
npm install

# If database schema changed, reset it
npm run db:setup
```

### While Working
```bash
# Create a new branch for your feature
git checkout -b feature/your-feature-name

# Make your changes
# Test locally

# Stage and commit
git add .
git commit -m "Clear description of your changes"
```

### Pushing Your Work
```bash
# Push to GitHub
git push origin feature/your-feature-name

# Then create a Pull Request on GitHub
```

## What's Already Built

### ✅ Complete Features

#### Authentication & Authorization
- User registration with bcrypt password hashing
- Role-based access (student/staff/admin)
- Secure session management with NextAuth v5
- Protected routes and API endpoints
- Working logout functionality

#### Booking System
- 24-hour advance booking window
- Real-time availability tracking
- Booking capacity validation
- Automatic slot filtering (past slots disabled)
- Court-specific capacity management

#### Penalty System
- Low (Warning): No restrictions, 30-day expiry
- Medium: Max 3 bookings/week, 90-day expiry
- High: Max 2 bookings/week, 90-day expiry
- Staff can issue and resolve penalties

#### Staff Management
- View all bookings with user details
- Issue penalties for no-shows
- Custom cancellation with notes
- Manage penalty status (active/resolved)
- Create and manage events

#### Database
- Users (with roles)
- Courts (7 courts: 2 Badminton, 3 Table Tennis, 2 Squash)
- Bookings (with 24-hour validation)
- Penalties (severity-based restrictions)
- Events (tournaments and activities)
  - `/api/courts` - Get available courts
  - `/api/user/profile` - User profile
  - `/api/penalties` - User penalties
  - `/api/events` - Upcoming events

### 🔨 Frontend (Needs Backend Integration)
- **Pages Created**
  - Home page with sport listings
  - Booking page (needs API integration)
  - Calendar page (needs API integration)
  - Profile page (needs API integration)
  - Login page (✅ Working)
  - Signup page (✅ Working)

## What Needs to Be Done

### Priority 1: Connect Booking Page to Backend
The booking page needs to:
1. Fetch courts from `/api/courts?sport=badminton`
2. Show real availability from database
3. Save bookings to `/api/bookings`

### Priority 2: Connect Profile Page to Backend
1. Fetch user data from `/api/user/profile`
2. Fetch bookings from `/api/bookings`
3. Fetch penalties from `/api/penalties`
4. Make logout button work with `signOut()`

### Priority 3: Connect Calendar Page
1. Fetch all bookings
2. Display in calendar format
3. Add filters by sport

### Priority 4: Additional Features
- Admin dashboard
- Email notifications
- Payment integration
- Booking reminders

## Useful Commands

```bash
npm run dev              # Start dev server
npm run db:push          # Update database schema
npm run db:seed          # Add test data
npm run db:setup         # Reset and seed database
npm run build            # Build for production
git status               # Check what files changed
git log --oneline        # See recent commits
```

## Database Access

The SQLite database is at `prisma/dev.db`. You can:

1. Use Prisma Studio to view data:
```bash
npx prisma studio
```

2. Reset database if needed:
```bash
npm run db:setup
```

## Common Issues

**Issue: "Database not found"**
```bash
npm run db:setup
```

**Issue: "Cannot find module"**
```bash
npm install
```

**Issue: "Port 3000 already in use"**
```bash
# Kill the process or use a different port
npm run dev -- -p 3001
```

**Issue: Git conflicts**
```bash
git pull origin main
# Resolve conflicts in VS Code
git add .
git commit -m "Resolve conflicts"
```

## Need Help?

1. Check the main README.md for detailed documentation
2. Look at existing API routes in `app/api/` for examples
3. Check the Prisma schema in `prisma/schema.prisma` for database structure
4. Open an issue on GitHub
5. Ask the team in your group chat

## Testing Your Changes

Before creating a Pull Request:

1. ✅ Test on localhost
2. ✅ Check login/logout works
3. ✅ Test booking creation
4. ✅ No console errors
5. ✅ Code follows existing patterns

Good luck coding! 🚀
