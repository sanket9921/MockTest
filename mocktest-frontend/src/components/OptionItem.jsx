import MenuDropdown from "./MenuDropdown";

const OptionItem = ({ option, onAction }) => {
  return (
    <div
      className={`d-flex justify-content-between align-items-center border p-2 rounded ${
        option.correct_answer ? "bg-success bg-opacity-25" : ""
      }`}
    >
      <span>
        {option.content_type === "image" ? (
          <img
            src={option.content}
            alt="Option"
            className="img-thumbnail"
            style={{ width: "250px", height: "250px" }}
          />
        ) : (
          <p
            className="mb-0"
            dangerouslySetInnerHTML={{ __html: option.content }}
          />
        )}
      </span>
      <MenuDropdown
        type="option"
        onAction={(action) => onAction(action, option)}
      />
    </div>
  );
};

export default OptionItem;
