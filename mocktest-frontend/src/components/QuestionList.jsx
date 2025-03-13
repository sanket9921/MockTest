import { useState } from "react";
import PassageItem from "./PassageItem";
import QuestionItem from "./QuestionItem";
import ActionModal from "./ActionModal";
import AddOptionForm from "./Forms/AddOptionForm";
import UpdateQuestionForm from "./Forms/UpdateQuestionForm";
import UpdateAnswerForm from "./Forms/UpdateAnswerForm";
import UpdatePassageForm from "./Forms/UpdatePassageForm";
import DeleteQuestion from "./Forms/DeleteQuestion";
import DeleteOption from "./Forms/DeleteOption";
import DeletePassage from "./Forms/DeletePassage";
import UpdateOptionForm from "./Forms/UpdateOptionForm";
import MCQForm from "./Forms/MCQMSQ/MCQForm";
import MSQForm from "./Forms/MCQMSQ/MSQForm";
import updateExplanationForm from "./Forms/updateExplanationForm";

const QuestionList = ({ questions, refreshQuestions }) => {
  const [modalData, setModalData] = useState(null);

  const handleAction = (action, item, type) => {
    setModalData({ action, item, type });
  };

  const closeModal = () => {
    refreshQuestions();
    setModalData(null);
  };

  return (
    <div className="container-fluid vh-100 overflow-auto">
      {/* Summary Section */}
      <div className="d-flex justify-content-between p-3 bg-light border-bottom">
        <div>
          <strong>Total Marks:</strong> {questions.length * 1}
        </div>
        <div>
          <strong>Total Questions:</strong> {questions.length}
        </div>
      </div>

      {/* Main Accordion for Questions & Passages */}
      <div className="accordion mt-3" id="questionAccordion">
        {questions.map((item, index) => (
          <div key={index}>
            {item.passage_id ? (
              <PassageItem
                passage={item}
                onAction={handleAction}
                index={index}
              />
            ) : (
              <QuestionItem
                question={item}
                onAction={handleAction}
                index={index}
              />
            )}
          </div>
        ))}
      </div>

      {/* Action Modal */}
      {modalData && (
        <ActionModal data={modalData} onClose={closeModal}>
          {modalData.action === "addOption" && (
            <AddOptionForm data={modalData.item} onClose={closeModal} />
          )}
          {modalData.action === "updateQuestion" && (
            <UpdateQuestionForm data={modalData.item} onClose={closeModal} />
          )}
          {modalData.action === "updatePassage" && (
            <UpdatePassageForm data={modalData.item} onClose={closeModal} />
          )}
          {modalData.action === "updateAnswers" && (
            <UpdateAnswerForm data={modalData.item} onClose={closeModal} />
          )}
          {modalData.action === "updateOption" && (
            <UpdateOptionForm data={modalData.item} onClose={closeModal} />
          )}
          {modalData.action === "deleteQuestion" && (
            <DeleteQuestion data={modalData.item} onClose={closeModal} />
          )}
          {modalData.action === "deleteOption" && (
            <DeleteOption data={modalData.item} onClose={closeModal} />
          )}

          {modalData.action === "deletePassage" && (
            <DeletePassage data={modalData.item} onClose={closeModal} />
          )}

          {modalData.action === "addQuestionMCQ" && (
            <MCQForm data={modalData.item} onClose={closeModal} />
          )}

          {modalData.action === "addQuestionMSQ" && (
            <MSQForm data={modalData.item} onClose={closeModal} />
          )}
          {modalData.action === "updateExplanation" && (
            <updateExplanationForm data={modalData.item} onClose={closeModal} />
          )}
        </ActionModal>
      )}
    </div>
  );
};

export default QuestionList;
