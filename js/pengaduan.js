/* ==========================================================================
   HALAMAN PENGADUAN & ASPIRASI WARGA
   Formulir publik (tanpa login) + unggah lampiran foto/dokumen ke Drive.
   ========================================================================== */

PAGES.pengaduan = function () {
  const set  = DATA.Pengaturan_Situs || {};
  const desa = DATA.Data_Desa || [];

  const opsiDesa = desa.map(function (d) {
    return '<option value="' + UI.esc(d.Nama_Desa) + '">Desa ' + UI.esc(d.Nama_Desa) + '</option>';
  }).join('');

  const opsiKategori = APP_CONFIG.KATEGORI_PENGADUAN.map(function (k, i) {
    return '<label class="chip" style="cursor:pointer;display:inline-flex;align-items:center;gap:.45rem;padding:.55rem .9rem">' +
      '<input type="radio" name="kategori" value="' + UI.esc(k) + '"' + (i === 0 ? ' checked' : '') +
      ' style="width:16px;height:16px;min-height:auto;accent-color:var(--secondary)"> ' + UI.esc(k) + '</label>';
  }).join('');

  const faq = [
    ['Apakah laporan saya bisa anonim?',
     'Nama pelapor wajib diisi agar petugas dapat melakukan konfirmasi lapangan. Namun identitas Anda tidak ditampilkan di halaman publik dan hanya dapat dilihat oleh admin kecamatan.'],
    ['Berapa lama laporan ditindaklanjuti?',
     'Laporan diverifikasi maksimal 1 hari kerja, lalu didisposisikan ke seksi terkait. Rata-rata penanganan lapangan berlangsung 1–3 hari kerja tergantung tingkat kerumitan.'],
    ['Bagaimana cara melampirkan lebih dari satu foto?',
     'Klik area unggah lalu pilih beberapa berkas sekaligus, atau seret berkas ke dalam kotak unggah. Maksimal ' + APP_CONFIG.MAKS_LAMPIRAN + ' berkas, masing-masing ' + APP_CONFIG.MAKS_UKURAN_MB + ' MB.'],
    ['Apakah pengaduan dipungut biaya?',
     'Tidak. Seluruh kanal pengaduan pada portal ini gratis. Laporkan kepada pimpinan kecamatan bila ada oknum yang meminta biaya.']
  ];

  const kontakDarurat = APP_CONFIG.KONTAK_DARURAT.map(function (k) {
    return '<div class="contact-row"><div class="ci">' + ICON.telepon + '</div>' +
      '<div class="cm"><strong>' + UI.esc(k.label) + '</strong><span>' + UI.esc(k.nomor) + '</span></div></div>';
  }).join('');

  let html = H.kepala('Layanan Pengaduan & Aspirasi Warga',
    'Sampaikan laporan permasalahan fasilitas umum, layanan kependudukan, kebersihan, ketertiban, atau usulan pembangunan wilayah secara terbuka dan dapat dipantau.',
    'Form Pengaduan Online');

  html += '<section class="section" style="padding-top:1.5rem"><div class="wrap">' +

    '<div class="banner banner-info" style="margin-bottom:1.5rem">' + ICON.perisai +
      '<div><strong>Jaminan transparansi & perlindungan data pelapor</strong>' +
      'Laporan Anda diteruskan ke Seksi Kecamatan atau Pemerintah Desa terkait dalam 1–3 hari kerja. Identitas pelapor dilindungi sepenuhnya sesuai UU Keterbukaan Informasi Publik No. 14 Tahun 2008.</div></div>' +

    '<div class="grid" style="grid-template-columns:minmax(0,1fr) 340px;gap:1.5rem;align-items:start">' +

      /* ---------------- KOLOM FORMULIR ---------------- */
      '<form id="formPengaduan" novalidate>' +

        /* Bagian 1 — identitas */
        '<div class="card card-pad" style="margin-bottom:1.25rem">' +
          '<div style="display:flex;align-items:center;gap:.7rem;margin-bottom:1rem">' +
            '<span class="badge badge-primary">01</span>' +
            '<div><h3 style="font-size:17px;margin:0">Identitas Warga Pelapor</h3>' +
            '<p style="font-size:12.5px;color:var(--text-muted);margin:0">Digunakan petugas untuk konfirmasi dan penyampaian progres tindak lanjut.</p></div>' +
          '</div>' +
          '<div class="form-grid cols-2">' +
            '<div class="field"><label for="pNama">Nama Lengkap (sesuai KTP) <span class="req">*</span></label>' +
              '<input id="pNama" name="Nama_Pelapor" type="text" required placeholder="Contoh: Bambang Hermanto" autocomplete="name">' +
              '<span class="field-error" hidden></span></div>' +
            '<div class="field"><label for="pKontak">Nomor WhatsApp Aktif <span class="req">*</span></label>' +
              '<input id="pKontak" name="Kontak" type="tel" required placeholder="Contoh: 081234567890" autocomplete="tel">' +
              '<span class="hint">Nomor ini menerima tautan pelacakan progres aduan.</span>' +
              '<span class="field-error" hidden></span></div>' +
            '<div class="field"><label for="pEmail">Alamat Email (opsional)</label>' +
              '<input id="pEmail" name="Email" type="email" placeholder="nama@email.com" autocomplete="email">' +
              '<span class="hint">Untuk tembusan surat tindak lanjut.</span></div>' +
            '<div class="field"><label for="pDesa">Desa Wilayah Kejadian <span class="req">*</span></label>' +
              '<select id="pDesa" name="Desa" required><option value="">— Pilih salah satu desa —</option>' + opsiDesa + '</select>' +
              '<span class="field-error" hidden></span></div>' +
          '</div>' +
        '</div>' +

        /* Bagian 2 — lokasi */
        '<div class="card card-pad" style="margin-bottom:1.25rem">' +
          '<div style="display:flex;align-items:center;gap:.7rem;margin-bottom:1rem">' +
            '<span class="badge badge-primary">02</span>' +
            '<div><h3 style="font-size:17px;margin:0">Lokasi Kejadian</h3>' +
            '<p style="font-size:12.5px;color:var(--text-muted);margin:0">Semakin rinci patokan lokasi, semakin cepat petugas meluncur ke titik aduan.</p></div>' +
          '</div>' +
          '<div class="field" style="margin-bottom:1rem"><label for="pAlamat">Alamat Lengkap / Patokan Lokasi <span class="req">*</span></label>' +
            '<input id="pAlamat" name="Alamat_Kejadian" type="text" required placeholder="Contoh: RT 03 / RW 02 Dusun Timur, 50 m sebelum jembatan kecil">' +
            '<span class="field-error" hidden></span></div>' +
          H.petaEmbed() +
          '<p style="font-size:12px;color:var(--text-muted);margin:.6rem 0 0">Peta menampilkan titik kantor kecamatan sebagai acuan wilayah layanan.</p>' +
        '</div>' +

        /* Bagian 3 — rincian aduan */
        '<div class="card card-pad" style="margin-bottom:1.25rem">' +
          '<div style="display:flex;align-items:center;gap:.7rem;margin-bottom:1rem">' +
            '<span class="badge badge-primary">03</span>' +
            '<div><h3 style="font-size:17px;margin:0">Rincian Pengaduan & Deskripsi Kasus</h3>' +
            '<p style="font-size:12.5px;color:var(--text-muted);margin:0">Pilih kategori yang tepat untuk mempercepat disposisi ke seksi teknis.</p></div>' +
          '</div>' +
          '<div class="field" style="margin-bottom:1rem"><label>Pilih Kategori Bidang Pengaduan <span class="req">*</span></label>' +
            '<div class="chips" style="margin-top:.35rem">' + opsiKategori + '</div></div>' +
          '<div class="field" style="margin-bottom:1rem"><label for="pJudul">Judul / Subjek Ringkas Laporan <span class="req">*</span></label>' +
            '<input id="pJudul" name="Judul" type="text" required maxlength="120" placeholder="Contoh: Aspal amblas di dekat jembatan utama RT 04">' +
            '<span class="field-error" hidden></span></div>' +
          '<div class="field"><label for="pIsi">Deskripsi Detail & Kronologi Kejadian <span class="req">*</span></label>' +
            '<textarea id="pIsi" name="Isi_Aduan" required maxlength="1000" ' +
              'placeholder="Ceritakan dengan runut apa permasalahannya, sejak kapan terjadi, dampak terhadap warga sekitar, serta harapan atau saran perbaikan yang diharapkan."></textarea>' +
            '<div style="display:flex;justify-content:space-between;gap:1rem">' +
              '<span class="field-error" hidden></span>' +
              '<span class="hint" id="pHitung">0 / 1000 karakter</span></div></div>' +
        '</div>' +

        /* Bagian 4 — lampiran */
        '<div class="card card-pad" style="margin-bottom:1.25rem">' +
          '<div style="display:flex;align-items:center;gap:.7rem;margin-bottom:1rem">' +
            '<span class="badge badge-primary">04</span>' +
            '<div><h3 style="font-size:17px;margin:0">Unggah Bukti Foto / Dokumen Kejadian</h3>' +
            '<p style="font-size:12.5px;color:var(--text-muted);margin:0">Opsional, namun laporan bertingkat bukti lebih cepat diverifikasi.</p></div>' +
          '</div>' +
          '<div class="dropzone" id="dropzone" tabindex="0" role="button" aria-label="Pilih berkas lampiran">' +
            '<div class="dz-icon">' + ICON.kamera.replace('18','30') + '</div>' +
            '<p><strong>Tarik &amp; letakkan berkas di sini</strong>, atau klik untuk memilih dari galeri</p>' +
            '<small>Format JPG, PNG, atau PDF · maksimal ' + APP_CONFIG.MAKS_LAMPIRAN + ' berkas · ' + APP_CONFIG.MAKS_UKURAN_MB + ' MB per berkas</small>' +
          '</div>' +
          '<input id="pBerkas" type="file" accept="image/*,application/pdf" multiple hidden>' +
          '<div class="file-list" id="daftarBerkas"></div>' +
        '</div>' +

        /* Pernyataan & kirim */
        '<div class="card card-pad">' +
          '<label class="checkbox-row" style="margin-bottom:.9rem">' +
            '<input type="checkbox" id="pSetuju" required>' +
            '<span>Saya menyatakan dengan sesungguhnya bahwa laporan dan bukti yang disampaikan adalah benar adanya, tanpa unsur fitnah, provokasi kebencian, hoaks, ataupun unsur SARA, ' +
            'dan siap diklarifikasi oleh tim teknis kecamatan.</span></label>' +
          '<span class="field-error" id="errSetuju" hidden></span>' +
          '<div style="display:flex;justify-content:flex-end;gap:.6rem;flex-wrap:wrap;margin-top:.5rem">' +
            '<button type="reset" class="btn btn-outline">Bersihkan Formulir</button>' +
            '<button type="submit" class="btn btn-accent" id="btnKirimAduan">' + ICON.kirim.replace('18','16') + ' Kirim Pengaduan Sekarang</button>' +
          '</div>' +
        '</div>' +
      '</form>' +

      /* ---------------- KOLOM SAMPING ---------------- */
      '<aside style="display:grid;gap:1rem">' +

        '<div class="card card-pad" style="background:linear-gradient(140deg,var(--primary-deep),var(--primary));color:#fff">' +
          '<span class="eyebrow">Kinerja Transparansi</span>' +
          '<div style="font-size:34px;font-weight:800;color:var(--accent-bright);line-height:1.1;margin:.3rem 0">1–3 Hari</div>' +
          '<p style="font-size:13px;color:var(--on-dark-soft);margin:0">Rata-rata waktu respons tindak lanjut laporan warga yang masuk melalui portal ini.</p>' +
        '</div>' +

        '<div class="aside-card"><h4>' + ICON.info + ' Alur Penanganan Aduan</h4><div class="body">' +
          '<ol class="timeline" style="list-style:none">' +
            '<li><strong>1. Laporan Masuk & Verifikasi</strong><span>Admin kecamatan memeriksa keabsahan dan kelayakan aduan (maksimal 1 hari kerja).</span></li>' +
            '<li><strong>2. Disposisi ke Seksi / Desa</strong><span>Laporan diteruskan ke seksi teknis terkait atau pemerintah desa bersangkutan.</span></li>' +
            '<li><strong>3. Tindak Lanjut Lapangan</strong><span>Petugas meninjau lokasi, melakukan penertiban, perbaikan, atau koordinasi dinas.</span></li>' +
            '<li><strong>4. Konfirmasi & Tiket Ditutup</strong><span>Hasil penanganan didokumentasikan sebagai pertanggungjawaban publik.</span></li>' +
          '</ol>' +
        '</div></div>' +

        '<div class="aside-card"><h4>' + ICON.telepon + ' Hotline & Kontak Cepat</h4><div class="body">' +
          '<a class="btn btn-secondary btn-block btn-sm" style="margin-bottom:.75rem" target="_blank" rel="noopener" ' +
            'href="https://wa.me/' + UI.esc(set.whatsapp || APP_CONFIG.SITUS.whatsapp) + '">' + ICON.wa.replace('18','15') + ' WhatsApp Pengaduan</a>' +
          kontakDarurat +
        '</div></div>' +

        '<div class="aside-card"><h4>' + ICON.aduan + ' Pertanyaan Umum</h4><div class="body" style="padding-top:.25rem">' +
          '<div id="faqAduan">' + faq.map(function (f) {
            return '<div class="accordion-item"><button type="button" class="accordion-btn">' + UI.esc(f[0]) + ICON.bawah.replace('18','16') + '</button>' +
              '<div class="accordion-panel">' + UI.esc(f[1]) + '</div></div>';
          }).join('') + '</div>' +
        '</div></div>' +

        '<a class="aside-card" href="#/dokumen" style="display:flex;align-items:center;gap:.8rem;padding:1rem">' +
          '<div class="doc-icon">' + ICON.dokumen + '</div>' +
          '<div style="flex:1"><strong style="display:block;font-size:13.5px">Dokumen Regulasi Pengaduan</strong>' +
          '<span style="font-size:12px;color:var(--text-muted)">SOP Pelayanan Pengaduan Kecamatan</span></div>' +
          ICON.unduh +
        '</a>' +

      '</aside>' +
    '</div>' +
  '</div></section>';

  /* ------------------------------------------------------------------ */
  return {
    html: html,
    init: function () {
      const form     = document.getElementById('formPengaduan');
      const inputFile= document.getElementById('pBerkas');
      const dropzone = document.getElementById('dropzone');
      const daftarEl = document.getElementById('daftarBerkas');
      const isi      = document.getElementById('pIsi');
      const hitung   = document.getElementById('pHitung');
      let berkas = [];

      /* --- Penghitung karakter --- */
      isi.addEventListener('input', function () {
        hitung.textContent = isi.value.length + ' / 1000 karakter';
      });

      /* --- Akordeon FAQ --- */
      document.getElementById('faqAduan').addEventListener('click', function (e) {
        const b = e.target.closest('.accordion-btn');
        if (!b) return;
        b.parentElement.classList.toggle('open');
      });

      /* --- Lampiran --- */
      const gambarDaftar = function () {
        daftarEl.innerHTML = berkas.map(function (f, i) {
          const pratinjau = f.type.indexOf('image/') === 0
            ? '<img src="' + URL.createObjectURL(f) + '" alt="">'
            : '<div style="display:grid;place-items:center;height:100%;color:var(--text-muted)">' + ICON.dokumen.replace('18','18') + '</div>';
          return '<div class="file-item"><div class="fi-thumb">' + pratinjau + '</div>' +
            '<div class="fi-meta"><strong>' + UI.esc(f.name) + '</strong>' +
            '<span>' + UI.ukuranBerkas(f.size) + ' · siap diunggah</span></div>' +
            '<button type="button" data-hapus="' + i + '" aria-label="Hapus lampiran">' + ICON.hapus.replace('18','16') + '</button></div>';
        }).join('');
      };

      const tambahBerkas = function (fileList) {
        const maksByte = APP_CONFIG.MAKS_UKURAN_MB * 1024 * 1024;
        Array.prototype.forEach.call(fileList, function (f) {
          if (berkas.length >= APP_CONFIG.MAKS_LAMPIRAN) {
            UI.notif('Maksimal ' + APP_CONFIG.MAKS_LAMPIRAN + ' lampiran.', 'error');
            return;
          }
          if (f.size > maksByte) {
            UI.notif('"' + f.name + '" melebihi ' + APP_CONFIG.MAKS_UKURAN_MB + ' MB.', 'error');
            return;
          }
          berkas.push(f);
        });
        gambarDaftar();
      };

      dropzone.addEventListener('click', function () { inputFile.click(); });
      dropzone.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputFile.click(); }
      });
      ['dragenter', 'dragover'].forEach(function (ev) {
        dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add('drag'); });
      });
      ['dragleave', 'drop'].forEach(function (ev) {
        dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove('drag'); });
      });
      dropzone.addEventListener('drop', function (e) { tambahBerkas(e.dataTransfer.files); });
      inputFile.addEventListener('change', function () { tambahBerkas(inputFile.files); inputFile.value = ''; });
      daftarEl.addEventListener('click', function (e) {
        const b = e.target.closest('[data-hapus]');
        if (!b) return;
        berkas.splice(Number(b.dataset.hapus), 1);
        gambarDaftar();
      });

      /* --- Validasi --- */
      const tandaiGalat = function (el, pesan) {
        el.classList.add('invalid');
        const span = el.parentElement.querySelector('.field-error');
        if (span) { span.textContent = pesan; span.hidden = false; }
      };
      const bersihkanGalat = function () {
        form.querySelectorAll('.invalid').forEach(function (el) { el.classList.remove('invalid'); });
        form.querySelectorAll('.field-error').forEach(function (el) { el.hidden = true; });
      };

      const validasi = function () {
        bersihkanGalat();
        let pertama = null;
        const cek = function (el, syarat, pesan) {
          if (!syarat) { tandaiGalat(el, pesan); if (!pertama) pertama = el; }
        };
        const nama = document.getElementById('pNama');
        const kontak = document.getElementById('pKontak');
        const dsa = document.getElementById('pDesa');
        const alamat = document.getElementById('pAlamat');
        const judul = document.getElementById('pJudul');

        cek(nama,   nama.value.trim().length >= 3, 'Nama lengkap wajib diisi (minimal 3 karakter).');
        cek(kontak, /^[0-9+\-\s]{9,20}$/.test(kontak.value.trim()), 'Masukkan nomor WhatsApp yang valid.');
        cek(dsa,    !!dsa.value, 'Pilih desa wilayah kejadian.');
        cek(alamat, alamat.value.trim().length >= 6, 'Tuliskan alamat atau patokan lokasi.');
        cek(judul,  judul.value.trim().length >= 6, 'Judul laporan wajib diisi.');
        cek(isi,    isi.value.trim().length >= 15, 'Uraian aduan minimal 15 karakter.');

        const setuju = document.getElementById('pSetuju');
        const errSetuju = document.getElementById('errSetuju');
        if (!setuju.checked) {
          errSetuju.textContent = 'Anda harus menyetujui pernyataan kebenaran laporan.';
          errSetuju.hidden = false;
          if (!pertama) pertama = setuju;
        }
        if (pertama) {
          pertama.focus();
          pertama.scrollIntoView({ block: 'center', behavior: 'smooth' });
          return false;
        }
        return true;
      };

      /* --- Kirim --- */
      form.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (!validasi()) { UI.notif('Periksa kembali isian yang ditandai merah.', 'error'); return; }

        const tombol = document.getElementById('btnKirimAduan');
        tombol.disabled = true;
        tombol.textContent = 'Mengirim laporan…';
        UI.muat(true);

        try {
          const lampiran = [];
          for (let i = 0; i < berkas.length; i++) {
            lampiran.push(await API.bacaBerkas(berkas[i]));
          }
          const kategoriEl = form.querySelector('input[name="kategori"]:checked');
          const hasil = await API.kirimPengaduan({
            Nama_Pelapor: document.getElementById('pNama').value.trim(),
            Kontak: document.getElementById('pKontak').value.trim(),
            Email: document.getElementById('pEmail').value.trim(),
            Desa: document.getElementById('pDesa').value,
            Alamat_Kejadian: document.getElementById('pAlamat').value.trim(),
            Kategori: kategoriEl ? kategoriEl.value : 'Umum',
            Judul: document.getElementById('pJudul').value.trim(),
            Isi_Aduan: isi.value.trim(),
            lampiran: lampiran
          });

          if (hasil.success) {
            tampilkanSukses(hasil);
          } else {
            UI.notif(hasil.message || 'Pengaduan gagal dikirim.', 'error');
          }
        } catch (err) {
          UI.notif('Gagal mengirim: ' + err.message, 'error');
        } finally {
          UI.muat(false);
          tombol.disabled = false;
          tombol.innerHTML = ICON.kirim.replace('18', '16') + ' Kirim Pengaduan Sekarang';
        }
      });

      /* --- Layar konfirmasi --- */
      function tampilkanSukses(hasil) {
        const tampilan =
          '<section class="section"><div class="wrap"><div class="card card-pad" style="max-width:640px;margin-inline:auto;text-align:center">' +
            '<div style="width:72px;height:72px;border-radius:50%;background:var(--success-bg);color:var(--success-text);display:grid;place-items:center;margin:0 auto 1rem">' +
              ICON.ceklis.replace('18','34') + '</div>' +
            '<h2 style="font-size:24px">Pengaduan Anda Berhasil Dikirim</h2>' +
            '<p style="color:var(--text-soft)">Terima kasih telah berpartisipasi mengawal pelayanan publik. Laporan Anda telah tercatat dan akan diverifikasi petugas kecamatan.</p>' +
            '<div style="background:var(--container-low);border:1px dashed var(--border-strong);border-radius:var(--r-md);padding:1rem;margin:1.25rem 0">' +
              '<div style="font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--text-muted)">Nomor Tiket Laporan</div>' +
              '<div style="font-size:26px;font-weight:800;color:var(--primary);letter-spacing:.04em">' + UI.esc(hasil.nomorTiket || '-') + '</div>' +
              '<div style="font-size:12.5px;color:var(--text-muted);margin-top:.25rem">Simpan nomor ini sebagai bukti lapor Anda.</div>' +
            '</div>' +
            (hasil.demo ? '<div class="banner banner-warning" style="text-align:left;margin-bottom:1rem">' + ICON.peringatan +
              '<div><strong>Mode contoh</strong>Laporan tidak benar-benar tersimpan karena GAS_URL pada js/config.js belum diisi.</div></div>' : '') +
            '<div style="display:flex;gap:.6rem;justify-content:center;flex-wrap:wrap">' +
              '<a class="btn btn-primary" href="#/beranda">Kembali ke Beranda</a>' +
              '<button class="btn btn-outline" id="btnAduanLagi">Kirim Laporan Lain</button>' +
            '</div>' +
          '</div></div></section>';

        document.getElementById('konten').innerHTML = tampilan;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        UI.notif('Pengaduan terkirim. Nomor tiket: ' + (hasil.nomorTiket || '-'), 'success');
        document.getElementById('btnAduanLagi').addEventListener('click', function () {
          ROUTER.render();
        });
      }
    }
  };
};
