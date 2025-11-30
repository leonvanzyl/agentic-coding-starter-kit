# Next.js 16 Boilerplate Improvements - Requirements

## Overview

Comprehensive review and improvement of the Next.js 16 boilerplate project to enhance security, user experience, developer experience, and overall code quality.

## User Decisions

- **Scope:** Full implementation (all improvements including CI/CD, CLI tools)
- **Testing:** Skip testing framework (keep boilerplate minimal)
- **Toast Library:** shadcn Sonner component
- **CI/CD:** Full GitHub Actions pipeline (lint, typecheck, build)
- **Dockerfile:** Skip (deploying to Vercel only)
- **Database Seed:** Skip (developers will create their own data)

## Requirements by Category

### 1. Security & Stability (Critical)

1. **next.config.ts** - Currently empty, needs:
   - Security headers (CSP, X-Frame-Options, X-Content-Type-Options)
   - Image optimization configuration
   - Compression settings

2. **Unused Dependency** - Remove `@ai-sdk/openai` from package.json (project uses OpenRouter exclusively)

3. **Server-Side Auth Protection** - Create `src/proxy.ts` using Next.js 16 proxy pattern with BetterAuth for protected routes (`/chat`, `/dashboard`, `/profile`)

4. **API Authentication** - Add session validation to `/api/chat` endpoint to prevent unauthorized API usage

5. **Documentation Consistency** - Update `docs/technical/ai/streaming.md` to use `@openrouter/ai-sdk-provider` instead of `@ai-sdk/openai`

6. **Next.js Version References** - Update all "Next.js 15" references to "Next.js 16" across 14 files

### 2. Core UX Components (High Priority)

1. **Error Handling UI**
   - Global error boundary (`src/app/error.tsx`)
   - Custom 404 page (`src/app/not-found.tsx`)
   - Chat-specific error handling (`src/app/chat/error.tsx`)

2. **Loading States**
   - Skeleton component (`src/components/ui/skeleton.tsx`)
   - Loading spinner (`src/components/ui/spinner.tsx`)
   - Chat loading skeleton (`src/app/chat/loading.tsx`)
   - Dashboard loading skeleton (`src/app/dashboard/loading.tsx`)

3. **Toast Notifications**
   - Install shadcn Sonner component
   - Add Toaster to layout

4. **Chat UX Improvements**
   - Message timestamps
   - Copy-to-clipboard for AI responses
   - Typing/thinking indicator during streaming
   - Error display for API failures
   - Message persistence (localStorage)

5. **Database Indexes** - Add missing indexes on:
   - `session.user_id`
   - `session.token`
   - `account.user_id`
   - `account(provider_id, account_id)`
   - `user.email`

6. **Form Components**
   - Input component (`src/components/ui/input.tsx`)
   - Textarea component (`src/components/ui/textarea.tsx`)
   - Label component (`src/components/ui/label.tsx`)

### 3. Polish & Security (Medium Priority)

1. **ESLint Enhancement**
   - Import ordering rules
   - TypeScript-eslint rules
   - React hooks exhaustive-deps
   - no-console warnings

2. **API Hardening**
   - Rate limiting for chat endpoint
   - Zod validation for incoming messages
   - Restrict diagnostics endpoint to admins

3. **SEO Improvements**
   - Per-page metadata
   - Open Graph tags
   - JSON-LD structured data
   - Sitemap (`src/app/sitemap.ts`)
   - Robots (`src/app/robots.ts`)

4. **Accessibility**
   - aria-label on interactive elements
   - nav role in site header
   - Proper form labels
   - Skip-to-content link

5. **TypeScript Strictness**
   - `noUncheckedIndexedAccess: true`
   - `noImplicitOverride: true`
   - `exactOptionalPropertyTypes: true`

### 4. Developer Experience (DevEx)

1. **Prettier Configuration** - Add `.prettierrc` for consistent code formatting

2. **CI/CD Pipeline** - GitHub Actions workflow with:
   - Lint check
   - Type check
   - Build verification

3. **Node Version Pinning** - Add `.nvmrc` for Node 20 LTS

4. **CLI Scripts** - Add helpful package.json scripts:
   - `validate-env` - Check required environment variables
   - `check` - Run lint + typecheck in one command

5. **Setup Experience** - Interactive setup script (`scripts/setup.ts`)

6. **File Storage Security**
   - File type whitelist
   - File size limits
   - Filename sanitization

7. **Profile Page** - Enable disabled quick action buttons

## Out of Scope

- Unit testing framework
- E2E testing framework
- Dockerfile / container deployment
- Database seeding
