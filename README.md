# Phoenix Printing Solutions

Architectural-grade precision meets limitless imagination. Transform vertical surfaces into living masterpieces with Phoenix Pro.

## Project Structure

- `/public`: Publicly accessible pages (Home, Invoice, Contact Us, Feedback)
- `/admin`: Private administration area (Login, Pending Queue, In Progress, Invoice Generation, Archive)
- `/assets`: Static assets (CSS, JavaScript, Images)

## Security

- Admin access is protected by a login system.
- Direct access to admin pages is restricted and redirects to the login page.
- Security policies include lockout after 3 failed attempts (standard) or 1 attempt (direct access).

## Deployment

This project is optimized for deployment on GitHub Pages.
