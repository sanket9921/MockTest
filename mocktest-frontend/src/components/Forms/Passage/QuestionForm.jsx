import React from "react";

const QuestionForm = ({ question, updateQuestion, removeQuestion }) => {
  const toggleQuestionType = () => {
    updateQuestion(question.id, {
      contentType: question.contentType === "text" ? "image" : "text",
    });
  };

  const toggleOptionType = (index) => {
    const updatedOptions = question.options.map((opt, i) =>
      i === index
        ? { ...opt, contentType: opt.contentType === "text" ? "image" : "text" }
        : opt
    );
    updateQuestion(question.id, { options: updatedOptions });
  };

  const updateOption = (index, value) => {
    const updatedOptions = question.options.map((opt, i) =>
      i === index ? { ...opt, content: value } : opt
    );
    updateQuestion(question.id, { options: updatedOptions });
  };

  const toggleCorrectAnswer = (index) => {
    const updatedOptions = question.options.map((opt, i) => ({
      ...opt,
      isCorrect:
        question.type === "MCQ"
          ? i === index
          : i === index
          ? !opt.isCorrect
          : opt.isCorrect,
    }));
    updateQuestion(question.id, { options: updatedOptions });
  };

  const addOption = () => {
    updateQuestion(question.id, {
      options: [
        ...question.options,
        { content: "", contentType: "text", isCorrect: false },
      ],
    });
  };

  const removeOption = (index) => {
    const updatedOptions = question.options.filter((_, i) => i !== index);
    updateQuestion(question.id, { options: updatedOptions });
  };

  return (
    <div className="p-4 bg-white shadow-md rounded mb-4">
      <button
        onClick={toggleQuestionType}
        className="mb-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Switch to {question.contentType === "text" ? "Image" : "Text"}
      </button>

      {question.contentType === "text" ? (
        <input
          className="w-full p-2 border"
          value={question.content}
          onChange={(e) =>
            updateQuestion(question.id, { content: e.target.value })
          }
        />
      ) : (
        <input
          type="file"
          onChange={(e) =>
            updateQuestion(question.id, { content: e.target.files[0] })
          }
        />
      )}

      <input
        className="w-full p-2 border mt-2"
        type="number"
        placeholder="Marks"
        value={question.marks}
        onChange={(e) => updateQuestion(question.id, { marks: e.target.value })}
      />

      {question.options.map((opt, index) => (
        <div key={index} className="flex items-center gap-2 mt-2">
          <input
            type={question.type === "MCQ" ? "radio" : "checkbox"}
            checked={opt.isCorrect}
            onChange={() => toggleCorrectAnswer(index)}
          />
          <input
            className="p-2 border w-full"
            value={opt.content}
            onChange={(e) => updateOption(index, e.target.value)}
          />
          <button onClick={() => removeOption(index)}>❌</button>
        </div>
      ))}

      <button
        onClick={addOption}
        className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
      >
        Add Option
      </button>
      <button
        onClick={() => removeQuestion(question.id)}
        className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
      >
        Remove Question
      </button>
    </div>
  );
};

export default QuestionForm;
