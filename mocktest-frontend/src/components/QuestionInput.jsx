import React, { useState } from "react";

const QuestionInput = ({ question, setQuestion }) => {
  const [type, setType] = useState("text"); // Default type is text

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <label>Question Type:</label>
        <button className="px-2 py-1 border" onClick={() => setType("text")}>
          Text
        </button>
        <button className="px-2 py-1 border" onClick={() => setType("image")}>
          Image
        </button>
      </div>

      {type === "text" ? (
        <input
          type="text"
          className="border p-2 w-full mt-2"
          placeholder="Enter your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      ) : (
        <input
          type="file"
          accept="image/*"
          className="border p-2 w-full mt-2"
          onChange={(e) => setQuestion(e.target.files[0])}
        />
      )}
    </div>
  );
};

export default QuestionInput;
