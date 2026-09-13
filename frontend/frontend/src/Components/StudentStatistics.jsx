import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/baseUrl";

const StudentStatistics = () => {

    const { type } = useParams();
    const navigate = useNavigate();

    const [students, setStudents] = useState([]);
    const [title, setTitle] = useState("");

    useEffect(() => {
        loadData();
    }, [type]);

    const loadData = async () => {

        try {

            if (type === "students") {

                const response = await api.get(
                    "/api/rfid/all",
                    {
                        withCredentials: true
                    }
                );

                setStudents(response.data);
                setTitle("All Registered Students");

            } else {

                const response = await api.get(
                    "/api/rfid/allPresent",
                    {
                        withCredentials: true
                    }
                );

                let data = response.data;

                if (type === "present") {

                    data = data.filter(
                        student => student.arrival !== "Late"
                    );

                    setTitle("Present Students");

                } else if (type === "late") {

                    data = data.filter(
                        student => student.arrival === "Late"
                    );

                    setTitle("Late Students");
                }

                setStudents(data);
            }

        } catch (error) {

            console.error(
                "Failed to load statistics:",
                error
            );

        }
    };

    return (
        <div>

            <button onClick={() => navigate("/dashboard")}>
                ← Back
            </button>

            <h2>{title}</h2>

            <table>

                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>RFID</th>
                        <th>Arrival</th>
                    </tr>
                </thead>

                <tbody>

                    {students.map((student) => (

                        <tr key={student.id}>

                            <td>{student.id}</td>
                            <td>{student.name}</td>
                            <td>{student.rfid}</td>
                            <td>{student.arrival || "-"}</td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
};

export default StudentStatistics;