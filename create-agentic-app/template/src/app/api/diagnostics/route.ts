import { NextResponse } from "next/server";

type StatusLevel = "ok" | "warn" | "error";

interface DiagnosticsResponse {
  timestamp: string;
  env: {
    POSTGRES_URL: boolean;
    BETTER_AUTH_SECRET: boolean;
    GOOGLE_CLIENT_ID: boolean;
    GOOGLE_CLIENT_SECRET: boolean;
    OPENAI_API_KEY: boolean;
    NEXT_PUBLIC_APP_URL: boolean;
  };
  database: {
    connected: boolean;
    schemaApplied: boolean;
    error?: string;
  };
  auth: {
    configured: boolean;
    routeResponding: boolean | null;
  };
  ai: {
    configured: boolean;
  };
  overallStatus: StatusLevel;
}

export async function GET(req: Request) {
  const env = {
    POSTGRES_URL: Boolean(process.env.POSTGRES_URL),
    BETTER_AUTH_SECRET: Boolean(process.env.BETTER_AUTH_SECRET),
    GOOGLE_CLIENT_ID: Boolean(process.env.GOOGLE_CLIENT_ID),
    GOOGLE_CLIENT_SECRET: Boolean(process.env.GOOGLE_CLIENT_SECRET),
    OPENAI_API_KEY: Boolean(process.env.OPENAI_API_KEY),
    NEXT_PUBLIC_APP_URL: Boolean(process.env.NEXT_PUBLIC_APP_URL),
  } as const;

  // Database checks
  let dbConnected = false;
  let schemaApplied = false;
  let dbError: string | undefined;
  if (env.POSTGRES_URL) {
    try {
      const [{ db }, { sql }, schema] = await Promise.all([
        import("@/lib/db"),
        import("drizzle-orm"),
        import("@/lib/schema"),
      ]);
      // Ping DB
      await db.execute(sql`select 1`);
      dbConnected = true;
      try {
        // Touch a known table to verify migrations
        await db.select().from(schema.user).limit(1);
        schemaApplied = true;
      } catch {
        schemaApplied = false;
      }
    } catch (err) {
      dbConnected = false;
      dbError = err instanceof Error ? err.message : "Unknown database error";
    }
  } else {
    dbConnected = false;
    schemaApplied = false;
    dbError = "POSTGRES_URL is not set";
  }

  // Auth route check: we consider the route responding if it returns any HTTP response
  // for /api/auth/session (status codes in the 2xx-4xx range are acceptable for readiness)
  const origin = (() => {
    try {
      return new URL(req.url).origin;
    } catch {
      return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    }
  })();

  let authRouteResponding: boolean | null = null;
  try {
    const res = await fetch(`${origin}/api/auth/session`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    authRouteResponding = res.status >= 200 && res.status < 500;
  } catch {
    authRouteResponding = false;
  }

  const authConfigured =
    env.BETTER_AUTH_SECRET && env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET;
  const aiConfigured = env.OPENAI_API_KEY; // We avoid live-calling the AI provider here

  const overallStatus: StatusLevel = (() => {
    if (!env.POSTGRES_URL || !dbConnected || !schemaApplied) return "error";
    if (!authConfigured) return "error";
    // AI is optional; warn if not configured
    if (!aiConfigured) return "warn";
    return "ok";
  })();

  const body: DiagnosticsResponse = {
    timestamp: new Date().toISOString(),
    env,
    database: {
      connected: dbConnected,
      schemaApplied,
      error: dbError,
    },
    auth: {
      configured: authConfigured,
      routeResponding: authRouteResponding,
    },
    ai: {
      configured: aiConfigured,
    },
    overallStatus,
  };

  return NextResponse.json(body, {
    status: 200,
  });
}
