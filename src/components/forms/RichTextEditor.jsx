// src/components/forms/RichTextEditor.jsx
import { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

export default function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Masukkan teks...",
  error,
  readOnly = false,
  height = "200px",
}) {
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    handleContentChange();
  };

  const handleContentChange = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    handleContentChange();
  };

  const toolbarButtons = [
    { icon: Bold, command: "bold", title: "Bold" },
    { icon: Italic, command: "italic", title: "Italic" },
    { icon: Underline, command: "underline", title: "Underline" },
    { icon: List, command: "insertUnorderedList", title: "Bullet List" },
    { icon: ListOrdered, command: "insertOrderedList", title: "Numbered List" },
    { icon: AlignLeft, command: "justifyLeft", title: "Align Left" },
    { icon: AlignCenter, command: "justifyCenter", title: "Align Center" },
    { icon: AlignRight, command: "justifyRight", title: "Align Right" },
  ];

  return (
    <div>
      <div
        className={`
          border rounded-lg overflow-hidden bg-white
          ${error ? "border-red-500" : "border-gray-300"}
          ${isFocused ? "ring-2 ring-[#23407a] ring-opacity-50" : ""}
          ${readOnly ? "bg-gray-50" : "bg-white"}
        `}
      >
        {/* Toolbar */}
        {!readOnly && (
          <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1">
            {toolbarButtons.map(({ icon: Icon, command, title }) => (
              <button
                key={command}
                type="button"
                onClick={() => execCommand(command)}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title={title}
              >
                <Icon className="h-4 w-4 text-gray-600" />
              </button>
            ))}

            {/* Link button */}
            <button
              type="button"
              onClick={() => {
                const url = prompt("Enter URL:");
                if (url) execCommand("createLink", url);
              }}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Add Link"
            >
              <Link className="h-4 w-4 text-gray-600" />
            </button>

            {/* Header dropdown */}
            <select
              onChange={(e) => {
                if (e.target.value) {
                  execCommand("formatBlock", e.target.value);
                  e.target.value = "";
                }
              }}
              className="px-2 py-1 text-sm border border-gray-200 rounded"
            >
              <option value="">Format</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
              <option value="p">Paragraph</option>
            </select>
          </div>
        )}

        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable={!readOnly}
          onInput={handleContentChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onPaste={handlePaste}
          className={`
            p-3 outline-none overflow-y-auto
            ${readOnly ? "cursor-default" : "cursor-text"}
          `}
          style={{
            minHeight: height,
            maxHeight: "400px",
          }}
          data-placeholder={placeholder}
          suppressContentEditableWarning={true}
        />
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
