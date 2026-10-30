export type RoleType = 'Database Administrator' | 'Data Engineer' | 'Data Analyst';
export type LevelType = 'easy' | 'middle' | 'advance' | 'portfolio';
export type MySqlVersionType = '8.0' | '8.4';

export interface ColumnDefinition {
  name: string;
  type: string;
  isPrimary?: boolean;
  isForeign?: boolean;
  foreignReference?: string;
  nullable?: boolean;
  description: string;
}

export interface TableDefinition {
  tableName: string;
  description: string;
  columns: ColumnDefinition[];
  sampleRows: Record<string, any>[];
}

export interface ExpectedResult {
  columns: string[];
  rows: any[];
}

export interface TaskItem {
  taskNumber: number;
  instruction: string;
  hint: string;
  difficultyCategory: string;
  answerSql: string;
  explanation: string;
  verificationSql?: string;
  expectedResult: ExpectedResult;
}

export interface PortfolioMeta {
  rubric: Array<{ criterion: string; weight: string; description: string }>;
  clientBrief: string;
  deliverables: string[];
  readmeTemplate: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  role: RoleType;
  level: LevelType;
  industry: string;
  responsibilities: string;
  mysqlVersion: MySqlVersionType;
  seed?: string | number | null;
  scenario: string;
  learningGoals: string[];
  tables: TableDefinition[];
  setupSql: string;
  tasks: TaskItem[];
  dataQualityNotes?: string[];
  portfolio?: PortfolioMeta | null;
  createdAt: string;
}

export interface GenerationRequest {
  role: RoleType;
  level: LevelType;
  industry: string;
  responsibilities?: string;
  taskCount: number;
  mysqlVersion: MySqlVersionType;
  seed?: string | number | null;
}

export interface ValidationSummary {
  structural: {
    valid: boolean;
    errors: string[];
  };
  execution: 'verified' | 'not_tested' | 'failed';
  executionNotes?: string;
}

export interface GenerationResponse {
  caseStudy: CaseStudy;
  validation: ValidationSummary;
  provider: string;
}
