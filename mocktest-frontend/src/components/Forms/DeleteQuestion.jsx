import { useState } from "react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { deleteQuestion } from "../../services/questionService";
import Swal from "sweetalert2"; // Import SweetAlert for alerts

const DeleteQuestion = ({ data, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    // Show confirmation alert before deletion
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      await deleteQuestion(data.id);

      // Show success alert
      Swal.fire({
        title: "Deleted!",
        text: "Question has been deleted.",
        icon: "success",
      });

      onClose();
    } catch (error) {
      // console.error("Error deleting question:", error);

      // Show error alert
      Swal.fire({
        title: "Error!",
        text: "Cannot delete the only question of a passage",
        icon: "error",
      });
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
