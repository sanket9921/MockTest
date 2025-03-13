import { useState, useEffect } from "react";
import ActionModal from "../ActionModal";

const TestFormModal = ({ data, onClose, onSave }) => {
  const [testName, setTestName] = useState("");
  const [duration, setDuration] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [negative, setNegative] = useState("");

  useEffect(() => {
    if (data?.id) {
      // Prefill form when editing
      setTestName(data.name || "");
      setDuration(data.duration || "");
      setDifficulty(data.difficulty || "easy");
      setNegative(data.negative || "");
    } else {
      // Reset form for new test
      setTestName("");
      setDuration("");
      setDifficulty("easy");
      setNegative("");
    }
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!testName || !difficulty) {
      alert("Test name and difficulty are required!");
      return;
    }

    // Prepare test data
    const testData = {
      id: data?.id || null, // Include ID only when editing
      name: testName,
      duration: duration || null, // Optional
      difficulty,
      negative: negative || null, // Optional
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
