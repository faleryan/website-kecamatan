/* ==========================================================================
   DATA CONTOH (MODE DEMO)
   --------------------------------------------------------------------------
   Dipakai hanya bila GAS_URL belum diisi atau backend tidak dapat dihubungi,
   supaya situs tetap tampil utuh saat pertama kali di-deploy.
   Struktur objek di sini SAMA PERSIS dengan kolom Google Sheets di backend.
   ========================================================================== */

const hariKe = function (n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
};

const DEMO_DATA = {

  Pengaturan_Situs: {
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

  Profil_Kecamatan: [
    { ID: 'PRO-001', Judul_Bagian: 'Sejarah', Urutan_Tampil: 1, Isi_Konten:
      'Kecamatan Nusantara dibentuk berdasarkan Peraturan Daerah tentang pemekaran wilayah, dengan tujuan mendekatkan pelayanan administrasi kepada masyarakat di delapan desa binaan.\n\nSejak awal berdirinya, kantor kecamatan menjadi simpul koordinasi antara pemerintah desa dan dinas teknis kabupaten, khususnya pada urusan kependudukan, ketertiban umum, serta pembangunan infrastruktur desa.' },
    { ID: 'PRO-002', Judul_Bagian: 'Visi', Urutan_Tampil: 2, Isi_Konten:
      'Terwujudnya pelayanan publik yang cepat, transparan, dan berkeadilan menuju masyarakat kecamatan yang maju dan mandiri.' },
    { ID: 'PRO-003', Judul_Bagian: 'Misi', Urutan_Tampil: 3, Isi_Konten:
      '1. Meningkatkan kualitas pelayanan administrasi kependudukan yang cepat dan bebas pungutan.\n2. Mendorong transparansi anggaran dan program pembangunan kepada masyarakat.\n3. Memberdayakan UMKM dan potensi unggulan tiap desa.\n4. Memperkuat koordinasi lintas desa, dinas teknis, dan aparat keamanan.\n5. Membuka kanal aspirasi warga yang mudah diakses dan ditindaklanjuti.' },
    { ID: 'PRO-004', Judul_Bagian: 'Struktur Organisasi', Urutan_Tampil: 4, Isi_Konten:
      'Camat\nSekretaris Kecamatan\nSeksi Pemerintahan\nSeksi Ketentraman & Ketertiban Umum\nSeksi Ekonomi & Pembangunan\nSeksi Kesejahteraan Sosial\nSeksi Pelayanan Umum\nKelompok Jabatan Fungsional' }
  ],

  Data_Geografis: [
    { ID: 'GEO-001', Nama_Wilayah: 'Kecamatan Nusantara', Luas_Wilayah: '84,52 km²',
      Batas_Utara: 'Kecamatan Sukamaju', Batas_Selatan: 'Kecamatan Tirta',
      Batas_Timur: 'Kecamatan Karangsari', Batas_Barat: 'Kecamatan Bhakti',
      Ketinggian: '120–650 mdpl', Link_Peta: '',
      Deskripsi: 'Wilayah kecamatan terdiri atas dataran rendah di sisi selatan dan perbukitan di sisi utara. Sisi utara didominasi perkebunan kopi dan hortikultura, sedangkan sisi selatan merupakan lumbung padi dengan irigasi teknis. Akses utama berupa jalan poros kabupaten yang menghubungkan delapan desa binaan.' }
  ],

  Data_Desa: [
    { ID:'DES-001', Nama_Desa:'Sukamaju',     Kepala_Desa:'H. Slamet Riyadi',        Jumlah_Penduduk:7820, Jumlah_KK:2210, Luas_Wilayah:'12,40 km²', Alamat_Kantor:'Jl. Sukamaju No. 5',     Kontak:'0812-3456-7890', Foto:'', Deskripsi:'Desa terpadat dengan pusat perdagangan mingguan dan sentra keripik olahan tempe.' },
    { ID:'DES-002', Nama_Desa:'Mekarsari',    Kepala_Desa:'Siti Aminah, S.E.',       Jumlah_Penduduk:6940, Jumlah_KK:1980, Luas_Wilayah:'10,80 km²', Alamat_Kantor:'Jl. Mekarsari No. 2',    Kontak:'0813-2222-1111', Foto:'', Deskripsi:'Dikenal sebagai penghasil kopi robusta lereng bukit dan agrowisata melon hidroponik.' },
    { ID:'DES-003', Nama_Desa:'Karangtanjung',Kepala_Desa:'Bambang Setiawan',        Jumlah_Penduduk:5910, Jumlah_KK:1720, Luas_Wilayah:'9,60 km²',  Alamat_Kantor:'Jl. Karangtanjung No. 8',Kontak:'0857-1122-3344', Foto:'', Deskripsi:'Sentra anyaman bambu kreatif dan kerajinan rumah tangga yang dipasarkan lintas provinsi.' },
    { ID:'DES-004', Nama_Desa:'Sindangresmi', Kepala_Desa:'Agus Supriadi',           Jumlah_Penduduk:5430, Jumlah_KK:1590, Luas_Wilayah:'11,20 km²', Alamat_Kantor:'Jl. Sindangresmi No. 1', Kontak:'0821-4567-8901', Foto:'', Deskripsi:'Wilayah agraris dengan irigasi teknis dan lumbung padi kecamatan.' },
    { ID:'DES-005', Nama_Desa:'Wargaluyu',    Kepala_Desa:'Dewi Anggraeni, S.Sos.',  Jumlah_Penduduk:4980, Jumlah_KK:1450, Luas_Wilayah:'8,90 km²',  Alamat_Kantor:'Jl. Wargaluyu No. 12',   Kontak:'0878-3344-5566', Foto:'', Deskripsi:'Sentra batik tulis pewarna alami binaan Dekranasda kabupaten.' },
    { ID:'DES-006', Nama_Desa:'Ciherang',     Kepala_Desa:'Rahmat Hidayat',          Jumlah_Penduduk:4410, Jumlah_KK:1290, Luas_Wilayah:'10,10 km²', Alamat_Kantor:'Jl. Ciherang No. 3',     Kontak:'0811-2233-4455', Foto:'', Deskripsi:'Memiliki wisata mata air sumber alami dan kelompok sadar wisata yang aktif.' },
    { ID:'DES-007', Nama_Desa:'Cibungur',     Kepala_Desa:'Nurul Hakim',             Jumlah_Penduduk:3870, Jumlah_KK:1120, Luas_Wilayah:'11,00 km²', Alamat_Kantor:'Jl. Cibungur No. 7',     Kontak:'0812-9988-7766', Foto:'', Deskripsi:'Penghasil madu klanceng murni dan hasil hutan bukan kayu.' },
    { ID:'DES-008', Nama_Desa:'Tanjungwangi', Kepala_Desa:'Siti Nurhaliza, S.H.',    Jumlah_Penduduk:3690, Jumlah_KK:1050, Luas_Wilayah:'10,52 km²', Alamat_Kantor:'Jl. Tanjungwangi No. 4', Kontak:'0857-6677-8899', Foto:'', Deskripsi:'Desa terluar dengan potensi peternakan kambing etawa dan susu olahan.' }
  ],

  Statistik_Penduduk: [
    { ID:'STA-001', Desa:'Sukamaju',      Tahun:2025, Jumlah_Laki:3960, Jumlah_Perempuan:3860, Jumlah_KK:2210, Usia_0_14:1880, Usia_15_64:5210, Usia_65_Plus:730 },
    { ID:'STA-002', Desa:'Mekarsari',     Tahun:2025, Jumlah_Laki:3510, Jumlah_Perempuan:3430, Jumlah_KK:1980, Usia_0_14:1660, Usia_15_64:4620, Usia_65_Plus:660 },
    { ID:'STA-003', Desa:'Karangtanjung', Tahun:2025, Jumlah_Laki:2990, Jumlah_Perempuan:2920, Jumlah_KK:1720, Usia_0_14:1410, Usia_15_64:3940, Usia_65_Plus:560 },
    { ID:'STA-004', Desa:'Sindangresmi',  Tahun:2025, Jumlah_Laki:2750, Jumlah_Perempuan:2680, Jumlah_KK:1590, Usia_0_14:1300, Usia_15_64:3620, Usia_65_Plus:510 },
    { ID:'STA-005', Desa:'Wargaluyu',     Tahun:2025, Jumlah_Laki:2520, Jumlah_Perempuan:2460, Jumlah_KK:1450, Usia_0_14:1190, Usia_15_64:3320, Usia_65_Plus:470 },
    { ID:'STA-006', Desa:'Ciherang',      Tahun:2025, Jumlah_Laki:2230, Jumlah_Perempuan:2180, Jumlah_KK:1290, Usia_0_14:1050, Usia_15_64:2940, Usia_65_Plus:420 },
    { ID:'STA-007', Desa:'Cibungur',      Tahun:2025, Jumlah_Laki:1960, Jumlah_Perempuan:1910, Jumlah_KK:1120, Usia_0_14:920,  Usia_15_64:2580, Usia_65_Plus:370 },
    { ID:'STA-008', Desa:'Tanjungwangi',  Tahun:2025, Jumlah_Laki:1870, Jumlah_Perempuan:1820, Jumlah_KK:1050, Usia_0_14:880,  Usia_15_64:2460, Usia_65_Plus:350 },
    { ID:'STA-011', Desa:'Sukamaju',      Tahun:2024, Jumlah_Laki:3890, Jumlah_Perempuan:3790, Jumlah_KK:2160, Usia_0_14:1850, Usia_15_64:5120, Usia_65_Plus:710 },
    { ID:'STA-012', Desa:'Mekarsari',     Tahun:2024, Jumlah_Laki:3450, Jumlah_Perempuan:3370, Jumlah_KK:1940, Usia_0_14:1630, Usia_15_64:4540, Usia_65_Plus:650 },
    { ID:'STA-013', Desa:'Karangtanjung', Tahun:2024, Jumlah_Laki:2940, Jumlah_Perempuan:2870, Jumlah_KK:1690, Usia_0_14:1390, Usia_15_64:3870, Usia_65_Plus:550 },
    { ID:'STA-014', Desa:'Sindangresmi',  Tahun:2024, Jumlah_Laki:2700, Jumlah_Perempuan:2640, Jumlah_KK:1560, Usia_0_14:1280, Usia_15_64:3560, Usia_65_Plus:500 }
  ],

  Data_UMKM: [
    { ID:'UMK-001', Nama_Usaha:'Sentra Anyaman Bambu Kreatif',   Desa:'Karangtanjung', Jenis_Usaha:'Kerajinan',                Pemilik:'Kelompok Tani Lestari',  Kontak:'0857-1122-3344', Foto:'', Deskripsi:'Anyaman bambu bernilai jual tinggi yang dipasarkan hingga luar provinsi, dengan pelatihan rutin bagi ibu rumah tangga.' },
    { ID:'UMK-002', Nama_Usaha:'Kopi Robusta Lereng Bukit',      Desa:'Mekarsari',     Jenis_Usaha:'Pertanian & Perkebunan',    Pemilik:'Koperasi Tani Mekar',    Kontak:'0813-2222-1111', Foto:'', Deskripsi:'Kopi robusta hasil panen lereng bukit dengan proses natural dan honey, telah memiliki izin edar.' },
    { ID:'UMK-003', Nama_Usaha:'Batik Tulis Pewarna Alami',      Desa:'Wargaluyu',     Jenis_Usaha:'Tekstil & Fesyen',         Pemilik:'Sanggar Batik Luyu',     Kontak:'0878-3344-5566', Foto:'', Deskripsi:'Batik tulis dengan pewarna alami dari daun indigo dan kulit kayu, motif khas kecamatan.' },
    { ID:'UMK-004', Nama_Usaha:'Agrowisata Melon Hidroponik',    Desa:'Mekarsari',     Jenis_Usaha:'Wisata & Agro',            Pemilik:'Kelompok Tani Muda',     Kontak:'0813-5566-7788', Foto:'', Deskripsi:'Kebun melon hidroponik yang dibuka untuk kunjungan edukasi keluarga dan sekolah.' },
    { ID:'UMK-005', Nama_Usaha:'Sentra Keripik Olahan Tempe',    Desa:'Sukamaju',      Jenis_Usaha:'Makanan & Minuman',        Pemilik:'UMKM Berkah Jaya',       Kontak:'0812-3456-7890', Foto:'', Deskripsi:'Keripik tempe aneka rasa dengan kemasan siap ritel modern dan sertifikasi PIRT.' },
    { ID:'UMK-006', Nama_Usaha:'Wisata Mata Air Sumber Alami',   Desa:'Ciherang',      Jenis_Usaha:'Wisata & Agro',            Pemilik:'Pokdarwis Ciherang',     Kontak:'0811-2233-4455', Foto:'', Deskripsi:'Kawasan mata air alami dengan area pemandian, kemah keluarga, dan warung kelola warga.' },
    { ID:'UMK-007', Nama_Usaha:'Budi Daya Madu Klanceng Murni',  Desa:'Cibungur',      Jenis_Usaha:'Peternakan',               Pemilik:'Kelompok Madu Cibungur', Kontak:'0812-9988-7766', Foto:'', Deskripsi:'Madu klanceng murni hasil budi daya lebah tanpa sengat, dikemas dalam botol kaca.' },
    { ID:'UMK-008', Nama_Usaha:'Susu Kambing Etawa Segar',       Desa:'Tanjungwangi',  Jenis_Usaha:'Peternakan',               Pemilik:'Ternak Barokah',         Kontak:'0857-6677-8899', Foto:'', Deskripsi:'Produksi susu kambing etawa segar dan bubuk, mitra puskesmas untuk program gizi.' }
  ],

  Agenda_Kegiatan: [
    { ID:'AGE-001', Nama_Kegiatan:'Pelayanan Rekam KTP-el Keliling',        Tanggal:hariKe(3),  Waktu:'08.00 – 14.00',   Lokasi:'Balai Desa Sukamaju',   Deskripsi:'Jemput bola perekaman KTP-el dan pencetakan KIA bagi warga delapan desa binaan.' },
    { ID:'AGE-002', Nama_Kegiatan:'Musyawarah Perencanaan Pembangunan',     Tanggal:hariKe(9),  Waktu:'09.00 – selesai', Lokasi:'Aula Kantor Kecamatan', Deskripsi:'Musrenbang tingkat kecamatan untuk menyusun prioritas pembangunan tahun berikutnya.' },
    { ID:'AGE-003', Nama_Kegiatan:'Pameran Produk UMKM Kecamatan',          Tanggal:hariKe(16), Waktu:'08.00 – 17.00',   Lokasi:'Lapangan Kecamatan',    Deskripsi:'Pameran produk unggulan UMKM delapan desa binaan dan temu mitra pemasaran.' },
    { ID:'AGE-004', Nama_Kegiatan:'Posyandu Terpadu & Pemeriksaan Gratis',  Tanggal:hariKe(22), Waktu:'07.30 – 11.00',   Lokasi:'Puskesmas Kecamatan',   Deskripsi:'Pemeriksaan kesehatan ibu, anak, dan lansia bersama tenaga kesehatan puskesmas.' },
    { ID:'AGE-005', Nama_Kegiatan:'Kerja Bakti Normalisasi Saluran Air',    Tanggal:hariKe(28), Waktu:'06.30 – 10.00',   Lokasi:'Desa Sindangresmi',     Deskripsi:'Kerja bakti bersama warga dan Linmas membersihkan saluran irigasi menjelang musim hujan.' }
  ],

  Galeri_Foto: [
    { ID:'GAL-001', Judul:'Pelayanan Loket Terpadu',        Kategori:'Layanan',  Link_Drive_Foto:'', Keterangan:'Suasana pelayanan administrasi di loket terpadu kantor kecamatan.', Tanggal_Upload:hariKe(-12) },
    { ID:'GAL-002', Judul:'Musrenbang Tingkat Kecamatan',   Kategori:'Kegiatan', Link_Drive_Foto:'', Keterangan:'Musyawarah perencanaan pembangunan bersama perwakilan delapan desa.', Tanggal_Upload:hariKe(-20) },
    { ID:'GAL-003', Judul:'Pameran Produk UMKM',            Kategori:'Ekonomi',  Link_Drive_Foto:'', Keterangan:'Stan produk unggulan UMKM pada pameran tingkat kecamatan.', Tanggal_Upload:hariKe(-26) },
    { ID:'GAL-004', Judul:'Kerja Bakti Normalisasi Saluran',Kategori:'Kegiatan', Link_Drive_Foto:'', Keterangan:'Kerja bakti bersama warga membersihkan saluran air desa.', Tanggal_Upload:hariKe(-31) },
    { ID:'GAL-005', Judul:'Perekaman KTP-el Keliling',      Kategori:'Layanan',  Link_Drive_Foto:'', Keterangan:'Petugas melayani perekaman KTP-el di balai desa.', Tanggal_Upload:hariKe(-38) },
    { ID:'GAL-006', Judul:'Panen Raya Padi Sindangresmi',   Kategori:'Ekonomi',  Link_Drive_Foto:'', Keterangan:'Panen raya bersama kelompok tani dan penyuluh pertanian.', Tanggal_Upload:hariKe(-44) },
    { ID:'GAL-007', Judul:'Apel Kesiapsiagaan Bencana',     Kategori:'Kegiatan', Link_Drive_Foto:'', Keterangan:'Apel bersama Linmas, Damkar, dan relawan desa.', Tanggal_Upload:hariKe(-50) },
    { ID:'GAL-008', Judul:'Wisata Mata Air Ciherang',       Kategori:'Wisata',   Link_Drive_Foto:'', Keterangan:'Kawasan wisata mata air yang dikelola kelompok sadar wisata.', Tanggal_Upload:hariKe(-57) }
  ],

  Pengumuman: [
    { ID:'PEN-001', Judul:'Pendaftaran Bantuan UMKM Tahap II Dibuka hingga 30 April', Status:'Tayang', Prioritas:'Tinggi', Tanggal_Terbit:hariKe(-2),
      Isi:'Pendaftaran bantuan modal UMKM tahap II dibuka bagi pelaku usaha yang telah memiliki Nomor Induk Berusaha (NIB). Berkas diserahkan ke Seksi Ekonomi & Pembangunan pada jam kerja, atau diunggah melalui kanal layanan daring kecamatan.' },
    { ID:'PEN-002', Judul:'Jadwal Pelayanan Rekam KTP-el Keliling Desa Sukamaju', Status:'Tayang', Prioritas:'Sedang', Tanggal_Terbit:hariKe(-5),
      Isi:'Pelayanan perekaman KTP-el keliling akan dilaksanakan di Balai Desa Sukamaju. Warga cukup membawa fotokopi Kartu Keluarga dan hadir sesuai jadwal desa masing-masing.' },
    { ID:'PEN-003', Judul:'Penyesuaian Jam Layanan Loket pada Hari Jumat', Status:'Tayang', Prioritas:'Sedang', Tanggal_Terbit:hariKe(-9),
      Isi:'Mulai bulan ini, layanan loket pada hari Jumat ditutup pukul 14.30 WITA untuk kegiatan koordinasi internal. Layanan daring tetap dapat diakses 24 jam melalui portal ini.' },
    { ID:'PEN-004', Judul:'Waspada Cuaca Ekstrem — Nomor Siaga Kecamatan Aktif 24 Jam', Status:'Tayang', Prioritas:'Tinggi', Tanggal_Terbit:hariKe(-13),
      Isi:'Menghadapi potensi cuaca ekstrem, posko siaga kecamatan diaktifkan 24 jam. Warga dapat menghubungi nomor siaga yang tercantum pada halaman pengaduan untuk kondisi darurat.' }
  ],

  Berita: [
    { ID:'BER-001', Judul:'Musrenbang 2025: Prioritas Pembangunan Jalan Poros Desa', Kategori:'Pembangunan', Status:'Published',
      Penulis:'Seksi Ekonomi & Pembangunan', Tanggal_Publish:hariKe(-1), Foto_Cover:'',
      Ringkasan:'Sebanyak 41 usulan warga disepakati menjadi prioritas pembangunan kecamatan tahun anggaran berikutnya.',
      Isi:'Musyawarah perencanaan pembangunan tingkat kecamatan berlangsung di aula kantor kecamatan dengan menghadirkan perwakilan delapan desa, tokoh masyarakat, serta perwakilan kelompok perempuan dan pemuda.\n\nDari 41 usulan yang masuk, pembangunan dan perbaikan jalan poros antardesa menempati prioritas pertama, diikuti perbaikan saluran irigasi dan penambahan titik penerangan jalan umum di ruas rawan kecelakaan.\n\nCamat menegaskan seluruh usulan yang disepakati akan diunggah ke portal ini agar warga dapat memantau realisasinya secara terbuka sepanjang tahun anggaran berjalan.' },
    { ID:'BER-002', Judul:'Pameran Produk UMKM Kecamatan Sukses Jaring Mitra Baru', Kategori:'Ekonomi Kreatif', Status:'Published',
      Penulis:'Seksi Ekonomi & Pembangunan', Tanggal_Publish:hariKe(-4), Foto_Cover:'',
      Ringkasan:'Tujuh pelaku UMKM binaan kecamatan berhasil menjalin kesepakatan pemasaran dengan jaringan ritel kabupaten.',
      Isi:'Pameran produk UMKM yang digelar di lapangan kecamatan diikuti oleh 24 pelaku usaha dari delapan desa. Produk unggulan seperti kopi robusta lereng bukit, batik tulis pewarna alami, dan keripik olahan tempe menjadi primadona pengunjung.\n\nSeksi Ekonomi dan Pembangunan mencatat tujuh pelaku usaha berhasil menjalin kesepakatan pemasaran dengan jaringan ritel kabupaten, sementara tiga lainnya mendapat pendampingan sertifikasi halal.\n\nKegiatan serupa direncanakan digelar setiap semester dengan penambahan kelas pendampingan pemasaran digital bagi pelaku usaha pemula.' },
    { ID:'BER-003', Judul:'Layanan Jemput Bola KTP-el dan KIA Sasar Warga Lansia', Kategori:'Layanan Publik', Status:'Published',
      Penulis:'Seksi Pelayanan Umum', Tanggal_Publish:hariKe(-8), Foto_Cover:'',
      Ringkasan:'Petugas mendatangi rumah warga lanjut usia dan penyandang disabilitas yang kesulitan datang ke kantor.',
      Isi:'Program jemput bola administrasi kependudukan kembali dijalankan dengan menyasar warga lanjut usia dan penyandang disabilitas yang selama ini kesulitan datang langsung ke kantor kecamatan.\n\nPada pekan pertama pelaksanaan, sebanyak 138 warga telah terlayani perekaman KTP-el serta penerbitan Kartu Identitas Anak di empat desa.\n\nWarga yang ingin mengusulkan anggota keluarganya dilayani di rumah dapat menyampaikan permintaan melalui formulir pengaduan dan aspirasi pada portal ini.' },
    { ID:'BER-004', Judul:'Perbaikan Gorong-gorong Desa Sukamaju Selesai dalam 48 Jam', Kategori:'Pembangunan', Status:'Published',
      Penulis:'Seksi Ketentraman & Ketertiban', Tanggal_Publish:hariKe(-13), Foto_Cover:'',
      Ringkasan:'Laporan warga melalui portal ditindaklanjuti lewat kolaborasi Satgas Trantib dan Dinas Bina Marga.',
      Isi:'Laporan warga mengenai gorong-gorong tersumbat di Dusun Sukamaju yang masuk melalui formulir pengaduan portal ditindaklanjuti dalam waktu kurang dari dua hari kerja.\n\nSatgas Ketentraman dan Ketertiban bersama Dinas Bina Marga kabupaten menurunkan alat berat ringan untuk normalisasi saluran, dibantu warga setempat.\n\nHasil penanganan didokumentasikan dan dikirimkan kembali kepada pelapor sebagai bentuk pertanggungjawaban penanganan aduan.' },
    { ID:'BER-005', Judul:'Transparansi APBD & Realisasi Anggaran Triwulan Dipublikasikan', Kategori:'Transparansi', Status:'Published',
      Penulis:'Sekretariat Kecamatan', Tanggal_Publish:hariKe(-19), Foto_Cover:'',
      Ringkasan:'Ringkasan realisasi anggaran kecamatan kini dapat diunduh publik setiap triwulan.',
      Isi:'Kantor kecamatan mempublikasikan ringkasan realisasi anggaran secara triwulanan sebagai bagian dari komitmen keterbukaan informasi publik sesuai Undang-Undang Nomor 14 Tahun 2008.\n\nDokumen ringkasan dapat diunduh pada halaman Dokumen Publik portal ini, memuat pagu, realisasi, serta persentase penyerapan tiap program.\n\nMasyarakat dapat menyampaikan pertanyaan atau keberatan atas informasi yang dipublikasikan melalui kanal aspirasi warga.' },
    { ID:'BER-006', Judul:'Pelatihan Pemasaran Digital bagi 40 Pelaku UMKM Desa', Kategori:'Ekonomi Kreatif', Status:'Published',
      Penulis:'Seksi Ekonomi & Pembangunan', Tanggal_Publish:hariKe(-25), Foto_Cover:'',
      Ringkasan:'Pelatihan tiga hari membekali pelaku usaha dengan keterampilan foto produk dan penjualan daring.',
      Isi:'Sebanyak 40 pelaku UMKM dari delapan desa mengikuti pelatihan pemasaran digital yang digelar di aula kantor kecamatan selama tiga hari.\n\nMateri pelatihan mencakup pengambilan foto produk dengan telepon genggam, penulisan deskripsi produk, hingga pengelolaan pesanan melalui lokapasar daring.\n\nSeluruh peserta didampingi hingga berhasil menayangkan minimal satu produk pada kanal penjualan daring masing-masing.' },
    { ID:'BER-007', Judul:'Posko Siaga Bencana Kecamatan Diaktifkan 24 Jam', Kategori:'Layanan Publik', Status:'Published',
      Penulis:'Seksi Ketentraman & Ketertiban', Tanggal_Publish:hariKe(-32), Foto_Cover:'',
      Ringkasan:'Menghadapi musim hujan, posko siaga bersama Linmas dan relawan desa mulai beroperasi penuh.',
      Isi:'Menghadapi puncak musim hujan, kantor kecamatan mengaktifkan posko siaga bencana yang beroperasi 24 jam dengan dukungan Linmas desa dan relawan kebencanaan.\n\nPosko dilengkapi peralatan evakuasi dasar, perahu karet, serta jalur komunikasi langsung dengan Damkar dan Puskesmas.\n\nWarga diimbau menyimpan nomor siaga yang tertera pada halaman pengaduan portal ini dan segera melapor bila menemukan tanda bahaya di lingkungannya.' }
  ],

  Upload_Dokumen: [
    { ID:'DOK-001', Nama_Dokumen:'SOP Pelayanan Pengaduan Masyarakat',            Kategori:'Regulasi',     Ukuran:'840 KB', Link_Drive:'', Tanggal_Upload:hariKe(-15), Ditampilkan_Publik:'Y' },
    { ID:'DOK-002', Nama_Dokumen:'Ringkasan Realisasi Anggaran Triwulan Berjalan', Kategori:'Transparansi', Ukuran:'1,2 MB', Link_Drive:'', Tanggal_Upload:hariKe(-19), Ditampilkan_Publik:'Y' },
    { ID:'DOK-003', Nama_Dokumen:'Struktur Organisasi & Tata Kerja Kecamatan',     Kategori:'Profil',       Ukuran:'620 KB', Link_Drive:'', Tanggal_Upload:hariKe(-40), Ditampilkan_Publik:'Y' },
    { ID:'DOK-004', Nama_Dokumen:'Syarat & Alur Layanan Administrasi Kependudukan',Kategori:'Layanan',      Ukuran:'980 KB', Link_Drive:'', Tanggal_Upload:hariKe(-47), Ditampilkan_Publik:'Y' },
    { ID:'DOK-005', Nama_Dokumen:'Daftar Desa Binaan & Kontak Kepala Desa',        Kategori:'Profil',       Ukuran:'430 KB', Link_Drive:'', Tanggal_Upload:hariKe(-60), Ditampilkan_Publik:'Y' }
  ]
};
