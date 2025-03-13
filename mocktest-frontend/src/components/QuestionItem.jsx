import { useState } from "react";
import MenuDropdown from "./MenuDropdown";
import OptionItem from "./OptionItem";

const QuestionItem = ({ question, onAction, parentAccordion, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const questionId = `questionCollapse${
    parentAccordion ? parentAccordion : "main"
  }-${index}`;
  const questionParent = parentAccordion
    ? `#${parentAccordion}`
    : "#questionAccordion";

  return (
    <div className="accordion-item">
      {/* Accordion Header (Custom) */}
      <h2 className="accordion-header">
        <div
          className="d-flex w-100 justify-content-between align-items-center p-3"
          data-bs-toggle="collapse"
          data-bs-target={`#${questionId}`}
          onClick={() => setIsOpen(!isOpen)}
          style={{ cursor: "pointer" }} // Cursor for better UX
        >
          {/* Question Content */}
          <span>
            {question.content_type === "image" ? (
              <img
                src={question.content}
                alt="Question"
                className="img-fluid"
                style={{ maxHeight: "50px" }}
              />
            ) : (
              <p
                className="mb-0"
                dangerouslySetInnerHTML={{ __html: question?.content }}
              />
            )}
          </span>

          {/* Float MenuDropdown to the Right */}
          <div className="ms-auto d-flex align-items-center">
            <MenuDropdown
              type={question.type === "fill_in_the_blank" ? "fill" : "question"}
              onAction={(action) => onAction(action, question)}
            />
          </div>
        </div>
      </h2>

      {/* Accordion Body */}
      <div
        id={questionId}
        className="accordion-collapse collapse"
        data-bs-parent={questionParent}
      >
        <div className="accordion-body">
          {question.type === "fill_in_the_blank" ? (
            <div className="text-muted">
              {question.fib_answer.correctTextAnswer}
            </div>
          ) : (
            question.options.map((option, idx) => (
              <div key={idx} className="mb-2">
                <OptionItem option={option} onAction={onAction} />
              </div>
            ))
          )}
          <h6 className="mt-3">Explanation:</h6>
          <p
            className="mb-0"
            dangerouslySetInnerHTML={{ __html: question.explanation }}
          />
          {/* <p>{question.explanation}</p> */}
        </div>
      </div>
    </div>
  );
};

export default QuestionItem;
