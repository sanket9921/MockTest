import React, { useState, useEffect } from "react";
import { updateAnswerOfFib } from "../../services/answersService";

const UpdateFibAnswerForm = ({ data, onClose }) => {
  const [correctTextAnswer, setCorrectTextAnswer] = useState("");

  // Prefill form data when `data` changes
  useEffect(() => {
    if (data?.fib_answer) {
      setCorrectTextAnswer(data.fib_answer.correctTextAnswer || "");
    }
  }, [data]);

  // Handle input change
  const handleChange = (e) => {
    setCorrectTextAnswer(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    await updateAnswerOfFib(data.id, correctTextAnswer);
    onClose(); // Close the form after successful update
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="correctTextAnswer" className="form-label">
          Correct Answer
        </label>
        <input
          type="text"
          className="form-control"
          id="correctTextAnswer"
          name="correctTextAnswer"
          value={correctTextAnswer}
          onChange={handleChange}
          required
        />
      </div>

      <div className="d-flex justify-content-end">
        <button
          type="button"
          className="btn btn-secondary me-2"
          onClick={onClose}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Update Answer
        </button>
      </div>
    </form>
  );
};

export default UpdateFibAnswerForm;
