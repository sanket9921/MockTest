import Navbar from "../Header";
import QuestionCard from "./QuestionCard";

const QuestionList = ({ questions }) => {
  return (
    <>
      <div className="space-y-6">
        {questions.map((question, index) =>
          question.passage_id ? (
            <div key={question.passage_id} className="border-b pb-4">
              <p className="tmb-2">{question.content}</p>
              {question.questions.map((q) => (
                <QuestionCard key={q.id} question={q} />
              ))}
            </div>
          ) : (
            <QuestionCard key={question.id} question={question} />
          )
        )}
      </div>
    </>
  );
};

export default QuestionList;
