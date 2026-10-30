'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CaseResults } from '@/components/case-results';
import { GenerationResponse } from '@/types/case-study';
import { Database, PlusCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function HasilPage() {
  const router = useRouter();
  const [data, setData] = useState<GenerationResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = sessionStorage.getItem('current_case_study');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData(parsed);
      } catch (e) {
        console.error(e);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
        <div className="preview-skeleton preview-skeleton--title" style={{ margin: '0 auto' }} />
        <div className="preview-skeleton preview-skeleton--line" style={{ width: '60%', margin: '16px auto' }} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="preview-card" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center', padding: 'var(--space-8)' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'color-mix(in srgb, var(--color-primary) 15%, transparent)', display: 'grid', placeItems: 'center', margin: '0 auto var(--space-4)', color: 'var(--color-primary)' }}>
          <Database size={28} />
        </div>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
          Belum Ada Studi Kasus Aktif
        </h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', marginBottom: 'var(--space-6)', lineHeight: 1.6 }}>
          Anda belum membuat atau memuat studi kasus MySQL. Silakan gunakan generator untuk merancang studi kasus baru sesuai peran dan industri yang diinginkan.
        </p>
        <Link
          href="/"
          className="preview-button preview-button--primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', textDecoration: 'none' }}
        >
          <PlusCircle size={16} />
          Buka Generator Studi Kasus
        </Link>
      </div>
    );
  }

  return (
    <CaseResults
      caseStudy={data.caseStudy}
      validation={data.validation}
      provider={data.provider}
      onBack={() => router.push('/#generator-form-section')}
      onReset={() => {
        sessionStorage.removeItem('current_case_study');
        router.push('/');
      }}
    />
  );
}
