import { updateQuestion } from "../../services/questionService";
import UpdateContentForm from "./UpdateContentForm";

const UpdateQuestionForm = ({ data, onClose }) => {
  console.log(data);
  const handleSubmit = async (formData) => {
    await updateQuestion(data.id, formData);
    onClose(); // Close the popup after updating
  };

  return (
    <UpdateContentForm
      initialData={data}
      type="question"
      onSubmit={handleSubmit}
    />
  );
};

export default UpdateQuestionForm;
