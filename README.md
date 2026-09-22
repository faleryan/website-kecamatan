# Website Kantor Kecamatan — Portal Publik & Panel Admin

Situs statis (HTML/CSS/JS murni, tanpa framework) yang terhubung ke **Google Apps Script** sebagai REST API, dengan **Google Sheets** sebagai basis data dan **Google Drive** sebagai penyimpanan berkas.

- **Halaman publik** → `index.html`
- **Panel admin** → `admin.html`

## Isi folder

```
website-kecamatan/
├── index.html          Portal publik (SPA dengan perutean hash)
├── admin.html          Panel administrasi
├── css/
│   ├── style.css       Sistem desain publik (token warna, tipografi, komponen)
│   └── admin.css       Tata letak panel admin
└── js/
    ├── config.js       ⚠️ SATU-SATUNYA berkas yang perlu Anda edit (GAS_URL)
    ├── demo-data.js    Data contoh (dipakai bila backend belum terhubung)
    ├── ui.js           Utilitas format, ikon SVG, notifikasi
    ├── api.js          Pembungkus fetch ke Apps Script
    ├── pages.js        Render halaman publik
    ├── pengaduan.js    Formulir pengaduan warga
    ├── app.js          Perutean & kerangka halaman
    └── admin.js        Seluruh logika panel admin
```

## Cara memakai

1. Pasang backend `Kode.gs` di Google Apps Script, jalankan `setupAppEnvironment()` satu kali, lalu deploy sebagai Web App (Execute as: **Me**, access: **Anyone**).
2. Salin URL `/exec` hasil deploy ke `js/config.js`:

```javascript
GAS_URL: 'https://script.google.com/macros/s/AKfycbx.../exec',
```

3. Unggah seluruh isi folder ini ke GitHub Pages (langkah rinci ada di `PANDUAN-INSTALASI.md`).

> Bila `GAS_URL` masih kosong, situs tetap tampil utuh memakai data contoh dan menampilkan pita peringatan. Panel admin dapat dijelajahi dengan **admin / admin123** dalam mode ini, tanpa penyimpanan.

## Halaman publik

Beranda · Profil Kecamatan · Data Geografis & Peta · Data Desa · Statistik Penduduk (grafik + tabel filter) · UMKM & Potensi · Agenda Kegiatan · Galeri Foto · Pengumuman · Berita (daftar + detail) · Dokumen Publik · Formulir Pengaduan · Pencarian global.

## Modul panel admin

Dashboard · Kelola Pengaduan (disposisi, status, catatan internal) · Berita · Pengumuman · Profil Kecamatan · Data Geografis · Data Desa · Statistik Penduduk · UMKM · Agenda · Galeri · Dokumen · Pengaturan Situs · Pengaturan Akun.

## Catatan teknis

- Tidak ada `google.script.run`, iframe, maupun `HtmlService` — seluruh komunikasi lewat `fetch()` + JSON.
- Permintaan POST memakai header `text/plain;charset=utf-8` untuk menghindari CORS preflight yang diblokir Apps Script.
- Sesi admin disimpan pada `CacheService` di sisi server dan berakhir otomatis setelah 6 jam.
- Password admin disimpan sebagai hash SHA-256 bersalt, tidak pernah sebagai teks polos.
- Tidak ada pustaka eksternal: ikon berupa SVG sebaris, grafik dibuat dengan CSS. Hanya font Google dan peta OpenStreetMap yang dimuat dari luar.
- Responsif untuk desktop, tablet, dan ponsel; tersedia mode kontras tinggi untuk aksesibilitas.

## Perawatan

Perubahan isi konten dilakukan lewat panel admin (tidak perlu Git). Git hanya diperlukan bila berkas program di folder ini diubah.
