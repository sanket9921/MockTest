import Navbar from "../Header";
import QuestionCard from "./QuestionCard";
import SimilarTest from "./SimilarTest";

const QuestionList = ({ questions }) => {
  console.log(questions);
  return (
    <div className="row mt-5">
      <div className="col-md-8  bg-white custom-border">
        <h4>Answer Review: Check Your Responses and Explanations</h4>

        {questions.data.map((question, index) =>
          question.passage_id ? (
            <div key={question.passage_id} className="pb-4">
              {/* Display passage content as text or image */}
              {question.content_type === "image" ? (
                <img
                  src={question.content}
                  alt="Passage"
                  className="w-100 d-block mx-auto"
                  style={{ maxWidth: "400px" }}
                />
              ) : (
                <p
                  className="mt-2"
                  dangerouslySetInnerHTML={{ __html: question.content }}
                />
              )}

              {/* Render questions under the passage */}
              {question.questions.map((q) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  negative_marks={questions.test.negative}
                  className="test-white"
                />
              ))}
            </div>
          ) : (
            <QuestionCard
              key={question.id}
              question={question}
              negative_marks={questions.test.negative}
              className="test-white"
            />
          )
        )}
      </div>
      <div className="col-md-4">
        <SimilarTest groupId={questions.test.group_id} />
      </div>
    </div>
  );
};

export default QuestionList;
