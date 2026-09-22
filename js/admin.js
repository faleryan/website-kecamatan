/* ==========================================================================
   PANEL ADMINISTRASI KECAMATAN
   Semua aksi tulis melewati doPost Google Apps Script dengan token sesi.
   ========================================================================== */

const ADMIN = {
  token: '',
  user: null,
  data: {},          // seluruh sheet hasil listAll()
  modul: 'dashboard',
  aduanTerpilih: null,
  demo: false
};

/* ==========================================================================
   1. DEFINISI MODUL & SKEMA FORMULIR
   ========================================================================== */
const MODUL = {

  dashboard: { label: 'Dashboard Ringkasan', ikon: 'grafik', grup: 'Navigasi Utama' },

  pengaduan: {
    label: 'Kelola Pengaduan', ikon: 'aduan', grup: 'Navigasi Utama', sheet: 'Pengaduan',
    judul: 'Kelola Pengaduan & Aspirasi Warga',
    deskripsi: 'Verifikasi, disposisi, dan tindak lanjut laporan warga yang masuk melalui portal publik. Catatan admin bersifat internal dan tidak ditampilkan kepada warga.'
  },

  berita: {
    label: 'Berita & Publikasi', ikon: 'berita', grup: 'Konten Publik', sheet: 'Berita',
    judul: 'Kelola Berita', deskripsi: 'Tulis, sunting, dan terbitkan berita kecamatan. Hanya berita berstatus "Published" yang tampil di website publik.',
    kolom: [
      { k: 'Foto_Cover', l: '', t: 'gambar' },
      { k: 'Judul', l: 'Judul Berita', t: 'utama' },
      { k: 'Kategori', l: 'Kategori', t: 'lencana' },
      { k: 'Penulis', l: 'Penulis' },
      { k: 'Tanggal_Publish', l: 'Tanggal', t: 'tanggal' },
      { k: 'Status', l: 'Status', t: 'status' }
    ],
    field: [
      { k: 'Judul', l: 'Judul Berita', t: 'text', wajib: true, penuh: true },
      { k: 'Ringkasan', l: 'Ringkasan Singkat', t: 'teks', penuh: true, bantuan: 'Tampil pada kartu berita di beranda (1–2 kalimat).' },
      { k: 'Isi', l: 'Isi Berita Lengkap', t: 'teks', wajib: true, penuh: true, baris: 10, bantuan: 'Pisahkan antarparagraf dengan satu baris kosong.' },
      { k: 'Kategori', l: 'Kategori', t: 'text', bantuan: 'Contoh: Pembangunan, Layanan Publik, Ekonomi Kreatif.' },
      { k: 'Penulis', l: 'Penulis / Seksi', t: 'text' },
      { k: 'Tanggal_Publish', l: 'Tanggal Publikasi', t: 'tanggal' },
      { k: 'Status', l: 'Status Tayang', t: 'pilih', opsi: ['Draft', 'Published'], wajib: true },
      { k: 'Foto_Cover', l: 'Foto Sampul', t: 'berkas', kategori: 'berita', penuh: true }
    ]
  },

  pengumuman: {
    label: 'Pengumuman', ikon: 'megafon', grup: 'Konten Publik', sheet: 'Pengumuman',
    judul: 'Kelola Pengumuman', deskripsi: 'Pengumuman berstatus "Tayang" otomatis muncul pada teks berjalan di beranda situs publik.',
    kolom: [
      { k: 'Judul', l: 'Judul Pengumuman', t: 'utama' },
      { k: 'Prioritas', l: 'Prioritas', t: 'lencana' },
      { k: 'Tanggal_Terbit', l: 'Terbit', t: 'tanggal' },
      { k: 'Status', l: 'Status', t: 'status' }
    ],
    field: [
      { k: 'Judul', l: 'Judul Pengumuman', t: 'text', wajib: true, penuh: true },
      { k: 'Isi', l: 'Isi Pengumuman', t: 'teks', wajib: true, penuh: true, baris: 6 },
      { k: 'Tanggal_Terbit', l: 'Tanggal Terbit', t: 'tanggal' },
      { k: 'Prioritas', l: 'Prioritas', t: 'pilih', opsi: ['Sedang', 'Tinggi'] },
      { k: 'Status', l: 'Status', t: 'pilih', opsi: ['Tayang', 'Draft'], wajib: true }
    ]
  },

  profil: {
    label: 'Profil Kecamatan', ikon: 'gedung', grup: 'Data Wilayah', sheet: 'Profil_Kecamatan',
    judul: 'Kelola Profil Kecamatan', deskripsi: 'Sejarah, visi, misi, dan struktur organisasi. Urutan tampil menentukan susunan bagian pada halaman publik.',
    kolom: [
      { k: 'Urutan_Tampil', l: 'Urutan', t: 'angka' },
      { k: 'Judul_Bagian', l: 'Nama Bagian', t: 'utama' },
      { k: 'Isi_Konten', l: 'Cuplikan Isi', t: 'cuplikan' }
    ],
    field: [
      { k: 'Judul_Bagian', l: 'Nama Bagian', t: 'text', wajib: true, bantuan: 'Contoh: Sejarah, Visi, Misi, Struktur Organisasi.' },
      { k: 'Urutan_Tampil', l: 'Urutan Tampil', t: 'angka' },
      { k: 'Isi_Konten', l: 'Isi Konten', t: 'teks', wajib: true, penuh: true, baris: 10 }
    ]
  },

  geografis: {
    label: 'Data Geografis', ikon: 'peta', grup: 'Data Wilayah', sheet: 'Data_Geografis',
    judul: 'Kelola Data Geografis Wilayah', deskripsi: 'Batas administratif, luas, dan topografi wilayah kecamatan.',
    kolom: [
      { k: 'Nama_Wilayah', l: 'Nama Wilayah', t: 'utama' },
      { k: 'Luas_Wilayah', l: 'Luas' },
      { k: 'Ketinggian', l: 'Ketinggian' }
    ],
    field: [
      { k: 'Nama_Wilayah', l: 'Nama Wilayah', t: 'text', wajib: true },
      { k: 'Luas_Wilayah', l: 'Luas Wilayah', t: 'text', bantuan: 'Contoh: 84,52 km²' },
      { k: 'Batas_Utara', l: 'Batas Sebelah Utara', t: 'text' },
      { k: 'Batas_Selatan', l: 'Batas Sebelah Selatan', t: 'text' },
      { k: 'Batas_Timur', l: 'Batas Sebelah Timur', t: 'text' },
      { k: 'Batas_Barat', l: 'Batas Sebelah Barat', t: 'text' },
      { k: 'Ketinggian', l: 'Ketinggian', t: 'text', bantuan: 'Contoh: 120–650 mdpl' },
      { k: 'Link_Peta', l: 'Tautan Peta (opsional)', t: 'text' },
      { k: 'Deskripsi', l: 'Deskripsi Wilayah', t: 'teks', penuh: true, baris: 6 }
    ]
  },

  desa: {
    label: 'Data Desa', ikon: 'rumah', grup: 'Data Wilayah', sheet: 'Data_Desa',
    judul: 'Kelola Data Desa Binaan', deskripsi: 'Profil tiap desa: kepala desa, jumlah penduduk, luas wilayah, kontak, dan foto.',
    kolom: [
      { k: 'Foto', l: '', t: 'gambar' },
      { k: 'Nama_Desa', l: 'Nama Desa', t: 'utama' },
      { k: 'Kepala_Desa', l: 'Kepala Desa' },
      { k: 'Jumlah_Penduduk', l: 'Penduduk', t: 'angka' },
      { k: 'Jumlah_KK', l: 'KK', t: 'angka' },
      { k: 'Luas_Wilayah', l: 'Luas' }
    ],
    field: [
      { k: 'Nama_Desa', l: 'Nama Desa', t: 'text', wajib: true },
      { k: 'Kepala_Desa', l: 'Nama Kepala Desa', t: 'text' },
      { k: 'Jumlah_Penduduk', l: 'Jumlah Penduduk', t: 'angka' },
      { k: 'Jumlah_KK', l: 'Jumlah Kepala Keluarga', t: 'angka' },
      { k: 'Luas_Wilayah', l: 'Luas Wilayah', t: 'text' },
      { k: 'Alamat_Kantor', l: 'Alamat Kantor Desa', t: 'text' },
      { k: 'Kontak', l: 'Kontak', t: 'text' },
      { k: 'Deskripsi', l: 'Deskripsi & Potensi Desa', t: 'teks', penuh: true, baris: 5 },
      { k: 'Foto', l: 'Foto Desa', t: 'berkas', kategori: 'galeri', penuh: true }
    ]
  },

  statistik: {
    label: 'Statistik Penduduk', ikon: 'grafik', grup: 'Data Wilayah', sheet: 'Statistik_Penduduk',
    judul: 'Kelola Statistik Penduduk', deskripsi: 'Satu baris untuk satu desa pada satu tahun. Data ini menjadi sumber grafik dan tabel statistik publik.',
    kolom: [
      { k: 'Desa', l: 'Desa', t: 'utama' },
      { k: 'Tahun', l: 'Tahun', t: 'angka' },
      { k: 'Jumlah_Laki', l: 'Laki-laki', t: 'angka' },
      { k: 'Jumlah_Perempuan', l: 'Perempuan', t: 'angka' },
      { k: 'Jumlah_KK', l: 'KK', t: 'angka' }
    ],
    field: [
      { k: 'Desa', l: 'Nama Desa', t: 'text', wajib: true },
      { k: 'Tahun', l: 'Tahun Data', t: 'angka', wajib: true },
      { k: 'Jumlah_Laki', l: 'Jumlah Laki-laki', t: 'angka' },
      { k: 'Jumlah_Perempuan', l: 'Jumlah Perempuan', t: 'angka' },
      { k: 'Jumlah_KK', l: 'Jumlah Kepala Keluarga', t: 'angka' },
      { k: 'Usia_0_14', l: 'Usia 0–14 Tahun', t: 'angka' },
      { k: 'Usia_15_64', l: 'Usia 15–64 Tahun', t: 'angka' },
      { k: 'Usia_65_Plus', l: 'Usia 65 Tahun ke Atas', t: 'angka' }
    ]
  },

  umkm: {
    label: 'UMKM & Potensi', ikon: 'toko', grup: 'Konten Publik', sheet: 'Data_UMKM',
    judul: 'Kelola Data UMKM & Potensi Desa', deskripsi: 'Direktori usaha warga yang dipromosikan melalui portal kecamatan.',
    kolom: [
      { k: 'Foto', l: '', t: 'gambar' },
      { k: 'Nama_Usaha', l: 'Nama Usaha', t: 'utama' },
      { k: 'Desa', l: 'Desa' },
      { k: 'Jenis_Usaha', l: 'Jenis', t: 'lencana' },
      { k: 'Kontak', l: 'Kontak' }
    ],
    field: [
      { k: 'Nama_Usaha', l: 'Nama Usaha', t: 'text', wajib: true },
      { k: 'Desa', l: 'Desa', t: 'text', wajib: true },
      { k: 'Jenis_Usaha', l: 'Jenis Usaha', t: 'text', bantuan: 'Contoh: Makanan & Minuman, Kerajinan, Wisata & Agro.' },
      { k: 'Pemilik', l: 'Nama Pemilik / Kelompok', t: 'text' },
      { k: 'Kontak', l: 'Kontak', t: 'text' },
      { k: 'Deskripsi', l: 'Deskripsi Usaha', t: 'teks', penuh: true, baris: 5 },
      { k: 'Foto', l: 'Foto Produk / Usaha', t: 'berkas', kategori: 'galeri', penuh: true }
    ]
  },

  agenda: {
    label: 'Agenda Kegiatan', ikon: 'kalender', grup: 'Konten Publik', sheet: 'Agenda_Kegiatan',
    judul: 'Kelola Agenda Kegiatan', deskripsi: 'Jadwal kegiatan kecamatan yang tampil pada beranda dan halaman agenda publik.',
    kolom: [
      { k: 'Nama_Kegiatan', l: 'Nama Kegiatan', t: 'utama' },
      { k: 'Tanggal', l: 'Tanggal', t: 'tanggal' },
      { k: 'Waktu', l: 'Waktu' },
      { k: 'Lokasi', l: 'Lokasi' }
    ],
    field: [
      { k: 'Nama_Kegiatan', l: 'Nama Kegiatan', t: 'text', wajib: true, penuh: true },
      { k: 'Tanggal', l: 'Tanggal Kegiatan', t: 'tanggal', wajib: true },
      { k: 'Waktu', l: 'Waktu', t: 'text', bantuan: 'Contoh: 08.00 – 14.00' },
      { k: 'Lokasi', l: 'Lokasi', t: 'text' },
      { k: 'Deskripsi', l: 'Deskripsi Kegiatan', t: 'teks', penuh: true, baris: 5 }
    ]
  },

  galeri: {
    label: 'Galeri Foto', ikon: 'galeri', grup: 'Konten Publik', sheet: 'Galeri_Foto',
    judul: 'Kelola Galeri Dokumentasi', deskripsi: 'Unggah foto kegiatan. Foto tersimpan di folder Google Drive dan dikelompokkan per kategori album.',
    kolom: [
      { k: 'Link_Drive_Foto', l: '', t: 'gambar' },
      { k: 'Judul', l: 'Judul Foto', t: 'utama' },
      { k: 'Kategori', l: 'Album', t: 'lencana' },
      { k: 'Tanggal_Upload', l: 'Diunggah', t: 'tanggal' }
    ],
    field: [
      { k: 'Judul', l: 'Judul Foto', t: 'text', wajib: true },
      { k: 'Kategori', l: 'Album / Kategori', t: 'text', bantuan: 'Contoh: Kegiatan, Layanan, Ekonomi, Wisata.' },
      { k: 'Keterangan', l: 'Keterangan Foto', t: 'teks', penuh: true, baris: 3 },
      { k: 'Tanggal_Upload', l: 'Tanggal', t: 'tanggal' },
      { k: 'Link_Drive_Foto', l: 'Berkas Foto', t: 'berkas', kategori: 'galeri', penuh: true, wajib: true }
    ]
  },

  dokumen: {
    label: 'Dokumen & Regulasi', ikon: 'dokumen', grup: 'Konten Publik', sheet: 'Upload_Dokumen',
    judul: 'Kelola Dokumen & Regulasi', deskripsi: 'Unggah SOP, laporan, dan regulasi. Tandai "Ditampilkan Publik" agar warga dapat mengunduhnya.',
    kolom: [
      { k: 'Nama_Dokumen', l: 'Nama Dokumen', t: 'utama' },
      { k: 'Kategori', l: 'Kategori', t: 'lencana' },
      { k: 'Ukuran', l: 'Ukuran' },
      { k: 'Tanggal_Upload', l: 'Diunggah', t: 'tanggal' },
      { k: 'Ditampilkan_Publik', l: 'Publik', t: 'yn' }
    ],
    field: [
      { k: 'Nama_Dokumen', l: 'Nama Dokumen', t: 'text', wajib: true, penuh: true },
      { k: 'Kategori', l: 'Kategori', t: 'text', bantuan: 'Contoh: Regulasi, Transparansi, Profil, Layanan.' },
      { k: 'Ukuran', l: 'Ukuran Berkas', t: 'text', bantuan: 'Terisi otomatis setelah berkas diunggah.' },
      { k: 'Tanggal_Upload', l: 'Tanggal Unggah', t: 'tanggal' },
      { k: 'Ditampilkan_Publik', l: 'Tampilkan di Halaman Publik', t: 'pilih', opsi: ['Y', 'N'], wajib: true },
      { k: 'Link_Drive', l: 'Berkas Dokumen', t: 'berkas', kategori: 'dokumen', penuh: true }
    ]
  },

  pengaturan: { label: 'Pengaturan Situs', ikon: 'gedung', grup: 'Konfigurasi', sheet: 'Pengaturan_Situs' },
  akun:       { label: 'Pengaturan Akun', ikon: 'orang',  grup: 'Konfigurasi' }
};

const STATUS_ADUAN = ['Menunggu Verifikasi', 'Sedang Diproses', 'Tindak Lanjut Lapangan', 'Selesai / Ditutup', 'Ditolak'];
const DISPOSISI = ['', 'Seksi Pemerintahan', 'Seksi Trantib', 'Seksi Ekonomi & Pembangunan', 'Seksi Kesejahteraan Sosial', 'Seksi Pelayanan Umum', 'Pemerintah Desa'];

/* ==========================================================================
   2. AUTENTIKASI
   ========================================================================== */
const AUTH = {

  async login(username, password) {
    // ---- Mode contoh (GAS_URL belum diisi) ----
    if (!API.aktif()) {
      if (username.trim().toLowerCase() !== 'admin' || password !== 'admin123') {
        throw new Error('Mode contoh: gunakan admin / admin123.');
      }
      ADMIN.demo = true;
      ADMIN.token = 'demo-token';
      ADMIN.user = { nama: 'Administrator (Mode Contoh)', jabatan: 'Admin Seksi Pelayanan', username: 'admin' };
      return;
    }
    const hasil = await API.post('login', { username: username, password: password });
    if (!hasil.success) throw new Error(hasil.message || 'Login gagal.');
    ADMIN.demo = false;
    ADMIN.token = hasil.token;
    ADMIN.user = hasil.user;
    try {
      sessionStorage.setItem('adminToken', hasil.token);
      sessionStorage.setItem('adminUser', JSON.stringify(hasil.user));
    } catch (e) {}
  },

  async pulihkan() {
    let token = '', user = null;
    try {
      token = sessionStorage.getItem('adminToken') || '';
      user = JSON.parse(sessionStorage.getItem('adminUser') || 'null');
    } catch (e) {}
    if (!token || !API.aktif()) return false;

    const hasil = await API.post('checkSession', {}, token);
    if (!hasil.success) { this.bersihkan(); return false; }
    ADMIN.token = token;
    ADMIN.user = hasil.data || user;
    return true;
  },

  async logout() {
    if (API.aktif() && ADMIN.token) { try { await API.post('logout', {}, ADMIN.token); } catch (e) {} }
    this.bersihkan();
    location.reload();
  },

  bersihkan() {
    ADMIN.token = ''; ADMIN.user = null;
    try { sessionStorage.removeItem('adminToken'); sessionStorage.removeItem('adminUser'); } catch (e) {}
  }
};

/* ==========================================================================
   3. LAYAR LOGIN
   ========================================================================== */
function tampilLogin(pesan) {
  document.getElementById('app').innerHTML =
    '<div class="login-screen">' +
      '<div class="login-visual"><div class="inner">' +
        '<span class="hero-badge">' + ICON.perisai.replace('18','13') + ' Area Terbatas</span>' +
        '<h1>Panel Administrasi<br><em>Portal Kecamatan</em></h1>' +
        '<p>Kelola seluruh konten website publik dari satu tempat: berita, data desa, statistik penduduk, UMKM, agenda, galeri, dokumen, hingga tindak lanjut pengaduan warga.</p>' +
        '<ul class="login-points">' +
          '<li>' + ICON.ceklis + '<span>Database Google Sheets, berkas tersimpan di Google Drive kantor.</span></li>' +
          '<li>' + ICON.ceklis + '<span>Perubahan konten langsung tercermin di website publik.</span></li>' +
          '<li>' + ICON.ceklis + '<span>Sesi berakhir otomatis setelah 6 jam demi keamanan data.</span></li>' +
        '</ul>' +
      '</div></div>' +

      '<div class="login-panel"><div class="login-box">' +
        '<div class="brand-mark">' + ICON.kunci.replace('18','24') + '</div>' +
        '<h2>Masuk Panel Admin</h2>' +
        '<p class="sub">Gunakan akun yang diberikan administrator kecamatan.</p>' +
        (pesan ? '<div class="banner banner-warning" style="margin-bottom:1rem">' + ICON.peringatan + '<div>' + UI.esc(pesan) + '</div></div>' : '') +
        (!API.aktif() ? '<div class="banner banner-info" style="margin-bottom:1rem">' + ICON.info +
          '<div><strong>Mode contoh aktif</strong>GAS_URL pada js/config.js belum diisi. Masuk dengan <strong>admin / admin123</strong> untuk menjelajah panel. Perubahan tidak tersimpan.</div></div>' : '') +
        '<form id="formLogin">' +
          '<div class="field" style="margin-bottom:1rem"><label for="lUser">Username</label>' +
            '<input id="lUser" type="text" autocomplete="username" required placeholder="admin"></div>' +
          '<div class="field" style="margin-bottom:1.25rem"><label for="lPass">Password</label>' +
            '<input id="lPass" type="password" autocomplete="current-password" required placeholder="••••••••"></div>' +
          '<div class="field-error" id="lError" hidden style="margin-bottom:.75rem"></div>' +
          '<button class="btn btn-primary btn-block" type="submit" id="lBtn">' + ICON.kunci.replace('18','16') + ' Masuk ke Dashboard</button>' +
        '</form>' +
        '<p style="font-size:12.5px;color:var(--text-muted);margin-top:1.25rem;text-align:center">' +
          '<a href="index.html">← Kembali ke website publik</a></p>' +
      '</div></div>' +
    '</div>';

  document.getElementById('formLogin').addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = document.getElementById('lBtn');
    const err = document.getElementById('lError');
    err.hidden = true;
    btn.disabled = true; btn.textContent = 'Memeriksa…';
    try {
      await AUTH.login(document.getElementById('lUser').value, document.getElementById('lPass').value);
      await mulaiPanel();
    } catch (ex) {
      err.textContent = ex.message;
      err.hidden = false;
      btn.disabled = false;
      btn.innerHTML = ICON.kunci.replace('18','16') + ' Masuk ke Dashboard';
    }
  });
}

/* ==========================================================================
   4. KERANGKA PANEL
   ========================================================================== */
async function mulaiPanel() {
  document.getElementById('app').innerHTML =
    '<div class="admin-layout">' +
      '<aside class="admin-side" id="sidebar"></aside>' +
      '<div class="admin-main">' +
        '<header class="admin-top" id="adminTop"></header>' +
        '<div class="admin-body" id="adminBody"></div>' +
      '</div>' +
    '</div>' +
    '<div class="modal-bg" id="modalBg"></div>';

  await muatData();
  gambarSidebar();
  gambarTopbar();
  bukaModul('dashboard');
}

async function muatData() {
  UI.muat(true);
  try {
    if (ADMIN.demo) {
      ADMIN.data = JSON.parse(JSON.stringify(DEMO_DATA));
      // Pengaturan situs disimpan sebagai baris key/value di panel admin
      ADMIN.data.Pengaturan_Situs = Object.keys(DEMO_DATA.Pengaturan_Situs).map(function (k) {
        return { key: k, value: DEMO_DATA.Pengaturan_Situs[k], keterangan: '' };
      });
      ADMIN.data.Pengaduan = ADMIN.data.Pengaduan || contohPengaduan();
    } else {
      const hasil = await API.post('listAll', {}, ADMIN.token);
      if (!hasil.success) throw new Error(hasil.message || 'Gagal memuat data.');
      ADMIN.data = hasil.data;
    }
  } catch (err) {
    if (String(err.message).indexOf('SESI_HABIS') > -1) {
      AUTH.bersihkan();
      tampilLogin('Sesi Anda telah berakhir. Silakan masuk kembali.');
      UI.muat(false);
      throw err;
    }
    UI.notif(err.message, 'error');
    ADMIN.data = ADMIN.data || {};
  }
  UI.muat(false);
}

function contohPengaduan() {
  const t = function (n) { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString(); };
  return [
    { ID:'ADU-1', Nomor_Tiket:'ADU-2025-0842', Nama_Pelapor:'Bambang Hermanto', Kontak:'0812-3456-7890', Email:'', Desa:'Sukamaju',
      Alamat_Kejadian:'RT 04 / RW 02, dekat jembatan utama', Kategori:'Jalan & Infrastruktur',
      Judul:'Jalan Rusak Berlubang Parah di Dekat Jembatan RT 04',
      Isi_Aduan:'Selamat pagi Bapak Camat, aspal di tanjakan dekat jembatan RT 04 Desa Sukamaju amblas cukup dalam akibat hujan deras kemarin sore. Tadi pagi ada ibu mengantar anak sekolah jatuh tergelincir. Mohon sangat kiranya dari seksi trantib atau pemdes segera memberi tanda drum atau timbun batu koral sementara sebelum diperbaiki dinas PUPR. Terima kasih banyak.',
      Link_Foto_Bukti:'', Tanggal_Kirim:t(0), Status_Tindak_Lanjut:'Menunggu Verifikasi', Disposisi:'', Catatan_Admin:'', Updated_At:t(0) },
    { ID:'ADU-2', Nomor_Tiket:'ADU-2025-0841', Nama_Pelapor:'Siti Nurhaliza', Kontak:'0857-1122-3344', Email:'', Desa:'Mekarsari',
      Alamat_Kejadian:'Dusun Tengah RT 01', Kategori:'Layanan Kependudukan',
      Judul:'Keterlambatan Perekaman KTP-el untuk Lansia',
      Isi_Aduan:'Kakek saya berusia 78 tahun sakit stroke dan tidak bisa datang ke kantor kecamatan untuk perekaman KTP-el. Mohon dibantu layanan jemput bola ke rumah.',
      Link_Foto_Bukti:'', Tanggal_Kirim:t(0), Status_Tindak_Lanjut:'Sedang Diproses', Disposisi:'Seksi Pelayanan Umum', Catatan_Admin:'Dijadwalkan kunjungan petugas Kamis pekan ini.', Updated_At:t(0) },
    { ID:'ADU-3', Nomor_Tiket:'ADU-2025-0840', Nama_Pelapor:'Agus Supriadi', Kontak:'0813-9988-7766', Email:'', Desa:'Karangtanjung',
      Alamat_Kejadian:'Bahu jalan poros desa', Kategori:'Sampah & Kebersihan',
      Judul:'Penumpukan Sampah Liar di Bahu Jalan Poros',
      Isi_Aduan:'Warga luar membuang kantong sampah di bahu jalan poros desa setiap malam. Bau menyengat dan mengganggu pengguna jalan.',
      Link_Foto_Bukti:'', Tanggal_Kirim:t(1), Status_Tindak_Lanjut:'Tindak Lanjut Lapangan', Disposisi:'Seksi Trantib', Catatan_Admin:'Koordinasi dengan Satgas Kebersihan dan DLH kabupaten.', Updated_At:t(1) },
    { ID:'ADU-4', Nomor_Tiket:'ADU-2025-0839', Nama_Pelapor:'Rahmat Hidayat', Kontak:'0821-4567-8901', Email:'', Desa:'Sindangresmi',
      Alamat_Kejadian:'Depan pasar desa', Kategori:'Ketertiban & Trantib',
      Judul:'Parkir Liar Menutupi Akses Masuk Pasar Desa',
      Isi_Aduan:'Mobil pick-up pedagang parkir menutup akses masuk pasar desa sejak subuh sehingga warga kesulitan lewat.',
      Link_Foto_Bukti:'', Tanggal_Kirim:t(2), Status_Tindak_Lanjut:'Selesai / Ditutup', Disposisi:'Seksi Trantib', Catatan_Admin:'Sudah ditertibkan bersama Linmas desa, dipasang rambu larangan parkir.', Updated_At:t(2) },
    { ID:'ADU-5', Nomor_Tiket:'ADU-2025-0838', Nama_Pelapor:'Dewi Anggraeni', Kontak:'0878-3344-5566', Email:'', Desa:'Wargaluyu',
      Alamat_Kejadian:'Kantor Desa Wargaluyu', Kategori:'Bansos & Usaha Warga',
      Judul:'Klarifikasi Kuota Bantuan Bibit Tanaman',
      Isi_Aduan:'Meminta verifikasi data penerima bantuan bibit tanaman produktif tahap kedua agar transparan bagi kelompok tani.',
      Link_Foto_Bukti:'', Tanggal_Kirim:t(3), Status_Tindak_Lanjut:'Selesai / Ditutup', Disposisi:'Seksi Ekonomi & Pembangunan', Catatan_Admin:'Daftar penerima telah ditempel di balai desa dan diunggah ke portal.', Updated_At:t(3) }
  ];
}

function gambarSidebar() {
  const grup = {};
  Object.keys(MODUL).forEach(function (id) {
    const m = MODUL[id];
    const g = m.grup || 'Lainnya';
    (grup[g] = grup[g] || []).push({ id: id, m: m });
  });

  const baru = (ADMIN.data.Pengaduan || []).filter(function (p) {
    return String(p.Status_Tindak_Lanjut || '').toLowerCase().indexOf('menunggu') > -1;
  }).length;

  let html = '<div class="side-brand"><span class="brand-mark">' + ICON.gedung.replace('18','20') + '</span>' +
    '<span><strong>Kecamatan Digital</strong><span>Panel Administrasi</span></span></div>';

  Object.keys(grup).forEach(function (g) {
    html += '<div class="side-group">' + UI.esc(g) + '</div><nav class="side-nav">' +
      grup[g].map(function (x) {
        const lencana = (x.id === 'pengaduan' && baru) ? '<span class="pill">' + baru + ' Baru</span>' : '';
        return '<button data-modul="' + x.id + '">' + (ICON[x.m.ikon] || ICON.dokumen) + ' ' + UI.esc(x.m.label) + lencana + '</button>';
      }).join('') + '</nav>';
  });

  html += '<div class="side-foot">' +
    '<div class="side-status"><span class="dot ' + (ADMIN.demo ? 'dot-off' : 'dot-on') + '"></span>' +
    '<span>' + (ADMIN.demo ? 'Mode Contoh — tidak tersimpan' : 'Database Terhubung') + '<br>' +
    '<span style="opacity:.65">' + (ADMIN.demo ? 'Isi GAS_URL di js/config.js' : 'Google Apps Script API') + '</span></span></div>' +
    '<a href="index.html" style="display:block;margin-top:.75rem;color:rgba(255,255,255,.7);font-size:12.5px">↗ Lihat website publik</a>' +
  '</div>';

  const side = document.getElementById('sidebar');
  side.innerHTML = html;
  side.addEventListener('click', function (e) {
    const b = e.target.closest('[data-modul]');
    if (!b) return;
    bukaModul(b.dataset.modul);
    side.classList.remove('open');
  });
}

function gambarTopbar() {
  const u = ADMIN.user || {};
  const inisial = String(u.nama || 'A').split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase();

  document.getElementById('adminTop').innerHTML =
    '<button class="admin-toggle" id="adminToggle" aria-label="Buka menu">' + ICON.menu + '</button>' +
    '<div class="admin-search">' + ICON.cari.replace('18','16') +
      '<input id="globalSearch" type="search" placeholder="Cari data pada modul aktif…"></div>' +
    '<div class="sp"></div>' +
    '<button class="ikon-btn" id="btnSegar" title="Muat ulang data">' + ICON.segar.replace('18','16') + '</button>' +
    '<div class="admin-user"><span class="avatar">' + UI.esc(inisial) + '</span>' +
      '<span><strong style="display:block;font-size:13px">' + UI.esc(u.nama || 'Admin') + '</strong>' +
      '<span style="font-size:11.5px;color:var(--text-muted)">' + UI.esc(u.jabatan || 'Administrator') + '</span></span></div>' +
    '<button class="ikon-btn bahaya" id="btnKeluar" title="Keluar">' + ICON.keluar.replace('18','16') + '</button>';

  document.getElementById('adminToggle').addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('open');
  });
  document.getElementById('btnKeluar').addEventListener('click', function () {
    if (confirm('Keluar dari panel admin?')) AUTH.logout();
  });
  document.getElementById('btnSegar').addEventListener('click', async function () {
    await muatData();
    gambarSidebar();
    bukaModul(ADMIN.modul);
    UI.notif('Data berhasil dimuat ulang.', 'success');
  });
  document.getElementById('globalSearch').addEventListener('input', function (e) {
    const el = document.getElementById('filterCari');
    if (el) { el.value = e.target.value; el.dispatchEvent(new Event('input')); }
  });
}

/* ==========================================================================
   5. PERUTEAN MODUL
   ========================================================================== */
function bukaModul(id) {
  ADMIN.modul = id;
  document.querySelectorAll('.side-nav button').forEach(function (b) {
    b.classList.toggle('active', b.dataset.modul === id);
  });
  const gs = document.getElementById('globalSearch');
  if (gs) gs.value = '';

  if (id === 'dashboard')       return gambarDashboard();
  if (id === 'pengaduan')       return gambarPengaduan();
  if (id === 'pengaturan')      return gambarPengaturan();
  if (id === 'akun')            return gambarAkun();
  return gambarTabel(id);
}

/* ==========================================================================
   6. DASHBOARD
   ========================================================================== */
function gambarDashboard() {
  const d = ADMIN.data;
  const aduan  = d.Pengaduan || [];
  const berita = d.Berita || [];
  const rendah = function (v) { return String(v || '').toLowerCase(); };

  const baru    = aduan.filter(function (a) { return rendah(a.Status_Tindak_Lanjut).indexOf('menunggu') > -1; });
  const proses  = aduan.filter(function (a) { return rendah(a.Status_Tindak_Lanjut).indexOf('proses') > -1 || rendah(a.Status_Tindak_Lanjut).indexOf('lapangan') > -1; });
  const selesai = aduan.filter(function (a) { return rendah(a.Status_Tindak_Lanjut).indexOf('selesai') > -1; });

  const ringkas = [
    { l: 'Total Laporan Masuk', v: aduan.length,        s: 'Seluruh pengaduan tercatat',                k: 'kpi-primary', i: ICON.inbox },
    { l: 'Menunggu Verifikasi', v: baru.length,         s: 'Perlu tindakan penugasan admin',            k: 'kpi-warning', i: ICON.peringatan },
    { l: 'Proses & Lapangan',   v: proses.length,       s: 'Sedang ditangani seksi terkait',            k: 'kpi-info',    i: ICON.segar },
    { l: 'Selesai / Ditutup',   v: selesai.length,      s: aduan.length ? UI.persen(selesai.length, aduan.length) + ' tingkat penyelesaian' : '—', k: 'kpi-success', i: ICON.ceklis }
  ].map(function (x) {
    return '<div class="kpi ' + x.k + '"><div class="ico">' + x.i + '</div>' +
      '<div class="lbl">' + x.l + '</div><div class="val num">' + UI.angka(x.v) + '</div>' +
      '<div class="sub">' + UI.esc(x.s) + '</div></div>';
  }).join('');

  const isiKonten = [
    { m: 'berita',     l: 'Berita',           n: berita.length,               e: berita.filter(function (b) { return rendah(b.Status) === 'published'; }).length + ' tayang' },
    { m: 'pengumuman', l: 'Pengumuman',       n: (d.Pengumuman || []).length, e: (d.Pengumuman || []).filter(function (p) { return rendah(p.Status) === 'tayang'; }).length + ' tayang' },
    { m: 'desa',       l: 'Data Desa',        n: (d.Data_Desa || []).length,  e: 'desa binaan' },
    { m: 'umkm',       l: 'UMKM & Potensi',   n: (d.Data_UMKM || []).length,  e: 'usaha terdata' },
    { m: 'agenda',     l: 'Agenda Kegiatan',  n: (d.Agenda_Kegiatan || []).length, e: 'kegiatan' },
    { m: 'galeri',     l: 'Galeri Foto',      n: (d.Galeri_Foto || []).length, e: 'foto' },
    { m: 'statistik',  l: 'Baris Statistik',  n: (d.Statistik_Penduduk || []).length, e: 'baris data' },
    { m: 'dokumen',    l: 'Dokumen Publik',   n: (d.Upload_Dokumen || []).length, e: (d.Upload_Dokumen || []).filter(function (x) { return String(x.Ditampilkan_Publik).toUpperCase() === 'Y'; }).length + ' publik' }
  ].map(function (x) {
    return '<button class="quick-card" data-lompat="' + x.m + '" style="text-align:left;cursor:pointer;border:1px solid var(--border)">' +
      '<div class="quick-top"><div class="quick-icon">' + (ICON[MODUL[x.m].ikon] || ICON.dokumen) + '</div>' +
      '<span class="badge badge-primary">' + UI.angka(x.n) + '</span></div>' +
      '<h3>' + x.l + '</h3><p>' + UI.esc(x.e) + '</p></button>';
  }).join('');

  const terbaru = aduan.slice().sort(function (a, b) {
    return new Date(b.Tanggal_Kirim) - new Date(a.Tanggal_Kirim);
  }).slice(0, 5);

  document.getElementById('adminBody').innerHTML =
    '<div class="modul-head"><div>' +
      '<span class="badge badge-primary">Selamat datang kembali</span>' +
      '<h1>Halo, ' + UI.esc((ADMIN.user && ADMIN.user.nama) || 'Admin') + '</h1>' +
      '<p>Ringkasan kondisi portal kecamatan hari ini, ' + UI.tanggal(new Date(), 'panjang') + '.</p>' +
    '</div><div class="modul-actions">' +
      '<button class="btn btn-outline btn-sm" data-lompat="berita">' + ICON.plus.replace('18','15') + ' Tulis Berita</button>' +
      '<button class="btn btn-primary btn-sm" data-lompat="pengaduan">' + ICON.aduan.replace('18','15') + ' Kelola Pengaduan</button>' +
    '</div></div>' +

    (ADMIN.demo ? '<div class="banner banner-warning" style="margin-bottom:1.25rem">' + ICON.peringatan +
      '<div><strong>Panel berjalan dalam mode contoh</strong>Semua data adalah contoh dan perubahan tidak tersimpan. ' +
      'Isi <code>GAS_URL</code> pada <code>js/config.js</code> dengan URL Web App Apps Script, lalu masuk kembali dengan akun asli.</div></div>' : '') +

    '<div class="kpi-grid">' + ringkas + '</div>' +

    '<div class="grid" style="grid-template-columns:minmax(0,1fr) 380px;gap:1.25rem;align-items:start">' +
      '<div class="card">' +
        '<div style="padding:1rem 1.25rem;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;gap:1rem">' +
          '<h3 style="font-size:16px;margin:0">Pengaduan Terbaru Masuk</h3>' +
          '<button class="btn btn-outline btn-sm" data-lompat="pengaduan">Lihat Semua</button></div>' +
        (terbaru.length ? '<div style="overflow-x:auto"><table class="admin-table"><thead><tr>' +
          '<th>Tiket & Waktu</th><th>Pelapor</th><th>Subjek</th><th>Status</th></tr></thead><tbody>' +
          terbaru.map(function (a) {
            return '<tr><td><strong>' + UI.esc(a.Nomor_Tiket) + '</strong><br>' +
              '<span style="font-size:11.5px;color:var(--text-muted)">' + UI.tanggal(a.Tanggal_Kirim, 'pendek') + '</span></td>' +
              '<td>' + UI.esc(a.Nama_Pelapor) + '<br><span style="font-size:11.5px;color:var(--text-muted)">Desa ' + UI.esc(a.Desa) + '</span></td>' +
              '<td>' + UI.esc(UI.potong(a.Judul, 44)) + '</td>' +
              '<td><span class="badge ' + UI.kelasStatus(a.Status_Tindak_Lanjut) + '">' + UI.esc(a.Status_Tindak_Lanjut) + '</span></td></tr>';
          }).join('') + '</tbody></table></div>'
        : UI.kosong('Belum ada pengaduan', 'Laporan warga akan tampil di sini.')) +
      '</div>' +
      '<div class="card card-pad">' +
        '<h3 style="font-size:16px;margin-bottom:.35rem">Distribusi Status Pengaduan</h3>' +
        '<p style="font-size:12.5px;color:var(--text-muted);margin-bottom:1rem">Perbandingan status seluruh laporan warga.</p>' +
        [{ n: 'Menunggu Verifikasi', v: baru.length, w: '#EA580C' },
         { n: 'Sedang Ditangani', v: proses.length, w: '#0284C7' },
         { n: 'Selesai / Ditutup', v: selesai.length, w: '#16A34A' }].map(function (x) {
          const maks = Math.max(baru.length, proses.length, selesai.length, 1);
          return '<div class="bar-row" style="grid-template-columns:130px 1fr 40px"><span class="name">' + x.n + '</span>' +
            '<span class="bar-track"><i class="bar-fill" style="width:' + (x.v / maks * 100) + '%;background:' + x.w + '"></i></span>' +
            '<span class="amt">' + x.v + '</span></div>';
        }).join('') +
      '</div>' +
    '</div>' +

    '<h3 style="font-size:17px;margin:1.75rem 0 .85rem">Ringkasan Konten Website Publik</h3>' +
    '<div class="quick-grid">' + isiKonten + '</div>';

  document.getElementById('adminBody').addEventListener('click', function (e) {
    const b = e.target.closest('[data-lompat]');
    if (b) bukaModul(b.dataset.lompat);
  });
}

/* ==========================================================================
   7. TABEL CRUD GENERIK
   ========================================================================== */
function gambarTabel(id) {
  const m = MODUL[id];
  const baris = ADMIN.data[m.sheet] || [];

  document.getElementById('adminBody').innerHTML =
    '<div class="modul-head"><div><h1>' + UI.esc(m.judul) + '</h1><p>' + UI.esc(m.deskripsi) + '</p></div>' +
      '<div class="modul-actions">' +
        '<button class="btn btn-primary" id="btnTambah">' + ICON.plus.replace('18','16') + ' Tambah Data</button>' +
      '</div></div>' +
    '<div class="toolbar">' +
      '<div class="grow"><input id="filterCari" type="search" placeholder="Cari di dalam ' + UI.esc(m.label.toLowerCase()) + '…"></div>' +
      '<div style="width:190px"><select id="filterKolom"><option value="">Semua data</option></select></div>' +
      '<span class="info" id="infoJumlah"></span>' +
    '</div>' +
    '<div class="table-wrap"><table class="admin-table"><thead><tr>' +
      m.kolom.map(function (k) { return '<th' + (k.t === 'angka' ? ' class="num"' : '') + '>' + UI.esc(k.l) + '</th>'; }).join('') +
      '<th style="text-align:right">Aksi</th></tr></thead><tbody id="tbodyData"></tbody></table></div>';

  // Isi opsi filter dari kolom berlencana/status pertama
  const kolomFilter = m.kolom.filter(function (k) { return k.t === 'status' || k.t === 'lencana' || k.t === 'yn'; })[0];
  const sel = document.getElementById('filterKolom');
  if (kolomFilter) {
    UI.unik(baris, kolomFilter.k).forEach(function (v) {
      sel.insertAdjacentHTML('beforeend', '<option value="' + UI.esc(v) + '">' + UI.esc(kolomFilter.l) + ': ' + UI.esc(v) + '</option>');
    });
  } else {
    sel.parentElement.style.display = 'none';
  }

  const kunciCari = m.field.filter(function (f) { return f.t === 'text' || f.t === 'teks'; }).map(function (f) { return f.k; });

  const render = function () {
    const q  = document.getElementById('filterCari').value;
    const fv = sel.value;
    const hasil = baris.filter(function (r) {
      if (fv && kolomFilter && String(r[kolomFilter.k]) !== fv) return false;
      return UI.cocok(r, kunciCari, q);
    });

    document.getElementById('infoJumlah').textContent = 'Menampilkan ' + hasil.length + ' dari ' + baris.length + ' data';
    document.getElementById('tbodyData').innerHTML = hasil.length ? hasil.map(function (r) {
      return '<tr>' + m.kolom.map(function (k) { return '<td' + (k.t === 'angka' ? ' class="num"' : '') + '>' + selKolom(r, k) + '</td>'; }).join('') +
        '<td class="aksi">' +
          '<button class="ikon-btn" data-ubah="' + UI.esc(r.ID) + '" title="Ubah">' + ICON.ubah.replace('18','15') + '</button>' +
          '<button class="ikon-btn bahaya" data-hapus="' + UI.esc(r.ID) + '" title="Hapus">' + ICON.hapus.replace('18','15') + '</button>' +
        '</td></tr>';
    }).join('') : '<tr><td colspan="' + (m.kolom.length + 1) + '">' +
      UI.kosong('Belum ada data', 'Klik "Tambah Data" untuk membuat entri pertama.') + '</td></tr>';
  };

  document.getElementById('filterCari').addEventListener('input', render);
  sel.addEventListener('change', render);
  document.getElementById('btnTambah').addEventListener('click', function () { bukaForm(id, null); });
  document.getElementById('tbodyData').addEventListener('click', function (e) {
    const u = e.target.closest('[data-ubah]');
    const h = e.target.closest('[data-hapus]');
    if (u) bukaForm(id, baris.filter(function (r) { return String(r.ID) === u.dataset.ubah; })[0]);
    if (h) hapusData(id, h.dataset.hapus);
  });
  render();
}

function selKolom(r, k) {
  const v = r[k.k];
  switch (k.t) {
    case 'gambar':   return '<div class="sel-mini">' + UI.gambar(v, r.Judul || r.Nama_Desa || r.Nama_Usaha || '?') + '</div>';
    case 'utama':    return '<strong>' + UI.esc(UI.potong(v, 60)) + '</strong>';
    case 'cuplikan': return '<span style="color:var(--text-muted);font-size:12.5px">' + UI.esc(UI.potong(v, 70)) + '</span>';
    case 'tanggal':  return UI.tanggal(v, 'pendek');
    case 'angka':    return UI.angka(v);
    case 'lencana':  return v ? '<span class="badge badge-primary">' + UI.esc(v) + '</span>' : '-';
    case 'status': {
      const s = String(v || '').toLowerCase();
      const kelas = (s === 'published' || s === 'tayang') ? 'badge-success' : 'badge-warning';
      return '<span class="badge ' + kelas + '">' + UI.esc(v || '-') + '</span>';
    }
    case 'yn':       return String(v).toUpperCase() === 'Y'
                       ? '<span class="badge badge-success">Publik</span>'
                       : '<span class="badge">Internal</span>';
    default:         return UI.esc(UI.potong(v, 40)) || '-';
  }
}

/* ==========================================================================
   8. MODAL FORMULIR
   ========================================================================== */
function bukaForm(idModul, record) {
  const m = MODUL[idModul];
  const baru = !record;
  const r = record || {};

  const kolomForm = m.field.map(function (f) {
    const nilai = r[f.k] !== undefined ? r[f.k] : '';
    const gaya = f.penuh ? ' style="grid-column:1/-1"' : '';
    let kendali = '';

    switch (f.t) {
      case 'teks':
        kendali = '<textarea id="f_' + f.k + '" rows="' + (f.baris || 4) + '"' + (f.wajib ? ' required' : '') + '>' + UI.esc(nilai) + '</textarea>';
        break;
      case 'angka':
        kendali = '<input id="f_' + f.k + '" type="number" value="' + UI.esc(nilai) + '"' + (f.wajib ? ' required' : '') + '>';
        break;
      case 'tanggal':
        kendali = '<input id="f_' + f.k + '" type="date" value="' + (nilai ? UI.tanggal(nilai, 'input') : UI.tanggal(new Date(), 'input')) + '">';
        break;
      case 'pilih':
        kendali = '<select id="f_' + f.k + '"' + (f.wajib ? ' required' : '') + '>' +
          f.opsi.map(function (o) {
            return '<option value="' + UI.esc(o) + '"' + (String(nilai) === o ? ' selected' : '') + '>' + UI.esc(o) + '</option>';
          }).join('') + '</select>';
        break;
      case 'berkas':
        kendali =
          '<input type="hidden" id="f_' + f.k + '" value="' + UI.esc(nilai) + '">' +
          '<div class="dropzone" data-unggah="' + f.k + '" data-kategori="' + (f.kategori || 'umum') + '" tabindex="0" role="button">' +
            '<div class="dz-icon">' + ICON.unggah.replace('18','26') + '</div>' +
            '<p><strong>Klik untuk memilih berkas</strong> atau seret ke area ini</p>' +
            '<small>Tersimpan otomatis ke folder Google Drive kantor kecamatan</small>' +
          '</div>' +
          '<input type="file" id="file_' + f.k + '" hidden ' + (f.kategori === 'dokumen' ? 'accept="application/pdf,image/*"' : 'accept="image/*"') + '>' +
          '<div id="pratinjau_' + f.k + '" style="margin-top:.6rem">' +
            (nilai ? '<div class="file-item"><div class="fi-thumb">' + UI.gambar(nilai, f.l) + '</div>' +
              '<div class="fi-meta"><strong>Berkas tersimpan</strong><span style="word-break:break-all">' + UI.esc(UI.potong(nilai, 60)) + '</span></div>' +
              '<button type="button" data-kosongkan="' + f.k + '">' + ICON.hapus.replace('18','16') + '</button></div>' : '') +
          '</div>';
        break;
      default:
        kendali = '<input id="f_' + f.k + '" type="text" value="' + UI.esc(nilai) + '"' + (f.wajib ? ' required' : '') + '>';
    }

    return '<div class="field"' + gaya + '><label for="f_' + f.k + '">' + UI.esc(f.l) +
      (f.wajib ? ' <span class="req">*</span>' : '') + '</label>' + kendali +
      (f.bantuan ? '<span class="hint">' + UI.esc(f.bantuan) + '</span>' : '') +
      '<span class="field-error" hidden></span></div>';
  }).join('');

  const bg = document.getElementById('modalBg');
  bg.innerHTML = '<div class="modal lebar"><form id="formModal">' +
    '<div class="modal-head">' +
      '<div class="quick-icon">' + (ICON[m.ikon] || ICON.dokumen) + '</div>' +
      '<h3>' + (baru ? 'Tambah' : 'Ubah') + ' ' + UI.esc(m.label) + '</h3>' +
      '<button type="button" class="ikon-btn" id="tutupModal" aria-label="Tutup">' + ICON.silang.replace('18','16') + '</button>' +
    '</div>' +
    '<div class="modal-body"><div class="form-grid cols-2">' + kolomForm + '</div></div>' +
    '<div class="modal-foot">' +
      '<button type="button" class="btn btn-outline" id="batalModal">Batal</button>' +
      '<button type="submit" class="btn btn-primary" id="simpanModal">' + ICON.simpan.replace('18','16') + ' Simpan Data</button>' +
    '</div>' +
  '</form></div>';
  bg.classList.add('open');

  const tutup = function () { bg.classList.remove('open'); bg.innerHTML = ''; };
  document.getElementById('tutupModal').addEventListener('click', tutup);
  document.getElementById('batalModal').addEventListener('click', tutup);
  bg.addEventListener('click', function (e) { if (e.target === bg) tutup(); });

  /* ---- Unggah berkas ---- */
  bg.querySelectorAll('[data-unggah]').forEach(function (dz) {
    const kunci = dz.dataset.unggah;
    const inp = document.getElementById('file_' + kunci);
    const proses = async function (file) {
      if (!file) return;
      if (ADMIN.demo) {
        UI.notif('Mode contoh: unggahan berkas dinonaktifkan.', 'error');
        return;
      }
      UI.muat(true);
      try {
        const berkas = await API.bacaBerkas(file);
        const hasil = await API.post('uploadFile', {
          kategori: dz.dataset.kategori, namaFile: berkas.namaFile,
          mimeType: berkas.mimeType, base64: berkas.base64
        }, ADMIN.token);
        if (!hasil.success) throw new Error(hasil.message);
        document.getElementById('f_' + kunci).value = hasil.url;
        const ukuranEl = document.getElementById('f_Ukuran');
        if (ukuranEl && !ukuranEl.value) ukuranEl.value = UI.ukuranBerkas(hasil.ukuran);
        document.getElementById('pratinjau_' + kunci).innerHTML =
          '<div class="file-item"><div class="fi-thumb">' + UI.gambar(hasil.url, hasil.nama) + '</div>' +
          '<div class="fi-meta"><strong>' + UI.esc(hasil.nama) + '</strong><span>' + UI.ukuranBerkas(hasil.ukuran) + ' · tersimpan di Drive</span></div>' +
          '<button type="button" data-kosongkan="' + kunci + '">' + ICON.hapus.replace('18','16') + '</button></div>';
        UI.notif('Berkas berhasil diunggah ke Google Drive.', 'success');
      } catch (err) {
        UI.notif('Gagal mengunggah: ' + err.message, 'error');
      }
      UI.muat(false);
    };
    dz.addEventListener('click', function () { inp.click(); });
    dz.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inp.click(); } });
    ['dragover', 'dragenter'].forEach(function (ev) { dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.add('drag'); }); });
    ['dragleave', 'drop'].forEach(function (ev) { dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.remove('drag'); }); });
    dz.addEventListener('drop', function (e) { proses(e.dataTransfer.files[0]); });
    inp.addEventListener('change', function () { proses(inp.files[0]); inp.value = ''; });
  });

  bg.addEventListener('click', function (e) {
    const b = e.target.closest('[data-kosongkan]');
    if (!b) return;
    document.getElementById('f_' + b.dataset.kosongkan).value = '';
    document.getElementById('pratinjau_' + b.dataset.kosongkan).innerHTML = '';
  });

  /* ---- Simpan ---- */
  document.getElementById('formModal').addEventListener('submit', async function (e) {
    e.preventDefault();
    const rec = {};
    if (!baru) rec.ID = r.ID;

    let galat = null;
    m.field.forEach(function (f) {
      const el = document.getElementById('f_' + f.k);
      const nilai = el ? String(el.value).trim() : '';
      if (f.wajib && !nilai && !galat) galat = f;
      rec[f.k] = nilai;
    });
    if (galat) {
      const el = document.getElementById('f_' + galat.k);
      el.classList.add('invalid');
      const s = el.parentElement.querySelector('.field-error');
      if (s) { s.textContent = '"' + galat.l + '" wajib diisi.'; s.hidden = false; }
      el.focus();
      return;
    }

    const btn = document.getElementById('simpanModal');
    btn.disabled = true; btn.textContent = 'Menyimpan…';
    try {
      await simpanData(idModul, rec, baru);
      tutup();
      gambarSidebar();
      bukaModul(idModul);
      UI.notif(baru ? 'Data berhasil ditambahkan.' : 'Perubahan berhasil disimpan.', 'success');
    } catch (err) {
      UI.notif('Gagal menyimpan: ' + err.message, 'error');
      btn.disabled = false;
      btn.innerHTML = ICON.simpan.replace('18','16') + ' Simpan Data';
    }
  });
}

async function simpanData(idModul, rec, baru) {
  const m = MODUL[idModul];

  if (ADMIN.demo) {
    const arr = ADMIN.data[m.sheet] = ADMIN.data[m.sheet] || [];
    if (baru) {
      rec.ID = m.sheet.substring(0, 3).toUpperCase() + '-' + Date.now().toString(36).toUpperCase();
      arr.unshift(rec);
    } else {
      const i = arr.findIndex(function (x) { return String(x.ID) === String(rec.ID); });
      if (i > -1) arr[i] = Object.assign({}, arr[i], rec);
    }
    UI.notif('Mode contoh: perubahan hanya tersimpan di browser ini.', 'info');
    return;
  }

  const hasil = await API.post('saveRecord', { sheet: m.sheet, record: rec }, ADMIN.token);
  if (!hasil.success) throw new Error(hasil.message);
  await muatData();
}

async function hapusData(idModul, id) {
  const m = MODUL[idModul];
  if (!confirm('Hapus data ini secara permanen? Tindakan ini tidak dapat dibatalkan.')) return;

  UI.muat(true);
  try {
    if (ADMIN.demo) {
      ADMIN.data[m.sheet] = (ADMIN.data[m.sheet] || []).filter(function (x) { return String(x.ID) !== String(id); });
    } else {
      const hasil = await API.post('deleteRecord', { sheet: m.sheet, id: id }, ADMIN.token);
      if (!hasil.success) throw new Error(hasil.message);
      await muatData();
    }
    gambarSidebar();
    bukaModul(idModul);
    UI.notif('Data berhasil dihapus.', 'success');
  } catch (err) {
    UI.notif('Gagal menghapus: ' + err.message, 'error');
  }
  UI.muat(false);
}

/* ==========================================================================
   9. KELOLA PENGADUAN
   ========================================================================== */
function gambarPengaduan() {
  const m = MODUL.pengaduan;
  const semua = (ADMIN.data.Pengaduan || []).slice().sort(function (a, b) {
    return new Date(b.Tanggal_Kirim) - new Date(a.Tanggal_Kirim);
  });
  const rendah = function (v) { return String(v || '').toLowerCase(); };

  document.getElementById('adminBody').innerHTML =
    '<div class="modul-head"><div><h1>' + UI.esc(m.judul) + '</h1><p>' + UI.esc(m.deskripsi) + '</p></div></div>' +

    '<div class="kpi-grid">' +
      '<div class="kpi kpi-primary"><div class="ico">' + ICON.inbox + '</div><div class="lbl">Total Laporan Masuk</div>' +
        '<div class="val num">' + UI.angka(semua.length) + '</div><div class="sub">seluruh periode</div></div>' +
      '<div class="kpi kpi-warning"><div class="ico">' + ICON.peringatan + '</div><div class="lbl">Menunggu Verifikasi</div>' +
        '<div class="val num">' + semua.filter(function (a) { return rendah(a.Status_Tindak_Lanjut).indexOf('menunggu') > -1; }).length + '</div>' +
        '<div class="sub">perlu tindakan admin</div></div>' +
      '<div class="kpi kpi-info"><div class="ico">' + ICON.segar + '</div><div class="lbl">Sedang Ditangani</div>' +
        '<div class="val num">' + semua.filter(function (a) { return rendah(a.Status_Tindak_Lanjut).indexOf('proses') > -1 || rendah(a.Status_Tindak_Lanjut).indexOf('lapangan') > -1; }).length + '</div>' +
        '<div class="sub">disposisi seksi terkait</div></div>' +
      '<div class="kpi kpi-success"><div class="ico">' + ICON.ceklis + '</div><div class="lbl">Selesai / Ditutup</div>' +
        '<div class="val num">' + semua.filter(function (a) { return rendah(a.Status_Tindak_Lanjut).indexOf('selesai') > -1; }).length + '</div>' +
        '<div class="sub">terverifikasi tuntas</div></div>' +
    '</div>' +

    '<div class="toolbar">' +
      '<div class="grow"><input id="filterCari" type="search" placeholder="Cari nomor tiket, nama pelapor, atau isi aduan…"></div>' +
      '<div style="width:200px"><select id="aduanStatus"><option value="">Semua Status</option>' +
        STATUS_ADUAN.map(function (s) { return '<option value="' + UI.esc(s) + '">' + UI.esc(s) + '</option>'; }).join('') + '</select></div>' +
      '<div style="width:180px"><select id="aduanDesa"><option value="">Semua Desa</option>' +
        UI.unik(semua, 'Desa').map(function (d) { return '<option value="' + UI.esc(d) + '">' + UI.esc(d) + '</option>'; }).join('') + '</select></div>' +
      '<span class="info" id="aduanInfo"></span>' +
    '</div>' +

    '<div class="aduan-layout">' +
      '<div class="table-wrap"><table class="admin-table"><thead><tr>' +
        '<th>Tiket &amp; Waktu</th><th>Pelapor &amp; Desa</th><th>Subjek / Masalah</th><th>Status Posisi</th><th></th>' +
      '</tr></thead><tbody id="aduanTbody"></tbody></table></div>' +
      '<div class="card aduan-detail" id="aduanDetail"></div>' +
    '</div>';

  const render = function () {
    const q = document.getElementById('filterCari').value;
    const st = document.getElementById('aduanStatus').value;
    const ds = document.getElementById('aduanDesa').value;

    const hasil = semua.filter(function (a) {
      if (st && a.Status_Tindak_Lanjut !== st) return false;
      if (ds && a.Desa !== ds) return false;
      return UI.cocok(a, ['Nomor_Tiket', 'Nama_Pelapor', 'Judul', 'Isi_Aduan', 'Kategori'], q);
    });

    document.getElementById('aduanInfo').textContent = 'Menampilkan ' + hasil.length + ' dari ' + semua.length + ' tiket';
    document.getElementById('aduanTbody').innerHTML = hasil.length ? hasil.map(function (a) {
      const terpilih = ADMIN.aduanTerpilih && ADMIN.aduanTerpilih.ID === a.ID;
      return '<tr class="' + (terpilih ? 'terpilih' : '') + '" data-pilih="' + UI.esc(a.ID) + '" style="cursor:pointer">' +
        '<td><strong>' + UI.esc(a.Nomor_Tiket) + '</strong><br>' +
          '<span style="font-size:11.5px;color:var(--text-muted)">' + UI.tanggal(a.Tanggal_Kirim, 'pendek') + ', ' + UI.waktu(a.Tanggal_Kirim) + ' WITA</span></td>' +
        '<td>' + UI.esc(a.Nama_Pelapor) + '<br><span style="font-size:11.5px;color:var(--text-muted)">' + UI.esc(a.Kontak || '-') + '<br>Desa ' + UI.esc(a.Desa) + '</span></td>' +
        '<td><span class="badge badge-primary" style="margin-bottom:.3rem">' + UI.esc(a.Kategori || 'Umum') + '</span><br>' +
          '<strong style="font-size:13px">' + UI.esc(UI.potong(a.Judul, 46)) + '</strong><br>' +
          '<span style="font-size:11.5px;color:var(--text-muted)">' + UI.esc(UI.potong(a.Isi_Aduan, 54)) + '</span></td>' +
        '<td><span class="badge ' + UI.kelasStatus(a.Status_Tindak_Lanjut) + '">' + UI.esc(a.Status_Tindak_Lanjut) + '</span><br>' +
          '<span style="font-size:11.5px;color:var(--text-muted)">' + UI.esc(a.Disposisi || 'Belum didisposisi') + '</span></td>' +
        '<td class="aksi"><button class="ikon-btn bahaya" data-hapusAduan="' + UI.esc(a.ID) + '" title="Hapus">' + ICON.hapus.replace('18','15') + '</button></td>' +
      '</tr>';
    }).join('') : '<tr><td colspan="5">' + UI.kosong('Tidak ada pengaduan', 'Belum ada laporan yang cocok dengan filter.') + '</td></tr>';

    gambarDetailAduan();
  };

  ['filterCari', 'aduanStatus', 'aduanDesa'].forEach(function (id) {
    const el = document.getElementById(id);
    el.addEventListener('input', render);
    el.addEventListener('change', render);
  });

  document.getElementById('aduanTbody').addEventListener('click', function (e) {
    const h = e.target.closest('[data-hapusAduan]');
    if (h) {
      e.stopPropagation();
      hapusAduan(h.getAttribute('data-hapusAduan'));
      return;
    }
    const tr = e.target.closest('[data-pilih]');
    if (!tr) return;
    ADMIN.aduanTerpilih = semua.filter(function (a) { return String(a.ID) === tr.dataset.pilih; })[0];
    render();
  });

  if (!ADMIN.aduanTerpilih && semua.length) ADMIN.aduanTerpilih = semua[0];
  render();
}

function gambarDetailAduan() {
  const el = document.getElementById('aduanDetail');
  const a = ADMIN.aduanTerpilih;
  if (!el) return;

  if (!a) {
    el.innerHTML = UI.kosong('Pilih satu tiket', 'Klik salah satu baris pengaduan untuk melihat rincian dan menindaklanjuti.');
    return;
  }

  const lampiran = String(a.Link_Foto_Bukti || '').split('|').map(function (s) { return s.trim(); }).filter(Boolean);

  el.innerHTML =
    '<div class="kepala">' +
      '<span class="badge badge-accent" style="margin-bottom:.5rem">Tiket Terpilih</span>' +
      '<div class="tiket">' + UI.esc(a.Nomor_Tiket) + '</div>' +
      '<div class="sub">Diterima via Form Publik · ' + UI.tanggal(a.Tanggal_Kirim, 'panjang') + ' · ' + UI.waktu(a.Tanggal_Kirim) + ' WITA</div>' +
    '</div>' +
    '<div class="isi">' +

      '<div><div class="blok-label">Identitas Pelapor</div>' +
        '<div style="display:flex;align-items:center;gap:.7rem">' +
          '<span class="avatar">' + UI.esc(String(a.Nama_Pelapor || 'A').split(/\s+/).slice(0,2).map(function (w) { return w[0]; }).join('').toUpperCase()) + '</span>' +
          '<div><strong style="display:block;font-size:14px">' + UI.esc(a.Nama_Pelapor) + '</strong>' +
          '<span style="font-size:12px;color:var(--text-muted)">Desa ' + UI.esc(a.Desa) + ' · ' + UI.esc(a.Alamat_Kejadian || '-') + '</span></div>' +
        '</div>' +
        (a.Kontak ? '<a class="btn btn-secondary btn-sm btn-block" style="margin-top:.7rem" target="_blank" rel="noopener" ' +
          'href="https://wa.me/' + UI.esc(normalWa(a.Kontak)) + '">' + ICON.wa.replace('18','15') + ' Hubungi via WhatsApp (' + UI.esc(a.Kontak) + ')</a>' : '') +
      '</div>' +

      '<div><div class="blok-label">Uraian Pengaduan Warga</div>' +
        '<span class="badge badge-primary" style="margin-bottom:.45rem">' + UI.esc(a.Kategori || 'Umum') + '</span>' +
        '<h3 style="font-size:16px;margin:.25rem 0 .5rem">' + UI.esc(a.Judul) + '</h3>' +
        '<div class="kutipan">“' + UI.esc(a.Isi_Aduan) + '”</div>' +
      '</div>' +

      (lampiran.length ? '<div><div class="blok-label">Lampiran Bukti (' + lampiran.length + ')</div>' +
        '<div class="lampiran-grid">' + lampiran.map(function (u, i) {
          return '<a href="' + UI.esc(u) + '" target="_blank" rel="noopener">' + UI.gambar(u, 'Bukti ' + (i + 1)) + '</a>';
        }).join('') + '</div></div>' : '') +

      '<div><div class="blok-label">Riwayat & Log Penanganan</div>' +
        '<ul class="timeline">' +
          '<li><strong>Pengaduan berhasil masuk</strong><span>' + UI.tanggal(a.Tanggal_Kirim, 'pendek') + ', ' + UI.waktu(a.Tanggal_Kirim) + ' · via Web Form Publik</span></li>' +
          (a.Disposisi ? '<li><strong>Didisposisikan ke ' + UI.esc(a.Disposisi) + '</strong><span>Oleh ' + UI.esc((ADMIN.user && ADMIN.user.nama) || 'Admin') + '</span></li>' : '') +
          '<li><strong>Status saat ini: ' + UI.esc(a.Status_Tindak_Lanjut) + '</strong><span>Diperbarui ' + UI.relatif(a.Updated_At || a.Tanggal_Kirim) + '</span></li>' +
        '</ul>' +
      '</div>' +

      '<form id="formAduan" style="border-top:1px solid var(--border);padding-top:1rem">' +
        '<div class="blok-label">' + ICON.ubah.replace('18','12') + ' Formulir Tindak Lanjut Admin</div>' +
        '<div class="form-grid cols-2" style="gap:.75rem">' +
          '<div class="field"><label for="aStatus">Ubah Status</label><select id="aStatus">' +
            STATUS_ADUAN.map(function (s) {
              return '<option value="' + UI.esc(s) + '"' + (a.Status_Tindak_Lanjut === s ? ' selected' : '') + '>' + UI.esc(s) + '</option>';
            }).join('') + '</select></div>' +
          '<div class="field"><label for="aDisposisi">Disposisi Ke</label><select id="aDisposisi">' +
            DISPOSISI.map(function (s) {
              return '<option value="' + UI.esc(s) + '"' + (String(a.Disposisi || '') === s ? ' selected' : '') + '>' + (s || '— Belum didisposisi —') + '</option>';
            }).join('') + '</select></div>' +
          '<div class="field" style="grid-column:1/-1"><label for="aCatatan">Catatan Internal Staf</label>' +
            '<textarea id="aCatatan" rows="4" placeholder="Contoh: Telah dikoordinasikan via telepon dengan Sekdes. Tim Linmas akan memasang rambu peringatan.">' + UI.esc(a.Catatan_Admin || '') + '</textarea>' +
            '<span class="hint">Catatan ini bersifat internal dan tidak ditampilkan kepada warga.</span></div>' +
        '</div>' +
        '<button class="btn btn-primary btn-block" style="margin-top:.85rem" type="submit" id="btnSimpanAduan">' +
          ICON.simpan.replace('18','16') + ' Simpan & Perbarui Tiket</button>' +
      '</form>' +
    '</div>';

  document.getElementById('formAduan').addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = document.getElementById('btnSimpanAduan');
    btn.disabled = true; btn.textContent = 'Menyimpan…';
    const muatan = {
      ID: a.ID,
      Status_Tindak_Lanjut: document.getElementById('aStatus').value,
      Disposisi: document.getElementById('aDisposisi').value,
      Catatan_Admin: document.getElementById('aCatatan').value
    };
    try {
      if (ADMIN.demo) {
        Object.assign(a, muatan, { Updated_At: new Date().toISOString() });
        UI.notif('Mode contoh: perubahan hanya tersimpan di browser ini.', 'info');
      } else {
        const hasil = await API.post('updatePengaduan', muatan, ADMIN.token);
        if (!hasil.success) throw new Error(hasil.message);
        await muatData();
        ADMIN.aduanTerpilih = (ADMIN.data.Pengaduan || []).filter(function (x) { return String(x.ID) === String(a.ID); })[0] || null;
        UI.notif('Tindak lanjut pengaduan tersimpan.', 'success');
      }
      gambarSidebar();
      gambarPengaduan();
    } catch (err) {
      UI.notif('Gagal menyimpan: ' + err.message, 'error');
      btn.disabled = false;
      btn.innerHTML = ICON.simpan.replace('18','16') + ' Simpan & Perbarui Tiket';
    }
  });
}

function normalWa(nomor) {
  let n = String(nomor || '').replace(/[^0-9]/g, '');
  if (n.indexOf('0') === 0) n = '62' + n.slice(1);
  return n;
}

async function hapusAduan(id) {
  if (!confirm('Hapus tiket pengaduan ini secara permanen?')) return;
  UI.muat(true);
  try {
    if (ADMIN.demo) {
      ADMIN.data.Pengaduan = (ADMIN.data.Pengaduan || []).filter(function (x) { return String(x.ID) !== String(id); });
    } else {
      const hasil = await API.post('deletePengaduan', { id: id }, ADMIN.token);
      if (!hasil.success) throw new Error(hasil.message);
      await muatData();
    }
    if (ADMIN.aduanTerpilih && String(ADMIN.aduanTerpilih.ID) === String(id)) ADMIN.aduanTerpilih = null;
    gambarSidebar();
    gambarPengaduan();
    UI.notif('Tiket pengaduan dihapus.', 'success');
  } catch (err) {
    UI.notif('Gagal menghapus: ' + err.message, 'error');
  }
  UI.muat(false);
}

/* ==========================================================================
   10. PENGATURAN SITUS
   ========================================================================== */
function gambarPengaturan() {
  const baris = ADMIN.data.Pengaturan_Situs || [];

  document.getElementById('adminBody').innerHTML =
    '<div class="modul-head"><div><h1>Pengaturan Situs</h1>' +
      '<p>Identitas kecamatan yang tampil pada header, footer, halaman kontak, dan peta situs publik.</p></div></div>' +
    '<div class="card card-pad"><form id="formSetting">' +
      (baris.length ? baris.map(function (r) {
        return '<div class="setting-row"><div class="ket"><strong>' + UI.esc(r.key) + '</strong>' +
          '<span>' + UI.esc(r.keterangan || '') + '</span></div>' +
          '<div class="field"><input data-key="' + UI.esc(r.key) + '" type="text" value="' + UI.esc(r.value) + '"></div></div>';
      }).join('') : UI.kosong('Pengaturan belum tersedia', 'Sheet Pengaturan_Situs masih kosong.')) +
      (baris.length ? '<div style="display:flex;justify-content:flex-end;margin-top:1.25rem">' +
        '<button class="btn btn-primary" type="submit" id="btnSimpanSetting">' + ICON.simpan.replace('18','16') + ' Simpan Semua Pengaturan</button></div>' : '') +
    '</form></div>';

  const form = document.getElementById('formSetting');
  if (!baris.length) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = document.getElementById('btnSimpanSetting');
    btn.disabled = true; btn.textContent = 'Menyimpan…';
    try {
      const input = form.querySelectorAll('[data-key]');
      for (let i = 0; i < input.length; i++) {
        const k = input[i].dataset.key, v = input[i].value;
        if (ADMIN.demo) {
          const r = baris.filter(function (x) { return x.key === k; })[0];
          if (r) r.value = v;
        } else {
          const hasil = await API.post('saveRecord', {
            sheet: 'Pengaturan_Situs', record: { key: k, value: v }
          }, ADMIN.token);
          if (!hasil.success) throw new Error(hasil.message);
        }
      }
      if (!ADMIN.demo) await muatData();
      UI.notif(ADMIN.demo ? 'Mode contoh: perubahan tidak tersimpan permanen.' : 'Pengaturan situs berhasil disimpan.',
               ADMIN.demo ? 'info' : 'success');
    } catch (err) {
      UI.notif('Gagal menyimpan: ' + err.message, 'error');
    }
    btn.disabled = false;
    btn.innerHTML = ICON.simpan.replace('18','16') + ' Simpan Semua Pengaturan';
  });
}

/* ==========================================================================
   11. PENGATURAN AKUN
   ========================================================================== */
function gambarAkun() {
  const u = ADMIN.user || {};
  document.getElementById('adminBody').innerHTML =
    '<div class="modul-head"><div><h1>Pengaturan Akun</h1>' +
      '<p>Perbarui identitas dan kata sandi akun administrator. Password disimpan dalam bentuk hash SHA-256 bersalt.</p></div></div>' +
    '<div class="grid" style="grid-template-columns:minmax(0,1fr) 340px;gap:1.25rem;align-items:start">' +
      '<div class="card card-pad"><form id="formAkun">' +
        '<div class="form-grid cols-2">' +
          '<div class="field"><label for="aNama">Nama Lengkap</label><input id="aNama" type="text" value="' + UI.esc(u.nama || '') + '"></div>' +
          '<div class="field"><label for="aJabatan">Jabatan</label><input id="aJabatan" type="text" value="' + UI.esc(u.jabatan || '') + '"></div>' +
          '<div class="field" style="grid-column:1/-1"><label for="aLama">Password Lama <span class="req">*</span></label>' +
            '<input id="aLama" type="password" autocomplete="current-password" required></div>' +
          '<div class="field"><label for="aBaru">Password Baru <span class="req">*</span></label>' +
            '<input id="aBaru" type="password" autocomplete="new-password" required minlength="6"></div>' +
          '<div class="field"><label for="aUlang">Ulangi Password Baru <span class="req">*</span></label>' +
            '<input id="aUlang" type="password" autocomplete="new-password" required minlength="6"></div>' +
        '</div>' +
        '<div class="field-error" id="akunError" hidden style="margin-top:.75rem"></div>' +
        '<div style="display:flex;justify-content:flex-end;margin-top:1.25rem">' +
          '<button class="btn btn-primary" type="submit" id="btnSimpanAkun">' + ICON.simpan.replace('18','16') + ' Perbarui Akun</button></div>' +
      '</form></div>' +
      '<div class="card card-pad">' +
        '<h3 style="font-size:16px">Keamanan Akun</h3>' +
        '<ul style="padding-left:1.1rem;font-size:13.5px;color:var(--text-soft);line-height:1.9">' +
          '<li>Gunakan minimal 8 karakter dengan kombinasi huruf dan angka.</li>' +
          '<li>Jangan bagikan akun kepada pihak di luar staf kecamatan.</li>' +
          '<li>Sesi berakhir otomatis setelah 6 jam tidak aktif.</li>' +
          '<li>Segera ganti password bawaan <code>admin123</code> setelah instalasi.</li>' +
        '</ul>' +
        '<div class="banner banner-info" style="margin-top:1rem">' + ICON.info +
          '<div><strong>Menambah akun admin baru</strong>Tambahkan baris pada sheet <code>Admin_Users</code>, lalu gunakan menu ini untuk mengganti password akun tersebut.</div></div>' +
      '</div>' +
    '</div>';

  document.getElementById('formAkun').addEventListener('submit', async function (e) {
    e.preventDefault();
    const err = document.getElementById('akunError');
    err.hidden = true;
    const baru = document.getElementById('aBaru').value;
    if (baru !== document.getElementById('aUlang').value) {
      err.textContent = 'Konfirmasi password baru tidak sama.';
      err.hidden = false;
      return;
    }
    if (ADMIN.demo) {
      UI.notif('Mode contoh: perubahan akun tidak tersimpan.', 'info');
      return;
    }
    const btn = document.getElementById('btnSimpanAkun');
    btn.disabled = true; btn.textContent = 'Menyimpan…';
    try {
      const hasil = await API.post('changePassword', {
        passwordLama: document.getElementById('aLama').value,
        passwordBaru: baru,
        nama: document.getElementById('aNama').value,
        jabatan: document.getElementById('aJabatan').value
      }, ADMIN.token);
      if (!hasil.success) throw new Error(hasil.message);
      UI.notif('Akun berhasil diperbarui. Gunakan password baru pada login berikutnya.', 'success');
      document.getElementById('formAkun').reset();
    } catch (ex) {
      err.textContent = ex.message;
      err.hidden = false;
    }
    btn.disabled = false;
    btn.innerHTML = ICON.simpan.replace('18','16') + ' Perbarui Akun';
  });
}

/* ==========================================================================
   12. MULAI
   ========================================================================== */
document.addEventListener('DOMContentLoaded', async function () {
  UI.muat(true);
  let masuk = false;
  try { masuk = await AUTH.pulihkan(); } catch (e) {}
  UI.muat(false);
  if (masuk) { await mulaiPanel(); } else { tampilLogin(''); }
});
