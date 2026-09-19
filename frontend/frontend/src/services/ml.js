import axios from "axios";

const API_URL =
    "https://attendance-system-sfz5.onrender.com";

export const predictAttendance = async (
    previous_days,
    previous_late_count,
    previous_late_percentage
) => {

    const response = await axios.post(
        `${API_URL}/api/ml/predict`,
        {
            previous_days,
            previous_late_count,
            previous_late_percentage
        },
        {
            withCredentials: true
        }
    );

    return response.data;
};