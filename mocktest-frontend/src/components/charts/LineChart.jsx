import React, { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import { getCategoryAverageScores } from "../../services/testAttemptService";

const LineChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [apiData, setApiData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 15))
      .toISOString()
      .split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    try {
      const response = await getCategoryAverageScores(startDate, endDate);
      console.log(response);

      if (!response || !response.data) {
        console.error("Invalid response data:", response);
        return;
      }

      const { data, attemptedCategories } = response;
      setApiData(data);
      setAllCategories(attemptedCategories);

      const top5 = attemptedCategories.slice(0, 5).map((cat) => cat.name);
      setSelectedCategories(top5);

      setChartData(formatChartData(data, top5));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const formatChartData = (data, selectedCats) => {
    const allDates = new Set();
    data.forEach((category) => {
      if (selectedCats.includes(category.category)) {
        category.scores.forEach((entry) => allDates.add(entry.date));
      }
    });

    const sortedDates = [...allDates].sort();

    const datasets = selectedCats.map((category, index) => {
      const categoryData = data.find((item) => item.category === category);
      const scores = categoryData?.scores || [];

      const scoreMap = new Map(
        scores.map((entry) => [entry.date, entry.avgScore])
      );

      const formattedScores = sortedDates.map((date) =>
        scoreMap.has(date) ? scoreMap.get(date) : null
      );

      return {
        label: category,
        data: formattedScores,
        borderColor: getShadedColor(index, selectedCats.length),
        borderWidth: 2,
        fill: false,
        tension: 0,
        spanGaps: true,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: getShadedColor(index, selectedCats.length),
        pointHoverBackgroundColor: "#fff",
        pointBorderColor: "#fff",
        pointHoverBorderWidth: 2,
      };
    });

    return {
      labels: sortedDates,
      datasets,
    };
  };

  useEffect(() => {
    if (!chartData.labels || chartData.labels.length === 0) return;

    const ctx = chartRef.current.getContext("2d");
    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: chartData,
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { callback: (value) => `${value}%` },
          },
          x: {
            grid: { display: false },
            ticks: { autoSkip: true, maxTicksLimit: 7 },
          },
        },
        plugins: {
          datalabels: {
            display: false,
          },
          legend: { position: "top" },
        },
      },
    });
  }, [chartData]);

  const handleCategoryChange = (category) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((cat) => cat !== category)
      : [...selectedCategories, category];

    setSelectedCategories(updatedCategories);
    setChartData(formatChartData(apiData, updatedCategories));
  };

  return (
    <div className="container">
      {/* Button Aligned to Right */}
      <div className="d-flex justify-content-end mb-3">
        <div className="dropdown">
          <button
            className="btn btn-primary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{ minWidth: "200px" }}
          >
            Select Category
          </button>
          <ul
            className="dropdown-menu p-2"
            style={{ maxHeight: "200px", overflowY: "auto", minWidth: "200px" }}
          >
            {allCategories.length > 0 ? (
              allCategories.map((cat) => (
                <li key={cat.id} style={{ padding: "5px 10px" }}>
                  <label
                    className="dropdown-item d-flex align-items-center"
                    style={{ gap: "8px", padding: "5px" }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.name)}
                      onChange={() => handleCategoryChange(cat.name)}
                      className="me-2"
                      style={{ width: "14px", height: "14px" }}
                    />
                    <span style={{ fontSize: "14px" }}>{cat.name}</span>
                  </label>
                </li>
              ))
            ) : (
              <li className="p-2 text-muted">No categories available</li>
            )}
          </ul>
        </div>
      </div>

      {/* Date Inputs (Full Width) */}
      <div className="d-flex gap-3">
        <div className="w-100">
          <label>Start Date:</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="w-100">
          <label>End Date:</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Line Chart */}
      <canvas ref={chartRef}></canvas>
      <h4 className="text-center mt-2">Performance trend by category</h4>
    </div>
  );
};

// ✅ Generate different shades of #007bff dynamically
const getShadedColor = (index, totalShades) => {
  const factor = 1 - (index / totalShades) * 0.5;
  return `rgba(30, 144, 255, ${factor.toFixed(2)})`;
};

export default LineChart;
