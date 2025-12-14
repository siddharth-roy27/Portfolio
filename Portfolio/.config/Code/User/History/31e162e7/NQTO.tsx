"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface EditorProps {
  note: { id?: string; title: string; content: string };
  onSave: () => void;
}

export default function Editor({ note, onSave }: EditorProps) {
  const [title, setTitle] = useState(note.title || "");
  const [content, setContent] = useState(note.content || "");

  const save = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      alert("User not authenticated");
      return;
    }

    if (!note.id) {
      await supabase.from("notes").insert({
        user_id: user.id,
        title,
        content,
      });
    } else {
      await supabase
        .from("notes")
        .update({ title, content })
        .eq("id", note.id);
    }

    onSave();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <input
        className="w-full p-3 mb-4 border rounded-lg"
        placeholder="Note title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full p-3 h-64 border rounded-lg"
        placeholder="Write your note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        onClick={save}
        className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Save
      </button>
    </div>
  );
}
