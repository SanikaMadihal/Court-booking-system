# Sports Arena Court Booking System

A full-stack Next.js application for managing sports court bookings at your campus sports arena. Built with Next.js 16, TypeScript, Prisma, NextAuth, and Tailwind CSS.

## Features

### 🔐 Authentication
- User registration and login system
- Secure password hashing with bcrypt
- Session management with NextAuth
- Protected routes and API endpoints

### 🏸 Court Booking
- Book courts for Badminton, Table Tennis, and Squash
- Real-time availability checking
- Time slot management (50-minute sessions)
- Multi-court support with different capacities

### 📅 Calendar View
- View all bookings in calendar format
- Filter by sport type
- See upcoming and past bookings

### 👤 User Profile
- View booking history
- Manage account settings
- Track active penalties
- Booking statistics

### 🎯 Events
- View upcoming sports events
- Tournament announcements
- Event registration information

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** SQLite (via Prisma ORM)
- **Authentication:** NextAuth v5
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Form Validation:** Zod + React Hook Form

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd sports-arena-court-booking
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and update the following:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
NODE_ENV="development"
```

4. **Set up the database**
```bash
npm run db:setup
```

This will:
- Create the SQLite database
- Run migrations
- Seed initial data (test user, courts, events)

5. **Start the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Default Test Account

After seeding, you can login with:
- **Email:** test@university.edu
- **Password:** password123

## Database Schema

### Models

- **User** - User accounts with authentication
- **Court** - Sports courts with capacity info
- **Booking** - Court reservations with time slots
- **Penalty** - User penalties for violations
- **Event** - Upcoming sports events

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking
- `PATCH /api/bookings/[id]` - Update booking
- `DELETE /api/bookings/[id]` - Cancel booking

### Courts
- `GET /api/courts` - Get all courts (filtered by sport/date)

### User
- `GET /api/user/profile` - Get user profile
- `PATCH /api/user/profile` - Update profile

### Penalties
- `GET /api/penalties` - Get user penalties

### Events
- `GET /api/events` - Get upcoming events

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
