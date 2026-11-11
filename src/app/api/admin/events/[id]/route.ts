import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { adminSession, cleanupOldPoster, errorJson, verifyPoster } from "@/lib/events/admin-api";
import { isAdminPosterPath, parseJsonBody, UUID_RE, validateEvent } from "@/lib/events/validation";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };
type EventStatus = "draft" | "published" | "completed" | "cancelled";
type Action = "publish" | "unpublish" | "complete" | "cancel" | "archive" | "restore";

function invalidate(id: string) {
  revalidatePath("/admin/dashboard/events");
  revalidatePath(`/admin/dashboard/events/${id}/edit`);
  revalidatePath("/events");
  revalidatePath("/");
}

export async function PATCH(request: NextRequest, { params }: Context) {
  try {
    const { supabase, userId, status } = await adminSession();
    if (!userId) return errorJson(status === 401 ? "Sesi login berakhir. Silakan login kembali." : "Akses Super Admin diperlukan.", status);
    const { id } = await params;
    if (!UUID_RE.test(id)) return errorJson("ID kegiatan tidak valid.", 400);
    const { data: previous, error: findError } = await supabase.from("events")
      .select("id,status,poster_path,is_archived").eq("id", id).maybeSingle();
    if (findError) return errorJson("Gagal mengambil kegiatan. Pastikan migrasi SQL sudah dijalankan.", 500);
    if (!previous) return errorJson("Kegiatan tidak ditemukan.", 404);
    const body = await parseJsonBody(request);
    if (!body) return errorJson("Request harus berupa JSON valid (maksimal 64 KB).", 400);

    if (Object.prototype.hasOwnProperty.call(body, "action")) {
      if (Object.keys(body).length !== 1) return errorJson("Request aksi hanya boleh berisi action.", 400);
      const action = body.action as Action;
      const current = previous.status as EventStatus;
      const archived = previous.is_archived === true;
      let update: { status?: EventStatus; is_archived?: boolean } = {};
      let message = "Perubahan berhasil disimpan.";
      switch (action) {
        case "publish":
          if (archived || current !== "draft") return errorJson("Hanya draft aktif yang dapat dipublikasikan.", 409);
          if (!previous.poster_path) return errorJson("Tambahkan poster sebelum memublikasikan kegiatan.", 422);
          update = { status: "published" }; message = "Kegiatan berhasil dipublikasikan."; break;
        case "unpublish":
          if (archived || current !== "published") return errorJson("Hanya kegiatan published yang dapat di-unpublish.", 409);
          update = { status: "draft" }; message = "Kegiatan dikembalikan menjadi draft."; break;
        case "complete":
          if (archived || current !== "published") return errorJson("Hanya kegiatan published yang dapat ditandai selesai.", 409);
          update = { status: "completed" }; message = "Kegiatan ditandai selesai."; break;
        case "cancel":
          if (archived || current !== "published") return errorJson("Hanya kegiatan published yang dapat dibatalkan.", 409);
          update = { status: "cancelled" }; message = "Kegiatan berhasil dibatalkan."; break;
        case "archive":
          if (archived || !["completed", "cancelled"].includes(current)) return errorJson("Hanya kegiatan completed/cancelled yang bisa diarsipkan.", 409);
          update = { is_archived: true }; message = "Kegiatan dipindahkan ke arsip."; break;
        case "restore":
          if (!archived) return errorJson("Kegiatan ini belum diarsipkan.", 409);
          update = { is_archived: false }; message = "Kegiatan dikembalikan dari arsip."; break;
        default: return errorJson("Aksi tidak dikenal.", 400);
      }
      const { data: updated, error } = await supabase.from("events")
        .update(update).eq("id", id).eq("status", current).eq("is_archived", archived)
        .select("id,status,is_archived").maybeSingle();
      if (error) { console.error("Update action failed", error); return errorJson("Aksi gagal diproses.", 500); }
      if (!updated) return errorJson("Data berubah. Muat ulang halaman dan coba kembali.", 409);
      invalidate(id);
      return NextResponse.json({ message, event: updated });
    }

    // Backward compatibility with the previous publish payload.
    if (Object.prototype.hasOwnProperty.call(body, "status")) {
      if (Object.keys(body).length !== 1 || body.status !== "published" || previous.status !== "draft" || previous.is_archived)
        return errorJson("Hanya draft aktif yang dapat dipublikasikan.", 409);
      if (!previous.poster_path) return errorJson("Tambahkan poster sebelum publikasi.", 422);
      const { data, error } = await supabase.from("events").update({ status: "published" })
        .eq("id", id).eq("status", "draft").eq("is_archived", false).select("id,status").maybeSingle();
      if (error) return errorJson("Gagal memublikasikan kegiatan.", 500);
      if (!data) return errorJson("Status kegiatan sudah berubah.", 409);
      invalidate(id);
      return NextResponse.json({ message: "Kegiatan berhasil dipublikasikan.", event: data });
    }

    // Preserve the existing rule: ordinary edit only for drafts.
    if (previous.status !== "draft" || previous.is_archived) return errorJson("Hanya draft aktif yang boleh diedit.", 409);
    const { data, errors } = validateEvent(body);
    if (!data) return errorJson("Periksa kolom yang ditandai.", 422, errors);
    let posterPath = previous.poster_path as string | null;
    if (Object.prototype.hasOwnProperty.call(body, "poster_path")) {
      if (!isAdminPosterPath(body.poster_path, userId)) return errorJson("Path poster tidak valid.", 422, { poster_path: "Upload poster dari akun admin ini dahulu." });
      if (body.poster_path !== previous.poster_path) {
        const problem = await verifyPoster(supabase, body.poster_path, userId, id);
        if (problem) return errorJson(problem, 422, { poster_path: problem });
      }
      posterPath = body.poster_path;
    }
    const { data: updated, error: updateError } = await supabase.from("events")
      .update({ ...data, poster_path: posterPath }).eq("id", id).eq("status", "draft").eq("is_archived", false)
      .select("id,title,poster_path,status").maybeSingle();
    if (updateError) { console.error("Update event failed", updateError); return errorJson("Gagal memperbarui draft.", 500); }
    if (!updated) return errorJson("Draft sudah berubah. Muat ulang halaman.", 409);
    const warning = previous.poster_path && previous.poster_path !== updated.poster_path
      ? await cleanupOldPoster(supabase, previous.poster_path) : null;
    invalidate(id);
    return NextResponse.json({ message: "Perubahan kegiatan berhasil disimpan.", event: updated, warning });
  } catch (error) {
    console.error("PATCH event failed", error);
    return errorJson("Server mengalami kendala saat memperbarui kegiatan.", 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  try {
    const { supabase, userId, status } = await adminSession();
    if (!userId) return errorJson(status === 401 ? "Sesi login berakhir. Silakan login kembali." : "Akses Super Admin diperlukan.", status);
    const { id } = await params;
    if (!UUID_RE.test(id)) return errorJson("ID kegiatan tidak valid.", 400);
    const { data: old, error: findError } = await supabase.from("events")
      .select("id,status,poster_path,is_archived").eq("id", id).maybeSingle();
    if (findError) return errorJson("Gagal mengambil kegiatan.", 500);
    if (!old) return errorJson("Kegiatan tidak ditemukan.", 404);

    // Penghapusan hanya untuk draft aktif sampai relasi peserta/transaksi
    // diperiksa secara menyeluruh dan aturan penghapusan disepakati.
    if (old.status !== "draft" || old.is_archived) {
      return errorJson("Hanya draft aktif yang dapat dihapus permanen. Arsipkan kegiatan selesai atau dibatalkan.", 403);
    }
    const deleteQuery = supabase.from("events").delete()
      .eq("id", id).eq("status", "draft").eq("is_archived", false);
    const { data: deleted, error } = await deleteQuery.select("id").maybeSingle();
    if (error) {
      console.error("Delete event failed", error);
      return errorJson("Penghapusan ditolak. Pastikan kegiatan tidak memiliki peserta, pembayaran, atau data lain yang terkait.", 409);
    }
    if (!deleted) return errorJson("Kegiatan sudah berubah atau tidak dapat dihapus.", 409);
    const warning = await cleanupOldPoster(supabase, old.poster_path);
    invalidate(id);
    return NextResponse.json({ message: "Data kegiatan berhasil dihapus.", warning });
  } catch (error) {
    console.error("DELETE event failed", error);
    return errorJson("Server mengalami kendala saat menghapus kegiatan.", 500);
  }
}
