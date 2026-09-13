import React, { useEffect, useRef, useState } from "react";
import api from "../api/baseUrl";
import "./ScanToast.css";

const STATUS_LABELS = {
    PRESENT: { label: "PRESENT", cls: "toast-present" },
    LATE:    { label: "LATE",    cls: "toast-late" },
    DUPLICATE: { label: "DUPLICATE", cls: "toast-duplicate" },
    UNKNOWN:   { label: "UNKNOWN",   cls: "toast-unknown" },
};

const ScanToast = () => {
    const [toasts, setToasts] = useState([]);
    const lastTs = useRef(0);

    useEffect(() => {
        const poll = async () => {
            try {
                const res = await api.get(
                    `/api/rfid/lastScan?since=${lastTs.current}`,
                    { withCredentials: true }
                );
                if (res.status === 200 && res.data) {
                    const notif = res.data;
                    // Update our timestamp from the server
                    const tsRes = await api.get("/api/rfid/lastScanTimestamp", { withCredentials: true });
                    lastTs.current = tsRes.data;

                    const id = Date.now();
                    setToasts(prev => [...prev, { ...notif, id }]);
                    setTimeout(() => {
                        setToasts(prev => prev.filter(t => t.id !== id));
                    }, 5000);
                }
            } catch {
                // silent
            }
        };

        const interval = setInterval(poll, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="toast-container">
            {toasts.map(t => {
                const meta = STATUS_LABELS[t.status] || STATUS_LABELS.UNKNOWN;
                return (
                    <div key={t.id} className={`toast-item ${meta.cls}`}>
                        <div className="toast-top">
                            <span className="toast-name">{t.name}</span>
                            <span className="toast-badge">{meta.label}</span>
                        </div>
                        <div className="toast-bottom">
                            <span className="toast-time">🕐 {t.time}</span>
                            <span className="toast-msg">{t.message}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ScanToast;
