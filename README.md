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

## Deploy (joshualyness / eu-west-1)

Uses the same AWS profile as `Sites/ninety-two` (`joshualyness`, account `699764791980`), region `eu-west-1`.

```bash
cd api
# api/.env.dev already points at joshualyness / eu-west-1
npm run build
npm run apply:dynamo:dev
npm run apply:cognito:dev
npm run apply:api:dev
```

Dev API (current): `https://2jjufwba90.execute-api.eu-west-1.amazonaws.com/trpc`

Custom domain / SES custom email sender are deferred — Cognito uses `COGNITO_DEFAULT` email until an SES identity is attached.
