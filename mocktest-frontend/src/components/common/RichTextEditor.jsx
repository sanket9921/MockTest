import { useEditor, EditorContent } from "@tiptap/react";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import History from "@tiptap/extension-history";
import Image from "@tiptap/extension-image";
import { useState } from "react";

const RichTextEditor = ({ question, setQuestion }) => {
  const editor = useEditor({
    extensions: [
      Bold,
      Italic,
      Heading.configure({ levels: [1, 2, 3] }), // H1, H2, H3 Support
      BulletList,
      OrderedList,
      Blockquote,
      CodeBlock,
      HorizontalRule,
      History, // Adds Undo/Redo
      Image,
    ],
    content: question.content || "",
    onUpdate: ({ editor }) => {
      setQuestion({
        content: editor.getHTML(),
        content_type: "text",
      });
    },
  });

  if (!editor) return null;

  return (
    <div className="border p-2">
      {/* Toolbar */}
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1 ${editor.isActive("bold") ? "bg-gray-300" : ""}`}
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1 ${editor.isActive("italic") ? "bg-gray-300" : ""}`}
        >
          I
        </button>
        {/* Add more buttons as needed */}
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="border p-2 min-h-[100px]" />
    </div>
  );
};

export default RichTextEditor;
