import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodes } from "lexical";
import { useEffect } from "react";
import { INSERT_IMAGE_COMMAND } from "./ImagePlugin";

const ACCEPTABLE_IMAGE_TYPES = [
  "image/",
  "image/heic",
  "image/heif",
  "image/gif",
  "image/webp",
];

export function DragDropPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const handleDragStart = (event) => {
      event.preventDefault();
    };

    const handleDragOver = (event) => {
      event.preventDefault();
    };

    const handleDrop = (event) => {
      event.preventDefault();
      const files = Array.from(event.dataTransfer.files);

      files.forEach((file) => {
        if (ACCEPTABLE_IMAGE_TYPES.some((type) => file.type.startsWith(type))) {
          const reader = new FileReader();
          reader.onload = () => {
            editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
              src: reader.result,
              altText: file.name,
            });
          };
          reader.readAsDataURL(file);
        }
      });
    };

    const rootElement = editor.getRootElement();
    if (rootElement) {
      rootElement.addEventListener("dragstart", handleDragStart);
      rootElement.addEventListener("dragover", handleDragOver);
      rootElement.addEventListener("drop", handleDrop);

      return () => {
        rootElement.removeEventListener("dragstart", handleDragStart);
        rootElement.removeEventListener("dragover", handleDragOver);
        rootElement.removeEventListener("drop", handleDrop);
      };
    }
  }, [editor]);

  return null;
}
