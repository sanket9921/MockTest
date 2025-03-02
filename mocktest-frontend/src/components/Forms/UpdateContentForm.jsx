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
      <label className="block mb-2">Content Type</label>
      <select
        name="content_type"
        value={formData.content_type}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
      >
        <option value="text">Text</option>
        <option value="image">Image</option>
      </select>

      {formData.content_type === "text" ? (
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          className="border p-2 w-full mb-4"
        />
      ) : (
        <input
          type="file"
          name="file"
          onChange={handleFileChange}
          className="mb-4"
        />
      )}

      {type === "question" && (
        <div>
          <label className="block mb-2">Marks</label>
          <input
            type="number"
            name="marks"
            value={formData.marks}
            onChange={handleChange}
            className="border p-2 w-full mb-4"
          />
        </div>
      )}

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Update
      </button>
    </form>
  );
};

export default UpdateContentForm;
