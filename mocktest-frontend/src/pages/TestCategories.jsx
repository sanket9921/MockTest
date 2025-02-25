import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchTestGroups } from "../services/testGroupService";

const TestCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTestGroups()
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Choose a Test Category
      </h1>

      {loading ? (
        <p className="text-center text-blue-500">Loading categories...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              className="p-6 bg-white rounded-lg shadow-lg cursor-pointer text-center border border-blue-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/testslist/${category.id}`)}
            >
              <h2 className="text-xl font-semibold text-blue-800">
                {category.name}
              </h2>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestCategories;
