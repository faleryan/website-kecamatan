/* ==========================================================================
   HALAMAN PUBLIK — setiap fungsi mengembalikan { html, init? }
   DATA global diisi oleh app.js setelah backend/data contoh termuat.
   ========================================================================== */

const PAGES = {};

/* ---------- Pembantu bersama ---------- */
const H = {

  kepala(judul, deskripsi, crumb) {
    return '<section class="page-head"><div class="wrap">' +
      '<nav class="crumbs" aria-label="Remah roti"><a href="#/beranda">Beranda</a>' +
      '<span class="sep">›</span><span>' + UI.esc(crumb || judul) + '</span></nav>' +
      '<div class="inner"><h1>' + UI.esc(judul) + '</h1><p>' + UI.esc(deskripsi) + '</p></div>' +
      '</div></section>';
  },

  /** Total penduduk tahun terbaru pada data statistik. */
  ringkasanStatistik() {
    const rows = DATA.Statistik_Penduduk || [];
    if (!rows.length) return { tahun: '-', laki: 0, perempuan: 0, total: 0, kk: 0, perDesa: [] };

    const tahun = Math.max.apply(null, rows.map(function (r) { return Number(r.Tahun) || 0; }));
    const th = rows.filter(function (r) { return Number(r.Tahun) === tahun; });

    const jumlah = function (k) {
      return th.reduce(function (a, r) { return a + (Number(r[k]) || 0); }, 0);
    };
    const laki = jumlah('Jumlah_Laki'), perempuan = jumlah('Jumlah_Perempuan');

    return {
      tahun: tahun,
      laki: laki,
      perempuan: perempuan,
      total: laki + perempuan,
      kk: jumlah('Jumlah_KK'),
      u1: jumlah('Usia_0_14'), u2: jumlah('Usia_15_64'), u3: jumlah('Usia_65_Plus'),
      perDesa: th.map(function (r) {
        return { desa: r.Desa, total: (Number(r.Jumlah_Laki) || 0) + (Number(r.Jumlah_Perempuan) || 0) };
      }).sort(function (a, b) { return b.total - a.total; })
    };
  },

  kartuBerita(b) {
    return '<a class="card card-link news-card" href="#/berita/' + encodeURIComponent(b.ID) + '">' +
      '<div class="news-thumb">' + UI.gambar(b.Foto_Cover, b.Judul) +
        '<span class="tag">' + UI.esc(b.Kategori || 'Berita') + '</span></div>' +
      '<div class="news-body">' +
        '<div class="news-meta">' + ICON.kalender.replace('18','14') + '<span>' + UI.tanggal(b.Tanggal_Publish, 'pendek') + '</span></div>' +
        '<h3>' + UI.esc(b.Judul) + '</h3>' +
        '<p>' + UI.esc(UI.potong(b.Ringkasan, 130)) + '</p>' +
        '<div class="news-foot"><span>' + UI.esc(UI.potong(b.Penulis || 'Redaksi Kecamatan', 28)) + '</span>' +
        '<span>Rincian ' + ICON.panah.replace('18','14') + '</span></div>' +
      '</div></a>';
  },

  kartuDesa(d) {
    return '<article class="card card-link">' +
      '<div style="aspect-ratio:16/10">' + UI.gambar(d.Foto, d.Nama_Desa) + '</div>' +
      '<div class="card-pad">' +
        '<span class="badge badge-primary">Desa Binaan</span>' +
        '<h3 style="font-size:17px;margin:.55rem 0 .3rem">Desa ' + UI.esc(d.Nama_Desa) + '</h3>' +
        '<p style="font-size:13px;color:var(--text-soft);margin-bottom:.75rem">' + UI.esc(UI.potong(d.Deskripsi, 110)) + '</p>' +
        '<dl class="info-list" style="font-size:13px">' +
          '<div class="info-row" style="grid-template-columns:120px 1fr;padding:.45rem 0"><dt>Kepala Desa</dt><dd>' + UI.esc(d.Kepala_Desa || '-') + '</dd></div>' +
          '<div class="info-row" style="grid-template-columns:120px 1fr;padding:.45rem 0"><dt>Penduduk</dt><dd class="num">' + UI.angka(d.Jumlah_Penduduk) + ' jiwa</dd></div>' +
          '<div class="info-row" style="grid-template-columns:120px 1fr;padding:.45rem 0"><dt>Kepala Keluarga</dt><dd class="num">' + UI.angka(d.Jumlah_KK) + ' KK</dd></div>' +
          '<div class="info-row" style="grid-template-columns:120px 1fr;padding:.45rem 0"><dt>Luas Wilayah</dt><dd>' + UI.esc(d.Luas_Wilayah || '-') + '</dd></div>' +
        '</dl>' +
      '</div></article>';
  },

  petaEmbed() {
    const koord = (DATA.Pengaturan_Situs && DATA.Pengaturan_Situs.koordinat_peta) || APP_CONFIG.SITUS.koordinat_peta;
    const bagian = String(koord).split(',');
    const lat = parseFloat(bagian[0]) || -7.9666;
    const lng = parseFloat(bagian[1]) || 112.6326;
    const d = 0.045;
    const bbox = (lng - d) + ',' + (lat - d) + ',' + (lng + d) + ',' + (lat + d);
    return '<div class="map-frame"><iframe title="Peta wilayah kecamatan" loading="lazy" ' +
      'src="https://www.openstreetmap.org/export/embed.html?bbox=' + bbox + '&layer=mapnik&marker=' + lat + ',' + lng + '"></iframe></div>';
  }
};

/* ==========================================================================
   BERANDA
   ========================================================================== */
PAGES.beranda = function () {
  const s      = H.ringkasanStatistik();
  const desa   = DATA.Data_Desa || [];
  const berita = (DATA.Berita || []).slice().sort(function (a, b) {
    return new Date(b.Tanggal_Publish) - new Date(a.Tanggal_Publish);
  });
  const umkm   = DATA.Data_UMKM || [];
  const agenda = (DATA.Agenda_Kegiatan || []).slice().sort(function (a, b) {
    return new Date(a.Tanggal) - new Date(b.Tanggal);
  });
  const set = DATA.Pengaturan_Situs || {};

  /* --- Hero: foto diatur admin lewat menu "Tampilan Beranda" --- */
  const bawaanHero = [
    { Label: 'Pusat Pemerintahan', Judul: 'Kantor Kecamatan',    Gambar: '' },
    { Label: 'Wisata & Alam',      Judul: 'Potensi Desa Binaan', Gambar: '' },
    { Label: 'Inovasi Layanan',    Judul: 'Pelayanan Terpadu',   Gambar: '' }
  ];
  const dataHero = (DATA.Tampilan_Beranda && DATA.Tampilan_Beranda.length)
    ? DATA.Tampilan_Beranda.slice()
        .filter(function (k) { return String(k.Aktif || 'Y').toUpperCase() !== 'N'; })
        .sort(function (a, b) { return (Number(a.Urutan) || 0) - (Number(b.Urutan) || 0); })
        .slice(0, 3)
    : bawaanHero;

  const kartuHero = (dataHero.length ? dataHero : bawaanHero).map(function (k) {
    return '<div class="hero-card">' +
      (k.Label ? '<span class="tag">' + UI.esc(k.Label) + '</span>' : '') +
      UI.gambar(k.Gambar, k.Judul) +
      '<span class="cap">' + UI.esc(k.Judul) + '</span></div>';
  }).join('');

  let html = '<section class="hero"><div class="wrap">' +
    '<div class="hero-grid">' +
      '<div>' +
        '<span class="hero-badge">' + ICON.perisai.replace('18','13') + ' Portal Resmi Pemerintah Kecamatan</span>' +
        '<h1>Membangun Wilayah<br>' + UI.esc((set.tagline || APP_CONFIG.SITUS.tagline).split(' ').slice(0, -1).join(' ')) +
          ' <em>' + UI.esc((set.tagline || APP_CONFIG.SITUS.tagline).split(' ').slice(-1)[0]) + '</em></h1>' +
        '<p class="lead">Akses terpadu keterbukaan informasi publik, layanan kependudukan kilat, pengaduan digital transparan, ' +
          'serta promosi produk UMKM dan potensi ' + UI.angka(desa.length) + ' desa se-kecamatan.</p>' +
        '<div class="hero-actions">' +
          '<a class="btn btn-accent" href="#/pengaduan">' + ICON.kirim.replace('18','16') + ' Kirim Pengaduan Online</a>' +
          '<a class="btn btn-ghost-light" href="#/statistik">' + ICON.grafik.replace('18','16') + ' Jelajahi Potensi Wilayah</a>' +
        '</div>' +
        '<div class="hero-stats">' +
          '<div><div class="val num">' + UI.angka(desa.length) + '</div><div class="lbl">Desa Binaan</div></div>' +
          '<div><div class="val num">' + UI.angka(s.total) + '</div><div class="lbl">Penduduk Terlayani</div></div>' +
          '<div><div class="val num">' + UI.angka(s.kk) + '</div><div class="lbl">Kepala Keluarga</div></div>' +
        '</div>' +
      '</div>' +
      '<div class="hero-cards">' + kartuHero + '</div>' +
    '</div>' +
  '</div></section>';

  /* --- Pencarian & akses cepat --- */
  const opsiDesa = desa.map(function (d) {
    return '<option value="' + UI.esc(d.Nama_Desa) + '">' + UI.esc(d.Nama_Desa) + '</option>';
  }).join('');

  html += '<div class="wrap"><div class="search-panel"><div class="search-row">' +
    '<div class="search-field">' + ICON.cari +
      '<div style="flex:1"><label for="cariGlobal">Cari Informasi</label>' +
      '<input id="cariGlobal" type="search" placeholder="Berita, desa, UMKM, dokumen…" autocomplete="off"></div></div>' +
    '<div class="search-field">' + ICON.pin +
      '<div style="flex:1"><label for="cariDesa">Pilih Wilayah Desa</label>' +
      '<select id="cariDesa"><option value="">Semua Desa (' + desa.length + ' Desa)</option>' + opsiDesa + '</select></div></div>' +
    '<div class="search-field">' + ICON.filter +
      '<div style="flex:1"><label for="cariKategori">Kategori Urusan</label>' +
      '<select id="cariKategori"><option value="">Semua Layanan</option>' +
        '<option value="berita">Berita</option><option value="umkm">UMKM & Potensi</option>' +
        '<option value="desa">Data Desa</option><option value="dokumen">Dokumen Publik</option>' +
        '<option value="agenda">Agenda Kegiatan</option></select></div></div>' +
    '<button class="btn btn-primary" id="btnCari">' + ICON.cari.replace('18','16') + ' Temukan Data</button>' +
  '</div></div></div>';

  const cepat = [
    { ke: '#/pengaduan', ikon: ICON.aduan,    judul: 'Form Pengaduan',    sub: 'Lapor fasilitas rusak atau keluhan layanan', badge: 'Online 24 Jam', kelas: 'badge-success' },
    { ke: '#/dokumen',   ikon: ICON.dokumen,  judul: 'Dokumen & Layanan', sub: 'Unduh SOP, syarat layanan, dan regulasi',    badge: 'SOP Terpadu',  kelas: 'badge-info' },
    { ke: '#/umkm',      ikon: ICON.toko,     judul: 'Direktori UMKM',    sub: 'Potensi usaha unggulan dari tiap desa',      badge: 'Promosi',      kelas: 'badge-accent' },
    { ke: '#/agenda',    ikon: ICON.kalender, judul: 'Agenda Kecamatan',  sub: 'Jadwal kegiatan, musyawarah, dan pelayanan', badge: 'Terbaru',      kelas: 'badge-primary' }
  ].map(function (c) {
    return '<a class="quick-card" href="' + c.ke + '">' +
      '<div class="quick-top"><div class="quick-icon">' + c.ikon + '</div>' +
      '<span class="badge ' + c.kelas + '">' + c.badge + '</span></div>' +
      '<h3>' + c.judul + '</h3><p>' + c.sub + '</p></a>';
  }).join('');

  html += '<section class="section tight"><div class="wrap"><div class="quick-grid">' + cepat + '</div></div></section>';

  /* --- Berita + panel samping --- */
  const kategoriBerita = UI.unik(berita, 'Kategori');
  html += '<section class="section" style="padding-top:1rem"><div class="wrap">' +
    '<div class="news-layout">' +
      '<aside class="card filter-panel">' +
        '<div class="filter-block"><h4>' + ICON.filter.replace('18','13') + ' Filter Informasi</h4>' +
          '<div class="filter-list" id="filterKategoriBeranda">' +
            '<button class="active" data-kat="">Semua Kategori <span class="count">' + berita.length + '</span></button>' +
            kategoriBerita.map(function (k) {
              const n = berita.filter(function (b) { return b.Kategori === k; }).length;
              return '<button data-kat="' + UI.esc(k) + '">' + UI.esc(k) + ' <span class="count">' + n + '</span></button>';
            }).join('') +
          '</div></div>' +
        '<div class="filter-block"><h4>Wilayah Fokus Desa</h4><div class="chips">' +
          desa.slice(0, 8).map(function (d) {
            return '<a class="chip" href="#/desa?q=' + encodeURIComponent(d.Nama_Desa) + '">' + UI.esc(d.Nama_Desa) + '</a>';
          }).join('') +
        '</div></div>' +
        '<div class="filter-block"><h4>Status Loket Pelayanan</h4>' +
          '<p style="font-size:13px;color:var(--text-soft);margin-bottom:.5rem">' +
          '<span class="badge badge-success">' + ICON.jam.replace('18','12') + ' Buka Sekarang</span></p>' +
          '<dl class="info-list" style="font-size:13px">' +
            '<div class="info-row" style="grid-template-columns:1fr auto;padding:.4rem 0"><dt>Senin – Kamis</dt><dd>08.00 – 15.30</dd></div>' +
            '<div class="info-row" style="grid-template-columns:1fr auto;padding:.4rem 0"><dt>Jumat</dt><dd>08.00 – 14.30</dd></div>' +
            '<div class="info-row" style="grid-template-columns:1fr auto;padding:.4rem 0"><dt>Sabtu – Minggu</dt><dd>Tutup (khusus online)</dd></div>' +
          '</dl>' +
          '<p style="font-size:12px;color:var(--text-muted);margin:.6rem 0 0">' + UI.esc(set.alamat || APP_CONFIG.SITUS.alamat) + '</p>' +
        '</div>' +
        '<div class="filter-block" style="background:linear-gradient(140deg,var(--primary),var(--secondary));color:#fff;border-radius:0 0 var(--r-lg) var(--r-lg)">' +
          '<h4 style="color:#fff">' + ICON.telepon.replace('18','13') + ' Hotline Warga 24 Jam</h4>' +
          '<p style="font-size:13px;color:rgba(255,255,255,.82);margin-bottom:.75rem">Salurkan keluhan darurat atau kondisi mendesak agar segera ditangani petugas piket.</p>' +
          '<a class="btn btn-accent btn-sm btn-block" href="https://wa.me/' + UI.esc(set.whatsapp || APP_CONFIG.SITUS.whatsapp) + '" target="_blank" rel="noopener">' +
            ICON.wa.replace('18','15') + ' WhatsApp Kantor Camat</a>' +
          '<p style="font-size:12px;color:rgba(255,255,255,.75);margin:.6rem 0 0">Call Center: ' + UI.esc(set.telepon || APP_CONFIG.SITUS.telepon) + '</p>' +
        '</div>' +
      '</aside>' +

      '<div>' +
        '<div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:1rem;flex-wrap:wrap">' +
          '<div><span class="eyebrow dark">Warta & Publikasi Resmi</span>' +
          '<h2 class="section-title" style="font-size:26px;margin:0">Kabar Kecamatan Terkini</h2></div>' +
          '<a class="btn btn-outline btn-sm" href="#/berita">Semua Berita ' + ICON.panah.replace('18','14') + '</a>' +
        '</div>' +
        '<div class="grid grid-3" id="gridBeritaBeranda">' +
          berita.slice(0, 6).map(H.kartuBerita).join('') +
        '</div>' +
        '<div class="card card-pad" style="margin-top:1.25rem;display:flex;gap:1rem;align-items:center;flex-wrap:wrap;background:var(--container-low)">' +
          '<div class="quick-icon">' + ICON.grafik + '</div>' +
          '<div style="flex:1;min-width:220px"><strong style="font-size:14.5px">Transparansi Anggaran & Realisasi Program</strong>' +
          '<p style="font-size:13px;color:var(--text-soft);margin:.2rem 0 0">Ringkasan realisasi anggaran dipublikasikan tiap triwulan dan dapat diunduh warga.</p></div>' +
          '<a class="btn btn-primary btn-sm" href="#/dokumen">Unduh Laporan</a>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div></section>';

  /* --- Potensi & UMKM (mosaik) --- */
  const kelasMosaik = ['tall', '', '', '', 'wide', '', '', ''];
  html += '<section class="section alt"><div class="wrap">' +
    '<div class="section-head"><span class="eyebrow dark">Potensi & Produk Lokal</span>' +
    '<h2 class="section-title">Potensi Wilayah & UMKM Berdaya Saing</h2>' +
    '<p class="section-sub">Jelajahi komoditas unggulan, wisata berbasis alam, dan kerajinan khas tangan warga dari setiap desa binaan.</p></div>' +
    '<div class="mosaic">' +
      umkm.slice(0, 8).map(function (u, i) {
        return '<a class="mosaic-item ' + kelasMosaik[i] + '" href="#/umkm?q=' + encodeURIComponent(u.Nama_Usaha) + '">' +
          UI.gambar(u.Foto, u.Nama_Usaha) +
          '<div class="mosaic-overlay"><span class="desa">Desa ' + UI.esc(u.Desa) + '</span>' +
          '<h3>' + UI.esc(u.Nama_Usaha) + '</h3>' +
          '<p>' + UI.esc(UI.potong(u.Deskripsi, 72)) + '</p></div></a>';
      }).join('') +
    '</div>' +
    '<div style="text-align:center;margin-top:1.5rem">' +
      '<a class="btn btn-primary" href="#/umkm">Jelajahi Semua ' + UI.angka(umkm.length) + ' UMKM & Potensi ' + ICON.panah.replace('18','15') + '</a>' +
    '</div>' +
  '</div></section>';

  /* --- Statistik ringkas --- */
  const maxDesa = s.perDesa.length ? s.perDesa[0].total : 1;
  html += '<section class="section"><div class="wrap">' +
    '<div class="card card-pad">' +
      '<div style="display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;margin-bottom:1.25rem">' +
        '<div><span class="eyebrow dark">Keterbukaan Data Demografi</span>' +
        '<h2 class="section-title" style="font-size:26px;margin:0">Statistik Penduduk & Wilayah</h2>' +
        '<p style="font-size:13.5px;color:var(--text-soft);margin:.25rem 0 0">Data pengelompokan penduduk berdasarkan Dinas Kependudukan dan Pencatatan Sipil, tahun ' + UI.esc(s.tahun) + '.</p></div>' +
        '<a class="btn btn-outline btn-sm" href="#/statistik">Lihat Portal Statistik Lengkap ' + ICON.grafik.replace('18','14') + '</a>' +
      '</div>' +
      '<div class="stat-grid">' +
        '<div class="stat-card"><div class="lbl">Total Warga Terdata</div><div class="val num">' + UI.angka(s.total) + '</div>' +
          '<div class="sub">Tahun anggaran ' + UI.esc(s.tahun) + '</div></div>' +
        '<div class="stat-card"><div class="lbl">Distribusi Gender</div>' +
          '<div class="split-bar"><i style="width:' + (s.total ? (s.laki / s.total * 100) : 50) + '%;background:var(--primary)"></i>' +
          '<i style="width:' + (s.total ? (s.perempuan / s.total * 100) : 50) + '%;background:var(--accent-bright)"></i></div>' +
          '<div class="legend"><span><i style="background:var(--primary)"></i>Laki-laki ' + UI.angka(s.laki) + '</span>' +
          '<span><i style="background:var(--accent-bright)"></i>Perempuan ' + UI.angka(s.perempuan) + '</span></div></div>' +
        '<div class="stat-card"><div class="lbl">Kepala Keluarga (KK)</div><div class="val num">' + UI.angka(s.kk) + '</div>' +
          '<div class="sub">Rata-rata ' + (s.kk ? (s.total / s.kk).toFixed(1).replace('.', ',') : '0') + ' jiwa per KK</div></div>' +
        '<div class="stat-card"><div class="lbl">Luas Wilayah Administratif</div>' +
          '<div class="val">' + UI.esc((DATA.Data_Geografis && DATA.Data_Geografis[0] && DATA.Data_Geografis[0].Luas_Wilayah) || '-') + '</div>' +
          '<div class="sub">Kepadatan ' + (s.total ? UI.angka(Math.round(s.total / 84.52)) : 0) + ' jiwa/km²</div></div>' +
      '</div>' +
      '<h3 style="font-size:15px;margin:1.5rem 0 .5rem">Sebaran Penduduk Terbanyak per Desa</h3>' +
      '<div>' + s.perDesa.slice(0, 6).map(function (d) {
        return '<div class="bar-row"><span class="name">' + UI.esc(d.desa) + '</span>' +
          '<span class="bar-track"><i class="bar-fill" style="width:' + (d.total / maxDesa * 100) + '%"></i></span>' +
          '<span class="amt">' + UI.angka(d.total) + ' (' + UI.persen(d.total, s.total) + ')</span></div>';
      }).join('') + '</div>' +
    '</div>' +
  '</div></section>';

  /* --- Ajakan pengaduan + agenda --- */
  html += '<section class="section" style="padding-top:0"><div class="wrap"><div class="grid grid-2" style="align-items:stretch">' +
    '<div class="card card-pad" style="background:linear-gradient(135deg,var(--primary-deep),var(--primary) 60%,#2A1F6E);color:#fff">' +
      '<span class="eyebrow">Layanan Tanggap Warga</span>' +
      '<h2 style="font-size:26px;color:#fff;margin:.35rem 0 .5rem">Ada Keluhan Seputar Fasilitas atau Layanan?</h2>' +
      '<p style="color:var(--on-dark-soft);font-size:14px">Sampaikan pengaduan melalui formulir resmi. Laporan akan langsung diteruskan ke seksi terkait ' +
        'dan dapat dipantau progresnya oleh pimpinan kecamatan.</p>' +
      '<div style="display:flex;gap:.6rem;flex-wrap:wrap;margin-top:1rem">' +
        '<a class="btn btn-accent" href="#/pengaduan">' + ICON.kirim.replace('18','16') + ' Isi Formulir Pengaduan</a>' +
        '<a class="btn btn-ghost-light" href="#/pengumuman">' + ICON.megafon.replace('18','16') + ' Lihat Pengumuman</a>' +
      '</div>' +
      '<div style="display:flex;gap:1.25rem;flex-wrap:wrap;margin-top:1.4rem;padding-top:1rem;border-top:1px solid rgba(255,255,255,.14);font-size:12.5px;color:var(--on-dark-soft)">' +
        '<span>' + ICON.perisai.replace('18','14') + ' Identitas pelapor dilindungi</span>' +
        '<span>' + ICON.jam.replace('18','14') + ' Respons rata-rata 1–3 hari kerja</span>' +
      '</div>' +
    '</div>' +
    '<div class="card">' +
      '<div style="padding:1.1rem 1.25rem;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:1rem">' +
        '<div><span class="eyebrow dark">Jadwal Terdekat</span>' +
        '<h3 style="font-size:19px;margin:.2rem 0 0">Agenda Kegiatan Kecamatan</h3></div>' +
        '<a class="btn btn-outline btn-sm" href="#/agenda">Semua</a>' +
      '</div>' +
      (agenda.length ? agenda.slice(0, 4).map(function (a) {
        const d = UI.keDate(a.Tanggal) || new Date();
        return '<div class="agenda-item" style="border-bottom:1px solid var(--border)">' +
          '<div class="agenda-date"><div class="d">' + d.getDate() + '</div>' +
          '<div class="m">' + UI.BULAN_SINGKAT[d.getMonth()] + '</div><div class="y">' + d.getFullYear() + '</div></div>' +
          '<div class="agenda-body"><h3>' + UI.esc(a.Nama_Kegiatan) + '</h3>' +
          '<div class="meta"><span>' + ICON.jam.replace('18','13') + ' ' + UI.esc(a.Waktu || '-') + '</span>' +
          '<span>' + ICON.pin.replace('18','13') + ' ' + UI.esc(a.Lokasi || '-') + '</span></div></div></div>';
      }).join('') : UI.kosong('Belum ada agenda', 'Agenda kegiatan akan tampil di sini setelah admin menambahkannya.')) +
    '</div>' +
  '</div></div></section>';

  return {
    html: html,
    init: function () {
      // Filter kategori berita pada beranda
      const wadah = document.getElementById('filterKategoriBeranda');
      if (wadah) {
        wadah.addEventListener('click', function (e) {
          const btn = e.target.closest('button');
          if (!btn) return;
          wadah.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          const kat = btn.dataset.kat;
          const hasil = kat ? berita.filter(function (b) { return b.Kategori === kat; }) : berita;
          document.getElementById('gridBeritaBeranda').innerHTML =
            hasil.length ? hasil.slice(0, 6).map(H.kartuBerita).join('')
                         : UI.kosong('Belum ada berita', 'Tidak ada berita pada kategori ini.');
        });
      }

      // Pencarian global
      const jalankan = function () {
        const q   = (document.getElementById('cariGlobal').value || '').trim();
        const dsa = document.getElementById('cariDesa').value;
        const kat = document.getElementById('cariKategori').value;
        const kueri = [q, dsa].filter(Boolean).join(' ').trim();
        if (kat && kat !== 'berita' && !kueri) { location.hash = '#/' + kat; return; }
        location.hash = '#/cari?q=' + encodeURIComponent(kueri) + (kat ? '&k=' + kat : '');
      };
      document.getElementById('btnCari').addEventListener('click', jalankan);
      document.getElementById('cariGlobal').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') jalankan();
      });
    }
  };
};

/* ==========================================================================
   PROFIL KECAMATAN
   ========================================================================== */
PAGES.profil = function () {
  const bagian = (DATA.Profil_Kecamatan || []).slice().sort(function (a, b) {
    return (Number(a.Urutan_Tampil) || 0) - (Number(b.Urutan_Tampil) || 0);
  });
  const set = DATA.Pengaturan_Situs || {};

  let html = H.kepala('Profil Kecamatan',
    'Sejarah pembentukan, visi dan misi, serta struktur organisasi perangkat kecamatan.', 'Profil Kecamatan');

  html += '<section class="section"><div class="wrap"><div class="grid" style="grid-template-columns:minmax(0,1fr) 320px;gap:2rem;align-items:start">' +
    '<div>' + (bagian.length ? bagian.map(function (b) {
      return '<div class="profil-block"><span class="eyebrow dark">Bagian ' + UI.esc(b.Urutan_Tampil || '') + '</span>' +
        '<h3>' + UI.esc(b.Judul_Bagian) + '</h3>' +
        '<div class="isi">' + UI.paragraf(b.Isi_Konten) + '</div></div>';
    }).join('') : UI.kosong('Profil belum diisi', 'Admin belum menambahkan konten profil kecamatan.')) +

    // Bagan struktur organisasi — diunggah admin lewat panel
    (set.struktur_organisasi
      ? '<div class="card" style="margin-top:1rem">' +
          '<div style="padding:1rem 1.25rem;border-bottom:1px solid var(--border)">' +
            '<span class="eyebrow dark">Bagan Resmi</span>' +
            '<h3 style="font-size:19px;margin:.2rem 0 0">Struktur Organisasi Kecamatan</h3></div>' +
          '<a href="' + UI.esc(set.struktur_organisasi) + '" target="_blank" rel="noopener" ' +
            'style="display:block;padding:1.25rem;background:var(--subtle)">' +
            '<img src="' + UI.esc(set.struktur_organisasi) + '" alt="Bagan struktur organisasi kecamatan" ' +
            'loading="lazy" style="width:100%;height:auto;border-radius:var(--r);background:#fff">' +
          '</a>' +
          '<p style="padding:.75rem 1.25rem;margin:0;font-size:12.5px;color:var(--text-muted)">Klik bagan untuk membukanya dalam ukuran penuh.</p>' +
        '</div>'
      : '') + '</div>' +

    '<aside style="display:grid;gap:1rem">' +
      '<div class="aside-card"><h4>' + ICON.orang + ' Pimpinan Kecamatan</h4><div class="body">' +
        '<div style="aspect-ratio:1;border-radius:var(--r-lg);overflow:hidden;margin-bottom:.85rem">' +
          UI.gambar(set.foto_camat, set.nama_camat || APP_CONFIG.SITUS.nama_camat) + '</div>' +
        '<strong style="display:block;font-size:15px">' + UI.esc(set.nama_camat || APP_CONFIG.SITUS.nama_camat) + '</strong>' +
        '<span style="font-size:13px;color:var(--text-muted)">Camat ' + UI.esc(set.nama_kecamatan || APP_CONFIG.SITUS.nama_kecamatan) + '</span>' +
      '</div></div>' +
      '<div class="aside-card"><h4>' + ICON.gedung + ' Identitas Kantor</h4><div class="body">' +
        '<dl class="info-list" style="font-size:13.5px">' +
          '<div class="info-row" style="grid-template-columns:1fr"><dt>Alamat</dt><dd>' + UI.esc(set.alamat || APP_CONFIG.SITUS.alamat) + '</dd></div>' +
          '<div class="info-row" style="grid-template-columns:1fr"><dt>Telepon</dt><dd>' + UI.esc(set.telepon || APP_CONFIG.SITUS.telepon) + '</dd></div>' +
          '<div class="info-row" style="grid-template-columns:1fr"><dt>Surel</dt><dd>' + UI.esc(set.email || APP_CONFIG.SITUS.email) + '</dd></div>' +
          '<div class="info-row" style="grid-template-columns:1fr"><dt>Jam Layanan</dt><dd>' + UI.esc(set.jam_layanan || APP_CONFIG.SITUS.jam_layanan) + '</dd></div>' +
        '</dl>' +
      '</div></div>' +
      '<a class="btn btn-primary btn-block" href="#/wilayah">' + ICON.peta.replace('18','16') + ' Lihat Data Wilayah</a>' +
    '</aside>' +
  '</div></div></section>';

  return { html: html };
};

/* ==========================================================================
   DATA GEOGRAFIS & PETA
   ========================================================================== */
PAGES.wilayah = function () {
  const g = (DATA.Data_Geografis || [])[0] || {};
  const desa = DATA.Data_Desa || [];
  const s = H.ringkasanStatistik();

  let html = H.kepala('Data Geografis & Peta Wilayah',
    'Batas administratif, luas wilayah, topografi, serta sebaran desa binaan kecamatan.', 'Data Wilayah');

  html += '<section class="section"><div class="wrap">' +
    '<div class="grid grid-4" style="margin-bottom:1.5rem">' +
      '<div class="stat-card"><div class="lbl">Luas Wilayah</div><div class="val" style="font-size:22px">' + UI.esc(g.Luas_Wilayah || '-') + '</div></div>' +
      '<div class="stat-card"><div class="lbl">Jumlah Desa</div><div class="val num">' + UI.angka(desa.length) + '</div><div class="sub">desa binaan</div></div>' +
      '<div class="stat-card"><div class="lbl">Ketinggian</div><div class="val" style="font-size:22px">' + UI.esc(g.Ketinggian || '-') + '</div></div>' +
      '<div class="stat-card"><div class="lbl">Kepadatan</div><div class="val num">' + UI.angka(Math.round(s.total / 84.52)) + '</div><div class="sub">jiwa/km²</div></div>' +
    '</div>' +

    '<div class="grid" style="grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:1.5rem;align-items:start">' +
      '<div class="card"><div style="padding:1rem 1.25rem;border-bottom:1px solid var(--border)">' +
        '<h3 style="font-size:17px;margin:0">' + ICON.peta.replace('18','16') + ' Peta Interaktif Wilayah</h3>' +
        '<p style="font-size:12.5px;color:var(--text-muted);margin:.2rem 0 0">Peta menampilkan titik kantor kecamatan. Gunakan cubit/gulir untuk memperbesar.</p></div>' +
        H.petaEmbed() +
      '</div>' +
      '<div class="card card-pad">' +
        '<span class="eyebrow dark">Batas Administratif</span>' +
        '<h3 style="font-size:19px;margin:.25rem 0 .9rem">' + UI.esc(g.Nama_Wilayah || 'Wilayah Kecamatan') + '</h3>' +
        '<dl class="info-list">' +
          '<div class="info-row"><dt>Sebelah Utara</dt><dd>' + UI.esc(g.Batas_Utara || '-') + '</dd></div>' +
          '<div class="info-row"><dt>Sebelah Selatan</dt><dd>' + UI.esc(g.Batas_Selatan || '-') + '</dd></div>' +
          '<div class="info-row"><dt>Sebelah Timur</dt><dd>' + UI.esc(g.Batas_Timur || '-') + '</dd></div>' +
          '<div class="info-row"><dt>Sebelah Barat</dt><dd>' + UI.esc(g.Batas_Barat || '-') + '</dd></div>' +
          '<div class="info-row"><dt>Luas Wilayah</dt><dd>' + UI.esc(g.Luas_Wilayah || '-') + '</dd></div>' +
          '<div class="info-row"><dt>Ketinggian</dt><dd>' + UI.esc(g.Ketinggian || '-') + '</dd></div>' +
        '</dl>' +
        (g.Deskripsi ? '<div style="margin-top:1rem;font-size:14px;color:var(--text-soft)">' + UI.paragraf(g.Deskripsi) + '</div>' : '') +
      '</div>' +
    '</div>' +

    '<h3 style="font-size:19px;margin:2rem 0 .85rem">Sebaran Luas Wilayah per Desa</h3>' +
    '<div class="table-wrap"><table class="data"><thead><tr>' +
      '<th>Desa</th><th>Kepala Desa</th><th class="num">Penduduk</th><th class="num">KK</th><th>Luas</th><th>Kontak</th>' +
    '</tr></thead><tbody>' +
      desa.map(function (d) {
        return '<tr><td><strong>' + UI.esc(d.Nama_Desa) + '</strong></td>' +
          '<td>' + UI.esc(d.Kepala_Desa || '-') + '</td>' +
          '<td class="num">' + UI.angka(d.Jumlah_Penduduk) + '</td>' +
          '<td class="num">' + UI.angka(d.Jumlah_KK) + '</td>' +
          '<td>' + UI.esc(d.Luas_Wilayah || '-') + '</td>' +
          '<td>' + UI.esc(d.Kontak || '-') + '</td></tr>';
      }).join('') +
    '</tbody></table></div>' +
  '</div></section>';

  return { html: html };
};

/* ==========================================================================
   DATA DESA
   ========================================================================== */
PAGES.desa = function (params) {
  const desa = DATA.Data_Desa || [];
  const qAwal = params.q || '';

  let html = H.kepala('Data Desa Binaan',
    'Profil ' + desa.length + ' desa di wilayah kecamatan: kepala desa, jumlah penduduk, luas wilayah, dan potensi unggulan.', 'Data Desa');

  html += '<section class="section"><div class="wrap">' +
    '<div class="card card-pad" style="margin-bottom:1.5rem">' +
      '<div class="search-field" style="background:#fff;border-color:var(--border-strong)">' + ICON.cari +
      '<input id="cariDesaInput" type="search" placeholder="Cari nama desa, kepala desa, atau potensi…" value="' + UI.esc(qAwal) + '"></div>' +
    '</div>' +
    '<div class="grid grid-3" id="gridDesa"></div>' +
  '</div></section>';

  return {
    html: html,
    init: function () {
      const input = document.getElementById('cariDesaInput');
      const grid  = document.getElementById('gridDesa');
      const render = function () {
        const hasil = desa.filter(function (d) {
          return UI.cocok(d, ['Nama_Desa', 'Kepala_Desa', 'Deskripsi'], input.value);
        });
        grid.innerHTML = hasil.length ? hasil.map(H.kartuDesa).join('')
          : UI.kosong('Desa tidak ditemukan', 'Coba kata kunci lain, misalnya nama kepala desa atau potensi desa.');
      };
      input.addEventListener('input', render);
      render();
      if (qAwal) input.focus();
    }
  };
};

/* ==========================================================================
   STATISTIK PENDUDUK
   ========================================================================== */
PAGES.statistik = function () {
  const rows = DATA.Statistik_Penduduk || [];
  const tahunTersedia = UI.unik(rows, 'Tahun').sort().reverse();
  const desaTersedia  = UI.unik(rows, 'Desa');

  let html = H.kepala('Statistik Penduduk',
    'Data kependudukan per desa dan per tahun, disajikan dalam bentuk grafik dan tabel yang dapat dicari serta difilter.', 'Statistik Penduduk');

  html += '<section class="section"><div class="wrap">' +
    '<div class="card card-pad" style="margin-bottom:1.5rem">' +
      '<div class="grid" style="grid-template-columns:1fr 200px 200px;gap:.75rem;align-items:end">' +
        '<div class="field"><label for="statCari">Cari desa</label>' +
          '<input id="statCari" type="search" placeholder="Ketik nama desa…"></div>' +
        '<div class="field"><label for="statTahun">Tahun</label><select id="statTahun">' +
          tahunTersedia.map(function (t, i) {
            return '<option value="' + UI.esc(t) + '"' + (i === 0 ? ' selected' : '') + '>' + UI.esc(t) + '</option>';
          }).join('') + '</select></div>' +
        '<div class="field"><label for="statDesa">Desa</label><select id="statDesa">' +
          '<option value="">Semua Desa</option>' +
          desaTersedia.map(function (d) { return '<option value="' + UI.esc(d) + '">' + UI.esc(d) + '</option>'; }).join('') +
          '</select></div>' +
      '</div>' +
    '</div>' +
    '<div id="statRingkas" class="stat-grid" style="margin-bottom:1.5rem"></div>' +
    '<div class="grid grid-2" style="margin-bottom:1.5rem;align-items:start">' +
      '<div class="card card-pad"><h3 style="font-size:16px">Jumlah Penduduk per Desa</h3>' +
        '<p style="font-size:12.5px;color:var(--text-muted);margin-bottom:1rem">Grafik batang perbandingan jumlah jiwa antardesa.</p>' +
        '<div id="statGrafikDesa"></div></div>' +
      '<div class="card card-pad"><h3 style="font-size:16px">Komposisi Kelompok Usia</h3>' +
        '<p style="font-size:12.5px;color:var(--text-muted);margin-bottom:1rem">Distribusi penduduk menurut kelompok usia produktif.</p>' +
        '<div id="statGrafikUsia"></div></div>' +
    '</div>' +
    '<div class="table-wrap"><table class="data"><thead><tr>' +
      '<th>Desa</th><th class="num">Tahun</th><th class="num">Laki-laki</th><th class="num">Perempuan</th>' +
      '<th class="num">Total</th><th class="num">KK</th><th class="num">0–14 th</th><th class="num">15–64 th</th><th class="num">65+ th</th>' +
    '</tr></thead><tbody id="statTabel"></tbody></table></div>' +
    '<p style="font-size:12.5px;color:var(--text-muted);margin-top:.75rem">Sumber: Dinas Kependudukan dan Pencatatan Sipil, diolah Seksi Pemerintahan Kecamatan.</p>' +
  '</div></section>';

  return {
    html: html,
    init: function () {
      const elCari  = document.getElementById('statCari');
      const elTahun = document.getElementById('statTahun');
      const elDesa  = document.getElementById('statDesa');

      const render = function () {
        const hasil = rows.filter(function (r) {
          if (elTahun.value && String(r.Tahun) !== elTahun.value) return false;
          if (elDesa.value && r.Desa !== elDesa.value) return false;
          return UI.cocok(r, ['Desa'], elCari.value);
        }).sort(function (a, b) {
          return ((Number(b.Jumlah_Laki) || 0) + (Number(b.Jumlah_Perempuan) || 0)) -
                 ((Number(a.Jumlah_Laki) || 0) + (Number(a.Jumlah_Perempuan) || 0));
        });

        const jml = function (k) { return hasil.reduce(function (a, r) { return a + (Number(r[k]) || 0); }, 0); };
        const laki = jml('Jumlah_Laki'), pr = jml('Jumlah_Perempuan'), total = laki + pr;
        const u1 = jml('Usia_0_14'), u2 = jml('Usia_15_64'), u3 = jml('Usia_65_Plus');

        // Kartu ringkas
        document.getElementById('statRingkas').innerHTML =
          '<div class="stat-card"><div class="lbl">Total Penduduk</div><div class="val num">' + UI.angka(total) + '</div>' +
            '<div class="sub">' + hasil.length + ' baris data terpilih</div></div>' +
          '<div class="stat-card"><div class="lbl">Laki-laki</div><div class="val num">' + UI.angka(laki) + '</div>' +
            '<div class="sub">' + UI.persen(laki, total) + ' dari total</div></div>' +
          '<div class="stat-card"><div class="lbl">Perempuan</div><div class="val num">' + UI.angka(pr) + '</div>' +
            '<div class="sub">' + UI.persen(pr, total) + ' dari total</div></div>' +
          '<div class="stat-card"><div class="lbl">Kepala Keluarga</div><div class="val num">' + UI.angka(jml('Jumlah_KK')) + '</div>' +
            '<div class="sub">Rata-rata ' + (jml('Jumlah_KK') ? (total / jml('Jumlah_KK')).toFixed(1).replace('.', ',') : '0') + ' jiwa/KK</div></div>';

        // Grafik batang per desa
        const maks = Math.max.apply(null, hasil.map(function (r) {
          return (Number(r.Jumlah_Laki) || 0) + (Number(r.Jumlah_Perempuan) || 0);
        }).concat([1]));
        document.getElementById('statGrafikDesa').innerHTML = hasil.length ? hasil.map(function (r) {
          const t = (Number(r.Jumlah_Laki) || 0) + (Number(r.Jumlah_Perempuan) || 0);
          return '<div class="bar-row"><span class="name">' + UI.esc(r.Desa) + '</span>' +
            '<span class="bar-track"><i class="bar-fill" style="width:' + (t / maks * 100) + '%"></i></span>' +
            '<span class="amt">' + UI.angka(t) + '</span></div>';
        }).join('') : '<p class="text-muted" style="font-size:13px">Tidak ada data untuk filter ini.</p>';

        // Grafik kelompok usia
        const usia = [
          { n: 'Usia 0–14 tahun',  v: u1, w: '#1E1A5A' },
          { n: 'Usia 15–64 tahun', v: u2, w: '#7A44AC' },
          { n: 'Usia 65+ tahun',   v: u3, w: '#E69A19' }
        ];
        const maksU = Math.max(u1, u2, u3, 1);
        document.getElementById('statGrafikUsia').innerHTML = usia.map(function (u) {
          return '<div class="bar-row" style="grid-template-columns:140px 1fr 100px"><span class="name">' + u.n + '</span>' +
            '<span class="bar-track"><i class="bar-fill" style="width:' + (u.v / maksU * 100) + '%;background:' + u.w + '"></i></span>' +
            '<span class="amt">' + UI.angka(u.v) + ' (' + UI.persen(u.v, u1 + u2 + u3) + ')</span></div>';
        }).join('');

        // Tabel
        document.getElementById('statTabel').innerHTML = hasil.length ? hasil.map(function (r) {
          const t = (Number(r.Jumlah_Laki) || 0) + (Number(r.Jumlah_Perempuan) || 0);
          return '<tr><td><strong>' + UI.esc(r.Desa) + '</strong></td>' +
            '<td class="num">' + UI.esc(r.Tahun) + '</td>' +
            '<td class="num">' + UI.angka(r.Jumlah_Laki) + '</td>' +
            '<td class="num">' + UI.angka(r.Jumlah_Perempuan) + '</td>' +
            '<td class="num"><strong>' + UI.angka(t) + '</strong></td>' +
            '<td class="num">' + UI.angka(r.Jumlah_KK) + '</td>' +
            '<td class="num">' + UI.angka(r.Usia_0_14) + '</td>' +
            '<td class="num">' + UI.angka(r.Usia_15_64) + '</td>' +
            '<td class="num">' + UI.angka(r.Usia_65_Plus) + '</td></tr>';
        }).join('') : '<tr><td colspan="9" style="text-align:center;padding:2rem;color:var(--text-muted)">Tidak ada data yang cocok dengan filter.</td></tr>';
      };

      [elCari, elTahun, elDesa].forEach(function (el) {
        el.addEventListener('input', render);
        el.addEventListener('change', render);
      });
      render();
    }
  };
};

/* ==========================================================================
   UMKM & POTENSI
   ========================================================================== */
PAGES.umkm = function (params) {
  const umkm = DATA.Data_UMKM || [];
  const jenis = UI.unik(umkm, 'Jenis_Usaha');
  const desa  = UI.unik(umkm, 'Desa');

  let html = H.kepala('Direktori UMKM & Potensi Desa',
    'Daftar usaha mikro, kecil, dan menengah serta potensi unggulan yang dibina pemerintah kecamatan.', 'UMKM & Potensi');

  html += '<section class="section"><div class="wrap">' +
    '<div class="card card-pad" style="margin-bottom:1.25rem">' +
      '<div class="grid" style="grid-template-columns:1fr 220px;gap:.75rem;align-items:end;margin-bottom:.9rem">' +
        '<div class="field"><label for="umkmCari">Cari usaha</label>' +
          '<input id="umkmCari" type="search" placeholder="Nama usaha, pemilik, atau produk…" value="' + UI.esc(params.q || '') + '"></div>' +
        '<div class="field"><label for="umkmDesa">Desa</label><select id="umkmDesa"><option value="">Semua Desa</option>' +
          desa.map(function (d) { return '<option value="' + UI.esc(d) + '">' + UI.esc(d) + '</option>'; }).join('') + '</select></div>' +
      '</div>' +
      '<div class="chips" id="umkmJenis">' +
        '<button class="chip active" data-jenis="">Semua Jenis</button>' +
        jenis.map(function (j) { return '<button class="chip" data-jenis="' + UI.esc(j) + '">' + UI.esc(j) + '</button>'; }).join('') +
      '</div>' +
    '</div>' +
    '<p id="umkmJumlah" class="text-muted" style="font-size:13px;margin-bottom:.85rem"></p>' +
    '<div class="grid grid-3" id="umkmGrid"></div>' +
  '</div></section>';

  return {
    html: html,
    init: function () {
      const elCari = document.getElementById('umkmCari');
      const elDesa = document.getElementById('umkmDesa');
      const chips  = document.getElementById('umkmJenis');
      let jenisAktif = '';

      const render = function () {
        const hasil = umkm.filter(function (u) {
          if (elDesa.value && u.Desa !== elDesa.value) return false;
          if (jenisAktif && u.Jenis_Usaha !== jenisAktif) return false;
          return UI.cocok(u, ['Nama_Usaha', 'Pemilik', 'Deskripsi', 'Jenis_Usaha'], elCari.value);
        });
        document.getElementById('umkmJumlah').textContent =
          'Menampilkan ' + hasil.length + ' dari ' + umkm.length + ' usaha terdata.';
        document.getElementById('umkmGrid').innerHTML = hasil.length ? hasil.map(function (u) {
          return '<article class="card card-link">' +
            '<div style="aspect-ratio:16/10;position:relative">' + UI.gambar(u.Foto, u.Nama_Usaha) +
              '<span class="badge badge-accent" style="position:absolute;top:.6rem;left:.6rem">' + UI.esc(u.Jenis_Usaha || 'Usaha') + '</span>' +
            '</div>' +
            '<div class="card-pad">' +
              '<span class="eyebrow dark">Desa ' + UI.esc(u.Desa) + '</span>' +
              '<h3 style="font-size:16px;margin:.3rem 0 .35rem">' + UI.esc(u.Nama_Usaha) + '</h3>' +
              '<p style="font-size:13px;color:var(--text-soft)">' + UI.esc(UI.potong(u.Deskripsi, 120)) + '</p>' +
              '<div style="display:flex;align-items:center;justify-content:space-between;gap:.5rem;padding-top:.6rem;border-top:1px solid var(--border);font-size:12.5px">' +
                '<span class="text-muted">' + UI.esc(u.Pemilik || '-') + '</span>' +
                (u.Kontak ? '<a class="btn btn-outline btn-sm" href="tel:' + UI.esc(String(u.Kontak).replace(/[^0-9+]/g, '')) + '">' + ICON.telepon.replace('18','14') + ' Hubungi</a>' : '') +
              '</div>' +
            '</div></article>';
        }).join('') : UI.kosong('Usaha tidak ditemukan', 'Ubah kata kunci atau pilih jenis usaha yang berbeda.');
      };

      chips.addEventListener('click', function (e) {
        const b = e.target.closest('button');
        if (!b) return;
        chips.querySelectorAll('button').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        jenisAktif = b.dataset.jenis;
        render();
      });
      elCari.addEventListener('input', render);
      elDesa.addEventListener('change', render);
      render();
    }
  };
};

/* ==========================================================================
   AGENDA KEGIATAN
   ========================================================================== */
PAGES.agenda = function () {
  const semua = (DATA.Agenda_Kegiatan || []).slice().sort(function (a, b) {
    return new Date(a.Tanggal) - new Date(b.Tanggal);
  });
  const kini    = new Date(); kini.setHours(0, 0, 0, 0);
  const akan    = semua.filter(function (a) { return (UI.keDate(a.Tanggal) || kini) >= kini; });
  const lampau  = semua.filter(function (a) { return (UI.keDate(a.Tanggal) || kini) <  kini; }).reverse();

  const daftar = function (arr, kosong) {
    if (!arr.length) return UI.kosong('Belum ada agenda', kosong);
    return '<div class="card">' + arr.map(function (a, i) {
      const d = UI.keDate(a.Tanggal) || new Date();
      return '<div class="agenda-item"' + (i < arr.length - 1 ? ' style="border-bottom:1px solid var(--border)"' : '') + '>' +
        '<div class="agenda-date"><div class="d">' + d.getDate() + '</div>' +
        '<div class="m">' + UI.BULAN_SINGKAT[d.getMonth()] + '</div><div class="y">' + d.getFullYear() + '</div></div>' +
        '<div class="agenda-body">' +
          '<h3>' + UI.esc(a.Nama_Kegiatan) + '</h3>' +
          '<div class="meta"><span>' + ICON.kalender.replace('18','13') + ' ' + UI.tanggal(a.Tanggal, 'panjang') + '</span>' +
          '<span>' + ICON.jam.replace('18','13') + ' ' + UI.esc(a.Waktu || '-') + '</span>' +
          '<span>' + ICON.pin.replace('18','13') + ' ' + UI.esc(a.Lokasi || '-') + '</span></div>' +
          '<p>' + UI.esc(a.Deskripsi || '') + '</p>' +
        '</div></div>';
    }).join('') + '</div>';
  };

  let html = H.kepala('Agenda Kegiatan Kecamatan',
    'Jadwal pelayanan keliling, musyawarah, dan kegiatan kemasyarakatan yang diselenggarakan pemerintah kecamatan.', 'Agenda Kegiatan');

  html += '<section class="section"><div class="wrap">' +
    '<h3 style="font-size:19px;margin-bottom:.85rem">' + ICON.kalender.replace('18','16') + ' Agenda Mendatang (' + akan.length + ')</h3>' +
    daftar(akan, 'Belum ada agenda mendatang yang dijadwalkan.') +
    (lampau.length ? '<h3 style="font-size:19px;margin:2rem 0 .85rem">Agenda Telah Berlangsung</h3>' + daftar(lampau, '') : '') +
  '</div></section>';

  return { html: html };
};

/* ==========================================================================
   GALERI FOTO
   ========================================================================== */
PAGES.galeri = function () {
  const foto = DATA.Galeri_Foto || [];
  const kategori = UI.unik(foto, 'Kategori');

  let html = H.kepala('Galeri Dokumentasi',
    'Dokumentasi kegiatan pelayanan, pembangunan, dan kemasyarakatan di wilayah kecamatan.', 'Galeri Foto');

  html += '<section class="section"><div class="wrap">' +
    '<div class="chips" id="galKategori" style="margin-bottom:1.25rem">' +
      '<button class="chip active" data-kat="">Semua Album (' + foto.length + ')</button>' +
      kategori.map(function (k) {
        const n = foto.filter(function (f) { return f.Kategori === k; }).length;
        return '<button class="chip" data-kat="' + UI.esc(k) + '">' + UI.esc(k) + ' (' + n + ')</button>';
      }).join('') +
    '</div>' +
    '<div class="gallery-grid" id="galGrid"></div>' +
  '</div></section>' +
  '<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Pratinjau foto">' +
    '<button class="lightbox-close" id="lightboxClose" aria-label="Tutup pratinjau">' + ICON.silang + '</button>' +
    '<div class="lightbox-inner"><div class="frame" id="lightboxFrame"></div>' +
    '<div class="lightbox-cap" id="lightboxCap"></div></div>' +
  '</div>';

  return {
    html: html,
    init: function () {
      const grid  = document.getElementById('galGrid');
      const chips = document.getElementById('galKategori');
      const lb    = document.getElementById('lightbox');
      let aktif = '';

      const render = function () {
        const hasil = aktif ? foto.filter(function (f) { return f.Kategori === aktif; }) : foto;
        grid.innerHTML = hasil.length ? hasil.map(function (f, i) {
          return '<figure class="gallery-item" data-idx="' + i + '" tabindex="0" role="button" aria-label="Buka foto ' + UI.esc(f.Judul) + '">' +
            UI.gambar(f.Link_Drive_Foto, f.Judul) +
            '<figcaption class="gallery-cap">' + UI.esc(f.Judul) + '</figcaption></figure>';
        }).join('') : UI.kosong('Belum ada foto', 'Admin belum mengunggah foto pada album ini.');
        grid._data = hasil;
      };

      const buka = function (idx) {
        const f = grid._data[idx];
        if (!f) return;
        document.getElementById('lightboxFrame').innerHTML = UI.gambar(f.Link_Drive_Foto, f.Judul);
        document.getElementById('lightboxCap').innerHTML =
          '<strong style="display:block;font-size:16px">' + UI.esc(f.Judul) + '</strong>' +
          '<span style="font-size:13px;color:rgba(255,255,255,.75)">' + UI.esc(f.Keterangan || '') + ' · ' + UI.tanggal(f.Tanggal_Upload, 'pendek') + '</span>';
        lb.classList.add('open');
      };
      const tutup = function () { lb.classList.remove('open'); };

      chips.addEventListener('click', function (e) {
        const b = e.target.closest('button');
        if (!b) return;
        chips.querySelectorAll('button').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        aktif = b.dataset.kat;
        render();
      });
      grid.addEventListener('click', function (e) {
        const it = e.target.closest('.gallery-item');
        if (it) buka(Number(it.dataset.idx));
      });
      grid.addEventListener('keydown', function (e) {
        const it = e.target.closest('.gallery-item');
        if (it && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); buka(Number(it.dataset.idx)); }
      });
      document.getElementById('lightboxClose').addEventListener('click', tutup);
      lb.addEventListener('click', function (e) { if (e.target === lb) tutup(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') tutup(); });
      render();
    }
  };
};

/* ==========================================================================
   PENGUMUMAN
   ========================================================================== */
PAGES.pengumuman = function () {
  const daftar = (DATA.Pengumuman || []).slice().sort(function (a, b) {
    return new Date(b.Tanggal_Terbit) - new Date(a.Tanggal_Terbit);
  });

  let html = H.kepala('Pengumuman & Layanan Publik',
    'Informasi resmi mengenai layanan, jadwal, dan kebijakan yang perlu diketahui masyarakat.', 'Pengumuman');

  html += '<section class="section"><div class="wrap"><div class="grid" style="gap:1rem">' +
    (daftar.length ? daftar.map(function (p) {
      const tinggi = String(p.Prioritas).toLowerCase() === 'tinggi';
      return '<article class="card card-pad" style="border-left:4px solid ' + (tinggi ? 'var(--accent)' : 'var(--primary)') + '">' +
        '<div style="display:flex;align-items:center;gap:.6rem;flex-wrap:wrap;margin-bottom:.5rem">' +
          '<span class="badge ' + (tinggi ? 'badge-accent' : 'badge-primary') + '">' +
            (tinggi ? ICON.peringatan.replace('18','12') + ' Prioritas Tinggi' : 'Pengumuman Resmi') + '</span>' +
          '<span class="text-muted" style="font-size:12.5px">' + ICON.kalender.replace('18','13') + ' ' + UI.tanggal(p.Tanggal_Terbit, 'panjang') + '</span>' +
        '</div>' +
        '<h3 style="font-size:18px;margin-bottom:.4rem">' + UI.esc(p.Judul) + '</h3>' +
        '<div style="font-size:14px;color:var(--text-soft)">' + UI.paragraf(p.Isi) + '</div>' +
      '</article>';
    }).join('') : UI.kosong('Belum ada pengumuman', 'Pengumuman resmi akan tampil di sini setelah diterbitkan admin.')) +
  '</div></div></section>';

  return { html: html };
};

/* ==========================================================================
   BERITA — DAFTAR
   ========================================================================== */
PAGES.berita = function (params) {
  const semua = (DATA.Berita || []).slice().sort(function (a, b) {
    return new Date(b.Tanggal_Publish) - new Date(a.Tanggal_Publish);
  });
  const kategori = UI.unik(semua, 'Kategori');

  let html = H.kepala('Berita Kecamatan',
    'Kabar terbaru seputar pelayanan, pembangunan, dan kegiatan kemasyarakatan di wilayah kecamatan.', 'Berita');

  html += '<section class="section"><div class="wrap"><div class="news-layout">' +
    '<aside class="card filter-panel">' +
      '<div class="filter-block"><h4>' + ICON.cari.replace('18','13') + ' Cari Berita</h4>' +
        '<div class="field"><input id="beritaCari" type="search" placeholder="Kata kunci judul…" value="' + UI.esc(params.q || '') + '"></div></div>' +
      '<div class="filter-block"><h4>Kategori</h4><div class="filter-list" id="beritaKat">' +
        '<button class="active" data-kat="">Semua Kategori <span class="count">' + semua.length + '</span></button>' +
        kategori.map(function (k) {
          const n = semua.filter(function (b) { return b.Kategori === k; }).length;
          return '<button data-kat="' + UI.esc(k) + '">' + UI.esc(k) + ' <span class="count">' + n + '</span></button>';
        }).join('') +
      '</div></div>' +
    '</aside>' +
    '<div><p id="beritaJumlah" class="text-muted" style="font-size:13px;margin-bottom:.85rem"></p>' +
      '<div class="grid grid-3" id="beritaGrid"></div>' +
      '<div id="beritaPager" style="display:flex;justify-content:center;gap:.4rem;margin-top:1.5rem"></div>' +
    '</div>' +
  '</div></div></section>';

  return {
    html: html,
    init: function () {
      const elCari = document.getElementById('beritaCari');
      const elKat  = document.getElementById('beritaKat');
      let kat = '', halaman = 1;
      const perHal = APP_CONFIG.BERITA_PER_HALAMAN || 6;

      const render = function () {
        const hasil = semua.filter(function (b) {
          if (kat && b.Kategori !== kat) return false;
          return UI.cocok(b, ['Judul', 'Ringkasan', 'Isi', 'Penulis'], elCari.value);
        });
        const totalHal = Math.max(1, Math.ceil(hasil.length / perHal));
        if (halaman > totalHal) halaman = totalHal;
        const potong = hasil.slice((halaman - 1) * perHal, halaman * perHal);

        document.getElementById('beritaJumlah').textContent =
          'Menampilkan ' + potong.length + ' dari ' + hasil.length + ' berita.';
        document.getElementById('beritaGrid').innerHTML = potong.length
          ? potong.map(H.kartuBerita).join('')
          : UI.kosong('Berita tidak ditemukan', 'Coba kata kunci lain atau pilih kategori berbeda.');

        let pager = '';
        if (totalHal > 1) {
          for (let i = 1; i <= totalHal; i++) {
            pager += '<button class="chip' + (i === halaman ? ' active' : '') + '" data-hal="' + i + '">' + i + '</button>';
          }
        }
        document.getElementById('beritaPager').innerHTML = pager;
      };

      elCari.addEventListener('input', function () { halaman = 1; render(); });
      elKat.addEventListener('click', function (e) {
        const b = e.target.closest('button');
        if (!b) return;
        elKat.querySelectorAll('button').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        kat = b.dataset.kat; halaman = 1; render();
      });
      document.getElementById('beritaPager').addEventListener('click', function (e) {
        const b = e.target.closest('button');
        if (!b) return;
        halaman = Number(b.dataset.hal);
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      render();
    }
  };
};

/* ==========================================================================
   BERITA — DETAIL
   ========================================================================== */
PAGES.beritaDetail = function (id) {
  const semua = DATA.Berita || [];
  const b = semua.filter(function (x) { return String(x.ID) === String(id); })[0];

  if (!b) {
    return { html: '<section class="section"><div class="wrap">' +
      UI.kosong('Berita tidak ditemukan', 'Tautan mungkin sudah tidak berlaku atau berita telah dicabut.') +
      '<div style="text-align:center"><a class="btn btn-primary" href="#/berita">Kembali ke Daftar Berita</a></div>' +
      '</div></section>' };
  }

  const lain = semua.filter(function (x) { return x.ID !== b.ID; })
    .sort(function (x, y) { return new Date(y.Tanggal_Publish) - new Date(x.Tanggal_Publish); })
    .slice(0, 3);

  let html = '<div class="wrap"><nav class="crumbs"><a href="#/beranda">Beranda</a><span class="sep">›</span>' +
    '<a href="#/berita">Berita</a><span class="sep">›</span><span>' + UI.esc(UI.potong(b.Judul, 48)) + '</span></nav></div>';

  html += '<section class="section" style="padding-top:.5rem"><div class="wrap"><article class="article">' +
    '<div style="display:flex;align-items:center;gap:.6rem;flex-wrap:wrap;margin-bottom:.9rem">' +
      '<span class="badge badge-primary">' + UI.esc(b.Kategori || 'Berita') + '</span>' +
      '<span class="text-muted" style="font-size:12.5px">' + ICON.kalender.replace('18','13') + ' ' + UI.tanggal(b.Tanggal_Publish, 'panjang') + '</span>' +
      '<span class="text-muted" style="font-size:12.5px">' + ICON.orang.replace('18','13') + ' ' + UI.esc(b.Penulis || 'Redaksi Kecamatan') + '</span>' +
    '</div>' +
    '<h1>' + UI.esc(b.Judul) + '</h1>' +
    '<p class="lead">' + UI.esc(b.Ringkasan || '') + '</p>' +
    '<div class="article-hero">' + UI.gambar(b.Foto_Cover, b.Judul) + '</div>' +
    '<div class="article-body">' + UI.paragraf(b.Isi) + '</div>' +
    '<div class="card card-pad" style="margin-top:2rem;background:var(--container-low);display:flex;gap:1rem;align-items:center;flex-wrap:wrap">' +
      '<div class="quick-icon">' + ICON.aduan + '</div>' +
      '<div style="flex:1;min-width:220px"><strong>Punya masukan atas berita ini?</strong>' +
      '<p style="font-size:13px;color:var(--text-soft);margin:.2rem 0 0">Sampaikan aspirasi Anda melalui kanal pengaduan resmi kecamatan.</p></div>' +
      '<a class="btn btn-secondary btn-sm" href="#/pengaduan">Kirim Aspirasi</a>' +
    '</div>' +
  '</article></div></section>';

  if (lain.length) {
    html += '<section class="section alt"><div class="wrap">' +
      '<h2 class="section-title" style="font-size:22px;margin-bottom:1rem">Berita Lainnya</h2>' +
      '<div class="grid grid-3">' + lain.map(H.kartuBerita).join('') + '</div>' +
    '</div></section>';
  }

  return { html: html, init: function () { window.scrollTo({ top: 0 }); } };
};

/* ==========================================================================
   DOKUMEN PUBLIK
   ========================================================================== */
PAGES.dokumen = function () {
  const dok = DATA.Upload_Dokumen || [];
  const kategori = UI.unik(dok, 'Kategori');

  let html = H.kepala('Dokumen & Regulasi Publik',
    'Unduh SOP layanan, laporan transparansi anggaran, serta dokumen resmi lain yang dipublikasikan kecamatan.', 'Dokumen Publik');

  html += '<section class="section"><div class="wrap">' +
    '<div class="card card-pad" style="margin-bottom:1.25rem">' +
      '<div class="field" style="margin-bottom:.85rem"><label for="dokCari">Cari dokumen</label>' +
        '<input id="dokCari" type="search" placeholder="Nama dokumen atau kategori…"></div>' +
      '<div class="chips" id="dokKat">' +
        '<button class="chip active" data-kat="">Semua (' + dok.length + ')</button>' +
        kategori.map(function (k) { return '<button class="chip" data-kat="' + UI.esc(k) + '">' + UI.esc(k) + '</button>'; }).join('') +
      '</div>' +
    '</div>' +
    '<div class="card" id="dokList"></div>' +
    '<div class="banner banner-info" style="margin-top:1.25rem">' + ICON.info +
      '<div><strong>Permohonan informasi publik</strong>' +
      'Dokumen yang belum tersedia di halaman ini dapat dimohonkan melalui formulir pengaduan dan aspirasi warga, sesuai UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik.</div></div>' +
  '</div></section>';

  return {
    html: html,
    init: function () {
      const elCari = document.getElementById('dokCari');
      const chips  = document.getElementById('dokKat');
      let kat = '';

      const render = function () {
        const hasil = dok.filter(function (d) {
          if (kat && d.Kategori !== kat) return false;
          return UI.cocok(d, ['Nama_Dokumen', 'Kategori'], elCari.value);
        });
        document.getElementById('dokList').innerHTML = hasil.length ? hasil.map(function (d, i) {
          const punyaTautan = !!d.Link_Drive;
          return '<div class="doc-item"' + (i < hasil.length - 1 ? ' style="border-bottom:1px solid var(--border)"' : '') + '>' +
            '<div class="doc-icon">' + ICON.dokumen + '</div>' +
            '<div class="doc-meta"><strong>' + UI.esc(d.Nama_Dokumen) + '</strong>' +
              '<span>' + UI.esc(d.Kategori || 'Umum') + ' · ' + UI.esc(d.Ukuran || '—') + ' · Diunggah ' + UI.tanggal(d.Tanggal_Upload, 'pendek') + '</span></div>' +
            (punyaTautan
              ? '<a class="btn btn-outline btn-sm" href="' + UI.esc(d.Link_Drive) + '" target="_blank" rel="noopener">' + ICON.unduh.replace('18','14') + ' Unduh</a>'
              : '<span class="badge">Berkas menyusul</span>') +
          '</div>';
        }).join('') : UI.kosong('Dokumen tidak ditemukan', 'Belum ada dokumen publik pada kategori ini.');
      };

      chips.addEventListener('click', function (e) {
        const b = e.target.closest('button');
        if (!b) return;
        chips.querySelectorAll('button').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        kat = b.dataset.kat; render();
      });
      elCari.addEventListener('input', render);
      render();
    }
  };
};

/* ==========================================================================
   PENCARIAN GLOBAL
   ========================================================================== */
PAGES.cari = function (params) {
  const q = params.q || '';
  const hasil = {
    Berita:  (DATA.Berita || []).filter(function (b) { return UI.cocok(b, ['Judul','Ringkasan','Isi','Kategori'], q); }),
    Desa:    (DATA.Data_Desa || []).filter(function (d) { return UI.cocok(d, ['Nama_Desa','Kepala_Desa','Deskripsi'], q); }),
    UMKM:    (DATA.Data_UMKM || []).filter(function (u) { return UI.cocok(u, ['Nama_Usaha','Desa','Jenis_Usaha','Deskripsi'], q); }),
    Dokumen: (DATA.Upload_Dokumen || []).filter(function (d) { return UI.cocok(d, ['Nama_Dokumen','Kategori'], q); }),
    Agenda:  (DATA.Agenda_Kegiatan || []).filter(function (a) { return UI.cocok(a, ['Nama_Kegiatan','Lokasi','Deskripsi'], q); })
  };
  const total = Object.keys(hasil).reduce(function (a, k) { return a + hasil[k].length; }, 0);

  let html = H.kepala('Hasil Pencarian',
    total + ' hasil ditemukan untuk kata kunci "' + q + '".', 'Pencarian');

  html += '<section class="section"><div class="wrap">' +
    '<div class="card card-pad" style="margin-bottom:1.5rem">' +
      '<div class="search-field" style="background:#fff;border-color:var(--border-strong)">' + ICON.cari +
      '<input id="cariUlang" type="search" value="' + UI.esc(q) + '" placeholder="Cari lagi…"></div>' +
    '</div>';

  if (!total) {
    html += UI.kosong('Tidak ada hasil', 'Coba kata kunci yang lebih umum, misalnya nama desa atau jenis layanan.');
  } else {
    if (hasil.Berita.length) {
      html += '<h3 style="font-size:19px;margin:0 0 .85rem">Berita (' + hasil.Berita.length + ')</h3>' +
              '<div class="grid grid-3" style="margin-bottom:2rem">' + hasil.Berita.slice(0, 6).map(H.kartuBerita).join('') + '</div>';
    }
    if (hasil.Desa.length) {
      html += '<h3 style="font-size:19px;margin:0 0 .85rem">Data Desa (' + hasil.Desa.length + ')</h3>' +
              '<div class="grid grid-3" style="margin-bottom:2rem">' + hasil.Desa.map(H.kartuDesa).join('') + '</div>';
    }
    if (hasil.UMKM.length) {
      html += '<h3 style="font-size:19px;margin:0 0 .85rem">UMKM & Potensi (' + hasil.UMKM.length + ')</h3>' +
        '<div class="card" style="margin-bottom:2rem">' + hasil.UMKM.map(function (u, i) {
          return '<div class="doc-item"' + (i < hasil.UMKM.length - 1 ? ' style="border-bottom:1px solid var(--border)"' : '') + '>' +
            '<div class="doc-icon" style="background:var(--container);color:var(--primary)">' + ICON.toko + '</div>' +
            '<div class="doc-meta"><strong>' + UI.esc(u.Nama_Usaha) + '</strong>' +
            '<span>Desa ' + UI.esc(u.Desa) + ' · ' + UI.esc(u.Jenis_Usaha) + '</span></div>' +
            '<a class="btn btn-outline btn-sm" href="#/umkm?q=' + encodeURIComponent(u.Nama_Usaha) + '">Lihat</a></div>';
        }).join('') + '</div>';
    }
    if (hasil.Agenda.length) {
      html += '<h3 style="font-size:19px;margin:0 0 .85rem">Agenda (' + hasil.Agenda.length + ')</h3>' +
        '<div class="card" style="margin-bottom:2rem">' + hasil.Agenda.map(function (a, i) {
          return '<div class="doc-item"' + (i < hasil.Agenda.length - 1 ? ' style="border-bottom:1px solid var(--border)"' : '') + '>' +
            '<div class="doc-icon" style="background:var(--container);color:var(--primary)">' + ICON.kalender + '</div>' +
            '<div class="doc-meta"><strong>' + UI.esc(a.Nama_Kegiatan) + '</strong>' +
            '<span>' + UI.tanggal(a.Tanggal, 'pendek') + ' · ' + UI.esc(a.Lokasi || '-') + '</span></div>' +
            '<a class="btn btn-outline btn-sm" href="#/agenda">Lihat</a></div>';
        }).join('') + '</div>';
    }
    if (hasil.Dokumen.length) {
      html += '<h3 style="font-size:19px;margin:0 0 .85rem">Dokumen (' + hasil.Dokumen.length + ')</h3>' +
        '<div class="card">' + hasil.Dokumen.map(function (d, i) {
          return '<div class="doc-item"' + (i < hasil.Dokumen.length - 1 ? ' style="border-bottom:1px solid var(--border)"' : '') + '>' +
            '<div class="doc-icon">' + ICON.dokumen + '</div>' +
            '<div class="doc-meta"><strong>' + UI.esc(d.Nama_Dokumen) + '</strong><span>' + UI.esc(d.Kategori) + '</span></div>' +
            '<a class="btn btn-outline btn-sm" href="#/dokumen">Lihat</a></div>';
        }).join('') + '</div>';
    }
  }
  html += '</div></section>';

  return {
    html: html,
    init: function () {
      const el = document.getElementById('cariUlang');
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') location.hash = '#/cari?q=' + encodeURIComponent(el.value);
      });
    }
  };
};
