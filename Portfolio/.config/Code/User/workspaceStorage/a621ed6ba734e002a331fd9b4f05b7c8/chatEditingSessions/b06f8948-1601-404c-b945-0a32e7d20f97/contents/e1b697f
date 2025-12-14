"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function NotesClient() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) {
        console.error(error);
      } else if (mounted) {
        setNotes(data || []);
      }
      setLoading(false);
    }

    load();

    // realtime subscribe to changes (optional)
    const channel = supabase.channel("public:notes")
      .on("postgres_changes", { event: "*", schema: "public", table: "notes" }, payload => {
        load();
      })
      .subscribe();

    return () => {
      mounted = false;
      channel.unsubscribe();
    };
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl">Your notes</h2>
        <Link href="/dashboard/notes/new" className="px-3 py-1 bg-black text-white rounded">+ New</Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {notes.map(n => (
          <Link key={n.id} href={`/dashboard/notes/${n.id}`} className="p-4 border rounded hover:bg-gray-50">
            <h3 className="font-semibold">{n.title || "Untitled"}</h3>
            <p className="text-sm text-gray-600">{(n.content || "").slice(0, 140)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
