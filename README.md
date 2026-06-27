<div align="center">

<img src="https://s3.login.no/beehive/img/logo/logo-white-small.svg" alt="Login logo" width="80" height="80" />

<h1>Beehive</h1>

<p>
  <img src="https://img.shields.io/badge/TypeScript-fd8738?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Bun-fd8738?style=flat-square&logo=bun&logoColor=white" alt="Bun" />
  <img src="https://img.shields.io/badge/Next.js-fd8738?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-fd8738?style=flat-square&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-fd8738?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Varnish-fd8738?style=flat-square&logo=varnish&logoColor=white" alt="Varnish" />
  <img src="https://img.shields.io/badge/Docker-fd8738?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Authentik-fd8738?style=flat-square&logo=authentik&logoColor=white" alt="Authentik" />
</p>

</div>

---

Beehive is the main website for [Login](https://login.no). It covers events, job listings, albums, company presentations, and more, and serves as the primary touchpoint for members and the public.

The application connects to several internal APIs including Workerbee, Beekeeper, TekKom-Bot, and the Internal API, and uses Authentik for authentication.

## Features

- **Log in via Authentik** (OAuth2)
- **Events, job listings, albums, companies, and more**
- **Member profile pages**
- **Status page** for Login services
- **Localized text content** managed in `public/text/`
- **Varnish cache** in front of the application

## Getting Started

1. **Configure environment**

   Create a `.env` file in the repo root. See [Configuration](#configuration) below or grab the values from 1Password.

2. **Start**

   ```bash
   docker compose up --build
   ```

   | Service | URL                   |
   |---------|-----------------------|
   | Beehive | http://localhost:3000 |

   For local development without Docker:

   ```bash
   bun install
   bun run dev
   ```

   | Service | URL                   |
   |---------|-----------------------|
   | Beehive | http://localhost:3000 |

## Configuration

All variables go in the root `.env` file.

| Name                            | Default                             | Notes                                 |
|---------------------------------|-------------------------------------|---------------------------------------|
| `AUTHENTIK_URL`                 |                                     | Base URL for your Authentik instance  |
| `AUTHENTIK_CLIENT_ID`           |                                     | OAuth2 client ID from Authentik       |
| `AUTHENTIK_CLIENT_SECRET`       |                                     | OAuth2 client secret from Authentik   |
| `WORKERBEE_API_URL`             | `https://workerbee.login.no/api/v2` | Workerbee API base URL                |
| `BEEKEEPER_API_URL`             | `https://beekeeper.login.no/api`    | Beekeeper API base URL                |
| `NEXT_PUBLIC_BEEKEEPER_WSS_URL` | `wss://beekeeper.login.no/api`      | Beekeeper WebSocket URL (client-side) |
| `TEKKOM_BOT_API_URL`            | `https://bot.login.no/api`          | TekKom-Bot API base URL               |
| `APP_API_URL`                   | `https://app.login.no/api`          | Internal app API base URL             |
| `NEXT_PUBLIC_CDN_URL`           | `https://s3.login.no/beehive`       | CDN base URL for media assets         |
| `NEXT_PUBLIC_ALBUM_CDN_URL`     | same as `NEXT_PUBLIC_CDN_URL`       | CDN base URL for album images         |
| `PORT`                          | `3000`                              | Port exposed by the container         |

## Project Structure

- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - React components
- `src/hooks/` - Custom React hooks
- `src/utils/` - Helper utilities
- `public/text/` - Localized text content per page
- `public/` - Static assets
