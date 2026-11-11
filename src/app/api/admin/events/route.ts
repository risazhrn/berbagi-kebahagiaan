import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { adminSession, errorJson, verifyPoster } from "@/lib/events/admin-api";
import { isAdminPosterPath, parseJsonBody, slugify, validateEvent } from "@/lib/events/validation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { supabase, userId, status } = await adminSession();
    if (!userId) return errorJson(status === 401 ? "Sesi login berakhir. Silakan login kembali." : "Akses Super Admin diperlukan.", status);
    const body = await parseJsonBody(request);
    if (!body) return errorJson("Request harus berupa JSON valid (maksimal 64 KB).", 400);
    const { data, errors } = validateEvent(body);
    if (!data) return errorJson("Periksa kolom yang ditandai.", 422, errors);
    let posterPath: string | null = null;
    if (body.poster_path != null && body.poster_path !== "") {
      if (!isAdminPosterPath(body.poster_path, userId)) return errorJson("Path poster tidak valid.", 422, { poster_path: "Poster harus berasal dari upload akun admin ini." });
      const problem = await verifyPoster(supabase, body.poster_path, userId);
      if (problem) return errorJson(problem, 422, { poster_path: problem });
      posterPath = body.poster_path;
    }
    const slug = `${slugify(data.title)}-${crypto.randomUUID().slice(0, 8)}`;
    const { data: event, error } = await supabase.from("events")
      .insert({ ...data, slug, status: "draft", poster_path: posterPath })
      .select("id,slug,status,poster_path").single();
    if (error) {
      console.error("Create event failed", error);
      return errorJson("Gagal menyimpan draft. Periksa izin database dan coba lagi.", 500);
    }
    revalidatePath("/admin/dashboard/events");
    revalidatePath("/events");
    return NextResponse.json({ message: "Kegiatan berhasil ditambahkan sebagai draft.", event }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/events", error);
    return errorJson("Server mengalami kendala saat menyimpan kegiatan.", 500);
  }
}
