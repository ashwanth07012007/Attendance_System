import axios from "axios";

const api = axios.create({
    baseURL: "https://attendance-system-sfz5.onrender.com",
    withCredentials: true
});

export default api;