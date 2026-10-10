import { put } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getEnvironment } from "@/lib/env";

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const signatures: Record<string, (bytes: Uint8Array) => boolean> = {
  "image/jpeg": (bytes) => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
  "image/png": (bytes) => [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((byte, index) => bytes[index] === byte),
  "image/webp": (bytes) => new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" && new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP",
};

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "FARMER") return NextResponse.json({ ok: false, code: "FORBIDDEN", message: "Nuk keni qasje." }, { status: 403 });
  if (!getEnvironment().BLOB_READ_WRITE_TOKEN) return NextResponse.json({ ok: false, code: "INTERNAL", message: "Ruajtja e fotove nuk është konfiguruar." }, { status: 503 });
  const formData = await request.formData();
  const files = formData.getAll("photos").filter((value): value is File => value instanceof File);
  if (files.length < 1 || files.length > 3) return NextResponse.json({ ok: false, code: "VALIDATION", message: "Ngarkoni nga 1 deri në 3 foto." }, { status: 400 });
  const urls: string[] = [];
  for (const file of files) {
    const signature = signatures[file.type];
    const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    if (!signature || file.size === 0 || file.size > MAX_FILE_BYTES || !signature(bytes)) return NextResponse.json({ ok: false, code: "VALIDATION", message: "Fotoja duhet të jetë JPEG, PNG ose WebP dhe deri 5 MB." }, { status: 400 });
    const extension = file.type === "image/jpeg" ? "jpg" : file.type === "image/png" ? "png" : "webp";
    const blob = await put(`products/${user.id}/${randomUUID()}.${extension}`, file, { access: "public", contentType: file.type, addRandomSuffix: false });
    urls.push(blob.url);
  }
  return NextResponse.json({ ok: true, data: { urls } }, { status: 201 });
}
