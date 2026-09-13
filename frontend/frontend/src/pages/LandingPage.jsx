import React from "react";
import "./LandingPage.css";

const LandingPage = () => {

    const handleGoogleLogin = () => {
        window.location.href = "https://attendance-system-sfz5.onrender.com/oauth2/authorization/google";
    };

    return (
        <div className="landing-page">

            <div className="landing-content">

                <h1>Smart Attendance System</h1>

                <p>
                    A smart and efficient attendance management system
                    using RFID technology. Easily track attendance,
                    monitor arrival status, and manage registered users
                    securely.
                </p>

                <button
                    className="google-btn"
                    onClick={handleGoogleLogin}
                >
                    <span>G</span>
                    Sign up with Google / Login
                </button>

            </div>

        </div>
    );
};

export default LandingPage;