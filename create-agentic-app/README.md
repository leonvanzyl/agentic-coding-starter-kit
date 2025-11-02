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

1. **Update package.json**: Set your author, repository URL, and version
2. **Build the template**: Run the setup script to populate the template directory:
   ```bash
   # On Unix/Mac:
   bash setup-template.sh

   # On Windows:
   powershell -ExecutionPolicy Bypass -File setup-template.ps1
   ```
3. **Test locally**: Test the package locally before publishing:
   ```bash
   npm link
   cd /path/to/test/directory
   create-agentic-app my-test-app
   ```
4. **Publish**: Publish to npm:
   ```bash
   npm publish
   ```

## Template Updates

When you update the boilerplate in the main project:

1. Navigate to the project root
2. Run the setup script to sync changes to the template:
   ```bash
   # Unix/Mac
   bash create-agentic-app/setup-template.sh

   # Windows
   powershell -ExecutionPolicy Bypass -File create-agentic-app/setup-template.ps1
   ```
3. Bump the version in `package.json`
4. Publish the updated package

## License

MIT
