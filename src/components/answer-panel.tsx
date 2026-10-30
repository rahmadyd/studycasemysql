'use client';

import React, { useState } from 'react';
import { TaskItem } from '@/types/case-study';
import { 
  ChevronDown, ChevronUp, Copy, Check, Terminal, Eye, EyeOff, 
  Play, CheckCircle2, AlertCircle, Lock, Code2
} from 'lucide-react';

interface AnswerPanelProps {
  task: TaskItem;
  interviewMode?: boolean;
  interviewSubmitted?: boolean;
  isMarkedDone?: boolean;
  onToggleMarkDone?: () => void;
}

export function AnswerPanel({
  task,
  interviewMode = false,
  interviewSubmitted = false,
  isMarkedDone = false,
  onToggleMarkDone,
}: AnswerPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Playground state
  const [userSql, setUserSql] = useState('');
  const [playgroundFeedback, setPlaygroundFeedback] = useState<{
    status: 'success' | 'warning' | 'info' | null;
    message: string;
  }>({ status: null, message: '' });

  const handleCopy = (sql: string) => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunPlayground = () => {
    const trimmed = userSql.trim();
    if (!trimmed) {
      setPlaygroundFeedback({
        status: 'warning',
        message: 'Ketikkan kueri SQL Anda terlebih dahulu sebelum menguji.',
      });
      return;
    }

    const cleanUser = trimmed.toLowerCase();
    const cleanAnswer = task.answerSql.toLowerCase();

    // Key clause checks
    const requiresGroupBy = cleanAnswer.includes('group by');
    const userHasGroupBy = cleanUser.includes('group by');

    const requiresOrderBy = cleanAnswer.includes('order by');
    const userHasOrderBy = cleanUser.includes('order by');

    const requiresWindow = cleanAnswer.includes('over (') || cleanAnswer.includes('over(');
    const userHasWindow = cleanUser.includes('over (') || cleanUser.includes('over(');

    const requiresJoin = cleanAnswer.includes('join');
    const userHasJoin = cleanUser.includes('join');

    const requiresUpsert = cleanAnswer.includes('on duplicate key update');
    const userHasUpsert = cleanUser.includes('on duplicate key update');

    if (requiresGroupBy && !userHasGroupBy) {
      setPlaygroundFeedback({
        status: 'warning',
        message: '💡 Solusi membutuhkan agregasi kelompok. Jangan lupa sertakan klausa GROUP BY.',
      });
      return;
    }

    if (requiresWindow && !userHasWindow) {
      setPlaygroundFeedback({
        status: 'warning',
        message: '💡 Soal ini dirancang untuk melatih Window Function (klausa OVER (...)).',
      });
      return;
    }

    if (requiresJoin && !userHasJoin) {
      setPlaygroundFeedback({
        status: 'warning',
        message: '💡 Kueri ini membutuhkan relasi antartabel. Pastikan Anda menyertakan klausa JOIN.',
      });
      return;
    }

    if (requiresUpsert && !userHasUpsert) {
      setPlaygroundFeedback({
        status: 'warning',
        message: '💡 Gunakan sintaks idempotensi modern: ON DUPLICATE KEY UPDATE.',
      });
      return;
    }

    setPlaygroundFeedback({
      status: 'success',
      message: '🎉 Kueri SQL Anda valid dan polanya sesuai dengan tujuan pembelajaran soal ini!',
    });
  };

  const canViewAnswer = !interviewMode || interviewSubmitted;

  return (
    <div 
      className="preview-card" 
      style={{ 
        marginBottom: 'var(--space-4)', 
        borderLeft: `4px solid ${isMarkedDone ? 'var(--color-success)' : 'var(--color-primary)'}`,
        background: isMarkedDone ? 'color-mix(in srgb, var(--color-success) 3%, var(--color-surface-raised))' : 'var(--color-surface-raised)'
      }}
    >
      {/* Task Top Badges & Checkbox */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span className="preview-tag preview-tag--primary" style={{ fontWeight: 700, fontSize: 'var(--text-xs)' }}>
            Tugas #{task.taskNumber}
          </span>
          <span className="preview-badge preview-badge--neutral">
            {task.difficultyCategory}
          </span>
          {isMarkedDone && (
            <span className="preview-tag preview-tag--accent" style={{ background: 'var(--color-success)', color: '#fff', fontSize: '10px' }}>
              ✓ Selesai
            </span>
          )}
        </div>

        {interviewMode && onToggleMarkDone && (
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-xs)', cursor: 'pointer', fontWeight: 600 }}>
            <input 
              type="checkbox" 
              checked={isMarkedDone} 
              onChange={onToggleMarkDone}
              style={{ accentColor: 'var(--color-success)', width: 16, height: 16 }}
            />
            Tandai Selesai
          </label>
        )}
      </div>

      {/* Instruction */}
      <div style={{ marginTop: 'var(--space-3)' }}>
        <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text)', marginBottom: 'var(--space-2)' }}>
          {task.instruction}
        </h3>
        {task.hint && canViewAnswer && (
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', fontStyle: 'italic', margin: '4px 0' }}>
            💡 Petunjuk: {task.hint}
          </p>
        )}
      </div>

      {/* Interactive SQL Playground Section */}
      <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--color-surface-sunken)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Code2 size={14} color="var(--color-primary)" />
            Coba Kerjakan Sendiri (SQL Playground)
          </span>
          <button
            type="button"
            onClick={handleRunPlayground}
            className="preview-button preview-button--primary"
            style={{ fontSize: 'var(--text-xs)', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Play size={12} fill="currentColor" />
            Uji Solusi Saya
          </button>
        </div>

        <textarea
          value={userSql}
          onChange={(e) => setUserSql(e.target.value)}
          placeholder="Ketikkan kueri MySQL jawaban Anda di sini (misal: SELECT ... FROM ...)..."
          rows={3}
          style={{
            width: '100%',
            fontFamily: 'ui-monospace, monospace',
            fontSize: '13px',
            padding: '8px 10px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface-raised)',
            color: 'var(--color-text)',
            resize: 'vertical',
          }}
        />

        {playgroundFeedback.status && (
          <div style={{ 
            marginTop: '8px', 
            padding: '8px 12px', 
            borderRadius: 'var(--radius-sm)', 
            fontSize: 'var(--text-xs)',
            background: playgroundFeedback.status === 'success' ? 'rgba(21, 128, 61, 0.1)' : 'rgba(217, 119, 6, 0.1)',
            color: playgroundFeedback.status === 'success' ? 'var(--color-success)' : 'var(--color-warning)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            {playgroundFeedback.status === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
            {playgroundFeedback.message}
          </div>
        )}
      </div>

      {/* Answer Toggle */}
      <div style={{ marginTop: 'var(--space-4)' }}>
        {canViewAnswer ? (
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
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)', color: 'var(--color-muted)', padding: '8px 12px', background: 'var(--color-surface-sunken)', borderRadius: 'var(--radius-sm)' }}>
            <Lock size={14} color="var(--color-accent)" />
            <span>Kunci jawaban terkunci selama <strong>Mode Interview</strong> aktif. Kumpulkan interview untuk membuka solusi.</span>
          </div>
        )}
      </div>

      {/* Hidden Answer Content */}
      {isOpen && canViewAnswer && (
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
