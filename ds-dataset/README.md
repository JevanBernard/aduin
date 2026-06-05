# ADUIN - Analisis Digital Untuk Insight Nusantara (Data Science Repository)

> *"Aduin aja, biar AI yang urus"*



Repositori ini difokuskan pada pemrosesan data (Data Wrangling), rekayasa fitur (Feature Engineering), dan Exploratory Data Analysis (EDA) untuk proyek **ADUIN**, sebuah platform klasifikasi pengaduan masyarakat berbasis AI. Proyek ini dikembangkan untuk Capstone Project DBS Foundation Coding Camp 2026 oleh Tim CC26-PSU299.

## 📊 Live Dashboard
Hasil Exploratory Data Analysis (EDA) interaktif dapat diakses melalui Streamlit Cloud:
👉 **[Buka Dashboard EDA ADUIN](https://guswid715-aduin-capstone-project-dataset-app-z4epkh.streamlit.app/)**

---

## 🎯 Fokus Utama Repositori
Repositori ini merepresentasikan tahap awal dari *pipeline* AI ADUIN, yang meliputi:
### 1. Data Wrangling End-to-End
Proses pembersihan dan penyelarasan data dilakukan secara menyeluruh pada dua sumber data yang berbeda agar menghasilkan dataset yang homogen dan siap latih:
* **Pembersihan Noise Otomatis:** Menghapus komponen non-kontekstual seperti URL, *mention* akun (`@username`), *hashtag* (`#`), karakter non-ASCII (emoji/aksara asing), serta tanda baca pada seluruh data Twitter/X dan Berita Kaggle.
* **Normalisasi Teks Informal (Twitter/X):** Mengubah kata-kata gaul (*slang*), singkatan, dan salah ketik (*typo*) menjadi kata baku bahasa Indonesia menggunakan metode *Dictionary Mapping* (Kamus Normalisasi) agar bobot kata tidak terpecah.
* **Penyelarasan Panjang Teks Berita (Kaggle):** Memotong artikel berita dan hanya mengambil **50 kata pertama (Lead Berita)** yang mengandung inti informasi (5W1H). 
* **Case Folding & Standardisasi:** Mengubah seluruh karakter teks menjadi huruf kecil (*lowercase*) serta menghapus spasi berlebih (*strip*) untuk menjamin konsistensi tokenisasi.
* **Integrasi Ragam Sumber Data:** Menyatukan (*merge*) data media sosial yang bersifat informal dengan data portal berita yang bersifat formal ke dalam satu *dataframe* utuh yang seimbang.

### 2. Feature Engineering & Pelabelan
* **Single-label (Urgensi & Sentimen):** Penentuan tingkat Urgensi (Rendah, Sedang, Tinggi) dan Sentimen (Negatif, Netral, Positif) menggunakan pendekatan *Keyword Scoring* berbasis aturan Regex *Word Boundary* (`\b`) serta pengaplikasian logika *Pessimistic Priority*.
* **Multi-label (10 Kategori Isu Publik):** Ekstraksi dan pemetaan otomatis ke dalam 10 kolom target biner isu secara simultan (Infrastruktur, Lingkungan, Air & Sanitasi, Bencana, Transportasi, Pelayanan Publik, Ekonomi, Keamanan, Pendidikan, dan Kesehatan).

### 3. Data Splitting (Stratified & Balanced)
* **Pemisahan Proporsional:** Membagi dataset menjadi Data Latih (Train Set - 80%) dan Data Uji (Test Set - 20%) menggunakan teknik `MultilabelStratifiedShuffleSplit` agar sebaran ke-10 kombinasi label kategori terdistribusi secara adil dan presisi.
* **Penyelamatan Bias Model (Undersampling):** Melakukan pemotongan (*downsampling*) acak pada kelas mayoritas target urgensi khusus pada Data Latih untuk mengatasi masalah *Catastrophic Collapse* (akurasi tertahan di 17%) pada arsitektur BiLSTM, dengan tetap mempertahankan keaslian distribusi Data Uji sebagai representasi dunia nyata.

### 4. Exploratory Data Analysis (EDA)
* Menjawab pertanyaan bisnis inti organisasi mengenai frekuensi aduan tertinggi, peta urgensi bencana, serta pengujian korelasi intensitas emosi (sentimen) terhadap tingkat prioritas penanganan masalah.

### 5. Data Dictionary
📖 Penjelasan detail mengenai skema dataset final, tipe data, dan definisi masing-masing kolom pengkodean target dapat diakses pada file **[`Data_Dictionary_ADUIN.md`](Data_Dictionary_ADUIN.md)**.

---

## 🛠️ Tech Stack & Library
- **Bahasa:** Python
- **Data Manipulation:** Pandas, NumPy
- **Machine Learning & Splitting:** Scikit-Learn, Iterative-Stratification
- **Data Visualization:** Matplotlib, Seaborn
- **Dashboarding:** Streamlit

---

## 🚀 Cara Menjalankan Dashboard Secara Lokal

Jika Anda ingin menjalankan dashboard EDA ini di komputer lokal, ikuti langkah berikut:

1. **Clone repositori ini:**
   ```bash
   git clone [https://github.com/guswid715/aduin-capstone-project-dataset.git](https://github.com/guswid715/aduin-capstone-project-dataset.git)
   cd aduin-capstone-project-dataset
   ```
2. **Instal dependensi:**
```bash
   pip install -r requirements.txt
```
3. **Jalankan Streamlit:**
```bash
   streamlit run app.py
```

---

## 👥 Tim CC26-PSU299

Repositori data ini dikelola oleh tim Data Science:

1. Ida Bagus Gede Widiastana Bawaskara - Data Scientist
2. Diana Qisthin Thoniyah - Data Scientist
