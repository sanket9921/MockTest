import { useState } from "react";
import { getTestAttemptStats } from "../services/testService.";
import SubmitConfirmationModal from "./SubmitConfirmationModal";

const SubmitButton = ({ attemptId, onSubmit }) => {
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmitClick = async () => {
    setLoading(true);
    const data = await getTestAttemptStats(attemptId);
    setLoading(false);

    if (data) {
      setStats(data);
      setShowModal(true);
    }
  };

  const handleConfirmSubmit = () => {
    setShowModal(false);
    onSubmit(); // Call final submission function
  };

  return (
    <div>
      <button
        onClick={handleSubmitClick}
        className="bg-red-500 text-white px-6 py-2 rounded"
      >
        Submit Test
      </button>

      {loading && <p>Loading stats...</p>}

      {showModal && stats && (
        <SubmitConfirmationModal
          stats={stats}
          onConfirm={handleConfirmSubmit}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default SubmitButton;
