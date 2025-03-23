import { useState } from "react";
import QuestionForm from "./QuestionForm";
import { submitQuestion } from "../../../services/questionService";

const MSQForm = ({ data, testId }) => {
  const defaultQuestion = {
    content: "",
    content_type: "text",
    marks: 1,
    explanation: "",
    file: null,
  };

  const defaultOptions = [
    { content: "", content_type: "text", file: null },
    { content: "", content_type: "text", file: null },
  ];

  const [question, setQuestion] = useState(defaultQuestion);
  const [options, setOptions] = useState(defaultOptions);
  const [correctAnswers, setCorrectAnswers] = useState([]);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("test_id", testId ? testId : data.questions[0].test_id);
    formData.append("passage_id", data?.passage_id ? data.passage_id : "");
    formData.append("question_type", "multiple_choice");

    formData.append("marks", question.marks);
    formData.append("explanation", question.explanation);

    if (question.content_type === "text") {
      formData.append("content", question.content);
      formData.append("content_type", "text");
    } else if (question.content_type === "image" && question.file) {
      formData.append("questionImage", question.file);
      formData.append("content_type", "image");
    }

    options.forEach((option, index) => {
      if (option.content_type === "text") {
        formData.append(`options[${index}][content]`, option.content);
        formData.append(`options[${index}][content_type]`, "text");
      } else if (option.content_type === "image" && option.file) {
        formData.append(`options[${index}][content]`, "");
        formData.append(`options[${index}][content_type]`, "image");
        formData.append(`optionImages[${index}]`, option.file);
      }
    });

    formData.append("correct_answers", JSON.stringify(correctAnswers));

    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    await submitQuestion(formData);
  };

  return (
    <>
      {/* MCQ Form Example */}
      <QuestionForm
        type={"checkbox"}
        question={question}
        setQuestion={setQuestion}
        options={options}
        setOptions={setOptions}
        correctAnswers={correctAnswers}
        setCorrectAnswers={setCorrectAnswers}
      />

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="mt-4 btn btn-primary text-white px-4 py-2 rounded"
      >
        Save Question
      </button>
    </>
  );
};

export default MSQForm;
