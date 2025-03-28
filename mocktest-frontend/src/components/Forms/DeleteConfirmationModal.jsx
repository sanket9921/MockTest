import React from "react";

const DeleteConfirmationModal = ({ type, content, onDelete, onClose }) => {
  return (
    <div className="p-3 bg-white rounded shadow">
      <h5 className="fw-bold text-danger">Confirm Deletion</h5>
      <p className="text-muted">Are you sure you want to delete this {type}?</p>
      <p className="text-danger small">This action cannot be undone.</p>

      <div className="mt-3">
        {content?.startsWith("http") ? (
          <img
            src={content}
            alt="Item to delete"
            className="img-fluid border rounded shadow-sm"
          />
        ) : (
          <p
            className="p-2 border rounded bg-light"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>

      <div className="mt-4 d-flex justify-content-end gap-2">
        <button className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button className="btn btn-danger" onClick={onDelete}>
          <i className="bi bi-trash"></i> Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
