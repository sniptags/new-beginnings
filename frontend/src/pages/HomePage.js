import React, { useState } from 'react';
import HistoricalData from '../components/HistoricalData';
import Recommendations from '../components/Recommendations';
import Login from '../components/Login';

const HomePage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [mood, setMood] = useState('');
    const [reason, setReason] = useState('');
    const [productivity, setProductivity] = useState('');
    const [updateData, setUpdateData] = useState(false); // State to trigger data update

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogMood = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/users/logMood', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ mood, reason, productivity })
        });
        if (response.ok) {
            // Clear the form
            setMood('');
            setReason('');
            setProductivity('');
            setUpdateData(prev => !prev); // Trigger data update
        } else {
            console.error('Failed to log mood');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Mental Health and Productivity Tracker</h1>
            {isAuthenticated ? (
                <>
                    <div className="card bg-white shadow-md rounded-lg p-4 mb-4 max-w-md mx-auto">
                        <div className="flex flex-col items-center mb-4">
                            <label htmlFor="mood" className="mb-2 text-lg">Mood:</label>
                            <select
                                id="mood"
                                value={mood}
                                onChange={(e) => setMood(e.target.value)}
                                className="border rounded p-2 w-full"
                            >
                                <option value="">Select your mood</option>
                                <option value="happy">Happy</option>
                                <option value="sad">Sad</option>
                                <option value="neutral">Neutral</option>
                            </select>
                        </div>
                        <div className="flex flex-col items-center mb-4">
                            <label htmlFor="reason" className="mb-2 text-lg">Reason for your mood:</label>
                            <textarea
                                id="reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="border rounded p-2 w-full"
                                rows="4"
                                placeholder="Describe your feelings..."
                            />
                        </div>
                        <div className="flex flex-col items-center mb-4">
                            <label htmlFor="productivity" className="mb-2 text-lg">Productivity Rating (1-10):</label>
                            <input
                                type="number"
                                id="productivity"
                                value={productivity}
                                onChange={(e) => setProductivity(e.target.value)}
                                className="border rounded p-2 w-full"
                                min="1"
                                max="10"
                                placeholder="Rate your productivity (1-10)"
                            />
                        </div>
                        <div className="flex justify-center">
                            <button onClick={handleLogMood} className="bg-blue-500 text-white rounded p-2 mt-4 w-full">Log Mood</button>
                        </div>
                    </div>
                    <HistoricalData updateData={updateData} />
                    <Recommendations />
                </>
            ) : (
                <Login onLogin={handleLogin} />
            )}
        </div>
    );
};

export default HomePage;