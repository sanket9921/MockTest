import { useState } from "react";

const PassageInput = ({ passage, setPassage }) => {
  const [preview, setPreview] = useState(null);

  // ✅ Toggle Passage Type (Text/Image)
  const togglePassageType = () => {
    setPassage({
      ...passage,
      content: "",
      content_type: passage.content_type === "text" ? "image" : "text",
      file: null,
    });
    setPreview(null);
  };

  // ✅ Handle Text Input
  const handlePassageChange = (e) => {
    setPassage({ ...passage, content: e.target.value, file: null });
  };

  // ✅ Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPassage({ ...passage, content: "", file });
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="border p-4 rounded">
      <button
        onClick={togglePassageType}
        className="p-2 bg-blue-500 text-white rounded"
      >
        Switch to {passage.content_type === "text" ? "Image" : "Text"}
      </button>

      {passage.content_type === "text" ? (
        <textarea
          value={passage.content}
          onChange={handlePassageChange}
          placeholder="Enter passage..."
          className="w-full p-2 border rounded"
        />
      ) : (
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border rounded"
        />
      )}

      {preview && (
        <img src={preview} alt="Preview" className="w-full h-auto mt-2" />
      )}
    </div>
  );
};

export default PassageInput;
