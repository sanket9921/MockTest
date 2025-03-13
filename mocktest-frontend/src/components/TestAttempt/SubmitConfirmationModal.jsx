import React from "react";

const SubmitConfirmationModal = ({ stats, onConfirm, onCancel }) => {
  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex z-10 align-items-center justify-content-center bg-dark bg-opacity-50">
      <div
        className="bg-white p-4 rounded shadow-lg"
        style={{ width: "800px", maxWidth: "100%" }}
      >
        <h2 className="fs-5 fw-bold mb-3">Confirm Submission</h2>
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
          <strong>Warning:</strong> Once you submit the test, you will not be
          able to change your answers.
        </div>

        <div className="d-flex justify-content-end mt-3">
          <button className="btn btn-secondary me-2" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={onConfirm}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitConfirmationModal;
