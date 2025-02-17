import { useState } from "react";
import TabNavigation from "./TabNavigation";
import MCQForm from "./MCQForm";
import MSQForm from "./MSQForm";
import FillBlankForm from "./FillBlankForm";

const QuestionForm = ({ testId }) => {
  const [activeTab, setActiveTab] = useState("mcq");

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="mt-6">
        {activeTab === "mcq" && <MCQForm testId={testId} />}
        {activeTab === "msq" && <MSQForm testId={testId} />}
        {activeTab === "fill" && <FillBlankForm testId={testId} />}
      </div>
    </div>
  );
};

export default QuestionForm;
