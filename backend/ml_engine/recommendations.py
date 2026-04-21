from typing import List, Dict, Any

class ReadmissionRecommendations:
    @staticmethod
    def get_recommendations(patient_data: Dict[str, Any], shap_explanations: List[Dict[str, Any]]) -> List[Dict[str, str]]:
        recommendations = []
        
        # Categorized recommendations
        categories = {
            "Follow-up": [],
            "Medication": [],
            "Monitoring": [],
            "Lifestyle": []
        }
        
        # Top factors from SHAP
        top_factors = shap_explanations[:5]
        
        for factor in top_factors:
            feature = factor["feature"]
            impact = factor["impact"]
            
            if impact > 0: # This factor increases readmission risk
                if feature == "age" and patient_data["age"] > 65:
                    categories["Follow-up"].append("Schedule geriatric specialist follow-up within 7 days.")
                    categories["Monitoring"].append("Assess for cognitive decline and fall risk during home visits.")
                elif feature == "chronic_illnesses" and patient_data["chronic_illnesses"] > 2:
                    categories["Medication"].append("Perform comprehensive medication reconciliation for multiple comorbidities.")
                    categories["Follow-up"].append("Coordinate multidisciplinary team meeting (PCP, specialists, pharmacist).")
                elif feature == "length_of_stay" and patient_data["length_of_stay"] < 3:
                    categories["Follow-up"].append("Early discharge detected; ensure home health nurse visit within 48 hours.")
                    categories["Monitoring"].append("Monitor for post-discharge complications related to short hospital stay.")
                elif feature == "previous_admissions" and patient_data["previous_admissions"] > 1:
                    categories["Follow-up"].append("High utilization history; assign a dedicated case manager for intensive support.")
                    categories["Lifestyle"].append("Review social determinants of health (SDOH) barriers to care compliance.")
                elif feature == "glucose" and (patient_data.get("glucose", 0) > 140 or feature == "glucose"):
                    categories["Monitoring"].append("Implement intensive blood glucose monitoring protocol (4x daily).")
                    categories["Lifestyle"].append("Provide formal diabetes self-management education (DSME).")
                    categories["Medication"].append("Review and adjust insulin or oral hypoglycemic regimen.")
                elif feature == "blood_pressure" and (patient_data.get("blood_pressure", 0) > 90 or feature == "blood_pressure"):
                    categories["Monitoring"].append("Daily home blood pressure monitoring with automated reporting.")
                    categories["Lifestyle"].append("Enroll in DASH diet counseling and sodium restriction program.")
                    categories["Medication"].append("Assess adherence to antihypertensive medications.")
                elif feature == "bmi" and (patient_data.get("bmi", 0) > 30 or feature == "bmi"):
                    categories["Lifestyle"].append("Refer to medical weight management or nutritional specialist.")
                    categories["Monitoring"].append("Monitor for sleep apnea and metabolic syndrome markers.")
        
        # General recommendations
        if not any(categories.values()):
            categories["Follow-up"].append("Standard discharge follow-up call within 72 hours.")
        
        # Add baseline recommendations for all high-risk patients
        risk_score = patient_data.get("risk_score", 0)
        if risk_score > 60:
            categories["Follow-up"].append("Priority scheduling for follow-up visit within 3 days.")
            categories["Monitoring"].append("Remote patient monitoring (RPM) enrollment recommended.")

        # Flatten and format with categories
        final_recommendations = []
        for category, items in categories.items():
            for item in items:
                final_recommendations.append({
                    "category": category,
                    "recommendation": item
                })
            
        return final_recommendations[:8] # Limit to top 8 unique recommendations
