import PassageItem from "./PassageItem";
import QuestionItem from "./QuestionItem";

const QuestionList = ({ questions }) => {
  // console.log(questions);
  return (
    <div className="max-w-3xl mx-auto">
      {questions.map((item, index) => (
        <div key={index} className="mb-4 border rounded-lg bg-white shadow">
          {item.passage_id ? (
            <PassageItem
              passage={item}
              onAction={(action) => console.log(action, item)}
            />
          ) : (
            <QuestionItem
              question={item}
              onAction={(action) => console.log(action, item)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default QuestionList;
