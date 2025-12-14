"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function NoteClient({ id }: { id: string }) {
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("notes").select("*").eq("id", id).single();
      if (error) console.error(error);
      else if (mounted) setNote(data);
      setLoading(false);
    };
    load();
    const channel = supabase.channel(`notes:${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notes', filter: `id=eq.${id}` }, payload => {
        setNote(payload.new ?? payload.old);
      })
      .subscribe();
    return ()=>channel.unsubscribe();
  }, [id]);

  async function save() {
    const { error } = await supabase.from("notes").update({ title: note.title, content: note.content }).eq("id", id);
    if (error) return alert(error.message);
    alert("Saved");
  }

  async function remove() {
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) return alert(error.message);
    router.push("/dashboard/notes");
  }

  if (loading) return <div>Loading...</div>;
  if (!note) return <div>Not found</div>;

  return (
    <div className="p-4 max-w-3xl">
      <input className="w-full p-2 mb-2 border rounded" value={note.title} onChange={e=>setNote({ ...note, title: e.target.value})} />
      <textarea className="w-full p-2 h-60 mb-2 border rounded" value={note.content} onChange={e=>setNote({ ...note, content: e.target.value})} />
      <div className="flex gap-2">
        <button onClick={save} className="px-4 py-2 bg-black text-white rounded">Save</button>
        <button onClick={remove} className="px-4 py-2 border rounded">Delete</button>
      </div>
    </div>
  );
}
