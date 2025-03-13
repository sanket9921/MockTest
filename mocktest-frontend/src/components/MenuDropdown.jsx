import { useState, useRef, useEffect } from "react";

const MenuDropdown = ({ type, onAction }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const menuItems = {
    question: [
      { label: "Add Option", action: "addOption" },
      { label: "Update Question", action: "updateQuestion" },
      { label: "Update Answers", action: "updateAnswers" },
      { label: "Update Explanation", action: "updateExplanation" },
      { label: "Delete Question", action: "deleteQuestion", danger: true },
    ],
    option: [
      { label: "Update Option", action: "updateOption" },
      { label: "Delete Option", action: "deleteOption", danger: true },
    ],
    passage: [
      { label: "Add Question (MCQ)", action: "addQuestionMCQ" },
      { label: "Add Question (MSQ)", action: "addQuestionMSQ" },
      { label: "Update Passage", action: "updatePassage" },
      { label: "Delete Passage", action: "deletePassage", danger: true },
    ],
    fill: [
      { label: "Update Question", action: "updateQuestion" },

      { label: "Update Text Answers", action: "updateTextAnswers" },
      { label: "Update Explanation", action: "updateExplanation" },

      { label: "Delete Question", action: "deleteQuestion", danger: true },
    ],
  };

  return (
    <div className="dropdown" ref={dropdownRef}>
      {/* Three-dot dropdown button */}
      <button
        className="btn btn-white border-0"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        ⋮
      </button>

      {/* Dropdown menu */}
      {open && (
        <ul className="dropdown-menu show position-absolute end-0 mt-2 shadow-sm">
          {menuItems[type]?.map((item, index) => (
            <li key={index}>
              <button
                className={`dropdown-item ${item.danger ? "text-danger" : ""}`}
                onClick={() => {
                  setOpen(false);
                  onAction(item.action);
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MenuDropdown;
