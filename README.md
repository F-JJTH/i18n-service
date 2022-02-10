

# Kizeo

This project was generated using [Nx](https://nx.dev).

## Serve i18n-web

Run `nx serve i18n-web` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Setup i18n-backend

Copy file `apps/i18n-backend/.env.prod` to `apps/i18n-backend/.env` then modify content for your needs
Copy file `apps/i18n-backend/ormconfig-cli.json` to `apps/i18n-backend/ormconfig-cli.json` then modify content for your needs
Copy file `apps/i18n-backend/ormconfig.json` to `apps/i18n-backend/ormconfig.local.json` then modify content for your needs

## Serve i18n-backend

Run `nx serve i18n-backend`

## Migration

Run `npm run migration:generate` to generate a migration.
Run `npm run migration:create` to create a migration.
Run `npm run migration:run` to run migration to your local database.

## Build for Production

Run `nx build i18n-web --c production` to build i18n-web in production. Results is found in `dist/apps/i18n-web`
Run `nx build i18n-backend --c production` to build i18n-web in production. Results is found in `dist/apps/i18n-backend`

## Deploy i18n-backend

Deployment of i18n-backend require some files at the root of build directory (`dist/apps/i18n-backend`)
 - .env (copied from `apps/i18n-backend/.env.prod`)
 - ormconfig.prod-cli.json (copied from `apps/i18n-backend/ormconfig.prod-cli.json`)
 - package.json (copied from `package.json`)
 - node_modules (generated from `npm install`)