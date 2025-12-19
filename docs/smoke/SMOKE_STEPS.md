# Smoke Steps - MVP Barber Agenda (Manual)

## 0) Clean start
From repo root:
```
npm install
npx prisma generate
npx prisma migrate dev
npx tsx -r dotenv/config ./prisma/seed.ts
npm run dev
```
Expected:
- Terminal shows Next.js "Ready"
- Seed completes without error
Evidence:
- Screenshot of terminal with Ready + seed OK

## 1) Public booking flow
Open: http://localhost:3000/book
Steps:
- Select a service
- Select a barber
- Pick today + an open time slot
- Fill name, phone, email
- Submit booking
Expected:
- Success toast/message (Appointment booked/confirmed)
- Network: POST /api/public/appointments returns 200/201
- No 500 errors in console
Evidence:
- Screenshot of booking success
- Screenshot of Network request with status 200/201

## 2) Admin sees the appointment (local day)
Login with seed admin:
- Email: dueno@barberagenda.com
- Password: Admin123!
Go to /admin/agenda
Steps:
- Select today
- Confirm the appointment appears
Expected:
- Appointment visible for the same local day
Evidence:
- Screenshot of admin agenda showing the appointment

## 3) Barber agenda + role UI
Login with seed barber:
- Email: pedro@barberagenda.com
- Password: Barber123!
Steps:
- Try /admin/barbers and /admin/services
- Go to /admin/agenda
- Refresh the page (F5)
Expected:
- /admin/barbers and /admin/services are blocked/redirected
- Barber sees their appointments in agenda
- Session persists after refresh
Evidence:
- Screenshot of block/redirect
- Screenshot of barber agenda showing appointment
- Screenshot after refresh with session still active

## Pass/Fail checklist
- [ ] Seed OK
- [ ] Booking OK (200/201)
- [ ] Admin agenda shows booking (local day)
- [ ] Barber restrictions OK
- [ ] Session persists after refresh
