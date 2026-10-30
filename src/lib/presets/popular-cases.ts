import { CaseStudy, GenerationResponse } from '@/types/case-study';

export const POPULAR_CASE_STUDIES: Array<{
  id: string;
  badge: string;
  title: string;
  role: 'Database Administrator' | 'Data Engineer' | 'Data Analyst';
  industry: string;
  level: 'middle' | 'advance' | 'portfolio';
  taskCount: number;
  description: string;
  data: GenerationResponse;
}> = [
  {
    id: 'preset-bank-dba',
    badge: 'Populer untuk DBA',
    title: 'Audit Integritas & Optimasi Index Rekening Transaksional Bank',
    role: 'Database Administrator',
    industry: 'Perbankan',
    level: 'advance',
    taskCount: 4,
    description: 'Menangani lonjakan query mutasi rekening, penegakan foreign key, pendeteksian orphan records, dan pembuatan composite index.',
    data: {
      provider: 'Template Pilihan Bank Central Mandiri',
      validation: {
        structural: { valid: true, errors: [] },
        execution: 'verified',
        executionNotes: 'Terverifikasi pada engine MySQL 8.0',
      },
      caseStudy: {
        id: 'cs-bank-dba-01',
        title: 'Audit Integritas & Optimasi Index Rekening Transaksional Bank',
        role: 'Database Administrator',
        level: 'advance',
        industry: 'Perbankan',
        responsibilities: 'Memastikan integritas relasional rekening nasabah, penalaan indeks transaksi tinggi, dan penghapusan anomali data.',
        mysqlVersion: '8.0',
        scenario: `Bank Nusa Sejahtera sedang mengalami masalah latensi pada layanan mobile banking saat jam sibuk awal bulan. Query riwayat mutasi nasabah memakan waktu lebih dari 4 detik karena tabel transaksi telah mencapai jutaan rekaman tanpa indeks komposit yang tepat.\n\nSelain itu, terdapat dugaan adanya anomali data di mana terdapat transaksi yang tercatat tanpa nomor rekening nasabah yang valid (orphan rows) akibat migrasi sistem lama yang tidak menegakkan foreign key constraint.`,
        learningGoals: [
          'Mengidentifikasi dan membersihkan baris data yatim (orphan rows) sebelum penegakan Foreign Key.',
          'Menerapkan constraint FOREIGN KEY dan CHECK pada MySQL 8.0.',
          'Membangun Composite Index (nomor_rekening, tanggal_transaksi) untuk menghindari File Sort.',
          'Mengamankan transaksi mutasi dana dengan sintaks ACID berantai.',
        ],
        tables: [
          {
            tableName: 'nasabah',
            description: 'Master data nasabah perbankan',
            columns: [
              { name: 'cif_id', type: 'INT', isPrimary: true, nullable: false, description: 'Customer Identification File' },
              { name: 'nama_nasabah', type: 'VARCHAR(100)', nullable: false, description: 'Nama lengkap nasabah' },
              { name: 'tipe_akun', type: 'VARCHAR(30)', nullable: false, description: 'Prioritas / Reguler' },
              { name: 'status_aktif', type: 'TINYINT(1)', nullable: false, description: '1 = Aktif, 0 = Diblokir' },
            ],
            sampleRows: [
              { cif_id: 1001, nama_nasabah: 'Hendro Wijaya', tipe_akun: 'Prioritas', status_aktif: 1 },
              { cif_id: 1002, nama_nasabah: 'Dewi Lestari', tipe_akun: 'Reguler', status_aktif: 1 },
              { cif_id: 1003, nama_nasabah: 'Ahmad Fauzi', tipe_akun: 'Reguler', status_aktif: 0 },
            ],
          },
          {
            tableName: 'rekening',
            description: 'Rekening tabungan yang dimiliki nasabah',
            columns: [
              { name: 'nomor_rekening', type: 'VARCHAR(20)', isPrimary: true, nullable: false, description: 'Nomor rekening unik' },
              { name: 'cif_id', type: 'INT', isForeign: true, foreignReference: 'nasabah(cif_id)', nullable: false, description: 'Pemilik rekening' },
              { name: 'jenis_tabungan', type: 'VARCHAR(30)', nullable: false, description: 'Tabungan Giro / Bisnis / Utama' },
              { name: 'saldo', type: 'DECIMAL(15,2)', nullable: false, description: 'Saldo saat ini' },
            ],
            sampleRows: [
              { nomor_rekening: 'REK-8801', cif_id: 1001, jenis_tabungan: 'Bisnis', saldo: 250000000.00 },
              { nomor_rekening: 'REK-8802', cif_id: 1002, jenis_tabungan: 'Utama', saldo: 14500000.00 },
            ],
          },
          {
            tableName: 'mutasi_transaksi',
            description: 'Log transaksi debet dan kredit rekening nasabah',
            columns: [
              { name: 'id_transaksi', type: 'BIGINT', isPrimary: true, nullable: false, description: 'ID transaksi' },
              { name: 'nomor_rekening', type: 'VARCHAR(20)', isForeign: true, foreignReference: 'rekening(nomor_rekening)', nullable: false, description: 'Nomor rekening' },
              { name: 'jenis_mutasi', type: 'ENUM("DEBIT", "KREDIT")', nullable: false, description: 'Tipe mutasi' },
              { name: 'nominal', type: 'DECIMAL(12,2)', nullable: false, description: 'Besar dana' },
              { name: 'tanggal_transaksi', type: 'DATETIME', nullable: false, description: 'Timestamp transaksi' },
            ],
            sampleRows: [
              { id_transaksi: 5001, nomor_rekening: 'REK-8801', jenis_mutasi: 'KREDIT', nominal: 10000000.00, tanggal_transaksi: '2026-09-01 08:30:00' },
              { id_transaksi: 5002, nomor_rekening: 'REK-8801', jenis_mutasi: 'DEBIT', nominal: 2500000.00, tanggal_transaksi: '2026-09-02 14:15:00' },
              { id_transaksi: 5003, nomor_rekening: 'REK-8802', jenis_mutasi: 'KREDIT', nominal: 5000000.00, tanggal_transaksi: '2026-09-03 10:00:00' },
              { id_transaksi: 5004, nomor_rekening: 'REK-9999', jenis_mutasi: 'DEBIT', nominal: 100000.00, tanggal_transaksi: '2026-09-03 11:00:00' },
            ],
          },
        ],
        setupSql: `CREATE TABLE IF NOT EXISTS nasabah (
  cif_id INT PRIMARY KEY,
  nama_nasabah VARCHAR(100) NOT NULL,
  tipe_akun VARCHAR(30) NOT NULL,
  status_aktif TINYINT(1) NOT NULL
);

CREATE TABLE IF NOT EXISTS rekening (
  nomor_rekening VARCHAR(20) PRIMARY KEY,
  cif_id INT NOT NULL,
  jenis_tabungan VARCHAR(30) NOT NULL,
  saldo DECIMAL(15,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS mutasi_transaksi (
  id_transaksi BIGINT PRIMARY KEY,
  nomor_rekening VARCHAR(20) NOT NULL,
  jenis_mutasi ENUM('DEBIT', 'KREDIT') NOT NULL,
  nominal DECIMAL(12,2) NOT NULL,
  tanggal_transaksi DATETIME NOT NULL
);

INSERT INTO nasabah (cif_id, nama_nasabah, tipe_akun, status_aktif) VALUES
(1001, 'Hendro Wijaya', 'Prioritas', 1),
(1002, 'Dewi Lestari', 'Reguler', 1),
(1003, 'Ahmad Fauzi', 'Reguler', 0);

INSERT INTO rekening (nomor_rekening, cif_id, jenis_tabungan, saldo) VALUES
('REK-8801', 1001, 'Bisnis', 250000000.00),
('REK-8802', 1002, 'Utama', 14500000.00);

INSERT INTO mutasi_transaksi (id_transaksi, nomor_rekening, jenis_mutasi, nominal, tanggal_transaksi) VALUES
(5001, 'REK-8801', 'KREDIT', 10000000.00, '2026-09-01 08:30:00'),
(5002, 'REK-8801', 'DEBIT', 2500000.00, '2026-09-02 14:15:00'),
(5003, 'REK-8802', 'KREDIT', 5000000.00, '2026-09-03 10:00:00'),
(5004, 'REK-9999', 'DEBIT', 100000.00, '2026-09-03 11:00:00');`,
        tasks: [
          {
            taskNumber: 1,
            instruction: 'Temukan transaksi yatim (orphan rows) pada tabel `mutasi_transaksi` yang nomor rekeningnya tidak terdaftar pada tabel `rekening`.',
            hint: 'Gunakan LEFT JOIN dari mutasi_transaksi ke rekening lalu filter baris yang rekening.nomor_rekening IS NULL.',
            difficultyCategory: 'Audit Relasional',
            answerSql: `SELECT m.id_transaksi, m.nomor_rekening, m.nominal, m.tanggal_transaksi
FROM mutasi_transaksi m
LEFT JOIN rekening r ON m.nomor_rekening = r.nomor_rekening
WHERE r.nomor_rekening IS NULL;`,
            explanation: 'Query ini mengisolasi data anomali REK-9999 yang tidak memiliki induk rekening sebelum Foreign Key diaplikasikan.',
            expectedResult: {
              columns: ['id_transaksi', 'nomor_rekening', 'nominal', 'tanggal_transaksi'],
              rows: [{ id_transaksi: 5004, nomor_rekening: 'REK-9999', nominal: 100000.0, tanggal_transaksi: '2026-09-03 11:00:00' }],
            },
          },
          {
            taskNumber: 2,
            instruction: 'Bersihkan baris anomali tersebut dan buat Foreign Key resmi dari `mutasi_transaksi(nomor_rekening)` ke `rekening(nomor_rekening)`.',
            hint: 'Jalankan DELETE m FROM mutasi_transaksi m ... lalu ALTER TABLE mutasi_transaksi ADD CONSTRAINT ...',
            difficultyCategory: 'Penegakan Constraint DDL',
            answerSql: `DELETE FROM mutasi_transaksi WHERE nomor_rekening = 'REK-9999';
ALTER TABLE mutasi_transaksi ADD CONSTRAINT fk_mutasi_rekening FOREIGN KEY (nomor_rekening) REFERENCES rekening(nomor_rekening);`,
            verificationSql: "SELECT CONSTRAINT_NAME, TABLE_NAME, REFERENCED_TABLE_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_NAME = 'mutasi_transaksi' AND CONSTRAINT_NAME = 'fk_mutasi_rekening';",
            explanation: 'Menghapus data yatim memungkinkan pembuatan constraint foreign key berhasil tanpa melanggar referential integrity.',
            expectedResult: {
              columns: ['CONSTRAINT_NAME', 'TABLE_NAME', 'REFERENCED_TABLE_NAME'],
              rows: [{ CONSTRAINT_NAME: 'fk_mutasi_rekening', TABLE_NAME: 'mutasi_transaksi', REFERENCED_TABLE_NAME: 'rekening' }],
            },
          },
          {
            taskNumber: 3,
            instruction: 'Buat indeks komposit pada `mutasi_transaksi` untuk mengoptimalkan query mutasi berdasarkan `nomor_rekening` dan urutan kronologis `tanggal_transaksi`.',
            hint: 'Gunakan CREATE INDEX idx_mutasi_rek_tgl ON mutasi_transaksi (nomor_rekening, tanggal_transaksi DESC);',
            difficultyCategory: 'Indexing & Performance',
            answerSql: 'CREATE INDEX idx_mutasi_rek_tgl ON mutasi_transaksi (nomor_rekening, tanggal_transaksi DESC);',
            verificationSql: "SHOW INDEX FROM mutasi_transaksi WHERE Key_name = 'idx_mutasi_rek_tgl';",
            explanation: 'Indeks komposit (nomor_rekening, tanggal_transaksi DESC) memungkinkan pencarian mutasi 100x lebih cepat langsung dari index leaf node.',
            expectedResult: {
              columns: ['Table', 'Key_name', 'Column_name', 'Seq_in_index'],
              rows: [
                { Table: 'mutasi_transaksi', Key_name: 'idx_mutasi_rek_tgl', Column_name: 'nomor_rekening', Seq_in_index: 1 },
                { Table: 'mutasi_transaksi', Key_name: 'idx_mutasi_rek_tgl', Column_name: 'tanggal_transaksi', Seq_in_index: 2 },
              ],
            },
          },
          {
            taskNumber: 4,
            instruction: 'Tampilkan rekapitulasi mutasi dana per nasabah: total kredit, total debet, dan saldo akhir terverifikasi.',
            hint: 'Gabungkan nasabah, rekening, dan mutasi_transaksi dengan SUM(CASE WHEN ...).',
            difficultyCategory: 'Rekonsiliasi Keuangan',
            answerSql: `SELECT 
  n.nama_nasabah,
  r.nomor_rekening,
  r.saldo AS saldo_buku,
  COALESCE(SUM(CASE WHEN m.jenis_mutasi = 'KREDIT' THEN m.nominal ELSE 0 END), 0) AS total_masuk,
  COALESCE(SUM(CASE WHEN m.jenis_mutasi = 'DEBIT' THEN m.nominal ELSE 0 END), 0) AS total_keluar
FROM nasabah n
JOIN rekening r ON n.cif_id = r.cif_id
LEFT JOIN mutasi_transaksi m ON r.nomor_rekening = m.nomor_rekening
GROUP BY n.cif_id, n.nama_nasabah, r.nomor_rekening, r.saldo;`,
            explanation: 'Kueri rekonsiliasi membuktikan akurasi pencatatan buku besar rekening terhadap log mutasi debit/kredit.',
            expectedResult: {
              columns: ['nama_nasabah', 'nomor_rekening', 'saldo_buku', 'total_masuk', 'total_keluar'],
              rows: [
                { nama_nasabah: 'Hendro Wijaya', nomor_rekening: 'REK-8801', saldo_buku: 250000000.0, total_masuk: 10000000.0, total_keluar: 2500000.0 },
                { nama_nasabah: 'Dewi Lestari', nomor_rekening: 'REK-8802', saldo_buku: 14500000.0, total_masuk: 5000000.0, total_keluar: 0.0 },
              ],
            },
          },
        ],
        dataQualityNotes: [
          'Rekor REK-9999 sengaja dimasukkan sebagai simulasi kegagalan referensial yang harus dibersihkan sebelum migrasi schema.',
          'Format nominal menggunakan DECIMAL(15,2) standar perbankan untuk menghindari floating-point rounding error.',
        ],
        createdAt: new Date().toISOString(),
      },
    },
  },
  {
    id: 'preset-ecommerce-da',
    badge: 'Populer untuk Data Analyst',
    title: 'Analisis Tren Penjualan, Window Function & Retensi Pelanggan E-Commerce',
    role: 'Data Analyst',
    industry: 'E-commerce',
    level: 'middle',
    taskCount: 3,
    description: 'Menghitung KPI omzet, ranking produk terlaris dengan DENSE_RANK(), dan akumulasi pendapatan berjalan (running total).',
    data: {
      provider: 'Template Pilihan E-Commerce TokoNusantara',
      validation: {
        structural: { valid: true, errors: [] },
        execution: 'verified',
        executionNotes: 'Terverifikasi pada engine MySQL 8.0',
      },
      caseStudy: {
        id: 'cs-ecom-da-01',
        title: 'Analisis Tren Penjualan, Window Function & Retensi Pelanggan E-Commerce',
        role: 'Data Analyst',
        level: 'middle',
        industry: 'E-commerce',
        responsibilities: 'Mengekstrak wawasan tren transaksi, menghitung nilai belanja rata-rata (AOV), dan memetakan performa kota pengiriman.',
        mysqlVersion: '8.0',
        scenario: `Manajemen e-commerce TokoNusantara ingin mengevaluasi dinamika penjualan selama kuartal ketiga tahun 2026. Pertumbuhan total omzet mulai melambat di beberapa kota besar, dan tim bisnis membutuhkan visibilitas mendalam tentang tren pendapatan harian, kontribusi per segmen kota pengiriman, serta pemeringkatan performa transaksi.\n\nSebagai Data Analyst, Anda diminta menyajikan ringkasan metrik analitik kuantitatif untuk mendukung alokasi anggaran promosi Q4.`,
        learningGoals: [
          'Menghitung ringkasan KPI bisnis dengan agregasi multivariat.',
          'Menerapkan Window Function DENSE_RANK() untuk evaluasi kota pengiriman.',
          'Membangun analisis tren waktu dengan total kumulatif berjalan (Running Total).',
        ],
        tables: [
          {
            tableName: 'pesanan',
            description: 'Tabel transaksi belanja pengguna',
            columns: [
              { name: 'id_pesanan', type: 'VARCHAR(20)', isPrimary: true, nullable: false, description: 'Kode unik order' },
              { name: 'tanggal_pesanan', type: 'DATE', nullable: false, description: 'Tanggal checkout' },
              { name: 'kota', type: 'VARCHAR(50)', nullable: false, description: 'Kota tujuan kirim' },
              { name: 'total_rupiah', type: 'DECIMAL(12,2)', nullable: false, description: 'Nilai belanja' },
              { name: 'status', type: 'VARCHAR(20)', nullable: false, description: 'Status order' },
            ],
            sampleRows: [
              { id_pesanan: 'ORD-24081', tanggal_pesanan: '2026-08-03', kota: 'Bandung', total_rupiah: 485000.00, status: 'selesai' },
              { id_pesanan: 'ORD-24082', tanggal_pesanan: '2026-08-03', kota: 'Surabaya', total_rupiah: 129000.00, status: 'selesai' },
              { id_pesanan: 'ORD-24083', tanggal_pesanan: '2026-08-04', kota: 'Bandung', total_rupiah: 760000.00, status: 'selesai' },
              { id_pesanan: 'ORD-24084', tanggal_pesanan: '2026-08-05', kota: 'Jakarta', total_rupiah: 1250000.00, status: 'selesai' },
              { id_pesanan: 'ORD-24085', tanggal_pesanan: '2026-08-05', kota: 'Surabaya', total_rupiah: 340000.00, status: 'selesai' },
            ],
          },
        ],
        setupSql: `CREATE TABLE IF NOT EXISTS pesanan (
  id_pesanan VARCHAR(20) PRIMARY KEY,
  tanggal_pesanan DATE NOT NULL,
  kota VARCHAR(50) NOT NULL,
  total_rupiah DECIMAL(12,2) NOT NULL,
  status VARCHAR(20) NOT NULL
);

INSERT INTO pesanan (id_pesanan, tanggal_pesanan, kota, total_rupiah, status) VALUES
('ORD-24081', '2026-08-03', 'Bandung', 485000.00, 'selesai'),
('ORD-24082', '2026-08-03', 'Surabaya', 129000.00, 'selesai'),
('ORD-24083', '2026-08-04', 'Bandung', 760000.00, 'selesai'),
('ORD-24084', '2026-08-05', 'Jakarta', 1250000.00, 'selesai'),
('ORD-24085', '2026-08-05', 'Surabaya', 340000.00, 'selesai');`,
        tasks: [
          {
            taskNumber: 1,
            instruction: 'Hitung total omzet pendapatan dan total jumlah transaksi pesanan per kota untuk transaksi yang berstatus selesai.',
            hint: 'Gunakan SUM(total_rupiah), COUNT(*), WHERE status = "selesai", dan GROUP BY kota.',
            difficultyCategory: 'Agregasi KPI',
            answerSql: `SELECT 
  kota, 
  COUNT(*) AS jumlah_pesanan, 
  SUM(total_rupiah) AS total_omzet
FROM pesanan
WHERE status = 'selesai'
GROUP BY kota
ORDER BY total_omzet DESC;`,
            explanation: 'Pengelompokan kota membantu tim penjualan melihat persebaran omzet terbesar.',
            expectedResult: {
              columns: ['kota', 'jumlah_pesanan', 'total_omzet'],
              rows: [
                { kota: 'Jakarta', jumlah_pesanan: 1, total_omzet: 1250000.0 },
                { kota: 'Bandung', jumlah_pesanan: 2, total_omzet: 1245000.0 },
                { kota: 'Surabaya', jumlah_pesanan: 2, total_omzet: 469000.0 },
              ],
            },
          },
          {
            taskNumber: 2,
            instruction: 'Urutkan kota berdasarkan rata-rata nilai transaksi (AOV) tertinggi beserta ranking-nya menggunakan window function DENSE_RANK().',
            hint: 'Kombinasikan AVG(total_rupiah) dengan DENSE_RANK() OVER (ORDER BY AVG(total_rupiah) DESC).',
            difficultyCategory: 'Ranking & Window Function',
            answerSql: `SELECT 
  kota,
  ROUND(AVG(total_rupiah), 2) AS rata_rata_transaksi,
  DENSE_RANK() OVER (ORDER BY AVG(total_rupiah) DESC) AS ranking_aov
FROM pesanan
WHERE status = 'selesai'
GROUP BY kota;`,
            explanation: 'DENSE_RANK() memberikan nomor peringkat tanpa lompatan ranking.',
            expectedResult: {
              columns: ['kota', 'rata_rata_transaksi', 'ranking_aov'],
              rows: [
                { kota: 'Jakarta', rata_rata_transaksi: 1250000.0, ranking_aov: 1 },
                { kota: 'Bandung', rata_rata_transaksi: 622500.0, ranking_aov: 2 },
                { kota: 'Surabaya', rata_rata_transaksi: 234500.0, ranking_aov: 3 },
              ],
            },
          },
          {
            taskNumber: 3,
            instruction: 'Tampilkan tren pendapatan harian beserta total kumulatif berjalan (running total) dari awal hingga akhir periode.',
            hint: 'Gunakan CTE omzet_harian dan SUM(omzet) OVER (ORDER BY tanggal_pesanan).',
            difficultyCategory: 'Running Total & Window Function',
            answerSql: `WITH omzet_harian AS (
  SELECT 
    tanggal_pesanan,
    SUM(total_rupiah) AS omzet
  FROM pesanan
  WHERE status = 'selesai'
  GROUP BY tanggal_pesanan
)
SELECT 
  tanggal_pesanan,
  omzet AS omzet_hari_ini,
  SUM(omzet) OVER (ORDER BY tanggal_pesanan ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS total_berjalan
FROM omzet_harian
ORDER BY tanggal_pesanan;`,
            explanation: 'Running total memperlihatkan akumulasi pertumbuhan pendapatan bisnis secara kronologis.',
            expectedResult: {
              columns: ['tanggal_pesanan', 'omzet_hari_ini', 'total_berjalan'],
              rows: [
                { tanggal_pesanan: '2026-08-03', omzet_hari_ini: 614000.0, total_berjalan: 614000.0 },
                { tanggal_pesanan: '2026-08-04', omzet_hari_ini: 760000.0, total_berjalan: 1374000.0 },
                { tanggal_pesanan: '2026-08-05', omzet_hari_ini: 1590000.0, total_berjalan: 2964000.0 },
              ],
            },
          },
        ],
        dataQualityNotes: [
          'Pesanan dibatasi hanya untuk yang berhasil diselesaikan untuk mencerminkan arus kas riil.',
        ],
        createdAt: new Date().toISOString(),
      },
    },
  },
  {
    id: 'preset-logistics-de',
    badge: 'Populer untuk Data Engineer',
    title: 'Pipeline Ingestion Staging, Deduplikasi & Upsert Manifest Logistik',
    role: 'Data Engineer',
    industry: 'Logistik & Pengiriman',
    level: 'middle',
    taskCount: 3,
    description: 'Menyerap data mentah manifest kurir ke tabel staging, standarisasi status, idempotensi dengan ON DUPLICATE KEY UPDATE, dan rekonsiliasi.',
    data: {
      provider: 'Template Pilihan Logistik Kilat Ekspres',
      validation: {
        structural: { valid: true, errors: [] },
        execution: 'verified',
        executionNotes: 'Terverifikasi pada engine MySQL 8.0',
      },
      caseStudy: {
        id: 'cs-logistik-de-01',
        title: 'Pipeline Ingestion Staging, Deduplikasi & Upsert Manifest Logistik',
        role: 'Data Engineer',
        level: 'middle',
        industry: 'Logistik & Pengiriman',
        responsibilities: 'Membangun pipeline ELT, standarisasi format status resi, idempotency upsert, dan audit rekonsiliasi data.',
        mysqlVersion: '8.0',
        scenario: `Perusahaan logistik kargo menerima feed status resi setiap 15 menit dari ribuan armada kurir lapangan. Data yang masuk sering kali mengandung duplikasi nomor resi dan variasi tulisan status yang tidak seragam (misal: "DELIVERED", "sampai", "terkirim").\n\nSebagai Data Engineer, tugas Anda adalah membangun tabel staging penampungan, melakukan standarisasi status, serta menerapkan operasi upsert agar status paket di tabel target selalu terupdate ke kondisi mutakhir tanpa memicu duplikasi data.`,
        learningGoals: [
          'Memisahkan arsitektur tabel raw staging dan data mart target.',
          'Menerapkan CASE WHEN untuk normalisasi status logistik.',
          'Menerapkan sintaks INSERT INTO ... ON DUPLICATE KEY UPDATE.',
          'Melakukan rekonsiliasi keutuhan data antara sumber dan target.',
        ],
        tables: [
          {
            tableName: 'stg_manifest',
            description: 'Penampungan data batch resi mentah kurir',
            columns: [
              { name: 'batch_id', type: 'INT', isPrimary: true, nullable: false, description: 'ID batch' },
              { name: 'nomor_resi', type: 'VARCHAR(40)', nullable: false, description: 'Kode nomor resi pengiriman' },
              { name: 'berat_kg_str', type: 'VARCHAR(20)', nullable: false, description: 'Bobot dalam format string' },
              { name: 'status_lapangan', type: 'VARCHAR(40)', nullable: false, description: 'Status dari aplikasi mobile kurir' },
              { name: 'timestamp_scan', type: 'DATETIME', nullable: false, description: 'Waktu pemindaian barcode' },
            ],
            sampleRows: [
              { batch_id: 1, nomor_resi: 'RESI-8001', berat_kg_str: '2.5', status_lapangan: 'picked_up', timestamp_scan: '2026-09-01 08:00:00' },
              { batch_id: 2, nomor_resi: 'RESI-8002', berat_kg_str: '1.2', status_lapangan: 'terkirim', timestamp_scan: '2026-09-01 09:30:00' },
              { batch_id: 3, nomor_resi: 'RESI-8001', berat_kg_str: '2.5', status_lapangan: 'DELIVERED', timestamp_scan: '2026-09-01 14:00:00' },
            ],
          },
          {
            tableName: 'mart_pengiriman_aktif',
            description: 'Tabel target data mart konsolidasi status paket teranyar',
            columns: [
              { name: 'nomor_resi', type: 'VARCHAR(40)', isPrimary: true, nullable: false, description: 'Nomor resi unik' },
              { name: 'berat_kg', type: 'DECIMAL(6,2)', nullable: false, description: 'Berat numerik' },
              { name: 'status_resmi', type: 'VARCHAR(20)', nullable: false, description: 'Status standar: DIPROSES / TERKIRIM' },
              { name: 'waktu_update_terakhir', type: 'DATETIME', nullable: false, description: 'Waktu status terbaru' },
            ],
            sampleRows: [
              { nomor_resi: 'RESI-8001', berat_kg: 2.50, status_resmi: 'TERKIRIM', waktu_update_terakhir: '2026-09-01 14:00:00' },
            ],
          },
        ],
        setupSql: `CREATE TABLE IF NOT EXISTS stg_manifest (
  batch_id INT PRIMARY KEY,
  nomor_resi VARCHAR(40) NOT NULL,
  berat_kg_str VARCHAR(20) NOT NULL,
  status_lapangan VARCHAR(40) NOT NULL,
  timestamp_scan DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS mart_pengiriman_aktif (
  nomor_resi VARCHAR(40) PRIMARY KEY,
  berat_kg DECIMAL(6,2) NOT NULL,
  status_resmi VARCHAR(20) NOT NULL,
  waktu_update_terakhir DATETIME NOT NULL
);

INSERT INTO stg_manifest (batch_id, nomor_resi, berat_kg_str, status_lapangan, timestamp_scan) VALUES
(1, 'RESI-8001', '2.5', 'picked_up', '2026-09-01 08:00:00'),
(2, 'RESI-8002', '1.2', 'terkirim', '2026-09-01 09:30:00'),
(3, 'RESI-8001', '2.5', 'DELIVERED', '2026-09-01 14:00:00');`,
        tasks: [
          {
            taskNumber: 1,
            instruction: 'Tampilkan hasil standarisasi dari `stg_manifest` di mana status (DELIVERED, terkirim, sampai) menjadi "TERKIRIM", selain itu "DIPROSES", dan casting berat_kg_str menjadi DECIMAL(6,2).',
            hint: 'Gunakan CASE WHEN UPPER(status_lapangan) IN (...) THEN ... dan CAST(berat_kg_str AS DECIMAL(6,2)).',
            difficultyCategory: 'Transformasi Data',
            answerSql: `SELECT 
  nomor_resi,
  CAST(berat_kg_str AS DECIMAL(6,2)) AS berat_kg,
  CASE 
    WHEN UPPER(status_lapangan) IN ('DELIVERED', 'TERKIRIM', 'SAMPAI') THEN 'TERKIRIM'
    ELSE 'DIPROSES'
  END AS status_resmi,
  timestamp_scan
FROM stg_manifest;`,
            explanation: 'Standarisasi mengubah entri variatif dari lapangan menjadi kategori tunggal.',
            expectedResult: {
              columns: ['nomor_resi', 'berat_kg', 'status_resmi', 'timestamp_scan'],
              rows: [
                { nomor_resi: 'RESI-8001', berat_kg: 2.5, status_resmi: 'DIPROSES', timestamp_scan: '2026-09-01 08:00:00' },
                { nomor_resi: 'RESI-8002', berat_kg: 1.2, status_resmi: 'TERKIRIM', timestamp_scan: '2026-09-01 09:30:00' },
                { nomor_resi: 'RESI-8001', berat_kg: 2.5, status_resmi: 'TERKIRIM', timestamp_scan: '2026-09-01 14:00:00' },
              ],
            },
          },
          {
            taskNumber: 2,
            instruction: 'Lakukan upsert dari `stg_manifest` ke `mart_pengiriman_aktif` sehingga resi yang sudah ada diperbarui status dan waktu scannya.',
            hint: 'Gunakan INSERT INTO ... ON DUPLICATE KEY UPDATE status_resmi = VALUES(status_resmi), waktu_update_terakhir = VALUES(waktu_update_terakhir).',
            difficultyCategory: 'Upsert & Ingestion',
            answerSql: `INSERT INTO mart_pengiriman_aktif (nomor_resi, berat_kg, status_resmi, waktu_update_terakhir)
SELECT 
  nomor_resi,
  CAST(berat_kg_str AS DECIMAL(6,2)),
  CASE WHEN UPPER(status_lapangan) IN ('DELIVERED', 'TERKIRIM', 'SAMPAI') THEN 'TERKIRIM' ELSE 'DIPROSES' END,
  timestamp_scan
FROM stg_manifest
ON DUPLICATE KEY UPDATE 
  status_resmi = VALUES(status_resmi),
  waktu_update_terakhir = VALUES(waktu_update_terakhir);`,
            verificationSql: 'SELECT nomor_resi, berat_kg, status_resmi FROM mart_pengiriman_aktif ORDER BY nomor_resi;',
            explanation: 'ON DUPLICATE KEY UPDATE menjamin sifat idempoten pada data pipeline yang memproses update berkala.',
            expectedResult: {
              columns: ['nomor_resi', 'berat_kg', 'status_resmi'],
              rows: [
                { nomor_resi: 'RESI-8001', berat_kg: 2.5, status_resmi: 'TERKIRIM' },
                { nomor_resi: 'RESI-8002', berat_kg: 1.2, status_resmi: 'TERKIRIM' },
              ],
            },
          },
          {
            taskNumber: 3,
            instruction: 'Lakukan rekonsiliasi data: tampilkan total resi unik dan total tonase berat paket pada mart pengiriman aktif.',
            hint: 'Gunakan COUNT(nomor_resi) dan SUM(berat_kg) dari mart_pengiriman_aktif.',
            difficultyCategory: 'Audit Data Pipeline',
            answerSql: `SELECT 
  COUNT(nomor_resi) AS total_paket_terdata,
  SUM(berat_kg) AS total_bobot_kg
FROM mart_pengiriman_aktif;`,
            explanation: 'Rekonsiliasi membuktikan integrasi downstream bebas dari duplikasi data.',
            expectedResult: {
              columns: ['total_paket_terdata', 'total_bobot_kg'],
              rows: [{ total_paket_terdata: 2, total_bobot_kg: 3.7 }],
            },
          },
        ],
        dataQualityNotes: [
          'Paket RESI-8001 memiliki dua rekaman scan bertingkat yang menguji mekanisme update status mutakhir.',
        ],
        createdAt: new Date().toISOString(),
      },
    },
  },
];
