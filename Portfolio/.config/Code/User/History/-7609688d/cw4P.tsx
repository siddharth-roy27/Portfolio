"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    setSession(supabase.auth.getSessionSync?.() ?? null);
    supabase.auth.onAuthStateChange((_event, s) => setSession(s));
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    setSession(null);
    window.location.href = "/";
  }

  return (
    <nav className="w-full p-4 flex justify-between border-b">
      <div className="font-bold">NoteForge AI</div>
      <div>
        {session?.session?.user ? (
          <>
            <span className="mr-4">{session.session.user.email}</span>
            <button onClick={signOut} className="px-3 py-1 border rounded">
              Logout
            </button>
          </>
        ) : (
          <a href="/auth" className="px-3 py-1 border rounded">Sign in</a>
        )}
      </div>
    </nav>
  );
}
