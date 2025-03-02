import React, { useState } from "react";
import OptionInput from "./OptionInput";

const QuestionInput = ({ question, updateQuestion, removeQuestion }) => {
  const toggleType = () => {
    updateQuestion(question.id, {
      ...question,
      contentType: question.contentType === "text" ? "image" : "text",
      content: "",
      file: null,
    });
  };

  const addOption = () => {
    const newOption = {
      id: Date.now(),
      content: "",
      contentType: "text",
      file: null,
    };
    updateQuestion(question.id, {
      ...question,
      options: [...question.options, newOption],
    });
  };

  const updateOption = (optionId, updatedOption) => {
    updateQuestion(question.id, {
      ...question,
      options: question.options.map((opt) =>
        opt.id === optionId ? updatedOption : opt
      ),
    });
  };

  const toggleCorrectAnswer = (optionId) => {
    updateQuestion(question.id, {
      ...question,
      correctAnswers:
        question.type === "mcq"
          ? [optionId]
          : question.correctAnswers.includes(optionId)
          ? question.correctAnswers.filter((id) => id !== optionId)
          : [...question.correctAnswers, optionId],
    });
  };

  return (
    <div className="border p-4 rounded-md space-y-2">
      <div>
        <label className="block font-semibold">Question</label>
        {question.contentType === "text" ? (
          <input
            className="w-full p-2 border rounded"
            value={question.content}
            onChange={(e) =>
              updateQuestion(question.id, {
                ...question,
                content: e.target.value,
              })
            }
          />
        ) : (
          <input
            type="file"
            className="w-full p-2 border rounded"
            accept="image/*"
            onChange={(e) =>
              updateQuestion(question.id, {
                ...question,
                file: e.target.files[0],
              })
            }
          />
        )}
        <button
          className="mt-2 p-2 bg-gray-500 text-white rounded"
          onClick={toggleType}
        >
          Switch to {question.contentType === "text" ? "Image" : "Text"}
        </button>
      </div>

      <div>
        <label className="block font-semibold">Options</label>
        {question.options.map((opt) => (
          <OptionInput
            key={opt.id}
            option={opt}
            questionType={question.type}
            updateOption={updateOption}
            toggleCorrectAnswer={toggleCorrectAnswer}
          />
        ))}
      </div>

      <button
        className="p-2 bg-blue-500 text-white rounded"
        onClick={addOption}
      >
        Add Option
      </button>
      <button
        className="mt-2 p-2 bg-red-500 text-white rounded"
        onClick={() => removeQuestion(question.id)}
      >
        Remove Question
      </button>
    </div>
  );
};

export default QuestionInput;
