# Data Dictionary (Kamus Data) - Proyek ADUIN

File ini menjelaskan skema dari dataset latih (`train_data_balanced.csv`) dan dataset uji (`test_data_encoded.csv`) yang disiapkan untuk model.

| Nama Kolom                  | Tipe Data | Deskripsi & Nilai                                                                                                               |
| :-------------------------- | :-------- | :------------------------------------------------------------------------------------------------------------------------------ |
| `sumber`                    | String    | Platform asal data pelaporan (`twitter` atau `berita_kaggle`).                                                                  |
| `tanggal`                   | Date      | Tanggal laporan ditarik/diterbitkan (Format: YYYY-MM-DD).                                                                       |
| `teks_bersih`               | String    | Teks keluhan yang sudah dinormalisasi (lowercase, tanpa punctuation, typo/slang diatasi). Ini adalah **Fitur Input Utama (X)**. |
| `urgensi`                   | Integer   | **Target (Y1)** Tingkat kedaruratan laporan. <br> `0` = Rendah <br> `1` = Sedang <br> `2` = Tinggi.                             |
| `sentimen`                  | Integer   | **Target (Y2)** Emosi publik dari teks. <br> `0` = Negatif <br> `1` = Netral <br> `2` = Positif.                                |
| `kategori_infrastruktur`    | Integer   | **Target (Y3-Multi)** Terkait jalan rusak, jembatan, bangunan (`1`=Ya, `0`=Tidak).                                              |
| `kategori_lingkungan`       | Integer   | **Target (Y4-Multi)** Terkait polusi, sampah, limbah (`1`=Ya, `0`=Tidak).                                                       |
| `kategori_air_sanitasi`     | Integer   | **Target (Y5-Multi)** Terkait krisis air, pipa PDAM, sanitasi (`1`=Ya, `0`=Tidak).                                              |
| `kategori_bencana`          | Integer   | **Target (Y6-Multi)** Terkait banjir, longsor, gempa (`1`=Ya, `0`=Tidak).                                                       |
| `kategori_transportasi`     | Integer   | **Target (Y7-Multi)** Terkait macet, parkir liar, angkot (`1`=Ya, `0`=Tidak).                                                   |
| `kategori_pelayanan_publik` | Integer   | **Target (Y8-Multi)** Terkait antrean, birokrasi, KTP (`1`=Ya, `0`=Tidak).                                                      |
| `kategori_ekonomi`          | Integer   | **Target (Y9-Multi)** Terkait sembako, harga pasar, PHK (`1`=Ya, `0`=Tidak).                                                    |
| `kategori_keamanan`         | Integer   | **Target (Y10-Multi)** Terkait begal, kriminalitas, tawuran (`1`=Ya, `0`=Tidak).                                                |
| `kategori_pendidikan`       | Integer   | **Target (Y11-Multi)** Terkait spp, fasilitas sekolah, kampus (`1`=Ya, `0`=Tidak).                                              |
| `kategori_kesehatan`        | Integer   | **Target (Y12-Multi)** Terkait rumah sakit, BPJS, obat (`1`=Ya, `0`=Tidak).                                                     |
