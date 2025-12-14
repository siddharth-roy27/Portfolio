"use client";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function AuthPage() {
  const [email, setEmail] = useState("");

  async function signInEmail() {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert(error.message);
    else alert("Check your email for the magic link");
  }

  async function signInGoogle() {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Sign in</h1>
      <input value={email} onChange={(e)=>setEmail(e.target.value)}
        className="w-full p-2 border rounded mb-3" placeholder="you@domain.com" />
      <button onClick={signInEmail} className="w-full p-2 bg-black text-white rounded">Email magic link</button>
      <div className="text-center my-3">or</div>
      <button onClick={signInGoogle} className="w-full p-2 border rounded">Continue with Google</button>
    </div>
  );
}
