import React, { useState, useEffect } from "react";
import { updateQuestion } from "../../services/questionService";
import RichTextEditor from "../common/RichTextEditor";

const QuestionInput = ({ question, setQuestion, selectedQuestion }) => {
  const [showUpdateButton, setShowUpdateButton] = useState(false);

  useEffect(() => {
    setShowUpdateButton(false);
  }, [selectedQuestion]);

  // ✅ Handle Rich Text Change
  const handleTextChange = (value) => {
    const updatedQuestion = {
      ...question,
      content: value,
      content_type: "text",
      file: null,
    };
    setQuestion(updatedQuestion);
    checkForChanges(updatedQuestion);
  };

  // ✅ Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedQuestion = {
        ...question,
        content: URL.createObjectURL(file),
        content_type: "image",
        file,
      };
      setQuestion(updatedQuestion);
      checkForChanges(updatedQuestion);
    }
  };

  // ✅ Toggle Input Type (Text ↔ Image)
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

  // ✅ Handle Marks Input
  const handleMarksChange = (e) => {
    const updatedQuestion = {
      ...question,
      marks: e.target.value,
    };
    setQuestion(updatedQuestion);
    checkForChanges(updatedQuestion);
  };

  // ✅ Handle Negative Marks Input
  const handleNegativeMarksChange = (e) => {
    const updatedQuestion = {
      ...question,
      negative_marks: e.target.value,
    };
    setQuestion(updatedQuestion);
    checkForChanges(updatedQuestion);
  };

  // ✅ Check for Changes (Enable Update Button)
  const checkForChanges = (updatedQuestion) => {
    if (!selectedQuestion) {
      setShowUpdateButton(false);
      return;
    }

    const hasChanges =
      updatedQuestion.content !== selectedQuestion.content ||
      updatedQuestion.content_type !== selectedQuestion.content_type ||
      updatedQuestion.marks !== selectedQuestion.marks ||
      updatedQuestion.negative_marks !== selectedQuestion.negative_marks ||
      (updatedQuestion.content_type === "image" && updatedQuestion.file);

    setShowUpdateButton(hasChanges);
  };

  // ✅ Handle Update Question
  const handleUpdateQuestion = async () => {
    const formData = new FormData();
    formData.append("marks", question.marks);
    formData.append("negative_marks", question.negative_marks || 0);

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
    <div className="my-4">
      {/* Question Input */}
      <div className="my-3">
        <label className="text-sm font-medium">Question:</label>
        <button
          onClick={handleToggleInputType}
          className="ms-3 btn btn-sm btn-secondary"
        >
          {question.content_type === "text" ? "Image" : "Text"}
        </button>
      </div>

      {/* Rich Text Editor for Text Questions */}
      {question.content_type === "text" ? (
        <RichTextEditor value={question.content} onChange={handleTextChange} />
      ) : (
        /* Image Upload */
        <div className="mb-3">
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {question.content && (
            <img
              src={question.content}
              alt="Preview"
              className="mt-2 img-thumbnail"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
          )}
        </div>
      )}

      {/* Marks Input */}
      <div className="my-3">
        <label className="text-sm font-medium">Marks:</label>
        <input
          type="number"
          className="form-control"
          value={question.marks}
          onChange={handleMarksChange}
        />
      </div>

      {/* Update Button */}
      {showUpdateButton && (
        <button onClick={handleUpdateQuestion} className="btn btn-success">
          Update Question
        </button>
      )}
    </div>
  );
};

export default QuestionInput;
