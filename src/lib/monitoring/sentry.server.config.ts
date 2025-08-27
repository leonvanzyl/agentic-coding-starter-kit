import * as Sentry from "@sentry/nextjs";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    
    // Performance Monitoring - minimal sampling
    tracesSampleRate: 0.1,
    
    // Don't log debug info
    debug: false,
  });
}