import React from 'react'
import api from '../api/baseUrl';

const Presented = ({onAttendanceAdded}) => {

    const getPresentList = async () => {
        try {
            const res = await api.get(
                "/api/rfid/allPresent",
                {
                    withCredentials: true
                }
            );
            onAttendanceAdded();

        } catch (error) {
            console.error(
                "Failed to get attendance:",
                error
            );
        }
    };

    useEffect(() => {
            getPresentList();
        }, []);
  return (
    <div>
      
    </div>
  )
}

export default Presented
