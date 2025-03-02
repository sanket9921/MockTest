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

const QuestionList = ({ questions }) => {
  const [modalData, setModalData] = useState(null);

  const handleAction = (action, item, type) => {
    setModalData({ action, item, type });
    console.log(type);
  };

  const closeModal = () => setModalData(null);

  return (
    <div className="max-w-3xl mx-auto">
      {questions.map((item, index) => (
        <div key={index} className="mb-4 border rounded-lg bg-white shadow">
          {item.passage_id ? (
            <PassageItem passage={item} onAction={handleAction} />
          ) : (
            <QuestionItem question={item} onAction={handleAction} />
          )}
        </div>
      ))}

      {/* 🔹 Action Modal */}
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
        </ActionModal>
      )}
    </div>
  );
};

export default QuestionList;
