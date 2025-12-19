# Smoke Script Notes (Why no automated script)

We intentionally did NOT add an automated E2E script for login/booking because:

- This codebase uses NextAuth credentials flow, which requires CSRF token + callback handling + cookie session management.
- There is no simple first-party “login” API endpoint exposed for programmatic use.
- Implementing a reliable automation would require adding new testing harnesses or exposing endpoints, which goes beyond the scope of “no new features” for MVP close-out.

Decision:
- Use manual smoke steps + screenshots + network status codes as the official MVP evidence.
- Consider adding Playwright/Cypress automation only after MVP is declared functional.
