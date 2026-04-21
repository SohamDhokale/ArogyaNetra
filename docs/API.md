# API Documentation

## Base URL
```
http://localhost:8000
```

## Endpoints

### Patients

#### POST /patients
Create a new patient record.

**Request:**
```json
{
  "patient_id": "PT001",
  "name": "John Doe",
  "age": 45,
  "glucose": 150,
  "blood_pressure": 130,
  "bmi": 28.5,
  "chronic_illnesses": 2,
  "previous_admissions": 1,
  "length_of_stay": 5,
  "gender": "Male",
  "discharge_disposition": "Home"
}
```

**Response:**
```json
{
  "id": 1,
  "patient_id": "PT001",
  "name": "John Doe",
  "created_at": "2026-04-21T10:30:00"
}
```

### Predictions

#### POST /predict/{patient_id}
Get readmission risk prediction for a patient.

**Response:**
```json
{
  "patient_id": "PT001",
  "risk_score": 72.5,
  "risk_label": "High Risk",
  "shap_values": {
    "age": 0.15,
    "glucose": 0.45,
    ...
  },
  "recommendations": [
    {
      "category": "Medication",
      "recommendation": "Increase monitoring frequency"
    }
  ]
}
```

### Reports

#### GET /reports/download/{patient_id}
Download PDF report for a patient.

**Response:** PDF file

## WhatsApp Integration

Send alerts to clinicians when high-risk patients are identified.
