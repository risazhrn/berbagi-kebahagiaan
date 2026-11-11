import Link from "next/link";
import { Plus } from "lucide-react";
import { requireAdmin } from "@/lib/auth/admin";
import EventsTable from "@/components/admin/event-table";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 10;
const STATUSES = ["draft", "published", "completed", "cancelled"] as const;

type SearchParams = Promise<{
  q?: string;
  status?: string;
  category?: string;
  view?: string;
  page?: string;
  notice?: string;
  warning?: string;
}>;

function escapeSearch(value: string) {
  return value.replace(/[%_\\]/g, "\\$&");
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { supabase } = await requireAdmin();
  const params = await searchParams;

  const search = (params.q ?? "").trim().slice(0, 100);
  const status = STATUSES.find((item) => item === params.status) ?? "all";
  const category = (params.category ?? "all").trim().slice(0, 100) || "all";
  const view: "active" | "archived" =
    params.view === "archived" ? "archived" : "active";

  const rawPage = Number(params.page ?? "1");
  const page = Number.isSafeInteger(rawPage) && rawPage > 0
    ? Math.min(rawPage, 100000)
    : 1;

  // Gunakan string literal agar tipe data Supabase terinferensi dengan benar.
  // Tidak ada lagi kolom is_test_data.
  let query = supabase
    .from("events")
    .select(
      "id,slug,title,category,start_at,end_at,location,price,quota,poster_path,status,created_at,updated_at,is_archived",
      { count: "exact" }
    )
    .eq("is_archived", view === "archived");

  if (search) {
    query = query.ilike("title", `%${escapeSearch(search)}%`);
  }
  if (status !== "all") {
    query = query.eq("status", status);
  }
  if (category !== "all") {
    query = query.eq("category", category);
  }

  const from = (page - 1) * PAGE_SIZE;
  const { data: events, count, error } = await query
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (error) {
    console.error("ADMIN EVENTS ERROR:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
  }

  const { data: categoryRows, error: categoryError } = await supabase
    .from("events")
    .select("category")
    .order("category", { ascending: true })
    .limit(1000);

  if (categoryError) {
    console.error("ADMIN EVENT CATEGORIES ERROR:", categoryError);
  }

  const categories = [...new Set(
    (categoryRows ?? [])
      .map((item) => item.category)
      .filter((item): item is string => typeof item === "string" && item.length > 0)
  )];

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#EE3A77]">
            Events Management
          </p>
          <h1 className="mt-2 font-heading text-2xl font-extrabold text-[#373634] sm:text-3xl">
            Manajemen Kegiatan
          </h1>
          <p className="mt-2 text-sm text-[#6E5F68]">
            Kelola status, arsip, poster, dan publikasi kegiatan.
          </p>
        </div>

        <Link
          href="/admin/dashboard/events/new"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#EE3A77] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#B82053]"
        >
          <Plus size={18} aria-hidden="true" />
          Tambah Kegiatan
        </Link>
      </div>

      {error ? (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          <p className="font-bold">Gagal memuat kegiatan</p>
          <p className="mt-2">
            Periksa terminal server untuk mengetahui penyebab kesalahan Supabase.
          </p>
          {process.env.NODE_ENV === "development" && (
            <p className="mt-3 break-words rounded-lg bg-white p-3 font-mono text-xs">
              {error.code}: {error.message}
            </p>
          )}
        </div>
      ) : (
        <EventsTable
          key={`${search}-${status}-${category}-${view}-${page}`}
          events={events ?? []}
          categories={categories}
          search={search}
          status={status}
          category={category}
          view={view}
          page={page}
          pageSize={PAGE_SIZE}
          total={total}
          totalPages={totalPages}
          notice={params.notice}
          warning={params.warning}
        />
      )}
    </div>
  );
}
