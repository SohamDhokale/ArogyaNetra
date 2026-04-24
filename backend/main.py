from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import setup_django
from backend.routes.patient import router as patient_router
from backend.routes.prediction import router as prediction_router
from backend.routes.reports import router as reports_router

# Initialize Django
setup_django()

app = FastAPI(title="ArogyaNetra Healthcare Engine", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(patient_router)
app.include_router(prediction_router)
app.include_router(reports_router)

@app.get("/")
def root():
    return {
        "status": "online",
        "message": "Welcome to ArogyaNetra Predictive Analysis Engine",
        "docs": "/docs",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
