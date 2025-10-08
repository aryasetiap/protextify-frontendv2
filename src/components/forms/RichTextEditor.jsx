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
  LinkIcon,
  Unlink,
  CheckCircle,
  Eye,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";
import { Badge, Button, Input, Modal } from "../ui";
import toast from "react-hot-toast";

const RichTextEditor = forwardRef(
  (
    {
      value = "",
      onChange,
      onAutoSave,
      placeholder = "Mulai tulis jawaban Anda...",
      maxWords = 5000,
      maxCharacters = 25000,
      disabled = false,
      showToolbar = true,
      autoSaveInterval = 3000,
      error,
      enablePasteMonitoring = true,
      allowedFormats = [
        "bold",
        "italic",
        "underline",
        "link",
        "list",
        "heading",
      ],
    },
    ref
  ) => {
    const [content, setContent] = useState(value);
    const [wordCount, setWordCount] = useState(0);
    const [characterCount, setCharacterCount] = useState(0);
    const [isAutoSaving, setIsAutoSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");
    const [pasteEvents, setPasteEvents] = useState([]);

    const autoSaveTimeoutRef = useRef(null);
    const editorRef = useRef(null);

    // Enhanced TipTap Editor configuration
    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3],
          },
        }),
        Placeholder.configure({
          placeholder,
        }),
        TextStyle,
        Color.configure({
          types: ["textStyle"],
        }),
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Link.configure({
          openOnClick: false,
          autolink: true,
          defaultProtocol: "https",
        }),
      ],
      content: value,
      editable: !disabled,
      onUpdate: ({ editor }) => {
        const newContent = editor.getHTML();
        handleContentChange(newContent);
      },
      onPaste: (view, event) => {
        if (enablePasteMonitoring) {
          handlePasteEvent(event);
        }
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
      getContent: () => editor?.getHTML() || "",
      getWordCount: () => wordCount,
      getCharacterCount: () => characterCount,
    }));

    // Enhanced paste event monitoring (FE only, no BE log)
    const handlePasteEvent = useCallback((event) => {
      const clipboardData = event.clipboardData || window.clipboardData;
      const pastedData = clipboardData.getData("text");

      if (pastedData.length > 50) {
        const newPasteEvent = {
          id: Date.now(),
          timestamp: new Date(),
          length: pastedData.length,
          wordCount: pastedData.split(/\s+/).filter((word) => word.length > 0)
            .length,
          suspicious:
            pastedData.length > 500 || pastedData.split("\n").length > 10,
        };

        setPasteEvents((prev) => [...prev, newPasteEvent].slice(-10));

        if (newPasteEvent.suspicious) {
          toast.warning(
            "Paste konten besar terdeteksi. Pastikan ini adalah karya Anda sendiri."
          );
        }
      }
    }, []);

    // Calculate word and character count with enhanced accuracy
    const calculateCounts = useCallback((html) => {
      const plainText = html
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .trim();

      const words =
        plainText === ""
          ? 0
          : plainText.split(/\s+/).filter((word) => word.length > 0).length;
      const characters = plainText.length;

      setWordCount(words);
      setCharacterCount(characters);

      return { words, characters, plainText };
    }, []);

    // Handle content change with enhanced validation
    const handleContentChange = useCallback(
      (newContent) => {
        setContent(newContent);
        setHasUnsavedChanges(true);

        const counts = calculateCounts(newContent);

        // Check limits
        if (counts.words > maxWords) {
          toast.error(`Melebihi batas maksimal ${maxWords} kata`);
        }
        if (counts.characters > maxCharacters) {
          toast.error(`Melebihi batas maksimal ${maxCharacters} karakter`);
        }

        if (onChange) {
          onChange(newContent);
        }

        // Auto-save logic
        if (onAutoSave) {
          if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current);
          }
          autoSaveTimeoutRef.current = setTimeout(() => {
            setIsAutoSaving(true);
            onAutoSave(newContent)
              .then(() => {
                setLastSaved(new Date());
                setHasUnsavedChanges(false);
              })
              .catch(() => {
                toast.error(
                  "Auto-save gagal. Pastikan koneksi internet stabil."
                );
              })
              .finally(() => {
                setIsAutoSaving(false);
              });
          }, autoSaveInterval);
        }
      },
      [
        onChange,
        onAutoSave,
        autoSaveInterval,
        maxWords,
        maxCharacters,
        calculateCounts,
      ]
    );

    // Initialize content
    useEffect(() => {
      setContent(value);
      calculateCounts(value);
    }, [value, calculateCounts]);

    // Cleanup
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
        editor.setEditable(!disabled);
      }
    }, [editor, disabled]);

    // Get status colors
    const getWordCountColor = () => {
      const percentage = (wordCount / maxWords) * 100;
      if (percentage >= 100) return "text-red-600";
      if (percentage >= 90) return "text-orange-600";
      if (percentage >= 75) return "text-yellow-600";
      return "text-gray-600";
    };

    const getCharacterCountColor = () => {
      const percentage = (characterCount / maxCharacters) * 100;
      if (percentage >= 100) return "text-red-600";
      if (percentage >= 90) return "text-orange-600";
      if (percentage >= 75) return "text-yellow-600";
      return "text-gray-600";
    };

    // Enhanced Toolbar component
    const Toolbar = () => {
      if (!showToolbar || !editor) return null;

      return (
        <div className="flex flex-wrap items-center gap-1 p-3 border-b border-gray-200 bg-gray-50">
          {/* Text Formatting */}
          <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
            {allowedFormats.includes("bold") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive("bold") ? "bg-gray-200" : ""}
                disabled={disabled}
                title="Bold (Ctrl+B)"
              >
                <Bold className="h-4 w-4" />
              </Button>
            )}

            {allowedFormats.includes("italic") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive("italic") ? "bg-gray-200" : ""}
                disabled={disabled}
                title="Italic (Ctrl+I)"
              >
                <Italic className="h-4 w-4" />
              </Button>
            )}

            {allowedFormats.includes("underline") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={editor.isActive("strike") ? "bg-gray-200" : ""}
                disabled={disabled}
                title="Strikethrough"
              >
                <Underline className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Headings */}
          {allowedFormats.includes("heading") && (
            <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className={
                  editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""
                }
                disabled={disabled}
                title="Heading 1"
              >
                <Heading1 className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={
                  editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""
                }
                disabled={disabled}
                title="Heading 2"
              >
                <Heading2 className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={
                  editor.isActive("heading", { level: 3 }) ? "bg-gray-200" : ""
                }
                disabled={disabled}
                title="Heading 3"
              >
                <Heading3 className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Lists */}
          {allowedFormats.includes("list") && (
            <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive("bulletList") ? "bg-gray-200" : ""}
                disabled={disabled}
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive("orderedList") ? "bg-gray-200" : ""}
                disabled={disabled}
                title="Numbered List"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={editor.isActive("blockquote") ? "bg-gray-200" : ""}
                disabled={disabled}
                title="Quote"
              >
                <Quote className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Alignment */}
          <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={
                editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""
              }
              disabled={disabled}
              title="Align Left"
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
              title="Align Center"
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
              title="Align Right"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Links */}
          {allowedFormats.includes("link") && (
            <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddLink}
                className={editor.isActive("link") ? "bg-gray-200" : ""}
                disabled={disabled}
                title="Add Link"
              >
                <LinkIcon className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().unsetLink().run()}
                disabled={disabled || !editor.isActive("link")}
                title="Remove Link"
              >
                <Unlink className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={disabled || !editor.can().undo()}
              title="Undo (Ctrl+Z)"
            >
              <Undo className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={disabled || !editor.can().redo()}
              title="Redo (Ctrl+Y)"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    };

    // Enhanced link handling
    const handleAddLink = useCallback(() => {
      if (!editor) return;

      const { from, to } = editor.state.selection;
      const selectedText = editor.state.doc.textBetween(from, to);

      if (selectedText) {
        setShowLinkModal(true);
      } else {
        toast.warning("Pilih teks terlebih dahulu untuk menambahkan link");
      }
    }, [editor]);

    const insertLink = useCallback(() => {
      if (!editor || !linkUrl) return;

      const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
      editor.chain().focus().setLink({ href: url }).run();
      setShowLinkModal(false);
      setLinkUrl("");
    }, [editor, linkUrl]);

    return (
      <div className="w-full">
        {/* Enhanced Editor Header */}
        <div className="flex items-center justify-between mb-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg border border-gray-200">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Type className="h-5 w-5 text-gray-500" />
              <span className={`text-sm font-medium ${getWordCountColor()}`}>
                {wordCount.toLocaleString()} / {maxWords.toLocaleString()} kata
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-gray-500" />
              <span className={`text-sm ${getCharacterCountColor()}`}>
                {characterCount.toLocaleString()} /{" "}
                {maxCharacters.toLocaleString()} karakter
              </span>
            </div>

            {pasteEvents.length > 0 && (
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-orange-600">
                  {pasteEvents.length} paste events
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {/* Auto-save status */}
            {isAutoSaving && (
              <Badge variant="info" size="sm">
                <Save className="h-3 w-3 mr-1 animate-pulse" />
                Menyimpan...
              </Badge>
            )}

            {hasUnsavedChanges && !isAutoSaving && (
              <Badge variant="warning" size="sm">
                <AlertCircle className="h-3 w-3 mr-1" />
                Belum tersimpan
              </Badge>
            )}

            {lastSaved && !hasUnsavedChanges && !isAutoSaving && (
              <Badge variant="success" size="sm">
                <CheckCircle className="h-3 w-3 mr-1" />
                Tersimpan {lastSaved.toLocaleTimeString("id-ID")}
              </Badge>
            )}
          </div>
        </div>

        {/* Editor Container */}
        <div
          className={`border rounded-lg overflow-hidden ${
            error ? "border-red-300" : "border-gray-200"
          }`}
        >
          <Toolbar />
          <div className="relative">
            <EditorContent
              editor={editor}
              className="prose prose-sm max-w-none min-h-[400px] p-4 focus:outline-none"
            />
          </div>
        </div>

        {/* Progress Bars */}
        <div className="mt-3 space-y-2">
          {/* Word Progress */}
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Kata</span>
              <span>{((wordCount / maxWords) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  wordCount >= maxWords
                    ? "bg-red-500"
                    : wordCount >= maxWords * 0.9
                    ? "bg-orange-500"
                    : wordCount >= maxWords * 0.75
                    ? "bg-yellow-500"
                    : "bg-[#23407a]"
                }`}
                style={{
                  width: `${Math.min(100, (wordCount / maxWords) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Character Progress */}
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Karakter</span>
              <span>
                {((characterCount / maxCharacters) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  characterCount >= maxCharacters
                    ? "bg-red-500"
                    : characterCount >= maxCharacters * 0.9
                    ? "bg-orange-500"
                    : characterCount >= maxCharacters * 0.75
                    ? "bg-yellow-500"
                    : "bg-[#23407a]"
                }`}
                style={{
                  width: `${Math.min(
                    100,
                    (characterCount / maxCharacters) * 100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Limit Warning */}
        {(wordCount >= maxWords * 0.9 ||
          characterCount >= maxCharacters * 0.9) && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-700">
                {wordCount >= maxWords
                  ? "Batas maksimal kata telah tercapai"
                  : characterCount >= maxCharacters
                  ? "Batas maksimal karakter telah tercapai"
                  : "Mendekati batas maksimal"}
              </span>
            </div>
          </div>
        )}

        {/* Link Modal */}
        <Modal
          isOpen={showLinkModal}
          onClose={() => setShowLinkModal(false)}
          title="Tambah Link"
        >
          <div className="space-y-4">
            <Input
              label="URL Link"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              autoFocus
            />
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowLinkModal(false)}>
                Batal
              </Button>
              <Button onClick={insertLink} disabled={!linkUrl}>
                Tambah Link
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";

export default RichTextEditor;
