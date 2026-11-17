# Spot

Monorepo for the Spot mobile app and API.

## Layout

- `app/` — Expo (React Native) client
- `api/` — `spot-api` (tRPC Lambda + Cognito/Dynamo/Terraform)

## Prerequisites

- Node 24+
- AWS credentials later (do not deploy until `.env.dev` is filled in)

## Install

```bash
npm install
```

## Local API (tRPC)

```bash
npm run dev:api
```

Serves `http://localhost:4000/trpc`. The Expo app calls `user.demo` and displays first/last name.

## Expo app

```bash
npm run dev:app
```

Optional: set `EXPO_PUBLIC_API_URL` in `app/.env` (see `app/.env.example`).

## Deploy (when credentials are ready)

1. Copy `api/.env.example` → `api/.env.dev` and fill `AWS_DEPLOYMENT_ACCOUNT_ID`, profile/role, and update `api/app-config.yml` (domain + hosted zone) and Cognito SES `mail_domain` in `api/infra/global/cognito/locals.tf`.
2. Ensure the Terraform state bucket/lock table naming matches your account bootstrap.
3. Deploy in order:

```bash
cd api
npm run build
npm run apply:dynamo:dev
npm run apply:cognito:dev
npm run apply:api:dev
```

Nothing has been deployed from this scaffold yet.
