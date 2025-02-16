import React, { useState } from "react";

const QuestionTabs = ({ selectedType, setSelectedType }) => {
  const tabs = ["MCQ", "MSQ", "Fill in the Blank"];

  return (
    <div className="flex border-b">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`px-4 py-2 ${
            selectedType === tab ? "border-b-2 border-blue-500 font-bold" : ""
          }`}
          onClick={() => setSelectedType(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default QuestionTabs;
