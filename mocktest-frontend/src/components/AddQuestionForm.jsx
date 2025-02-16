import React, { useState } from "react";
import QuestionInput from "./QuestionInput";
import OptionInput from "./OptionInput";
import { createQuestion } from "../services/testService.";

const AddQuestionForm = ({ testId }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedType, setSelectedType] = useState("MCQ");

  const handleSubmit = async () => {
    const payload = { testId, question, options, type: selectedType };
    await createQuestion(payload);
    alert("Question added successfully!");
  };

  return (
    <div>
      <QuestionInput question={question} setQuestion={setQuestion} />
      <OptionInput options={options} setOptions={setOptions} />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 mt-4"
      >
        Save Question
      </button>
    </div>
  );
};

export default AddQuestionForm;
