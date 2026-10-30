import { describe, it, expect } from 'vitest';
import { runCaseInDisposableDatabase } from '@/lib/mysql/disposable-runner';
import { generateRealisticMockCase } from '@/lib/ai/mock-data';

describe('Disposable MySQL Runner', () => {
  it('returns not_tested gracefully when MYSQL_URL is not configured', async () => {
    delete process.env.MYSQL_URL;

    const mockCase = generateRealisticMockCase({
      role: 'Database Administrator',
      level: 'middle',
      industry: 'E-commerce',
      taskCount: 3,
      mysqlVersion: '8.0',
    });

    const result = await runCaseInDisposableDatabase(mockCase);
    expect(result.tested).toBe(false);
    expect(result.success).toBe(true);
    expect(result.message).toContain('Belum diuji eksekusi');
  });
});
