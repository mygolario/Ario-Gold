# Prisma Studio Usage

## Quick Start

```powershell
npm run studio
```

This will launch Prisma Studio on http://localhost:5555 with the binary query engine.

## Troubleshooting Connection Issues

If you see `ECONNRESET` or `Response from the Engine was empty` errors:

### Option 1: Use Direct Neon Endpoint (Recommended)

The pooled endpoint (`-pooler` hostname) can cause connection drops with Studio. Use the direct compute endpoint instead:

```powershell
# Set the direct (non-pooler) Neon URL temporarily
$env:DATABASE_URL="postgresql://neondb_owner:npg_ytA2Lj8cXfBs@ep-weathered-math-agiylbnv.eu-central-1.aws.neon.tech/neondb?sslmode=require"

# Run Studio
npm run studio
```

**Note:** Get the exact direct URL from your Neon console (Connection Details → Direct connection).

### Option 2: Check Network/Firewall

- Ensure your ISP/VPN/firewall allows outbound PostgreSQL connections (port 5432)
- Try from a different network if issues persist
- Check Neon dashboard for any service disruptions

### Option 3: Verify Database Connectivity

```powershell
# Test connection and pull schema
npx prisma db pull
```

If this fails, it's a credentials/network issue rather than Studio-specific.

## Engine Configuration

The `npm run studio` script forces the **binary query engine** for better Windows compatibility. If you still see engine errors:

```powershell
# Regenerate Prisma Client
npx prisma generate

# Clear node_modules/.prisma cache if needed
Remove-Item -Recurse -Force node_modules/.prisma -ErrorAction SilentlyContinue
npx prisma generate
```

## Environment Variables

Studio uses `DATABASE_URL` from:
1. Shell environment variable (highest priority)
2. `.env` file via `prisma.config.ts`

To override for Studio only:
```powershell
$env:DATABASE_URL="your-direct-neon-url"
npm run studio
```
