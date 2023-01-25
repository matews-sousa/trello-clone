import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import EditorMenu from "./editor-menu";

interface Props {
  setIsEditing: (isEditing: boolean) => void;
  description?: string;
  updateDescription: (description?: string) => void;
}

const TextEditor = ({
  setIsEditing,
  description,
  updateDescription,
}: Props) => {
  const editor = useEditor({
    extensions: [StarterKit],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm focus:outline-none border border-gray-300 rounded-b-sm p-2 bg-white",
      },
    },
    content: description,
  });

  return (
    <div>
      <EditorMenu editor={editor} />
      <EditorContent editor={editor} />
      <div className="mt-2 flex gap-4">
        <button
          className="btn bg-gray-200 hover:bg-gray-300 text-black"
          onClick={() => setIsEditing(false)}
        >
          Cancel
        </button>
        <button
          className="btn"
          onClick={() => updateDescription(editor?.getHTML())}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default TextEditor;
