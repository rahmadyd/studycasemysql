import { describe, it, expect } from 'vitest';
import { validateCaseStructure } from '@/lib/validation/structural-checks';
import { generateRealisticMockCase } from '@/lib/ai/mock-data';
import { GenerationRequest } from '@/types/case-study';

describe('Structural Checks Validation', () => {
  it('validates a compliant mock case study for Data Analyst', () => {
    const req: GenerationRequest = {
      role: 'Data Analyst',
      level: 'middle',
      industry: 'E-commerce',
      taskCount: 3,
      mysqlVersion: '8.0',
    };

    const mockCase = generateRealisticMockCase(req);
    const result = validateCaseStructure(mockCase, req);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.caseStudy?.tasks).toHaveLength(3);
    expect(result.caseStudy?.tasks[0].taskNumber).toBe(1);
    expect(result.caseStudy?.tasks[1].taskNumber).toBe(2);
    expect(result.caseStudy?.tasks[2].taskNumber).toBe(3);
  });

  it('validates a compliant mock case study for Database Administrator', () => {
    const req: GenerationRequest = {
      role: 'Database Administrator',
      level: 'advance',
      industry: 'Perbankan',
      taskCount: 4,
      mysqlVersion: '8.4',
    };

    const mockCase = generateRealisticMockCase(req);
    const result = validateCaseStructure(mockCase, req);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.caseStudy?.role).toBe('Database Administrator');
  });

  it('detects forbidden non-MySQL syntax like PostgreSQL SERIAL or ILIKE', () => {
    const req: GenerationRequest = {
      role: 'Data Engineer',
      level: 'easy',
      industry: 'Logistik',
      taskCount: 3,
      mysqlVersion: '8.0',
    };

    const mockCase = generateRealisticMockCase(req);
    // Inject forbidden syntax
    mockCase.setupSql = 'CREATE TABLE test (id SERIAL PRIMARY KEY);';

    const result = validateCaseStructure(mockCase, req);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('PostgreSQL SERIAL'))).toBe(true);
  });

  it('flags portfolio requirements when level is portfolio but rubric is missing', () => {
    const req: GenerationRequest = {
      role: 'Data Analyst',
      level: 'portfolio',
      industry: 'Fintech',
      taskCount: 3,
      mysqlVersion: '8.0',
    };

    const mockCase = generateRealisticMockCase(req);
    mockCase.portfolio = null; // Strip portfolio

    const result = validateCaseStructure(mockCase, req);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('level portfolio wajib menyertakan rubrik'))).toBe(true);
  });
});
