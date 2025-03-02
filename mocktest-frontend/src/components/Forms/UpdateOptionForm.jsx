import { useState } from "react";
import axios from "axios";
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
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Update Option</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        {/* Content Type Toggle */}
        <div className="flex gap-4">
          <button
            type="button"
            className={`py-1 px-4 rounded ${
              contentType === "text" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setContentType("text")}
          >
            Text
          </button>
          <button
            type="button"
            className={`py-1 px-4 rounded ${
              contentType === "image" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setContentType("image")}
          >
            Image
          </button>
        </div>

        {/* Text Input */}
        {contentType === "text" && (
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        )}

        {/* Image Upload */}
        {contentType === "image" && (
          <input
            type="file"
            accept="image/*"
            className="w-full p-2 border rounded"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Option"}
        </button>
      </form>
    </div>
  );
};

export default UpdateOptionForm;
