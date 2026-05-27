"""
Text preprocessing pipeline for Indonesian complaint texts.
Handles: normalization, slang, abbreviations, emoji, cleaning.
"""
import re


# Abbreviation dictionary
ABBREVIATIONS = {
    "jln": "jalan", "jl": "jalan", "jl.": "jalan",
    "tdk": "tidak", "gk": "tidak", "ga": "tidak", "nggak": "tidak",
    "yg": "yang", "dgn": "dengan", "utk": "untuk",
    "blm": "belum", "sdh": "sudah", "udh": "sudah",
    "pemkot": "pemerintah kota", "pemkab": "pemerintah kabupaten",
    "pdam": "perusahaan daerah air minum",
    "dlh": "dinas lingkungan hidup",
    "pu": "pekerjaan umum",
}


def normalize_abbreviations(text: str) -> str:
    words = text.split()
    result = []
    for word in words:
        clean = word.lower().strip(".,!?")
        if clean in ABBREVIATIONS:
            result.append(ABBREVIATIONS[clean])
        else:
            result.append(word)
    return " ".join(result)


def clean_text(text: str) -> str:
    text = re.sub(r"http\S+|www\.\S+", "", text)
    text = re.sub(r"@\w+", "", text)
    text = re.sub(r"#\w+", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def preprocess(text: str) -> str:
    text = clean_text(text)
    text = normalize_abbreviations(text)
    text = text.lower()
    return text
