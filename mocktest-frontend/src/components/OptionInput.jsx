import React, { useState } from "react";
import { deleteOption, updateOption } from "../services/optionService";
import { updateAnswers } from "../services/answersService";

const OptionInput = ({
  index,
  option,
  options,
  setOptions,
  correctAnswers, // Array of correct answers
  setCorrectAnswers, // Function to update correct answers
  type,
  selectedQuestion,
}) => {
  const [isTextInput, setIsTextInput] = useState(
    option.content_type === "text"
  );
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [updatedContent, setUpdatedContent] = useState(option.content);
  const [updatedFile, setUpdatedFile] = useState(null);
  const [showUpdateOptionButton, setShowUpdateOptionButton] = useState(false);

  /// Handle text input change
  const handleTextChange = (e) => {
    if (selectedQuestion) {
      // ✅ Editing an existing option
      setOptions((prevOptions) =>
        prevOptions.map((opt, i) =>
          i === index ? { ...opt, content: e.target.value } : opt
        )
      );
      setShowUpdateOptionButton(true);
    } else {
      // ✅ Adding a new option
      const updatedOptions = [...options];
      updatedOptions[index] = {
        ...option,
        content: e.target.value,
        content_type: "text",
        file: null,
      };
      setOptions(updatedOptions);
    }
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (selectedQuestion) {
        // ✅ Editing an existing option
        setOptions((prevOptions) =>
          prevOptions.map((opt, i) =>
            i === index
              ? { ...opt, content: URL.createObjectURL(file), file }
              : opt
          )
        );
        setShowUpdateOptionButton(true);
      } else {
        // ✅ Adding a new option
        const updatedOptions = [...options];
        updatedOptions[index] = {
          ...option,
          content: URL.createObjectURL(file),
          content_type: "image",
          file,
        };
        setOptions(updatedOptions);
      }
    }
  };
  // Handle selection of correct answers
  const handleCorrectAnswerChange = () => {
    const answerIdentifier = option.id ?? index;
    if (selectedQuestion) {
      // ✅ Editing an existing question
      setCorrectAnswers((prev) => {
        const updatedAnswers =
          selectedQuestion.type === "single_choice"
            ? [answerIdentifier] // Only one correct answer for MCQ
            : prev.includes(answerIdentifier)
            ? prev.filter((id) => id !== answerIdentifier) // Remove if already selected
            : [...prev, answerIdentifier]; // Add if not selected

        setShowUpdateButton(true); // Show update button if changes are made
        return updatedAnswers;
      });
    } else {
      if (type === "radio") {
        // ✅ MCQ (Single Answer)
        setCorrectAnswers([answerIdentifier]); // Only store one correct answer
      } else {
        // ✅ MSQ (Multiple Answers)
        setCorrectAnswers((prev) => {
          const updatedAnswers = Array.isArray(prev) ? [...prev] : [];
          return updatedAnswers.includes(answerIdentifier)
            ? updatedAnswers.filter((i) => i !== answerIdentifier)
            : [...updatedAnswers, answerIdentifier];
        });
      }
    }
    if (selectedQuestion) {
      setShowUpdateButton(true); // Show update button when editing
    }
  };
  const handleUpdateCorrectAnswer = async () => {
    console.log(correctAnswers);
    await updateAnswers(selectedQuestion.id, correctAnswers);
    setShowUpdateButton(false); // Show update button when editing
  };

  const handleDeleteOption = async () => {
    if (correctAnswers.includes(option.id ?? index)) {
      alert("You must update the correct answer before deleting this option.");
      return;
    }

    if (selectedQuestion && option.id) {
      deleteOption(option.id);
    }

    // Remove the option from local state
    setOptions(options.filter((_, i) => i !== index));
  };
  const handleUpdateOption = async () => {
    if (!selectedQuestion || !option.id) return; // Ensure we're editing an existing option

    const formData = new FormData();
    formData.append("optionId", option.id);

    if (option.content_type === "text") {
      formData.append("content", option.content);
      formData.append("content_type", "text");
    } else if (option.file) {
      formData.append("file", option.file);
      formData.append("content_type", "image");
    }

    try {
      await updateOption(option.id, formData);
      setShowUpdateOptionButton(false);
    } catch (error) {
      console.error("Error updating option:", error);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Radio button for MCQ, Checkbox for MSQ */}
      <input
        type={type}
        checked={
          Array.isArray(correctAnswers)
            ? correctAnswers.includes(option.id ?? index)
            : false
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
      {/* Show "Update Option" Button When Editing */}
      {selectedQuestion && showUpdateOptionButton && (
        <button
          onClick={handleUpdateOption}
          className="ml-2 px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Update Option
        </button>
      )}
      {/* Show "Update Correct Answer" button only in edit mode when changes are made */}
      {selectedQuestion && showUpdateButton && (
        <button
          onClick={handleUpdateCorrectAnswer}
          className="ml-2 px-2 py-1 text-sm text-white bg-green-500 rounded hover:bg-green-600"
        >
          Update Correct Answer
        </button>
      )}
    </div>
  );
};

export default OptionInput;
