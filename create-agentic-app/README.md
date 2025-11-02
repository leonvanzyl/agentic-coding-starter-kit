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

- **Next.js 15** with App Router and Turbopack
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

## Template Updates

### Automatic Sync (Recommended)

When publishing, the template syncs automatically via the `prepublishOnly` hook. Just run:
```bash
cd create-agentic-app
npm publish
```

### Manual Sync

If you want to sync without publishing:

**From the project root:**
```bash
npm run sync-template
```

**Or from the create-agentic-app directory:**
```bash
npm run sync
```

The sync script automatically:
- Copies all files from the main project to `template/`
- Excludes build artifacts (node_modules, .next, lock files, etc.)
- Removes `"private": true` from template's package.json
- Removes the `sync-template` script (users don't need it)

### Publishing Workflow

1. **Make changes** to the main boilerplate project
2. **Test your changes**
3. **Bump version** in `create-agentic-app/package.json`
4. **Publish**:
   ```bash
   cd create-agentic-app
   npm publish
   ```
   (Template syncs automatically before publishing)

## License

MIT
