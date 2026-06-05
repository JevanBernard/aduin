import tensorflow as tf
import pickle

# Load model
model = tf.keras.models.load_model(
    "model/model_cpu.keras",
    compile=False
)

# Load tokenizer
with open("model/tokenizer.pkl", "rb") as f:
    tokenizer = pickle.load(f)

