import { useEffect, useState } from "react";
import {
  deleteQuestion,
  fetchQuestionsByTestId,
} from "../services/questionService";

const QuestionList = ({ questions, setSelectedQuestion, refreshQuestions }) => {
  // const [questions, setQuestions] = useState([]);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  // console.log(questions);
  // useEffect(() => {
  //   const loadQuestions = async () => {
  //     const data = await fetchQuestionsByTestId(testId);
  //     setQuestions(data);
  //   };
  //   loadQuestions();
  // }, [testId]);
  // Function to delete a question

  const handleDelete = async (questionId) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await deleteQuestion(questionId);
        refreshQuestions();
      } catch (error) {
        console.error("Error deleting question:", error);
      }
    }
  };

  return (
    <div className="p-4 border-r">
      <h2 className="text-lg font-semibold mb-3">All Questions</h2>
      <div className="space-y-2">
        {questions.map((question) => (
          <div key={question.id} className="border rounded-lg p-2">
            {/* Question Header */}
            <div className="flex justify-between items-center cursor-pointer p-2 bg-gray-100 rounded">
              {/* Show text or image for the question */}
              {question.content_type === "text" ? (
                <span
                  className="font-semibold"
                  onClick={() =>
                    setExpandedQuestion(
                      expandedQuestion === question.id ? null : question.id
                    )
                  }
                >
                  {question.content}
                </span>
              ) : (
                <img
                  src={question.content} // Make sure this is the correct URL
                  alt="Question"
                  className="w-16 h-16 object-cover rounded"
                  onClick={() =>
                    setExpandedQuestion(
                      expandedQuestion === question.id ? null : question.id
                    )
                  }
                />
              )}

              <div className="flex space-x-2">
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => setSelectedQuestion(question)}
                >
                  ✏️
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(question.id)}
                >
                  🗑️
                </button>
              </div>
            </div>

            {/* Options (Expandable) */}
            {expandedQuestion === question.id && (
              <div className="mt-2 space-y-1">
                {question.type !== "fill_in_the_blank" ? (
                  question.options.map((option) => (
                    <div
                      key={option.id}
                      className={`p-2 rounded ${
                        option.correct_answer
                          ? "bg-green-100 text-green-700 font-semibold"
                          : ""
                      }`}
                    >
                      {/* Show text or image for the option */}
                      {option.content_type === "text" ? (
                        option.content
                      ) : (
                        <img
                          src={option.content} // Make sure this is the correct URL
                          alt="Option"
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-2 bg-green-100 text-green-700 font-semibold rounded">
                    Correct Answer: {question.fib_answer?.correctTextAnswer}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionList;
