"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import NoteCard from "./components/NoteCard";
import Editor from "./components/Editor";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) window.location.href = "/auth/login";
      setUserId(data.user.id);
      fetchNotes(data.user.id);
    });
  }, []);

  const fetchNotes = async (uid: string) => {
    const { data } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    if (data) setNotes(data);
  };

  const deleteNote = async (id: string) => {
    await supabase.from("notes").delete().eq("id", id);
    fetchNotes(userId);
  };

  return (
    <div className="grid grid-cols-3 gap-6 mt-6">
      {/* Notes List */}
      <div className="col-span-1">
        <button
          onClick={() => setSelected({ id: null, title: "", content: "" })}
          className="w-full bg-blue-600 text-white py-2 rounded-lg mb-4"
        >
          + New Note
        </button>

        <div className="space-y-4">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onSelect={() => setSelected(note)}
              onDelete={deleteNote}
            />
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="col-span-2">
        {selected ? (
          <Editor
            note={selected}
            onSave={() => {
              fetchNotes(userId);
              setSelected(null);
            }}
          />
        ) : (
          <div className="text-gray-500 text-lg">Select a note...</div>
        )}
      </div>
    </div>
  );
}
