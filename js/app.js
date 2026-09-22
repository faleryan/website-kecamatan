/* ==========================================================================
   APLIKASI UTAMA — pemuatan data, kerangka halaman, dan perutean hash
   ========================================================================== */

let DATA = {};

/* Daftar menu navigasi utama */
const MENU = [
  { id: 'beranda',    label: 'Beranda' },
  { id: 'profil',     label: 'Profil Kecamatan' },
  { id: 'wilayah',    label: 'Data Wilayah & Desa' },
  { id: 'desa',       label: 'Data Desa', sembunyiDesktop: true },
  { id: 'statistik',  label: 'Statistik Penduduk' },
  { id: 'pengumuman', label: 'Layanan & Pengumuman' },
  { id: 'umkm',       label: 'UMKM & Potensi' },
  { id: 'berita',     label: 'Berita & Agenda' },
  { id: 'agenda',     label: 'Agenda', sembunyiDesktop: true },
  { id: 'galeri',     label: 'Galeri', sembunyiDesktop: true },
  { id: 'dokumen',    label: 'Dokumen', sembunyiDesktop: true }
];

/* ==========================================================================
   PERUTEAN
   ========================================================================== */
const ROUTER = {

  /** Membaca hash menjadi { nama, id, params }. */
  baca() {
    const hash = (location.hash || '#/beranda').replace(/^#\/?/, '');
    const [jalur, kueri] = hash.split('?');
    const bagian = jalur.split('/').filter(Boolean);
    const params = {};
    new URLSearchParams(kueri || '').forEach(function (v, k) { params[k] = v; });
    return { nama: bagian[0] || 'beranda', id: bagian[1] ? decodeURIComponent(bagian[1]) : null, params: params };
  },

  render() {
    const rute = this.baca();
    const konten = document.getElementById('konten');
    let hasil;

    try {
      if (rute.nama === 'berita' && rute.id) {
        hasil = PAGES.beritaDetail(rute.id);
      } else if (typeof PAGES[rute.nama] === 'function') {
        hasil = PAGES[rute.nama](rute.params);
      } else {
        hasil = {
          html: '<section class="section"><div class="wrap">' +
            UI.kosong('Halaman tidak ditemukan', 'Tautan yang Anda buka tidak tersedia pada portal ini.') +
            '<div style="text-align:center"><a class="btn btn-primary" href="#/beranda">Kembali ke Beranda</a></div></div></section>'
        };
      }
    } catch (err) {
      console.error('[ROUTER]', err);
      hasil = {
        html: '<section class="section"><div class="wrap"><div class="banner banner-warning">' + ICON.peringatan +
          '<div><strong>Terjadi kesalahan saat menampilkan halaman</strong>' + UI.esc(err.message) + '</div></div></div></section>'
      };
    }

    konten.innerHTML = hasil.html;
    if (typeof hasil.init === 'function') hasil.init();

    // Tandai menu aktif
    document.querySelectorAll('.main-nav a').forEach(function (a) {
      a.classList.toggle('active', a.dataset.id === rute.nama);
    });
    document.getElementById('mainNav').classList.remove('open');

    // Perbarui judul dokumen
    const menu = MENU.filter(function (m) { return m.id === rute.nama; })[0];
    const namaSitus = (DATA.Pengaturan_Situs && DATA.Pengaturan_Situs.nama_kecamatan) || APP_CONFIG.SITUS.nama_kecamatan;
    document.title = (menu ? menu.label + ' — ' : '') + 'Portal Resmi ' + namaSitus;

    if (rute.nama !== 'beranda') window.scrollTo({ top: 0 });
  }
};

/* ==========================================================================
   KERANGKA HALAMAN
   ========================================================================== */
const SHELL = {

  render() {
    const set = DATA.Pengaturan_Situs || APP_CONFIG.SITUS;

    /* ---- Topbar ---- */
    document.getElementById('topbar').innerHTML = '<div class="wrap">' +
      '<div class="topbar-left">' +
        '<span class="topbar-item">' + ICON.jam.replace('18','13') + ' ' + UI.esc(set.jam_layanan || '') + '</span>' +
        '<span class="topbar-item">' + ICON.wa.replace('18','13') + ' Aduan/Warga: +' + UI.esc(set.whatsapp || '') + '</span>' +
      '</div>' +
      '<div class="topbar-right">' +
        '<button id="btnKontras" title="Ubah mode kontras tinggi">' + ICON.perisai.replace('18','13') + ' Kontras Tinggi</button>' +
        '<a class="topbar-item" href="admin.html">' + ICON.kunci.replace('18','13') + ' Portal Admin</a>' +
      '</div>' +
    '</div>';

    /* ---- Header ---- */
    document.getElementById('header').innerHTML = '<div class="wrap">' +
      '<a class="brand" href="#/beranda">' +
        '<span class="brand-mark">' + ICON.gedung.replace('18','22') + '</span>' +
        '<span class="brand-text"><strong>' + UI.esc(set.nama_kecamatan || '') + '</strong>' +
        '<span>' + UI.esc(set.nama_kabupaten || '') + '</span></span>' +
      '</a>' +
      '<nav class="main-nav" id="mainNav" aria-label="Navigasi utama">' +
        MENU.filter(function (m) { return !m.sembunyiDesktop; }).map(function (m) {
          return '<a href="#/' + m.id + '" data-id="' + m.id + '">' + m.label + '</a>';
        }).join('') +
      '</nav>' +
      '<div class="header-cta">' +
        '<a class="btn btn-primary btn-sm" href="#/pengaduan">' + ICON.aduan.replace('18','15') +
          '<span class="btn-label">Layanan Pengaduan</span></a>' +
        '<button class="nav-toggle" id="navToggle" aria-label="Buka menu navigasi" aria-expanded="false">' + ICON.menu + '</button>' +
      '</div>' +
    '</div>';

    /* ---- Ticker pengumuman ---- */
    const tayang = (DATA.Pengumuman || []).filter(function (p) {
      return String(p.Status || 'Tayang').toLowerCase() === 'tayang';
    });
    const isiTicker = tayang.length
      ? tayang.map(function (p) { return '<span>' + UI.esc(p.Judul) + '</span>'; }).join('')
      : '<span>Selamat datang di portal resmi pemerintah kecamatan.</span>';

    document.getElementById('ticker').innerHTML = '<div class="wrap">' +
      '<span class="ticker-badge">Pengumuman Resmi</span>' +
      '<div class="ticker-viewport"><div class="ticker-track">' + isiTicker + isiTicker + '</div></div>' +
    '</div>';

    /* ---- Footer ---- */
    document.getElementById('footer').innerHTML = '<div class="wrap">' +
      '<div class="footer-grid">' +
        '<div>' +
          '<div class="footer-brand"><span class="brand-mark">' + ICON.gedung.replace('18','20') + '</span>' +
          '<strong>' + UI.esc(set.nama_kecamatan || '') + '</strong></div>' +
          '<p>Pemerintah ' + UI.esc(set.nama_kabupaten || '') + '. Melayani masyarakat dengan transparan, akuntabel, dan berkeadilan.</p>' +
          '<ul class="footer-contact" style="margin-top:1rem">' +
            '<li>' + ICON.pin.replace('18','15') + '<span>' + UI.esc(set.alamat || '') + '</span></li>' +
            '<li>' + ICON.jam.replace('18','15') + '<span>' + UI.esc(set.jam_layanan || '') + '</span></li>' +
          '</ul>' +
        '</div>' +
        '<div><h4>Tautan Cepat</h4><ul>' +
          '<li><a href="#/profil">Profil & Visi Misi</a></li>' +
          '<li><a href="#/wilayah">Data Wilayah & Desa</a></li>' +
          '<li><a href="#/statistik">Statistik & Demografi</a></li>' +
          '<li><a href="#/dokumen">Regulasi & Transparansi Anggaran</a></li>' +
          '<li><a href="#/galeri">Galeri Dokumentasi</a></li>' +
        '</ul></div>' +
        '<div><h4>Layanan Publik</h4><ul>' +
          '<li><a href="#/pengaduan">Formulir Pengaduan Warga</a></li>' +
          '<li><a href="#/pengumuman">Pengumuman Resmi</a></li>' +
          '<li><a href="#/agenda">Agenda Kegiatan Kecamatan</a></li>' +
          '<li><a href="#/umkm">Direktori UMKM & Potensi</a></li>' +
          '<li><a href="#/berita">Berita Kecamatan</a></li>' +
        '</ul></div>' +
        '<div><h4>Kontak & Lokasi</h4><ul class="footer-contact">' +
          '<li>' + ICON.telepon.replace('18','15') + '<span>' + UI.esc(set.telepon || '') + '</span></li>' +
          '<li>' + ICON.surel.replace('18','15') + '<span>' + UI.esc(set.email || '') + '</span></li>' +
          '<li>' + ICON.wa.replace('18','15') + '<a href="https://wa.me/' + UI.esc(set.whatsapp || '') + '" target="_blank" rel="noopener">WhatsApp Layanan Warga</a></li>' +
          '<li>' + ICON.peta.replace('18','15') + '<a href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(set.alamat || '') + '" target="_blank" rel="noopener">Buka Peta Lokasi Kantor</a></li>' +
        '</ul></div>' +
      '</div>' +
      '<div class="footer-bottom">' +
        '<span>© ' + new Date().getFullYear() + ' Pemerintah ' + UI.esc(set.nama_kecamatan || '') + '. ' + UI.esc(set.footer_catatan || '') + '</span>' +
        '<span>Hak Cipta Dilindungi Undang-Undang</span>' +
      '</div>' +
    '</div>';

    /* ---- Interaksi kerangka ---- */
    const toggle = document.getElementById('navToggle');
    const nav = document.getElementById('mainNav');
    toggle.addEventListener('click', function () {
      const buka = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', buka ? 'true' : 'false');
    });

    const btnKontras = document.getElementById('btnKontras');
    if (localStorage.getItem('kontrasTinggi') === '1') document.body.classList.add('kontras-tinggi');
    btnKontras.addEventListener('click', function () {
      const aktif = document.body.classList.toggle('kontras-tinggi');
      try { localStorage.setItem('kontrasTinggi', aktif ? '1' : '0'); } catch (e) {}
      UI.notif(aktif ? 'Mode kontras tinggi diaktifkan.' : 'Mode kontras tinggi dimatikan.', 'info');
    });
  },

  /** Pita pemberitahuan bila situs berjalan tanpa backend. */
  bilahMode() {
    if (API.mode !== 'demo') return;
    const el = document.getElementById('bilahMode');
    el.innerHTML = '<div class="wrap" style="padding-block:.6rem">' +
      '<div class="banner banner-warning">' + ICON.peringatan +
      '<div><strong>Situs berjalan dalam mode contoh</strong>' +
      'Data yang tampil adalah data contoh bawaan. Isi <code>GAS_URL</code> pada berkas <code>js/config.js</code> ' +
      'dengan URL Web App Google Apps Script Anda, lalu unggah ulang, agar situs membaca data asli dari Google Sheets.</div></div></div>';
  }
};

/* ==========================================================================
   INISIALISASI
   ========================================================================== */
async function mulai() {
  UI.muat(true);
  try {
    DATA = await API.ambilDataPublik();
  } catch (err) {
    console.error(err);
    DATA = {};
    document.getElementById('konten').innerHTML =
      '<section class="section"><div class="wrap"><div class="banner banner-warning">' + ICON.peringatan +
      '<div><strong>Data tidak dapat dimuat</strong>' + UI.esc(err.message) + '</div></div></div></section>';
  }
  UI.muat(false);

  SHELL.render();
  SHELL.bilahMode();
  ROUTER.render();

  window.addEventListener('hashchange', function () { ROUTER.render(); });

  // Klik tautan ke halaman yang sedang aktif tetap menggambar ulang
  // (mis. menekan "Layanan Pengaduan" saat sudah berada di layar konfirmasi).
  document.addEventListener('click', function (e) {
    const a = e.target.closest('a[href^="#/"]');
    if (a && a.getAttribute('href') === location.hash) {
      e.preventDefault();
      ROUTER.render();
    }
  });
}

document.addEventListener('DOMContentLoaded', mulai);
