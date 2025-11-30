/**
 * Simple in-memory rate limiter for API routes.
 * For production, consider using a Redis-based solution.
 */

interface RateLimitConfig {
  /** Number of requests allowed in the window */
  limit: number;
  /** Time window in milliseconds */
  windowMs: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Default rate limit configurations for different endpoints.
 */
export const rateLimitConfigs = {
  // AI chat endpoint - more restrictive
  chat: {
    limit: 20,
    windowMs: 60 * 1000, // 20 requests per minute
  },
  // Auth endpoints
  auth: {
    limit: 10,
    windowMs: 60 * 1000, // 10 requests per minute
  },
  // General API
  api: {
    limit: 100,
    windowMs: 60 * 1000, // 100 requests per minute
  },
} as const;

/**
 * Check if a request should be rate limited.
 *
 * @param key - Unique identifier for the client (e.g., IP address, user ID)
 * @param config - Rate limit configuration
 * @returns Object with allowed status and remaining requests
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  // Clean up expired entries periodically
  if (Math.random() < 0.01) {
    cleanupExpiredEntries();
  }

  if (!entry || now > entry.resetTime) {
    // Create new entry
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, newEntry);
    return {
      allowed: true,
      remaining: config.limit - 1,
      resetTime: newEntry.resetTime,
    };
  }

  if (entry.count >= config.limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count++;
  return {
    allowed: true,
    remaining: config.limit - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Create a rate limit response with appropriate headers.
 */
export function createRateLimitResponse(resetTime: number): Response {
  const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
  return new Response(
    JSON.stringify({
      error: "Too Many Requests",
      message: "Rate limit exceeded. Please try again later.",
      retryAfter,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfter),
        "X-RateLimit-Reset": String(Math.ceil(resetTime / 1000)),
      },
    }
  );
}

/**
 * Get the client identifier from a request.
 * Uses IP address or forwarded header.
 */
export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const ip = forwarded.split(",")[0];
    if (ip) {
      return ip.trim();
    }
  }
  // Fallback to a hash of user-agent if no IP available
  const userAgent = request.headers.get("user-agent") || "unknown";
  return `ua-${hashString(userAgent)}`;
}

/**
 * Simple string hash for fallback identifier.
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Clean up expired rate limit entries.
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}
