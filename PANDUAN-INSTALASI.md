# 📘 Panduan Instalasi — Website Kantor Kecamatan

Panduan ini ditulis untuk pengguna yang **belum pernah memakai Git/GitHub**. Ikuti berurutan dari Bagian A ke Bagian C. Jangan melompati langkah.

**Yang akan Anda bangun:**

```
┌──────────────────────────────┐        ┌──────────────────────────────┐
│  FRONTEND (GitHub Pages)     │ fetch  │  BACKEND (Google Apps Script)│
│  index.html + admin.html     │ ─────► │  Kode.gs → doGet / doPost    │
│  Gratis, cepat, punya HTTPS  │ ◄───── │  Google Sheets + Drive       │
└──────────────────────────────┘  JSON  └──────────────────────────────┘
```

Isi paket yang Anda terima:

| Berkas | Untuk apa |
|---|---|
| `Kode.gs` | Disalin-tempel ke editor Google Apps Script (**bukan** ke GitHub) |
| `appsscript.json` | Opsional — pengaturan manifest Apps Script |
| `website-kecamatan.zip` | Berkas frontend yang diunggah ke GitHub Pages |
| `PANDUAN-INSTALASI.md` | Dokumen yang sedang Anda baca |

> ⚠️ **Jangan pernah memasukkan `Kode.gs` ke dalam folder GitHub.** Berkas itu milik Apps Script. Kalau ikut terunggah, ia hanya jadi sampah di repositori publik.

---

## BAGIAN A — Menyiapkan Backend (Google Apps Script)

### A1. Buat proyek Apps Script

1. Buka **https://script.google.com** dengan akun Google resmi kecamatan.
2. Klik **New project / Proyek baru**.
3. Ganti nama proyek (klik "Untitled project" di kiri atas) menjadi **API Website Kecamatan**.

### A2. Tempel kode backend

1. Hapus seluruh isi berkas `Code.gs` bawaan (Ctrl+A lalu Delete).
2. Buka berkas **`Kode.gs`** dari paket ini, salin **semuanya**, tempel ke editor.
3. Tekan **Ctrl+S** untuk menyimpan.

### A3. Jalankan setup — **HANYA SATU KALI**

1. Pada dropdown fungsi di atas editor, pilih **`setupAppEnvironment`**.
2. Klik **▶ Run**.
3. Muncul jendela izin → **Review permissions** → pilih akun → **Advanced** → **Go to (nama proyek) (unsafe)** → **Allow**.
   > Peringatan "unsafe" itu normal untuk skrip buatan sendiri yang belum diverifikasi Google. Anda sedang memberi izin kepada kode Anda sendiri.
4. Buka panel **Execution log** di bawah. Pastikan muncul:

```
✅ SETUP SELESAI
   Spreadsheet : https://docs.google.com/spreadsheets/d/...
   Folder Drive: https://drive.google.com/drive/folders/...
   Login admin  → username: admin   password: admin123
```

5. Cek Google Drive Anda — harus ada folder **📁 Website Kantor Kecamatan** berisi sub-folder `Berita`, `Galeri`, `Dokumen`, `Pengaduan`, `Umum`, dan satu spreadsheet **🗃️ Database — Website Kantor Kecamatan**.

> ❌ **Jangan menjalankan `setupAppEnvironment` lebih dari sekali.** Fungsi ini sudah punya pengaman: bila dijalankan ulang ia akan berhenti dan menulis peringatan di log, bukan membuat folder ganda.

### A4. Deploy sebagai Web App

1. Klik tombol **Deploy** (kanan atas) → **New deployment**.
2. Klik ikon roda gigi ⚙️ di sebelah "Select type" → pilih **Web app**.
3. Isi:

| Kolom | Nilai |
|---|---|
| Description | `v1` |
| Execute as | **Me** (akun Anda sendiri) |
| Who has access | **Anyone** |

4. Klik **Deploy** → **Authorize access** bila diminta.
5. **SALIN URL Web app** yang muncul. Bentuknya:

```
https://script.google.com/macros/s/AKfycbx...panjang.../exec
```

> 📌 Simpan URL ini di Notepad. URL inilah yang dipakai di Bagian B.

### A5. Uji backend

Tempel URL `/exec` tadi ke tab browser baru dan tambahkan `?action=ping`:

```
https://script.google.com/macros/s/AKfycbx.../exec?action=ping
```

Bila muncul teks seperti `{"success":true,"message":"API Kecamatan aktif",...}` → backend Anda sudah hidup. ✅

---

## BAGIAN B — Menyiapkan Berkas Frontend

### B1. Ekstrak ZIP

1. Unduh **`website-kecamatan.zip`**.
2. Klik kanan → **Extract All / Ekstrak Semua**.
3. Simpan hasilnya di tempat yang mudah dijangkau, misalnya:
   `C:\Users\NamaAnda\Documents\website-kecamatan`

Isi folder hasil ekstraksi **harus** seperti ini:

```
website-kecamatan\        ← INI folder kerja Anda
├── index.html            ← wajib ada di lapisan paling atas
├── admin.html
├── README.md
├── PANDUAN-INSTALASI.md
├── css\
│   ├── style.css
│   └── admin.css
└── js\
    ├── config.js
    ├── demo-data.js
    ├── ui.js
    ├── api.js
    ├── pages.js
    ├── pengaduan.js
    ├── app.js
    └── admin.js
```

> 🔴 **Ini gerbang terpenting di seluruh panduan.** GitHub Pages hanya melihat `index.html` yang berada di lapisan paling atas repositori. Bila Anda membuat folder pembungkus tambahan, situs akan menampilkan **404** padahal semua perintah git berhasil tanpa satu pun pesan error.

### B2. Isi `GAS_URL` — **JANGAN DILEWATI**

1. Buka `js\config.js` dengan **Notepad** (klik kanan → Open with → Notepad).
2. Cari baris paling atas:

```javascript
  GAS_URL: '',
```

3. Tempel URL `/exec` dari langkah A4 di antara tanda kutip:

```javascript
  GAS_URL: 'https://script.google.com/macros/s/AKfycbx.../exec',
```

4. Simpan (Ctrl+S), tutup Notepad.

> Bila langkah ini dilewati, situs tetap tampil tetapi memakai **data contoh** dan akan menampilkan pita peringatan kuning di bagian atas halaman.

### B3. Coba dulu di komputer sendiri (opsional tapi disarankan)

Klik dua kali `index.html`. Situs akan terbuka di browser. Periksa: berita tampil, menu berpindah, formulir pengaduan terbuka. Untuk panel admin, buka `admin.html` lalu masuk dengan **admin / admin123**.

---

## BAGIAN C — Menayangkan ke GitHub Pages

### C1. Pasang Git

| Sistem | Cara |
|---|---|
| **Windows** | Unduh di https://git-scm.com/download/win → pasang dengan pengaturan bawaan (klik Next terus) |
| **Mac** | Buka Terminal, ketik `git --version` — macOS menawarkan pemasangan otomatis |
| **Linux** | `sudo apt install git` |

Setelah terpasang, buka **PowerShell** (Windows) atau **Terminal**, lalu periksa:

```bash
git --version
```

Harus muncul misalnya `git version 2.45.1`.

### C2. Buat akun GitHub

Daftar di **https://github.com**. Username yang Anda pilih akan menjadi bagian alamat situs nanti (`https://username.github.io/nama-repo/`), jadi pilihlah yang pantas, misalnya `kecamatan-nusantara`.

### C3. Atur identitas Git (cukup sekali seumur hidup komputer itu)

```bash
git config --global user.name "Admin Kecamatan"
git config --global user.email "email-akun-github@contoh.com"
```

> `user.name` bebas — hanya label pada riwayat perubahan. `user.email` sebaiknya sama dengan email akun GitHub.

### C4. Buat repositori di GitHub

1. Di github.com klik tombol **+** (kanan atas) → **New repository**.
2. **Repository name:** `website-kecamatan`
3. Pilih **Public**.
   > GitHub Pages gratis hanya untuk repositori publik. Ini aman — berkas frontend tidak memuat password apa pun, hanya alamat API yang memang bersifat publik.
4. **JANGAN** mencentang "Add a README file", ".gitignore", maupun "license".
5. Klik **Create repository**. Biarkan halaman hasilnya terbuka.

### C5. Masuk ke folder proyek — periksa dulu, baru `git init`

Cara tercepat di Windows: buka folder `website-kecamatan` di File Explorer, klik pada kolom alamat, ketik `powershell`, tekan Enter. PowerShell langsung terbuka di folder itu.

Atau ketik manual:

```powershell
cd "C:\Users\NamaAnda\Documents\website-kecamatan"
```

**Lalu periksa isinya:**

```powershell
dir
```

(di Mac/Linux/Git Bash: `ls -la`)

Yang **wajib** terlihat: `index.html`, `admin.html`, folder `css`, folder `js`.

- Kalau yang muncul justru sebuah folder bernama `website-kecamatan` → Anda satu tingkat terlalu tinggi. Ketik `cd website-kecamatan` lalu periksa lagi.
- Kalau muncul `Kode.gs` → pindahkan berkas itu keluar dari folder ini sebelum lanjut.

**Jangan lanjut sebelum `index.html` terlihat.** Git akan menerima folder yang salah tanpa protes sedikit pun.

### C6. Kirim ke GitHub — satu perintah, satu pemeriksaan

**C6a. Siapkan repositori lokal:**
```bash
git init
```
Hasil normal: `Initialized empty Git repository in ...`

**C6b. Tambahkan semua berkas:**
```bash
git add .
```
> ⚠️ Ada **titik** di akhir, artinya "semua berkas di folder ini". Tidak ada keluaran apa pun = berhasil.

**C6c. Simpan sebagai commit:**
```bash
git commit -m "Website kecamatan versi pertama"
```
Hasil normal: daftar berkas seperti `create mode 100644 index.html`.

**C6d. Namai cabang utama:**
```bash
git branch -M main
```

**C6e. Sambungkan ke GitHub** (ganti `USERNAME`):
```bash
git remote add origin https://github.com/USERNAME/website-kecamatan.git
```
> Bila muncul `remote origin already exists`, lewati saja. Bila URL-nya salah: `git remote set-url origin https://github.com/USERNAME/website-kecamatan.git`

**C6f. Unggah:**
```bash
git push -u origin main
```

Saat diminta:
- **Username:** username GitHub Anda
- **Password:** **Personal Access Token**, bukan password akun

> 💡 Ketika Anda mengetik atau menempel token, **layar tetap kosong** — tidak ada bintang atau karakter yang muncul. Ini normal, bukan tanda gagal. Di PowerShell tempel dengan klik kanan; di Git Bash dengan Shift+Insert. Lalu tekan Enter.

Tanda sukses: muncul `Writing objects: 100%` dan `* [new branch] main -> main`.

### C7. Bila muncul "Password authentication is not supported"

Itu bukan kerusakan — GitHub memang menolak password akun biasa. Buat token:

1. Buka **https://github.com/settings/tokens**
2. **Generate new token** → **Generate new token (classic)**
3. Isi:
   - **Note:** `token-website-kecamatan`
   - **Expiration:** `90 days` (atau `No expiration`)
   - **Centang scope:** ✅ **repo**
4. **Generate token** → **salin token** (`ghp_...`). Token hanya tampil **sekali** — simpan dulu di Notepad.
5. Jalankan `git push -u origin main` lagi, tempel token sebagai password.

> Terlalu repot? Gunakan **GitHub Desktop** (https://desktop.github.com): login lewat browser → **Add Local Repository** → pilih folder → **Publish repository**. Tanpa ketik token sama sekali.

### C8. Aktifkan GitHub Pages

1. Buka repositori Anda di browser: `https://github.com/USERNAME/website-kecamatan`
2. Pastikan yang terlihat di lapisan atas adalah `index.html`, `admin.html`, folder `css/`, folder `js/` — **bukan** satu folder tunggal.
3. Klik tab **Settings** → menu **Pages** di sisi kiri.
4. Isi:

| Kolom | Nilai |
|---|---|
| Source | **Deploy from a branch** |
| Branch | **main** · **/ (root)** |
| Enforce HTTPS | ✅ dicentang |

5. Klik **Save**. Tunggu 1–2 menit, muat ulang halaman. Muncul:

> Your site is live at `https://USERNAME.github.io/website-kecamatan/`

### C9. Uji situs yang sudah tayang

Buka alamat tersebut, lalu periksa:

- [ ] Beranda tampil lengkap dengan warna dan tata letak (bukan teks polos)
- [ ] **Tidak ada** pita kuning "Situs berjalan dalam mode contoh" → artinya `GAS_URL` sudah benar
- [ ] Berita, data desa, dan statistik menampilkan data dari Google Sheets Anda
- [ ] Buka `https://USERNAME.github.io/website-kecamatan/admin.html` → masuk dengan **admin / admin123**
- [ ] Coba kirim satu pengaduan uji dari menu Pengaduan → periksa sheet `Pengaduan` di spreadsheet

### C10. Ganti password admin — **lakukan sekarang**

Di panel admin: **Pengaturan Akun** → isi password lama `admin123` → isi password baru → **Perbarui Akun**.

---

## 🔄 Cara Memperbarui Situs Setelah Ada Perubahan

Setiap kali ada berkas yang diubah, jalankan tiga perintah ini dari folder proyek:

```bash
git add .
git commit -m "Keterangan singkat perubahan"
git push
```

GitHub Pages membangun ulang dalam 1–2 menit. Bila halaman masih versi lama, tekan **Ctrl+Shift+R** (muat ulang paksa) atau buka di jendela **Incognito**.

> Mengubah isi berita, data desa, atau pengaduan **tidak perlu** git sama sekali — cukup lewat panel admin. Git hanya diperlukan bila Anda mengubah berkas program (HTML/CSS/JS).

---

## 🛠️ Mengatasi Masalah Umum

| Yang terlihat | Penyebab | Solusi |
|---|---|---|
| Halaman **404 — File not found** | `index.html` tidak berada di lapisan atas repositori | Buka repo di browser: bila yang terlihat sebuah folder, bukan `index.html`, ulangi dari **C5** di folder yang benar, lalu `git push -u origin main --force` |
| Halaman tampil **tanpa warna/tata letak** | Folder `css/` dan `js/` tidak ikut terunggah | Pastikan Anda memakai terminal (`git add .`), **bukan** fitur "Upload files" di web GitHub yang merusak struktur folder |
| Pita kuning **"mode contoh"** masih muncul | `GAS_URL` di `js/config.js` masih kosong atau salah | Perbaiki berkas itu, lalu `git add . && git commit -m "isi GAS_URL" && git push` |
| Data tidak muncul, konsol berisi galat CORS | Deployment Apps Script belum "Anyone" | Apps Script → Deploy → Manage deployments → Edit → Who has access: **Anyone** |
| Perubahan konten admin tidak tampil di situs publik | Cache backend (5 menit) | Tunggu sebentar lalu muat ulang, atau klik tombol muat ulang di panel admin |
| `fatal: not a git repository` | `git init` belum dijalankan / folder salah | Jalankan `dir` dulu, pastikan `index.html` terlihat, baru `git init` |
| `remote origin already exists` | Sudah pernah disambungkan | Lewati, langsung `git push` |
| `src refspec main does not match any` | Belum ada commit | Jalankan `git add .` lalu `git commit -m "Upload pertama"` |
| `Updates were rejected...` | Repo GitHub sudah berisi berkas (README) | `git pull --rebase origin main` lalu `git push` |
| Peringatan `LF will be replaced by CRLF` | Perbedaan format baris Windows vs Linux | **Abaikan** — ini peringatan, bukan galat |
| Layar kosong saat mengetik password | Perilaku normal terminal | Tetap ketik/tempel lalu Enter |
| Login admin gagal terus | Password sudah diganti / salah ketik | Buka spreadsheet → sheet `Admin_Users` → hapus baris admin → jalankan lagi bagian setup akun, atau minta bantuan teknis |
| Foto yang diunggah tidak tampil | Berkas Drive belum publik | Backend sudah mengatur ini otomatis; periksa apakah folder Drive dipindahkan secara manual |

---

## 📚 Istilah Singkat

- **Repository (repo)** — folder proyek di GitHub, semacam Google Drive-nya pemrogram
- **Commit** — menyimpan perubahan dengan catatan singkat (seperti "Save" yang tercatat riwayatnya)
- **Push** — mengirim commit dari komputer ke GitHub (seperti "Upload")
- **Branch** — cabang/versi proyek; yang dipakai di sini bernama `main`
- **Personal Access Token** — "password khusus" dari GitHub untuk operasi Git lewat terminal
- **PowerShell / Git Bash** — jendela terminal tempat mengetik perintah git
- **Web App /exec** — alamat backend Apps Script yang mengirim data dalam format JSON

---

## 🔐 Catatan Keamanan & Perawatan

1. **Ganti password bawaan `admin123`** segera setelah instalasi.
2. Repositori GitHub bersifat publik — **jangan** pernah menaruh berkas `.gs`, kunci API, atau data pribadi warga di dalamnya. Data pengaduan tersimpan di Google Sheets milik kecamatan, bukan di GitHub.
3. Backend memakai kuota gratis Apps Script. Dengan perkiraan 10–20 pengunjung per hari, kuota sangat aman.
4. Lakukan pengarsipan berkala bila baris pada sheet `Berita`, `Galeri_Foto`, atau `Pengaduan` sudah sangat banyak (di atas beberapa ribu baris), agar pembacaan data tetap cepat.
5. Setiap kali Anda mengubah `Kode.gs`, **deploy ulang**: Deploy → Manage deployments → ikon pensil → Version: **New version** → Deploy. URL `/exec` tidak berubah.

---

## 🗂️ Lampiran — Struktur Database Google Sheets

Setup otomatis membuat sheet berikut di dalam satu spreadsheet:

| Sheet | Isi |
|---|---|
| `Profil_Kecamatan` | Sejarah, visi, misi, struktur organisasi |
| `Data_Geografis` | Batas wilayah, luas, ketinggian |
| `Data_Desa` | Profil tiap desa binaan |
| `Statistik_Penduduk` | Data kependudukan per desa per tahun |
| `Data_UMKM` | Direktori usaha & potensi desa |
| `Agenda_Kegiatan` | Jadwal kegiatan kecamatan |
| `Galeri_Foto` | Dokumentasi foto per album |
| `Pengumuman` | Pengumuman resmi (Tayang/Draft) |
| `Berita` | Berita (Published/Draft) |
| `Pengaduan` | Laporan warga + tindak lanjut internal |
| `Admin_Users` | Akun admin (password ter-hash SHA-256 bersalt) |
| `Upload_Dokumen` | Dokumen publik & internal |
| `Pengaturan_Situs` | Identitas situs (nama, alamat, kontak, koordinat peta) |

Anda boleh menyunting isi sel langsung di spreadsheet bila perlu, **tetapi jangan mengubah nama sheet maupun judul kolom pada baris pertama** — keduanya dipakai oleh program.
