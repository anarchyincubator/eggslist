# Eggslist Frontend

Nuxt.js 2 (Vue 2) single-page application for Eggslist, a virtual farmer's market connecting local farmers and gardeners with consumers. The app runs with SSR disabled (`ssr: false`) and targets static generation (`target: "static"`), producing output in the `dist/` directory.

## Local Development with Docker

The easiest way to run the frontend is via Docker Compose from the repository root:

```bash
docker-compose up --build
```

This starts the frontend alongside the backend. The frontend is accessible at `http://localhost:3000`.

## Local Development without Docker

```bash
npm install
```

Set the `BACKEND_URL` environment variable to point at the API server, then start the dev server:

```bash
BACKEND_URL=http://localhost:8000/api npm run dev
```

The dev server runs at `http://localhost:3000` with hot reload.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `BACKEND_URL` | Yes | Base URL of the API server (consumed at build time) |
| `OG_IMAGE_URL` | No | URL for the Open Graph preview image (defaults to `/main.jpg`) |

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Production build |
| `npm run generate` | Generate static site into `dist/` |
| `npm run lint` | Run ESLint checks |
| `npm run lintfix` | Run ESLint with auto-fix |
| `npm run lint:style` | Run StyleLint on CSS/SCSS files |

## Project Structure

- **`pages/`** -- File-based routing. Nuxt reads `*.vue` files here and configures Vue Router automatically.
- **`store/`** -- Vuex store modules (`auth.js`, `user.js`, `products.js`, `seller.js`, `categories.js`, `blog.js`, `quotes.js`, `index.js`).
- **`components/`** -- Reusable Vue components.
- **`assets/sass/`** -- Global SCSS: variables, responsive breakpoints, and helpers injected via `@nuxtjs/style-resources`.

## Docker Build

To build a standalone Docker image (multi-stage build using `node:18-alpine` for the build step and `nginx:stable-alpine` for serving):

```bash
docker build --build-arg BACKEND_URL=http://example.com/api -t eggslist-frontend .
```

`BACKEND_URL` is required at build time because Nuxt bakes it into the generated static files.
