interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory rate limiter per IP address
const ipStore = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5; // max 5 generations per minute per IP

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetInSec: number } {
  const now = Date.now();
  const entry = ipStore.get(ip);

  if (!entry || now > entry.resetAt) {
    ipStore.set(ip, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });
    return {
      allowed: true,
      remaining: MAX_REQUESTS_PER_WINDOW - 1,
      resetInSec: Math.ceil(WINDOW_MS / 1000),
    };
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      remaining: 0,
      resetInSec: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - entry.count,
    resetInSec: Math.ceil((entry.resetAt - now) / 1000),
  };
}
