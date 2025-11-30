# Next.js 16 Boilerplate Improvements - Implementation Plan

## Phase 1: Critical Security & Stability (19 files)

### Security Configuration
- [ ] Update `next.config.ts` - Add security headers, image config, compression
- [ ] Modify `package.json` - Remove `@ai-sdk/openai` dependency
- [ ] Create `src/proxy.ts` - Server-side auth protection using Next.js 16 proxy + BetterAuth
- [ ] Modify `src/app/api/chat/route.ts` - Add session authentication check
- [ ] Update `docs/technical/ai/streaming.md` - Fix OpenRouter references

### Next.js 15 → 16 Updates (Main Project)
- [ ] Update `CLAUDE.md` - Change Next.js 15 to Next.js 16
- [ ] Update `README.md` - Change Next.js 15 to Next.js 16
- [ ] Update `docs/business/starter-prompt.md` - Change Next.js 15 to Next.js 16
- [ ] Update `src/components/starter-prompt-modal.tsx` - Change Next.js 15 to Next.js 16
- [ ] Update `.claude/agents/polar-payments-expert.md` - Change Next.js 15 to Next.js 16
- [ ] Update `.claude/agents/better-auth-expert.md` - Change Next.js 15 to Next.js 16

### Next.js 15 → 16 Updates (create-agentic-app Template)
- [ ] Update `create-agentic-app/README.md` - Change Next.js 15 to Next.js 16
- [ ] Update `create-agentic-app/template/CLAUDE.md` - Change Next.js 15 to Next.js 16
- [ ] Update `create-agentic-app/template/README.md` - Change Next.js 15 to Next.js 16
- [ ] Update `create-agentic-app/template/docs/business/starter-prompt.md` - Change Next.js 15 to Next.js 16
- [ ] Update `create-agentic-app/template/src/components/starter-prompt-modal.tsx` - Change Next.js 15 to Next.js 16
- [ ] Update `create-agentic-app/template/.claude/agents/better-auth-expert.md` - Change Next.js 15 to Next.js 16
- [ ] Update `create-agentic-app/template/.claude/agents/polar-payments-expert.md` - Change Next.js 15 to Next.js 16

---

## Phase 2: Core UX Components (12 files)

### Error Handling
- [ ] Create `src/app/error.tsx` - Global error boundary
- [ ] Create `src/app/not-found.tsx` - Custom 404 page
- [ ] Create `src/app/chat/error.tsx` - Chat-specific error handling

### Loading States
- [ ] Create `src/components/ui/skeleton.tsx` - Skeleton loading component (via shadcn)
- [ ] Create `src/components/ui/spinner.tsx` - Loading spinner component

### Toast Notifications
- [ ] Install shadcn Sonner: `npx shadcn@latest add sonner`
- [ ] Modify `src/app/layout.tsx` - Add `<Toaster />` component

### Form Components
- [ ] Install shadcn input: `npx shadcn@latest add input`
- [ ] Install shadcn textarea: `npx shadcn@latest add textarea`
- [ ] Install shadcn label: `npx shadcn@latest add label`

### Chat UX Improvements
- [ ] Modify `src/app/chat/page.tsx`:
  - [ ] Add message timestamps
  - [ ] Add copy-to-clipboard for AI responses
  - [ ] Add typing/thinking indicator during streaming
  - [ ] Add error display for API failures
  - [ ] Add message persistence (localStorage)

### Database Schema
- [ ] Modify `src/lib/schema.ts` - Add missing indexes:
  - [ ] Index on `session.user_id`
  - [ ] Index on `session.token`
  - [ ] Index on `account.user_id`
  - [ ] Index on `account(provider_id, account_id)`
  - [ ] Index on `user.email`
- [ ] Run `pnpm db:generate` to create migration
- [ ] Run `pnpm db:migrate` to apply migration

---

## Phase 3: Polish & Security (8 files)

### ESLint Configuration
- [ ] Modify `eslint.config.mjs`:
  - [ ] Add import ordering rules
  - [ ] Add TypeScript-eslint rules
  - [ ] Add React hooks exhaustive-deps
  - [ ] Add no-console warnings

### API Hardening
- [ ] Modify `src/app/api/chat/route.ts`:
  - [ ] Add rate limiting (10 requests/minute per user)
  - [ ] Add Zod validation for messages
  - [ ] Add message length limits
- [x] Modify `src/app/api/diagnostics/route.ts` - Keep public (used by homepage setup checklist before login)

### SEO
- [ ] Modify `src/app/layout.tsx` - Add Open Graph metadata
- [ ] Create `src/app/sitemap.ts` - Dynamic sitemap
- [ ] Create `src/app/robots.ts` - Robots configuration

### Accessibility
- [ ] Modify `src/components/site-header.tsx`:
  - [ ] Add `<nav>` role
  - [ ] Add aria-labels to interactive elements
  - [ ] Add skip-to-content link

### TypeScript
- [ ] Modify `tsconfig.json`:
  - [ ] Add `noUncheckedIndexedAccess: true`
  - [ ] Add `noImplicitOverride: true`
  - [ ] Add `exactOptionalPropertyTypes: true`

---

## Phase 4: DevEx & Infrastructure (7 files)

### Code Formatting
- [ ] Create `.prettierrc` - Prettier configuration

### CI/CD
- [ ] Create `.github/workflows/ci.yml`:
  - [ ] Lint check (`pnpm lint`)
  - [ ] Type check (`pnpm typecheck`)
  - [ ] Build verification (`pnpm build`)
  - [ ] Trigger on PR and push to main

### Node Version
- [ ] Create `.nvmrc` - Pin to Node 20 LTS

### CLI Scripts
- [ ] Modify `package.json`:
  - [ ] Add `validate-env` script
  - [ ] Add `check` script (lint + typecheck)

### Setup Experience
- [ ] Create `scripts/setup.ts` - Interactive setup wizard:
  - [ ] Check Node version
  - [ ] Copy env.example to .env
  - [ ] Validate required variables
  - [ ] Offer to run db:migrate
  - [ ] Provide next steps guidance

### File Storage Security
- [ ] Modify `src/lib/storage.ts`:
  - [ ] Add file type whitelist (images, documents)
  - [ ] Add file size limits (5MB default)
  - [ ] Add filename sanitization

### Profile Page
- [ ] Modify `src/app/profile/page.tsx`:
  - [ ] Enable Edit Profile button with modal
  - [ ] Enable basic security settings view

---

## Summary

| Phase | Files | Focus |
|-------|-------|-------|
| Phase 1 | 19 | Security, stability, Next.js 16 updates |
| Phase 2 | 12 | Core UX components |
| Phase 3 | 8 | Polish & security |
| Phase 4 | 7 | DevEx & infrastructure |
| **Total** | **46** | |

## Implementation Order

Execute phases sequentially: **Phase 1** → **Phase 2** → **Phase 3** → **Phase 4**

Each phase builds on the previous one:
1. Phase 1 ensures security and stability
2. Phase 2 adds core user experience
3. Phase 3 polishes and hardens
4. Phase 4 improves developer experience
