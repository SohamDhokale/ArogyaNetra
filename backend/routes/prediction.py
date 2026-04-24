from fastapi import APIRouter, HTTPException
from predictor.models import Patient
from ..schemas import PredictionResponse
from ..ml_engine.predictor import ReadmissionPredictor
from ..ml_engine.explainability import ReadmissionExplainability
from ..ml_engine.recommendations import ReadmissionRecommendations

router = APIRouter(prefix="/predict", tags=["prediction"])

predictor = ReadmissionPredictor()
explainability = ReadmissionExplainability()
recommender = ReadmissionRecommendations()

@router.get("/{patient_id}", response_model=PredictionResponse)
def predict_readmission(patient_id: str):
    try:
        patient = Patient.objects.get(patient_id=patient_id)
    except Patient.DoesNotExist:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Prepare data for prediction
    patient_data = {
        'age': patient.age,
        'glucose': patient.glucose or 100, # Fallback values
        'blood_pressure': patient.blood_pressure or 80,
        'bmi': patient.bmi or 25,
        'chronic_illnesses': patient.chronic_illnesses or 0,
        'previous_admissions': patient.previous_admissions or 0,
        'length_of_stay': patient.length_of_stay or 1
    }
    
    # 1. Prediction
    prediction = predictor.predict(patient_data)
    
    # 2. Explainability
    shap_explanations = explainability.explain(patient_data)
    
    # 3. Recommendations
    clinical_advice = recommender.get_recommendations(patient_data, shap_explanations)
    
    # Update patient record in DB
    patient.risk_score = prediction["risk_score"]
    patient.is_high_risk = prediction["is_high_risk"]
    patient.shap_values = {e["feature"]: e["impact"] for e in shap_explanations}
    patient.recommendations = clinical_advice
    patient.save()
    
    return {
        "patient_id": patient_id,
        "risk_score": prediction["risk_score"],
        "risk_label": prediction["risk_label"],
        "key_factors": shap_explanations[:5],  # Return top 5 factors
        "all_factors": shap_explanations,  # Return all factors for detailed analysis
        "clinical_advice": clinical_advice
    }
