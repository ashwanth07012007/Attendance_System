import React, { useEffect, useState } from "react";
import "./PresentList.css";
import api from "../api/baseUrl";

const PresentList = ({ onAttendanceAdded }) => {
    const [present, setPresent] = useState([]);

    const getPresentList = async () => {
        try {
            const res = await api.get("/api/rfid/allPresent", { withCredentials: true });
            setPresent(res.data);
            if (onAttendanceAdded) onAttendanceAdded();
        } catch (error) {
            console.error("Failed to get attendance:", error);
        }
    };

    useEffect(() => {
        getPresentList();
        const interval = setInterval(getPresentList, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="present-page">
            <div className="present-header">
                <h2>Today's Attendance</h2>
                <span className="live-badge">● LIVE</span>
            </div>

            {present.length === 0 ? (
                <p className="present-empty">No attendance recorded yet today.</p>
            ) : (
                <div className="present-list">
                    {present.map((p) => (
                        <div className="list" key={p.id}>
                            <p>{p.name}</p>
                            <p>{p.time}</p>
                            <span className={`arrival-badge ${p.arrival === "Late" ? "late" : "early"}`}>
                                {p.arrival}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PresentList;
