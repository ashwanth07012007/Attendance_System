import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SideBar.css';

const SideBar = ({ isAdmin }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button className="menu-btn" onClick={() => setIsOpen(!isOpen)}>☰</button>

            {isOpen && (
                <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
            )}

            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2>Menu</h2>
                    <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
                </div>

                <div className="sidebar-menu">
                    <Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>

                    {!isAdmin && (
                        <Link to="/my-attendance" onClick={() => setIsOpen(false)}>My Attendance</Link>
                    )}

                    {isAdmin && (
                        <div className="students-section">
                            <p>Students</p>
                            <Link to="/rfid" onClick={() => setIsOpen(false)}>Register</Link>
                            <Link to="/students/update" onClick={() => setIsOpen(false)}>Update</Link>
                            <Link to="/students/delete" onClick={() => setIsOpen(false)}>Delete</Link>
                        </div>
                    )}

                    {isAdmin && (
                        <Link to="/presented" onClick={() => setIsOpen(false)}>Present List</Link>
                    )}

                    {isAdmin && (
                        <Link to="/reports" onClick={() => setIsOpen(false)}>Reports</Link>
                    )}
                </div>
            </div>
        </>
    );
};

export default SideBar;
