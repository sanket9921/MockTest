import MenuDropdown from "./MenuDropdown";
import QuestionItem from "./QuestionItem";

const PassageItem = ({ passage, onAction }) => {
  const passageId = `passageCollapse${passage.id}`;

  return (
    <div className="accordion-item">
      {/* Custom Accordion Header */}
      <h2 className="accordion-header">
        <div
          className="d-flex w-100 justify-content-between align-items-center p-3"
          data-bs-toggle="collapse"
          data-bs-target={`#${passageId}`}
          style={{ cursor: "pointer" }} // Cursor for better UX
        >
          {/* Passage Content */}
          <span>
            {passage.content_type === "image" ? (
              <img src={passage.content} alt="Passage" className="img-fluid" />
            ) : (
              passage.content
            )}
          </span>

          {/* Float MenuDropdown to the Right */}
          <div className="ms-auto">
            <MenuDropdown
              type="passage"
              onAction={(action) => onAction(action, passage)}
            />
          </div>
        </div>
      </h2>

      <div id={passageId} className="accordion-collapse collapse">
        <div className="accordion-body accordion" id={passageId + "-questions"}>
          {passage.questions.map((question, index) => (
            <QuestionItem
              key={index}
              question={question}
              onAction={onAction}
              parentAccordion={passageId + "-questions"}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PassageItem;
