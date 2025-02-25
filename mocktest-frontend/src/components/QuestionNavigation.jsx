import { motion } from "framer-motion";

const QuestionNavigation = ({ totalPages, currentPage, onNavigate }) => {
  return (
    <motion.div
      className="fixed top-20 right-10 bg-white shadow-md p-4 rounded-lg"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <h3 className="text-lg font-semibold mb-2">Questions</h3>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalPages }).map((_, index) => {
          const pageNum = index + 1;
          return (
            <button
              key={pageNum}
              className={`w-10 h-10 rounded-full ${
                pageNum === currentPage
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => onNavigate(pageNum)}
            >
              {pageNum}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default QuestionNavigation;
