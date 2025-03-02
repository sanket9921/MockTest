import { updatePassage } from "../../services/passageService";
import UpdateContentForm from "./UpdateContentForm";

const UpdatePassageForm = ({ data, onClose }) => {
  console.log(data);
  const handleSubmit = async (formData) => {
    await updatePassage(data.passage_id, formData);
    onClose(); // Close the popup after updating
  };

  return (
    <UpdateContentForm
      initialData={data}
      type="passage"
      onSubmit={handleSubmit}
    />
  );
};

export default UpdatePassageForm;
