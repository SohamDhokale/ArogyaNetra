import joblib
import pandas as pd
import numpy as np
import os
from typing import Dict, Any, List

class ReadmissionPredictor:
    def __init__(self, model_path='backend/ml_engine/models/readmission_model.pkl'):
        self.model_path = model_path
        self.model = None
        self.features = None
        self._load_model()

    def _load_model(self):
        if os.path.exists(self.model_path):
            self.model = joblib.load(self.model_path)
            self.features = joblib.load('backend/ml_engine/models/features.pkl')
        else:
            # Fallback to training a model if not present
            from .trainer import ReadmissionModelTrainer
            trainer = ReadmissionModelTrainer()
            self.model = trainer.train()
            self.features = trainer.features

    def predict(self, patient_data: Dict[str, Any]):
        # Convert patient_data to DataFrame
        df = pd.DataFrame([patient_data])
        # Reorder features to match training data
        X = df[self.features]
        
        # Get probability
        risk_prob = self.model.predict_proba(X)[0][1] # Probability of class 1 (readmitted)
        risk_label = "High Risk" if risk_prob > 0.6 else ("Moderate Risk" if risk_prob > 0.3 else "Low Risk")
        
        return {
            "risk_score": round(risk_prob * 100, 2),
            "risk_label": risk_label,
            "is_high_risk": risk_prob > 0.6
        }

if __name__ == "__main__":
    predictor = ReadmissionPredictor()
    test_patient = {
        'age': 45,
        'glucose': 120,
        'blood_pressure': 80,
        'bmi': 25.5,
        'chronic_illnesses': 2,
        'previous_admissions': 1,
        'length_of_stay': 3
    }
    print(predictor.predict(test_patient))
