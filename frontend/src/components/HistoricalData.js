import React, { useEffect, useState } from 'react';

const HistoricalData = ({ updateData }) => {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        const token = localStorage.getItem('token'); // Fetch the token from local storage
        if (!token) {
            console.error('No auth token found');
            return;
        }
        const response = await fetch('http://localhost:5000/api/users/historicalData', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const result = await response.json();
        if (Array.isArray(result)) {
            setData(result);
        } else {
            console.error('Fetched data is not an array:', result);
        }
    };

    useEffect(() => {
        fetchData();
    }, [updateData]); // Re-fetch data when updateData changes

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="historical-data">
            <h2 className="text-xl font-bold mb-4">Historical Mood and Productivity Data</h2>
            <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2">Date</th>
                        <th className="border border-gray-300 p-2">Mood</th>
                        <th className="border border-gray-300 p-2">Reason</th>
                        <th className="border border-gray-300 p-2">Productivity</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((entry, index) => (
                        <tr key={index}>
                            <td className="border border-gray-300 p-2">{formatDate(entry.date)}</td>
                            <td className="border border-gray-300 p-2">{entry.mood}</td>
                            <td className="border border-gray-300 p-2">{entry.reason}</td>
                            <td className="border border-gray-300 p-2">{entry.productivity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HistoricalData;