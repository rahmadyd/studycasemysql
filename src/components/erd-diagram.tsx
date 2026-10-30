'use client';

import React from 'react';
import { TableDefinition } from '@/types/case-study';
import { Table, Key, Link2, ArrowRight } from 'lucide-react';

interface ErdDiagramProps {
  tables: TableDefinition[];
}

export function ErdDiagram({ tables }: ErdDiagramProps) {
  // Find relationships between tables based on foreign keys
  const relationships: Array<{
    sourceTable: string;
    sourceCol: string;
    targetTable: string;
    targetCol: string;
  }> = [];

  tables.forEach((t) => {
    t.columns.forEach((c) => {
      if (c.isForeign && c.foreignReference) {
        // Example foreignReference: "rekening(nomor_rekening)"
        const match = c.foreignReference.match(/([a-zA-Z0-9_]+)\((.*?)\)/);
        if (match) {
          relationships.push({
            sourceTable: t.tableName,
            sourceCol: c.name,
            targetTable: match[1],
            targetCol: match[2],
          });
        }
      }
    });
  });

  return (
    <div className="preview-card" style={{ background: 'var(--color-surface-raised)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Table size={18} />
            Diagram Hubungan Antar Entitas (Visual ERD)
          </h3>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', margin: '4px 0 0 0' }}>
            Visualisasi struktur skema basis data dan penegakan relasi referensial (PK & FK).
          </p>
        </div>

        {relationships.length > 0 && (
          <span className="preview-tag preview-tag--accent" style={{ fontSize: 'var(--text-xs)' }}>
            {relationships.length} Relasi Kunci Terdeteksi
          </span>
        )}
      </div>

      {/* Grid of Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)', alignItems: 'start' }}>
        {tables.map((table, idx) => (
          <div
            key={table.tableName}
            style={{
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {/* Table Header */}
            <div
              style={{
                background: 'linear-gradient(135deg, var(--color-primary), #0d9488)',
                color: '#fff',
                padding: '10px 14px',
                fontWeight: 700,
                fontSize: 'var(--text-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Table size={16} />
              <code>{table.tableName}</code>
            </div>

            {/* Columns List */}
            <div style={{ padding: '8px 0' }}>
              {table.columns.map((col) => {
                const isPk = col.isPrimary;
                const isFk = col.isForeign;

                return (
                  <div
                    key={col.name}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '6px 14px',
                      fontSize: 'var(--text-xs)',
                      borderBottom: '1px solid color-mix(in srgb, var(--color-border) 40%, transparent)',
                      background: isPk ? 'color-mix(in srgb, var(--color-primary) 6%, transparent)' : isFk ? 'color-mix(in srgb, var(--color-accent) 6%, transparent)' : 'transparent',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {isPk && <span title="Primary Key" style={{ display: 'inline-flex' }}><Key size={12} color="var(--color-primary)" /></span>}
                      {isFk && <span title="Foreign Key" style={{ display: 'inline-flex' }}><Link2 size={12} color="var(--color-accent)" /></span>}
                      <span style={{ fontWeight: isPk || isFk ? 700 : 500, color: 'var(--color-text)' }}>
                        {col.name}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <code style={{ fontSize: '11px', color: 'var(--color-muted)' }}>{col.type}</code>
                      {isPk && <span className="preview-tag preview-tag--primary" style={{ fontSize: '9px', padding: '1px 4px' }}>PK</span>}
                      {isFk && <span className="preview-tag preview-tag--accent" style={{ fontSize: '9px', padding: '1px 4px' }}>FK</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Relational Connections Summary */}
      {relationships.length > 0 && (
        <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--color-surface-sunken)', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontWeight: 600, fontSize: 'var(--text-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Jalur Relasi Referential Integrity:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {relationships.map((rel, rIdx) => (
              <div key={rIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
                <span className="preview-tag preview-tag--accent" style={{ fontSize: '11px' }}>
                  {rel.sourceTable}.{rel.sourceCol}
                </span>
                <ArrowRight size={14} color="var(--color-muted)" />
                <span className="preview-tag preview-tag--primary" style={{ fontSize: '11px' }}>
                  {rel.targetTable}.{rel.targetCol}
                </span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>(Many-to-One / Foreign Reference)</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
