import { useEffect, useState } from "react";
import MCQForm from "./MCQMSQ/MCQForm";
import MSQForm from "./MCQMSQ/MSQForm";
import FillBlankForm from "./FillBlankForm";
import PassageForm from "./Passage/PassageForm";
import TabNavigation from "./TabNavigation";

const QuestionManager = ({
  testId,
  selectedQuestion,
  setSelectedQuestion,
  refreshQuestions,
}) => {
  const [activeTab, setActiveTab] = useState("mcq");
  useEffect(() => {
    if (selectedQuestion) {
      setActiveTab(
        selectedQuestion.type === "single_choice"
          ? "mcq"
          : selectedQuestion.type === "multiple_choice"
          ? "msq"
          : "fill"
      );
    }
  }, [selectedQuestion]);
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="mt-6">
        {activeTab === "mcq" && (
          <MCQForm
            testId={testId}
            selectedQuestion={selectedQuestion}
            setSelectedQuestion={setSelectedQuestion}
            refreshQuestions={refreshQuestions}
          />
        )}
        {activeTab === "msq" && (
          <MSQForm
            testId={testId}
            selectedQuestion={selectedQuestion}
            setSelectedQuestion={setSelectedQuestion}
            refreshQuestions={refreshQuestions}
          />
        )}
        {activeTab === "fill" && (
          <FillBlankForm
            testId={testId}
            selectedQuestion={selectedQuestion}
            setSelectedQuestion={setSelectedQuestion}
            refreshQuestions={refreshQuestions}
          />
        )}
        {activeTab === "passage" && (
          <PassageForm
            testId={testId}
            selectedQuestion={selectedQuestion}
            setSelectedQuestion={setSelectedQuestion}
            refreshQuestions={refreshQuestions}
          />
        )}
      </div>
    </div>
  );
};

export default QuestionManager;
