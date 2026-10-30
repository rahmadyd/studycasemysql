import { z } from 'zod';

export const columnSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  isPrimary: z.boolean().optional(),
  isForeign: z.boolean().optional(),
  foreignReference: z.string().optional(),
  nullable: z.boolean().optional(),
  description: z.string().min(1),
});

export const tableSchema = z.object({
  tableName: z.string().min(1),
  description: z.string().min(1),
  columns: z.array(columnSchema).min(1),
  sampleRows: z.array(z.record(z.any())).min(1),
});

export const expectedResultSchema = z.object({
  columns: z.array(z.string()),
  rows: z.array(z.any()),
});

export const taskItemSchema = z.object({
  taskNumber: z.number().int().positive(),
  instruction: z.string().min(1),
  hint: z.string().min(1),
  difficultyCategory: z.string().min(1),
  answerSql: z.string().min(1),
  explanation: z.string().min(1),
  verificationSql: z.string().optional(),
  expectedResult: expectedResultSchema,
});

export const portfolioSchema = z.object({
  rubric: z.array(
    z.object({
      criterion: z.string().min(1),
      weight: z.string().min(1),
      description: z.string().min(1),
    })
  ).min(1),
  clientBrief: z.string().min(1),
  deliverables: z.array(z.string().min(1)).min(1),
  readmeTemplate: z.string().min(1),
});

export const caseStudySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  role: z.enum(['Database Administrator', 'Data Engineer', 'Data Analyst']),
  level: z.enum(['easy', 'middle', 'advance', 'portfolio']),
  industry: z.string().min(1),
  responsibilities: z.string().min(1),
  mysqlVersion: z.enum(['8.0', '8.4']),
  seed: z.union([z.string(), z.number(), z.null()]).optional(),
  scenario: z.string().min(1),
  learningGoals: z.array(z.string().min(1)).min(1),
  tables: z.array(tableSchema).min(1),
  setupSql: z.string().min(1),
  tasks: z.array(taskItemSchema).min(1),
  dataQualityNotes: z.array(z.string()).optional(),
  portfolio: portfolioSchema.nullable().optional(),
  createdAt: z.string().optional(),
});
