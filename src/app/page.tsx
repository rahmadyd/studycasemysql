'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GeneratorForm } from '@/components/generator-form';
import { CaseResults } from '@/components/case-results';
import { GenerationResponse } from '@/types/case-study';
import { CheckCircle2, ShieldCheck, Terminal, ChevronDown, ChevronUp, SlidersHorizontal, Sparkles } from 'lucide-react';

export default function HomePage() {
  const [activeResponse, setActiveResponse] = useState<GenerationResponse | null>(null);
  const [showForm, setShowForm] = useState(true);
  const resultsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if there is a saved case in sessionStorage
    const saved = sessionStorage.getItem('current_case_study');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setActiveResponse(parsed);
      } catch (e) {
        sessionStorage.removeItem('current_case_study');
      }
    }
  }, []);

  const handleSuccess = (data: GenerationResponse) => {
    setActiveResponse(data);
    try {
      sessionStorage.setItem('current_case_study', JSON.stringify(data));
    } catch (e) {
      console.warn('SessionStorage quota exceeded');
    }

    // Smooth scroll down to results section on the same page
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const handleScrollToForm = () => {
    setShowForm(true);
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleReset = () => {
    setActiveResponse(null);
    sessionStorage.removeItem('current_case_study');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Hero Section */}
      <section className="preview-hero">
        <div className="preview-hero__mesh" />
        <div className="preview-hero__eyebrow" style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 'var(--text-xs)', opacity: 0.9 }}>
          Platform Praktik SQL Kontekstual Indonesia
        </div>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, lineHeight: 1.2 }}>
          Generator Studi Kasus MySQL untuk DBA, Data Engineer & Data Analyst
        </h1>
        <p style={{ fontSize: 'var(--text-base)', opacity: 0.95, maxWidth: '750px', lineHeight: 1.6 }}>
          Hasilkan studi kasus latihan MySQL nyata yang disesuaikan dengan tantangan on-the-job tiga peran data di industri Indonesia (E-commerce, Perbankan, Logistik, Rumah Sakit, dll.). Dilengkapi jaminan konsistensi struktur dan eksekusi SQL.
        </p>

        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginTop: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-xs)', background: 'rgba(255,255,255,0.15)', padding: '6px 12px', borderRadius: 'var(--radius-pill)' }}>
            <CheckCircle2 size={14} /> Bahasa Indonesia Murni
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-xs)', background: 'rgba(255,255,255,0.15)', padding: '6px 12px', borderRadius: 'var(--radius-pill)' }}>
            <ShieldCheck size={14} /> Jaminan Tanpa Sintaks Asing (No Postgres/T-SQL)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-xs)', background: 'rgba(255,255,255,0.15)', padding: '6px 12px', borderRadius: 'var(--radius-pill)' }}>
            <Terminal size={14} /> Jawaban & Penjelasan Tersembunyi
          </div>
        </div>
      </section>

      {/* Generator Form Section */}
      <div ref={formRef} id="generator-form-section">
        {activeResponse && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
            <button
              type="button"
              onClick={() => setShowForm(!showForm)}
              className="preview-button preview-button--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', fontWeight: 600 }}
            >
              <SlidersHorizontal size={16} />
              {showForm ? 'Sembunyikan Pengaturan Form' : 'Buka Pengaturan Form untuk Generate Ulang'}
              {showForm ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
              Hasil studi kasus aktif ditampilkan di bawah 👇
            </span>
          </div>
        )}

        {showForm && (
          <GeneratorForm onSuccess={handleSuccess} />
        )}
      </div>

      {/* Case Results Section (Shown on the same page below the form) */}
      <div ref={resultsRef} id="hasil-studi-kasus">
        {activeResponse && (
          <div style={{ borderTop: '2px dashed var(--color-border)', paddingTop: 'var(--space-6)', marginTop: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span className="preview-tag preview-tag--primary" style={{ fontSize: 'var(--text-xs)', padding: '4px 8px' }}>
                  <Sparkles size={13} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  Hasil Studi Kasus
                </span>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}>
                  Siap dipraktikkan langsung di MySQL
                </span>
              </div>
            </div>

            <CaseResults
              caseStudy={activeResponse.caseStudy}
              validation={activeResponse.validation}
              provider={activeResponse.provider}
              onBack={handleScrollToForm}
              onReset={handleReset}
            />
          </div>
        )}
      </div>
    </div>
  );
}
