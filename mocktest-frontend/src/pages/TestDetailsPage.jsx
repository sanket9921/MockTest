import React, { useState } from "react";
import QuestionTabs from "../components/QuestionTabs";
import AddQuestionForm from "../components/AddQuestionForm";

const TestDetailsPage = ({ testId }) => {
  const [selectedType, setSelectedType] = useState("MCQ");

  return (
    <div>
      <h2 className="text-2xl font-bold">Manage Test Questions</h2>
      <QuestionTabs
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />
      <AddQuestionForm testId={testId} />
    </div>
  );
};

export default TestDetailsPage;
