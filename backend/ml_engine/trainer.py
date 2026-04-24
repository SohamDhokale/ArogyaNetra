import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from imblearn.over_sampling import SMOTE
import joblib
import os

class ReadmissionModelTrainer:
    def __init__(self, data_path=None):
        self.data_path = data_path
        self.model = None
        self.features = ['age', 'glucose', 'blood_pressure', 'bmi', 'chronic_illnesses', 
                         'previous_admissions', 'length_of_stay']
        self.target = 'readmitted'

    def load_data(self):
        if self.data_path and os.path.exists(self.data_path):
            df = pd.read_csv(self.data_path)
            # Map existing columns if necessary or generate missing ones
            # For demonstration, we'll ensure these columns exist
            if 'Outcome' in df.columns:
                df = df.rename(columns={'Outcome': 'readmitted', 'Age': 'age', 'Glucose': 'glucose', 
                                      'BloodPressure': 'blood_pressure', 'BMI': 'bmi'})
            
            # Synthesize missing readmission-specific features if not present
            if 'chronic_illnesses' not in df.columns:
                df['chronic_illnesses'] = np.random.randint(0, 5, size=len(df))
            if 'previous_admissions' not in df.columns:
                df['previous_admissions'] = np.random.randint(0, 10, size=len(df))
            if 'length_of_stay' not in df.columns:
                df['length_of_stay'] = np.random.randint(1, 15, size=len(df))
            
            return df
        else:
            # Generate synthetic data if no file provided
            return self._generate_synthetic_data()

    def _generate_synthetic_data(self, n_samples=2000):
        np.random.seed(42)
        data = {
            'age': np.random.randint(18, 90, n_samples),
            'glucose': np.random.randint(70, 200, n_samples),
            'blood_pressure': np.random.randint(60, 120, n_samples),
            'bmi': np.random.uniform(18, 45, n_samples),
            'chronic_illnesses': np.random.randint(0, 6, n_samples),
            'previous_admissions': np.random.randint(0, 10, n_samples),
            'length_of_stay': np.random.randint(1, 20, n_samples),
        }
        df = pd.DataFrame(data)

        # Realistic continuous risk score with noise to avoid perfect separation
        risk_score = (
            (df['age'] - 18) / 72 * 0.20 +
            (df['glucose'] - 70) / 130 * 0.20 +
            (df['blood_pressure'] - 60) / 60 * 0.10 +
            (df['bmi'] - 18) / 27 * 0.10 +
            df['chronic_illnesses'] / 5 * 0.20 +
            df['previous_admissions'] / 9 * 0.15 +
            df['length_of_stay'] / 19 * 0.05
        )
        # Add noise so the model learns probabilities, not hard boundaries
        noise = np.random.normal(0, 0.12, n_samples)
        risk_prob = np.clip(risk_score + noise, 0, 1)
        df['readmitted'] = (risk_prob > 0.5).astype(int)
        return df

    def train(self):
        df = self.load_data()
        X = df[self.features]
        y = df[self.target]

        # Handle class imbalance with SMOTE
        smote = SMOTE(random_state=42)
        X_res, y_res = smote.fit_resample(X, y)

        X_train, X_test, y_train, y_test = train_test_split(X_res, y_res, test_size=0.2, random_state=42)

        self.model = xgb.XGBClassifier(
            n_estimators=200,
            max_depth=3,          # Shallower trees = less overfitting = smoother probabilities
            learning_rate=0.05,
            subsample=0.8,
            colsample_bytree=0.8,
            min_child_weight=5,   # Prevents overfitting on small groups
            gamma=1,              # Regularization
            random_state=42,
            eval_metric='logloss'
        )
        self.model.fit(X_train, y_train,
            eval_set=[(X_test, y_test)],
            verbose=False
        )

        y_pred = self.model.predict(X_test)
        print(f"Accuracy: {accuracy_score(y_test, y_pred)}")
        print(classification_report(y_test, y_pred))

        # Save model and features
        os.makedirs('backend/ml_engine/models', exist_ok=True)
        joblib.dump(self.model, 'backend/ml_engine/models/readmission_model.pkl')
        joblib.dump(self.features, 'backend/ml_engine/models/features.pkl')
        return self.model

if __name__ == "__main__":
    trainer = ReadmissionModelTrainer('ML_model/ArogyaNetra_diabetes.csv')
    trainer.train()
