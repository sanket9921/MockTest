import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchTestsByGroup } from "../services/testService.";

const TestsList = () => {
  const { categoryId } = useParams();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTestsByGroup(categoryId)
      .then((data) => {
        setTests(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [categoryId]);

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Available Tests
      </h1>

      {loading ? (
        <p className="text-center text-blue-500">Loading tests...</p>
      ) : tests.length === 0 ? (
        <p className="text-center text-gray-500">
          No tests available in this category.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {tests.map((test) => (
            <motion.div
              key={test.id}
              className="p-6 bg-white rounded-lg shadow-lg border border-blue-300"
              whileHover={{ scale: 1.05 }}
            >
              <h2 className="text-xl font-semibold text-blue-800">
                {test.name}
              </h2>
              {test.duration && (
                <p className="text-gray-600">Duration: {test.duration} mins</p>
              )}
              <motion.button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/rules/${test.id}`)}
              >
                Attempt Test
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestsList;
