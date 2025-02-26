import MenuDropdown from "./MenuDropdown";

const OptionItem = ({ option, onAction }) => {
  return (
    <div
      className={`p-2 border rounded flex justify-between items-center ${
        option.correct_answer ? "bg-green-200" : ""
      }`}
    >
      <span>
        {option.content_type === "image" ? (
          <img src={option.content} alt="Option" className="w-24 h-24" />
        ) : (
          option.content
        )}
      </span>
      <MenuDropdown type="option" onAction={onAction} />
    </div>
  );
};

export default OptionItem;
