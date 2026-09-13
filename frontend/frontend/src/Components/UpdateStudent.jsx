import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/baseUrl";
import "./StudentForm.css";

const EMPTY = { name: "", email: "", rfid: "", studentId: "", department: "", year: "", section: "" };

const UpdateStudent = () => {
    const [students, setStudents] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [inputs, setInputs] = useState(EMPTY);
    const [loading, setLoading] = useState(false);
    const [fetchingList, setFetchingList] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/api/rfid/all", { withCredentials: true })
            .then(res => { setStudents(res.data); setFetchingList(false); })
            .catch(() => setFetchingList(false));
    }, []);

    const handleSelect = (e) => {
        const id = e.target.value;
        setSelectedId(id);
        if (!id) { setInputs(EMPTY); return; }
        const s = students.find(s => String(s.id) === id);
        if (s) {
            setInputs({
                name:       s.name       || "",
                email:      s.email && !s.email.endsWith("@rfid.local") ? s.email : "",
                rfid:       s.rfid       || "",
                studentId:  s.studentId  || "",
                department: s.department || "",
                year:       s.year       != null ? String(s.year) : "",
                section:    s.section    || "",
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        if (!selectedId) { alert("Please select a student."); return; }
        if (!inputs.name.trim() || !inputs.rfid.trim()) {
            alert("Name and RFID are required.");
            return;
        }
        setLoading(true);
        try {
            const payload = { ...inputs, year: inputs.year ? parseInt(inputs.year) : null };
            await api.put(`/api/rfid/update/${selectedId}`, payload, { withCredentials: true });
            alert("Student updated successfully ✅");
            const listRes = await api.get("/api/rfid/all", { withCredentials: true });
            setStudents(listRes.data);
        } catch (err) {
            if (err.response?.status === 403) alert("Not authorized.");
            else if (err.response?.status === 400) alert("RFID already taken by another student.");
            else alert("Update failed: " + (err.response?.data || err.message));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sf-page">
            <div className="sf-header">
                <button className="sf-back-btn" onClick={() => navigate("/dashboard")}>← Back</button>
                <h2>Update Student</h2>
            </div>

            <div className="sf-card">
                <div className="sf-field">
                    <label>Select Student</label>
                    {fetchingList ? (
                        <p className="sf-loading">Loading students...</p>
                    ) : (
                        <select value={selectedId} onChange={handleSelect}>
                            <option value="">-- Select a student --</option>
                            {students.map(s => (
                                <option key={s.id} value={s.id}>
                                    {s.name} {s.studentId ? `(${s.studentId})` : ""}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {selectedId && (
                    <>
                        <div className="sf-grid">
                            <div className="sf-field">
                                <label>Full Name <span className="required">*</span></label>
                                <input name="name" value={inputs.name} onChange={handleChange} placeholder="Full name" />
                            </div>
                            <div className="sf-field">
                                <label>Email</label>
                                <input type="email" name="email" value={inputs.email} onChange={handleChange} placeholder="student@example.com" />
                            </div>
                            <div className="sf-field">
                                <label>RFID Tag <span className="required">*</span></label>
                                <input name="rfid" value={inputs.rfid} onChange={handleChange} placeholder="RFID" />
                            </div>
                            <div className="sf-field">
                                <label>Student ID</label>
                                <input name="studentId" value={inputs.studentId} onChange={handleChange} placeholder="e.g. STU2024001" />
                            </div>
                            <div className="sf-field">
                                <label>Department</label>
                                <input name="department" value={inputs.department} onChange={handleChange} placeholder="e.g. Computer Science" />
                            </div>
                            <div className="sf-field">
                                <label>Year</label>
                                <select name="year" value={inputs.year} onChange={handleChange}>
                                    <option value="">Select year</option>
                                    <option value="1">1st Year</option>
                                    <option value="2">2nd Year</option>
                                    <option value="3">3rd Year</option>
                                    <option value="4">4th Year</option>
                                </select>
                            </div>
                            <div className="sf-field">
                                <label>Section</label>
                                <input name="section" value={inputs.section} onChange={handleChange} placeholder="e.g. A" />
                            </div>
                        </div>

                        <button className="sf-btn sf-btn-update" onClick={handleUpdate} disabled={loading}>
                            {loading ? "Updating..." : "Update Student"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default UpdateStudent;
