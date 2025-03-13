import { motion } from "framer-motion";

const StatsSummary = ({ stats }) => {
  return (
    <motion.div
      className="row g-4 mb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {[
        {
          label: "Percentage %",
          value: (stats.final_score / stats.total_marks) * 100 + "%",
          bg: "bg-white",
          text: "text-dark",
          border: "custom-border",
        },
        {
          label: "Final Score",
          value: stats.final_score,
          bg: "bg-white",
          text: "text-dark",
          border: "custom-border",
        },
        {
          label: "Attempted Questions",
          value: stats.attempted_questions,
          bg: "bg-white",
          text: "text-dark",
          border: "custom-border",
        },
        {
          label: "Total Marks",
          value: stats.total_marks,
          bg: "bg-white",
          text: "text-dark",
          border: "custom-border",
        },
        {
          label: "Marks Gained",
          value: stats.marks_gained,
          bg: "bg-white",
          text: "text-dark",
          border: "custom-border",
        },

        {
          label: "Negative Marks",
          value: stats.negative_marks,
          bg: "bg-white",
          text: "text-dark",
          border: "custom-border",
        },
      ].map((item, index) => (
        <motion.div
          key={index}
          className="col-12 col-sm-6 col-lg-4"
          whileHover={{ scale: 1.03 }}
        >
          <div
            className={`card ${item.bg} ${item.text} border ${item.border} shadow-sm`}
          >
            <div className="card-body text-center">
              <h6 className="card-title">{item.label}</h6>
              <p className="fs-4 fw-semibold">{item.value}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsSummary;
