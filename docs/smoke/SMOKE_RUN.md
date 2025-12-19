# Smoke Run - MVP Barber Agenda
Date: YYYY-MM-DD
Env: local (SQLite)
Commit: <git rev-parse --short HEAD>

## Steps
- Seed: OK
- Booking: OK (status 200/201)
- Admin agenda: OK (local day filter)
- Barber restrictions: OK
- Refresh session: OK

## Proof
- Screenshots:
  - /book success
  - /admin/agenda shows appointment
  - /admin/services blocked for BARBER
  - refresh still logged in
- Network/Logs:
  - booking request 200/201
  - agenda request 200

## Pass/Fail Checklist
- [ ] Seed ran successfully (no errors)
- [ ] Public booking created (200/201)
- [ ] Admin agenda shows appointment for local day
- [ ] Barber role cannot access admin-only pages (redirect/blocked)
- [ ] Session survives refresh (still authenticated)
