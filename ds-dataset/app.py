import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# ==============================================================================
# 1. KONFIGURASI HALAMAN 
# ==============================================================================
st.set_page_config(
    page_title="Dashboard EDA ADUIN",
    page_icon="📊",
    layout="wide"
)

# Setup Tema Seaborn persis seperti di Jupyter Notebook
sns.set_theme(style="whitegrid", palette="muted")

# ==============================================================================
# 2. LOAD DATA
# ==============================================================================
@st.cache_data
def load_data():
    # Menyesuaikan dengan path lokal kamu
    return pd.read_csv('data/final/data_valid_siap_split.csv')

df = load_data()

# Mendefinisikan kolom kategori dan label mapping
kategori_cols = [c for c in df.columns if str(c).startswith("kategori_")]
label_map = {
    "kategori_infrastruktur":    "Infrastruktur",
    "kategori_lingkungan":       "Lingkungan",
    "kategori_air_sanitasi":     "Air & Sanitasi",
    "kategori_bencana":          "Bencana",
    "kategori_transportasi":     "Transportasi",
    "kategori_pelayanan_publik": "Pelayanan Publik",
    "kategori_ekonomi":          "Ekonomi",
    "kategori_keamanan":         "Keamanan",
    "kategori_pendidikan":       "Pendidikan",
    "kategori_kesehatan":        "Kesehatan"
}

# ==============================================================================
# 3. SIDEBAR NAVIGATION
# ==============================================================================
st.sidebar.title("Navigasi ADUIN 🧭")
menu = st.sidebar.radio(
    "Pilih Menu Exploratory:",
    ["1. Overview Data", "2. Analisis Univariate", "3. Analisis Bivariat & Multivariat", "4. Menjawab Pertanyaan Bisnis", "5. Kesimpulan"]
)

st.title("CAPSTONE PROJECT ADUIN - EDA Dashboard 📈")
st.markdown("---")

# ==============================================================================
# MENU 1: OVERVIEW DATA
# ==============================================================================
if menu == "1. Overview Data":
    st.header("Overview Dataset")
    st.dataframe(df.head())
    
    col1, col2 = st.columns(2)
    with col1:
        st.subheader("Informasi Dimensi")
        st.write(f"Total Baris: {df.shape[0]}")
        st.write(f"Total Kolom: {df.shape[1]}")
    with col2:
        st.subheader("Cek Missing Value")
        st.write(df.isnull().sum()[df.isnull().sum() > 0])
        st.write("Tidak ada missing value" if df.isnull().sum().sum() == 0 else "")

    st.markdown("""
    **Insight:**
    * Tidak ditemukan data missing value pada dataset
    * Tidak ditemukan data duplikat pada dataset
    * Baris pada dataset berjumlah 6083 dan tidak bertipe data numerik
    """)

# ==============================================================================
# MENU 2: ANALISIS UNIVARIATE
# ==============================================================================
elif menu == "2. Analisis Univariate":
    st.header("Analisis Univariate")
    
    # FUNGSI PLOT BAR VERTICAL (Persis dari Notebook)
    def plot_bar_v(series, title, ax, color=None):
        counts = series.value_counts()
        ax.bar(counts.index, counts.values, color=color, width=0.5)
        ax.set_title(title, fontsize=12, fontweight="bold")
        ax.set_ylabel("Jumlah")
        for patch in ax.patches:
            ax.text(
                patch.get_x() + patch.get_width() / 2,
                patch.get_height() + 20,
                f"{int(patch.get_height()):,}",
                ha="center", fontsize=10
            )
        ax.spines[["top", "right"]].set_visible(False)

    # Plot 1: Distribusi Variabel
    st.subheader("Distribusi Variabel")
    fig1, axes1 = plt.subplots(nrows=1, ncols=3, figsize=(14, 4))
    plot_bar_v(df["urgensi"],  "Urgensi",     axes1[0])
    plot_bar_v(df["sentimen"], "Sentimen",    axes1[1])
    plot_bar_v(df["sumber"],   "Sumber Data", axes1[2])
    fig1.tight_layout()
    st.pyplot(fig1)

    # Plot 2: Jumlah Kategori per Aduan
    st.subheader("Jumlah Kategori per Pengaduan")
    df["jumlah_kategori"] = df[kategori_cols].sum(axis=1)
    fig2, ax2 = plt.subplots(figsize=(6, 4))
    plot_bar_v(df["jumlah_kategori"].astype(str).map(lambda x: f"{x} kategori"), "", ax2)
    fig2.tight_layout()
    st.pyplot(fig2)

    st.markdown("""
    **Insight:**
    * Urgensi
      - Keluhan dengan urgensi Rendah mendominasi (3.716) dibandingkan urgensi tinggi dan sedang
      - Distribusi tidak seimbang. Perlu melakukan sesuatu untuk mengatasi ini karena akan sangat memengaruhi pelatihan model klasifikasinya

    * Sentimen
      - Sentimen Netral mendominasi dibandingkan sentimen Positif atau Negatif
      - Distribusi tidak seimbang. Apakah ada kemungkinan model sentimennya terlalu konservatif dalam melabeli Negatif?

    * Sumber Data
      - berita_kaggle lebih banyak dibandingkan data dari twitter

    * Kategori
      - Kategori Ekonomi terbanyak (1.101), disusul kategori Lingkungan (1.022)
      - Kategori Bencana (493) dan Kesehatan (545) paling sedikit dikeluhkan
      - Sebagian besar data (4.906 baris atau 80.6%) hanya punya 1 kategori per pengaduan, sisanya 2–4 kategori
    """)

# ==============================================================================
# MENU 3: ANALISIS BIVARIAT & MULTIVARIAT
# ==============================================================================
elif menu == "3. Analisis Bivariat & Multivariat":
    st.header("Analisis Bivariat dan Multivariat")

    # Crosstab Heatmap
    st.subheader("Urgensi × Sentimen (Heatmap)")
    ct_jumlah = pd.crosstab(df["urgensi"], df["sentimen"])
    ct_persen = ct_jumlah.div(ct_jumlah.sum(axis=1), axis=0).mul(100).round(1)

    fig3, axes3 = plt.subplots(nrows=1, ncols=2, figsize=(13, 4))
    sns.heatmap(ct_jumlah, annot=True, fmt="d", cmap="Blues", linewidths=0.5, ax=axes3[0])
    axes3[0].set_title("Jumlah")
    axes3[0].set_xlabel("Sentimen")
    axes3[0].set_ylabel("Urgensi")

    sns.heatmap(ct_persen, annot=True, fmt=".1f", cmap="Oranges", linewidths=0.5, ax=axes3[1])
    axes3[1].set_title("% per Urgensi")
    axes3[1].set_xlabel("Sentimen")
    axes3[1].set_ylabel("")
    fig3.tight_layout()
    st.pyplot(fig3)

    # Distribusi Urgensi per Kategori
    st.subheader("Distribusi Urgensi per Kategori")
    rows_urg = []
    for col, label in label_map.items():
        subset = df[df[col] == 1]["urgensi"].value_counts()
        subset.name = label
        rows_urg.append(subset)
    kategori_urgensi = pd.DataFrame(rows_urg).fillna(0).astype(int)[["Tinggi", "Sedang", "Rendah"]]

    fig4, ax4 = plt.subplots(figsize=(9, 5))
    kategori_urgensi.plot(kind="barh", stacked=True, color=["#C44E52", "#8C8C8C", "#4C72B0"], ax=ax4, width=0.6)
    ax4.set_xlabel("Jumlah Pengaduan")
    ax4.legend(title="Urgensi", bbox_to_anchor=(1.01, 1), loc="upper left")
    ax4.spines[["top", "right"]].set_visible(False)
    fig4.tight_layout()
    st.pyplot(fig4)

    # Distribusi Sentimen per Kategori
    st.subheader("Distribusi Sentimen per Kategori")
    rows_sent = []
    for col, label in label_map.items():
        subset = df[df[col] == 1]["sentimen"].value_counts()
        subset.name = label
        rows_sent.append(subset)
    kategori_sentimen = pd.DataFrame(rows_sent).fillna(0).astype(int)[["Negatif", "Netral", "Positif"]]

    fig5, ax5 = plt.subplots(figsize=(9, 5))
    kategori_sentimen.plot(kind="barh", stacked=True, color=["#C44E52", "#8C8C8C", "#55A868"], ax=ax5, width=0.6)
    ax5.set_xlabel("Jumlah Pengaduan")
    ax5.legend(title="Sentimen", bbox_to_anchor=(1.01, 1), loc="upper left")
    ax5.spines[["top", "right"]].set_visible(False)
    fig5.tight_layout()
    st.pyplot(fig5)

    st.markdown("""
    **Insight:**
    * Urgensi × Sentimen (heatmap)
      - Pengaduan urgensi Tinggi ternyata didominasi sentimen Netral (81.5%), bukan Negatif seperti yang mungkin diasumsikan. Artinya, tingginya urgensi tidak selalu diekspresikan dengan bahasa yang emosional/negatif
      - Urgensi Sedang memiliki proporsi sentimen Negatif tertinggi
      - Urgensi Rendah memiliki sentimen 84.4% Netral, Negatif dan Positif hampir seimbang (7.7% vs 7.9%)

    * Distribusi Urgensi per Kategori
      - Bencana merupakan kategori dengan proporsi urgensi Tinggi paling besar relatif terhadap totalnya
      - Lingkungan dan Ekonomi jumlah pengaduannya banyak, tetapi tidak mendapatkan urgensi Tinggi
      - Transportasi punya distribusi urgensi yang cukup merata antara Tinggi, Sedang, dan Rendah

    * Distribusi Sentimen per Kategori
      - Infrastruktur dan Pelayanan Publik punya porsi Negatif paling besar dibanding kategori lain
      - Bencana hampir seluruhnya Netral, kemungkinan karena ditulis dalam gaya pelaporan, bukan ekspresi emosi (kesenjangan sumber data)
      - Ekonomi punya porsi Positif paling besar, mungkin ada berita positif tentang ekonomi yang masuk ke dataset
    """)

# ==============================================================================
# MENU 4: MENJAWAB PERTANYAAN BISNIS
# ==============================================================================
elif menu == "4. Menjawab Pertanyaan Bisnis":
    st.header("Menjawab Pertanyaan Bisnis")

    st.markdown("### Pertanyaan 1: Kategori apa yang paling banyak diadukan?")
    kategori_count = df[kategori_cols].sum().rename(label_map).sort_values(ascending=True)
    fig6, ax6 = plt.subplots(figsize=(8, 5))
    ax6.barh(kategori_count.index, kategori_count.values)
    for patch in ax6.patches:
        ax6.text(patch.get_width() + 5, patch.get_y() + patch.get_height() / 2, f"{int(patch.get_width()):,}", va="center", fontsize=9)
    ax6.set_xlabel("Jumlah Pengaduan")
    ax6.spines[["top", "right"]].set_visible(False)
    fig6.tight_layout()
    st.pyplot(fig6)

    st.markdown("### Pertanyaan 2: Kategori apa yang paling banyak memiliki urgensi Tinggi?")
    df_tinggi = df[df["urgensi"] == "Tinggi"]
    tinggi_per_kategori = df_tinggi[kategori_cols].sum().rename(label_map).sort_values(ascending=True)
    fig7, ax7 = plt.subplots(figsize=(8, 5))
    ax7.barh(tinggi_per_kategori.index, tinggi_per_kategori.values)
    for patch in ax7.patches:
        ax7.text(patch.get_width() + 2, patch.get_y() + patch.get_height() / 2, f"{int(patch.get_width()):,}", va="center", fontsize=9)
    ax7.set_xlabel("Jumlah Pengaduan Urgensi Tinggi")
    ax7.spines[["top", "right"]].set_visible(False)
    fig7.tight_layout()
    st.pyplot(fig7)

    st.markdown("### Pertanyaan 3: Berdasarkan data pengaduan, apakah pengaduan dengan urgensi Tinggi selalu disertai dengan sentimen Negatif?")
    sentimen_tinggi = df_tinggi["sentimen"].value_counts()
    sentimen_tinggi_pct = (sentimen_tinggi / sentimen_tinggi.sum() * 100).round(2)
    
    fig8, ax8 = plt.subplots(figsize=(6, 4))
    for i, (label, jumlah) in enumerate(sentimen_tinggi.items()):
        ax8.bar(label, jumlah, width=0.5)
        ax8.text(i, jumlah + 5, f"{jumlah:,}\n({sentimen_tinggi_pct[label]:.1f}%)", ha="center", fontsize=10)
    ax8.set_ylabel("Jumlah Pengaduan")
    ax8.spines[["top", "right"]].set_visible(False)
    fig8.tight_layout()
    st.pyplot(fig8)

    st.markdown("""
    **Insight:**
    * **Pertanyaan 1: Kategori apa yang paling banyak diadukan?**
      - Ekonomi (1.101) merupakan kategori yang paling banyak muncul dalam pengaduan, diikuti Lingkungan (1.022) dan Transportasi (832)
      - Sementara Bencana (493) merupakan kategori paling sedikit diadukan, tetapi urgensinya paling tinggi
    * **Pertanyaan 2: Kategori apa yang paling banyak memiliki urgensi Tinggi?**
      - Bencana (396) memiliki urgensi Tinggi terbanyak, disusul kategori Lingkungan (249)
      - Sementara, Ekonomi yang jumlah pengaduannya terbanyak justru paling sedikit urgensi Tinggi-nya (107), artinya volume pengaduan tidak berbanding lurus dengan urgensi
      - Hal ini memvalidasi bahwa kategori Bencana meskipun jarang diadukan, hampir selalu dianggap mendesak
    * **Pertanyaan 3: Berdasarkan data pengaduan, apakah pengaduan dengan urgensi Tinggi selalu disertai dengan sentimen Negatif? Jika tidak, seberapa besar proporsi urgensi Tinggi yang bersentimen Netral atau Positif sehingga perlu dipertimbangkan dalam pembobotan sentiment intensity pada priority score ADUIN?**
      - Tidak. Urgensi Tinggi justru didominasi sentimen Netral (81.5% atau 1.097 pengaduan)
      - Sentimen Negatif hanya 11.4% (153 pengaduan) dan Positif 7.1% (96 pengaduan)
      - Maknanya, sentimen saja tidak cukup untuk mendeteksi urgensi tinggi. Jika priority score terlalu bergantung pada sentiment intensity, maka 88.6% pengaduan urgensi Tinggi berpotensi mendapat bobot yang lebih rendah dari seharusnya
    """)

# ==============================================================================
# MENU 5: KESIMPULAN
# ==============================================================================
elif menu == "5. Kesimpulan":
    st.header("Kesimpulan dan Rekomendasi")
    
    st.markdown("""
    **Kesimpulan**
    - **Conclusion pertanyaan 1:** Ekonomi merupakan kategori yang sering dikeluhkan dibandingkan kategori lainnya (1.101)
    - **Conclusion pertanyaan 2:** Bencana merupakan keluhan yang memiliki urgensi Tinggi paling banyak, tetapi tidak paling banyak dikeluhkan (kategori ekonomi mendominasi)
    - **Conclusion pertanyaan 3:** Alih-alih sentimen Negatif, urgensi Tinggi justru lebih banyak dikeluhkan dengan sentimen Netral. Artinya, sentimen tidak menjamin urgensi tinggi. Oleh karena itu, perlu adanya kalibrasi untuk pembobotan, jika skor prioritas bergantung pada intensitas sentimen.

    **Temuan Batasan Dataset**
    - Distribusi kelas tidak seimbang: urgensi Rendah hampir
      3x lipat urgensi Tinggi. Perlu diperhatikan saat training
      model klasifikasi.
    - Sentimen Netral sangat dominan (79.7%) — model sentimen
      yang digunakan kemungkinan konservatif dalam melabeli
      Negatif.
    - Sebanyak 46 teks sangat pendek (<5 kata), bersumber dari Twitter. Hal yang normal karena Twitter memiliki bahasa yang tidak baku dan penulisan yang singkat-singkat

    **Recommendation Action Item**
    - Dapat dilihat ketidakseimbangan antarkategori dalam evaluasi model, kategori dengan jumlah pengaduan sedikit, tetapi proporsi urgensi Tinggi yang besar, seperti Bencana berpotensi diabaikan oleh model. Hal ini bisa diatasi menggunakan F1-score untuk evaluasi tiap kelasnya
    """)