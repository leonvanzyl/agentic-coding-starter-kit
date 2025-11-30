"use client";

import Link from "next/link";
import { Video, Shield, Database, Palette, Bot } from "lucide-react";
import { SetupChecklist } from "@/components/setup-checklist";
import { StarterPromptModal } from "@/components/starter-prompt-modal";
import { Button } from "@/components/ui/button";
import { useDiagnostics } from "@/hooks/use-diagnostics";

export default function Home() {
  const { isAuthReady, isAiReady, loading } = useDiagnostics();
  return (
    <main className="flex-1 container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
              <Bot className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
              Starter Kit
            </h1>
          </div>
          <h2 className="text-2xl font-semibold text-muted-foreground">
            Complete Boilerplate for AI Applications
          </h2>
          <p className="text-xl text-muted-foreground">
            A complete agentic coding boilerplate with authentication, database, AI
            integration, and modern tooling for building AI-powered applications
          </p>
        </div>

        {/* YouTube Tutorial Video */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold flex items-center justify-center gap-2">
            <Video className="h-6 w-6" />
            Video Tutorial
          </h3>
          <p className="text-muted-foreground">
            Watch the complete walkthrough of this agentic coding boilerplate:
          </p>
          <div className="relative w-full max-w-3xl mx-auto">
            <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg border">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/JQ86N3WOAh4"
                title="Agentic Coding Boilerplate Tutorial"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Authentication
            </h3>
            <p className="text-sm text-muted-foreground">
              Better Auth with Google OAuth integration
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Database className="h-4 w-4" />
              Database
            </h3>
            <p className="text-sm text-muted-foreground">
              Drizzle ORM with PostgreSQL setup
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Bot className="h-4 w-4" />
              AI Ready
            </h3>
            <p className="text-sm text-muted-foreground">
              Vercel AI SDK with OpenRouter integration
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Palette className="h-4 w-4" />
              UI Components
            </h3>
            <p className="text-sm text-muted-foreground">
              shadcn/ui with Tailwind CSS
            </p>
          </div>
        </div>

        <div className="space-y-6 mt-12">
          <SetupChecklist />

          <h3 className="text-2xl font-semibold">Next Steps</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">
                1. Set up environment variables
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                Copy <code>.env.example</code> to <code>.env.local</code> and
                configure:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>POSTGRES_URL (PostgreSQL connection string)</li>
                <li>GOOGLE_CLIENT_ID (OAuth credentials)</li>
                <li>GOOGLE_CLIENT_SECRET (OAuth credentials)</li>
                <li>OPENROUTER_API_KEY (for AI functionality)</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">2. Set up your database</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Run database migrations:
              </p>
              <div className="space-y-2">
                <code className="text-sm bg-muted p-2 rounded block">
                  npm run db:generate
                </code>
                <code className="text-sm bg-muted p-2 rounded block">
                  npm run db:migrate
                </code>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">3. Try the features</h4>
              <div className="space-y-2">
                {loading || !isAuthReady ? (
                  <Button size="sm" className="w-full" disabled={true}>
                    View Dashboard
                  </Button>
                ) : (
                  <Button asChild size="sm" className="w-full">
                    <Link href="/dashboard">View Dashboard</Link>
                  </Button>
                )}
                {loading || !isAiReady ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    disabled={true}
                  >
                    Try AI Chat
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Link href="/chat">Try AI Chat</Link>
                  </Button>
                )}
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">4. Start building</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Customize the components, add your own pages, and build your
                application on top of this solid foundation.
              </p>
              <StarterPromptModal />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
