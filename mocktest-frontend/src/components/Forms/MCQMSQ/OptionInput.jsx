import React, { useState } from "react";

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

  // Handle text input change
  const handleTextChange = (e) => {
    //  Adding a new option
    const updatedOptions = [...options];
    updatedOptions[index] = {
      ...option,
      content: e.target.value,
      content_type: "text",
      file: null,
    };
    setOptions(updatedOptions);
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      //  Adding a new option
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
  // Handle selection of correct answers
  const handleCorrectAnswerChange = () => {
    console.log(index);
    if (type === "radio") {
      //  MCQ (Single Answer)
      setCorrectAnswers([index]); // Only store one correct answer
    } else {
      //  MSQ (Multiple Answers)
      setCorrectAnswers((prev) => {
        const updatedAnswers = Array.isArray(prev) ? [...prev] : [];
        return updatedAnswers.includes(index)
          ? updatedAnswers.filter((i) => i !== index)
          : [...updatedAnswers, index];
      });
    }
  };

  const handleDeleteOption = async () => {
    setOptions(options.filter((_, i) => i !== index));
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Radio button for MCQ, Checkbox for MSQ */}
      <input
        type={type}
        checked={
          Array.isArray(correctAnswers) ? correctAnswers.includes(index) : false
        }
        onChange={handleCorrectAnswerChange}
      />

      {/* Show Text Input if it's a Text Option */}
      {option.content_type === "text" ? (
        <input
          type="text"
          value={option.content}
          onChange={handleTextChange}
          placeholder="Enter option"
          className="p-2 border rounded-md"
        />
      ) : (
        /* Show Image Preview if it's an Image Option */
        <div className="flex items-center space-x-2">
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {option.content && (
            <img
              src={option.content}
              alt="Preview"
              className="w-16 h-16 mt-2 border rounded-md"
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
        className="p-1 text-sm bg-gray-300 rounded"
      >
        Switch to {isTextInput ? "Image" : "Text"}
      </button>

      {/* Delete Option Button */}
      <button
        onClick={handleDeleteOption}
        className="p-2 bg-red-500 text-white rounded"
      >
        X
      </button>
    </div>
  );
};

export default OptionInput;
