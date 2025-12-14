import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import pdf from "pdf-parse";
import mammoth from "mammoth";
import { supabaseAdmin } from "@/lib/supabaseServer";

// disable next default body parser
export const runtime = "nodejs";
export const revalidate = 0;
export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  // parse multipart
  const form = new formidable.IncomingForm({ keepExtensions: true });
  const parsed = await new Promise<{ file: formidable.File }>((resolve, reject) => {
    form.parse(req as any, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ file: files.file });
    });
  });

  const file = parsed.file;
  if (!file) return NextResponse.json({ error: "no file" }, { status: 400 });

  // Read file buffer
  const buffer = fs.readFileSync(file.filepath);

  // upload to supabase storage
  const filename = `${Date.now()}_${path.basename(file.originalFilename || file.newFilename)}`;
  const bucket = "uploads";
  const { data: uploadData, error: uploadErr } = await supabaseAdmin.storage.from(bucket).upload(filename, buffer, {
    contentType: file.mimetype || undefined,
    upsert: false,
  });

  if (uploadErr) {
    console.error("uploadErr", uploadErr);
    return NextResponse.json({ error: uploadErr.message }, { status: 500 });
  }

  const { data: publicData } = supabaseAdmin.storage.from(bucket).getPublicUrl(uploadData.path);

  let extractedText: string | null = null;
  // do lightweight extraction for pdf and docx
  const lower = (file.originalFilename || "").toLowerCase();
  try {
    if (lower.endsWith(".pdf")) {
      const parsedPdf = await pdf(buffer);
      extractedText = parsedPdf.text;
    } else if (lower.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else {
      // other types: return only public url (PPTX/doc non-docx not extracted here)
    }
  } catch (err) {
    console.error("extraction error", err);
  }

  return NextResponse.json({
    publicUrl: publicData.publicUrl,
    extractedText,
  });
}
