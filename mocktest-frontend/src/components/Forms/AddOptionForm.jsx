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
      <div className="mb-4 border p-3 rounded bg-gray-100">
        <strong>Question:</strong>
        {data.content_type === "image" ? (
          <img
            src={data.content}
            alt="Question"
            className="w-full mt-2 rounded"
          />
        ) : (
          <p className="mt-2">{data.content}</p>
        )}
      </div>

      {/* Option Type Selector */}
      <div className="mb-4">
        <label className="font-medium">Option Type:</label>
        <select
          value={optionType}
          onChange={(e) => setOptionType(e.target.value)}
          className="w-full p-2 border rounded"
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
          className="w-full p-2 border rounded"
        />
      ) : (
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setOptionFile(e.target.files[0])}
          className="w-full p-2 border rounded"
        />
      )}

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`px-4 py-2 text-white rounded ${
          isSubmitting ? "bg-gray-400" : "bg-blue-500"
        }`}
      >
        {isSubmitting ? "Adding..." : "Add"}
      </button>
    </div>
  );
};

export default AddOptionForm;
