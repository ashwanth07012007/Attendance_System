import React, { useState } from "react";
import api from "../api/baseUrl";
import "./RegisterRfid.css";

const EMPTY = { rfid: "", name: "", email: "", studentId: "", department: "", year: "", section: "" };

const RegisterRfid = () => {
    const [inputs, setInputs] = useState(EMPTY);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    const register = async () => {
        if (!inputs.rfid.trim() || !inputs.name.trim()) {
            alert("RFID and Name are required.");
            return;
        }
        setLoading(true);
        try {
            const payload = { ...inputs, year: inputs.year ? parseInt(inputs.year) : null };
            await api.post("/api/rfid/registerRfid", payload, { withCredentials: true });
            alert("Student registered successfully 🎉");
            setInputs(EMPTY);
        } catch (error) {
            if (error.response?.status === 409) {
                alert("RFID already registered.");
            } else if (error.response?.status === 403) {
                alert("You are not authorized to register students.");
            } else {
                alert("Registration failed: " + (error.response?.data || error.message));
                console.error("Registration error:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-card">
            <h2 className="register-title">Enroll Student</h2>

            <div className="register-grid">
                <div className="register-field">
                    <label>RFID Tag <span className="required">*</span></label>
                    <input
                        type="text"
                        name="rfid"
                        value={inputs.rfid}
                        onChange={handleChange}
                        placeholder="Scan or enter RFID"
                    />
                </div>

                <div className="register-field">
                    <label>Full Name <span className="required">*</span></label>
                    <input
                        type="text"
                        name="name"
                        value={inputs.name}
                        onChange={handleChange}
                        placeholder="Student full name"
                    />
                </div>

                <div className="register-field">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={inputs.email}
                        onChange={handleChange}
                        placeholder="student@example.com"
                    />
                </div>

                <div className="register-field">
                    <label>Student ID</label>
                    <input
                        type="text"
                        name="studentId"
                        value={inputs.studentId}
                        onChange={handleChange}
                        placeholder="e.g. STU2024001"
                    />
                </div>

                <div className="register-field">
                    <label>Department</label>
                    <input
                        type="text"
                        name="department"
                        value={inputs.department}
                        onChange={handleChange}
                        placeholder="e.g. Computer Science"
                    />
                </div>

                <div className="register-field">
                    <label>Year</label>
                    <select name="year" value={inputs.year} onChange={handleChange}>
                        <option value="">Select year</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                    </select>
                </div>

                <div className="register-field">
                    <label>Section</label>
                    <input
                        type="text"
                        name="section"
                        value={inputs.section}
                        onChange={handleChange}
                        placeholder="e.g. A"
                    />
                </div>
            </div>

            <button className="register-btn" onClick={register} disabled={loading}>
                {loading ? "Registering..." : "Register Student"}
            </button>
        </div>
    );
};

export default RegisterRfid;
