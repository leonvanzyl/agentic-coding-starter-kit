# Agentic Coding Boilerplate - AI Assistant Guidelines

## Project Overview

This is a Next.js 16 boilerplate for building AI-powered applications with authentication, database, and modern UI components.

### Tech Stack

- **Framework**: Next.js 16 with App Router, React 19, TypeScript
- **AI Integration**: Vercel AI SDK 5 + OpenRouter (access to 100+ AI models)
- **Authentication**: BetterAuth with Google OAuth
- **Database**: PostgreSQL with Drizzle ORM
- **UI**: shadcn/ui components with Tailwind CSS 4
- **Styling**: Tailwind CSS with dark mode support (next-themes)

## AI Integration with OpenRouter

### Key Points

- This project uses **OpenRouter** as the AI provider, NOT direct OpenAI
- OpenRouter provides access to 100+ AI models through a single unified API
- Default model: `openai/gpt-5-mini` (configurable via `OPENROUTER_MODEL` env var)
- Users browse models at: https://openrouter.ai/models
- Users get API keys from: https://openrouter.ai/settings/keys

### AI Implementation Files

- `src/app/api/chat/route.ts` - Chat API endpoint using OpenRouter
- Package: `@openrouter/ai-sdk-provider` (not `@ai-sdk/openai`)
- Import: `import { openrouter } from "@openrouter/ai-sdk-provider"`

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/
│   │   ├── auth/[...all]/       # Better Auth catch-all route
│   │   ├── chat/route.ts        # AI chat endpoint (OpenRouter)
│   │   └── diagnostics/         # System diagnostics
│   ├── chat/page.tsx            # AI chat interface (protected)
│   ├── dashboard/page.tsx       # User dashboard (protected)
│   ├── profile/page.tsx         # User profile (protected)
│   ├── page.tsx                 # Home/landing page
│   └── layout.tsx               # Root layout
├── components/
│   ├── auth/                    # Authentication components
│   │   ├── sign-in-button.tsx
│   │   ├── sign-out-button.tsx
│   │   └── user-profile.tsx
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── separator.tsx
│   │   ├── mode-toggle.tsx      # Dark/light mode toggle
│   │   └── github-stars.tsx
│   ├── site-header.tsx          # Main navigation header
│   ├── site-footer.tsx          # Footer component
│   ├── theme-provider.tsx       # Dark mode provider
│   ├── setup-checklist.tsx      # Setup guide component
│   └── starter-prompt-modal.tsx # Starter prompts modal
└── lib/
    ├── auth.ts                  # Better Auth server config
    ├── auth-client.ts           # Better Auth client hooks
    ├── db.ts                    # Database connection
    ├── schema.ts                # Drizzle schema (users, sessions, etc.)
    ├── storage.ts               # File storage abstraction (Vercel Blob / local)
    └── utils.ts                 # Utility functions (cn, etc.)
```

## Environment Variables

Required environment variables (see `env.example`):

```env
# Database
POSTGRES_URL=postgresql://user:password@localhost:5432/db_name

# Better Auth
BETTER_AUTH_SECRET=32-char-random-string

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AI via OpenRouter
OPENROUTER_API_KEY=sk-or-v1-your-key
OPENROUTER_MODEL=openai/gpt-5-mini  # or any model from openrouter.ai/models

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# File Storage (optional)
BLOB_READ_WRITE_TOKEN=  # Leave empty for local dev, set for Vercel Blob in production
```

## Available Scripts

```bash
npm run dev          # Start dev server (DON'T run this yourself - ask user)
npm run build        # Build for production (runs db:migrate first)
npm run build:ci     # Build without database (for CI/CD pipelines)
npm run start        # Start production server
npm run lint         # Run ESLint (ALWAYS run after changes)
npm run typecheck    # TypeScript type checking (ALWAYS run after changes)
npm run db:generate  # Generate database migrations
npm run db:migrate   # Run database migrations
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Drizzle Studio (database GUI)
npm run db:dev       # Push schema for development
npm run db:reset     # Reset database (drop all tables)
```

## Documentation Files

The project includes technical documentation in `docs/`:

- `docs/technical/ai/streaming.md` - AI streaming implementation guide
- `docs/technical/ai/structured-data.md` - Structured data extraction
- `docs/technical/react-markdown.md` - Markdown rendering guide
- `docs/technical/betterauth/polar.md` - Polar payment integration
- `docs/business/starter-prompt.md` - Business context for AI prompts

## Guidelines for AI Assistants

### CRITICAL RULES

1. **ALWAYS run lint and typecheck** after completing changes:

   ```bash
   npm run lint && npm run typecheck
   ```

2. **NEVER start the dev server yourself**

   - If you need dev server output, ask the user to provide it
   - Don't run `npm run dev` or `pnpm dev`

3. **Use OpenRouter, NOT OpenAI directly**

   - Import from `@openrouter/ai-sdk-provider`
   - Use `openrouter()` function, not `openai()`
   - Model names follow OpenRouter format: `provider/model-name`

4. **Styling Guidelines**

   - Stick to standard Tailwind CSS utility classes
   - Use shadcn/ui color tokens (e.g., `bg-background`, `text-foreground`)
   - Avoid custom colors unless explicitly requested
   - Support dark mode with appropriate Tailwind classes

5. **Authentication**

   - Server-side: Import from `@/lib/auth` (Better Auth instance)
   - Client-side: Import hooks from `@/lib/auth-client`
   - Protected routes should check session in Server Components
   - Use existing auth components from `src/components/auth/`

6. **Database Operations**

   - Use Drizzle ORM (imported from `@/lib/db`)
   - Schema is defined in `@/lib/schema`
   - Always run migrations after schema changes
   - PostgreSQL is the database (not SQLite, MySQL, etc.)

7. **File Storage**

   - Use the storage abstraction from `@/lib/storage`
   - Automatically uses local storage (dev) or Vercel Blob (production)
   - Import: `import { upload, deleteFile } from "@/lib/storage"`
   - Example: `const result = await upload(buffer, "avatar.png", "avatars")`
   - Storage switches based on `BLOB_READ_WRITE_TOKEN` environment variable

8. **Component Creation**

   - Use existing shadcn/ui components when possible
   - Follow the established patterns in `src/components/ui/`
   - Support both light and dark modes
   - Use TypeScript with proper types

9. **API Routes**
   - Follow Next.js 16 App Router conventions
   - Use Route Handlers (route.ts files)
   - Return Response objects
   - Handle errors appropriately

### Best Practices

- Read existing code patterns before creating new features
- Maintain consistency with established file structure
- Use the documentation files when implementing related features
- Test changes with lint and typecheck before considering complete
- When modifying AI functionality, refer to `docs/technical/ai/` guides

### Common Tasks

**Adding a new page:**

1. Create in `src/app/[route]/page.tsx`
2. Use Server Components by default
3. Add to navigation if needed

**Adding a new API route:**

1. Create in `src/app/api/[route]/route.ts`
2. Export HTTP method handlers (GET, POST, etc.)
3. Use proper TypeScript types

**Adding authentication to a page:**

1. Import auth instance: `import { auth } from "@/lib/auth"`
2. Get session: `const session = await auth.api.getSession({ headers: await headers() })`
3. Check session and redirect if needed

**Working with the database:**

1. Update schema in `src/lib/schema.ts`
2. Generate migration: `npm run db:generate`
3. Apply migration: `npm run db:migrate`
4. Import `db` from `@/lib/db` to query

**Modifying AI chat:**

1. Backend: `src/app/api/chat/route.ts`
2. Frontend: `src/app/chat/page.tsx`
3. Reference streaming docs: `docs/technical/ai/streaming.md`
4. Remember to use OpenRouter, not direct OpenAI

**Working with file storage:**

1. Import storage functions: `import { upload, deleteFile } from "@/lib/storage"`
2. Upload files: `const result = await upload(fileBuffer, "filename.png", "folder")`
3. Delete files: `await deleteFile(result.url)`
4. Storage automatically uses local filesystem in dev, Vercel Blob in production
5. Local files are saved to `public/uploads/` and served at `/uploads/`

## Package Manager

This project uses **pnpm** (see `pnpm-lock.yaml`). When running commands:

- Use `pnpm` instead of `npm` when possible
- Scripts defined in package.json work with `pnpm run [script]`
