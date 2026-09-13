import React, { useEffect, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from "recharts";
import api from "../api/baseUrl";
import "./AttendanceChart.css";

const AttendanceChart = () => {
    const [data, setData] = useState([]);
    const [days, setDays] = useState(7);

    useEffect(() => {
        api.get(`/api/rfid/chart?days=${days}`, { withCredentials: true })
            .then(res => setData(res.data.daily))
            .catch(err => console.error("Chart load error:", err));
    }, [days]);

    return (
        <div className="chart-card">
            <div className="chart-header">
                <h3>Attendance Overview</h3>
                <div className="chart-tabs">
                    {[7, 14, 30].map(d => (
                        <button
                            key={d}
                            className={`chart-tab ${days === d ? "active" : ""}`}
                            onClick={() => setDays(d)}
                        >
                            {d}d
                        </button>
                    ))}
                </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="present" fill="#48bb78" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="late"    fill="#ecc94b" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AttendanceChart;
