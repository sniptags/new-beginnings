import React from 'react';

const ProductivityRating = ({ productivity, setProductivity }) => {
    return (
        <div className="productivity-rating">
            <label htmlFor="productivity" className="mb-2 text-lg">Productivity Rating:</label>
            <input
                type="number"
                id="productivity"
                value={productivity}
                onChange={(e) => setProductivity(e.target.value)}
                className="border rounded p-2 mb-4"
                min="1"
                max="10"
                placeholder="Rate your productivity (1-10)"
            />
        </div>
    );
};

export default ProductivityRating;