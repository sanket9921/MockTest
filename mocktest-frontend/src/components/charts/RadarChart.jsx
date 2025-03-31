import React, { useState, useEffect } from "react";
import { Radar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { getCategoryWiseScores } from "../../services/testAttemptService";
import "chartjs-plugin-datalabels"; // Import Data Labels Plugin

const RadarChart = () => {
  const [categoryData, setCategoryData] = useState({});
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchCategoryScores();
  }, []);

  const fetchCategoryScores = async () => {
    try {
      const response = await getCategoryWiseScores();
      setCategoryData(response);

      // Select the top 5 categories by default
      const top5Categories = Object.keys(response).slice(0, 5);

      setSelectedCategories(top5Categories);
      updateChart(top5Categories, response);
    } catch (error) {
      console.error("Error fetching category-wise scores:", error);
    }
  };

  const updateChart = (categories, data) => {
    if (categories.length === 0) {
      setChartData(null);
      return;
    }

    const scores = categories.map((category) => {
      const categoryScores = data[category] || {};
      const totalMarks = Object.values(categoryScores).reduce(
        (sum, level) => sum + (level?.total_marks || 0),
        0
      );
      const finalScore = Object.values(categoryScores).reduce(
        (sum, level) => sum + (level?.final_score || 0),
        0
      );

      return totalMarks > 0 ? Math.round((finalScore / totalMarks) * 100) : 0;
    });

    setChartData({
      labels: categories,
      datasets: [
        {
          label: "Average Score",
          data: scores,
          backgroundColor: "rgba(30, 144, 255, 0.2)", // Light version of #1E90FF
          borderColor: "#1E90FF", // Main color
          pointBackgroundColor: "#1E90FF", // Dots color
          pointBorderColor: "#1E90FF",
        },
      ],
    });
  };

  const handleCategoryChange = (category) => {
    let updatedSelection;
    if (selectedCategories.includes(category)) {
      updatedSelection = selectedCategories.filter((c) => c !== category);
    } else {
      updatedSelection = [...selectedCategories, category];
    }

    setSelectedCategories(updatedSelection);
    updateChart(updatedSelection, categoryData);
  };

  return (
    <div style={{ width: "70%", margin: "0 auto", textAlign: "center" }}>
      {/* Dropdown with Checkboxes */}
      <div className="dropdown">
        <button
          className="btn btn-primary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          style={{ width: "250px" }}
        >
          Select Category
        </button>
        <ul
          className="dropdown-menu p-2"
          style={{ maxHeight: "200px", overflowY: "auto", minWidth: "250px" }}
        >
          {Object.keys(categoryData).map((category) => (
            <li key={category} style={{ padding: "5px 10px" }}>
              <label
                className="dropdown-item d-flex align-items-center"
                style={{ gap: "8px", padding: "5px" }}
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="me-2"
                  style={{ width: "14px", height: "14px" }}
                />
                <span style={{ fontSize: "14px" }}>{category}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Radar Chart */}
      {chartData ? (
        <Radar
          data={chartData}
          options={{
            responsive: true,
            scales: {
              r: { beginAtZero: true, max: 100 },
            },
            plugins: {
              legend: { display: false }, // Hide legend
              datalabels: {
                display: false,
                color: "#1E90FF",
                font: {
                  size: 14,
                  weight: "bold",
                },
                formatter: (value) => Math.round(value), // Show only digits
              },
            },
          }}
        />
      ) : (
        <p>Select at least one category to view the chart.</p>
      )}
      <h4>Average score by category</h4>
    </div>
  );
};

export default RadarChart;
