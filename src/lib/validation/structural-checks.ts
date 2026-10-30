import { CaseStudy, GenerationRequest } from '@/types/case-study';
import { caseStudySchema } from './case-schema';

export interface StructuralValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateCaseStructure(
  data: unknown,
  expectedInput?: GenerationRequest
): { valid: boolean; errors: string[]; caseStudy?: CaseStudy } {
  const errors: string[] = [];

  const parsed = caseStudySchema.safeParse(data);
  if (!parsed.success) {
    const formatted = parsed.error.errors.map(
      (err) => `${err.path.join('.')}: ${err.message}`
    );
    return {
      valid: false,
      errors: [`Struktur JSON tidak valid sesuai skema: ${formatted.join('; ')}`],
    };
  }

  const caseStudy = parsed.data as CaseStudy;

  // 1. Check against expected input parameters
  if (expectedInput) {
    if (caseStudy.role !== expectedInput.role) {
      errors.push(
        `Peran tidak cocok: diharapkan '${expectedInput.role}', diperoleh '${caseStudy.role}'`
      );
    }
    if (caseStudy.level !== expectedInput.level) {
      errors.push(
        `Level tidak cocok: diharapkan '${expectedInput.level}', diperoleh '${caseStudy.level}'
      `);
    }
    if (
      expectedInput.industry &&
      !caseStudy.industry.toLowerCase().includes(expectedInput.industry.toLowerCase()) &&
      !expectedInput.industry.toLowerCase().includes(caseStudy.industry.toLowerCase())
    ) {
      errors.push(
        `Industri tidak cocok: diharapkan '${expectedInput.industry}', diperoleh '${caseStudy.industry}'`
      );
    }
    if (caseStudy.mysqlVersion !== expectedInput.mysqlVersion) {
      errors.push(
        `Versi MySQL tidak cocok: diharapkan '${expectedInput.mysqlVersion}', diperoleh '${caseStudy.mysqlVersion}'`
      );
    }
    if (caseStudy.tasks.length !== expectedInput.taskCount) {
      errors.push(
        `Jumlah tugas tidak cocok: diminta ${expectedInput.taskCount}, diperoleh ${caseStudy.tasks.length}`
      );
    }
  }

  // 2. Check task numbering continuity (1..N)
  for (let i = 0; i < caseStudy.tasks.length; i++) {
    if (caseStudy.tasks[i].taskNumber !== i + 1) {
      errors.push(
        `Penomoran tugas tidak berurutan pada indeks ${i}: diharapkan ${i + 1}, didapat ${caseStudy.tasks[i].taskNumber}`
      );
    }
  }

  // 3. Portfolio fields presence check
  if (caseStudy.level === 'portfolio') {
    if (!caseStudy.portfolio || !caseStudy.portfolio.rubric || caseStudy.portfolio.rubric.length === 0) {
      errors.push("Studi kasus level portfolio wajib menyertakan rubrik evaluasi dan deliverables.");
    }
  } else {
    if (caseStudy.portfolio && Object.keys(caseStudy.portfolio).length > 0) {
      // Non-portfolio levels should not have portfolio fields
      caseStudy.portfolio = null;
    }
  }

  // 4. Check for forbidden non-MySQL or server-wide syntax
  const forbiddenPatterns = [
    { pattern: /\b(SERIAL|BIGSERIAL)\b/i, name: 'PostgreSQL SERIAL' },
    { pattern: /\b(VARCHAR2|NUMBER\(\d+)\b/i, name: 'Oracle syntax' },
    { pattern: /\b(GETDATE\(\)|IDENTITY\(1,\s*1\)|TOP\s+\d+)\b/i, name: 'SQL Server syntax' },
    { pattern: /\b(CREATE\s+USER|DROP\s+USER|GRANT\s+|REVOKE\s+)\b/i, name: 'Server privilege command (CREATE/DROP USER / GRANT)' },
    { pattern: /\b(DROP\s+DATABASE|SHUTDOWN)\b/i, name: 'Destructive system command (DROP DATABASE / SHUTDOWN)' },
    { pattern: /\b(ILIKE)\b/i, name: 'PostgreSQL ILIKE' },
  ];

  const allSql = [
    caseStudy.setupSql,
    ...caseStudy.tasks.map((t) => `${t.answerSql} ${t.verificationSql || ''}`),
  ].join('\n');

  for (const { pattern, name } of forbiddenPatterns) {
    if (pattern.test(allSql)) {
      errors.push(`Ditemukan sintaks yang tidak diizinkan atau non-MySQL: ${name}`);
    }
  }

  // 5. Check schema and column consistency
  const tableNames = new Set(caseStudy.tables.map((t) => t.tableName.toLowerCase()));
  for (const table of caseStudy.tables) {
    const colNames = new Set(table.columns.map((c) => c.name.toLowerCase()));
    if (colNames.size !== table.columns.length) {
      errors.push(`Tabel '${table.tableName}' memiliki kolom duplikat.`);
    }

    // Verify sample rows keys
    for (const row of table.sampleRows) {
      for (const key of Object.keys(row)) {
        if (!colNames.has(key.toLowerCase())) {
          errors.push(
            `Sample row pada tabel '${table.tableName}' memiliki kolom '${key}' yang tidak terdaftar di skema.`
          );
        }
      }
    }
  }

  // Check setupSql contains table names
  for (const table of caseStudy.tables) {
    if (!caseStudy.setupSql.toLowerCase().includes(table.tableName.toLowerCase())) {
      errors.push(`setupSql tidak menyertakan pembuatan tabel '${table.tableName}'.`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    caseStudy,
  };
}
