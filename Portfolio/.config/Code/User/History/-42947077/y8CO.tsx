import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <h1 className="text-5xl font-bold mb-4">Welcome to NoteForge</h1>
      <p className="text-lg text-gray-700 mb-6">
        A modern notes app with Supabase & TipTap.
      </p>
      <div className="flex gap-4">
        <Link
          href="/auth/login"
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Log In
        </Link>
        <Link
          href="/auth/signup"
          className="px-6 py-3 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
