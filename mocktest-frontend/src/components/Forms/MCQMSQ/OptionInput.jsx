import React, { useState } from "react";
import RichTextEditor from "../../common/RichTextEditor";

const OptionInput = ({
  index,
  option,
  options,
  setOptions,
  correctAnswers, // Array of correct answers
  setCorrectAnswers, // Function to update correct answers
  type,
}) => {
  const [isTextInput, setIsTextInput] = useState(
    option.content_type === "text"
  );

  // ✅ Handle rich text change
  const handleTextChange = (value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = {
      ...option,
      content: value, // Set rich text content
      content_type: "text",
      file: null,
    };
    setOptions(updatedOptions);
  };

  // ✅ Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedOptions = [...options];
      updatedOptions[index] = {
        ...option,
        content: URL.createObjectURL(file),
        content_type: "image",
        file,
      };
      setOptions(updatedOptions);
    }
  };

  // ✅ Handle selection of correct answers
  const handleCorrectAnswerChange = () => {
    if (type === "radio") {
      // MCQ (Single Answer)
      setCorrectAnswers([index]); // Only store one correct answer
    } else {
      // MSQ (Multiple Answers)
      setCorrectAnswers((prev) => {
        const updatedAnswers = Array.isArray(prev) ? [...prev] : [];
        return updatedAnswers.includes(index)
          ? updatedAnswers.filter((i) => i !== index)
          : [...updatedAnswers, index];
      });
    }
  };

  // ✅ Handle option deletion
  const handleDeleteOption = () => {
    setOptions(options.filter((_, i) => i !== index));
  };

  return (
    <div className="d-flex align-items-center gap-2 mb-2">
      {/* Radio button for MCQ, Checkbox for MSQ */}
      <input
        type={type}
        checked={
          Array.isArray(correctAnswers) ? correctAnswers.includes(index) : false
        }
        onChange={handleCorrectAnswerChange}
        className="form-check-input"
      />

      {/* Show RichTextEditor if it's a Text Option */}
      {option.content_type === "text" ? (
        <div className="w-50">
          <RichTextEditor value={option.content} onChange={handleTextChange} />
        </div>
      ) : (
        /* Show Image Preview if it's an Image Option */
        <div className="d-flex align-items-center gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="form-control"
          />
          {option.content && (
            <img
              src={option.content}
              alt="Preview"
              className="img-thumbnail"
              style={{ width: "60px", height: "60px", objectFit: "cover" }}
            />
          )}
        </div>
      )}

      {/* Button to Toggle Between Text and Image */}
      <button
        onClick={() => {
          const updatedOptions = [...options];
          updatedOptions[index] = {
            ...option,
            content: "", // Reset content when switching
            content_type: isTextInput ? "image" : "text",
            file: null,
          };
          setOptions(updatedOptions);
          setIsTextInput(!isTextInput);
        }}
        className="btn btn-sm btn-secondary"
      >
        {isTextInput ? "Image" : "Text"}
      </button>

      {/* Delete Option Button */}
      <div onClick={handleDeleteOption} className="text-danger fw-bold">
        <i className="bi bi-x-lg"></i>
      </div>
    </div>
  );
};

export default OptionInput;
