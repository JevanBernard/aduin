import streamlit as st

st.set_page_config(
    page_title="ADUIN - Dashboard Analitik",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

st.title("📊 ADUIN - Dashboard Analitik")
st.markdown("**Analisis Digital Untuk Insight Nusantara**")
st.markdown("---")

col1, col2, col3, col4 = st.columns(4)
col1.metric("Total Laporan", "1,247", "+156")
col2.metric("Urgent", "89", "+12")
col3.metric("Kategori Terbanyak", "Infrastruktur")
col4.metric("Avg Score", "67.3", "-2.1")

st.markdown("---")
st.info("Pilih halaman di sidebar untuk melihat analisis detail.")
