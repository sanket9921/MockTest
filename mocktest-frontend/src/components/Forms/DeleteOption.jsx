import { useState } from "react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { deleteOption } from "../../services/optionService";

const DeleteOption = ({ data, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);

      await deleteOption(data.id);
      onClose();
    } catch (error) {
      console.error("Error deleting option:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DeleteConfirmationModal
      type="option"
      content={data.content}
      onDelete={handleDelete}
      onClose={onClose}
    />
  );
};

export default DeleteOption;
