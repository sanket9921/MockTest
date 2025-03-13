import { useState } from "react";
import { updateOption } from "../../services/optionService";

const UpdateOptionForm = ({ data, onClose }) => {
  const [contentType, setContentType] = useState(data.content_type);
  const [text, setText] = useState(data.content || "");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("content_type", contentType);

    if (contentType === "text") {
      formData.append("content", text);
    } else if (contentType === "image" && image) {
      formData.append("file", image);
    }

    try {
      await updateOption(data.id, formData);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 bg-white rounded shadow">
      <h4 className="mb-3 fw-bold">Update Option</h4>
      <form onSubmit={handleUpdate}>
        {/* Content Type Toggle */}
        <div className="btn-group mb-3">
          <button
            type="button"
            className={`btn ${
              contentType === "text" ? "btn-primary" : "btn-outline-secondary"
            }`}
            onClick={() => setContentType("text")}
          >
            Text
          </button>
          <button
            type="button"
            className={`btn ${
              contentType === "image" ? "btn-primary" : "btn-outline-secondary"
            }`}
            onClick={() => setContentType("image")}
          >
            Image
          </button>
        </div>

        {/* Text Input */}
        {contentType === "text" && (
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </div>
        )}

        {/* Image Upload */}
        {contentType === "image" && (
          <div className="mb-3">
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={(e) => setImage(e.target.files[0])}
              required
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Updating...
            </>
          ) : (
            "Update Option"
          )}
        </button>
      </form>
    </div>
  );
};

export default UpdateOptionForm;
