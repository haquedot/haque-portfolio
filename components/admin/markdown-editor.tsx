"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Link2,
  Image,
  List,
  ListOrdered,
  Quote,
  Minus,
  Eye,
  Edit,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your blog content in Markdown...",
}: MarkdownEditorProps) {
  const [mode, setMode] = useState<"write" | "preview">("write");

  const insertText = useCallback(
    (before: string, after: string = "", placeholder: string = "") => {
      const textarea = document.getElementById(
        "markdown-editor"
      ) as HTMLTextAreaElement;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end) || placeholder;
      const newText =
        value.substring(0, start) +
        before +
        selectedText +
        after +
        value.substring(end);

      onChange(newText);

      // Set cursor position after insertion
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = start + before.length + selectedText.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    },
    [value, onChange]
  );

  const toolbarItems = [
    {
      icon: Bold,
      label: "Bold",
      action: () => insertText("**", "**", "bold text"),
    },
    {
      icon: Italic,
      label: "Italic",
      action: () => insertText("*", "*", "italic text"),
    },
    { type: "separator" as const },
    {
      icon: Heading1,
      label: "Heading 1",
      action: () => insertText("\n# ", "\n", "Heading"),
    },
    {
      icon: Heading2,
      label: "Heading 2",
      action: () => insertText("\n## ", "\n", "Heading"),
    },
    {
      icon: Heading3,
      label: "Heading 3",
      action: () => insertText("\n### ", "\n", "Heading"),
    },
    { type: "separator" as const },
    {
      icon: Code,
      label: "Code Block",
      action: () =>
        insertText("\n```javascript\n", "\n```\n", "// your code here"),
    },
    {
      icon: Link2,
      label: "Link",
      action: () => insertText("[", "](url)", "link text"),
    },
    {
      icon: Image,
      label: "Image",
      action: () => insertText("![", "](image-url)", "alt text"),
    },
    { type: "separator" as const },
    {
      icon: List,
      label: "Unordered List",
      action: () => insertText("\n- ", "\n", "List item"),
    },
    {
      icon: ListOrdered,
      label: "Ordered List",
      action: () => insertText("\n1. ", "\n", "List item"),
    },
    {
      icon: Quote,
      label: "Blockquote",
      action: () => insertText("\n> ", "\n", "Quote"),
    },
    {
      icon: Minus,
      label: "Horizontal Rule",
      action: () => insertText("\n---\n", ""),
    },
  ];

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-muted/30 flex-wrap">
        {/* Format buttons */}
        {toolbarItems.map((item, i) => {
          if ("type" in item && item.type === "separator") {
            return (
              <div key={i} className="w-px h-6 bg-border mx-1" />
            );
          }
          const ToolIcon = (item as any).icon;
          return (
            <button
              key={i}
              type="button"
              onClick={(item as any).action}
              title={(item as any).label}
              className="p-1.5 rounded hover:bg-muted transition-colors"
            >
              <ToolIcon className="h-4 w-4" />
            </button>
          );
        })}

        <div className="flex-1" />

        {/* Toggle mode */}
        <div className="flex border rounded-md overflow-hidden">
          <button
            type="button"
            onClick={() => setMode("write")}
            className={cn(
              "px-3 py-1 text-xs font-medium flex items-center gap-1 transition-colors",
              mode === "write"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            <Edit className="h-3 w-3" />
            Write
          </button>
          <button
            type="button"
            onClick={() => setMode("preview")}
            className={cn(
              "px-3 py-1 text-xs font-medium flex items-center gap-1 transition-colors",
              mode === "preview"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            <Eye className="h-3 w-3" />
            Preview
          </button>
        </div>
      </div>

      {/* Editor / Preview */}
      {mode === "write" ? (
        <Textarea
          id="markdown-editor"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[500px] rounded-none border-0 resize-y font-mono text-sm focus-visible:ring-0"
        />
      ) : (
        <div className="min-h-[500px] p-4 prose prose-sm dark:prose-invert max-w-none overflow-auto">
          {value ? (
            <ReactMarkdown>{value}</ReactMarkdown>
          ) : (
            <p className="text-muted-foreground">Nothing to preview</p>
          )}
        </div>
      )}
    </div>
  );
}
