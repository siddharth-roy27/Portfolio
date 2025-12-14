// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import pdf from "pdf-parse";
import mammoth from "mammoth";
import { supabaseAdmin } from "@/lib/supabaseServer";

export const runtime = "nodejs";
export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  try {
    // parse multipart form
    const form = new formidable.IncomingForm({ keepExtensions: true });
    const parsed = await new Promise<{ file: formidable.File }>((resolve, reject) => {
      form.parse(req as any, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ file: (files.file as formidable.File) });
      });
    });

    const file = parsed.file;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    // read buffer
    const buffer = fs.readFileSync(file.filepath);

    // upload to supabase storage
    const filename = `${Date.now()}_${file.originalFilename}`;
    const bucket = "uploads";
    const { data: uploadData, error: uploadErr } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filename, buffer, {
        contentType: file.mimetype || undefined,
        upsert: false,
      });

    if (uploadErr) {
      console.error("Supabase upload error", uploadErr);
      return NextResponse.json({ error: uploadErr.message }, { status: 500 });
    }

    const { data: publicData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(uploadData.path);

    // extract text for PDFs and DOCX
    let extractedText: string | null = null;
    const lower = (file.originalFilename || "").toLowerCase();
    try {
      if (lower.endsWith(".pdf")) {
        const parsedPdf = await pdf(buffer);
        extractedText = parsedPdf.text;
      } else if (lower.endsWith(".docx")) {
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value;
      }
    } catch (err) {
      console.error("Text extraction error", err);
    }

    return NextResponse.json({
      publicUrl: publicData.publicUrl,
      extractedText,
    });
  } catch (err) {
    console.error("Upload failed", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
