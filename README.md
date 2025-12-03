# Agentic Coding Boilerplate

A complete agentic coding boilerplate with authentication, PostgreSQL database, AI chat functionality, and modern UI components - perfect for building AI-powered applications and autonomous agents.

## 🚀 Features

- **🔐 Authentication**: Better Auth with Google OAuth integration
- **🗃️ Database**: Drizzle ORM with PostgreSQL
- **🤖 AI Integration**: Vercel AI SDK with OpenRouter (access to 100+ AI models)
- **📁 File Storage**: Automatic local/Vercel Blob storage with seamless switching
- **🎨 UI Components**: shadcn/ui with Tailwind CSS
- **⚡ Modern Stack**: Next.js 16, React 19, TypeScript
- **📱 Responsive**: Mobile-first design approach

## 🎥 Video Tutorial

Watch the complete walkthrough of this agentic coding template:

[![Agentic Coding Boilerplate Tutorial](https://img.youtube.com/vi/JQ86N3WOAh4/maxresdefault.jpg)](https://youtu.be/JQ86N3WOAh4)

<a href="https://youtu.be/JQ86N3WOAh4" target="_blank" rel="noopener noreferrer">🔗 Watch on YouTube</a>

## ☕ Support This Project

If this boilerplate helped you build something awesome, consider buying me a coffee!

[![Buy me a coffee](https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/leonvanzyl)

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js**: Version 18.0 or higher (<a href="https://nodejs.org/" target="_blank">Download here</a>)
- **Git**: For cloning the repository (<a href="https://git-scm.com/" target="_blank">Download here</a>)
- **PostgreSQL**: Either locally installed or access to a hosted service like Vercel Postgres

## 🛠️ Quick Setup

### Automated Setup (Recommended)

Get started with a single command:

```bash
npx create-agentic-app@latest my-app
cd my-app
```

Or create in the current directory:

```bash
npx create-agentic-app@latest .
```

The CLI will:
- Copy all boilerplate files
- Install dependencies with your preferred package manager (pnpm/npm/yarn)
- Set up your environment file

**Next steps after running the command:**

1. Update `.env` with your API keys and database credentials
2. Start the database: `docker compose up -d`
3. Run migrations: `npm run db:migrate`
4. Start dev server: `npm run dev`

### Manual Setup (Alternative)

If you prefer to set up manually:

**1. Clone or Download the Repository**

**Option A: Clone with Git**

```bash
git clone https://github.com/leonvanzyl/agentic-coding-starter-kit.git
cd agentic-coding-starter-kit
```

**Option B: Download ZIP**
Download the repository as a ZIP file and extract it to your desired location.

**2. Install Dependencies**

```bash
npm install
```

**3. Environment Setup**

Copy the example environment file:

```bash
cp env.example .env
```

Fill in your environment variables in the `.env` file:

```env
# Database
POSTGRES_URL="postgresql://username:password@localhost:5432/your_database_name"

# Authentication - Better Auth
BETTER_AUTH_SECRET="your-random-32-character-secret-key-here"

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AI Integration via OpenRouter (Optional - for chat functionality)
# Get your API key from: https://openrouter.ai/settings/keys
# View available models at: https://openrouter.ai/models
OPENROUTER_API_KEY="sk-or-v1-your-openrouter-api-key-here"
OPENROUTER_MODEL="openai/gpt-5-mini"

# App URL (for production deployments)
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# File Storage (Optional - for file upload functionality)
# Leave empty to use local storage (public/uploads/) in development
# Set to enable Vercel Blob storage in production
BLOB_READ_WRITE_TOKEN=""
```

**4. Database Setup**

Generate and run database migrations:

```bash
npm run db:generate
npm run db:migrate
```

**5. Start the Development Server**

```bash
npm run dev
```

Your application will be available at [http://localhost:3000](http://localhost:3000)

## ⚙️ Service Configuration

### PostgreSQL Database on Vercel

1. Go to <a href="https://vercel.com/dashboard" target="_blank">Vercel Dashboard</a>
2. Navigate to the **Storage** tab
3. Click **Create** → **Postgres**
4. Choose your database name and region
5. Copy the `POSTGRES_URL` from the `.env.local` tab
6. Add it to your `.env` file

### Google OAuth Credentials

1. Go to <a href="https://console.cloud.google.com/" target="_blank">Google Cloud Console</a>
2. Create a new project or select an existing one
3. Navigate to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
4. Set application type to **Web application**
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Copy the **Client ID** and **Client Secret** to your `.env` file

### OpenRouter API Key

1. Go to <a href="https://openrouter.ai/" target="_blank">OpenRouter</a>
2. Sign up or log in to your account
3. Navigate to **Settings** → **Keys** or visit <a href="https://openrouter.ai/settings/keys" target="_blank">Keys Settings</a>
4. Click **Create Key** and give it a name
5. Copy the API key and add it to your `.env` file as `OPENROUTER_API_KEY`
6. Browse available models at <a href="https://openrouter.ai/models" target="_blank">OpenRouter Models</a>

### File Storage Configuration

The project includes a flexible storage abstraction that automatically switches between local filesystem storage (development) and Vercel Blob storage (production).

**For Development (Local Storage):**
- Leave `BLOB_READ_WRITE_TOKEN` empty or unset in your `.env` file
- Files are automatically stored in `public/uploads/`
- Files are served at `/uploads/` URL path
- No external service or configuration needed

**For Production (Vercel Blob):**
1. Go to <a href="https://vercel.com/dashboard" target="_blank">Vercel Dashboard</a>
2. Navigate to your project → **Storage** tab
3. Click **Create** → **Blob**
4. Copy the `BLOB_READ_WRITE_TOKEN` from the integration
5. Add it to your production environment variables

The storage service automatically detects which backend to use based on the presence of the `BLOB_READ_WRITE_TOKEN` environment variable.

## 🗂️ Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   └── chat/          # AI chat endpoint
│   ├── chat/              # AI chat page
│   ├── dashboard/         # User dashboard
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── auth/             # Authentication components
│   └── ui/               # shadcn/ui components
└── lib/                  # Utilities and configurations
    ├── auth.ts           # Better Auth configuration
    ├── auth-client.ts    # Client-side auth utilities
    ├── db.ts             # Database connection
    ├── schema.ts         # Database schema
    ├── storage.ts        # File storage abstraction
    └── utils.ts          # General utilities
```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate database migrations
npm run db:migrate   # Run database migrations
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Drizzle Studio (database GUI)
npm run db:dev       # Push schema for development
npm run db:reset     # Reset database (drop all tables)
```

## 📖 Pages Overview

- **Home (`/`)**: Landing page with setup instructions and features overview
- **Dashboard (`/dashboard`)**: Protected user dashboard with profile information
- **Chat (`/chat`)**: AI-powered chat interface using OpenRouter (requires authentication)

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Install the Vercel CLI globally:

   ```bash
   npm install -g vercel
   ```

2. Deploy your application:

   ```bash
   vercel --prod
   ```

3. Follow the prompts to configure your deployment
4. Add your environment variables when prompted or via the Vercel dashboard

### Production Environment Variables

Ensure these are set in your production environment:

- `POSTGRES_URL` - Production PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Secure random 32+ character string
- `GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret
- `OPENROUTER_API_KEY` - OpenRouter API key (optional, for AI chat functionality)
- `OPENROUTER_MODEL` - Model name from OpenRouter (optional, defaults to openai/gpt-5-mini)
- `NEXT_PUBLIC_APP_URL` - Your production domain
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob token (optional, uses local storage if not set)

## 🎥 Tutorial Video

Watch my comprehensive tutorial on how to use this agentic coding boilerplate to build AI-powered applications:

<a href="https://youtu.be/JQ86N3WOAh4" target="_blank" rel="noopener noreferrer">📺 YouTube Tutorial - Building with Agentic Coding Boilerplate</a>

## 🤖 Claude Code Commands

This project includes custom slash commands for [Claude Code](https://claude.ai/code) that streamline feature development with GitHub integration.

### Available Commands

| Command | Description |
|---------|-------------|
| `/create-feature` | Create a new feature specification with requirements and implementation plan |
| `/publish-to-github` | Publish a feature to GitHub Issues and Projects |
| `/continue-feature` | Continue implementing the next task for a GitHub-published feature |
| `/checkpoint` | Create a comprehensive checkpoint commit with all changes |

### Prerequisites

Before using the GitHub-integrated commands:

1. **GitHub CLI**: Install and authenticate the GitHub CLI
   ```bash
   # Install (if needed)
   brew install gh  # macOS
   # or see https://cli.github.com/

   # Authenticate
   gh auth login

   # Add project scopes (required for /publish-to-github)
   gh auth refresh -s project,read:project
   ```

2. **Claude Code**: Install Claude Code CLI from [claude.ai/code](https://claude.ai/code)

### Typical Workflow

#### 1. Plan Your Feature

Start a conversation with Claude Code and describe the feature you want to build:

```
You: I want to add a user preferences page where users can update their display name,
     email notifications, and theme preferences.
```

#### 2. Create Feature Specification

Once you've discussed the requirements, run:

```
/create-feature
```

This creates a spec folder at `specs/{feature-name}/` containing:
- `requirements.md` - What the feature does and acceptance criteria
- `implementation-plan.md` - Phased tasks with checkboxes

#### 3. Publish to GitHub

Publish the feature to GitHub for tracking:

```
/publish-to-github
```

This creates:
- An **Epic issue** with full requirements
- **Task issues** for each implementation step
- A **GitHub Project** to track progress
- **Labels** for organization
- A `github.md` file with all references

#### 4. Implement Tasks

Start implementing tasks one at a time:

```
/continue-feature
```

This command:
1. Finds the next unblocked task (respecting dependencies)
2. Updates the GitHub Project status to "In Progress"
3. Implements the task following project conventions
4. Runs lint and typecheck
5. Commits with `closes #{issue-number}`
6. Updates the issue with implementation details
7. Moves the task to "Done" on the Project board

Repeat `/continue-feature` for each task, or let Claude continue automatically.

#### 5. Create Checkpoints

At any point, create a detailed checkpoint commit:

```
/checkpoint
```

This stages all changes and creates a well-formatted commit with:
- Clear summary line
- Detailed description of changes
- Co-author attribution

### Example Session

```bash
# Start Claude Code in your project
claude

# Discuss feature requirements
You: I need to add API rate limiting to protect our endpoints...

# Claude helps plan, then you run:
/create-feature

# Review the spec, then publish:
/publish-to-github

# Implement task by task:
/continue-feature
# ... Claude implements, commits, updates GitHub ...

/continue-feature
# ... next task ...

# When done, push to GitHub:
git push
```

### Without GitHub Integration

If you prefer not to use GitHub, you can still use `/create-feature` to create specs, then manually work through the `implementation-plan.md` checkboxes. The `/continue-feature` command also supports offline mode, tracking progress directly in the markdown file.

### Command Files Location

Commands are defined in `.claude/commands/`:
```
.claude/commands/
├── checkpoint.md
├── continue-feature.md
├── create-feature.md
└── publish-to-github.md
```

You can customize these commands or add new ones following the [Claude Code documentation](https://docs.anthropic.com/en/docs/claude-code).

## 🤝 Contributing

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Need Help?

If you encounter any issues:

1. Check the [Issues](https://github.com/leonvanzyl/agentic-coding-starter-kit/issues) section
2. Review the documentation above
3. Create a new issue with detailed information about your problem

---

**Happy coding! 🚀**
