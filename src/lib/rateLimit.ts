interface Bucket { count: number; resetAt: number }

const store = new Map<string, Bucket>();

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = store.get(key);

  if (!bucket || bucket.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) return false;
  bucket.count++;
  return true;
}

export function rateLimitResponse() {
  return Response.json(
    { error: 'Слишком много попыток. Повторите через минуту.' },
    { status: 429 },
  );
}
