import { CaseStudy, GenerationRequest } from '@/types/case-study';

export function generateRealisticMockCase(req: GenerationRequest): CaseStudy {
  const isDba = req.role === 'Database Administrator';
  const isDe = req.role === 'Data Engineer';
  const isDa = req.role === 'Data Analyst';

  const industry = req.industry || 'E-commerce';
  const timestamp = Date.now();

  if (isDba) {
    return {
      id: `case-dba-${timestamp}`,
      title: `Optimasi & Desain Skema Basis Data Transaksional ${industry}`,
      role: 'Database Administrator',
      level: req.level,
      industry: industry,
      responsibilities:
        req.responsibilities ||
        'Memastikan stabilitas struktur tabel, integritas relasi antar entitas, penalaan indeks, dan keamanan transaksi data.',
      mysqlVersion: req.mysqlVersion,
      seed: req.seed || null,
      scenario: `Perusahaan ${industry} nasional sedang mengalami lonjakan volume transaksi harian yang pesat. Beberapa keluhan dari tim aplikasi mencakup query laporan yang lambat, adanya risiko integritas data akibat belum optimalnya penegakan foreign key, serta potensi anomali penguncian saat proses update status pesanan secara konkuren.\n\nSebagai Database Administrator utama, Anda ditugaskan untuk melakukan audit skema, menerapkan indeks komposit strategis, serta menyiapkan prosedur query pemeriksaan integritas data yang efisien dan aman dieksekusi di MySQL.`,
      learningGoals: [
        'Mendesain constraint integritas (FOREIGN KEY & CHECK) pada MySQL.',
        'Menganalisis performa query dan menambahkan indeks komposit optimal.',
        'Mendeteksi dan membersihkan rekaman yatim (orphan rows) secara konsisten.',
        'Menerapkan perubahan data sensitif dalam blok transaksi aman.',
      ],
      tables: [
        {
          tableName: 'pelanggan',
          description: 'Data profil pelanggan aktif sistem.',
          columns: [
            { name: 'id_pelanggan', type: 'INT', isPrimary: true, nullable: false, description: 'ID unik pelanggan' },
            { name: 'nama_lengkap', type: 'VARCHAR(100)', nullable: false, description: 'Nama lengkap pelanggan' },
            { name: 'email', type: 'VARCHAR(100)', nullable: false, description: 'Alamat email valid' },
            { name: 'status_verifikasi', type: 'VARCHAR(20)', nullable: false, description: 'Status akun: aktif/pending' },
            { name: 'dibuat_pada', type: 'DATETIME', nullable: false, description: 'Waktu registrasi' },
          ],
          sampleRows: [
            { id_pelanggan: 1, nama_lengkap: 'Budi Santoso', email: 'budi@example.id', status_verifikasi: 'aktif', dibuat_pada: '2026-01-10 09:00:00' },
            { id_pelanggan: 2, nama_lengkap: 'Siti Rahma', email: 'siti@example.id', status_verifikasi: 'aktif', dibuat_pada: '2026-01-12 11:30:00' },
            { id_pelanggan: 3, nama_lengkap: 'Andi Pratama', email: 'andi@example.id', status_verifikasi: 'pending', dibuat_pada: '2026-02-01 14:15:00' },
          ],
        },
        {
          tableName: 'pesanan',
          description: 'Header transaksi pemesanan barang.',
          columns: [
            { name: 'id_pesanan', type: 'INT', isPrimary: true, nullable: false, description: 'ID pesanan unik' },
            { name: 'id_pelanggan', type: 'INT', isForeign: true, foreignReference: 'pelanggan(id_pelanggan)', nullable: false, description: 'ID pelanggan pemilik pesanan' },
            { name: 'tanggal_pesanan', type: 'DATE', nullable: false, description: 'Tanggal transaksi' },
            { name: 'total_rupiah', type: 'DECIMAL(12,2)', nullable: false, description: 'Nominal total transaksi' },
            { name: 'status_pesanan', type: 'VARCHAR(20)', nullable: false, description: 'Status: selesai, diproses, batal' },
          ],
          sampleRows: [
            { id_pesanan: 101, id_pelanggan: 1, tanggal_pesanan: '2026-08-01', total_rupiah: 350000.0, status_pesanan: 'selesai' },
            { id_pesanan: 102, id_pelanggan: 2, tanggal_pesanan: '2026-08-02', total_rupiah: 1250000.0, status_pesanan: 'selesai' },
            { id_pesanan: 103, id_pelanggan: 1, tanggal_pesanan: '2026-08-05', total_rupiah: 750000.0, status_pesanan: 'diproses' },
          ],
        },
      ],
      setupSql: `CREATE TABLE IF NOT EXISTS pelanggan (
  id_pelanggan INT PRIMARY KEY,
  nama_lengkap VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  status_verifikasi VARCHAR(20) NOT NULL,
  dibuat_pada DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS pesanan (
  id_pesanan INT PRIMARY KEY,
  id_pelanggan INT NOT NULL,
  tanggal_pesanan DATE NOT NULL,
  total_rupiah DECIMAL(12,2) NOT NULL,
  status_pesanan VARCHAR(20) NOT NULL
);

INSERT INTO pelanggan (id_pelanggan, nama_lengkap, email, status_verifikasi, dibuat_pada) VALUES
(1, 'Budi Santoso', 'budi@example.id', 'aktif', '2026-01-10 09:00:00'),
(2, 'Siti Rahma', 'siti@example.id', 'aktif', '2026-01-12 11:30:00'),
(3, 'Andi Pratama', 'andi@example.id', 'pending', '2026-02-01 14:15:00');

INSERT INTO pesanan (id_pesanan, id_pelanggan, tanggal_pesanan, total_rupiah, status_pesanan) VALUES
(101, 1, '2026-08-01', 350000.00, 'selesai'),
(102, 2, '2026-08-02', 1250000.00, 'selesai'),
(103, 1, '2026-08-05', 750000.00, 'diproses');`,
      tasks: Array.from({ length: req.taskCount }).map((_, idx) => {
        const num = idx + 1;
        if (num === 1) {
          return {
            taskNumber: 1,
            instruction: 'Buat indeks komposit baru pada tabel `pesanan` untuk mengoptimalkan filter `status_pesanan` dan urutan `tanggal_pesanan`.',
            hint: 'Gunakan perintah CREATE INDEX nama_indeks ON tabel (kolom1, kolom2).',
            difficultyCategory: 'Indexing & Tuning',
            answerSql: 'CREATE INDEX idx_pesanan_status_tanggal ON pesanan (status_pesanan, tanggal_pesanan);',
            verificationSql: "SHOW INDEX FROM pesanan WHERE Key_name = 'idx_pesanan_status_tanggal';",
            explanation: 'Indeks komposit (status_pesanan, tanggal_pesanan) memungkinkan MySQL melakukan range scan cepat dan menghindari file sort saat query menyaring status tertentu dan mengurutkan berdasarkan tanggal.',
            expectedResult: {
              columns: ['Table', 'Non_unique', 'Key_name', 'Seq_in_index', 'Column_name'],
              rows: [
                { Table: 'pesanan', Non_unique: 1, Key_name: 'idx_pesanan_status_tanggal', Seq_in_index: 1, Column_name: 'status_pesanan' },
                { Table: 'pesanan', Non_unique: 1, Key_name: 'idx_pesanan_status_tanggal', Seq_in_index: 2, Column_name: 'tanggal_pesanan' },
              ],
            },
          };
        } else if (num === 2) {
          return {
            taskNumber: 2,
            instruction: 'Tampilkan pemeriksaan rekaman yatim (orphan rows) pada tabel pesanan yang id_pelanggan-nya tidak ditemukan pada tabel pelanggan.',
            hint: 'Gunakan LEFT JOIN antara pesanan dan pelanggan lalu filter baris yang bernilai NULL.',
            difficultyCategory: 'Integritas Relasional',
            answerSql: `SELECT p.id_pesanan, p.id_pelanggan, p.total_rupiah
FROM pesanan p
LEFT JOIN pelanggan c ON p.id_pelanggan = c.id_pelanggan
WHERE c.id_pelanggan IS NULL;`,
            explanation: 'LEFT JOIN dengan filter NULL pada tabel kanan merupakan pola standar DBA untuk menemukan anomali hilangnya referensi data sebelum foreign key diaktifkan.',
            expectedResult: {
              columns: ['id_pesanan', 'id_pelanggan', 'total_rupiah'],
              rows: [],
            },
          };
        } else {
          return {
            taskNumber: num,
            instruction: `Lakukan analisis ukuran dan agregasi volume transaksi pada status pesanan #${num}.`,
            hint: 'Gunakan fungsi COUNT() dan SUM() dengan klausa GROUP BY.',
            difficultyCategory: 'Monitoring DBA',
            answerSql: `SELECT status_pesanan, COUNT(*) AS jumlah_pesanan, SUM(total_rupiah) AS total_omzet
FROM pesanan
GROUP BY status_pesanan
ORDER BY jumlah_pesanan DESC;`,
            explanation: 'Menghitung distribusi status membantu DBA mengevaluasi pertumbuhan tabel dan volume partisi status.',
            expectedResult: {
              columns: ['status_pesanan', 'jumlah_pesanan', 'total_omzet'],
              rows: [
                { status_pesanan: 'selesai', jumlah_pesanan: 2, total_omzet: 1600000.0 },
                { status_pesanan: 'diproses', jumlah_pesanan: 1, total_omzet: 750000.0 },
              ],
            },
          };
        }
      }),
      dataQualityNotes: [
        'Indeks komposit dirancang untuk mencegah full table scan saat data pesanan membengkak di atas 1 juta baris.',
        'Foreign key disarankan ditambahkan setelah verifikasi orphan rows menghasilkan 0 baris.',
      ],
      portfolio:
        req.level === 'portfolio'
          ? {
              rubric: [
                { criterion: 'Desain Skema & Index', weight: '30%', description: 'Ketepatan tipe data, constraint, dan efisiensi indeks' },
                { criterion: 'Integritas Data', weight: '30%', description: 'Pencegahan orphan records dan penerapan transaksi aman' },
                { criterion: 'Dokumentasi & Rationale', weight: '40%', description: 'Kualitas penjelasan dampak performa query di production' },
              ],
              clientBrief: 'Klien meminta evaluasi komprehensif performa database transaksi sebelum kampanye belanja akhir tahun.',
              deliverables: [
                'Script SQL migrasi indeks dan constraint',
                'Laporan hasil pengujian EXPLAIN query',
                'SOP penanganan orphan records berkala',
              ],
              readmeTemplate: `# Portofolio DBA: Penalaan Basis Data Transaksional ${industry}\n\n## Latar Belakang Masalah\n...`,
            }
          : null,
      createdAt: new Date().toISOString(),
    };
  }

  if (isDe) {
    return {
      id: `case-de-${timestamp}`,
      title: `Pipa Data Ingestion, Deduplikasi & Upsert ${industry}`,
      role: 'Data Engineer',
      level: req.level,
      industry: industry,
      responsibilities:
        req.responsibilities ||
        'Membangun tabel staging, transformasi pembersihan data, penanganan duplikasi, dan rekonsiliasi data antara sumber dan target.',
      mysqlVersion: req.mysqlVersion,
      seed: req.seed || null,
      scenario: `Di departemen data engineering ${industry}, setiap malam sistem menerima batch data transaksi dari berbagai gateway pembayaran dalam format raw yang seringkali memiliki duplikasi ID dan inkonsistensi penulisan status.\n\nAnda ditugaskan menyiapkan alur ELT di MySQL: menyerap data mentah ke tabel staging, melakukan deduplikasi dan standarisasi, lalu melakukan upsert (INSERT ... ON DUPLICATE KEY UPDATE) ke dalam tabel target master mart data.`,
      learningGoals: [
        'Merancang pemisahan tabel staging dan tabel target produksi.',
        'Melakukan transformasi data kotor dan standarisasi nilai kolom.',
        'Mengimplementasikan pola upsert MySQL (INSERT ... ON DUPLICATE KEY UPDATE).',
        'Melakukan query rekonsiliasi untuk membuktikan integritas total nilai dan jumlah baris.',
      ],
      tables: [
        {
          tableName: 'stg_transaksi',
          description: 'Tabel penampungan data mentah (staging) dari file batch API.',
          columns: [
            { name: 'raw_id', type: 'INT', isPrimary: true, nullable: false, description: 'ID baris batch staging' },
            { name: 'kode_transaksi', type: 'VARCHAR(50)', nullable: false, description: 'Kode unik transaksi bisnis' },
            { name: 'nominal_str', type: 'VARCHAR(50)', nullable: false, description: 'Nilai nominal dalam string mentah' },
            { name: 'status_mentah', type: 'VARCHAR(50)', nullable: false, description: 'Format status belum seragam' },
            { name: 'waktu_update', type: 'DATETIME', nullable: false, description: 'Timestamp batch' },
          ],
          sampleRows: [
            { raw_id: 1, kode_transaksi: 'TRX-001', nominal_str: '250000', status_mentah: 'PAID', waktu_update: '2026-09-01 10:00:00' },
            { raw_id: 2, kode_transaksi: 'TRX-002', nominal_str: '450000', status_mentah: 'success', waktu_update: '2026-09-01 10:05:00' },
            { raw_id: 3, kode_transaksi: 'TRX-001', nominal_str: '250000', status_mentah: 'settled', waktu_update: '2026-09-01 11:00:00' },
          ],
        },
        {
          tableName: 'dim_transaksi_bersih',
          description: 'Tabel target bersih hasil transformasi yang siap dipakai tim analitik.',
          columns: [
            { name: 'kode_transaksi', type: 'VARCHAR(50)', isPrimary: true, nullable: false, description: 'Kode unik transaksi' },
            { name: 'nominal', type: 'DECIMAL(12,2)', nullable: false, description: 'Nominal numerik valid' },
            { name: 'status_standar', type: 'VARCHAR(20)', nullable: false, description: 'Status standar: SUKSES / GAGAL' },
            { name: 'terakhir_diperbarui', type: 'DATETIME', nullable: false, description: 'Waktu proses pembaruan' },
          ],
          sampleRows: [
            { kode_transaksi: 'TRX-001', nominal: 250000.0, status_standar: 'SUKSES', terakhir_diperbarui: '2026-09-01 11:00:00' },
          ],
        },
      ],
      setupSql: `CREATE TABLE IF NOT EXISTS stg_transaksi (
  raw_id INT PRIMARY KEY,
  kode_transaksi VARCHAR(50) NOT NULL,
  nominal_str VARCHAR(50) NOT NULL,
  status_mentah VARCHAR(50) NOT NULL,
  waktu_update DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS dim_transaksi_bersih (
  kode_transaksi VARCHAR(50) PRIMARY KEY,
  nominal DECIMAL(12,2) NOT NULL,
  status_standar VARCHAR(20) NOT NULL,
  terakhir_diperbarui DATETIME NOT NULL
);

INSERT INTO stg_transaksi (raw_id, kode_transaksi, nominal_str, status_mentah, waktu_update) VALUES
(1, 'TRX-001', '250000', 'PAID', '2026-09-01 10:00:00'),
(2, 'TRX-002', '450000', 'success', '2026-09-01 10:05:00'),
(3, 'TRX-001', '250000', 'settled', '2026-09-01 11:00:00');`,
      tasks: Array.from({ length: req.taskCount }).map((_, idx) => {
        const num = idx + 1;
        if (num === 1) {
          return {
            taskNumber: 1,
            instruction: 'Tampilkan hasil standarisasi status dari `stg_transaksi` di mana status (PAID, success, settled) dipetakan menjadi "SUKSES", selain itu "GAGAL", serta konversikan nominal_str menjadi tipe numerik DECIMAL.',
            hint: 'Gunakan ekspresi CASE WHEN UPPER(status_mentah) IN (...) THEN ... dan CAST(nominal_str AS DECIMAL(12,2)).',
            difficultyCategory: 'Pembersihan Data',
            answerSql: `SELECT 
  kode_transaksi,
  CAST(nominal_str AS DECIMAL(12,2)) AS nominal,
  CASE 
    WHEN UPPER(status_mentah) IN ('PAID', 'SUCCESS', 'SETTLED') THEN 'SUKSES'
    ELSE 'GAGAL'
  END AS status_standar,
  waktu_update
FROM stg_transaksi;`,
            explanation: 'Klausa CASE WHEN menstandarisasi ragam penulisan status dari upstream source ke representasi tunggal yang konsisten.',
            expectedResult: {
              columns: ['kode_transaksi', 'nominal', 'status_standar', 'waktu_update'],
              rows: [
                { kode_transaksi: 'TRX-001', nominal: 250000.0, status_standar: 'SUKSES', waktu_update: '2026-09-01 10:00:00' },
                { kode_transaksi: 'TRX-002', nominal: 450000.0, status_standar: 'SUKSES', waktu_update: '2026-09-01 10:05:00' },
                { kode_transaksi: 'TRX-001', nominal: 250000.0, status_standar: 'SUKSES', waktu_update: '2026-09-01 11:00:00' },
              ],
            },
          };
        } else if (num === 2) {
          return {
            taskNumber: 2,
            instruction: 'Lakukan upsert dari `stg_transaksi` ke `dim_transaksi_bersih` dengan memperbarui status dan waktu bila kode_transaksi sudah ada.',
            hint: 'Gunakan perintah INSERT INTO ... SELECT ... ON DUPLICATE KEY UPDATE status_standar = VALUES(status_standar), terakhir_diperbarui = VALUES(terakhir_diperbarui).',
            difficultyCategory: 'Upsert & Ingestion',
            answerSql: `INSERT INTO dim_transaksi_bersih (kode_transaksi, nominal, status_standar, terakhir_diperbarui)
SELECT 
  kode_transaksi,
  CAST(nominal_str AS DECIMAL(12,2)),
  CASE WHEN UPPER(status_mentah) IN ('PAID', 'SUCCESS', 'SETTLED') THEN 'SUKSES' ELSE 'GAGAL' END,
  waktu_update
FROM stg_transaksi
ON DUPLICATE KEY UPDATE 
  status_standar = VALUES(status_standar),
  terakhir_diperbarui = VALUES(terakhir_diperbarui);`,
            verificationSql: 'SELECT kode_transaksi, nominal, status_standar FROM dim_transaksi_bersih ORDER BY kode_transaksi;',
            explanation: 'ON DUPLICATE KEY UPDATE adalah metode efisien MySQL untuk menangani idempotency pada pipeline pengisian data berulang tanpa menimbulkan duplicate key exception.',
            expectedResult: {
              columns: ['kode_transaksi', 'nominal', 'status_standar'],
              rows: [
                { kode_transaksi: 'TRX-001', nominal: 250000.0, status_standar: 'SUKSES' },
                { kode_transaksi: 'TRX-002', nominal: 450000.0, status_standar: 'SUKSES' },
              ],
            },
          };
        } else {
          return {
            taskNumber: num,
            instruction: `Lakukan rekonsiliasi data antara staging dan target untuk memastikan total nominal transaksi unik tidak mengalami deviasi data.`,
            hint: 'Bandingkan SUM(DISTINCT ...) atau agregasi dari dim_transaksi_bersih.',
            difficultyCategory: 'Rekonsiliasi Pipeline',
            answerSql: `SELECT 
  COUNT(DISTINCT kode_transaksi) AS jumlah_transaksi_unik,
  SUM(nominal) AS total_nominal_target
FROM dim_transaksi_bersih;`,
            explanation: 'Rekonsiliasi memastikan data mart target memuat seluruh volume yang diserap dari staging tanpa adanya record yang hilang atau bernilai keliru.',
            expectedResult: {
              columns: ['jumlah_transaksi_unik', 'total_nominal_target'],
              rows: [{ jumlah_transaksi_unik: 2, total_nominal_target: 700000.0 }],
            },
          };
        }
      }),
      dataQualityNotes: [
        'Ditemukan rekaman duplikat pada kode TRX-001 dalam batch staging yang sengaja disimulasikan untuk menguji logika upsert.',
      ],
      portfolio:
        req.level === 'portfolio'
          ? {
              rubric: [
                { criterion: 'Desain Arsitektur Staging & Target', weight: '30%', description: 'Ketepatan isolasi data mentah dan mart bersih' },
                { criterion: 'Logika Idempotency & Upsert', weight: '40%', description: 'Penanganan duplikasi dan update status tanpa error' },
                { criterion: 'Validasi Rekonsiliasi Data', weight: '30%', description: 'Audit kepastian integritas numerik akhir' },
              ],
              clientBrief: 'Implementasikan pipa ELT mandiri untuk menyerap data feed pembayaran multi-kanal secara teratur.',
              deliverables: [
                'DDL skema staging dan warehouse',
                'Script prosedur ELT dan upsert',
                'Laporan verifikasi rekonsiliasi nilai harian',
              ],
              readmeTemplate: `# Portofolio Data Engineering: MySQL Ingestion & Upsert Pipeline\\n\\n## Arsitektur Alur Data\\n...`,
            }
          : null,
      createdAt: new Date().toISOString(),
    };
  }

  // Default: Data Analyst
  return {
    id: `case-da-${timestamp}`,
    title: `Analisis Performa Penjualan & Segmentasi Pelanggan ${industry}`,
    role: 'Data Analyst',
    level: req.level,
    industry: industry,
    responsibilities:
      req.responsibilities ||
      'Menganalisis tren penjualan, retensi pelanggan, dan performa kategori untuk mendukung keputusan bisnis.',
    mysqlVersion: req.mysqlVersion,
    seed: req.seed || null,
    scenario: `Manajemen ${industry} ingin mengevaluasi dinamika penjualan selama kuartal ketiga tahun 2026. Pertumbuhan total omzet mulai melambat di beberapa kota besar, dan tim bisnis membutuhkan visibilitas mendalam tentang tren pendapatan harian, kontribusi per segmen pelanggan, serta produk yang paling sering berkontribusi pada pendapatan tertinggi.\n\nSebagai Data Analyst, Anda diminta mengekstrak metrik KPI esensial, menerapkan window function untuk melihat tren kumulatif berjalan, serta memeringkat performa kota guna menentukan strategi alokasi anggaran promosi berikutnya.`,
    learningGoals: [
      'Menghitung ringkasan KPI bisnis dengan agregasi multivariat.',
      'Menerapkan Window Function (SUM OVER, ROW_NUMBER / DENSE_RANK).',
      'Membangun analisis tren waktu dengan total kumulatif berjalan.',
      'Menarik kesimpulan rekomendasi bisnis berbasis temuan data kuantitatif.',
    ],
    tables: [
      {
        tableName: 'pesanan',
        description: 'Tabel ringkasan transaksi pesanan pelanggan.',
        columns: [
          { name: 'id_pesanan', type: 'VARCHAR(20)', isPrimary: true, nullable: false, description: 'Kode unik pesanan' },
          { name: 'tanggal_pesanan', type: 'DATE', nullable: false, description: 'Tanggal transaksi dicatat' },
          { name: 'kota', type: 'VARCHAR(50)', nullable: false, description: 'Kota pengiriman' },
          { name: 'total_rupiah', type: 'DECIMAL(12,2)', nullable: false, description: 'Nilai total pesanan' },
          { name: 'status', type: 'VARCHAR(20)', nullable: false, description: 'Status pemrosesan pesanan' },
        ],
        sampleRows: [
          { id_pesanan: 'ORD-24081', tanggal_pesanan: '2026-08-03', kota: 'Bandung', total_rupiah: 485000.0, status: 'selesai' },
          { id_pesanan: 'ORD-24082', tanggal_pesanan: '2026-08-03', kota: 'Surabaya', total_rupiah: 129000.0, status: 'selesai' },
          { id_pesanan: 'ORD-24083', tanggal_pesanan: '2026-08-04', kota: 'Bandung', total_rupiah: 760000.0, status: 'selesai' },
          { id_pesanan: 'ORD-24084', tanggal_pesanan: '2026-08-05', kota: 'Jakarta', total_rupiah: 1250000.0, status: 'selesai' },
          { id_pesanan: 'ORD-24085', tanggal_pesanan: '2026-08-05', kota: 'Surabaya', total_rupiah: 340000.0, status: 'selesai' },
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
    tasks: Array.from({ length: req.taskCount }).map((_, idx) => {
      const num = idx + 1;
      if (num === 1) {
        return {
          taskNumber: 1,
          instruction: 'Hitung total pendapatan (omzet) dan jumlah pesanan per kota untuk transaksi berstatus selesai.',
          hint: 'Gunakan fungsi SUM(total_rupiah) dan COUNT(*) digabung klausa GROUP BY kota.',
          difficultyCategory: 'Agregasi KPI',
          answerSql: `SELECT 
  kota, 
  COUNT(*) AS jumlah_pesanan, 
  SUM(total_rupiah) AS total_omzet
FROM pesanan
WHERE status = 'selesai'
GROUP BY kota
ORDER BY total_omzet DESC;`,
          explanation: 'Query ini mengelompokkan data per kota untuk melihat persebaran kontribusi omzet terbesar terhadap bisnis.',
          expectedResult: {
            columns: ['kota', 'jumlah_pesanan', 'total_omzet'],
            rows: [
              { kota: 'Jakarta', jumlah_pesanan: 1, total_omzet: 1250000.0 },
              { kota: 'Bandung', jumlah_pesanan: 2, total_omzet: 1245000.0 },
              { kota: 'Surabaya', jumlah_pesanan: 2, total_omzet: 469000.0 },
            ],
          },
        };
      } else if (num === 2) {
        return {
          taskNumber: 2,
          instruction: 'Urutkan kota berdasarkan rata-rata nilai transaksi (AOV) tertinggi beserta ranking-nya menggunakan window function DENSE_RANK().',
          hint: 'Gunakan AVG(total_rupiah) dan DENSE_RANK() OVER (ORDER BY AVG(total_rupiah) DESC).',
          difficultyCategory: 'Ranking & Window Function',
          answerSql: `SELECT 
  kota,
  ROUND(AVG(total_rupiah), 2) AS rata_rata_transaksi,
  DENSE_RANK() OVER (ORDER BY AVG(total_rupiah) DESC) AS ranking_aov
FROM pesanan
WHERE status = 'selesai'
GROUP BY kota;`,
          explanation: 'DENSE_RANK() memberikan nomor peringkat tanpa melewati urutan jika terdapat rata-rata transaksi yang setara.',
          expectedResult: {
            columns: ['kota', 'rata_rata_transaksi', 'ranking_aov'],
            rows: [
              { kota: 'Jakarta', rata_rata_transaksi: 1250000.0, ranking_aov: 1 },
              { kota: 'Bandung', rata_rata_transaksi: 622500.0, ranking_aov: 2 },
              { kota: 'Surabaya', rata_rata_transaksi: 234500.0, ranking_aov: 3 },
            ],
          },
        };
      } else if (num === 3) {
        return {
          taskNumber: 3,
          instruction: 'Tampilkan tren pendapatan harian lengkap dengan total kumulatif berjalan (running total) dari awal hingga akhir periode transaksi.',
          hint: 'Gunakan SUM(omzet_harian) OVER (ORDER BY tanggal_pesanan) di atas CTE atau subquery harian.',
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
          explanation: 'Window function dengan klausa ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW mengakumulasi total secara kronologis untuk memperlihatkan laju pertumbuhan omzet harian.',
          expectedResult: {
            columns: ['tanggal_pesanan', 'omzet_hari_ini', 'total_berjalan'],
            rows: [
              { tanggal_pesanan: '2026-08-03', omzet_hari_ini: 614000.0, total_berjalan: 614000.0 },
              { tanggal_pesanan: '2026-08-04', omzet_hari_ini: 760000.0, total_berjalan: 1374000.0 },
              { tanggal_pesanan: '2026-08-05', omzet_hari_ini: 1590000.0, total_berjalan: 2964000.0 },
            ],
          },
        };
      } else {
        return {
          taskNumber: num,
          instruction: `Analisis transaksi dengan nilai di atas rata-rata keseluruhan omzet untuk tugas #${num}.`,
          hint: 'Gunakan subquery WHERE total_rupiah > (SELECT AVG(total_rupiah) FROM pesanan).',
          difficultyCategory: 'Subquery Analisis',
          answerSql: `SELECT id_pesanan, kota, total_rupiah
FROM pesanan
WHERE total_rupiah > (SELECT AVG(total_rupiah) FROM pesanan)
ORDER BY total_rupiah DESC;`,
          explanation: 'Subquery skalar membandingkan setiap nilai baris dengan nilai rata-rata keseluruhan populasi data.',
          expectedResult: {
            columns: ['id_pesanan', 'kota', 'total_rupiah'],
            rows: [
              { id_pesanan: 'ORD-24084', kota: 'Jakarta', total_rupiah: 1250000.0 },
              { id_pesanan: 'ORD-24083', kota: 'Bandung', total_rupiah: 760000.0 },
            ],
          },
        };
      }
    }),
    dataQualityNotes: [
      'Data transaksi telah difilter untuk status selesai guna menghindari distorsi omzet dari pesanan batal.',
      'Nilai transaksi dalam mata uang Rupiah.',
    ],
    portfolio:
      req.level === 'portfolio'
        ? {
            rubric: [
              { criterion: 'Akurasi Metrik & KPI Bisnis', weight: '35%', description: 'Ketepatan formula agregasi dan filtering' },
              { criterion: 'Penguasaan Window Function', weight: '35%', description: 'Penggunaan running total, ranking, dan partitioning yang tepat' },
              { criterion: 'Penyajian Kesimpulan Bisnis', weight: '30%', description: 'Rekomendasi yang actionable bagi divisi pemasaran dan operasional' },
            ],
            clientBrief: 'Manajemen e-commerce meminta analisis tren penjualan regional untuk menentukan alokasi budget promosi Q4.',
            deliverables: [
              'File SQL analitik lengkap dan terstruktur',
              'Laporan ringkasan insight bisnis per kota',
              'Grafik/rekomendasi keputusan manajerial',
            ],
            readmeTemplate: `# Portofolio Data Analyst: Analisis Penjualan & Performa ${industry}\n\n## Ringkasan Eksekutif\n...`,
          }
        : null,
    createdAt: new Date().toISOString(),
  };
}
