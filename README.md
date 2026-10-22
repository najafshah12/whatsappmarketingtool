# WaStudio

A WhatsApp Business campaign management workspace built with Next.js, React, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

## What works

- Contact management with validation, search, group filtering, opt-out controls, CSV import/export, editing, and deletion.
- Campaign drafts and scheduled records, audience eligibility counts, and status management. Opted-out contacts are excluded from the audience count.
- Message template records and local approval-status tracking.
- Dashboard and reports backed by persisted records. Delivery and read counts are not estimated.
- Official WhatsApp Cloud API configuration status and webhook verification endpoint.

Live message submission and Meta template synchronization require an authorized Meta Business account and credentials. Campaigns are not sent by this app yet. Do not treat saved campaigns or local template status as provider submission or approval.

## Requirements

- Node.js 20+
- pnpm (or npm)
- PostgreSQL 16+
- Docker Compose (optional, to run PostgreSQL)

## Development startup

1. Install dependencies: `pnpm install`
2. Copy `.env.example` to `.env` and set `DATABASE_URL`.
3. Start a PostgreSQL instance. With Docker: `docker compose up -d postgres`
4. Apply schema and generate Prisma Client: `pnpm run prisma:migrate` then `pnpm run prisma:generate`
5. Start Next.js: `pnpm run dev`
6. Open `http://localhost:3000`.

The app requires a database for API requests. It shows an actionable connection error when PostgreSQL is unavailable.

## WhatsApp setup

Set `WA_ACCESS_TOKEN`, `WA_PHONE_NUMBER_ID`, `WA_BUSINESS_ACCOUNT_ID`, `WA_WEBHOOK_VERIFY_TOKEN`, and `WA_APP_SECRET` in the server environment, then restart the app. Configure Meta's webhook callback URL as `https://your-domain/api/webhook` and use the same verify token. The GET verification handshake is implemented. Signed webhook status ingestion is implemented and checks `x-hub-signature-256`. Outbound message submission and provider template synchronization are not yet implemented; credentials alone do not enable sending.

## Tests and production build

- Type check: `pnpm exec tsc --noEmit`
- Production build: `pnpm run build`
- Start production server: `pnpm run start`

Playwright is not wired into this initial project. No tests are reported as passing until configured and run against a database-backed instance.

## Deployment

Build the application with `pnpm run build`; run it with `pnpm run start`, with PostgreSQL reachable through `DATABASE_URL`. `docker-compose.yml` describes a local PostgreSQL service and app container. Create `.env` from the example and use strong, private values in deployment. Do not commit credentials.

## Security notes

The current workspace UI is a single-admin prototype with no login or authorization middleware. Do not expose it publicly until authentication, authorization, webhook signature validation, and rate limiting have been added. API routes validate user input and avoid returning server-side exceptions or credentials.



