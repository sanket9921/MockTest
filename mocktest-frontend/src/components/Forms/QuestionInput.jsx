import React, { useState, useEffect } from "react";
import { updateQuestion } from "../../services/questionService";

const QuestionInput = ({ question, setQuestion, selectedQuestion }) => {
  const [showUpdateButton, setShowUpdateButton] = useState(false);

  useEffect(() => {
    // Reset update button visibility when a new question is selected
    setShowUpdateButton(false);
    console.log(showUpdateButton);
  }, [selectedQuestion]);

  // Handle text input change
  const handleTextChange = (e) => {
    const updatedQuestion = {
      ...question,
      content: e.target.value,
      content_type: "text",
      file: null, // Reset file if switching from image to text
    };
    setQuestion(updatedQuestion);
    checkForChanges(updatedQuestion);
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedQuestion = {
        ...question,
        content: URL.createObjectURL(file), // Show preview of selected image
        content_type: "image",
        file,
      };
      setQuestion(updatedQuestion);
      checkForChanges(updatedQuestion);
    }
  };

  // Toggle between text and image input
  const handleToggleInputType = () => {
    const updatedQuestion = {
      ...question,
      content: "",
      content_type: question.content_type === "text" ? "image" : "text",
      file: null,
    };
    setQuestion(updatedQuestion);
    checkForChanges(updatedQuestion);
  };

  // Handle marks change
  const handleMarksChange = (e) => {
    const updatedQuestion = {
      ...question,
      marks: e.target.value,
    };
    setQuestion(updatedQuestion);
    checkForChanges(updatedQuestion);
  };

  // Handle marks change
  const handleNegativeMarksChange = (e) => {
    const updatedQuestion = {
      ...question,
      negative_marks: e.target.value,
    };
    setQuestion(updatedQuestion);
    checkForChanges(updatedQuestion);
  };
  // Check if there are any changes compared to selectedQuestion
  const checkForChanges = (updatedQuestion) => {
    if (!selectedQuestion) {
      setShowUpdateButton(false);
      return;
    }

    const hasChanges =
      updatedQuestion.content !== selectedQuestion.content ||
      updatedQuestion.content_type !== selectedQuestion.content_type ||
      updatedQuestion.marks !== selectedQuestion.marks ||
      (updatedQuestion.content_type === "image" && updatedQuestion.file);

    console.log(hasChanges);
    setShowUpdateButton(hasChanges);
  };

  // Handle update logic
  const handleUpdateQuestion = async () => {
    console.log("Updating question:", question);
    const formData = new FormData();
    formData.append("marks", question.marks);
    if (question.content_type === "text") {
      formData.append("content", question.content);
      formData.append("content_type", "text");
    } else if (question.content_type === "image" && question.file) {
      formData.append("questionImage", question.file);
      formData.append("content_type", "image");
    }

    await updateQuestion(selectedQuestion.id, formData);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">Question:</label>
        <button
          onClick={handleToggleInputType}
          className="px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Switch to {question.content_type === "text" ? "Image" : "Text"}
        </button>
      </div>

      {/* Show Text Input if Question Type is Text */}
      {question.content_type === "text" ? (
        <textarea
          className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          value={question.content}
          onChange={handleTextChange}
          placeholder="Enter your question here..."
        />
      ) : (
        /* Show Image Upload & Preview if Question Type is Image */
        <div className="flex flex-col items-start gap-2">
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {question.content && (
            <img
              src={question.content}
              alt="Question Preview"
              className="mt-2 w-40 h-40 object-cover border rounded-md"
            />
          )}
        </div>
      )}

      {/* Marks Input */}
      <div className="mt-2">
        <label className="text-sm font-medium text-gray-700">Marks:</label>
        <input
          type="number"
          className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={question.marks}
          onChange={handleMarksChange}
        />
      </div>

      <div className="mt-2">
        <label className="text-sm font-medium text-gray-700">
          Negative Marks (optional)
        </label>
        <input
          type="number"
          className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={question.negative_marks}
          onChange={handleNegativeMarksChange}
        />
      </div>

      {/* Show Update Button Only If Editing & Changes Detected */}
      {showUpdateButton && (
        <button
          onClick={handleUpdateQuestion}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Update Question
        </button>
      )}
    </div>
  );
};

export default QuestionInput;
