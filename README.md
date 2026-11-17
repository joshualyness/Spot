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

## Auth model

1. Client sends Cognito **access token**: `Authorization: Bearer <token>`.
2. tRPC `createContext` verifies the JWT (JWKS) and resolves Spot `userId` from Cognito `custom:id`.
3. `protectedProcedure` rejects unauthenticated calls.
4. `user.get` / `user.update` / `user.delete` **always** use `ctx.userId` — there is no `userId` input, so you can only touch the signed-in user.

Local pre-Cognito bypass (API sets `ALLOW_LOCAL_AUTH=true`): `Authorization: Bearer local:<userId>`.

## Local API (tRPC)

```bash
npm run dev:api
```

Serves `http://localhost:4000/trpc`.

## Expo app

```bash
npm run dev:app
```

Copy `app/.env.example` → `app/.env` (`EXPO_PUBLIC_LOCAL_USER_ID` + optional `EXPO_PUBLIC_API_URL`).

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
