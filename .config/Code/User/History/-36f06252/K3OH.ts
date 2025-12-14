import { NextRequest, NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false, // required for formidable
  },
};

export async function POST(req: NextRequest) {
  const data = await new Promise<{ file: formidable.File }>((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req as any, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ file: (files.file as formidable.File) });
    });
  });

  const file = data.file;
  const filePath = `./public/uploads/${file.originalFilename}`;
  fs.renameSync(file.filepath, filePath);

  return NextResponse.json({ url: `/uploads/${file.originalFilename}` });
}
