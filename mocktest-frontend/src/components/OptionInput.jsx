import React, { useState } from "react";

const OptionInput = ({ options, setOptions }) => {
  const addOption = () => {
    setOptions([...options, { id: Date.now(), content: "", type: "text" }]);
  };

  const removeOption = (id) => {
    setOptions(options.filter((option) => option.id !== id));
  };

  const updateOption = (id, field, value) => {
    setOptions(
      options.map((opt) => (opt.id === id ? { ...opt, [field]: value } : opt))
    );
  };

  return (
    <div className="mt-4">
      {options.map((option, index) => (
        <div key={option.id} className="flex items-center gap-2 mb-2">
          <input
            type="radio"
            name="correctOption"
            onChange={() => updateOption(option.id, "isCorrect", true)}
          />

          <button
            onClick={() => updateOption(option.id, "type", "text")}
            className="px-2 py-1 border"
          >
            Text
          </button>
          <button
            onClick={() => updateOption(option.id, "type", "image")}
            className="px-2 py-1 border"
          >
            Image
          </button>

          {option.type === "text" ? (
            <input
              type="text"
              className="border p-2"
              placeholder={`Option ${index + 1}`}
              value={option.content}
              onChange={(e) =>
                updateOption(option.id, "content", e.target.value)
              }
            />
          ) : (
            <input
              type="file"
              accept="image/*"
              className="border p-2"
              onChange={(e) =>
                updateOption(option.id, "content", e.target.files[0])
              }
            />
          )}

          <button
            onClick={() => removeOption(option.id)}
            className="text-red-500 px-2"
          >
            X
          </button>
        </div>
      ))}

      <button onClick={addOption} className="bg-green-500 text-white px-4 py-2">
        + Add Option
      </button>
    </div>
  );
};

export default OptionInput;
