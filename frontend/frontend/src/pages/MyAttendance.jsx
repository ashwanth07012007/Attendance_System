import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/baseUrl";
import "./MyAttendance.css";

const MyAttendance = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const navigate = useNavigate();

    const load = useCallback((fromDate, toDate) => {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        if (fromDate) params.append("from", fromDate);
        if (toDate)   params.append("to",   toDate);
        const query = params.toString() ? `?${params}` : "";
        api.get(`/api/attendance/my${query}`, { withCredentials: true })
            .then(res => { setData(res.data); setLoading(false); })
            .catch(() => { setError("Failed to load attendance."); setLoading(false); });
    }, []);

    useEffect(() => { load("", ""); }, [load]);

    const handleFilter = (e) => {
        e.preventDefault();
        load(from, to);
    };

    const handleExport = () => {
        const params = new URLSearchParams();
        if (from) params.append("from", from);
        if (to)   params.append("to",   to);
        const query = params.toString() ? `?${params}` : "";
        window.open(`http://localhost:8080/api/rfid/export/csv${query}`, "_blank");
    };

    if (loading) return <div className="ma-center">Loading...</div>;
    if (error)   return <div className="ma-center ma-error">{error}</div>;

    const pct = data.percentage;

    return (
        <div className="ma-page">
            <div className="ma-header">
                <button className="ma-back-btn" onClick={() => navigate("/dashboard")}>← Back</button>
                <h2>My Attendance</h2>
            </div>

            <div className="ma-stats">
                <div className="ma-card">
                    <span className="ma-card-value">{data.totalClasses}</span>
                    <span className="ma-card-label">Total Classes</span>
                </div>
                <div className="ma-card ma-card-present">
                    <span className="ma-card-value">{data.present}</span>
                    <span className="ma-card-label">Present</span>
                </div>
                <div className="ma-card ma-card-absent">
                    <span className="ma-card-value">{data.absent}</span>
                    <span className="ma-card-label">Absent</span>
                </div>
                <div className="ma-card ma-card-pct">
                    <span className="ma-card-value">{pct}%</span>
                    <span className="ma-card-label">Attendance</span>
                </div>
            </div>

            <div className="ma-progress-section">
                <div className="ma-progress-label">
                    <span>Attendance Rate</span>
                    <span>{pct}%</span>
                </div>
                <div className="ma-progress-bar-bg">
                    <div
                        className={`ma-progress-bar-fill ${pct >= 75 ? "good" : pct >= 50 ? "warn" : "bad"}`}
                        style={{ width: `${pct}%` }}
                    />
                </div>
                <p className="ma-progress-hint">
                    {pct >= 75 ? "✅ Good standing" : pct >= 50 ? "⚠️ Below recommended" : "❌ Critical — attendance too low"}
                </p>
            </div>

            <div className="ma-history">
                <div className="ma-history-header">
                    <h3>Attendance History</h3>
                    <div className="ma-actions">
                        <form className="ma-filter" onSubmit={handleFilter}>
                            <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
                            <span>to</span>
                            <input type="date" value={to} onChange={e => setTo(e.target.value)} />
                            <button type="submit" className="ma-filter-btn">Filter</button>
                            <button type="button" className="ma-filter-btn ma-clear-btn"
                                onClick={() => { setFrom(""); setTo(""); load("", ""); }}>
                                Clear
                            </button>
                        </form>
                        <button className="ma-export-btn" onClick={handleExport}>
                            ⬇ Export CSV
                        </button>
                    </div>
                </div>

                {data.history.length === 0 ? (
                    <p className="ma-empty">No attendance records for this period.</p>
                ) : (
                    <table className="ma-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.history.map((r, i) => (
                                <tr key={i}>
                                    <td>{r.date}</td>
                                    <td>{r.time}</td>
                                    <td>
                                        <span className={`ma-badge ma-badge-${r.status.toLowerCase()}`}>
                                            {r.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default MyAttendance;
