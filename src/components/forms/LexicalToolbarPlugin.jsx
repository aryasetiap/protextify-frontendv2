import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
} from "lexical";
import { useCallback } from "react";

export function ToolbarPlugin({ disabled }) {
  const [editor] = useLexicalComposerContext();

  const applyFormat = useCallback(
    (format) => {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
    },
    [editor]
  );

  const applyElement = useCallback(
    (element) => {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, element);
    },
    [editor]
  );

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 border-b border-gray-200 bg-gray-50">
      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-gray-200 text-sm font-medium"
        onClick={() => applyFormat("bold")}
        disabled={disabled}
      >
        <b>B</b>
      </button>
      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-gray-200 text-sm font-medium"
        onClick={() => applyFormat("italic")}
        disabled={disabled}
      >
        <i>I</i>
      </button>
      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-gray-200 text-sm font-medium"
        onClick={() => applyFormat("underline")}
        disabled={disabled}
      >
        <u>U</u>
      </button>
      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-gray-200 text-sm font-medium"
        onClick={() => applyFormat("strikethrough")}
        disabled={disabled}
      >
        <s>S</s>
      </button>
      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-gray-200 text-sm font-medium"
        onClick={() => applyElement("h1")}
        disabled={disabled}
      >
        H1
      </button>
      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-gray-200 text-sm font-medium"
        onClick={() => applyElement("h2")}
        disabled={disabled}
      >
        H2
      </button>
      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-gray-200 text-sm font-medium"
        onClick={() => applyElement("h3")}
        disabled={disabled}
      >
        H3
      </button>
      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-gray-200 text-sm font-medium"
        onClick={() => applyElement("ul")}
        disabled={disabled}
      >
        • List
      </button>
      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-gray-200 text-sm font-medium"
        onClick={() => applyElement("ol")}
        disabled={disabled}
      >
        1. List
      </button>
      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-gray-200 text-sm font-medium"
        onClick={() => applyElement("left")}
        disabled={disabled}
      >
        Left
      </button>
      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-gray-200 text-sm font-medium"
        onClick={() => applyElement("center")}
        disabled={disabled}
      >
        Center
      </button>
      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-gray-200 text-sm font-medium"
        onClick={() => applyElement("right")}
        disabled={disabled}
      >
        Right
      </button>
      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-gray-200 text-sm font-medium"
        onClick={() => applyElement("justify")}
        disabled={disabled}
      >
        Justify
      </button>
      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-gray-200 text-sm font-medium"
        onClick={() => applyElement("quote")}
        disabled={disabled}
      >
        “ Quote
      </button>
      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-gray-200 text-sm font-medium"
        onClick={() => applyElement("code")}
        disabled={disabled}
      >
        {"</>"} Code
      </button>
      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-gray-200 text-sm font-medium"
        onClick={() => editor.dispatchCommand(UNDO_COMMAND)}
        disabled={disabled}
      >
        ↺ Undo
      </button>
      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-gray-200 text-sm font-medium"
        onClick={() => editor.dispatchCommand(REDO_COMMAND)}
        disabled={disabled}
      >
        ↻ Redo
      </button>
      {/* Tambahkan tombol insert image jika ingin */}
    </div>
  );
}
