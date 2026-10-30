'use client';

import React, { useState } from 'react';
import { TaskItem } from '@/types/case-study';
import { ChevronDown, ChevronUp, Copy, Check, Terminal, Eye, EyeOff } from 'lucide-react';

interface AnswerPanelProps {
  task: TaskItem;
}

export function AnswerPanel({ task }: AnswerPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (sql: string) => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="preview-card" style={{ marginBottom: 'var(--space-4)', borderLeft: '4px solid var(--color-primary)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span className="preview-tag preview-tag--primary" style={{ fontWeight: 700, fontSize: 'var(--text-xs)' }}>
            Tugas #{task.taskNumber}
          </span>
          <span className="preview-badge preview-badge--neutral">
            {task.difficultyCategory}
          </span>
        </div>
      </div>

      <div style={{ marginTop: 'var(--space-3)' }}>
        <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text)', marginBottom: 'var(--space-2)' }}>
          {task.instruction}
        </h3>
        {task.hint && (
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', fontStyle: 'italic', margin: '4px 0' }}>
            💡 Petunjuk: {task.hint}
          </p>
        )}
      </div>

      <div style={{ marginTop: 'var(--space-4)' }}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="preview-button preview-button--secondary"
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}
        >
          {isOpen ? <EyeOff size={16} /> : <Eye size={16} />}
          {isOpen ? 'Sembunyikan Jawaban' : 'Lihat Jawaban & Penjelasan'}
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {isOpen && (
        <div style={{ marginTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
          {/* Answer SQL */}
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                <Terminal size={16} color="var(--color-primary)" />
                Kueri Solusi SQL:
              </div>
              <button
                type="button"
                onClick={() => handleCopy(task.answerSql)}
                className="preview-button preview-button--ghost"
                style={{ fontSize: 'var(--text-xs)', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                {copied ? <Check size={14} color="var(--color-success)" /> : <Copy size={14} />}
                {copied ? 'Tersalin' : 'Salin SQL'}
              </button>
            </div>
            <pre className="code-block">
              <code>{task.answerSql}</code>
            </pre>
          </div>

          {/* Verification SQL if any */}
          {task.verificationSql && (
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)', color: 'var(--color-accent)' }}>
                Query Verifikasi Perubahan:
              </div>
              <pre className="code-block" style={{ background: '#0f172a' }}>
                <code>{task.verificationSql}</code>
              </pre>
            </div>
          )}

          {/* Explanation */}
          <div style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--color-surface-sunken)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: '4px' }}>
              Penjelasan & Analisis Solusi:
            </div>
            <p style={{ fontSize: 'var(--text-sm)', margin: 0, color: 'var(--color-text)', lineHeight: 1.6 }}>
              {task.explanation}
            </p>
          </div>

          {/* Expected Result Table */}
          {task.expectedResult && task.expectedResult.columns && task.expectedResult.columns.length > 0 && (
            <div>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
                Hasil Luaran yang Diharapkan (Expected Result):
              </div>
              <div className="table-container">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr className="table-header">
                      {task.expectedResult.columns.map((col, idx) => (
                        <th key={idx} style={{ padding: '8px 12px' }}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {task.expectedResult.rows.length === 0 ? (
                      <tr>
                        <td colSpan={task.expectedResult.columns.length} style={{ padding: '16px', textAlign: 'center', color: 'var(--color-muted)', fontSize: 'var(--text-sm)' }}>
                          (Tidak ada baris / 0 records yang cocok)
                        </td>
                      </tr>
                    ) : (
                      task.expectedResult.rows.map((row: any, rIdx: number) => (
                        <tr key={rIdx} style={{ background: rIdx % 2 === 0 ? 'var(--color-surface-raised)' : 'var(--color-surface-sunken)' }}>
                          {task.expectedResult.columns.map((col, cIdx) => {
                            const val = Array.isArray(row) ? row[cIdx] : row[col];
                            return (
                              <td key={cIdx} className="table-cell">
                                {val !== null && val !== undefined ? String(val) : <em style={{ color: 'var(--color-muted)' }}>NULL</em>}
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
