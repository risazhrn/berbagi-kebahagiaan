import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export function errorJson(message: string, status: number, errors?: Record<string, string>) {
  return NextResponse.json({ error: message, ...(errors ? { errors } : {}) }, { status });
}

export async function adminSession() {
  const supabase = await createClient();
  const { data: claims, error: authError } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (authError || !userId) return { supabase, userId: null, status: 401 as const };
  const { data: admin, error: adminError } = await supabase
    .from("admins").select("id").eq("id", userId).maybeSingle();
  return { supabase, userId: adminError || !admin ? null : userId, status: adminError || !admin ? 403 as const : 200 as const };
}

export async function verifyPoster(
  supabase: Awaited<ReturnType<typeof createClient>>,
  path: string,
  userId: string,
  excludeEventId?: string
): Promise<string | null> {
  const fileName = path.split("/").pop()!;
  const { data: files, error: fileError } = await supabase.storage
    .from("event-posters").list(`posters/${userId}`, { search: fileName, limit: 100 });
  if (fileError || !files?.some(f => f.name === fileName)) return "Poster tidak ditemukan di Storage. Ulangi upload.";
  let query = supabase.from("events").select("id").eq("poster_path", path).limit(1);
  if (excludeEventId) query = query.neq("id", excludeEventId);
  const { data: references, error: refError } = await query;
  if (refError) return "Gagal memeriksa penggunaan poster.";
  if (references?.length) return "Poster ini sudah digunakan kegiatan lain.";
  return null;
}

export async function cleanupOldPoster(
  supabase: Awaited<ReturnType<typeof createClient>>,
  path: string | null,
  excludeEventId?: string
): Promise<string | null> {
  if (!path) return null;
  // Never delete arbitrary Storage objects from client-provided paths.
  if (!/^posters\/[0-9a-f-]{36}\/[0-9a-f-]{36}\.(jpg|png|webp)$/i.test(path)) {
    return "Poster lama memakai format path lama; bersihkan secara manual setelah memastikan tidak digunakan.";
  }
  let query = supabase.from("events").select("id").eq("poster_path", path).limit(1);
  if (excludeEventId) query = query.neq("id", excludeEventId);
  const { data, error } = await query;
  if (error) return "Perubahan disimpan, tetapi pemeriksaan poster lama gagal.";
  if (data?.length) return null;
  const { error: removeError } = await supabase.storage.from("event-posters").remove([path]);
  if (removeError) {
    console.error("Poster cleanup failed:", removeError.message);
    return "Perubahan tersimpan, tetapi file poster lama belum berhasil dihapus.";
  }
  return null;
}
