# Barber Agenda MVP

Modern SaaS-style appointment system for barbershops. English only.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run Prisma migrations:**
   ```bash
   npx prisma migrate dev --name init
   ```

3. **Seed the database:**
   ```bash
   npx prisma db seed
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## URLs

- Public booking: [http://localhost:3000/book](http://localhost:3000/book)
- Admin/Barber login: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Seed Credentials

**Admin:**
- Email: dueno@barberagenda.com
- Password: Admin123!

**Barbers:**
- Email: pedro@barberagenda.com / Password: Barber123!
- Email: luis@barberagenda.com / Password: Barber123!

## Environment Variables

See `.env.example` for all required variables.

## Features
- Public booking, real-time availability
- Admin: manage barbers, services, profile, all appointments
- Barber: manage own profile, schedule, break, time off, appointments
- Email confirmation via Resend (safe if env missing)
- Clean, mobile-first UI
