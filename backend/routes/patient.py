from fastapi import APIRouter, HTTPException, Query
from django.db.models import Q
from predictor.models import Patient
from ..schemas import PatientCreate, PatientResponse, PatientUpdate
from typing import List, Optional
from django.core.paginator import Paginator

router = APIRouter(prefix="/patients", tags=["patients"])

@router.post("/", response_model=PatientResponse)
def create_patient(patient: PatientCreate):
    # Check if patient already exists
    if Patient.objects.filter(patient_id=patient.patient_id).exists():
        raise HTTPException(status_code=400, detail=f"Patient ID {patient.patient_id} already exists")
    
    db_patient = Patient.objects.create(**patient.model_dump())
    return db_patient

@router.get("/", response_model=List[PatientResponse])
def get_patients(skip: int = 0, limit: int = 100):
    return list(Patient.objects.all()[skip:skip + limit])

@router.get("/search/advanced", response_model=List[PatientResponse])
def search_patients(
    query: Optional[str] = Query(None, description="Search query for patient ID, name, or location"),
    risk_level: Optional[str] = Query(None, description="Filter by risk level: low, moderate, high"),
    min_age: Optional[int] = Query(None, ge=0, le=150, description="Minimum age"),
    max_age: Optional[int] = Query(None, ge=0, le=150, description="Maximum age"),
    location: Optional[str] = Query(None, description="Filter by location"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Number of records to return"),
):
    """
    Advanced search endpoint with multiple filter options.
    Supports filtering by:
    - Query: patient ID, name, location (partial match, case-insensitive)
    - Risk Level: low (0-30%), moderate (30-60%), high (>60%)
    - Age Range: min and max age
    - Location: exact or partial match
    """
    db_query = Patient.objects.all()
    
    # Text search on patient_id, name, and location
    if query:
        db_query = db_query.filter(
            Q(patient_id__icontains=query) |
            Q(name__icontains=query) |
            Q(location__icontains=query)
        )
    
    # Risk level filter
    if risk_level:
        if risk_level.lower() == "high":
            db_query = db_query.filter(risk_score__gt=60)
        elif risk_level.lower() == "moderate":
            db_query = db_query.filter(risk_score__gt=30, risk_score__lte=60)
        elif risk_level.lower() == "low":
            db_query = db_query.filter(Q(risk_score__lte=30) | Q(risk_score__isnull=True))
    
    # Age range filter
    if min_age is not None:
        db_query = db_query.filter(age__gte=min_age)
    if max_age is not None:
        db_query = db_query.filter(age__lte=max_age)
    
    # Location filter
    if location:
        db_query = db_query.filter(location__icontains=location)
    
    # Apply pagination
    results = list(db_query[skip:skip + limit])
    return results

@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(patient_id: str):
    try:
        patient = Patient.objects.get(patient_id=patient_id)
    except Patient.DoesNotExist:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@router.patch("/{patient_id}", response_model=PatientResponse)
def update_patient(patient_id: str, patient_update: PatientUpdate):
    try:
        db_patient = Patient.objects.get(patient_id=patient_id)
    except Patient.DoesNotExist:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    update_data = patient_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_patient, key, value)
    
    db_patient.save()
    return db_patient

@router.delete("/{patient_id}")
def delete_patient(patient_id: str):
    try:
        db_patient = Patient.objects.get(patient_id=patient_id)
        db_patient.delete()
        return {"message": f"Patient {patient_id} deleted successfully"}
    except Patient.DoesNotExist:
        raise HTTPException(status_code=404, detail="Patient not found")
