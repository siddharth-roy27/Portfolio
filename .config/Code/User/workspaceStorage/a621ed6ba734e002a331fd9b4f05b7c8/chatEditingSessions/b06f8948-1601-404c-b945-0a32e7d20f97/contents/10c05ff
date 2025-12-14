"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [theme, setTheme] = useState("light");
  const router = useRouter();

  // Load user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  // Load theme from system or localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("theme");

    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      document.documentElement.classList.toggle("dark", stored === "dark");
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = prefersDark ? "dark" : "light";

    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  // Sync theme to DOM
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem("theme", theme);
    } catch (_) {}

    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <nav className="
      w-full 
      px-6 py-3 
      flex justify-between items-center
      bg-white/80 dark:bg-gray-900/80
      backdrop-blur-md border-b border-gray-200 dark:border-gray-700
      shadow-sm sticky top-0 z-[50]
    ">
      {/* Logo */}
      <h1
        className="text-2xl font-bold cursor-pointer text-gray-900 dark:text-gray-100"
        onClick={() => router.push("/dashboard")}
      >
        NoteForge
      </h1>

      <div className="flex items-center gap-4">

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="
            p-2 rounded-lg border 
            border-gray-300 dark:border-gray-600 
            bg-gray-50 dark:bg-gray-800 
            hover:bg-gray-200 dark:hover:bg-gray-700 
            transition
          "
        >
          <span className="text-xl">
            {theme === "light" ? "🌙" : "☀️"}
          </span>
        </button>

        {/* User Section */}
        {user ? (
          <div className="flex items-center gap-3">

            {/* Email badge */}
            <span className="hidden sm:block text-sm text-gray-700 dark:text-gray-300 truncate max-w-[150px]">
              {user.email}
            </span>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="
                px-4 py-2 rounded-lg 
                bg-red-500 text-white 
                hover:bg-red-600 transition
              "
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => router.push("/auth/login")}
            className="
              px-4 py-2 rounded-lg 
              bg-blue-600 text-white 
              hover:bg-blue-700 transition
            "
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
