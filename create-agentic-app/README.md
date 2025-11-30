# create-agentic-app

Scaffold a new agentic AI application with Next.js, Better Auth, and AI SDK.

## Usage

Create a new project in the current directory:

```bash
npx create-agentic-app@latest .
```

Create a new project in a subdirectory:

```bash
npx create-agentic-app@latest my-app
```

## What's Included

This starter kit includes:

- **Next.js 16** with App Router and Turbopack
- **Better Auth** for authentication (email/password, OAuth)
- **AI SDK** by Vercel for AI chat functionality
- **Drizzle ORM** with PostgreSQL database
- **Tailwind CSS** with shadcn/ui components
- **TypeScript** for type safety
- **Dark mode** support with next-themes

## Next Steps

After creating your project:

1. **Update environment variables**: Edit `.env` with your API keys and database credentials
2. **Start the database**: `docker compose up -d`
3. **Run migrations**: `pnpm run db:migrate` (or `npm`/`yarn`)
4. **Start dev server**: `pnpm run dev`

Visit `http://localhost:3000` to see your app!

## Publishing to npm

To publish this package to npm:

1. **Update package.json**: Set your author, repository URL, and version in `create-agentic-app/package.json`
2. **Test locally** (optional): Test the package before publishing:
   ```bash
   cd create-agentic-app
   npm link
   cd /path/to/test/directory
   create-agentic-app my-test-app
   ```
3. **Publish**: The sync happens automatically!
   ```bash
   cd create-agentic-app
   npm publish
   ```
   The `prepublishOnly` hook will automatically sync the template from the main project before publishing.

## Maintainer Guide: Updating & Publishing

This section is for maintainers who need to update the npm package after making changes to the main project.

### Complete Publishing Workflow

Follow these steps **every time** you make changes to the main project and want to publish them:

#### Step 1: Make Changes to Main Project

Edit any files in the main project (outside of `create-agentic-app/` folder):
- `src/` components and pages
- `docker-compose.yml`
- `package.json`
- Configuration files
- etc.

#### Step 2: Navigate to create-agentic-app Directory

```bash
cd create-agentic-app
```

#### Step 3: Sync Template from Main Project

This copies all your changes from the main project into the template folder:

```bash
npm run sync
```

**What this does:**
- Deletes everything in `create-agentic-app/template/`
- Copies ALL files from your main project into `template/`
- Excludes: `node_modules`, `.next`, `.git`, lock files, `.env`, and the `create-agentic-app` folder itself
- Cleans up the template's `package.json` (removes `private` field and `sync-template` script)

#### Step 4: Bump the Version

Update the version number in `create-agentic-app/package.json`:

**Option A - Using npm version command (recommended):**
```bash
npm version patch   # 1.1.3 → 1.1.4 (bug fixes)
# or
npm version minor   # 1.1.3 → 1.2.0 (new features)
# or
npm version major   # 1.1.3 → 2.0.0 (breaking changes)
```

**Option B - Manual:**
Edit `create-agentic-app/package.json` and change the version number.

#### Step 5: Verify Everything Looks Good (Optional)

Quick check to make sure your changes are in the package:

```bash
npm pack --dry-run | grep "template/"
```

This shows all files that will be published. Look for your changed files.

#### Step 6: Publish to npm

```bash
npm publish
```

**What happens:**
- The `prepublishOnly` hook automatically runs `npm run sync` again (safety check)
- Your package gets published to npm with the new version

#### Step 7: Test It

In a different directory, test that it works:

```bash
cd /path/to/test-directory
npx create-agentic-app@latest test-project
# or use the specific version
npx create-agentic-app@1.1.4 test-project
```

### Quick Reference Commands

```bash
# Complete workflow in 4 commands:
cd create-agentic-app
npm run sync
npm version patch
npm publish
```

### Common Scenarios

**Scenario 1: You edited `docker-compose.yml` in the main project**
```bash
cd create-agentic-app
npm run sync                    # Copies docker-compose.yml to template/
npm version patch               # Bumps to next version
npm publish                     # Publishes to npm
```

**Scenario 2: You added a new component in `src/components/`**
```bash
cd create-agentic-app
npm run sync                    # Copies new component to template/
npm version patch               # Bumps version
npm publish                     # Publishes
```

**Scenario 3: You updated multiple files**
```bash
cd create-agentic-app
npm run sync                    # Copies ALL changes to template/
npm version patch               # Bumps version
npm publish                     # Publishes
```

### What Gets Excluded from the Template

The sync script excludes these patterns (see `scripts/sync-templates.js`):
- `node_modules`
- `.next`
- `.git`
- `pnpm-lock.yaml`
- `package-lock.json`
- `yarn.lock`
- `tsconfig.tsbuildinfo`
- `.env`
- `create-agentic-app` (the folder itself)

### Troubleshooting

**Issue: npmjs.com shows old version after publishing**
- The npm website can take 5-10 minutes to update due to CDN caching
- Verify actual registry: `npm view create-agentic-app version`
- The package is available to users immediately via `npx` even if the website hasn't updated

**Issue: Users getting old version with `npx`**
- Users may have cached versions. Tell them to:
  ```bash
  npx clear-npx-cache
  npx create-agentic-app@latest my-project
  # or use specific version
  npx create-agentic-app@1.1.4 my-project
  ```

**Issue: Forgot to run sync before publishing**
- No problem! The `prepublishOnly` hook runs it automatically
- But it's good practice to run manually first to verify changes

## License

MIT
