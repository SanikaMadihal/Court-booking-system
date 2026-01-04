# KLE Tech Sports Arena Court Booking System

A full-stack Next.js application for managing sports court bookings at KLE Technological University's sports arena. Built with Next.js 16, TypeScript, Prisma, NextAuth, and Tailwind CSS.

## Features

### 🔐 Authentication
- User registration and login system
- Secure password hashing with bcrypt
- Session management with NextAuth
- Protected routes and API endpoints

### 🏸 Court Booking
- Book courts for Badminton, Table Tennis, and Squash
- 24-hour advance booking window
- Real-time availability tracking with booking counters
- Time slot management (50-minute sessions)
- Multi-court support with different capacities
- Automatic validation and capacity management

### 📅 Calendar View
- View all bookings in calendar format
- Filter by sport type
- See upcoming events and tournaments
- Contact information for arena

### 👤 User Profile
- View complete booking history
- Real-time booking statistics (total, upcoming, penalties)
- Track active penalties and restrictions
- Account settings management
- Secure logout functionality

### ⚠️ Penalty System
- **Low (Warning)**: No booking restrictions, expires in 30 days
- **Medium**: Maximum 3 bookings per week, expires in 90 days  
- **High**: Maximum 2 bookings per week, expires in 90 days
- Staff can manage and resolve penalties

### 🎯 Events Management
- View upcoming sports events and tournaments
- Staff can create and manage events
- Event calendar integration
- Email notifications

### 👨‍💼 Staff Features
- View and manage all bookings
- Issue penalties for no-shows or violations
- Custom cancellation with notes
- Penalty status management (active/resolved)
- Event creation and management

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Database:** PostgreSQL (via Prisma ORM)
  - Local: PostgreSQL 16 or free tier (Neon, Supabase)
  - Production: Vercel Postgres or Neon
- **Authentication:** NextAuth v5
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI, shadcn/ui
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- PostgreSQL database (local or free hosted)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/hegdev13/sports-arena-court-booking.git
cd sports-arena-court-booking
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up database**

Choose one option:

**Option A: Local PostgreSQL** (if installed)
```bash
createdb sports_arena
```

**Option B: Free Hosted Database** (easiest)
- Sign up at [Neon](https://neon.tech) (3GB free)
- Create a project and copy the connection string

See [DATABASE_SETUP.md](DATABASE_SETUP.md) for detailed instructions.

4. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your database connection:
```env
DATABASE_URL="postgresql://user:password@host:5432/sports_arena"
DIRECT_URL="postgresql://user:password@host:5432/sports_arena"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-min-32-chars"
NODE_ENV="development"
```

5. **Initialize database**
```bash
npm run db:setup
```

This will:
- Run Prisma migrations
- Seed initial data (test users, courts, events)

6. **Start the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Default Test Accounts

After seeding, you can login with:

**Student Account:**
- **Email:** test@kletech.ac.in
- **Password:** test123
- **Access:** Book courts, view profile, see penalties

**Staff Account:**
- **Email:** staff@kletech.ac.in
- **Password:** staff123
- **Access:** Manage bookings, issue penalties, create events

**Admin Account:**
- **Email:** admin@kletech.ac.in
- **Password:** admin123
- **Access:** Full system access

## Database Schema

### Models

- **User** - User accounts with role-based access (student/staff/admin)
- **Court** - Sports courts with sport type, capacity, and availability
- **Booking** - Court reservations with 24-hour window validation
- **Penalty** - User penalties with severity levels and booking restrictions
- **Event** - Upcoming sports events and tournaments

### Penalty System Details

- **severity**: `low` (warning), `medium` (3 bookings/week), `high` (2 bookings/week)
- **status**: `active` or `resolved`
- **expiresAt**: Automatic expiry (30 days for warnings, 90 days for restrictions)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth endpoints (login, logout, session)

### Bookings
- `GET /api/bookings` - Get user bookings with court details
- `POST /api/bookings` - Create booking (validates 24-hour window and capacity)
- `GET /api/bookings/all` - Get all bookings (staff only, supports date filtering)
- `PATCH /api/bookings/[id]` - Update booking
- `DELETE /api/bookings/[id]` - Cancel booking

### Courts
- `GET /api/courts` - Get all courts (filtered by sport type)

### User
- `GET /api/user/profile` - Get user profile with statistics
- `PATCH /api/user/profile` - Update profile

### Penalties
- `GET /api/penalties` - Get user penalties

### Events
- `GET /api/events` - Get upcoming events (supports month/year filtering)
- `POST /api/events` - Create event (staff only)
- `DELETE /api/events/[id]` - Delete event (staff only)

### Staff Endpoints
- `POST /api/staff/manage-booking` - Issue penalties and manage bookings
- `GET /api/staff/penalties` - View all penalties
- `PATCH /api/staff/penalties` - Update penalty status (active/resolved)

## Project Structure

```
sports-arena-court-booking/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── booking/           # Booking page
│   ├── calendar/          # Calendar page
│   ├── login/             # Login page
│   ├── profile/           # Profile page
│   ├── signup/            # Signup page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # UI components
│   └── ...               # Feature components
├── lib/                  # Utility functions
│   ├── auth.ts           # NextAuth config
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Helper functions
├── prisma/               # Database
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed data
├── public/               # Static assets
└── types/                # TypeScript types
```

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:seed      # Seed database with data
npm run db:setup     # Setup and seed database
```

## Contributing

This is a collaborative project. To contribute:

1. **Pull latest changes**
```bash
git pull origin main
```

2. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

3. **Make your changes and commit**
```bash
git add .
git commit -m "Description of your changes"
```

4. **Push to GitHub**
```bash
git push origin feature/your-feature-name
```

5. **Create a Pull Request** on GitHub

## Team Collaboration Tips

- Always pull latest changes before starting work
- Create feature branches for new features
- Write clear commit messages
- Test your changes locally before pushing
- Review Pull Requests from teammates
- Keep the main branch stable

## Deployment to Vercel

This project is fully configured for Vercel deployment with PostgreSQL.

### Quick Deploy Steps

1. **Create PostgreSQL database**
   - Recommended: [Vercel Postgres](https://vercel.com/storage) (built-in integration)
   - Alternative: [Neon](https://neon.tech) (3GB free)

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

3. **Deploy to Vercel**
   - Import your GitHub repository at [vercel.com](https://vercel.com)
   - Vercel will auto-detect Next.js

4. **Configure Environment Variables** (in Vercel dashboard)
   ```
   DATABASE_URL=your_postgres_connection_string
   DIRECT_URL=your_direct_postgres_url
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=generate_random_32_char_string
   NODE_ENV=production
   ```

5. **Run Migrations** (after first deploy)
   ```bash
   # From your terminal (with production DATABASE_URL)
   npx prisma migrate deploy
   npx tsx prisma/seed.ts
   ```

For detailed instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

## Support & Contact

- **Arena Email**: arena@kletech.ac.in
- **Feedback**: feedback@kletech.ac.in
- **Phone**: +91 9876543210

## License

This project is developed for KLE Technological University's Sports Arena management system.
     - `NEXTAUTH_URL` - Your Vercel URL (e.g., `https://your-app.vercel.app`)
     - `NEXTAUTH_SECRET` - Run `openssl rand -base64 32` to generate
     - `NODE_ENV=production`

4. **Deploy and initialize database**
   ```bash
   # After deployment, run migrations
   npx prisma db push
   ```

📖 **Full deployment guide:** See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Future Enhancements

- [ ] Email notifications for bookings
- [ ] Payment integration for court fees
- [ ] Admin dashboard for court management
- [ ] Mobile app version
- [ ] Court availability notifications
- [ ] Booking reminders
- [ ] User reviews and ratings
- [ ] Equipment rental system

## License

This project is created for educational purposes.

## Support

For questions or issues, please open an issue on GitHub or contact the development team.

---

Built with ❤️ for campus sports enthusiasts
