from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    email: str
    full_name: str
    role: Optional[str] = "Doctor"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    is_superuser: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class PatientBase(BaseModel):
    patient_id: str
    name: Optional[str] = "Unknown"
    phone_number: Optional[str] = None
    location: Optional[str] = "Unknown"
    age: int
    gender: str
    glucose: Optional[float] = None
    blood_pressure: Optional[float] = None
    bmi: Optional[float] = None
    chronic_illnesses: Optional[int] = 0
    previous_admissions: Optional[int] = 0
    length_of_stay: Optional[int] = 0
    discharge_disposition: Optional[str] = "Home"

class PatientCreate(PatientBase):
    pass

class PatientUpdate(BaseModel):
    name: Optional[str] = None
    phone_number: Optional[str] = None
    location: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    glucose: Optional[float] = None
    blood_pressure: Optional[float] = None
    bmi: Optional[float] = None
    chronic_illnesses: Optional[int] = None
    previous_admissions: Optional[int] = None
    length_of_stay: Optional[int] = None
    discharge_disposition: Optional[str] = None

class PatientResponse(PatientBase):
    id: int
    risk_score: Optional[float] = None
    is_high_risk: Optional[bool] = False
    shap_values: Optional[Dict[str, float]] = None
    recommendations: Optional[List[Any]] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)

class PredictionResponse(BaseModel):
    patient_id: str
    risk_score: float
    risk_label: str
    key_factors: List[Dict[str, Any]] # Top 5 SHAP values
    all_factors: List[Dict[str, Any]] # All SHAP explanations with details
    clinical_advice: List[Any]
