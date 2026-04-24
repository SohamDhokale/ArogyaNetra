"""
Script to add 25 sample Indian patients with varying risk levels
"""
import os
import django
import random
from datetime import datetime

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'diabetes_app.settings')
django.setup()

from predictor.models import Patient

# Common Indian names
MALE_NAMES = [
    "Rajesh Kumar", "Amit Sharma", "Suresh Patel", "Vijay Singh", "Anil Gupta",
    "Ramesh Reddy", "Manoj Verma", "Sanjay Rao", "Prakash Joshi", "Deepak Mehta",
    "Ravi Nair", "Kiran Desai", "Ashok Iyer", "Mohan Pillai", "Dinesh Kapoor"
]

FEMALE_NAMES = [
    "Priya Sharma", "Sunita Patel", "Kavita Singh", "Anjali Gupta", "Meera Reddy",
    "Pooja Verma", "Neha Rao", "Rekha Joshi", "Shalini Mehta", "Divya Kumar",
    "Lakshmi Nair", "Radha Desai", "Geeta Iyer", "Savita Pillai", "Usha Kapoor"
]

INDIAN_CITIES = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
    "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
    "Surat", "Kanpur", "Nagpur", "Indore", "Bhopal"
]

_patient_id_counter = 0

def generate_patient_id():
    """Generate unique patient ID"""
    global _patient_id_counter
    _patient_id_counter += 1
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    return f"PT{timestamp}{_patient_id_counter:04d}"

def create_high_risk_patient(index):
    """Create a high-risk patient (>60% risk)"""
    gender = random.choice(["Male", "Female"])
    name = random.choice(MALE_NAMES if gender == "Male" else FEMALE_NAMES)
    
    return Patient(
        patient_id=generate_patient_id(),
        name=name,
        location=random.choice(INDIAN_CITIES),
        age=random.randint(55, 75),  # Older age
        gender=gender,
        glucose=random.randint(160, 220),  # High glucose
        blood_pressure=random.randint(130, 160),  # High BP
        bmi=random.uniform(28.5, 38.0),  # High BMI
        chronic_illnesses=random.randint(3, 5),  # Multiple conditions
        previous_admissions=random.randint(3, 8),  # Frequent admissions
        length_of_stay=random.randint(8, 18),  # Long stays
        discharge_disposition=random.choice(['Home Health Services', 'Transferred']),
        risk_score=random.uniform(65.0, 95.0),
        is_high_risk=True
    )

def create_moderate_risk_patient(index):
    """Create a moderate-risk patient (30-60% risk)"""
    gender = random.choice(["Male", "Female"])
    name = random.choice(MALE_NAMES if gender == "Male" else FEMALE_NAMES)
    
    return Patient(
        patient_id=generate_patient_id(),
        name=name,
        location=random.choice(INDIAN_CITIES),
        age=random.randint(40, 60),  # Middle age
        gender=gender,
        glucose=random.randint(120, 160),  # Moderate glucose
        blood_pressure=random.randint(110, 135),  # Moderate BP
        bmi=random.uniform(24.0, 29.0),  # Moderate BMI
        chronic_illnesses=random.randint(1, 3),  # Some conditions
        previous_admissions=random.randint(1, 3),  # Some admissions
        length_of_stay=random.randint(4, 8),  # Moderate stays
        discharge_disposition=random.choice(['Home', 'Home Health Services']),
        risk_score=random.uniform(35.0, 58.0),
        is_high_risk=False
    )

def create_low_risk_patient(index):
    """Create a low-risk patient (<30% risk)"""
    gender = random.choice(["Male", "Female"])
    name = random.choice(MALE_NAMES if gender == "Male" else FEMALE_NAMES)
    
    return Patient(
        patient_id=generate_patient_id(),
        name=name,
        location=random.choice(INDIAN_CITIES),
        age=random.randint(25, 45),  # Younger age
        gender=gender,
        glucose=random.randint(80, 120),  # Normal glucose
        blood_pressure=random.randint(90, 115),  # Normal BP
        bmi=random.uniform(19.0, 25.0),  # Normal BMI
        chronic_illnesses=random.randint(0, 1),  # Few/no conditions
        previous_admissions=random.randint(0, 1),  # Rare admissions
        length_of_stay=random.randint(1, 4),  # Short stays
        discharge_disposition='Home',
        risk_score=random.uniform(8.0, 28.0),
        is_high_risk=False
    )

def main():
    print("🏥 Adding 25 sample Indian patients to ArogyaNetra database...\n")
    
    patients_to_create = []
    
    # Create 10 high-risk patients
    print("Creating 10 HIGH RISK patients...")
    for i in range(10):
        patients_to_create.append(create_high_risk_patient(i))
    
    # Create 9 moderate-risk patients
    print("Creating 9 MODERATE RISK patients...")
    for i in range(9):
        patients_to_create.append(create_moderate_risk_patient(i))
    
    # Create 6 low-risk patients
    print("Creating 6 LOW RISK patients...")
    for i in range(6):
        patients_to_create.append(create_low_risk_patient(i))
    
    # Bulk create all patients
    Patient.objects.bulk_create(patients_to_create)
    
    print(f"\n✅ Successfully added {len(patients_to_create)} NEW patients!\n")
    
    # Display summary
    total_patients = Patient.objects.count()
    high_risk_count = Patient.objects.filter(is_high_risk=True).count()
    moderate_risk_count = Patient.objects.filter(
        is_high_risk=False, 
        risk_score__gte=30
    ).count()
    low_risk_count = Patient.objects.filter(
        is_high_risk=False, 
        risk_score__lt=30
    ).count()
    
    print("📊 Database Summary:")
    print(f"   Total Patients: {total_patients}")
    print(f"   🔴 High Risk (>60%): {high_risk_count}")
    print(f"   🟡 Moderate Risk (30-60%): {moderate_risk_count}")
    print(f"   🟢 Low Risk (<30%): {low_risk_count}")
    print("\n✨ Sample patients ready for testing!")

if __name__ == "__main__":
    main()
