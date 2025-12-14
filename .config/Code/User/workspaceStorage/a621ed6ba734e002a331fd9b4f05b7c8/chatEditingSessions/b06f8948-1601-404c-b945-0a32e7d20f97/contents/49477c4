"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import "./globals.css";

export default function RootLayout({ children }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
        <Navbar theme={theme} setTheme={setTheme} />
        {children}
      </body>
    </html>
  );
}
