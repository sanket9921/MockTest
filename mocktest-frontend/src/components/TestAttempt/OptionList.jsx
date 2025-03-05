const OptionList = ({ questionData, userAnswer, onSaveAnswer }) => {
  const handleChange = (e) => {
    onSaveAnswer(questionData.id, e.target.value);
  };

  return (
    <div>
      {questionData.type === "mcq" && (
        <div>
          {questionData.options.map((option) => (
            <label key={option.id} className="flex items-center gap-2">
              <input
                type="radio"
                name={`question-${questionData.id}`}
                value={option.id}
                checked={userAnswer === option.id}
                onChange={handleChange}
              />
              {option.content_type === "text" ? (
                option.content
              ) : (
                <img src={option.content} alt="option" />
              )}
            </label>
          ))}
        </div>
      )}

      {questionData.type === "msq" && (
        <div>
          {questionData.options.map((option) => (
            <label key={option.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={option.id}
                checked={
                  Array.isArray(userAnswer) && userAnswer.includes(option.id)
                }
                onChange={(e) => {
                  const updatedAnswers = e.target.checked
                    ? [...(userAnswer || []), option.id]
                    : (userAnswer || []).filter((id) => id !== option.id);
                  onSaveAnswer(questionData.id, updatedAnswers);
                }}
              />
              {option.content_type === "text" ? (
                option.content
              ) : (
                <img src={option.content} alt="option" />
              )}
            </label>
          ))}
        </div>
      )}

      {questionData.type === "fib" && (
        <input
          type="text"
          value={userAnswer || ""}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      )}
    </div>
  );
};

export default OptionList;
