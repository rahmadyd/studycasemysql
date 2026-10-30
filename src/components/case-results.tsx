'use client';

import React, { useState } from 'react';
import { CaseStudy, ValidationSummary } from '@/types/case-study';
import { AnswerPanel } from './answer-panel';
import { 
  ArrowLeft, ArrowUp, RotateCcw, Copy, Download, Check, Database, Award, 
  FileText, CheckCircle2, AlertCircle, ShieldAlert, BookOpen, Layers
} from 'lucide-react';

interface CaseResultsProps {
  caseStudy: CaseStudy;
  validation: ValidationSummary;
  provider: string;
  onBack: () => void;
  onReset?: () => void;
}

export function CaseResults({ caseStudy, validation, provider, onBack, onReset }: CaseResultsProps) {
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedReadme, setCopiedReadme] = useState(false);
  const [activeTab, setActiveTab] = useState<'soal' | 'skema' | 'portfolio'>('soal');

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(caseStudy, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(caseStudy, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studi-kasus-mysql-${caseStudy.role.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(caseStudy.setupSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([caseStudy.setupSql], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `setup-${caseStudy.role.toLowerCase().replace(/\s+/g, '-')}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyReadme = () => {
    if (caseStudy.portfolio?.readmeTemplate) {
      navigator.clipboard.writeText(caseStudy.portfolio.readmeTemplate);
      setCopiedReadme(true);
      setTimeout(() => setCopiedReadme(false), 2000);
    }
  };

  const isExecutionVerified = validation.execution === 'verified';
  const isExecutionNotTested = validation.execution === 'not_tested';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button
            type="button"
            onClick={onBack}
            className="preview-button preview-button--secondary"
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}
          >
            <ArrowUp size={16} />
            Ubah Pengaturan Form
          </button>

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="preview-button preview-button--ghost"
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}
              title="Bersihkan hasil dan mulai baru"
            >
              <RotateCcw size={15} />
              Reset
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleCopyJson}
            className="preview-button preview-button--secondary"
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
          >
            {copiedJson ? <Check size={16} color="var(--color-success)" /> : <Copy size={16} />}
            {copiedJson ? 'Tersalin' : 'Salin JSON'}
          </button>

          <button
            type="button"
            onClick={handleDownloadJson}
            className="preview-button preview-button--secondary"
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
          >
            <Download size={16} />
            Unduh .json
          </button>

          <button
            type="button"
            onClick={handleDownloadSql}
            className="preview-button preview-button--primary"
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
          >
            <Database size={16} />
            Unduh setup.sql
          </button>
        </div>
      </div>

      {/* Header Info Card */}
      <div className="preview-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
          <div>
            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', marginBottom: 'var(--space-2)', flexWrap: 'wrap' }}>
              <span className="preview-tag preview-tag--primary">{caseStudy.role}</span>
              <span className="preview-tag preview-tag--accent" style={{ textTransform: 'capitalize' }}>Level: {caseStudy.level}</span>
              <span className="preview-badge preview-badge--neutral">Industri: {caseStudy.industry}</span>
              <span className="preview-badge preview-badge--neutral">MySQL {caseStudy.mysqlVersion}</span>
            </div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text)' }}>
              {caseStudy.title}
            </h1>
          </div>

          <div>
            {isExecutionVerified ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(21, 128, 61, 0.1)', color: 'var(--color-success)', padding: '6px 12px', borderRadius: 'var(--radius-pill)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                <CheckCircle2 size={16} />
                Terverifikasi MySQL
              </div>
            ) : isExecutionNotTested ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(217, 119, 6, 0.1)', color: 'var(--color-accent)', padding: '6px 12px', borderRadius: 'var(--radius-pill)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                <AlertCircle size={16} />
                Belum diuji eksekusi
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(185, 28, 28, 0.1)', color: 'var(--color-danger)', padding: '6px 12px', borderRadius: 'var(--radius-pill)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                <ShieldAlert size={16} />
                Eksekusi Gagal
              </div>
            )}
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', textAlign: 'right', marginTop: '4px' }}>
              Provider: {provider}
            </div>
          </div>
        </div>

        {/* Business Scenario */}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
          <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 'var(--space-2)' }}>
            Latar Belakang Skenario Bisnis
          </h4>
          <p style={{ fontSize: 'var(--text-base)', lineHeight: 1.6, color: 'var(--color-text)', whiteSpace: 'pre-line' }}>
            {caseStudy.scenario}
          </p>
        </div>

        {/* Learning Goals */}
        {caseStudy.learningGoals && caseStudy.learningGoals.length > 0 && (
          <div style={{ marginTop: 'var(--space-4)', background: 'var(--color-surface-sunken)', padding: 'var(--space-4)', borderRadius: 'var(--radius-sm)' }}>
            <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: 'var(--space-2)' }}>
              <BookOpen size={16} />
              Tujuan Pembelajaran:
            </h4>
            <ul style={{ margin: 0, paddingLeft: 'var(--space-5)', fontSize: 'var(--text-sm)', color: 'var(--color-text)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {caseStudy.learningGoals.map((goal, idx) => (
                <li key={idx}>{goal}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="preview-nav" style={{ padding: 0, background: 'transparent' }}>
        <button
          type="button"
          onClick={() => setActiveTab('soal')}
          className={`preview-nav__link ${activeTab === 'soal' ? 'preview-nav__link--active' : ''}`}
          style={{ cursor: 'pointer', border: 'none', background: 'none' }}
        >
          Daftar Soal Latihan ({caseStudy.tasks.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('skema')}
          className={`preview-nav__link ${activeTab === 'skema' ? 'preview-nav__link--active' : ''}`}
          style={{ cursor: 'pointer', border: 'none', background: 'none' }}
        >
          Skema Tabel & Setup SQL ({caseStudy.tables.length} tabel)
        </button>
        {caseStudy.level === 'portfolio' && caseStudy.portfolio && (
          <button
            type="button"
            onClick={() => setActiveTab('portfolio')}
            className={`preview-nav__link ${activeTab === 'portfolio' ? 'preview-nav__link--active' : ''}`}
            style={{ cursor: 'pointer', border: 'none', background: 'none' }}
          >
            Kelengkapan Portofolio
          </button>
        )}
      </div>

      {/* TAB CONTENT: SOAL LATIHAN */}
      {activeTab === 'soal' && (
        <div>
          <div style={{ marginBottom: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
              Tugas & Soal Praktik ({caseStudy.tasks.length} Soal)
            </h2>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
              Klik tombol pada setiap tugas untuk membuka solusi dan hasil luaran
            </span>
          </div>

          <div>
            {caseStudy.tasks.map((task) => (
              <AnswerPanel key={task.taskNumber} task={task} />
            ))}
          </div>

          {/* Data Quality Notes */}
          {caseStudy.dataQualityNotes && caseStudy.dataQualityNotes.length > 0 && (
            <div className="preview-card" style={{ marginTop: 'var(--space-4)', background: 'color-mix(in srgb, var(--color-accent) 6%, var(--color-surface))' }}>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: 'var(--space-2)' }}>
                <Layers size={16} />
                Catatan Kualitas Data (Data Quality Notes):
              </h4>
              <ul style={{ margin: 0, paddingLeft: 'var(--space-5)', fontSize: 'var(--text-sm)' }}>
                {caseStudy.dataQualityNotes.map((note, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>{note}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: SKEMA TABEL & SETUP SQL */}
      {activeTab === 'skema' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {/* Tables Definition */}
          {caseStudy.tables.map((table, tIdx) => (
            <div key={tIdx} className="preview-card">
              <div style={{ marginBottom: 'var(--space-3)' }}>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-primary)' }}>
                  Tabel: <code>{table.tableName}</code>
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', marginTop: '4px' }}>
                  {table.description}
                </p>
              </div>

              {/* Column Structure */}
              <h5 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 'var(--space-2)' }}>
                Struktur Kolom
              </h5>
              <div className="table-container" style={{ marginBottom: 'var(--space-4)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr className="table-header">
                      <th style={{ padding: '8px 12px' }}>Nama Kolom</th>
                      <th style={{ padding: '8px 12px' }}>Tipe Data</th>
                      <th style={{ padding: '8px 12px' }}>Kunci</th>
                      <th style={{ padding: '8px 12px' }}>Nullable</th>
                      <th style={{ padding: '8px 12px' }}>Deskripsi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.columns.map((col, cIdx) => (
                      <tr key={cIdx} style={{ background: cIdx % 2 === 0 ? 'var(--color-surface-raised)' : 'var(--color-surface-sunken)' }}>
                        <td className="table-cell" style={{ fontWeight: 600 }}><code>{col.name}</code></td>
                        <td className="table-cell"><code>{col.type}</code></td>
                        <td className="table-cell">
                          {col.isPrimary && <span className="preview-tag preview-tag--primary" style={{ fontSize: '10px' }}>PK</span>}
                          {col.isForeign && <span className="preview-tag preview-tag--accent" style={{ fontSize: '10px', marginLeft: '4px' }}>FK</span>}
                        </td>
                        <td className="table-cell">{col.nullable ? 'Ya' : 'Tidak (NOT NULL)'}</td>
                        <td className="table-cell" style={{ color: 'var(--color-muted)' }}>{col.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Sample Rows */}
              <h5 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 'var(--space-2)' }}>
                Contoh Baris Data Awal (Sample Rows)
              </h5>
              <div className="table-container">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr className="table-header">
                      {table.columns.map((col, cIdx) => (
                        <th key={cIdx} style={{ padding: '8px 12px' }}>{col.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.sampleRows.map((row, rIdx) => (
                      <tr key={rIdx} style={{ background: rIdx % 2 === 0 ? 'var(--color-surface-raised)' : 'var(--color-surface-sunken)' }}>
                        {table.columns.map((col, cIdx) => (
                          <td key={cIdx} className="table-cell">
                            {row[col.name] !== undefined ? String(row[col.name]) : '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {/* Setup SQL Block */}
          <div className="preview-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700 }}>
                  Script Setup DDL & DML (setup.sql)
                </h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', margin: 0 }}>
                  Jalankan skrip ini langsung di MySQL Workbench atau CLI sebelum mengerjakan tugas.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="preview-button preview-button--secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-xs)' }}
                >
                  {copiedSql ? <Check size={14} color="var(--color-success)" /> : <Copy size={14} />}
                  {copiedSql ? 'Tersalin' : 'Salin SQL'}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadSql}
                  className="preview-button preview-button--primary"
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-xs)' }}
                >
                  <Download size={14} />
                  Unduh .sql
                </button>
              </div>
            </div>
            <pre className="code-block" style={{ maxHeight: '400px' }}>
              <code>{caseStudy.setupSql}</code>
            </pre>
          </div>
        </div>
      )}

      {/* TAB CONTENT: PORTFOLIO EXTRAS */}
      {activeTab === 'portfolio' && caseStudy.portfolio && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {/* Client Brief */}
          <div className="preview-card">
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-2)', color: 'var(--color-primary)' }}>
              📋 Kebutuhan Pemangku Kepentingan (Client Brief)
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', lineHeight: 1.6, color: 'var(--color-text)' }}>
              {caseStudy.portfolio.clientBrief}
            </p>
          </div>

          {/* Deliverables */}
          <div className="preview-card">
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-2)', color: 'var(--color-primary)' }}>
              📦 Luaran Proyek (Deliverables)
            </h3>
            <ul style={{ margin: 0, paddingLeft: 'var(--space-5)', fontSize: 'var(--text-sm)' }}>
              {caseStudy.portfolio.deliverables.map((item, idx) => (
                <li key={idx} style={{ marginBottom: '6px' }}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Rubric */}
          <div className="preview-card">
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-2)', color: 'var(--color-primary)' }}>
              🎯 Rubrik Evaluasi & Penilaian Portofolio
            </h3>
            <div className="table-container">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr className="table-header">
                    <th style={{ padding: '8px 12px' }}>Kriteria Penilaian</th>
                    <th style={{ padding: '8px 12px' }}>Bobot</th>
                    <th style={{ padding: '8px 12px' }}>Standar Mutu</th>
                  </tr>
                </thead>
                <tbody>
                  {caseStudy.portfolio.rubric.map((item, idx) => (
                    <tr key={idx} style={{ background: idx % 2 === 0 ? 'var(--color-surface-raised)' : 'var(--color-surface-sunken)' }}>
                      <td className="table-cell" style={{ fontWeight: 600 }}>{item.criterion}</td>
                      <td className="table-cell"><span className="preview-tag preview-tag--accent">{item.weight}</span></td>
                      <td className="table-cell" style={{ color: 'var(--color-muted)' }}>{item.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* README Template */}
          <div className="preview-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700 }}>
                📄 Template README.md untuk GitHub
              </h3>
              <button
                type="button"
                onClick={handleCopyReadme}
                className="preview-button preview-button--secondary"
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-xs)' }}
              >
                {copiedReadme ? <Check size={14} color="var(--color-success)" /> : <Copy size={14} />}
                {copiedReadme ? 'Tersalin' : 'Salin Template README'}
              </button>
            </div>
            <pre className="code-block" style={{ maxHeight: '350px' }}>
              <code>{caseStudy.portfolio.readmeTemplate}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
