"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import History from "@tiptap/extension-history";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import classNames from "classnames";

// Simple debounce utility with cancel method
function debounce<T extends (...args: any[]) => any>(fn: T, wait: number) {
  let timeout: NodeJS.Timeout;
  const debounced = ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  }) as T & { cancel: () => void };
  
  debounced.cancel = () => clearTimeout(timeout);
  return debounced;
}

type Props = {
  note?: any; // { id?, title?, content? }
  onSaved?: () => void;
};

export default function Editor({ note, onSaved }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(note?.title || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [isMarkdownMode, setIsMarkdownMode] = useState(false);
  const [selectedFont, setSelectedFont] = useState("sans");
  const [fontColor, setFontColor] = useState("#000000");
  const [showChartModal, setShowChartModal] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Link,
      History,
      TextStyle,
      Color.configure({ types: ["textStyle"] }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: note?.content || "<p></p>",
    editorProps: {
      attributes: { class: "prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none" },
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(note?.content || "<p></p>");
  }, [note?.content, editor]);

  // ---------- SAVE ----------
  const saveNote = useCallback(async () => {
    if (!editor) return;
    const content = editor.getHTML();
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return alert("Sign in required");

    setIsSaving(true);
    try {
      if (!note?.id) {
        const { data, error } = await supabase
          .from("notes")
          .insert({ user_id: user.id, title: title || "Untitled", content })
          .select()
          .single();
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("notes")
          .update({ title, content })
          .eq("id", note.id);
        if (error) throw error;
      }
      onSaved?.();
    } catch (err: any) {
      console.error("Save error", err);
      alert(err.message || "Failed to save");
    } finally {
      setIsSaving(false);
    }
  }, [editor, title, note, onSaved]);

  // ---------- TOOLBAR ----------
  const toggleBold = () => editor?.chain().focus().toggleBold().run();
  const toggleItalic = () => editor?.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor?.chain().focus().toggleUnderline().run();
  const toggleBullet = () => editor?.chain().focus().toggleBulletList().run();
  const toggleOrdered = () => editor?.chain().focus().toggleOrderedList().run();
  const toggleHeading = (level: number = 2) => editor?.chain().focus().toggleHeading({ level } as any).run();
  const undo = () => editor?.chain().focus().undo().run();
  const redo = () => editor?.chain().focus().redo().run();
  const insertTable = () => editor?.chain().focus().insertTable({ rows: 2, cols: 2, withHeaderRow: true }).run();

  // ---------- MARKDOWN TOGGLE ----------
  const toggleMarkdownMode = () => {
    setIsMarkdownMode(!isMarkdownMode);
    // Full implementation would convert HTML ↔ Markdown using turndown/showdown
  };

  // ---------- FONT FAMILY ----------
  const changeFontFamily = (font: string) => {
    setSelectedFont(font);
    // Can be extended with custom font loading
  };

  // ---------- FONT COLOR ----------
  const changeFontColor = (color: string) => {
    setFontColor(color);
    editor?.chain().focus().setColor(color).run();
  };

  // ---------- INSERT CHART ----------
  const generateChartSVG = (type: string) => {
    const charts: Record<string, string> = {
      line: '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><polyline points="10,250 100,150 200,100 300,180 390,50" fill="none" stroke="#3b82f6" stroke-width="2"/><line x1="10" y1="250" x2="390" y2="250" stroke="#ccc"/><line x1="10" y1="50" x2="10" y2="250" stroke="#ccc"/></svg>',
      bar: '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="100" width="40" height="150" fill="#3b82f6"/><rect x="80" y="80" width="40" height="170" fill="#10b981"/><rect x="140" y="120" width="40" height="130" fill="#f59e0b"/><rect x="200" y="60" width="40" height="190" fill="#ef4444"/><line x1="10" y1="250" x2="390" y2="250" stroke="#ccc"/></svg>',
      pie: '<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg"><circle cx="150" cy="150" r="80" fill="#3b82f6"/><circle cx="150" cy="150" r="60" fill="white"/><circle cx="150" cy="150" r="40" fill="#10b981"/></svg>',
    };
    return charts[type] || charts.line;
  };

  const insertChart = (type: "line" | "bar" | "pie") => {
    const svgChart = generateChartSVG(type);
    const dataUrl = "data:image/svg+xml;base64," + btoa(svgChart);
    editor?.chain().focus().setImage({ src: dataUrl }).run();
    setShowChartModal(false);
  };

  // ---------- PPTX EXTRACTION ----------
  const handlePptxExtraction = async (file: File) => {
    setIsProcessingFile(true);
    try {
      await file.arrayBuffer();
      editor?.chain().focus().setContent(
        `<p><strong>PPTX Imported:</strong> ${file.name}</p><p>PPTX text extraction requires pptx-parser library. For now, please use PDF or Word documents for text extraction.</p>`
      ).run();
    } catch (err) {
      console.error("PPTX extraction error", err);
      alert("PPTX extraction not fully supported. Try PDF or DOCX.");
    } finally {
      setIsProcessingFile(false);
    }
  };

  // ---------- UPLOAD IMAGE ----------
  const handleImageUpload = async (file: File) => {
    setIsProcessingFile(true);
    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload failed");
      const json = await res.json();
      const publicUrl = json.publicUrl;
      editor?.chain().focus().setImage({ src: publicUrl }).run();
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    } finally {
      setIsProcessingFile(false);
    }
  };

  const onPickImage = () => {
    if (!inputRef.current) {
      inputRef.current = document.createElement("input");
      inputRef.current.type = "file";
      inputRef.current.accept = "image/*";
      inputRef.current.onchange = () => {
        const f = inputRef.current!.files?.[0];
        if (f) handleImageUpload(f);
      };
    }
    inputRef.current.click();
  };

  // ---------- FILE IMPORT ----------
  const handleImportFile = async (file: File) => {
    setIsProcessingFile(true);
    try {
      // Check if it's a PPTX file
      if (file.type === "application/vnd.openxmlformats-officedocument.presentationml.presentation" || file.name.endsWith(".pptx")) {
        await handlePptxExtraction(file);
        return;
      }

      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const json = await res.json();

      if (json.extractedText) {
        editor?.chain().focus().setContent(`<p>${escapeHtml(json.extractedText).replace(/\n/g, "</p><p>")}</p>`).run();
      } else if (json.publicUrl) {
        editor?.chain().focus().setImage({ src: json.publicUrl }).run();
      }
    } catch (err) {
      console.error(err);
      alert("Import failed");
    } finally {
      setIsProcessingFile(false);
    }
  };

  // ---------- AI ----------
  const callAi = async (mode: "summarize" | "improve") => {
    if (!editor) return;
    const text = editor.getText();
    if (!text || text.trim().length < 10) return;

    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, text }),
      });
      const data = await res.json();
      const aiText = data.output || data.text || "";
      editor.chain().focus().setContent(`<p>${escapeHtml(aiText).replace(/\n/g, "</p><p>")}</p>`).run();
    } catch (err) {
      console.error(err);
      alert("AI request failed");
    } finally {
      setAiLoading(false);
    }
  };

  // ---------- REAL-TIME AI (optional) ----------
  const debouncedAI = useCallback(
    debounce((text: string) => callAi("improve"), 2000),
    [editor]
  );

  useEffect(() => {
    if (!editor) return;
    const onUpdate = ({ editor }: any) => {
      const text = editor.getText();
      if (text.length > 20) debouncedAI(text);
    };
    editor.on("update", onUpdate);
    return () => {
      editor.off("update", onUpdate);
      debouncedAI.cancel();
    };
  }, [editor, debouncedAI]);

  return (
    <div className="space-y-4">
      {/* Title + Save */}
      <div className="flex gap-3 items-center">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="flex-1 p-3 rounded border"
        />
        <button onClick={saveNote} disabled={isSaving} className="px-4 py-2 bg-blue-600 text-white rounded">
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 items-center bg-white p-2 rounded shadow-sm">
        <button onClick={toggleBold} className={classNames("px-2 py-1 rounded", { "bg-gray-100": editor?.isActive("bold") })}><b>B</b></button>
        <button onClick={toggleItalic} className={classNames("px-2 py-1 rounded", { "bg-gray-100": editor?.isActive("italic") })}><i>I</i></button>
        <button onClick={toggleUnderline} className="px-2 py-1 rounded">U</button>
        <button onClick={() => toggleHeading(2)} className="px-2 py-1 rounded">H2</button>
        <button onClick={toggleBullet} className="px-2 py-1 rounded">• List</button>
        <button onClick={toggleOrdered} className="px-2 py-1 rounded">1. List</button>
        <button onClick={insertTable} className="px-2 py-1 rounded">Table</button>
        <button onClick={undo} className="px-2 py-1 rounded">↺</button>
        <button onClick={redo} className="px-2 py-1 rounded">↻</button>

        <div className="border-l h-6 mx-2" />

        <button onClick={onPickImage} className="px-2 py-1 rounded">{isProcessingFile ? "Uploading..." : "Image"}</button>

        <label className="px-2 py-1 rounded bg-gray-50 cursor-pointer">
          <input
            type="file"
            accept=".pdf,.docx,.pptx"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImportFile(f);
              e.currentTarget.value = "";
            }}
          />
          Import File
        </label>

        <div className="ml-auto flex gap-2">
          <button onClick={() => callAi("summarize")} disabled={aiLoading} className="px-3 py-1 rounded bg-yellow-400">Summarize</button>
          <button onClick={() => callAi("improve")} disabled={aiLoading} className="px-3 py-1 rounded bg-purple-500 text-white">Improve</button>
        </div>

        <div className="border-l h-6 mx-2" />

        {/* MARKDOWN TOGGLE */}
        <button 
          onClick={toggleMarkdownMode}
          className={classNames("px-2 py-1 rounded", { "bg-blue-100": isMarkdownMode })}
          title={isMarkdownMode ? "Markdown Mode ON" : "Markdown Mode OFF"}
        >
          {'<>'}
        </button>

        {/* FONT FAMILY PICKER */}
        <select 
          value={selectedFont}
          onChange={(e) => changeFontFamily(e.target.value)}
          className="px-2 py-1 rounded border text-sm"
        >
          <option value="sans">Sans</option>
          <option value="serif">Serif</option>
          <option value="mono">Mono</option>
        </select>

        {/* FONT COLOR PICKER */}
        <input 
          type="color"
          value={fontColor}
          onChange={(e) => changeFontColor(e.target.value)}
          className="w-10 h-8 rounded cursor-pointer"
          title="Font Color"
        />

        {/* CHART INSERTION */}
        {!showChartModal ? (
          <button 
            onClick={() => setShowChartModal(true)}
            className="px-2 py-1 rounded bg-green-500 text-white"
          >
            📊 Chart
          </button>
        ) : (
          <div className="flex gap-1 bg-green-50 p-2 rounded">
            <button onClick={() => insertChart("line")} className="px-2 py-1 text-xs bg-green-400 rounded">Line</button>
            <button onClick={() => insertChart("bar")} className="px-2 py-1 text-xs bg-green-400 rounded">Bar</button>
            <button onClick={() => insertChart("pie")} className="px-2 py-1 text-xs bg-green-400 rounded">Pie</button>
            <button onClick={() => setShowChartModal(false)} className="px-2 py-1 text-xs bg-red-300 rounded">Close</button>
          </div>
        )}
      </div>

      {/* Editor */}
      <div className="bg-white p-4 rounded shadow min-h-[300px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

// Escape HTML helper
function escapeHtml(s: string) {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
