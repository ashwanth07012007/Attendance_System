import pandas as pd
import joblib

from sklearn.ensemble import RandomForestClassifier

from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    classification_report
)


# ============================================================
# 1. LOAD DATASET
# ============================================================

df = pd.read_csv("attendance.csv")

print("========================================")
print("DATASET INFORMATION")
print("========================================")

print("\nFirst 5 records:")
print(df.head())

print("\nDataset information:")
print(df.info())

print("\nAttendance counts:")
print(df["arrival"].value_counts())


# ============================================================
# 2. CONVERT TIME INTO MINUTES
# ============================================================

df["time"] = pd.to_datetime(
    df["time"],
    format="%H:%M:%S"
)

df["arrival_minutes"] = (
    df["time"].dt.hour * 60
    + df["time"].dt.minute
    + df["time"].dt.second / 60
)


print("\n========================================")
print("TIME CONVERSION")
print("========================================")

print(
    df[
        [
            "name",
            "time",
            "arrival_minutes",
            "arrival"
        ]
    ].head()
)


# ============================================================
# 3. CONVERT ARRIVAL INTO NUMERIC VALUE
# ============================================================

# Present = 0
# Late    = 1

df["late"] = (
    df["arrival"] == "Late"
).astype(int)


print("\n========================================")
print("ARRIVAL CONVERSION")
print("========================================")

print(df["late"].value_counts())

print("\n0 = Present")
print("1 = Late")


# ============================================================
# 4. CONVERT DATE
# ============================================================

df["date"] = pd.to_datetime(
    df["date"]
)


# ============================================================
# 5. SORT DATA
# ============================================================

df = df.sort_values(
    ["name", "date"]
).reset_index(drop=True)


# ============================================================
# 6. CREATE PREVIOUS ATTENDANCE FEATURES
# ============================================================

# Number of previous attendance records
df["previous_days"] = (
    df.groupby("name")
    .cumcount()
)


# Number of previous late days
df["previous_late_count"] = (
    df.groupby("name")["late"]
    .cumsum()
    - df["late"]
)


# ============================================================
# 7. PREVIOUS LATE PERCENTAGE
# ============================================================

df["previous_late_percentage"] = (
    df["previous_late_count"]
    /
    df["previous_days"].replace(0, 1)
) * 100


# ============================================================
# 8. PREVIOUS PRESENT COUNT
# ============================================================

df["previous_present_count"] = (
    df["previous_days"]
    - df["previous_late_count"]
)


# ============================================================
# 9. PREVIOUS ATTENDANCE PERCENTAGE
# ============================================================

df["previous_attendance_percentage"] = (
    df["previous_present_count"]
    /
    df["previous_days"].replace(0, 1)
) * 100


# ============================================================
# 10. RISK CATEGORY
# ============================================================

def calculate_risk(attendance):

    if attendance >= 85:
        return "LOW"

    elif attendance >= 75:
        return "MEDIUM"

    else:
        return "HIGH"


df["risk"] = (
    df["previous_attendance_percentage"]
    .apply(calculate_risk)
)


# ============================================================
# 11. REMOVE FIRST RECORD
# ============================================================

# The first attendance record of each student
# has no previous attendance history.

df = df[
    df["previous_days"] > 0
].copy()


# ============================================================
# 12. DISPLAY ML DATASET
# ============================================================

print("\n========================================")
print("ML DATASET")
print("========================================")

print(
    df[
        [
            "name",
            "date",
            "previous_days",
            "previous_late_count",
            "previous_late_percentage",
            "previous_attendance_percentage",
            "risk",
            "late"
        ]
    ].head(20)
)


# ============================================================
# 13. TRAINING / TESTING SPLIT
# ============================================================

# First 20 days -> Training
# Last 10 days  -> Testing

training_data = df[
    df["date"] <= "2026-08-20"
].copy()


testing_data = df[
    df["date"] > "2026-08-20"
].copy()


print("\n========================================")
print("TRAINING / TESTING DATA")
print("========================================")

print(
    "\nTraining records:",
    len(training_data)
)

print(
    "Testing records:",
    len(testing_data)
)


# ============================================================
# 14. SELECT ML FEATURES
# ============================================================

features = [
    "previous_days",
    "previous_late_count",
    "previous_late_percentage"
]


print("\n========================================")
print("ML FEATURES")
print("========================================")

for feature in features:
    print("-", feature)


# ============================================================
# 15. CREATE X AND Y
# ============================================================

X_train = training_data[
    features
]

y_train = training_data[
    "late"
]


X_test = testing_data[
    features
]

y_test = testing_data[
    "late"
]


# ============================================================
# 16. CREATE RANDOM FOREST MODEL
# ============================================================

model = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
    class_weight="balanced"
)


# ============================================================
# 17. TRAIN RANDOM FOREST
# ============================================================

print("\n========================================")
print("RANDOM FOREST TRAINING")
print("========================================")

model.fit(
    X_train,
    y_train
)

print(
    "Random Forest trained successfully!"
)


# ============================================================
# 18. MAKE PREDICTIONS
# ============================================================

predictions = model.predict(
    X_test
)


# ============================================================
# 19. PREDICTION PROBABILITY
# ============================================================

probabilities = model.predict_proba(
    X_test
)


# Probability of Late

late_probability = probabilities[:, 1]


# ============================================================
# 20. CONVERT PREDICTION INTO TEXT
# ============================================================

predicted_status = []

for prediction in predictions:

    if prediction == 1:
        predicted_status.append("Late")

    else:
        predicted_status.append("Present")


# ============================================================
# 21. ACTUAL STATUS
# ============================================================

actual_status = []

for value in y_test:

    if value == 1:
        actual_status.append("Late")

    else:
        actual_status.append("Present")


# ============================================================
# 22. CREATE PREDICTION DATAFRAME
# ============================================================

prediction_results = testing_data[
    [
        "name",
        "date",
        "previous_days",
        "previous_late_count",
        "previous_late_percentage",
        "previous_attendance_percentage",
        "risk"
    ]
].copy()


prediction_results["actual"] = actual_status

prediction_results["predicted"] = predicted_status

prediction_results["late_probability"] = (
    late_probability * 100
)


# ============================================================
# 23. DISPLAY PREDICTIONS
# ============================================================

print("\n========================================")
print("PREDICTIONS")
print("========================================")

print(
    prediction_results.head(20)
)


# ============================================================
# 24. ACCURACY
# ============================================================

accuracy = accuracy_score(
    y_test,
    predictions
)


print("\n========================================")
print("MODEL ACCURACY")
print("========================================")

print(
    "Accuracy:",
    accuracy
)

print(
    "Accuracy percentage:",
    round(accuracy * 100, 2),
    "%"
)


# ============================================================
# 25. CONFUSION MATRIX
# ============================================================

cm = confusion_matrix(
    y_test,
    predictions
)


print("\n========================================")
print("CONFUSION MATRIX")
print("========================================")

print(cm)


# ============================================================
# 26. CLASSIFICATION REPORT
# ============================================================

print("\n========================================")
print("CLASSIFICATION REPORT")
print("========================================")

print(
    classification_report(
        y_test,
        predictions,
        target_names=[
            "Present",
            "Late"
        ],
        zero_division=0
    )
)


# ============================================================
# 27. FEATURE IMPORTANCE
# ============================================================

print("\n========================================")
print("FEATURE IMPORTANCE")
print("========================================")

feature_importance = pd.DataFrame({

    "feature": features,

    "importance": model.feature_importances_

})

feature_importance = (
    feature_importance
    .sort_values(
        "importance",
        ascending=False
    )
)


print(feature_importance)


# ============================================================
# 28. SAVE TEST PREDICTIONS
# ============================================================

prediction_results.to_csv(
    "test_predictions.csv",
    index=False
)


print("\n========================================")
print("TEST PREDICTIONS SAVED")
print("========================================")

print(
    "File: test_predictions.csv"
)


# ============================================================
# 29. SAVE RANDOM FOREST MODEL
# ============================================================

model_data = {

    "model": model,

    "features": features

}


joblib.dump(
    model_data,
    "attendance_model.pkl"
)


print("\n========================================")
print("MODEL SAVED")
print("========================================")

print(
    "File: attendance_model.pkl"
)


# ============================================================
# 30. FINAL INFORMATION
# ============================================================

print("\n========================================")
print("ML TRAINING COMPLETED")
print("========================================")

print(
    "\nFiles created:"
)

print(
    "1. attendance_model.pkl"
)

print(
    "2. test_predictions.csv"
)

print(
    "\nRandom Forest is ready for API integration."
)

print(
    "Next step: Connect the model to your dashboard."
)