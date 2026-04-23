from django.db import models

class User(models.Model):
    """Custom user model for healthcare system roles"""
    ROLE_CHOICES = [
        ('Doctor', 'Doctor'),
        ('Admin', 'Admin'),
        ('Analyst', 'Analyst'),
        ('Superuser', 'Superuser'),
    ]
    
    email = models.EmailField(unique=True, db_index=True)
    hashed_password = models.CharField(max_length=256)
    full_name = models.CharField(max_length=255, blank=True, null=True)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='Doctor')
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.email


class Patient(models.Model):
    """Patient medical record model"""
    DISCHARGE_CHOICES = [
        ('Home', 'Home'),
        ('Home Health Services', 'Home Health Services'),
        ('AMA', 'Left Against Medical Advice'),
        ('Transferred', 'Transferred to another facility'),
    ]
    
    patient_id = models.CharField(max_length=50, unique=True, db_index=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True, help_text="WhatsApp number with country code")
    location = models.CharField(max_length=255, blank=True, null=True)
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    
    # Clinical data
    glucose = models.FloatField(blank=True, null=True)
    blood_pressure = models.FloatField(blank=True, null=True)
    bmi = models.FloatField(blank=True, null=True)
    chronic_illnesses = models.IntegerField(default=0)
    previous_admissions = models.IntegerField(default=0)
    length_of_stay = models.IntegerField(default=0, help_text="in days")
    discharge_disposition = models.CharField(max_length=50, choices=DISCHARGE_CHOICES, blank=True, null=True)
    
    # Prediction data
    risk_score = models.FloatField(blank=True, null=True, help_text="Percentage")
    is_high_risk = models.BooleanField(default=False)
    
    # Additional data (stored as JSON)
    shap_values = models.JSONField(blank=True, null=True, help_text="SHAP values for explainability")
    recommendations = models.JSONField(blank=True, null=True, help_text="Clinical advice")
    
    # Tracking
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'patients'
        verbose_name = 'Patient'
        verbose_name_plural = 'Patients'
        indexes = [
            models.Index(fields=['patient_id']),
            models.Index(fields=['is_high_risk']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.patient_id} - {self.name}"


class PatientRecord(models.Model):
    """Diabetes prediction record"""
    pregnancies = models.FloatField()
    glucose = models.FloatField()
    blood_pressure = models.FloatField()
    skin_thickness = models.FloatField()
    insulin = models.FloatField()
    bmi = models.FloatField()
    dpf = models.FloatField()  # Diabetes Pedigree Function
    age = models.FloatField()

    prediction = models.IntegerField(choices=[(0, 'No Diabetes'), (1, 'Diabetes')])
    probability = models.FloatField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'patient_records'
        verbose_name = 'Patient Record'
        verbose_name_plural = 'Patient Records'
        indexes = [
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"Record {self.id} - Age {self.age}"


class Prediction(models.Model):
    """Model prediction record with audit trail"""
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='predictions')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_predictions')
    
    prediction_result = models.IntegerField(choices=[(0, 'No Diabetes'), (1, 'Diabetes')])
    confidence_score = models.FloatField()
    shap_explanation = models.JSONField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'predictions'
        verbose_name = 'Prediction'
        verbose_name_plural = 'Predictions'
        indexes = [
            models.Index(fields=['patient', 'created_at']),
            models.Index(fields=['created_by']),
        ]

    def __str__(self):
        return f"Prediction {self.id} - Patient {self.patient.patient_id}"