import { useState } from "react";
import { addOption } from "../../services/optionService";

const AddOptionForm = ({ data, onClose }) => {
  const [optionType, setOptionType] = useState("text"); // Default: text
  const [optionValue, setOptionValue] = useState("");
  const [optionFile, setOptionFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data?.id) {
      alert("Error: Question ID is missing!");
      return;
    }

    const formData = new FormData();
    formData.append("question_id", data.id);

    if (optionType === "image") {
      if (!optionFile) {
        alert("Please select an image.");
        return;
      }
      formData.append("content_type", "image");
      formData.append("file", optionFile);
    } else {
      if (!optionValue.trim()) {
        alert("Please enter option text.");
        return;
      }
      formData.append("content_type", "text");
      formData.append("content", optionValue);
    }

    setIsSubmitting(true);

    try {
      await addOption(formData); // Call API
      onClose(); // Close modal after successful save
    } catch (error) {
      console.error("Error adding option:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Show Question Content */}
      <div className="mb-3 border p-3 rounded bg-light">
        <strong>Question:</strong>
        {data.content_type === "image" ? (
          <img
            src={data.content}
            alt="Question"
            className="w-100 mt-2 rounded"
          />
        ) : (
          <p className="mt-2">{data.content}</p>
        )}
      </div>

      {/* Option Type Selector */}
      <div className="mb-3">
        <label className="form-label fw-bold">Option Type:</label>
        <select
          value={optionType}
          onChange={(e) => setOptionType(e.target.value)}
          className="form-select"
        >
          <option value="text">Text</option>
          <option value="image">Image</option>
        </select>
      </div>

      {/* Option Input */}
      {optionType === "text" ? (
        <input
          type="text"
          placeholder="Enter option text"
          value={optionValue}
          onChange={(e) => setOptionValue(e.target.value)}
          className="form-control mb-3"
        />
      ) : (
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setOptionFile(e.target.files[0])}
          className="form-control mb-3"
        />
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`btn ${isSubmitting ? "btn-secondary" : "btn-primary"}`}
      >
        {isSubmitting ? (
          <>
            <i className="bi bi-hourglass-split me-2"></i> Adding...
          </>
        ) : (
          <>
            <i className="bi bi-plus-lg me-2"></i> Add
          </>
        )}
      </button>
    </div>
  );
};

export default AddOptionForm;
