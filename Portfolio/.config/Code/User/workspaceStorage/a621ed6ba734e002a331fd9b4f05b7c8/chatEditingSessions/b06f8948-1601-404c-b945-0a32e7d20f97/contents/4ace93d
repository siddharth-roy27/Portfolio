"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    await supabase.auth.signInWithPassword({ email, password });
    router.push("/dashboard");
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>

      <input
        className="w-full p-3 mb-4 border rounded-lg"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full p-3 mb-4 border rounded-lg"
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={login}
        className="w-full py-2 bg-blue-600 text-white rounded-lg"
      >
        Login
      </button>

      <p
        className="text-sm text-blue-600 mt-4 cursor-pointer"
        onClick={() => router.push("/auth/signup")}
      >
        Create an account →
      </p>
    </div>
  );
}
