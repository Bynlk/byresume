# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ByResume is a Chinese-language smart resume editor built on Next.js 14 (App Router). It features drag-and-drop section reordering, rich text editing via TipTap, AI-powered content optimization, and PDF export. The app uses a `basePath` of `/byresume`.

## Commands

- **Dev**: `npm run dev` — starts on port 3000
- **Build**: `npm run build` — runs font download (`scripts/download-fonts.js`) then `next build`
- **Production**: `npm run start` — port 3001 (PM2 via `ecosystem.config.js`)
- **Lint**: `npm run lint`
- **Type check**: `npm run type-check` (runs `tsc --noEmit`)
- **Format**: `npm run format` (Prettier)
- **DB migrations**: `npx prisma migrate dev`
- **DB seed**: `npx prisma db seed`

There are no tests configured in this project.

## Architecture

### Data Flow

- **State management**: Zustand store at `store/resumeStore.ts` manages all resume data. Every mutation auto-persists to `localStorage` under key `byresume_data`.
- **Types**: Core `ResumeData` interface and sub-types are in `types/index.ts`.
- **Initial data**: `config/initialData.ts` provides default resume content; `lib/resume/actions.ts` has server actions (currently returning static data).
- **AI config**: Stored separately in `localStorage` under key `ai-config` (provider, API key, model).

### PDF Export (two approaches)

1. **Puppeteer (primary)**: `app/api/export-pdf/route.ts` launches headless Chromium, navigates to `app/pdf-render/page.tsx` with resume data as a query param, and generates an A4 PDF. This runs on Node.js runtime (`export const runtime = 'nodejs'`).
2. **@react-pdf/renderer**: Referenced in `lib/pdf/README.md` but the actual implementation files are not present in `lib/pdf/` (only the README exists).

Font files for Chinese support are downloaded at build time via `scripts/download-fonts.js` into `public/fonts/noto/`.

The `next.config.js` sets `canvas: false` and `encoding: false` webpack aliases for @react-pdf/renderer compatibility, and externalizes `@react-pdf/renderer` and `puppeteer` as server component external packages.

### AI Service

- **Client-side**: `lib/ai/aiService.ts` (`'use client'`) handles provider config (OpenAI, DeepSeek, Anthropic, custom), prompt construction, and SSE stream parsing. Config is stored in `localStorage` under key `ai-config`.
- **Server proxy**: `app/api/ai/chat/route.ts` runs on Edge runtime and proxies streaming requests to the selected AI provider. The client never calls provider APIs directly.
- API calls from client use the path `/byresume/api/ai/chat` (includes basePath).

### Authentication

- NextAuth v4 with Credentials provider (`lib/auth.ts`) using bcryptjs password hashing.
- JWT session strategy. Protected route: `/dashboard/:path*` (via `middleware.ts`).
- Login page: `/login` (configured in middleware's `pages.signIn`).
- Prisma adapter configured for user persistence.

### Database

- SQLite via Prisma (`prisma/schema.prisma`). Models: User, Resume, ExportEvent, AIUsageEvent, SessionEvent, TemplateUsage, Feedback.
- Singleton Prisma client pattern in `lib/db.ts` (globalThis caching for dev HMR).

### Routes

- `/` — Landing page
- `/editor` — Resume editor (main app)
- `/admin` — Admin dashboard (password-protected)
- `/pdf-render` — PDF rendering page (used by Puppeteer export)
- `/login`, `/register` — Auth pages
- `/about`, `/contact`, `/terms`, `/privacy` — Static pages

### Component Structure

- `components/editor/` — Editor sections: PersonalInfo, Experience, Education, Skills, Projects, CustomSection, plus SortableItem (dnd-kit) and TextStyleEditor (TipTap).
- `components/ui/` — Shared UI primitives: Button, Card, Tabs, Skeleton, InputGroup, RichTextEditor, dropdown-menu, avatar, icons.
- `components/providers/` — ThemeProvider (next-themes), AuthProvider.
- `components/layout/` — MainNav.
- `components/admin/` — Admin dashboard components (TrendChart, TimeFilter, PasswordModal, SettingsModal).
- `components/PreviewPanel.tsx` — Live resume preview.
- `components/ResumeEditor.tsx` — Main editor orchestrator.

### Key Libraries

| Purpose | Library |
|---------|---------|
| Drag & drop | @dnd-kit/core, @dnd-kit/sortable |
| Rich text | @tiptap/react, @tiptap/starter-kit |
| PDF render | @react-pdf/renderer, puppeteer |
| State | zustand |
| Auth | next-auth v4 |
| DB | prisma + @prisma/client (SQLite) |
| UI | Radix UI, lucide-react, sonner, framer-motion |
| Charts | recharts |

## Path Aliases

Uses `@/*` mapped to project root (standard Next.js `tsconfig.json` paths).

## Environment Variables

See `.env.example`. Key vars: `DATABASE_URL` (SQLite), `NEXTAUTH_SECRET`, `NEXTAUTH_URL`. Optional: `ADMIN_PASSWORD` for admin panel.

**Note**: `.env.example` shows a PostgreSQL URL as placeholder, but the Prisma schema uses SQLite. Set `DATABASE_URL` to `file:./dev.db` for local development.

## Deployment

PM2 cluster mode on port 3001. Run `./deploy.sh` for full deploy cycle (git pull, npm install, build, pm2 restart). Logs go to `./logs/`.

## Admin Dashboard

The `/admin` page requires an `ADMIN_PASSWORD` environment variable. Stats are fetched via `hooks/useAdminStats.ts` which queries the Prisma models for export events, AI usage, sessions, and feedback.
