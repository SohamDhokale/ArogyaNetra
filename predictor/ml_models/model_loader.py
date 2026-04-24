import joblib
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'arogyanetra_model.pkl')

# Lazy load model to avoid startup errors if model file is missing
model = None

def get_model():
    global model
    if model is None:
        if os.path.exists(MODEL_PATH):
            model = joblib.load(MODEL_PATH)
        else:
            # Return None if model doesn't exist - views should handle this
            pass
    return model