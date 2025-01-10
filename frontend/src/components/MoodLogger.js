import React from 'react';

const MoodLogger = ({ mood, setMood, reason, setReason }) => {
    return (
        <div className="mood-log">
            <label htmlFor="mood" className="mb-2 text-lg">Mood:</label>
            <select
                id="mood"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="border rounded p-2 mb-4"
            >
                <option value="">Select your mood</option>
                <option value="happy">Happy</option>
                <option value="sad">Sad</option>
                <option value="neutral">Neutral</option>
            </select>
            <label htmlFor="reason" className="mb-2 text-lg">Reason for your mood:</label>
            <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="border rounded p-2 mb-4"
                rows="4"
                placeholder="Describe your feelings..."
            />
        </div>
    );
};

export default MoodLogger;