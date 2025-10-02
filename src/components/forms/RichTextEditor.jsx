// src/components/forms/RichTextEditor.jsx
import {
  useState,
  useRef,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { TextAlign } from "@tiptap/extension-text-align";
import { Link } from "@tiptap/extension-link";
import {
  Save,
  FileText,
  Type,
  AlertCircle,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { Badge, Button } from "../ui";

const RichTextEditor = forwardRef(
  (
    {
      value = "",
      onChange,
      onAutoSave,
      placeholder = "Mulai tulis jawaban Anda...",
      maxWords = 5000,
      disabled = false,
      showToolbar = true,
      autoSaveInterval = 3000,
    },
    ref
  ) => {
    const [content, setContent] = useState(value);
    const [wordCount, setWordCount] = useState(0);
    const [characterCount, setCharacterCount] = useState(0);
    const [isAutoSaving, setIsAutoSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const autoSaveTimeoutRef = useRef(null);

    // TipTap Editor configuration
    const editor = useEditor({
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder,
        }),
        TextStyle,
        Color,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Link.configure({
          openOnClick: false,
        }),
      ],
      content: value,
      editable: !disabled,
      onUpdate: ({ editor }) => {
        const newContent = editor.getHTML();
        handleContentChange(newContent);
      },
    });

    // Expose editor methods to parent via ref
    useImperativeHandle(ref, () => ({
      getEditor: () => editor,
      insertText: (text) => {
        if (editor) {
          editor.commands.insertContent(text);
        }
      },
      focus: () => {
        if (editor) {
          editor.commands.focus();
        }
      },
    }));

    // Calculate word and character count
    const calculateCounts = useCallback((html) => {
      // Remove HTML tags and get plain text
      const plainText = html.replace(/<[^>]*>/g, "").trim();
      const words =
        plainText === ""
          ? 0
          : plainText.split(/\s+/).filter((word) => word.length > 0).length;
      const characters = plainText.length;

      setWordCount(words);
      setCharacterCount(characters);

      return { words, characters };
    }, []);

    // Handle content change
    const handleContentChange = useCallback(
      (newContent) => {
        setContent(newContent);
        setHasUnsavedChanges(true);

        const counts = calculateCounts(newContent);

        // Check word limit
        if (counts.words > maxWords) {
          return; // Prevent further input
        }

        // Call parent onChange
        if (onChange) {
          onChange(newContent);
        }

        // Setup auto-save
        if (autoSaveTimeoutRef.current) {
          clearTimeout(autoSaveTimeoutRef.current);
        }

        autoSaveTimeoutRef.current = setTimeout(() => {
          handleAutoSave(newContent);
        }, autoSaveInterval);
      },
      [onChange, maxWords, autoSaveInterval, calculateCounts]
    );

    // Auto-save function
    const handleAutoSave = useCallback(
      async (contentToSave) => {
        if (!onAutoSave || !contentToSave.trim()) return;

        try {
          setIsAutoSaving(true);
          await onAutoSave(contentToSave);
          setLastSaved(new Date());
          setHasUnsavedChanges(false);
        } catch (error) {
          console.error("Auto-save failed:", error);
        } finally {
          setIsAutoSaving(false);
        }
      },
      [onAutoSave]
    );

    // Initialize content
    useEffect(() => {
      if (editor && value !== content) {
        editor.commands.setContent(value);
        setContent(value);
        calculateCounts(value);
      }
    }, [value, content, calculateCounts, editor]);

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (autoSaveTimeoutRef.current) {
          clearTimeout(autoSaveTimeoutRef.current);
        }
      };
    }, []);

    // Update editor editable state
    useEffect(() => {
      if (editor) {
        editor.setEditable(!disabled && wordCount < maxWords);
      }
    }, [editor, disabled, wordCount, maxWords]);

    // Get word count color based on limit
    const getWordCountColor = () => {
      const percentage = (wordCount / maxWords) * 100;
      if (percentage >= 90) return "text-red-600";
      if (percentage >= 75) return "text-yellow-600";
      return "text-gray-600";
    };

    // Toolbar component
    const Toolbar = () => {
      if (!showToolbar || !editor) return null;

      return (
        <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive("bold") ? "bg-gray-200" : ""}
              disabled={disabled}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive("italic") ? "bg-gray-200" : ""}
              disabled={disabled}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={editor.isActive("strike") ? "bg-gray-200" : ""}
              disabled={disabled}
            >
              <Underline className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive("bulletList") ? "bg-gray-200" : ""}
              disabled={disabled}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive("orderedList") ? "bg-gray-200" : ""}
              disabled={disabled}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={editor.isActive("blockquote") ? "bg-gray-200" : ""}
              disabled={disabled}
            >
              <Quote className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={
                editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""
              }
              disabled={disabled}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              className={
                editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""
              }
              disabled={disabled}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={
                editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""
              }
              disabled={disabled}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={disabled || !editor.can().undo()}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={disabled || !editor.can().redo()}
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    };

    return (
      <div className="w-full">
        {/* Editor Header */}
        <div className="flex items-center justify-between mb-3 p-3 bg-gray-50 rounded-t-lg border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Type className="h-4 w-4 text-gray-500" />
              <span className={`text-sm font-medium ${getWordCountColor()}`}>
                {wordCount} / {maxWords} kata
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {characterCount} karakter
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Auto-save status */}
            {isAutoSaving && (
              <div className="flex items-center space-x-2">
                <Save className="h-4 w-4 text-blue-500 animate-spin" />
                <span className="text-sm text-blue-600">Menyimpan...</span>
              </div>
            )}

            {hasUnsavedChanges && !isAutoSaving && (
              <Badge variant="warning" size="sm">
                <AlertCircle className="h-3 w-3 mr-1" />
                Belum tersimpan
              </Badge>
            )}

            {lastSaved && !hasUnsavedChanges && !isAutoSaving && (
              <Badge variant="success" size="sm">
                Tersimpan {new Date(lastSaved).toLocaleTimeString("id-ID")}
              </Badge>
            )}
          </div>
        </div>

        {/* Editor Container */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <Toolbar />
          <div className="relative">
            <EditorContent
              editor={editor}
              className="prose prose-sm max-w-none min-h-[400px] p-4 focus:outline-none"
            />
          </div>
        </div>

        {/* Word limit warning */}
        {wordCount >= maxWords * 0.9 && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-700">
                {wordCount >= maxWords
                  ? "Batas maksimal kata telah tercapai"
                  : `Mendekati batas maksimal (${
                      maxWords - wordCount
                    } kata tersisa)`}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";

export default RichTextEditor;
