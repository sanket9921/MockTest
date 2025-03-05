import OptionList from "./OptionList";

const PassageView = ({ passageData, userAnswer, onSaveAnswer }) => {
  return (
    <div className="flex w-full">
      <div className="w-1/3 p-4 border-r">
        <h3 className="text-lg font-bold">Passage:</h3>
        {passageData.content_type === "text" ? (
          <p>{passageData.content}</p>
        ) : (
          <img src={passageData.content} alt="Passage" />
        )}
      </div>

      <div className="w-2/3 p-4">
        {passageData.questions.map((q, index) => (
          <div key={q.id} className="mb-6">
            <h2 className="text-xl font-bold">
              {index + 1}. {q.content}
            </h2>
            <OptionList
              questionData={q}
              userAnswer={userAnswer}
              onSaveAnswer={onSaveAnswer}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PassageView;
