// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const fileName = file.name;

    // For now, return file metadata
    // In production, upload to Supabase Storage or similar
    return NextResponse.json({
      fileName,
      size: bytes.byteLength,
      mimeType: file.type,
      message: "File received (configure Supabase Storage for persistent uploads)",
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
