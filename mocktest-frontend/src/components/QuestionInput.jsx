import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const QuestionInput = ({ question, setQuestion, marks, setMarks }) => {
  const [isTextMode, setIsTextMode] = useState(true);
  const [imagePreview, setImagePreview] = useState("");

  const editor = useEditor({
    extensions: [StarterKit],
    content: question.content || "",
    onUpdate: ({ editor }) => {
      setQuestion({ content: editor.getHTML(), content_type: "text" });
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setQuestion({ content: imageUrl, content_type: "image" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="font-semibold">Question:</label>
        <button
          onClick={() => setIsTextMode(!isTextMode)}
          className="p-1 bg-gray-300 rounded text-sm"
        >
          {isTextMode ? "Switch to Image" : "Switch to Text"}
        </button>
      </div>

      {isTextMode ? (
        <div className="border p-2">
          <EditorContent editor={editor} />
        </div>
      ) : (
        <div>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 w-48 h-32 object-cover"
            />
          )}
        </div>
      )}

      <label className="font-semibold">Marks:</label>
      <input
        type="number"
        value={marks}
        onChange={(e) => setMarks(parseInt(e.target.value))}
        className="w-full p-2 border"
      />
    </div>
  );
};

export default QuestionInput;
