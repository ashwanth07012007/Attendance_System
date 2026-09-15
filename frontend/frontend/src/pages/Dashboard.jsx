import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PresentList from "../Components/PresentList";
import AttendanceChart from "../Components/AttendanceChart";
import axios from "axios";
import "./Dashboard.css";
import api from "../api/baseUrl";
import SideBar from "../Components/SideBar";
import ScanToast from "../Components/ScanToast";

const Dashboard = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [totalStudents, setTotalStudents] = useState(0);
    const [presentCount, setPresentCount] = useState(0);
    const [lateCount, setLateCount] = useState(0);
    const [profile, setProfile] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        checkUserRole();
        loadDashboardData();
        loadProfile();
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const checkUserRole = async () => {
        try {
            const res = await api.get("/api/auth/me", { withCredentials: true });
            setIsAdmin(res.data.includes("ROLE_ADMIN"));
        } catch (e) {
            console.error("Failed to get user role:", e);
        }
    };

    const loadProfile = async () => {
        try {
            const res = await api.get("/api/auth/profile", { withCredentials: true });
            setProfile(res.data);
        } catch (e) {
            console.error("Failed to load profile:", e);
        }
    };

    const loadDashboardData = async () => {
        try {
            const [rfidRes, presentRes] = await Promise.all([
                api.get("/api/rfid/all", { withCredentials: true }),
                api.get("/api/rfid/allPresent", { withCredentials: true }),
            ]);
            setTotalStudents(rfidRes.data.length);
            setPresentCount(presentRes.data.length);
            setLateCount(presentRes.data.filter(i => i.arrival === "Late").length);
        } catch (e) {
            console.error("Dashboard data error:", e);
        }
    };

    const handleLogout = async () => {
            try {
                await api.post("/logout");
                navigate("/", { replace: true });
            } catch (e) {
                console.error("Logout failed:", e);
            }
      };

    const handleCardClick = (type) => {
        if (!isAdmin) return;
        navigate(`/dashboard/${type}`);
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div className="header-left">
                    <div className="header-spacer" />
                    <h3>Smart Attendance System</h3>
                </div>
                <div className="header-right">
                    {profile ? (
                        <div className="profile-dropdown" ref={dropdownRef}>
                            <button className="profile-btn" onClick={() => setDropdownOpen(o => !o)}>
                                {profile.picture
                                    ? <img src={profile.picture} alt="avatar" className="profile-avatar" />
                                    : <div className="profile-avatar-placeholder">{profile.name?.charAt(0).toUpperCase()}</div>
                                }
                                <span className="profile-name">{profile.name}</span>
                                <span className="profile-chevron">{dropdownOpen ? "▲" : "▼"}</span>
                            </button>
                            {dropdownOpen && (
                                <div className="profile-menu">
                                    <div className="profile-menu-info">
                                        <strong>{profile.name}</strong>
                                        <small>{profile.email}</small>
                                    </div>
                                    <hr className="profile-divider" />
                                    {!isAdmin && (
                                        <button className="profile-menu-item"
                                            onClick={() => { setDropdownOpen(false); navigate("/my-attendance"); }}>
                                            📊 My Attendance
                                        </button>
                                    )}
                                    <button className="profile-menu-item profile-menu-logout" onClick={handleLogout}>
                                        🚪 Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button className="logout-btn" onClick={handleLogout}>Logout</button>
                    )}
                </div>
            </div>

            <section className="section2">
                <div className={isAdmin ? "stat-card clickable" : "stat-card"}
                    onClick={() => handleCardClick("students")}>
                    <h3>Total Students</h3>
                    <p>{totalStudents}</p>
                    <small>Registered RFID students</small>
                </div>
                <div className={isAdmin ? "stat-card clickable" : "stat-card"}
                    onClick={() => handleCardClick("present")}>
                    <h3>Present Today</h3>
                    <p>{presentCount}</p>
                    <small>Students present today</small>
                </div>
                <div className={isAdmin ? "stat-card clickable" : "stat-card"}
                    onClick={() => handleCardClick("late")}>
                    <h3>Late Today</h3>
                    <p>{lateCount}</p>
                    <small>Late arrivals today</small>
                </div>
            </section>

            {isAdmin && <AttendanceChart />}

            <section className="attendance-section">
                <PresentList onAttendanceAdded={loadDashboardData} />
            </section>

            <SideBar isAdmin={isAdmin} />
            <ScanToast />
        </div>
    );
};

export default Dashboard;
