'use client';

import React, { useState } from 'react';
import { GenerationRequest, GenerationResponse, LevelType, MySqlVersionType, RoleType } from '@/types/case-study';
import { Sparkles, Dices, AlertTriangle, RefreshCw, CheckCircle2 } from 'lucide-react';

interface GeneratorFormProps {
  onSuccess: (data: GenerationResponse) => void;
}

const DEFAULT_RESPONSIBILITIES: Record<RoleType, string> = {
  'Database Administrator':
    'Memastikan stabilitas struktur tabel, integritas relasi antar entitas, penalaan indeks, dan keamanan transaksi data.',
  'Data Engineer':
    'Membangun tabel staging, transformasi pembersihan data, penanganan duplikasi, dan rekonsiliasi data antara sumber dan target.',
  'Data Analyst':
    'Menganalisis tren penjualan, retensi pelanggan, dan performa kategori untuk mendukung keputusan bisnis.',
};

const INDUSTRY_PRESETS = [
  'E-commerce',
  'Perbankan',
  'Logistik & Pengiriman',
  'Rumah Sakit & Kesehatan',
  'Telekomunikasi',
  'Fintech & Pinjaman',
  'Ritel & Supermarket',
];

export function GeneratorForm({ onSuccess }: GeneratorFormProps) {
  const [role, setRole] = useState<RoleType>('Data Analyst');
  const [level, setLevel] = useState<LevelType>('middle');
  const [industry, setIndustry] = useState('E-commerce');
  const [responsibilities, setResponsibilities] = useState(
    DEFAULT_RESPONSIBILITIES['Data Analyst']
  );
  const [taskCount, setTaskCount] = useState<number>(5);
  const [mysqlVersion, setMysqlVersion] = useState<MySqlVersionType>('8.0');
  const [seed, setSeed] = useState<string>('');

  // Status & progress
  const [loading, setLoading] = useState(false);
  const [progressStep, setProgressStep] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRoleChange = (newRole: RoleType) => {
    setRole(newRole);
    setResponsibilities(DEFAULT_RESPONSIBILITIES[newRole]);
  };

  const generateRandomSeed = () => {
    const random = Math.floor(100000 + Math.random() * 900000).toString();
    setSeed(random);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);
    setProgressStep(1); // "Membuat studi kasus"

    const payload: GenerationRequest = {
      role,
      level,
      industry,
      responsibilities,
      taskCount,
      mysqlVersion,
      seed: seed ? seed : null,
    };

    // Simulate progress visualizer steps
    const timer1 = setTimeout(() => setProgressStep(2), 1200); // "Memeriksa struktur"
    const timer2 = setTimeout(() => setProgressStep(3), 2400); // "Menjalankan SQL"

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || 'Gagal menghasilkan studi kasus.');
      }

      setProgressStep(4); // "Selesai"
      setTimeout(() => {
        onSuccess(data);
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan jaringan.');
      setProgressStep(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="preview-card" style={{ maxWidth: '840px', margin: '0 auto', background: 'var(--color-surface-raised)' }}>
      {/* Header Form */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-text)', marginBottom: 'var(--space-1)' }}>
          Konfigurasi Studi Kasus MySQL
        </h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}>
          Pilih peran kerja, tingkat kesulitan, dan sektor industri untuk menghasilkan latihan SQL praktis berbahasa Indonesia.
        </p>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="preview-error" style={{ marginBottom: 'var(--space-5)' }}>
          <AlertTriangle size={20} className="preview-error__icon" />
          <div className="preview-error__body" style={{ flex: 1 }}>
            <div className="preview-error__title">Gagal Menghasilkan Studi Kasus</div>
            <div className="preview-error__text">{errorMessage}</div>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="preview-button preview-button--secondary"
            style={{ fontSize: 'var(--text-xs)', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <RefreshCw size={14} />
            Coba Lagi
          </button>
        </div>
      )}

      {/* Loading Progress Bar */}
      {loading && (
        <div style={{ marginBottom: 'var(--space-5)', padding: 'var(--space-4)', background: 'var(--color-surface-sunken)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)', color: 'var(--color-primary)' }}>
            Proses Pembuatan Studi Kasus...
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-2)' }}>
            <div className={`progress-step ${progressStep >= 1 ? (progressStep > 1 ? 'progress-step--done' : 'progress-step--active') : 'progress-step--pending'}`}>
              <CheckCircle2 size={16} /> 1. Membuat Skenario
            </div>
            <div className={`progress-step ${progressStep >= 2 ? (progressStep > 2 ? 'progress-step--done' : 'progress-step--active') : 'progress-step--pending'}`}>
              <CheckCircle2 size={16} /> 2. Cek Struktur
            </div>
            <div className={`progress-step ${progressStep >= 3 ? (progressStep > 3 ? 'progress-step--done' : 'progress-step--active') : 'progress-step--pending'}`}>
              <CheckCircle2 size={16} /> 3. Validasi SQL
            </div>
            <div className={`progress-step ${progressStep >= 4 ? 'progress-step--done' : 'progress-step--pending'}`}>
              <CheckCircle2 size={16} /> 4. Selesai
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* 1. ROLE SELECTION */}
        <div>
          <label style={{ display: 'block', fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
            Peran Data (Target Karir) <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
            {(['Database Administrator', 'Data Engineer', 'Data Analyst'] as RoleType[]).map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => handleRoleChange(r)}
                style={{
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-sm)',
                  border: role === r ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  background: role === r ? 'color-mix(in srgb, var(--color-primary) 8%, var(--color-surface))' : 'var(--color-surface)',
                  color: role === r ? 'var(--color-primary)' : 'var(--color-text)',
                  fontWeight: role === r ? 700 : 500,
                  fontSize: 'var(--text-sm)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <div>{r}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-muted)', fontWeight: 400, marginTop: '4px' }}>
                  {r === 'Database Administrator' && 'Skema, Indexing, Transaksi, Audit'}
                  {r === 'Data Engineer' && 'Staging, Deduplikasi, Ingestion, Upsert'}
                  {r === 'Data Analyst' && 'KPI, Tren Waktu, Window Function, Cohort'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. RESPONSIBILITIES */}
        <div>
          <label style={{ display: 'block', fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>
            Deskripsi Fokus Tanggung Jawab
          </label>
          <textarea
            value={responsibilities}
            onChange={(e) => setResponsibilities(e.target.value)}
            rows={2}
            maxLength={500}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              fontSize: 'var(--text-sm)',
              fontFamily: 'inherit',
            }}
          />
        </div>

        {/* 3. LEVEL & MYSQL VERSION */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>
              Tingkat Kesulitan <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as LevelType)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                fontSize: 'var(--text-sm)',
              }}
            >
              <option value="easy">Mudah (Easy) - Query dasar & join tunggal</option>
              <option value="middle">Menengah (Middle) - Multi-tabel & GROUP BY</option>
              <option value="advance">Mahir (Advance) - Window function & optimasi</option>
              <option value="portfolio">Portofolio (Portfolio) - Proyek utuh + Rubrik</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>
              Versi MySQL Target
            </label>
            <select
              value={mysqlVersion}
              onChange={(e) => setMysqlVersion(e.target.value as MySqlVersionType)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                fontSize: 'var(--text-sm)',
              }}
            >
              <option value="8.0">MySQL 8.0 (Default LTS)</option>
              <option value="8.4">MySQL 8.4 (LTS Modern)</option>
            </select>
          </div>
        </div>

        {/* 4. INDUSTRY & PRESETS */}
        <div>
          <label style={{ display: 'block', fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>
            Sektor Industri <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <input
            type="text"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            required
            minLength={2}
            maxLength={50}
            placeholder="Contoh: E-commerce, Logistik, Rumah Sakit"
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              fontSize: 'var(--text-sm)',
              marginBottom: 'var(--space-2)',
            }}
          />
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>Pilihan cepat:</span>
            {INDUSTRY_PRESETS.map((preset) => (
              <button
                type="button"
                key={preset}
                onClick={() => setIndustry(preset)}
                className="preview-tag preview-tag--neutral"
                style={{ cursor: 'pointer', border: '1px solid var(--color-border)' }}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* 5. NUMBER OF TASKS & SEED */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
              <label style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                Jumlah Tugas/Soal: <span style={{ color: 'var(--color-primary)' }}>{taskCount} Soal</span>
              </label>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>3 - 15</span>
            </div>
            <input
              type="range"
              min={3}
              max={15}
              value={taskCount}
              onChange={(e) => setTaskCount(parseInt(e.target.value, 10))}
              style={{ width: '100%', accentColor: 'var(--color-primary)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>
              Seed Acak (Opsional)
            </label>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <input
                type="text"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder="misal: 482910"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  fontSize: 'var(--text-sm)',
                }}
              />
              <button
                type="button"
                onClick={generateRandomSeed}
                className="preview-button preview-button--secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-xs)' }}
                title="Buat angka acak baru"
              >
                <Dices size={14} /> Acak
              </button>
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div style={{ marginTop: 'var(--space-3)' }}>
          <button
            type="submit"
            disabled={loading}
            className="preview-button preview-button--primary"
            style={{
              width: '100%',
              padding: '12px 20px',
              fontSize: 'var(--text-base)',
              fontWeight: 700,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 'var(--space-2)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            <Sparkles size={18} />
            {loading ? 'Sedang Membuat Studi Kasus...' : 'Hasilkan Studi Kasus MySQL'}
          </button>
        </div>
      </form>
    </div>
  );
}
