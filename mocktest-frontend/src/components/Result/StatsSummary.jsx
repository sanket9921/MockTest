import {
  FaPercentage,
  FaCheckCircle,
  FaList,
  FaTrophy,
  FaStar,
  FaTimesCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const StatsSummary = ({ stats }) => {
  // Ensure valid values
  const correct = stats.correct_answers || 0;
  const incorrect = stats.incorrect_answers || 0;
  const unattempted = Math.max(
    stats.total_questions - stats.attempted_questions,
    0
  );
  const marksGained = stats.marks_gained || 0;
  const negativeMarks = Math.abs(stats.negative_marks || 0);

  // 🔹 Doughnut Chart Data
  const doughnutData = {
    labels: ["Marks Gained", "Negative Marks", "Unattempted"],
    datasets: [
      {
        data: [marksGained, negativeMarks, unattempted],
        backgroundColor: ["#28a745", "#dc3545", "#6c757d"],
        hoverBackgroundColor: ["#218838", "#c82333", "#5a6268"],
      },
    ],
  };

  // 📊 Score Summary Data
  const statItems = [
    {
      label: "Percentage %",
      value: ((stats.final_score / stats.total_marks) * 100).toFixed(2) + "%",
      icon: <FaPercentage className="text-primary fs-4" />,
    },
    {
      label: "Final Score",
      value: stats.final_score,
      icon: <FaTrophy className="text-warning fs-4" />,
    },
    {
      label: "Attempted Questions",
      value: stats.attempted_questions,
      icon: <FaCheckCircle className="text-success fs-4" />,
    },
    {
      label: "Total Marks",
      value: stats.total_marks,
      icon: <FaList className="text-secondary fs-4" />,
    },
    {
      label: "Marks Gained",
      value: stats.marks_gained,
      icon: <FaStar className="text-info fs-4" />,
    },
    {
      label: "Negative Marks",
      value: stats.negative_marks,
      icon: <FaTimesCircle className="text-danger fs-4" />,
    },
  ];

  return (
    <div
      className="d-flex flex-row gap-3 align-items-stretch flex-nowrap"
      style={{ overflowX: "auto" }}
    >
      {/* Left Side - Doughnut Chart */}
      <div
        className="card bg-white text-dark border shadow-sm p-3 flex-grow-1 d-flex flex-column"
        style={{ minWidth: "300px", maxWidth: "350px", flexBasis: "35%" }}
      >
        <h6 className="text-center fw-bold mb-3">Performance Breakdown</h6>
        <div
          className="d-flex justify-content-center align-items-center flex-grow-1"
          style={{ minHeight: "250px" }}
        >
          <Doughnut data={doughnutData} />
        </div>
      </div>

      {/* Right Side - Score Summary (Always in Row) */}
      <div
        className="card bg-white text-dark border shadow-sm p-3 flex-grow-1 d-flex flex-column"
        style={{ flexBasis: "65%", minWidth: "400px" }}
      >
        <h6 className="text-center fw-bold mb-3">Score Summary</h6>
        <div className="d-flex flex-wrap gap-3 justify-content-center">
          {statItems.map((item, index) => (
            <div
              key={index}
              className="d-flex align-items-center bg-light rounded p-2 shadow-sm"
              style={{ flex: "1 1 calc(50% - 10px)", minWidth: "120px" }}
            >
              <div className="p-2">{item.icon}</div>
              <div className="ms-2">
                <h6 className="mb-1">{item.label}</h6>
                <p className="fw-bold mb-0">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSummary;
