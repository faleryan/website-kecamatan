/* ==========================================================================
   KONFIGURASI SITUS
   --------------------------------------------------------------------------
   ⚠️ SATU-SATUNYA BERKAS YANG PERLU ANDA EDIT SEBELUM DEPLOY.
   Isi GAS_URL dengan URL Web App Google Apps Script yang berakhiran /exec.
   ========================================================================== */

const APP_CONFIG = {

  /* 1. URL backend Google Apps Script (Deploy → New deployment → Web app).
        Contoh: 'https://script.google.com/macros/s/AKfycbx..../exec'
        Biarkan kosong ('') untuk menjalankan situs dalam MODE CONTOH. */
  GAS_URL: 'https://script.google.com/macros/s/AKfycbxwyMcgybKXxGm85mclyo7AVwBLk6EftwReuM56F5xByYaCq7uVd-E-QHj2cu4R_s16/exec',

  /* 2. Mode contoh: bila GAS_URL kosong ATAU backend gagal dihubungi,
        situs tetap tampil memakai data contoh bawaan (js/demo-data.js).
        Setel false bila Anda ingin situs menampilkan pesan galat saja. */
  MODE_CONTOH_OTOMATIS: true,

  /* 3. Identitas situs — dipakai sebelum data dari backend termuat.
        Setelah backend aktif, nilai dari sheet 'Pengaturan_Situs' yang dipakai. */
  SITUS: {
    nama_kecamatan: 'Kecamatan Nusantara',
    nama_kabupaten: 'Kabupaten Sejahtera',
    tagline: 'Maju, Mandiri & Melayani Warga',
    alamat: 'Jl. Raya Utama No. 1, Kab. Sejahtera 65123',
    telepon: '(0341) 789118',
    email: 'kecamatan@contoh.go.id',
    whatsapp: '6281234567890',
    jam_layanan: 'Senin–Jumat, 08.00 – 15.30 WITA',
    koordinat_peta: '-7.9666,112.6326',
    nama_camat: 'Drs. Hendra Santoso, M.Si.',
    footer_catatan: 'Terintegrasi dengan Sistem Informasi Kabupaten.'
  },

  /* 4. Nomor kontak darurat yang tampil di halaman pengaduan. */
  KONTAK_DARURAT: [
    { label: 'Polsek Kecamatan',  nomor: '(0341) 789110' },
    { label: 'Puskesmas 24 Jam',  nomor: '(0341) 789118' },
    { label: 'Damkar Terpadu',    nomor: '113 / (0341) 789113' }
  ],

  /* 5. Pilihan kategori pada formulir pengaduan warga. */
  KATEGORI_PENGADUAN: [
    'Jalan & Infrastruktur',
    'Layanan Kependudukan',
    'Sampah & Kebersihan',
    'Ketertiban & Trantib',
    'Bansos & Usaha Warga',
    'Aspirasi Pembangunan'
  ],

  /* 6. Batas unggahan lampiran pengaduan. */
  MAKS_LAMPIRAN: 3,
  MAKS_UKURAN_MB: 10,

  /* 7. Jumlah item per halaman pada daftar berita. */
  BERITA_PER_HALAMAN: 6
};
