from django.shortcuts import render
from .ml_models.model_loader import model
from .models import PatientRecord
import numpy as np

def dashboard(request):
    if request.method == "POST":
        try:
            pregnancies = float(request.POST.get('pregnancies'))
            glucose = float(request.POST.get('glucose'))
            blood_pressure = float(request.POST.get('blood_pressure'))
            skin_thickness = float(request.POST.get('skin_thickness'))
            insulin = float(request.POST.get('insulin'))
            bmi = float(request.POST.get('bmi'))
            dpf = float(request.POST.get('dpf'))
            age = float(request.POST.get('age'))

            features = [
                pregnancies, glucose, blood_pressure, skin_thickness,
                insulin, bmi, dpf, age
            ]

            input_data = np.array(features).reshape(1, -1)

            prediction = model.predict(input_data)[0]
            probability = model.predict_proba(input_data)[0][1]

            PatientRecord.objects.create(
                pregnancies=pregnancies,
                glucose=glucose,
                blood_pressure=blood_pressure,
                skin_thickness=skin_thickness,
                insulin=insulin,
                bmi=bmi,
                dpf=dpf,
                age=age,
                prediction=prediction,
                probability=probability
            )

            result = "High Risk" if prediction == 1 else "Low Risk"

            return render(request, "dashboard.html", {
                "result": result,
                "probability": round(probability * 100, 2)
            })

        except:
            return render(request, "dashboard.html", {"error": "Invalid input"})

    return render(request, "dashboard.html")