import './globals.css';
import type { Metadata } from 'next';
import { Database, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Generator Studi Kasus MySQL | DBA, DE & DA',
  description: 'Aplikasi generator latihan studi kasus MySQL realistis berbasis industri Indonesia untuk Database Administrator, Data Engineer, dan Data Analyst.',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <div className="preview-root">
          {/* Header */}
          <header className="preview-header">
            <div className="preview-header__brand">
              <div className="preview-header__logo">
                <Database size={16} />
              </div>
              <div>
                <span style={{ fontWeight: 700 }}>MySQL Case Studio</span>
                <span style={{ fontSize: '11px', color: 'var(--color-muted)', marginLeft: '8px' }}>
                  DBA · Data Engineer · Data Analyst
                </span>
              </div>
            </div>
            <nav className="preview-header__actions">
              <Link href="/" className="preview-header__action" style={{ fontWeight: 600 }}>
                Generator
              </Link>
              <Link href="/hasil" className="preview-header__action">
                Studi Kasus
              </Link>
              <span className="preview-tag preview-tag--neutral" style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={12} color="var(--color-primary)" />
                Validasi 2 Lapis
              </span>
            </nav>
          </header>

          {/* Main Body */}
          <div className="preview-shell">
            <main className="preview-main">
              {children}
            </main>
          </div>

          {/* Footer */}
          <footer style={{ borderTop: '1px solid var(--color-border)', padding: 'var(--space-4) var(--space-6)', textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--color-muted)', background: 'var(--color-surface)' }}>
            Generator Studi Kasus MySQL Indonesia &copy; 2026 · Dirancang khusus untuk persiapan karier Database Administrator, Data Engineer & Data Analyst.
          </footer>
        </div>
      </body>
    </html>
  );
}
