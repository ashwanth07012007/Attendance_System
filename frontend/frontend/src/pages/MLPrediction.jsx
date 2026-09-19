import { useState } from "react";
import { predictAttendance } from "../services/ml";

function MLPrediction() {

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handlePrediction = async () => {

        setLoading(true);
        setError("");

        try {

            const data = await predictAttendance(
                20,
                8,
                40
            );

            setResult(data);

        } catch (error) {

            console.error(error);

            setError(
                "Prediction failed. Please login first."
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <div>

            <h1>Attendance Prediction</h1>

            <button
                onClick={handlePrediction}
                disabled={loading}
            >
                {loading
                    ? "Predicting..."
                    : "Predict Attendance"}
            </button>

            {error && (
                <p>{error}</p>
            )}

            {result && (
                <div>

                    <h2>Prediction Result</h2>

                    <p>
                        Prediction:
                        {" "}
                        {result.prediction}
                    </p>

                    <p>
                        Late Probability:
                        {" "}
                        {result.late_probability}%
                    </p>

                    <p>
                        Previous Attendance:
                        {" "}
                        {result.previous_attendance_percentage}%
                    </p>

                    <p>
                        Risk:
                        {" "}
                        {result.risk}
                    </p>

                </div>
            )}

        </div>
    );
}

export default MLPrediction;