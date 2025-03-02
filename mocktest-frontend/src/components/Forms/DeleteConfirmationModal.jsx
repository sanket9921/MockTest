import React from "react";

const DeleteConfirmationModal = ({ type, content, onDelete, onClose }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800">
        Are you sure you want to delete this {type}?
      </h2>

      <p className="text-sm text-gray-500 mt-2">
        This action cannot be undone.
      </p>

      <div className="mt-4">
        {content?.startsWith("http") ? (
          <img
            src={content}
            alt="Item to delete"
            className="w-full h-32 object-contain rounded-md border border-gray-300"
          />
        ) : (
          <p className="text-lg font-medium text-gray-700 bg-gray-100 p-2 rounded-md">
            {content}
          </p>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
