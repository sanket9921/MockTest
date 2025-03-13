import { useState } from "react";
import { updateExplanation } from "../../services/questionService";

const updateExplanationForm = ({ data, onClose }) => {
  const [explanation, setExplanation] = useState(data.explanation || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!explanation.trim()) {
      setError("Explanation cannot be empty.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await updateExplanation(data.id, explanation);
      onClose(); // Close modal after successful update
    } catch (err) {
      setError("Failed to update explanation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdate}>
      <div className="mb-3">
        <label className="form-label">Explanation</label>
        <textarea
          className="form-control"
          rows="4"
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Enter explanation..."
        ></textarea>
        {error && <div className="text-danger mt-2">{error}</div>}
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Updating..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default updateExplanationForm;
