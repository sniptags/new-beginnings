import React, { useEffect, useState } from 'react';

const Recommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/users/recommendations', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();
            if (Array.isArray(result.recommendations)) {
                setRecommendations(result.recommendations);
            } else {
                const recommendationsArray = result.recommendations.split('\n').filter(line => line.trim().length > 0);
                setRecommendations(recommendationsArray);
            }
            setLoading(false);
        };

        fetchRecommendations();
    }, []);

    return (
        <div className="recommendations">
            <h2 className="text-lg font-bold">Recommendations</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul className="list-disc pl-5">
                    {recommendations.map((rec, index) => (
                        <li key={index} className="my-2">{rec}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Recommendations;