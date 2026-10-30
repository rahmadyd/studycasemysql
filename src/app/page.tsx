'use client';

import React, { useState, useEffect } from 'react';
import { GeneratorForm } from '@/components/generator-form';
import { CaseResults } from '@/components/case-results';
import { GenerationResponse } from '@/types/case-study';
import { Database, Sparkles, CheckCircle2, ShieldCheck, Terminal } from 'lucide-react';

export default function HomePage() {
  const [activeResponse, setActiveResponse] = useState<GenerationResponse | null>(null);

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
  };

  const handleBack = () => {
    setActiveResponse(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {!activeResponse && (
        <>
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

          {/* Form Component */}
          <GeneratorForm onSuccess={handleSuccess} />
        </>
      )}

      {activeResponse && (
        <CaseResults
          caseStudy={activeResponse.caseStudy}
          validation={activeResponse.validation}
          provider={activeResponse.provider}
          onBack={handleBack}
        />
      )}
    </div>
  );
}
