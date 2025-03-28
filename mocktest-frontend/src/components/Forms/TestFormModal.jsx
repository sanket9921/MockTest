import { useState, useEffect } from "react";
import ActionModal from "../ActionModal";
import { getCategories } from "../../services/categoryService"; // API call to get categories

const TestFormModal = ({ data, onClose, onSave }) => {
  const [testName, setTestName] = useState("");
  const [duration, setDuration] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [negative, setNegative] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();

    if (data?.id) {
      // Prefill form when editing
      setTestName(data.name || "");
      setDuration(data.duration || "");
      setDifficulty(data.difficulty || "easy");
      setNegative(data.negative || "");
      setCategoryId(data.category_id || ""); // Set selected category
    } else {
      // Reset form for new test
      setTestName("");
      setDuration("");
      setDifficulty("easy");
      setNegative("");
      setCategoryId(""); // No category selected initially
    }
  }, [data]);

  const loadCategories = async () => {
    try {
      const categoryList = await getCategories(); // Fetch categories from API
      setCategories(categoryList.data || []); // Ensure it's an array
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!testName || !difficulty || !categoryId) {
      alert("Test name, difficulty, and category are required!");
      return;
    }

    // Prepare test data
    const testData = {
      id: data?.id || null, // Include ID only when editing
      name: testName,
      duration: duration || null, // Optional
      difficulty,
      negative: negative || null, // Optional
      category_id: categoryId, // Store selected category
    };

    onSave(testData);
  };

  return (
    <ActionModal data={data} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        {/* Test Name */}
        <div className="mb-3">
          <label className="form-label">Test Name *</label>
          <input
            type="text"
            className="form-control"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            required
          />
        </div>

        {/* Duration */}
        <div className="mb-3">
          <label className="form-label">Duration (Minutes)</label>
          <input
            type="number"
            className="form-control"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            min="1"
          />
        </div>

        {/* Difficulty */}
        <div className="mb-3">
          <label className="form-label">Difficulty *</label>
          <select
            className="form-select"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            required
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Category Selection */}
        <div className="mb-3">
          <label className="form-label">Category *</label>
          <select
            className="form-select"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
                className="text-dark"
              >
                {category.category_name}
              </option>
            ))}
          </select>
        </div>

        {/* Negative Marking */}
        <div className="mb-3">
          <label className="form-label">Negative Marking</label>
          <input
            type="number"
            className="form-control"
            value={negative}
            onChange={(e) => setNegative(e.target.value)}
            step="0.1"
          />
        </div>

        {/* Buttons */}
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {data?.id ? "Update Test" : "Create Test"}
          </button>
        </div>
      </form>
    </ActionModal>
  );
};

export default TestFormModal;
