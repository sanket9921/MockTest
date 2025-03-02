import { useState } from "react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { deletePassage } from "../../services/passageService";

const DeletePassage = ({ data, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deletePassage(data.passage_id);
      onClose();
    } catch (error) {
      console.error("Error deleting passage:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DeleteConfirmationModal
      type="passage"
      content={data.content}
      onDelete={handleDelete}
      onClose={onClose}
    />
  );
};

export default DeletePassage;
