import { useState } from "react";

const OptionInput = ({
  index,
  option,
  updateOption,
  questionData,
  setQuestionData,
}) => {
  const [optionData, setOptionData] = useState(option);

  const handleOptionChange = (field, value) => {
    const newOption = { ...optionData, [field]: value };
    setOptionData(newOption);
    updateOption(index, newOption);
  };

  const handleCorrectOption = () => {
    if (questionData.type === "single_choice") {
      setQuestionData((prev) => ({ ...prev, correctAnswers: [index] }));
    } else {
      setQuestionData((prev) => {
        const newCorrectAnswers = prev.correctAnswers.includes(index)
          ? prev.correctAnswers.filter((i) => i !== index)
          : [...prev.correctAnswers, index];
        return { ...prev, correctAnswers: newCorrectAnswers };
      });
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      {questionData.type === "single_choice" ? (
        <input
          type="radio"
          name={`correct-${questionData.id}`}
          checked={questionData.correctAnswers.includes(index)}
          onChange={handleCorrectOption}
        />
      ) : (
        <input
          type="checkbox"
          checked={questionData.correctAnswers.includes(index)}
          onChange={handleCorrectOption}
        />
      )}

      <button
        onClick={() =>
          handleOptionChange(
            "type",
            optionData.type === "text" ? "image" : "text"
          )
        }
        className="px-2 py-1 bg-gray-300 rounded"
      >
        Toggle {optionData.type === "text" ? "Image" : "Text"}
      </button>

      {optionData.type === "text" ? (
        <input
          type="text"
          className="p-2 border rounded w-full"
          value={optionData.content}
          onChange={(e) => handleOptionChange("content", e.target.value)}
        />
      ) : (
        <input
          type="file"
          accept="image/*"
          className="w-full"
          onChange={(e) => handleOptionChange("content", e.target.files[0])}
        />
      )}
    </div>
  );
};

export default OptionInput;
