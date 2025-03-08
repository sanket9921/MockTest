import { useState } from "react";

const MenuDropdown = ({ type, onAction }) => {
  const [open, setOpen] = useState(false);

  const menuItems = {
    question: [
      { label: "Add Option", action: "addOption" },
      { label: "Update Question", action: "updateQuestion" },
      { label: "Update Answers", action: "updateAnswers" },
      { label: "Delete Question", action: "deleteQuestion", danger: true },
    ],
    option: [
      { label: "Update Option", action: "updateOption" },
      { label: "Delete Option", action: "deleteOption", danger: true },
    ],
    passage: [
      { label: "Add Question (mcq)", action: "addQuestionMCQ" },
      { label: "Add Question (msq)", action: "addQuestionMSQ" },

      { label: "Update Passage", action: "updatePassage" },
      { label: "Delete Passage", action: "deletePassage", danger: true },
    ],
    fill: [
      { label: "Update Text Answers", action: "updateTextAnswers" },

      { label: "Delete Question", action: "deleteQuestion", danger: true },
    ],
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full hover:bg-gray-200"
      >
        ⋮
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border rounded">
          {menuItems[type].map((item, index) => (
            <button
              key={index}
              className={`block w-full text-left px-4 py-2 hover:bg-gray-200 ${
                item.danger ? "text-red-500" : ""
              }`}
              onClick={() => {
                setOpen(false);
                onAction(item.action);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuDropdown;
