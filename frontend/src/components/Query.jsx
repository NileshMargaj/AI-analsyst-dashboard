import React from "react";

const Query = () => {
    const query = `SELECT DATE_TRUNC('month', date) AS month,
    SUM(revenue) AS total_revenue
    FROM sales_data
    WHERE YEAR(date) = 2024
    GROUP BY month
    ORDER BY month ASC`;

    return (
        <div className="w-full bg-[#131620] border-l-4 border-violet-500 p-4 rounded-md font-mono">
            <p className="text-violet-600 text-sm font-semibold mb-2">
                GENERATED QUERY
            </p>
            <pre className="text-gray-700 text-sm whitespace-pre-wrap">
                {query}
            </pre>
        </div>
    );
};

export default Query;