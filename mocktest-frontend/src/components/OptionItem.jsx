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
            style={{ width: "80px", height: "80px" }}
          />
        ) : (
          <span>{option.content}</span>
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
