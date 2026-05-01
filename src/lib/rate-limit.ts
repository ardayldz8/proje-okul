import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type RateLimitKind = "otp" | "testStart" | "teacherLogin";

const limitConfig: Record<RateLimitKind, { limit: number; window: `${number} ${"s" | "m" | "h" | "d"}` }> = {
  otp: { limit: 3, window: "5 m" },
  testStart: { limit: 5, window: "1 m" },
  teacherLogin: { limit: 10, window: "1 m" },
};

const globalForRateLimit = globalThis as unknown as {
  redis?: Redis;
  rateLimiters?: Map<RateLimitKind, Ratelimit>;
};

function isPlaceholder(value: string | undefined) {
  return !value || value.includes("example") || value.includes("change-me") || value.includes("placeholder");
}

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (isPlaceholder(url) || isPlaceholder(token)) {
    return null;
  }

  if (!globalForRateLimit.redis) {
    globalForRateLimit.redis = new Redis({ url: url as string, token: token as string });
  }

  return globalForRateLimit.redis;
}

function getLimiter(kind: RateLimitKind) {
  const redis = getRedis();

  if (!redis) {
    return null;
  }

  if (!globalForRateLimit.rateLimiters) {
    globalForRateLimit.rateLimiters = new Map();
  }

  const existing = globalForRateLimit.rateLimiters.get(kind);

  if (existing) {
    return existing;
  }

  const config = limitConfig[kind];
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(config.limit, config.window),
    prefix: `rate-limit:${kind}`,
  });

  globalForRateLimit.rateLimiters.set(kind, limiter);

  return limiter;
}

export async function checkRateLimit(kind: RateLimitKind, key: string) {
  const limiter = getLimiter(kind);

  if (!limiter) {
    return { success: true, remaining: null };
  }

  const result = await limiter.limit(key);

  return {
    success: result.success,
    remaining: result.remaining,
  };
}
