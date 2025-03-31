import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import the plugin
import { getCategoryWiseScores } from "../../services/testAttemptService";

const BarChart = () => {
  const [categoryData, setCategoryData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    fetchCategoryScores();
  }, []);

  const fetchCategoryScores = async () => {
    try {
      const response = await getCategoryWiseScores();
      setCategoryData(response);

      if (Object.keys(response).length > 0) {
        setSelectedCategory(Object.keys(response)[0]); // Set first category as default
      }
    } catch (error) {
      console.error("Error fetching category-wise scores:", error);
    }
  };

  useEffect(() => {
    if (selectedCategory && categoryData[selectedCategory]) {
      renderChart();
    }
  }, [selectedCategory, categoryData]);

  const renderChart = () => {
    if (!chartRef.current) return; // Prevent errors if ref is not ready
    const ctx = chartRef.current.getContext("2d");

    if (chartInstance.current) {
      chartInstance.current.destroy(); // Destroy existing chart before creating a new one
    }

    const categoryScores = categoryData[selectedCategory] || {};
    const difficulties = ["Easy", "Medium", "Hard"];
    const percentages = difficulties.map((level) => {
      const totalMarks = categoryScores[level]?.total_marks || 0;
      const finalScore = categoryScores[level]?.final_score || 0;
      return totalMarks > 0 ? (finalScore / totalMarks) * 100 : 0;
    });

    const barColors = ["#78BCFF", "#4FA9FF", "#1E90FF"]; // 3 Different shades of blue

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: difficulties,
        datasets: [
          {
            label: "Percentage Score (%)",
            backgroundColor: barColors,
            data: percentages,
            categoryPercentage: 0.5, // Ensures bars take full width, reducing gaps
            barPercentage: 1.7, // Reduces gap between bars while keeping them wide
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: (value) => `${value}%`, // Show percentage labels
            },
          },
          x: {
            grid: {
              display: false, // Remove vertical grid lines
            },
          },
        },
        plugins: {
          datalabels: {
            formatter: (value) => value.toFixed(0), // Show only digits (no decimal)
            font: {
              size: 16, // Make labels larger
              weight: "bold", // Make labels bold
            },
            color: "White", // Ensure visibility
          },
          legend: {
            display: false, // Hide legend
          },
        },
      },
      // plugins: [ChartDataLabels], // Register the plugin
    });
  };

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      {/* Category Dropdown */}
      <select
        className="form-select rounded mb-3 custom-select"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        {Object.keys(categoryData).map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      {/* Bar Chart */}
      <canvas ref={chartRef}></canvas>
      <h4 className="text-center mt-2">Performance by Difficulty Level</h4>
    </div>
  );
};

export default BarChart;
