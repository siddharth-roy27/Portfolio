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
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import classNames from "classnames";

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
  const inputRef = useRef<HTMLInputElement | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Link,
      History,
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

  // Toolbar actions
  const toggleBold = () => editor?.chain().focus().toggleBold().run();
  const toggleItalic = () => editor?.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor?.chain().focus().toggleUnderline().run();
  const toggleBullet = () => editor?.chain().focus().toggleBulletList().run();
  const toggleOrdered = () => editor?.chain().focus().toggleOrderedList().run();
  const toggleHeading = (level = 2) => editor?.chain().focus().toggleHeading({ level }).run();
  const undo = () => editor?.chain().focus().undo().run();
  const redo = () => editor?.chain().focus().redo().run();
  const insertTable = () => editor?.chain().focus().insertTable({ rows: 2, cols: 2, withHeaderRow: true }).run();

  // Insert image flow: choose file → POST /api/upload → get public URL → insert
  const handleImageUpload = async (file: File) => {
    setIsProcessingFile(true);
    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });

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

  // File import (PDF/DOCX/PPTX) => upload + server extracts text and returns it; we insert into editor
  const handleImportFile = async (file: File) => {
    setIsProcessingFile(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const json = await res.json();
      // server returns { publicUrl, extractedText (optional) }
      if (json.extractedText) {
        // insert extracted text as paragraphs
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

  // AI calls (Summarize / Improve) — server-side summarizer
  const callAi = async (mode: "summarize" | "improve") => {
    if (!editor) return;
    const text = editor.getText();
    if (!text || text.trim().length < 10) {
      alert("Please enter some content to process.");
      return;
    }
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, text }),
      });
      if (!res.ok) throw new Error("AI service failed");
      const j = await res.json();
      // replace editor content with AI output (or append depending on UX)
      editor.chain().focus().setContent(`<p>${escapeHtml(j.output).replace(/\n/g, "</p><p>")}</p>`).run();
    } catch (err) {
      console.error(err);
      alert("AI request failed");
    } finally {
      setAiLoading(false);
    }
  };

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
        <button onClick={toggleBold} className={classNames("px-2 py-1 rounded", { "bg-gray-100": editor?.isActive("bold") })} aria-label="Bold"><b>B</b></button>
        <button onClick={toggleItalic} className={classNames("px-2 py-1 rounded", { "bg-gray-100": editor?.isActive("italic") })} aria-label="Italic"><i>I</i></button>
        <button onClick={toggleUnderline} className="px-2 py-1 rounded" aria-label="Underline">U</button>
        <button onClick={() => toggleHeading(2)} className="px-2 py-1 rounded" aria-label="H2">H2</button>
        <button onClick={toggleBullet} className="px-2 py-1 rounded" aria-label="Bullets">• List</button>
        <button onClick={toggleOrdered} className="px-2 py-1 rounded" aria-label="Numbered">1. List</button>
        <button onClick={insertTable} className="px-2 py-1 rounded" aria-label="Table">Table</button>
        <button onClick={undo} className="px-2 py-1 rounded" aria-label="Undo">↺</button>
        <button onClick={redo} className="px-2 py-1 rounded" aria-label="Redo">↻</button>

        <div className="border-l h-6 mx-2" />

        <button onClick={onPickImage} className="px-2 py-1 rounded" aria-label="Insert image">{isProcessingFile ? "Uploading..." : "Image"}</button>

        <label className="px-2 py-1 rounded bg-gray-50 cursor-pointer">
          <input
            type="file"
            accept=".pdf,.docx,.pptx"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImportFile(f);
              e.currentTarget.value = ""; // reset
            }}
          />
          Import File
        </label>

        <div className="ml-auto flex gap-2">
          <button onClick={() => callAi("summarize")} disabled={aiLoading} className="px-3 py-1 rounded bg-yellow-400">Summarize</button>
          <button onClick={() => callAi("improve")} disabled={aiLoading} className="px-3 py-1 rounded bg-purple-500 text-white">Improve</button>
        </div>
      </div>

      {/* Editor */}
      <div className="bg-white p-4 rounded shadow min-h-[300px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

// small HTML escape helper to avoid XSS when inserting AI text (server should sanitize!)
function escapeHtml(s: string) {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
