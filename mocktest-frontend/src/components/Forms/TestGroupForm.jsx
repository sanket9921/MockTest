import { useState, useEffect } from "react";
import ActionModal from "../ActionModal";

const TestGroupForm = ({ show, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ id: null, name: "", description: "" });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!formData.name.trim())
      validationErrors.name = "Category name is required.";
    if (!formData.description.trim())
      validationErrors.description = "Description is required.";
    else if (formData.description.length > 115)
      validationErrors.description =
        "Description must be 115 characters or less.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formData); // Send data (including id for updates)
    setErrors({});
    onClose();
  };

  return (
    show && (
      <ActionModal
        data={{
          action: formData.id ? "Edit Test Category" : "Add Test Category",
        }}
        onClose={onClose}
      >
        <form onSubmit={handleSubmit}>
          {/* Category Name */}
          <div className="mb-3">
            <label className="form-label">Category Name</label>
            <input
              type="text"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className={`form-control ${
                errors.description ? "is-invalid" : ""
              }`}
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              maxLength="115"
              required
            ></textarea>
            <small className="form-text text-muted">
              {formData.description.length}/115 characters
            </small>
            {errors.description && (
              <div className="invalid-feedback">{errors.description}</div>
            )}
          </div>

          {/* Buttons */}
          <div className="text-end">
            <button
              type="button"
              className="btn btn-secondary me-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {formData.id ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </ActionModal>
    )
  );
};

export default TestGroupForm;
