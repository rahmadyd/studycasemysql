import { describe, it, expect } from 'vitest';
import { checkRateLimit } from '@/lib/rate-limit';

describe('Rate Limiter', () => {
  it('allows requests within window and blocks exceeding quota', () => {
    const testIp = `192.168.1.${Math.floor(Math.random() * 200 + 10)}`;

    // First 5 requests should pass
    for (let i = 0; i < 5; i++) {
      const res = checkRateLimit(testIp);
      expect(res.allowed).toBe(true);
    }

    // 6th request should be blocked
    const blockedRes = checkRateLimit(testIp);
    expect(blockedRes.allowed).toBe(false);
    expect(blockedRes.remaining).toBe(0);
    expect(blockedRes.resetInSec).toBeGreaterThan(0);
  });
});
