import shap
import pandas as pd
import joblib
import os
from typing import Dict, Any, List

class ReadmissionExplainability:
    def __init__(self, model_path='backend/ml_engine/models/readmission_model.pkl'):
        self.model = joblib.load(model_path)
        self.features = joblib.load('backend/ml_engine/models/features.pkl')
        self.explainer = shap.TreeExplainer(self.model)
        
        # Feature descriptions and normal ranges
        self.feature_descriptions = {
            'age': {'description': 'Patient age in years', 'unit': 'years', 'normal_range': '18-80'},
            'glucose': {'description': 'Blood glucose level', 'unit': 'mg/dL', 'normal_range': '70-100'},
            'blood_pressure': {'description': 'Systolic blood pressure', 'unit': 'mmHg', 'normal_range': '<120'},
            'bmi': {'description': 'Body Mass Index', 'unit': 'kg/m²', 'normal_range': '18.5-24.9'},
            'chronic_illnesses': {'description': 'Number of chronic conditions', 'unit': 'count', 'normal_range': '0-1'},
            'previous_admissions': {'description': 'Previous hospital admissions', 'unit': 'count', 'normal_range': '0-2'},
            'length_of_stay': {'description': 'Current hospital stay duration', 'unit': 'days', 'normal_range': '1-7'}
        }

    def explain(self, patient_data: Dict[str, Any]):
        """Generate comprehensive SHAP explanations"""
        try:
            # Convert patient_data to DataFrame
            df = pd.DataFrame([patient_data])
            # Reorder features to match training data
            X = df[self.features]
            
            # Calculate SHAP values
            shap_values = self.explainer.shap_values(X)
            
            # Debug log
            print(f"SHAP Values Type: {type(shap_values)}")
            
            # Handle different SHAP output formats (XGBoost, RandomForest, etc.)
            if isinstance(shap_values, list):
                # For classification models with multiple classes, shap_values is a list
                # Class 1 is readmission risk
                shap_v = shap_values[1][0]
            elif len(shap_values.shape) == 3:
                # Some versions return (samples, features, classes)
                shap_v = shap_values[0, :, 1]
            elif len(shap_values.shape) == 2 and shap_values.shape[0] == 1:
                # Single sample result
                shap_v = shap_values[0]
            else:
                shap_v = shap_values

            # Combine feature names with their SHAP values and detailed information
            explanations = []
            for feature, value, patient_val in zip(self.features, shap_v, X.values[0]):
                desc = self.feature_descriptions.get(feature, {'description': feature, 'unit': '', 'normal_range': 'N/A'})
                
                # Determine if value is abnormal
                is_abnormal = False
                if feature == 'age' and (patient_val < 18 or patient_val > 80):
                    is_abnormal = True
                elif feature == 'glucose' and (patient_val < 70 or patient_val > 100):
                    is_abnormal = True
                elif feature == 'blood_pressure' and patient_val > 120:
                    is_abnormal = True
                elif feature == 'bmi' and (patient_val < 18.5 or patient_val > 24.9):
                    is_abnormal = True
                
                explanations.append({
                    "feature": feature,
                    "feature_name": feature.replace('_', ' ').title(),
                    "description": desc['description'],
                    "impact": float(value),
                    "importance": abs(float(value)),
                    "patient_value": float(patient_val),
                    "unit": desc['unit'],
                    "normal_range": desc['normal_range'],
                    "is_abnormal": is_abnormal,
                    "direction": "Increases Risk ↑" if value > 0 else "Decreases Risk ↓",
                    "interpretation": self._get_interpretation(feature, value, patient_val)
                })
                
            # Sort by absolute impact (importance)
            explanations.sort(key=lambda x: x["importance"], reverse=True)
            
            return explanations
        except Exception as e:
            print(f"SHAP error: {str(e)}")
            # Fallback to simple importance if SHAP fails
            return [
                {
                    "feature": f,
                    "feature_name": f.replace('_', ' ').title(),
                    "description": f,
                    "impact": 0.0,
                    "importance": 0.0,
                    "patient_value": float(patient_data.get(f, 0)),
                    "unit": "",
                    "normal_range": "",
                    "is_abnormal": False,
                    "direction": "Neutral",
                    "interpretation": f"Analysis pending for {f}"
                } for f in self.features
            ]
    
    def _get_interpretation(self, feature: str, shap_value: float, patient_value: float) -> str:
        """Generate human-readable interpretation of SHAP values"""
        impact_level = "HIGH" if abs(shap_value) > 1 else "MODERATE" if abs(shap_value) > 0.5 else "LOW"
        direction = "INCREASES" if shap_value > 0 else "DECREASES"
        
        interpretations = {
            'age': f"This patient's age {direction}s readmission risk with {impact_level} impact.",
            'glucose': f"Glucose level of {patient_value:.0f} mg/dL {direction}s risk ({impact_level} impact).",
            'blood_pressure': f"Blood pressure of {patient_value:.0f} mmHg {direction}s risk ({impact_level} impact).",
            'bmi': f"BMI of {patient_value:.1f} {direction}s readmission risk ({impact_level} impact).",
            'chronic_illnesses': f"{patient_value:.0f} chronic illnesses {direction} readmission risk ({impact_level} impact).",
            'previous_admissions': f"{patient_value:.0f} previous admissions {direction} risk ({impact_level} impact).",
            'length_of_stay': f"Current stay of {patient_value:.0f} days {direction}s readmission probability ({impact_level} impact)."
        }
        
        return interpretations.get(feature, f"This factor {direction}s readmission risk with {impact_level} impact.")

if __name__ == "__main__":
    explainability = ReadmissionExplainability()
    test_patient = {
        'age': 45,
        'glucose': 120,
        'blood_pressure': 80,
        'bmi': 25.5,
        'chronic_illnesses': 2,
        'previous_admissions': 1,
        'length_of_stay': 3
    }
    explanations = explainability.explain(test_patient)
    for exp in explanations:
        print(f"{exp['feature_name']}: {exp['interpretation']}")
