"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle, Archive, ArchiveRestore, Ban, CalendarDays, CheckCircle2,
  ChevronLeft, ChevronRight, Eye, EyeOff, Pencil, Search, Send, Trash2, X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Status = "draft" | "published" | "completed" | "cancelled";
type Action = "publish" | "unpublish" | "complete" | "cancel" | "archive" | "restore" | "delete";
export type EventRow = {
  id: string; slug: string; title: string; category: string;
  start_at: string; end_at: string; location: string;
  price: number; quota: number; poster_path: string | null;
  status: string; created_at: string; updated_at: string;
  is_archived: boolean;
};
type Props = {
  events: EventRow[]; categories: string[]; search: string; status: string;
  category: string; view: "active" | "archived"; page: number;
  pageSize: number; total: number; totalPages: number;
  notice?: string; warning?: string;
};
type Toast = { kind: "success" | "error" | "warning"; text: string };
type ConfirmState = { event: EventRow; action: Action };

const BASE = "/admin/dashboard/events";
const statusNames: Record<string, string> = {
  draft: "Draft", published: "Published", completed: "Completed", cancelled: "Cancelled",
};
const statusColors: Record<string, string> = {
  draft: "bg-[#FDE8EF] text-[#B82053]",
  published: "bg-green-50 text-green-700",
  completed: "bg-blue-50 text-blue-700",
  cancelled: "bg-gray-100 text-gray-600",
};
const noticeTexts: Record<string, string> = {
  created: "Kegiatan berhasil ditambahkan sebagai draft.",
  updated: "Perubahan kegiatan berhasil disimpan.",
};
const labels: Record<Action, string> = {
  publish: "Publikasikan", unpublish: "Unpublish", complete: "Tandai selesai",
  cancel: "Batalkan", archive: "Arsipkan", restore: "Pulihkan dari arsip",
  delete: "Hapus permanen",
};
const formatDate = (value: string) => new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta",
}).format(new Date(value));
const rupiah = (value: number) => new Intl.NumberFormat("id-ID", {
  style: "currency", currency: "IDR", maximumFractionDigits: 0,
}).format(value);

function IconAction({
  label, children, onClick, danger = false, primary = false, disabled = false,
}: {
  label: string; children: React.ReactNode; onClick: () => void;
  danger?: boolean; primary?: boolean; disabled?: boolean;
}) {
  return <button type="button" title={label} aria-label={label} disabled={disabled} onClick={onClick}
    className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EE3A77] disabled:cursor-not-allowed disabled:opacity-40 ${
      danger ? "border-red-100 text-red-600 hover:bg-red-50" :
      primary ? "border-[#FAD4E0] bg-[#FDE8EF] text-[#B82053] hover:bg-[#FAD5E3]" :
      "border-[#F2E4E9] text-[#76626D] hover:border-[#F5C6D5] hover:bg-[#FFF4F8] hover:text-[#EE3A77]"
    }`}>{children}</button>;
}

export default function EventsTable({
  events, categories, search, status, category, view, page, pageSize,
  total, totalPages, notice, warning,
}: Props) {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [keyword, setKeyword] = useState(search);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<ConfirmState | null>(null);
  const [toast, setToast] = useState<Toast | null>(() =>
    notice && noticeTexts[notice] ? { kind: "success", text: noticeTexts[notice] } : null
  );

  useEffect(() => setKeyword(search), [search]);
  useEffect(() => {
    if (notice && noticeTexts[notice]) setToast({ kind: "success", text: noticeTexts[notice] });
    if (warning === "poster_cleanup") setToast({ kind: "warning", text: "Perubahan tersimpan, tetapi poster lama perlu diperiksa di Storage." });
    if (notice || warning) {
      const url = new URL(window.location.href);
      url.searchParams.delete("notice"); url.searchParams.delete("warning");
      window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    }
  }, [notice, warning]);
  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 5000);
    return () => window.clearTimeout(timeout);
  }, [toast]);
  useEffect(() => {
    if (!confirmation) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !busyId) setConfirmation(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [confirmation, busyId]);

  const makeUrl = (changes: Record<string, string | number>) => {
    const values = { q: search, status, category, view, page, ...changes };
    const p = new URLSearchParams();
    if (values.q) p.set("q", String(values.q));
    if (values.status !== "all") p.set("status", String(values.status));
    if (values.category !== "all") p.set("category", String(values.category));
    if (values.view === "archived") p.set("view", "archived");
    if (Number(values.page) > 1) p.set("page", String(values.page));
    return p.size ? `${BASE}?${p}` : BASE;
  };
  const updateFilter = (key: string, value: string) =>
    router.push(makeUrl({ [key]: value, page: 1 }));

  async function performAction() {
    if (!confirmation || busyId) return;
    const { event: item, action } = confirmation;
    setBusyId(item.id);
    try {
      const response = await fetch(`/api/admin/events/${item.id}`, {
        method: action === "delete" ? "DELETE" : "PATCH",
        credentials: "same-origin",
        ...(action === "delete" ? {} : {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        }),
      });
      if (!response.headers.get("content-type")?.includes("application/json")) {
        throw new Error(`Server tidak mengembalikan JSON (HTTP ${response.status}).`);
      }
      const result: { error?: string; message?: string; warning?: string | null } = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Operasi gagal.");
      setToast({ kind: result.warning ? "warning" : "success", text: result.warning ?? result.message ?? "Perubahan berhasil." });
      setConfirmation(null);
      router.refresh();
    } catch (error) {
      setToast({ kind: "error", text: error instanceof Error ? error.message : "Terjadi kesalahan." });
      setConfirmation(null);
    } finally {
      setBusyId(null);
    }
  }

  function ask(item: EventRow, action: Action) {
    if (busyId) return;
    setConfirmation({ event: item, action });
  }

  return <section className="overflow-hidden rounded-2xl border border-[#F2E4E9] bg-white">
    {/* TOAST */}
    {toast && <div role={toast.kind === "error" ? "alert" : "status"}
      className="fixed right-4 top-20 z-[90] flex max-w-[min(420px,calc(100vw-32px))] items-start gap-3 rounded-xl border border-[#F2E4E9] bg-white px-4 py-3 shadow-xl">
      {toast.kind === "success" ? <CheckCircle2 className="mt-0.5 shrink-0 text-green-600" size={20}/> :
        <AlertCircle size={20} className={`mt-0.5 shrink-0 ${toast.kind === "error" ? "text-red-600" : "text-amber-600"}`}/>}
      <p className="flex-1 text-sm text-[#373634]">{toast.text}</p>
      <button type="button" aria-label="Tutup notifikasi" onClick={() => setToast(null)} className="text-[#6E5F68]"><X size={18}/></button>
    </div>}

    {/* ACTIVE / ARCHIVED */}
    <div className="border-b border-[#F2E4E9] px-4 pt-4 sm:px-5">
      <div className="flex gap-5" role="tablist" aria-label="Tampilan kegiatan">
        {[{ key: "active", label: "Kegiatan Aktif" }, { key: "archived", label: "Arsip Kegiatan" }].map(v =>
          <button key={v.key} type="button" role="tab" aria-selected={view === v.key}
            onClick={() => updateFilter("view", v.key)}
            className={`border-b-2 px-1 pb-3 text-sm font-bold transition-colors ${view === v.key ? "border-[#EE3A77] text-[#EE3A77]" : "border-transparent text-[#796B74] hover:text-[#EE3A77]"}`}>
            {v.label}
          </button>
        )}
      </div>
    </div>

    {/* FILTERS */}
    <div className="border-b border-[#F2E4E9] p-4 sm:p-5">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_160px_185px]">
        <form className="flex items-center gap-2 rounded-xl border border-[#F0DDE4] px-3" onSubmit={e => { e.preventDefault(); updateFilter("q", keyword.trim()); }}>
          <Search size={17} className="shrink-0 text-[#A18B95]"/>
          <input aria-label="Cari kegiatan" placeholder="Cari nama kegiatan..." value={keyword}
            onChange={e => setKeyword(e.target.value)} className="min-w-0 flex-1 py-3 text-sm outline-none"/>
          <button className="text-xs font-bold text-[#EE3A77]" type="submit">Cari</button>
        </form>
        <select aria-label="Filter status" value={status} onChange={e => updateFilter("status", e.target.value)} className="rounded-xl border border-[#F0DDE4] bg-white px-3 py-3 text-sm">
          <option value="all">Semua Status</option><option value="draft">Draft</option><option value="published">Published</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option>
        </select>
        <select aria-label="Filter kategori" value={category} onChange={e => updateFilter("category", e.target.value)} className="rounded-xl border border-[#F0DDE4] bg-white px-3 py-3 text-sm">
          <option value="all">Semua Kategori</option>{categories.map(c => <option value={c} key={c}>{c}</option>)}
        </select>
      </div>
    </div>

    {/* TABLE */}
    <div className="overflow-x-auto">
      <table className="w-full min-w-[880px] text-left">
        <thead className="bg-[#FFF8FA] text-[11px] uppercase tracking-wide text-[#8B7480]">
          <tr><th className="px-5 py-4">Kegiatan</th><th className="px-5 py-4">Jadwal</th><th className="px-5 py-4">Tiket</th><th className="px-5 py-4">Status</th><th className="px-5 py-4 text-right">Aksi</th></tr>
        </thead>
        <tbody>{events.map(item => {
          const url = item.poster_path ? supabase.storage.from("event-posters").getPublicUrl(item.poster_path).data.publicUrl : null;
          const canDelete = item.status === "draft";
          return <tr key={item.id} className="border-t border-[#F6EAF0] hover:bg-[#FFFAFC]">
            <td className="px-5 py-4"><div className="flex items-center gap-3">
              {url ?
                // eslint-disable-next-line @next/next/no-img-element
                <img key={`${item.id}-${item.poster_path}-${item.updated_at}`} src={url} alt={`Poster ${item.title}`} className="h-14 w-20 shrink-0 rounded-lg object-cover"/> :
                <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-[#FDE8EF]"><CalendarDays className="text-[#EE3A77]" size={20}/></div>}
              <div className="min-w-0"><p className="max-w-64 truncate text-sm font-bold text-[#373634]">{item.title}</p>
                <p className="mt-1 text-xs text-[#6E5F68]">{item.category} · {item.location}</p>
              </div>
            </div></td>
            <td className="px-5 py-4 text-xs text-[#6E5F68]">{formatDate(item.start_at)}</td>
            <td className="px-5 py-4"><p className="text-sm font-semibold text-[#373634]">{rupiah(item.price)}</p><p className="mt-1 text-xs text-[#6E5F68]">Kuota {item.quota}</p></td>
            <td className="px-5 py-4"><span className={`rounded-full px-3 py-1.5 text-xs font-bold ${statusColors[item.status] ?? statusColors.draft}`}>{statusNames[item.status] ?? item.status}</span></td>
            <td className="px-5 py-4"><div className="flex justify-end gap-1.5">
              {item.is_archived ? <>
                {(item.status === "completed" || item.status === "published") &&
                  <Link href={`/events/${item.slug}`} target="_blank" rel="noopener noreferrer" title="Lihat kegiatan" aria-label={`Lihat ${item.title}`} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#F2E4E9] text-[#76626D] hover:bg-[#FFF4F8]"><Eye size={17}/></Link>}
                <IconAction label={`Pulihkan ${item.title} dari arsip`} primary disabled={busyId !== null} onClick={() => ask(item, "restore")}><ArchiveRestore size={17}/></IconAction>
                {canDelete && <IconAction label={`Hapus ${item.title}`} danger disabled={busyId !== null} onClick={() => ask(item, "delete")}><Trash2 size={17}/></IconAction>}
              </> : <>
                {item.status === "draft" && <>
                  <Link href={`${BASE}/${item.id}/edit`} title="Edit draft" aria-label={`Edit ${item.title}`} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#F2E4E9] text-[#76626D] hover:bg-[#FFF4F8] hover:text-[#EE3A77]"><Pencil size={17}/></Link>
                  <IconAction label={`Publikasikan ${item.title}`} primary disabled={busyId !== null} onClick={() => ask(item, "publish")}><Send size={17}/></IconAction>
                </>}
                {item.status === "published" && <>
                  <Link href={`/events/${item.slug}`} target="_blank" rel="noopener noreferrer" title="Lihat kegiatan" aria-label={`Lihat ${item.title}`} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#F2E4E9] text-[#76626D] hover:bg-[#FFF4F8]"><Eye size={17}/></Link>
                  <IconAction label={`Unpublish ${item.title}`} disabled={busyId !== null} onClick={() => ask(item, "unpublish")}><EyeOff size={17}/></IconAction>
                  <IconAction label={`Tandai ${item.title} selesai`} primary disabled={busyId !== null} onClick={() => ask(item, "complete")}><CheckCircle2 size={17}/></IconAction>
                  <IconAction label={`Batalkan ${item.title}`} danger disabled={busyId !== null} onClick={() => ask(item, "cancel")}><Ban size={17}/></IconAction>
                </>}
                {(item.status === "completed" || item.status === "cancelled") && <>
                  {item.status === "completed" && <Link href={`/events/${item.slug}`} target="_blank" rel="noopener noreferrer" title="Lihat kegiatan" aria-label={`Lihat ${item.title}`} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#F2E4E9] text-[#76626D] hover:bg-[#FFF4F8]"><Eye size={17}/></Link>}
                  <IconAction label={`Arsipkan ${item.title}`} primary disabled={busyId !== null} onClick={() => ask(item, "archive")}><Archive size={17}/></IconAction>
                </>}
                {canDelete && <IconAction label={`Hapus ${item.title} permanen`} danger disabled={busyId !== null} onClick={() => ask(item, "delete")}><Trash2 size={17}/></IconAction>}
              </>}
            </div></td>
          </tr>;
        })}</tbody>
      </table>
      {events.length === 0 && <div className="px-5 py-14 text-center"><CalendarDays size={30} className="mx-auto text-[#EE3A77]"/><p className="mt-3 font-semibold">Tidak ada kegiatan</p><p className="mt-1 text-sm text-[#6E5F68]">Ubah filter atau tambahkan kegiatan baru.</p></div>}
    </div>

    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#F2E4E9] px-5 py-4">
      <p className="text-xs text-[#6E5F68]">{total === 0 ? "0 kegiatan" : `${(page-1)*pageSize+1}–${Math.min(page*pageSize,total)} dari ${total} kegiatan`}</p>
      <div className="flex items-center gap-3">
        <button type="button" disabled={page<=1} onClick={() => router.push(makeUrl({page:page-1}))} className="rounded-lg border border-[#F2E4E9] p-2 disabled:opacity-40" aria-label="Halaman sebelumnya"><ChevronLeft size={18}/></button>
        <span className="text-sm font-semibold">{page} / {totalPages}</span>
        <button type="button" disabled={page>=totalPages} onClick={() => router.push(makeUrl({page:page+1}))} className="rounded-lg border border-[#F2E4E9] p-2 disabled:opacity-40" aria-label="Halaman berikutnya"><ChevronRight size={18}/></button>
      </div>
    </div>

    {/* CONFIRMATION MODAL */}
    {confirmation && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4" onMouseDown={e => { if (e.target === e.currentTarget && !busyId) setConfirmation(null); }}>
      <div role="alertdialog" aria-modal="true" aria-labelledby="action-title" aria-describedby="action-description" className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${confirmation.action === "delete" || confirmation.action === "cancel" ? "bg-red-50 text-red-600" : "bg-[#FDE8EF] text-[#B82053]"}`}>
          {confirmation.action === "delete" ? <Trash2 size={22}/> : confirmation.action === "archive" ? <Archive size={22}/> : <CheckCircle2 size={22}/>}
        </div>
        <h3 id="action-title" className="text-xl font-extrabold text-[#373634]">{labels[confirmation.action]} kegiatan?</h3>
        <p id="action-description" className="mt-3 text-sm leading-6 text-[#6E5F68]">
          Kegiatan <strong className="text-[#373634]">{confirmation.event.title}</strong> akan {confirmation.action === "delete"
            ? "dihapus PERMANEN. Data yang sudah dihapus tidak dapat dikembalikan."
            : confirmation.action === "archive" ? "dipindahkan ke tab Arsip Kegiatan, tanpa menghapus database."
            : confirmation.action === "restore" ? "dikembalikan ke daftar kegiatan aktif."
            : `diproses dengan aksi ${labels[confirmation.action].toLowerCase()}.`}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" disabled={busyId !== null} onClick={() => setConfirmation(null)} className="rounded-xl border border-[#F2E4E9] px-4 py-2.5 text-sm font-semibold text-[#6E5F68]">Batal</button>
          <button type="button" disabled={busyId !== null} onClick={performAction}
            className={`rounded-xl px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50 ${confirmation.action === "delete" || confirmation.action === "cancel" ? "bg-red-600 hover:bg-red-700" : "bg-[#EE3A77] hover:bg-[#B82053]"}`}>
            {busyId ? "Memproses..." : `Ya, ${labels[confirmation.action]}`}
          </button>
        </div>
      </div>
    </div>}
  </section>;
}
