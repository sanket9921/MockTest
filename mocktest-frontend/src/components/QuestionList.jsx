import { useEffect, useState } from "react";
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
import image from "..//assets/image.png";
import UpdateExplanationForm from "./Forms/UpdateExplanationForm";
import UpdateFibAnswerForm from "./Forms/UpdateFibAnswerForm";

const QuestionList = ({ test, questions, refreshQuestions }) => {
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
      <div className="col-12 col-md-9 d-flex flex-row align-items-center gap-2">
        <img
          src={image}
          width={40}
          height={40}
          alt="img"
          className="rounded-circle border"
        />
        <div className="mt-3">
          <h4>{test?.name}</h4>
          <div className="d-flex flex-wrap gap-2">
            <span>
              <i className="bi bi-clock"></i>{" "}
              {test?.duration ? test?.duration + " min" : "No Limit"}
            </span>
            <span>
              <i className="bi bi-card-list"></i> {test?.question_count}{" "}
              Questions
            </span>
            <span>
              <i className="bi bi-bar-chart"></i> Difficulty{" : "}
              {test?.difficulty}
            </span>
            <span className=" m-0">
              <i className="bi bi-x-circle"></i> Negative{" : "}
              {test?.negative}{" "}
            </span>
            <span className=" m-0">
              <i className="bi bi-clipboard-check"></i> Marks{" : "}
              {test?.totalMarks}{" "}
            </span>
          </div>
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
            <UpdateExplanationForm data={modalData.item} onClose={closeModal} />
          )}
          {modalData.action === "updateTextAnswers" && (
            <UpdateFibAnswerForm data={modalData.item} onClose={closeModal} />
          )}
        </ActionModal>
      )}
    </div>
  );
};

export default QuestionList;
