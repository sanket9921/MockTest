import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { getTopCategories } from "../../services/testAttemptService";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register Chart.js components and plugins
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

// Function to generate different shades of blue dynamically
const generateShades = (baseColor, totalShades) => {
  return Array.from({ length: totalShades }, (_, i) => {
    const factor = 1 - (i / totalShades) * 0.5; // Adjust brightness factor
    return `rgba(0, 123, 255, ${factor.toFixed(2)})`; // Vary opacity for effect
  });
};

const DonutChart = () => {
  const [allCategories, setAllCategories] = useState([]); // Stores all fetched categories
  const [selectedCategories, setSelectedCategories] = useState([]); // Stores selected categories for chart
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false); // Dropdown visibility state

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = async () => {
    try {
      setLoading(true);
      const data = await getTopCategories();

      if (data.length === 0) {
        setChartData(null);
        setLoading(false);
        return;
      }

      setAllCategories(data); // Store all categories
      setSelectedCategories(data.slice(0, 5)); // Initially select top 5 categories

      updateChartData(data.slice(0, 5)); // Initialize chart with top 5

      setLoading(false);
    } catch (error) {
      console.error("Error loading chart data:", error);
      setLoading(false);
    }
  };

  const updateChartData = (categories) => {
    const totalAttempts = categories.reduce(
      (sum, category) => sum + parseInt(category.test_attempt_count, 10),
      0
    );

    const labels = categories.map((category) => category.category_name);
    const series = categories.map((category) =>
      totalAttempts > 0
        ? Math.round((category.test_attempt_count / totalAttempts) * 100)
        : 0
    );

    const backgroundColors = generateShades("#007bff", labels.length);

    setChartData({
      labels,
      datasets: [
        {
          label: "Test Attempts (%)",
          data: series,
          backgroundColor: backgroundColors,
          hoverBackgroundColor: backgroundColors,
          borderWidth: 1,
        },
      ],
    });
  };

  // Handle checkbox selection
  const handleCheckboxChange = (category) => {
    let updatedSelection;
    if (selectedCategories.some((c) => c.id === category.id)) {
      // Remove if already selected
      updatedSelection = selectedCategories.filter((c) => c.id !== category.id);
    } else {
      // Add if not selected
      updatedSelection = [...selectedCategories, category];
    }
    setSelectedCategories(updatedSelection);
    updateChartData(updatedSelection);
  };

  return (
    <div style={{ width: "100%", maxWidth: "600px" }}>
      {loading ? (
        <p>Loading chart...</p>
      ) : chartData ? (
        <>
          <div
            style={{
              width: "100%",
              textAlign: "center",
            }}
          >
            <button
              className="btn btn-primary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ width: "250px" }} // Adjust button width
            >
              Select Categories
            </button>
            <ul
              className="dropdown-menu"
              style={{ minWidth: "250px", padding: "10px" }}
            >
              {" "}
              {/* Adjust dropdown width */}
              {allCategories.map((category) => (
                <li key={category.id} style={{ padding: "5px 10px" }}>
                  {" "}
                  {/* Left-align items */}
                  <label
                    className="dropdown-item d-flex align-items-center"
                    style={{ gap: "8px", padding: "5px" }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.some(
                        (c) => c.id === category.id
                      )}
                      onChange={() => handleCheckboxChange(category)}
                      style={{
                        width: "14px",
                        height: "14px",
                        marginRight: "5px",
                      }} // Smaller checkbox
                    />
                    <span style={{ fontSize: "14px" }}>
                      {category.category_name}
                    </span>{" "}
                    {/* Smaller text */}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Donut Chart */}
          <div style={{ position: "relative", width: "100%", height: "400px" }}>
            <Doughnut
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false, // Ensures full width
                layout: {
                  padding: 50, // Extra space for labels
                },
                clip: false,
                plugins: {
                  legend: {
                    display: false, // Hide default legend
                  },
                  tooltip: {
                    callbacks: {
                      label: (tooltipItem) => `${tooltipItem.raw}%`,
                    },
                  },
                  datalabels: {
                    color: "#333",
                    font: {
                      size: 14,
                      weight: "bold",
                    },
                    clip: false, // Prevents text from being cut off
                    anchor: "end", // Moves labels outside
                    align: "end", // Positions labels at the end of the arc
                    offset: 10, // Moves labels further outside
                    formatter: (value, context) => {
                      const label =
                        context.chart.data.labels[context.dataIndex];
                      return `${label}\n${value}%`; // Category Name + Percentage
                    },
                  },
                },
              }}
            />
          </div>
        </>
      ) : (
        <p>No data available</p>
      )}
      <h4 className="text-center">Test Attempts by Category</h4>
    </div>
  );
};

export default DonutChart;
