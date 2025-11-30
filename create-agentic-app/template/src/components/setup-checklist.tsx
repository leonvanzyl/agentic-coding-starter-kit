"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type DiagnosticsResponse = {
  timestamp: string;
  env: {
    POSTGRES_URL: boolean;
    BETTER_AUTH_SECRET: boolean;
    GOOGLE_CLIENT_ID: boolean;
    GOOGLE_CLIENT_SECRET: boolean;
    OPENROUTER_API_KEY: boolean;
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
  storage: {
    configured: boolean;
    type: "local" | "remote";
  };
  overallStatus: "ok" | "warn" | "error";
};

function StatusIcon({ ok }: { ok: boolean }) {
  return ok ? (
    <div title="ok">
      <CheckCircle2 className="h-4 w-4 text-green-600" aria-label="ok" />
    </div>
  ) : (
    <div title="not ok">
      <XCircle className="h-4 w-4 text-red-600" aria-label="not-ok" />
    </div>
  );
}

export function SetupChecklist() {
  const [data, setData] = useState<DiagnosticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/diagnostics", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as DiagnosticsResponse;
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load diagnostics");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const steps = [
    {
      key: "env",
      label: "Environment variables",
      ok:
        !!data?.env.POSTGRES_URL &&
        !!data?.env.BETTER_AUTH_SECRET &&
        !!data?.env.GOOGLE_CLIENT_ID &&
        !!data?.env.GOOGLE_CLIENT_SECRET,
      detail:
        "Requires POSTGRES_URL, BETTER_AUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET",
    },
    {
      key: "db",
      label: "Database connected & schema",
      ok: !!data?.database.connected && !!data?.database.schemaApplied,
      detail: data?.database.error
        ? `Error: ${data.database.error}`
        : undefined,
    },
    {
      key: "auth",
      label: "Auth configured",
      ok: !!data?.auth.configured,
      detail:
        data?.auth.routeResponding === false
          ? "Auth route not responding"
          : undefined,
    },
    {
      key: "ai",
      label: "AI integration (optional)",
      ok: !!data?.ai.configured,
      detail: !data?.ai.configured
        ? "Set OPENROUTER_API_KEY for AI chat"
        : undefined,
    },
    {
      key: "storage",
      label: "File storage (optional)",
      ok: true, // Always considered "ok" since local storage works
      detail: data?.storage
        ? data.storage.type === "remote"
          ? "Using Vercel Blob storage"
          : "Using local storage (public/uploads/)"
        : undefined,
    },
  ] as const;

  const completed = steps.filter((s) => s.ok).length;

  return (
    <div className="p-6 border rounded-lg text-left">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold">Setup checklist</h3>
          <p className="text-sm text-muted-foreground">
            {completed}/{steps.length} completed
          </p>
        </div>
        <Button size="sm" onClick={load} disabled={loading}>
          {loading ? "Checking..." : "Re-check"}
        </Button>
      </div>

      {error ? <div className="text-sm text-destructive">{error}</div> : null}

      <ul className="space-y-2">
        {steps.map((s) => (
          <li key={s.key} className="flex items-start gap-2">
            <div className="mt-0.5">
              <StatusIcon ok={Boolean(s.ok)} />
            </div>
            <div>
              <div className="font-medium">{s.label}</div>
              {s.detail ? (
                <div className="text-sm text-muted-foreground">{s.detail}</div>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      {data ? (
        <div className="mt-4 text-xs text-muted-foreground">
          Last checked: {new Date(data.timestamp).toLocaleString()}
        </div>
      ) : null}
    </div>
  );
}
