import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.auth.signInWithPassword({
    email, password
  });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  const res = NextResponse.json({ user: data.user });

  // store login access token in cookies
  res.cookies.set("sb-access-token", data.session.access_token, {
    secure: true,
    httpOnly: true,
    sameSite: "strict",
    path: "/",
  });

  res.cookies.set("sb-refresh-token", data.session.refresh_token, {
    secure: true,
    httpOnly: true,
    sameSite: "strict",
    path: "/",
  });

  return res;
}
