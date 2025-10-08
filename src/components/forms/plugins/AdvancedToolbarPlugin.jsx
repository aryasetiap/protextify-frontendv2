import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  $createParagraphNode,
  $getNodeByKey,
} from "lexical";
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import {
  $isHeadingNode,
  $createHeadingNode,
  $createQuoteNode,
} from "@lexical/rich-text";
import { $createCodeNode, $isCodeNode } from "@lexical/code";
import { $findMatchingParent, $getNearestNodeOfType } from "@lexical/utils";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { TOGGLE_LINK_COMMAND, $isLinkNode } from "@lexical/link";
import { $wrapNodes } from "@lexical/selection";
import { INSERT_IMAGE_COMMAND } from "./ImagePlugin";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  Link,
  Image,
  Undo,
  Redo,
  ChevronDown,
  Type,
} from "lucide-react";

const LowPriority = 1;

const supportedBlockTypes = new Set([
  "paragraph",
  "quote",
  "code",
  "h1",
  "h2",
  "h3",
  "ul",
  "ol",
]);

const blockTypeToBlockName = {
  code: "Code Block",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  ol: "Numbered List",
  paragraph: "Normal",
  quote: "Quote",
  ul: "Bulleted List",
};

function Divider() {
  return <div className="w-px h-6 bg-gray-300 mx-1" />;
}

function getSelectedNode(selection) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

function $isAtNodeEnd(point) {
  if (point.type === "text") {
    return point.offset === point.getNode().getTextContentSize();
  }
  return point.offset === point.getNode().getChildrenSize();
}

function $isParentElementRTL(selection) {
  if ($isRangeSelection(selection)) {
    const anchorNode = selection.anchor.getNode();
    const element =
      anchorNode.getKey() === "root"
        ? anchorNode
        : anchorNode.getTopLevelElementOrThrow();
    return element.getDirection() === "rtl";
  }
  return false;
}

export function AdvancedToolbarPlugin({ disabled = false }) {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [blockType, setBlockType] = useState("paragraph");
  const [selectedElementKey, setSelectedElementKey] = useState(null);
  const [showBlockOptionsDropDown, setShowBlockOptionsDropDown] =
    useState(false);
  const [codeLanguage, setCodeLanguage] = useState("");
  const [isRTL, setIsRTL] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      setSelectedElementKey(elementKey);

      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsCode(selection.hasFormat("code"));
      setIsRTL($isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          setBlockType(type);
        }
      }
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      )
    );
  }, [editor, updateToolbar]);

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  const insertImage = useCallback(() => {
    const url = prompt("Masukkan URL gambar:");
    if (url) {
      editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
        src: url,
        altText: "Image",
      });
    }
  }, [editor]);

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $wrapNodes(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = (headingSize) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== "ul") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== "ol") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const formatCode = () => {
    if (blockType !== "code") {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createCodeNode());
        }
      });
    }
  };

  return (
    <div
      className="flex items-center flex-wrap gap-1 p-3 border-b border-gray-200 bg-gray-50 relative"
      ref={toolbarRef}
    >
      {/* Undo/Redo */}
      <button
        disabled={!canUndo || disabled}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Undo"
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        disabled={!canRedo || disabled}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Redo"
      >
        <Redo className="w-4 h-4" />
      </button>

      <Divider />

      {/* Block Type Selector */}
      {supportedBlockTypes.has(blockType) && (
        <div className="relative">
          <button
            className="flex items-center px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50"
            onClick={() =>
              setShowBlockOptionsDropDown(!showBlockOptionsDropDown)
            }
            disabled={disabled}
          >
            <Type className="w-4 h-4 mr-2" />
            <span>{blockTypeToBlockName[blockType]}</span>
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>

          {showBlockOptionsDropDown && (
            <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg z-10 min-w-[160px]">
              <button
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                onClick={() => {
                  formatParagraph();
                  setShowBlockOptionsDropDown(false);
                }}
              >
                Normal
              </button>
              <button
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 font-bold text-xl"
                onClick={() => {
                  formatHeading("h1");
                  setShowBlockOptionsDropDown(false);
                }}
              >
                Heading 1
              </button>
              <button
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 font-bold text-lg"
                onClick={() => {
                  formatHeading("h2");
                  setShowBlockOptionsDropDown(false);
                }}
              >
                Heading 2
              </button>
              <button
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 font-bold"
                onClick={() => {
                  formatHeading("h3");
                  setShowBlockOptionsDropDown(false);
                }}
              >
                Heading 3
              </button>
              <button
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                onClick={() => {
                  formatBulletList();
                  setShowBlockOptionsDropDown(false);
                }}
              >
                • Bullet List
              </button>
              <button
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                onClick={() => {
                  formatNumberedList();
                  setShowBlockOptionsDropDown(false);
                }}
              >
                1. Numbered List
              </button>
              <button
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 italic"
                onClick={() => {
                  formatQuote();
                  setShowBlockOptionsDropDown(false);
                }}
              >
                " Quote
              </button>
              <button
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 font-mono"
                onClick={() => {
                  formatCode();
                  setShowBlockOptionsDropDown(false);
                }}
              >
                {"</>"} Code Block
              </button>
            </div>
          )}
        </div>
      )}

      <Divider />

      {/* Text Formatting */}
      {blockType !== "code" && (
        <>
          <button
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
            className={`flex items-center justify-center w-8 h-8 rounded hover:bg-gray-200 ${
              isBold ? "bg-blue-100 text-blue-600" : ""
            }`}
            disabled={disabled}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>

          <button
            onClick={() =>
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
            }
            className={`flex items-center justify-center w-8 h-8 rounded hover:bg-gray-200 ${
              isItalic ? "bg-blue-100 text-blue-600" : ""
            }`}
            disabled={disabled}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>

          <button
            onClick={() =>
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
            }
            className={`flex items-center justify-center w-8 h-8 rounded hover:bg-gray-200 ${
              isUnderline ? "bg-blue-100 text-blue-600" : ""
            }`}
            disabled={disabled}
            title="Underline"
          >
            <Underline className="w-4 h-4" />
          </button>

          <button
            onClick={() =>
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
            }
            className={`flex items-center justify-center w-8 h-8 rounded hover:bg-gray-200 ${
              isStrikethrough ? "bg-blue-100 text-blue-600" : ""
            }`}
            disabled={disabled}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")}
            className={`flex items-center justify-center w-8 h-8 rounded hover:bg-gray-200 ${
              isCode ? "bg-blue-100 text-blue-600" : ""
            }`}
            disabled={disabled}
            title="Code"
          >
            <Code className="w-4 h-4" />
          </button>

          <Divider />

          {/* Alignment */}
          <button
            onClick={() =>
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")
            }
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-200"
            disabled={disabled}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() =>
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")
            }
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-200"
            disabled={disabled}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>

          <button
            onClick={() =>
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")
            }
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-200"
            disabled={disabled}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>

          <button
            onClick={() =>
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")
            }
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-200"
            disabled={disabled}
            title="Justify"
          >
            <AlignJustify className="w-4 h-4" />
          </button>

          <Divider />

          {/* Lists */}
          <button
            onClick={formatBulletList}
            className={`flex items-center justify-center w-8 h-8 rounded hover:bg-gray-200 ${
              blockType === "ul" ? "bg-blue-100 text-blue-600" : ""
            }`}
            disabled={disabled}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>

          <button
            onClick={formatNumberedList}
            className={`flex items-center justify-center w-8 h-8 rounded hover:bg-gray-200 ${
              blockType === "ol" ? "bg-blue-100 text-blue-600" : ""
            }`}
            disabled={disabled}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <Divider />

          {/* Insert Options */}
          <button
            onClick={insertLink}
            className={`flex items-center justify-center w-8 h-8 rounded hover:bg-gray-200 ${
              isLink ? "bg-blue-100 text-blue-600" : ""
            }`}
            disabled={disabled}
            title="Insert Link"
          >
            <Link className="w-4 h-4" />
          </button>

          <button
            onClick={insertImage}
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-200"
            disabled={disabled}
            title="Insert Image"
          >
            <Image className="w-4 h-4" />
          </button>

          <button
            onClick={() =>
              editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)
            }
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-200"
            disabled={disabled}
            title="Horizontal Rule"
          >
            <Minus className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
}
