# Intellect Bulk Sender

A WhatsApp Business campaign workspace built with Next.js, React, TypeScript, Prisma, and PostgreSQL.

## Workspace modules

- Dashboard metrics and recent campaign records read from PostgreSQL.
- Inbox stores incoming messages and delivery events received through the signed WhatsApp webhook.
- Previous Campaign Records displays saved campaign delivery counts and status.
- Accounts stores sender number metadata and campaign assignments. Access tokens are not stored in account rows.
- Create Campaign saves the campaign, eligible recipients, selected audience, sender assignments, and optional schedule.
- Audience Pool stores contact lists and membership, with opt-outs excluded from campaign recipients.
- Campaign Designer saves message drafts with language and category.
- Sending & Schedule lists scheduled records and allows status changes.

The app does not include fake historical analytics. Creating a schedule stores a due time but does not start a background sender. Outbound message submission, inbox replies, and provider template synchronization require additional WhatsApp Cloud API work and credentials. A locally saved template is not a Meta-approved template.

## Requirements and startup

- Node.js 20+
- pnpm
- PostgreSQL 16+ (or Docker Compose)

1. Run `pnpm install`.
2. Copy `.env.example` to `.env` and set the local database URL.
3. Start PostgreSQL with `docker compose up -d postgres` or use another PostgreSQL server.
4. Apply migrations and generate Prisma Client with `pnpm run prisma:migrate` and `pnpm run prisma:generate`.
5. Start the app with `pnpm run dev` and open `http://localhost:3000`.

The migration adds sender accounts, campaign assignments, normalized audience groups, and inbox conversations. Existing contact group names are copied into audience membership records; existing campaign and contact data is preserved.

## WhatsApp webhook

Set `WA_ACCESS_TOKEN`, `WA_PHONE_NUMBER_ID`, `WA_BUSINESS_ACCOUNT_ID`, `WA_WEBHOOK_VERIFY_TOKEN`, and `WA_APP_SECRET` as server environment variables. Set Meta's callback URL to `https://your-domain/api/webhook`. The endpoint verifies webhook signatures before processing delivery statuses or storing incoming replies.

## Deployment

Build with `pnpm run build` and run with `pnpm run start`. Set `DATABASE_URL` and `DATABASE_URL_UNPOOLED` in the deployment environment. Apply database migrations with `pnpm exec prisma migrate deploy` before serving the updated app. Keep `.env` and all credentials out of Git.

## Security

This workspace is a single-admin prototype without login or role-based authorization. Add authentication and authorization before exposing administrative routes publicly. API routes validate user input and avoid returning server-side exceptions or credentials.
