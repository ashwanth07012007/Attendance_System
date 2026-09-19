from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd


# ============================================================
# 1. CREATE FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="Attendance ML API",
    description="Random Forest Attendance Prediction API",
    version="1.0"
)


# ============================================================
# 2. LOAD TRAINED MODEL
# ============================================================

model_data = joblib.load(
    "attendance_model.pkl"
)

model = model_data["model"]

features = model_data["features"]


print("========================================")
print("MODEL LOADED")
print("========================================")

print("Features:")

for feature in features:
    print("-", feature)


# ============================================================
# 3. REQUEST DATA MODEL
# ============================================================

class AttendanceRequest(BaseModel):

    previous_days: int

    previous_late_count: int

    previous_late_percentage: float


# ============================================================
# 4. HOME ENDPOINT
# ============================================================

@app.get("/")
def home():

    return {
        "message": "Attendance ML API is running"
    }


# ============================================================
# 5. PREDICTION ENDPOINT
# ============================================================

@app.post("/predict")
def predict(
    data: AttendanceRequest
):

    # --------------------------------------------------------
    # Create input DataFrame
    # --------------------------------------------------------

    input_data = pd.DataFrame(
        [[
            data.previous_days,
            data.previous_late_count,
            data.previous_late_percentage
        ]],
        columns=features
    )


    # --------------------------------------------------------
    # Make prediction
    # --------------------------------------------------------

    prediction = model.predict(
        input_data
    )[0]


    # --------------------------------------------------------
    # Get probability
    # --------------------------------------------------------

    probabilities = model.predict_proba(
        input_data
    )[0]


    # Find probability of Late
    late_probability = 0

    for class_value, probability in zip(
        model.classes_,
        probabilities
    ):

        if class_value == 1:

            late_probability = probability * 100


    # --------------------------------------------------------
    # Convert prediction to text
    # --------------------------------------------------------

    if prediction == 1:

        predicted_status = "Late"

    else:

        predicted_status = "Present"


    # --------------------------------------------------------
    # Calculate previous attendance
    # --------------------------------------------------------

    previous_present_count = (
        data.previous_days
        - data.previous_late_count
    )


    previous_attendance_percentage = (
        previous_present_count
        / data.previous_days
    ) * 100


    # --------------------------------------------------------
    # Calculate risk
    # --------------------------------------------------------

    if previous_attendance_percentage >= 85:

        risk = "LOW"

    elif previous_attendance_percentage >= 75:

        risk = "MEDIUM"

    else:

        risk = "HIGH"


    # --------------------------------------------------------
    # Return result
    # --------------------------------------------------------

    return {

        "prediction": predicted_status,

        "late_probability": round(
            late_probability,
            2
        ),

        "previous_attendance_percentage": round(
            previous_attendance_percentage,
            2
        ),

        "risk": risk

    }