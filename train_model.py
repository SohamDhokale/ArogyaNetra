import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'diabetes_app.settings')
django.setup()

from backend.ml_engine.trainer import ReadmissionModelTrainer

trainer = ReadmissionModelTrainer()
model = trainer.train()

# Quick sanity check - test a few patients to verify probability spread
import pandas as pd
import numpy as np

test_cases = [
    {'age': 25, 'glucose': 85,  'blood_pressure': 75,  'bmi': 22.0, 'chronic_illnesses': 0, 'previous_admissions': 0, 'length_of_stay': 2},
    {'age': 45, 'glucose': 130, 'blood_pressure': 95,  'bmi': 27.0, 'chronic_illnesses': 2, 'previous_admissions': 2, 'length_of_stay': 6},
    {'age': 70, 'glucose': 190, 'blood_pressure': 140, 'bmi': 35.0, 'chronic_illnesses': 4, 'previous_admissions': 6, 'length_of_stay': 14},
]

print("\n--- Probability Sanity Check ---")
for tc in test_cases:
    df = pd.DataFrame([tc])
    prob = model.predict_proba(df)[0][1]
    print(f"Age={tc['age']}, Glucose={tc['glucose']}, Chronic={tc['chronic_illnesses']} → Risk: {prob*100:.1f}%")
print("--------------------------------\n")
print("✅ Model retrained and saved!")
