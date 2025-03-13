import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    ["clean"],
  ],
};

const RichTextEditor = ({ value, onChange, placeholder = "Enter text..." }) => {
  return (
    <ReactQuill
      value={value}
      onChange={onChange}
      modules={modules}
      placeholder={placeholder}
      className="bg-white"
    />
  );
};

export default RichTextEditor;
