import { GenerationRequest } from '@/types/case-study';

export function buildSystemPrompt(): string {
  return `Anda adalah instruktur database profesional dan arsitek data terkemuka di Indonesia.
Tugas Anda adalah menghasilkan studi kasus latihan MySQL yang realistis, aplikatif, dan berkualitas industri dalam Bahasa Indonesia murni.

Studi kasus disesuaikan secara mendalam untuk 3 peran utama:
1. Database Administrator (DBA):
   - Desain skema, penegakan foreign key, constraint (CHECK, UNIQUE).
   - Strategi indexing (B-Tree, composite index) dan optimasi query berbasis EXPLAIN.
   - Pengecekan integritas data (mencari orphan records, data duplikat, pelanggaran referensial).
   - Perubahan skema dan data yang aman menggunakan transaksi (BEGIN, COMMIT, ROLLBACK).
   - Terapkan query verifikasi (SELECT) untuk memastikan perubahan berhasil.

2. Data Engineer (DE):
   - Arsitektur tabel staging vs tabel target/warehouse.
   - Pembersihan data, normalisasi format (tanggal, no telepon, status).
   - Deduplikasi dan upsert modern (INSERT ... ON DUPLICATE KEY UPDATE).
   - Pemrosesan inkremental (incremental loading berbasis timestamp/ID).
   - Rekonsiliasi data (verifikasi total baris & agregat antara tabel sumber dan target).

3. Data Analyst (DA):
   - Ringkasan KPI bisnis (omzet, pertumbuhan, rata-rata keranjang belanja).
   - Analisis tren waktu (harian, bulanan, YoY).
   - Segmentasi pelanggan (RFM, kontribusi omzet).
   - Window function (ROW_NUMBER, DENSE_RANK, SUM() OVER, LAG/LEAD).
   - Analisis cohort & retensi, serta kesimpulan bisnis yang siap disajikan ke manajemen.

ATURAN WAJIB & STRICT:
1. Seluruh teks skenario, instruksi, penjelasan, dan petunjuk HARUS dalam Bahasa Indonesia yang formal dan profesional.
2. Gunakan sintaks standar MySQL 8.0/8.4 murni. DILARANG menggunakan sintaks database lain seperti SERIAL, VARCHAR2, GETDATE(), TOP N, ILIKE.
3. DILARANG menyertakan perintah manajemen server atau privilege server-wide seperti CREATE USER, DROP USER, GRANT, REVOKE, SHUTDOWN, DROP DATABASE.
4. setupSql harus dapat dieksekusi langsung secara mandiri di MySQL: membuat tabel (CREATE TABLE) dengan tipe data yang tepat, dan mengisi data awal (INSERT INTO) yang cukup untuk menyelesaikan semua soal.
5. Untuk tugas yang memodifikasi skema atau data (ALTER, UPDATE, INSERT, CREATE INDEX), sertakan atribut "verificationSql" berupa query SELECT untuk memvalidasi hasilnya.
6. JSON yang dikembalikan harus valid dan sesuai dengan skema JSON yang diminta tanpa format markdown lain selain raw JSON.`;
}

export function buildUserPrompt(req: GenerationRequest): string {
  const roleGuidelines: Record<string, string> = {
    'Database Administrator':
      'Fokus pada kesehatan database, indeks, query tuning dengan EXPLAIN, integritas constraint, dan manipulasi data aman dengan verifikasi.',
    'Data Engineer':
      'Fokus pada pipeline ETL/ELT sederhana, tabel staging ke target, deduplikasi, pembersihan data, upsert ON DUPLICATE KEY UPDATE, dan rekonsiliasi.',
    'Data Analyst':
      'Fokus pada penarikan insight bisnis, KPI, tren historis, window functions, agregasi analitik, dan cohort.',
  };

  const levelGuidelines: Record<string, string> = {
    easy: 'Tingkat dasar: struktur tabel sederhana (1-2 tabel), join mendasar, filter WHERE, agregasi dasar (COUNT, SUM, AVG).',
    middle:
      'Tingkat menengah: relasi 2-4 tabel, GROUP BY dengan HAVING, CASE WHEN, subquery, index komposit, transaksi sederhana.',
    advance:
      'Tingkat mahir: relasi kompleks (3-5 tabel), Window functions (LAG, LEAD, DENSE_RANK), Common Table Expressions (CTE/WITH), EXPLAIN ANALYZE, query optimasi dan rekonsiliasi.',
    portfolio:
      'Tingkat portfolio komprehensif: skenario end-to-end lengkap yang layak dimasukkan ke portofolio GitHub/CV, mencakup rubrik evaluasi, ringkasan kebutuhan klien (client brief), deliverables terperinci, dan template README.',
  };

  return `Hasilkan sebuah studi kasus MySQL baru dengan spesifikasi berikut:
- Peran: ${req.role}
- Deskripsi Tanggung Jawab Peran: ${req.responsibilities || 'Sesuai standar industri'}
- Pedoman Peran: ${roleGuidelines[req.role]}
- Tingkat Kesulitan: ${req.level} (${levelGuidelines[req.level]})
- Sektor Industri: ${req.industry}
- Jumlah Tugas/Soal: ${req.taskCount} tugas berurutan (nomor 1 sampai ${req.taskCount})
- Versi Target MySQL: ${req.mysqlVersion}
${req.seed ? `- Seed / Randomizer: ${req.seed}` : ''}

Format Output: Kembalikan HANYA dokumen JSON valid tanpa teks pengantar atau blok markdown pembungkus.
Struktur JSON:
{
  "id": "case-${Date.now()}",
  "title": "Judul Studi Kasus yang Menarik dan Kontekstual",
  "role": "${req.role}",
  "level": "${req.level}",
  "industry": "${req.industry}",
  "responsibilities": "Ringkasan tanggung jawab",
  "mysqlVersion": "${req.mysqlVersion}",
  "seed": ${req.seed ? JSON.stringify(req.seed) : 'null'},
  "scenario": "Cerita latar belakang bisnis realistis di Indonesia (2-3 paragraf)",
  "learningGoals": ["Tujuan pembelajaran 1", "Tujuan pembelajaran 2", "Tujuan pembelajaran 3"],
  "tables": [
    {
      "tableName": "nama_tabel",
      "description": "Deskripsi fungsi tabel",
      "columns": [
        {
          "name": "nama_kolom",
          "type": "VARCHAR(50) / INT / dsb",
          "isPrimary": true,
          "isForeign": false,
          "nullable": false,
          "description": "Keterangan kolom"
        }
      ],
      "sampleRows": [
        { "nama_kolom": "nilai contoh 1" },
        { "nama_kolom": "nilai contoh 2" }
      ]
    }
  ],
  "setupSql": "-- DDL CREATE TABLE dan DML INSERT INTO yang valid dan siap dijalankan\\n...",
  "tasks": [
    {
      "taskNumber": 1,
      "instruction": "Instruksi soal yang jelas",
      "hint": "Petunjuk teknis atau fungsi yang disarankan",
      "difficultyCategory": "Kategori keahlian (misal: Agregasi / Window Function / Indexing / Upsert)",
      "answerSql": "SELECT ...;",
      "verificationSql": "SELECT ... (opsional jika answerSql berupa DDL/DML, kosongkan jika SELECT)",
      "explanation": "Penjelasan mendalam mengapa solusi SQL tersebut efektif dan bagaimana cara kerjanya",
      "expectedResult": {
        "columns": ["kolom_a", "kolom_b"],
        "rows": [
          { "kolom_a": "val1", "kolom_b": 100 }
        ]
      }
    }
  ],
  "dataQualityNotes": [
    "Catatan kualitas data atau anomali yang sengaja dimasukkan untuk dilatih"
  ],
  "portfolio": ${
    req.level === 'portfolio'
      ? `{
    "rubric": [
      { "criterion": "Kualitas Desain Skema & Index", "weight": "25%", "description": "Kriteria penilaian" },
      { "criterion": "Akurasi Query & Optimalisasi", "weight": "35%", "description": "Kriteria penilaian" },
      { "criterion": "Dokumentasi & Wawasan Bisnis", "weight": "40%", "description": "Kriteria penilaian" }
    ],
    "clientBrief": "Ringkasan latar belakang kebutuhan pemangku kepentingan",
    "deliverables": ["Script SQL migrasi", "Laporan analisis PDF/Markdown", "Visualisasi hasil"],
    "readmeTemplate": "# Proyek MySQL Portofolio\\n\\n## Ringkasan..."
  }`
      : 'null'
  },
  "createdAt": "${new Date().toISOString()}"
}`;
}

export function buildRepairPrompt(failedJson: string, errorMessage: string): string {
  return `JSON studi kasus sebelumnya menghasilkan error saat divalidasi atau dieksekusi di MySQL.
Pesan Error:
${errorMessage}

Perbaiki JSON berikut agar valid, konsisten, dan dapat dieksekusi tanpa error di MySQL 8.0+.
Kembalikan HANYA dokumen JSON yang telah diperbaiki:
${failedJson}`;
}
