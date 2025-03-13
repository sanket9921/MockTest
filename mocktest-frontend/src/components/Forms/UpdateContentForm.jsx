import { useState } from "react";

const UpdateContentForm = ({ initialData, type, onSubmit }) => {
  console.log(initialData);

  const [formData, setFormData] = useState({
    content: initialData.content || "",
    content_type: initialData.content_type || "text",
    marks: initialData.marks || "", // Only for questions
    file: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0], content: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = new FormData();
    updatedData.append("content", formData.content);
    updatedData.append("content_type", formData.content_type);
    if (type === "question") updatedData.append("marks", formData.marks);
    if (formData.file) updatedData.append("file", formData.file);
    onSubmit(updatedData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow">
      {/* Content Type Selector */}
      <label className="form-label fw-bold">Content Type</label>
      <select
        name="content_type"
        value={formData.content_type}
        onChange={handleChange}
        className="form-select mb-3"
      >
        <option value="text">Text</option>
        <option value="image">Image</option>
      </select>

      {/* Content Input */}
      {formData.content_type === "text" ? (
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          className="form-control mb-3"
          rows="3"
          placeholder="Enter content here..."
        />
      ) : (
        <input
          type="file"
          name="file"
          onChange={handleFileChange}
          className="form-control mb-3"
          accept="image/*"
        />
      )}

      {/* Marks Input (Only for Questions) */}
      {type === "question" && (
        <div>
          <label className="form-label fw-bold">Marks</label>
          <input
            type="number"
            name="marks"
            value={formData.marks}
            onChange={handleChange}
            className="form-control mb-3"
            placeholder="Enter marks"
          />
        </div>
      )}

      {/* Submit Button */}
      <button type="submit" className="btn btn-primary">
        <i className="bi bi-arrow-repeat me-2"></i> Update
      </button>
    </form>
  );
};

export default UpdateContentForm;
