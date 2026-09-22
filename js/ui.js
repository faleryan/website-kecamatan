/* ==========================================================================
   UTILITAS TAMPILAN — dipakai bersama oleh halaman publik & panel admin
   ========================================================================== */

const UI = {

  /* ---------- Keamanan teks ---------- */
  /** Selalu pakai ini sebelum menyisipkan data ke innerHTML. */
  esc(v) {
    if (v === null || v === undefined) return '';
    return String(v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  },

  /** Teks multi-baris menjadi paragraf HTML yang aman. */
  paragraf(teks) {
    return String(teks || '').split(/\n{2,}/)
      .filter(function (p) { return p.trim(); })
      .map(function (p) { return '<p>' + UI.esc(p).replace(/\n/g, '<br>') + '</p>'; })
      .join('');
  },

  /* ---------- Format ---------- */
  angka(n) {
    const v = Number(n);
    return isNaN(v) ? '0' : v.toLocaleString('id-ID');
  },

  persen(n, total) {
    if (!total) return '0%';
    return ((Number(n) / Number(total)) * 100).toFixed(1).replace('.', ',') + '%';
  },

  BULAN: ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'],
  BULAN_SINGKAT: ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'],
  HARI: ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'],

  tanggal(nilai, gaya) {
    const d = this.keDate(nilai);
    if (!d) return '-';
    if (gaya === 'panjang') return this.HARI[d.getDay()] + ', ' + d.getDate() + ' ' + this.BULAN[d.getMonth()] + ' ' + d.getFullYear();
    if (gaya === 'pendek')  return d.getDate() + ' ' + this.BULAN_SINGKAT[d.getMonth()] + ' ' + d.getFullYear();
    if (gaya === 'input')   return d.toISOString().slice(0, 10);
    return d.getDate() + ' ' + this.BULAN[d.getMonth()] + ' ' + d.getFullYear();
  },

  waktu(nilai) {
    const d = this.keDate(nilai);
    if (!d) return '';
    return ('0' + d.getHours()).slice(-2) + '.' + ('0' + d.getMinutes()).slice(-2);
  },

  keDate(nilai) {
    if (!nilai) return null;
    const d = (nilai instanceof Date) ? nilai : new Date(nilai);
    return isNaN(d.getTime()) ? null : d;
  },

  /** "3 hari lalu", "hari ini", dst. */
  relatif(nilai) {
    const d = this.keDate(nilai);
    if (!d) return '';
    const selisih = Math.round((Date.now() - d.getTime()) / 86400000);
    if (selisih === 0) return 'Hari ini';
    if (selisih === 1) return 'Kemarin';
    if (selisih > 1 && selisih < 30) return selisih + ' hari lalu';
    if (selisih < 0 && selisih > -30) return Math.abs(selisih) + ' hari lagi';
    return this.tanggal(d, 'pendek');
  },

  potong(teks, maks) {
    const t = String(teks || '');
    return t.length > maks ? t.slice(0, maks).trim() + '…' : t;
  },

  ukuranBerkas(bytes) {
    const b = Number(bytes) || 0;
    if (b < 1024) return b + ' B';
    if (b < 1048576) return (b / 1024).toFixed(0) + ' KB';
    return (b / 1048576).toFixed(1).replace('.', ',') + ' MB';
  },

  /* ---------- Gambar ---------- */
  /** Angka hue stabil dari sebuah teks — untuk gradasi gambar pengganti. */
  hue(teks) {
    let h = 0;
    const s = String(teks || 'x');
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
    return 218 + (h % 48); // rentang biru–indigo agar selaras dengan tema
  },

  /**
   * Menghasilkan elemen gambar. Bila URL kosong (foto belum diunggah admin),
   * tampilkan blok gradasi berlabel, bukan gambar rusak.
   */
  gambar(url, judul, kelas) {
    if (!url) return this.placeholder(judul);
    const k = kelas ? ' ' + kelas : '';
    // Judul disimpan di data-ph (sudah di-escape), lalu dibaca oleh
    // UI.gantiPlaceholder bila berkas gagal dimuat — tanpa menyisipkan
    // kode JavaScript berisi tanda kutip ke dalam atribut HTML.
    return '<img class="' + k.trim() + '" src="' + this.esc(url) + '" alt="' + this.esc(judul) + '" loading="lazy" ' +
           'data-ph="' + this.esc(judul) + '" style="width:100%;height:100%;object-fit:cover" ' +
           'onerror="UI.gantiPlaceholder(this)">';
  },

  /** Dipanggil saat gambar gagal dimuat — diganti blok gradasi berlabel. */
  gantiPlaceholder(img) {
    try { img.outerHTML = UI.placeholder(img.getAttribute('data-ph') || ''); } catch (e) {}
  },

  placeholder(judul) {
    const teks = String(judul || '').trim();
    const inisial = teks ? teks.split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase() : '★';
    return '<div class="ph" style="--h:' + this.hue(teks) + '"><span class="ph-label">' + this.esc(inisial) + '</span></div>';
  },

  /* ---------- Umpan balik ---------- */
  notif(pesan, tipe) {
    let el = document.getElementById('notif');
    if (!el) {
      el = document.createElement('div');
      el.id = 'notif';
      document.body.appendChild(el);
    }
    el.className = 'notif notif-' + (tipe || 'info') + ' show';
    el.textContent = pesan;
    clearTimeout(this._notifTimer);
    this._notifTimer = setTimeout(function () { el.classList.remove('show'); }, 4200);
  },

  muat(tampil) {
    const el = document.getElementById('loading');
    if (el) el.classList.toggle('show', !!tampil);
  },

  kosong(judul, pesan) {
    return '<div class="empty-state">' +
      '<div class="ei">' + ICON.inbox + '</div>' +
      '<h3>' + this.esc(judul) + '</h3>' +
      '<p>' + this.esc(pesan || '') + '</p></div>';
  },

  kerangka(jumlah, tinggi) {
    let out = '';
    for (let i = 0; i < (jumlah || 3); i++) {
      out += '<div class="skeleton" style="height:' + (tinggi || 180) + 'px;margin-bottom:1rem"></div>';
    }
    return out;
  },

  /* ---------- Lain-lain ---------- */
  unik(daftar, kunci) {
    const set = [];
    (daftar || []).forEach(function (o) {
      const v = String(o[kunci] || '').trim();
      if (v && set.indexOf(v) === -1) set.push(v);
    });
    return set.sort(function (a, b) { return a.localeCompare(b, 'id'); });
  },

  cocok(objek, kolom, kueri) {
    const q = String(kueri || '').trim().toLowerCase();
    if (!q) return true;
    return kolom.some(function (k) {
      return String(objek[k] || '').toLowerCase().indexOf(q) > -1;
    });
  },

  /** Kelas lencana untuk status pengaduan. */
  kelasStatus(status) {
    const s = String(status || '').toLowerCase();
    if (s.indexOf('selesai') > -1)  return 'badge-success';
    if (s.indexOf('proses') > -1 || s.indexOf('lapangan') > -1) return 'badge-info';
    if (s.indexOf('tolak') > -1)    return 'badge-danger';
    return 'badge-warning';
  }
};

/* ==========================================================================
   IKON SVG SEBARIS (tanpa pustaka eksternal, aman untuk offline)
   ========================================================================== */
const ICON = (function () {
  const w = function (isi, ukuran) {
    return '<svg width="' + (ukuran || 18) + '" height="' + (ukuran || 18) + '" viewBox="0 0 24 24" fill="none" ' +
           'stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + isi + '</svg>';
  };
  return {
    cari:     w('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
    kirim:    w('<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>'),
    dokumen:  w('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/>'),
    unduh:    w('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>'),
    unggah:   w('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>'),
    kamera:   w('<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3Z"/><circle cx="12" cy="13" r="3.5"/>'),
    peta:     w('<path d="m9 3-6 3v15l6-3 6 3 6-3V3l-6 3Z"/><path d="M9 3v15"/><path d="M15 6v15"/>'),
    pin:      w('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>'),
    jam:      w('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    kalender: w('<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'),
    telepon:  w('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.6a16 16 0 0 0 6 6l1.1-1.2a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z"/>'),
    surel:    w('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/>'),
    orang:    w('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'),
    grup:     w('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/>'),
    rumah:    w('<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M9 22V12h6v10"/>'),
    gedung:   w('<path d="M3 21h18"/><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/>'),
    grafik:   w('<path d="M3 3v18h18"/><path d="m7 14 3-4 4 3 5-7"/>'),
    toko:     w('<path d="M3 9 4.5 4h15L21 9"/><path d="M4 9v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9"/><path d="M3 9h18"/><path d="M9 21v-6h6v6"/>'),
    megafon:  w('<path d="M3 11v2a1 1 0 0 0 1 1h3l6 4V6L7 10H4a1 1 0 0 0-1 1Z"/><path d="M17 8a5 5 0 0 1 0 8"/>'),
    berita:   w('<path d="M4 4h13a1 1 0 0 1 1 1v14a2 2 0 0 0 2 2H5a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1Z"/><path d="M7 8h7M7 12h7M7 16h4"/>'),
    aduan:    w('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/><path d="M12 7v5M12 15h.01"/>'),
    perisai:  w('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>'),
    ceklis:   w('<path d="M20 6 9 17l-5-5"/>'),
    silang:   w('<path d="M18 6 6 18M6 6l12 12"/>'),
    panah:    w('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>'),
    bawah:    w('<path d="m6 9 6 6 6-6"/>'),
    menu:     w('<path d="M3 6h18M3 12h18M3 18h18"/>'),
    inbox:    w('<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5.5 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.5A2 2 0 0 0 16.7 4H7.3a2 2 0 0 0-1.8 1.5Z"/>'),
    info:     w('<circle cx="12" cy="12" r="9"/><path d="M12 16v-5M12 8h.01"/>'),
    peringatan:w('<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>'),
    kunci:    w('<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'),
    keluar:   w('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>'),
    plus:     w('<path d="M12 5v14M5 12h14"/>'),
    ubah:     w('<path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>'),
    hapus:    w('<path d="M3 6h18"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>'),
    simpan:   w('<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8M7 3v5h8"/>'),
    galeri:   w('<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>'),
    filter:   w('<path d="M3 4h18l-7 8v6l-4 2v-8Z"/>'),
    segar:    w('<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v6h-6"/>'),
    wa:       w('<path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.7-5.4A8.4 8.4 0 1 1 21 11.5Z"/><path d="M8.5 9.5c0 3 2 5 5 5"/>')
  };
})();
