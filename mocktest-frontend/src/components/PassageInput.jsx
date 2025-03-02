import React, { useState } from "react";

const PassageInput = ({ passage, setPassage }) => {
  const [passageContentType, setPassageContentType] = useState("text");
  const [passageContent, setPassageContent] = useState("");
  const [passageFile, setPassageFile] = useState(null);

  const handleToggleInputType = () => {
    setPassageContent("");
    setPassageFile(null);
    setPassageContentType(passageContentType === "text" ? "image" : "text");
  };

  const handleTextChange = (e) => {
    setPassageContent(e.target.value);
    setPassage({ content: e.target.value, content_type: "text", file: null });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPassageContent(URL.createObjectURL(file));
      setPassageFile(file);
      setPassage({
        content: URL.createObjectURL(file),
        content_type: "image",
        file,
      });
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">
          Passage Content:
        </label>
        <button
          type="button"
          onClick={handleToggleInputType}
          className="px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Switch to {passageContentType === "text" ? "Image" : "Text"}
        </button>
      </div>

      {passageContentType === "text" ? (
        <textarea
          className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          value={passageContent}
          onChange={handleTextChange}
          placeholder="Enter passage content here..."
        />
      ) : (
        <div className="flex flex-col items-start gap-2">
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {passageContent && (
            <img
              src={passageContent}
              alt="Passage Preview"
              className="mt-2 w-40 h-40 object-cover border rounded-md"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PassageInput;
