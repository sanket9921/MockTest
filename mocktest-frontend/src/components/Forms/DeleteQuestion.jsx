import { useState } from "react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { deleteQuestion } from "../../services/questionService";

const DeleteQuestion = ({ data, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);

      const response = await deleteQuestion(data.id);

      onClose();
    } catch (error) {
      console.error("Error deleting question:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DeleteConfirmationModal
      type="question"
      content={data.content}
      onDelete={handleDelete}
      onClose={onClose}
    />
  );
};

export default DeleteQuestion;
