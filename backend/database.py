"""
Database configuration for FastAPI + Django ORM integration
"""
import os
import django
from django.conf import settings

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'diabetes_app.settings')

def setup_django():
    """Initialize Django if not already initialized"""
    if not settings.configured:
        django.setup()

# Initialize Django on import
setup_django()

# Now we can import Django models
from predictor.models import User, Patient, PatientRecord, Prediction

def get_db():
    """
    Dependency for FastAPI routes to use Django ORM.
    Since Django ORM doesn't use explicit sessions like SQLAlchemy,
    this is a placeholder for compatibility.
    """
    # Django ORM uses thread-local connections, so we just yield None
    # The routes will access models directly
    yield None
