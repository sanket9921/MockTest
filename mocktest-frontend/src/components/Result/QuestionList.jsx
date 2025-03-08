import QuestionCard from "./QuestionCard";

const QuestionList = ({ questions }) => {
  return (
    <div className="space-y-6">
      {questions.map((question, index) =>
        question.passage_id ? (
          <div key={question.passage_id} className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-2">{question.content}</h3>
            {question.questions.map((q) => (
              <QuestionCard key={q.id} question={q} />
            ))}
          </div>
        ) : (
          <QuestionCard key={question.id} question={question} />
        )
      )}
    </div>
  );
};

export default QuestionList;
