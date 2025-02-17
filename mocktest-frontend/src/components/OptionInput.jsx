const OptionInput = ({
  index,
  option,
  options,
  setOptions,
  isCorrect,
  setCorrectAnswer,
  type,
}) => {
  const updateOption = (content) => {
    const newOptions = [...options];
    newOptions[index].content = content;
    setOptions(newOptions);
  };

  return (
    <div className="flex items-center space-x-2">
      <input type={type} checked={isCorrect} onChange={setCorrectAnswer} />
      <input
        type="text"
        value={option.content}
        placeholder="Option"
        className="p-2 border"
        onChange={(e) => updateOption(e.target.value)}
      />
      <button
        onClick={() => setOptions(options.filter((_, i) => i !== index))}
        className="text-red-500"
      >
        X
      </button>
    </div>
  );
};

export default OptionInput;
