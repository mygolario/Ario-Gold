# Vercel Deployment & Demo Checklist

## Environment Variables
| Key | Purpose | Notes |
| --- | --- | --- |
| `DATABASE_URL` | PostgreSQL connection via Neon + PgBouncer | Use pooled endpoint: `postgresql://user:pass@neonhost/db?sslmode=require&pgbouncer=true&pgbouncer_transaction_mode=true`. |
| `NEXTAUTH_URL` | Base URL for NextAuth | In production set to `https://<vercel-domain>` |
| `NEXTAUTH_SECRET` | JWT encryption key | Generate with `openssl rand -base64 32`. |
| `EMAIL_SERVER`, `EMAIL_FROM` | (Optional) future email/OTP | Leave empty for now. |

## Vercel Configuration
1. Framework preset: **Next.js**.
2. Build command: `npm run build` (default).
3. Install command: `npm install`.
4. Output: `.next` (default).
5. Set environment variables from `.env.production` template.
6. Enable **Automatic Static Optimization** (default) and `NODE_ENV=production`.

## Database (Neon + PgBouncer)
- Create a pooled connection string in Neon dashboard.
- Append `?sslmode=require&pgbouncer=true&pgbouncer_transaction_mode=true`.
- Set connection timeout to at least 30 seconds.
- Ensure `pooler_mode` = `transaction`.

## Demo Mode
After deployment, run `npm run seed:demo` against the production database (or staging copy).
- Admin: `admin@ario-gold.ir / DemoPass123!`
- KYC Officer: `kyc@ario-gold.ir / DemoPass123!`
- User: `user@ario-gold.ir / DemoPass123!`

## Smoke Test Checklist
1. **Registration/Login** – Sign up a fresh user, verify email/password login.
2. **KYC Upload** – Upload docs, confirm status changes after admin approval.
3. **Buy Gold** – Submit a buy order; confirm fiat wallet debits and gold credits plus audit entry.
4. **Sell Gold** – Reverse flow; confirm balances/audit.
5. **Wallet Adjustment** – As admin, adjust balances and confirm ledger entry.
6. **Delivery Request** – User submits request; admin approves/rejects and verify refunds on rejection.
7. **Audit Logs** – `/admin/audit-logs` shows each action.
8. **Console** – Check browser + server logs for warnings.

## Demo Flow for Professor
1. Visit `https://<vercel-domain>`.
2. Login as admin (`admin@ario-gold.ir / DemoPass123!`).
3. Review dashboard stats, pending KYC, audit logs.
4. Logout and login as user (`user@ario-gold.ir / DemoPass123!`).
5. Walk through dashboard, buy/sell, delivery request pages.
6. Optional: create a new user to showcase registration/KYC.

