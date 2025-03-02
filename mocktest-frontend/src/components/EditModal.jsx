import AddOptionForm from "./Forms/AddOptionForm";
import UpdateAnswerForm from "./Forms/UpdateAnswerForm";
import UpdatePassageForm from "./Forms/UpdatePassageForm";
import UpdateQuestionForm from "./Forms/UpdateQuestionForm";

const EditModal = ({ isOpen, action, item, onClose, onSave }) => {
  if (!isOpen) return null;

  const renderForm = () => {
    switch (action) {
      case "updateQuestion":
        return <UpdateQuestionForm item={item} onSave={onSave} />;
      case "updateAnswer":
        return <UpdateAnswerForm item={item} onSave={onSave} />;
      case "addOption":
        return <AddOptionForm item={item} onSave={onSave} />;
      case "updatePassage":
        return <UpdatePassageForm item={item} onSave={onSave} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-3">Edit {action}</h2>
        {renderForm()}
        <div className="flex justify-end gap-2 mt-3">
          <button onClick={onClose} className="px-3 py-1 border rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
