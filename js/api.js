/* ==========================================================================
   LAPISAN API — komunikasi ke Google Apps Script
   Semua permintaan memakai fetch(). POST WAJIB memakai
   Content-Type: text/plain;charset=utf-8 agar tidak memicu CORS preflight
   yang diblokir oleh Google Apps Script.
   ========================================================================== */

const API = {

  /** Status koneksi terakhir: 'live' (backend aktif) atau 'demo' (data contoh). */
  mode: 'belum',

  aktif() {
    return !!(APP_CONFIG.GAS_URL && APP_CONFIG.GAS_URL.indexOf('/exec') > -1);
  },

  /* ---------------- GET ---------------- */
  async get(action, params) {
    if (!this.aktif()) throw new Error('GAS_URL belum diisi pada js/config.js');
    const q = new URLSearchParams(Object.assign({ action: action }, params || {}));
    const res = await fetch(APP_CONFIG.GAS_URL + '?' + q.toString(), { method: 'GET' });
    if (!res.ok) throw new Error('Server menjawab dengan kode ' + res.status);
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Permintaan ditolak server.');
    return json;
  },

  /* ---------------- POST ---------------- */
  async post(action, data, token) {
    if (!this.aktif()) throw new Error('GAS_URL belum diisi pada js/config.js');
    const res = await fetch(APP_CONFIG.GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // wajib — hindari preflight
      body: JSON.stringify({ action: action, data: data || {}, token: token || '' })
    });
    if (!res.ok) throw new Error('Server menjawab dengan kode ' + res.status);
    return await res.json();
  },

  /**
   * Mengambil seluruh data publik.
   * Bila backend belum siap dan MODE_CONTOH_OTOMATIS aktif, data contoh dipakai
   * agar situs tetap tampil utuh (tidak menampilkan halaman kosong).
   */
  async ambilDataPublik() {
    if (this.aktif()) {
      try {
        const json = await this.get('getPublicData');
        this.mode = 'live';
        return json.data;
      } catch (err) {
        console.warn('[API] Gagal menghubungi backend:', err.message);
        if (!APP_CONFIG.MODE_CONTOH_OTOMATIS) throw err;
      }
    }
    this.mode = 'demo';
    return JSON.parse(JSON.stringify(DEMO_DATA));
  },

  /** Kirim pengaduan warga (tanpa login). */
  async kirimPengaduan(data) {
    if (!this.aktif()) {
      // Mode contoh: simulasikan keberhasilan supaya alur tetap dapat diuji.
      await new Promise(function (r) { setTimeout(r, 900); });
      return {
        success: true,
        demo: true,
        nomorTiket: 'DEMO-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 9000 + 1000),
        message: 'MODE CONTOH — aduan tidak benar-benar terkirim karena GAS_URL belum diisi.'
      };
    }
    return await this.post('submitPengaduan', data);
  },

  /** Baca berkas dari <input type="file"> menjadi base64 untuk dikirim ke GAS. */
  bacaBerkas(file) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onload = function () {
        resolve({
          namaFile: file.name,
          mimeType: file.type || 'application/octet-stream',
          ukuran: file.size,
          base64: String(reader.result).split('base64,')[1]
        });
      };
      reader.onerror = function () { reject(new Error('Gagal membaca berkas ' + file.name)); };
      reader.readAsDataURL(file);
    });
  }
};
