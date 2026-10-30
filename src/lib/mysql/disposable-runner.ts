import mysql from 'mysql2/promise';
import { CaseStudy } from '@/types/case-study';

export interface ExecutionResult {
  tested: boolean;
  success: boolean;
  message: string;
  error?: string;
  failedTaskNumber?: number;
  updatedCaseStudy?: CaseStudy;
}

export async function runCaseInDisposableDatabase(
  caseStudy: CaseStudy
): Promise<ExecutionResult> {
  const mysqlUrl = process.env.MYSQL_URL;

  if (!mysqlUrl) {
    return {
      tested: false,
      success: true,
      message: 'Belum diuji eksekusi (MYSQL_URL belum dikonfigurasi)',
      updatedCaseStudy: caseStudy,
    };
  }

  let connection: mysql.Connection | null = null;
  const tempDbName = `case_test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  try {
    // 1. Establish connection with multipleStatements enabled
    connection = await mysql.createConnection({
      uri: mysqlUrl,
      multipleStatements: true,
    });

    // 2. Create isolated throwaway database
    await connection.query(`CREATE DATABASE \`${tempDbName}\`;`);
    await connection.query(`USE \`${tempDbName}\`;`);

    // 3. Execute setupSql
    await connection.query(caseStudy.setupSql);

    // 4. Run each task sequentially
    const updatedTasks = [...caseStudy.tasks];

    for (let i = 0; i < updatedTasks.length; i++) {
      const task = updatedTasks[i];
      try {
        // Execute the answer SQL
        const [result] = await connection.query(task.answerSql);

        // Determine which query provides expectedResult
        let outputRows: any[] = [];
        let outputColumns: string[] = [];

        if (task.verificationSql && task.verificationSql.trim().length > 0) {
          const [verifyResult, fields] = await connection.query(task.verificationSql);
          if (Array.isArray(verifyResult)) {
            outputRows = verifyResult;
            if (fields && Array.isArray(fields)) {
              outputColumns = fields.map((f: any) => f.name);
            } else if (verifyResult.length > 0) {
              outputColumns = Object.keys(verifyResult[0]);
            }
          }
        } else if (Array.isArray(result)) {
          outputRows = result;
          if (result.length > 0 && typeof result[0] === 'object') {
            outputColumns = Object.keys(result[0]);
          }
        }

        // Auto-correct expectedResult with real data from MySQL
        if (outputColumns.length > 0) {
          updatedTasks[i] = {
            ...task,
            expectedResult: {
              columns: outputColumns,
              rows: outputRows,
            },
          };
        }
      } catch (err: any) {
        return {
          tested: true,
          success: false,
          message: `Eksekusi gagal pada Tugas #${task.taskNumber}: ${err.message}`,
          error: err.message,
          failedTaskNumber: task.taskNumber,
        };
      }
    }

    return {
      tested: true,
      success: true,
      message: 'Semua query berhasil diverifikasi dan dieksekusi pada database MySQL.',
      updatedCaseStudy: {
        ...caseStudy,
        tasks: updatedTasks,
      },
    };
  } catch (err: any) {
    return {
      tested: true,
      success: false,
      message: `Gagal menjalankan skrip setup MySQL: ${err.message}`,
      error: err.message,
    };
  } finally {
    // 5. Always drop disposable database
    if (connection) {
      try {
        await connection.query(`DROP DATABASE IF EXISTS \`${tempDbName}\`;`);
        await connection.end();
      } catch (cleanupErr) {
        console.error('Pembersihan database sementara gagal:', cleanupErr);
      }
    }
  }
}
