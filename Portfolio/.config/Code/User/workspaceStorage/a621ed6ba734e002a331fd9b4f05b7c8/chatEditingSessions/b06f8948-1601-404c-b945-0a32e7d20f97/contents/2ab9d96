"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function NewNote() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  async function save() {
    const user = (await supabase.auth.getSession()).data.session?.user;
    if (!user) { alert("Sign in first"); return; }

    const { data, error } = await supabase
      .from("notes")
      .insert([{ title, content, user_id: user.id }])
      .select()
      .single();

    if (error) return alert(error.message);
    router.push(`/dashboard/notes/${data.id}`);
  }

  return (
    <div className="p-4 max-w-3xl">
      <input value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full p-2 mb-2 border rounded" placeholder="Title"/>
      <textarea value={content} onChange={(e)=>setContent(e.target.value)} className="w-full p-2 h-60 mb-2 border rounded" placeholder="Write..."></textarea>
      <div className="flex gap-2">
        <button onClick={save} className="px-4 py-2 bg-black text-white rounded">Save</button>
      </div>
    </div>
  );
}
