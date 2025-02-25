const SubmitConfirmationModal = ({ stats, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)] backdrop-blur-md">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Confirm Submission</h2>
        <p>
          Total Questions:{" "}
          <span className="font-semibold">{stats.totalQuestions}</span>
        </p>
        <p>
          Attempted:{" "}
          <span className="font-semibold">{stats.attemptedQuestions}</span>
        </p>
        <p>
          Marked for Review:{" "}
          <span className="font-semibold">{stats.markedForReview}</span>
        </p>
        <p>
          Unanswered:{" "}
          <span className="font-semibold">{stats.unansweredQuestions}</span>
        </p>

        <div className="flex justify-end mt-4">
          <button
            className="bg-gray-300 px-4 py-2 rounded mr-2"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={onConfirm}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitConfirmationModal;
