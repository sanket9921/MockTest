import { useState } from "react";
import SubmitConfirmationModal from "./SubmitConfirmationModal";
import { getTestAttemptStats } from "../../services/testAttemptService";
import ActionModal from "../ActionModal";

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
      <button onClick={handleSubmitClick} className="btn btn-danger">
        Submit Test
      </button>

      {loading && <p>Loading stats...</p>}

      {showModal && stats && (
        <ActionModal
          data={{ action: "Confirm Submission" }}
          onClose={() => setShowModal(false)}
        >
          <div>
            <p>
              Total Questions:{" "}
              <span className="fw-semibold">{stats.totalQuestions}</span>
            </p>
            <p>
              Attempted:{" "}
              <span className="fw-semibold">{stats.attemptedQuestions}</span>
            </p>
            <p>
              Marked for Review:{" "}
              <span className="fw-semibold">{stats.markedForReview}</span>
            </p>
            <p>
              Unanswered:{" "}
              <span className="fw-semibold">{stats.unansweredQuestions}</span>
            </p>
            <div className="alert alert-warning text-center my-3">
              <strong>Warning:</strong> Once you submit the test, you will not
              be able to change your answers.
            </div>

            <div className="d-flex justify-content-end mt-3">
              <button
                className="btn btn-secondary me-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleConfirmSubmit}>
                Submit
              </button>
            </div>
          </div>
        </ActionModal>
      )}
    </div>
  );
};

export default SubmitButton;
