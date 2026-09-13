import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/baseUrl";
import "./StudentForm.css";

const DeleteStudent = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const navigate = useNavigate();

    const loadStudents = () => {
        setLoading(true);
        api.get("/api/rfid/all", { withCredentials: true })
            .then(res => { setStudents(res.data); setLoading(false); })
            .catch(() => setLoading(false));
    };

    useEffect(() => { loadStudents(); }, []);

    const handleDelete = async (student) => {
        if (!window.confirm(`Delete "${student.name}"? This will also remove their attendance records.`)) return;
        setDeletingId(student.id);
        try {
            await api.delete(`/api/rfid/delete/${student.id}`, { withCredentials: true });
            setStudents(prev => prev.filter(s => s.id !== student.id));
        } catch (err) {
            if (err.response?.status === 403) alert("Not authorized.");
            else alert("Delete failed. Please try again.");
            console.error(err);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="sf-page">
            <div className="sf-header">
                <button className="sf-back-btn" onClick={() => navigate("/dashboard")}>← Back</button>
                <h2>Delete Student</h2>
            </div>

            <div className="sf-card">
                {loading ? (
                    <p className="sf-loading">Loading students...</p>
                ) : students.length === 0 ? (
                    <p className="sf-empty">No students registered yet.</p>
                ) : (
                    <table className="sf-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Student ID</th>
                                <th>RFID</th>
                                <th>Department</th>
                                <th>Year</th>
                                <th>Section</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(s => (
                                <tr key={s.id}>
                                    <td>{s.name}</td>
                                    <td>{s.studentId || "—"}</td>
                                    <td><code>{s.rfid}</code></td>
                                    <td>{s.department || "—"}</td>
                                    <td>{s.year ? `Year ${s.year}` : "—"}</td>
                                    <td>{s.section || "—"}</td>
                                    <td>
                                        <button
                                            className="sf-btn sf-btn-delete"
                                            onClick={() => handleDelete(s)}
                                            disabled={deletingId === s.id}
                                        >
                                            {deletingId === s.id ? "Deleting..." : "Delete"}
                                        </button>
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

export default DeleteStudent;
