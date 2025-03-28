import { useState } from "react";
import QuestionInput from "../QuestionInput";
import OptionInput from "./OptionInput";
import RichTextEditor from "../../common/RichTextEditor";

const QuestionForm = ({
  type,
  question,
  setQuestion,
  options,
  setOptions,
  correctAnswers,
  setCorrectAnswers,
  errors,
}) => {
  const handleExplanationChange = (value) => {
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      explanation: value,
    }));
  };

  return (
    <div>
      <div className="row g-3">
        {/* Question Input */}
        <div className="col-12">
          <QuestionInput question={question} setQuestion={setQuestion} />
          {errors.question && <p className="text-danger">{errors.question}</p>}
        </div>

        {/* Options List */}
        {options.map((option, index) => (
          <div key={index} className="col-12">
            <OptionInput
              index={index}
              option={option}
              options={options}
              setOptions={setOptions}
              correctAnswers={correctAnswers}
              setCorrectAnswers={setCorrectAnswers}
              type={type}
            />
            {errors[`option${index}`] && (
              <p className="text-danger">{errors[`option${index}`]}</p>
            )}
          </div>
        ))}

        {/* Add Option Button */}
        <div className="col-12">
          <button
            onClick={() =>
              setOptions([
                ...options,
                { content: "", content_type: "text", file: null },
              ])
            }
            className="btn btn-success"
          >
            + Add Option
          </button>
        </div>

        {/* Explanation Input */}
        <div className="col-12">
          <label className="form-label fw-bold">Explanation</label>
          <RichTextEditor
            value={question.explanation}
            onChange={handleExplanationChange}
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionForm;
