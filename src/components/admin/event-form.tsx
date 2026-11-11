"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, CalendarDays, ImagePlus, LoaderCircle, MapPin, Save, Ticket, Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { EventErrors, EventField } from "@/lib/events/validation";

export type EventData = {
  id: string; title: string; category: string; description: string;
  start_at: string; end_at: string; price: number; quota: number;
  location: string; address: string | null; poster_path: string | null; status: string;
};

type Props = { mode: "create" | "edit"; event?: EventData };
const BACK = "/admin/dashboard/events";
const MAX_IMAGE = 3 * 1024 * 1024;
const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const control = "mt-1.5 w-full min-w-0 rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#373634] outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60";
const label = "block text-xs font-semibold text-[#373634]";

function toWib(iso: string): string {
  const f = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  const parts = f.formatToParts(new Date(iso));
  const take = (name: string) => parts.find(x => x.type === name)?.value ?? "";
  return `${take("year")}-${take("month")}-${take("day")}T${take("hour")}:${take("minute")}`;
}

function Section({ title, icon: Icon, children }: {
  title: string; icon: typeof CalendarDays; children: React.ReactNode;
}) {
  return <section className="space-y-3">
    <h3 className="flex items-center gap-2 text-sm font-bold text-[#373634]"><Icon className="text-[#EE3A77]" size={17}/>{title}</h3>
    {children}
  </section>;
}

function ErrorText({ text }: { text?: string }) {
  return text ? <p className="mt-1 text-xs text-red-600" role="alert">{text}</p> : null;
}

export default function EventForm({ mode, event }: Props) {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const fileRef = useRef<HTMLInputElement>(null);
  const [poster, setPoster] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [errors, setErrors] = useState<EventErrors>({});
  const [startAt, setStartAt] = useState(event ? toWib(event.start_at) : "");
  const [endAt, setEndAt] = useState(event ? toWib(event.end_at) : "");
  const isEdit = mode === "edit";
  const editable = !isEdit || event?.status === "draft" || event?.status === "published";
  const currentPoster = event?.poster_path
    ? supabase.storage.from("event-posters").getPublicUrl(event.poster_path).data.publicUrl
    : null;

  useEffect(() => {
    if (!poster) { setPreview(null); return; }
    const url = URL.createObjectURL(poster);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [poster]);

  function clearError(field: EventField) {
    setErrors(previous => ({ ...previous, [field]: undefined }));
  }

  function choosePoster(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    clearError("poster_path");
    setGeneralError("");
    if (!TYPES[file.type]) {
      setErrors(old => ({ ...old, poster_path: "Format harus JPG, PNG, atau WebP." }));
      e.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE) {
      setErrors(old => ({ ...old, poster_path: "Ukuran poster maksimal 3 MB." }));
      e.target.value = "";
      return;
    }
    setPoster(file);
  }

  function discardPoster() {
    setPoster(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function uploadPoster(file: File) {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error("Sesi admin berakhir. Silakan login kembali.");
    const ext = TYPES[file.type];
    if (!ext || file.size > MAX_IMAGE) throw new Error("Poster tidak valid atau terlalu besar.");
    const path = `posters/${user.id}/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("event-posters")
      .upload(path, file, { contentType: file.type, upsert: false });
    if (uploadError) throw new Error(`Upload poster gagal: ${uploadError.message}`);
    return path;
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy || !editable) return;
    const form = new FormData(e.currentTarget);
    const val = (name: string) => String(form.get(name) ?? "").trim();
    const payload = {
      title: val("title"), category: val("category"), description: val("description"),
      start_at: startAt, end_at: endAt, price: Number(val("price")), quota: Number(val("quota")),
      location: val("location"), address: val("address") || null,
    };
    const clientErrors: EventErrors = {};
    if (payload.title.length < 3 || payload.title.length > 200) clientErrors.title = "Nama kegiatan harus 3–200 karakter.";
    if (!payload.category || payload.category.length > 100) clientErrors.category = "Kategori wajib diisi (maksimal 100 karakter).";
    if (!payload.description || payload.description.length > 10000) clientErrors.description = "Deskripsi wajib diisi (maksimal 10.000 karakter).";
    if (!payload.location || payload.location.length > 200) clientErrors.location = "Nama lokasi wajib diisi (maksimal 200 karakter).";
    if ((payload.address ?? "").length > 1000) clientErrors.address = "Alamat maksimal 1.000 karakter.";
    if (!startAt) clientErrors.start_at = "Isi tanggal dan jam mulai.";
    if (!endAt || (startAt && endAt <= startAt)) clientErrors.end_at = "Waktu selesai harus setelah waktu mulai.";
    if (!Number.isSafeInteger(payload.price) || payload.price <= 0 || payload.price > 2147483647) clientErrors.price = "Harga harus bilangan bulat lebih dari Rp0.";
    if (!Number.isSafeInteger(payload.quota) || payload.quota <= 0 || payload.quota > 2147483647) clientErrors.quota = "Kuota harus bilangan bulat lebih dari 0.";
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors);
      setGeneralError("Periksa kembali kolom yang ditandai merah.");
      return;
    }
    setBusy(true);
    setErrors({});
    setGeneralError("");
    try {
      const newPath = poster ? await uploadPoster(poster) : null;
      const url = isEdit ? `/api/admin/events/${event!.id}` : "/api/admin/events";
      const requestPayload = {
        ...payload,
        ...(isEdit ? (newPath ? { poster_path: newPath } : {}) : { poster_path: newPath }),
      };
      const response = await fetch(url, {
        method: isEdit ? "PATCH" : "POST", credentials: "same-origin",
        headers: { "Content-Type": "application/json" }, body: JSON.stringify(requestPayload),
      });
      if (!response.headers.get("content-type")?.includes("application/json")) {
        throw new Error(`API tidak mengembalikan JSON (HTTP ${response.status}). Periksa terminal Next.js.`);
      }
      const result: { error?: string; errors?: EventErrors; warning?: string | null } = await response.json();
      if (!response.ok) {
        if (result.errors) setErrors(result.errors);
        throw new Error(result.error ?? `Gagal menyimpan kegiatan (HTTP ${response.status}).`);
      }
      const params = new URLSearchParams({ notice: isEdit ? "updated" : "created" });
      if (result.warning) params.set("warning", "poster_cleanup");
      router.replace(`${BACK}?${params.toString()}`);
      router.refresh();
    } catch (error) {
      setGeneralError(error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan.");
      // Do not delete the freshly uploaded poster on ambiguous network failure:
      // the DB update could have completed. A periodic orphan cleanup can handle unused files.
    } finally { setBusy(false); }
  }

  const field = (name: EventField) => `${control} ${errors[name]
    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
    : "border-[#EEDFE5] focus:border-[#EE3A77] focus:ring-[#EE3A77]/10"}`;

  return <form onSubmit={submit} noValidate className="space-y-4">
    {!editable && <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">Event sudah bukan draft, sehingga perubahan dikunci.</div>}
    <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0 space-y-4 rounded-2xl border border-[#F2E4E9] bg-white p-4 sm:p-5">
        <Section icon={CalendarDays} title="Informasi Kegiatan">
          <div><label className={label} htmlFor="bk-title">Nama Kegiatan *</label>
            <input id="bk-title" name="title" defaultValue={event?.title ?? ""} maxLength={200} disabled={!editable || busy}
              placeholder="Contoh: Workshop Kreatif" className={field("title")} onChange={() => clearError("title")} />
            <ErrorText text={errors.title}/></div>
          <div><label className={label} htmlFor="bk-category">Kategori *</label>
            <input id="bk-category" name="category" defaultValue={event?.category ?? ""} maxLength={100} disabled={!editable || busy}
              placeholder="Aktivitas Kreatif" className={field("category")} onChange={() => clearError("category")} />
            <ErrorText text={errors.category}/></div>
          <div><label className={label} htmlFor="bk-description">Deskripsi *</label>
            <textarea id="bk-description" name="description" defaultValue={event?.description ?? ""} rows={3} maxLength={10000}
              disabled={!editable || busy} placeholder="Jelaskan kegiatan dan manfaatnya..." className={`${field("description")} resize-y`}
              onChange={() => clearError("description")} />
            <ErrorText text={errors.description}/></div>
        </Section>
        <div className="border-t border-[#F4E9ED]"/>
        <Section icon={CalendarDays} title="Jadwal">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="min-w-0"><label className={label} htmlFor="bk-start">Mulai (WIB) *</label>
              <input id="bk-start" name="start_at" type="datetime-local" value={startAt} disabled={!editable || busy}
                onChange={e => {setStartAt(e.target.value); clearError("start_at");}} className={field("start_at")}/>
              <ErrorText text={errors.start_at}/></div>
            <div className="min-w-0"><label className={label} htmlFor="bk-end">Selesai (WIB) *</label>
              <input id="bk-end" name="end_at" type="datetime-local" value={endAt} min={startAt || undefined} disabled={!editable || busy}
                onChange={e => {setEndAt(e.target.value); clearError("end_at");}} className={field("end_at")}/>
              <ErrorText text={errors.end_at}/></div>
          </div>
        </Section>
        <div className="border-t border-[#F4E9ED]"/>
        <Section icon={Ticket} title="Tiket & Kuota">
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className={label} htmlFor="bk-price">Harga Tiket (Rp) *</label>
              <input id="bk-price" name="price" type="number" min={1} step={1} max={2147483647} defaultValue={event?.price ?? ""} disabled={!editable || busy}
                placeholder="50000" className={field("price")} onChange={() => clearError("price")}/><ErrorText text={errors.price}/></div>
            <div><label className={label} htmlFor="bk-quota">Kuota Peserta *</label>
              <input id="bk-quota" name="quota" type="number" min={1} step={1} max={2147483647} defaultValue={event?.quota ?? ""} disabled={!editable || busy}
                placeholder="35" className={field("quota")} onChange={() => clearError("quota")}/><ErrorText text={errors.quota}/></div>
          </div>
        </Section>
        <div className="border-t border-[#F4E9ED]"/>
        <Section icon={MapPin} title="Lokasi">
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className={label} htmlFor="bk-location">Nama Lokasi *</label>
              <input id="bk-location" name="location" defaultValue={event?.location ?? ""} maxLength={200} disabled={!editable || busy}
                placeholder="Bandung" className={field("location")} onChange={() => clearError("location")}/><ErrorText text={errors.location}/></div>
            <div><label className={label} htmlFor="bk-address">Alamat Lengkap</label>
              <input id="bk-address" name="address" defaultValue={event?.address ?? ""} maxLength={1000} disabled={!editable || busy}
                placeholder="Alamat kegiatan" className={field("address")} onChange={() => clearError("address")}/><ErrorText text={errors.address}/></div>
          </div>
        </Section>
      </div>
      <aside className="min-w-0 rounded-2xl border border-[#F2E4E9] bg-white p-4 xl:sticky xl:top-24">
        <h3 className="text-sm font-bold text-[#373634]">Poster Kegiatan</h3>
        <p className="mt-1 text-xs text-[#6E5F68]">Preview landscape untuk website.</p>
        <div className="mt-3 overflow-hidden rounded-xl border border-[#F2E4E9] bg-[#FFF9FB]">
          {preview || currentPoster ?
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview ?? currentPoster ?? ""} alt="Preview poster" className="aspect-video w-full object-contain"/> :
            <div className="flex aspect-video flex-col items-center justify-center gap-2 text-[#EE3A77]"><ImagePlus size={30}/><span className="text-xs text-[#A18B95]">Belum ada poster</span></div>}
        </div>
        {poster && <div className="mt-2 flex items-center justify-between gap-2 rounded-lg bg-[#FFF8FA] p-2">
          <span className="min-w-0 truncate text-xs text-[#6E5F68]">{poster.name} ({(poster.size/1024/1024).toFixed(2)} MB)</span>
          <button type="button" aria-label="Batalkan poster baru" disabled={busy} onClick={discardPoster} className="p-1 text-[#B82053]"><X size={16}/></button>
        </div>}
        <input ref={fileRef} id="bk-poster" type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={!editable || busy} onChange={choosePoster}/>
        {editable && <label htmlFor="bk-poster" className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#FDE8EF] px-4 py-2.5 text-xs font-bold text-[#B82053]"><Upload size={15}/>{currentPoster ? "Ganti Poster" : "Upload Poster"}</label>}
        <ErrorText text={errors.poster_path}/>
        <p className="mt-2 text-center text-[11px] text-[#A18B95]">JPG, PNG, WebP · Maksimal 3 MB</p>
        {isEdit && <p className="mt-3 border-t border-[#F4E9ED] pt-3 text-xs text-[#6E5F68]">Status: <strong className="capitalize">{event?.status}</strong></p>}
      </aside>
    </div>
    {generalError && <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"><AlertCircle size={17} className="mt-0.5 shrink-0"/>{generalError}</div>}
    <div className="sticky bottom-0 z-10 flex flex-wrap justify-end gap-2 rounded-xl border border-[#F2E4E9] bg-white/95 p-3 shadow-sm backdrop-blur">
      <Link href={BACK} className="rounded-full border border-[#F2E4E9] px-5 py-2.5 text-sm font-semibold text-[#6E5F68]">Batal</Link>
      {editable && <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-[#EE3A77] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#B82053] disabled:opacity-60">
        {busy ? <LoaderCircle size={17} className="animate-spin"/> : <Save size={17}/>} {busy ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan Draft"}
      </button>}
    </div>
  </form>;
}
