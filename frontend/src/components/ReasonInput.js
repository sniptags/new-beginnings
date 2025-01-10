import React, { useState } from 'react';

const ReasonInput = ({ onReasonSubmit }) => {
    const [reason, setReason] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (reason.trim()) {
            onReasonSubmit(reason);
            setReason('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col">
            <label htmlFor="reason" className="mb-2 text-lg">Reason for your mood:</label>
            <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="border rounded p-2 mb-4"
                rows="4"
                placeholder="Describe your feelings..."
            />
            <button type="submit" className="bg-blue-500 text-white rounded p-2">Submit</button>
        </form>
    );
};

export default ReasonInput;