"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { EventCard } from "@/components/event-card";
import {
  PUBLIC_EVENT_PAGE_SIZE,
  type PublicEvent,
} from "@/lib/events/event-model";

type Tab = "upcoming" | "past";

type Props = {
  events: PublicEvent[];
  hasMore?: boolean;
};

const REFRESH_INTERVAL_MS = 60_000;

export default function EventsExplorer({ events, hasMore = false }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("upcoming");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const lastRefreshRef = useRef(Date.now());

  // Only refresh when returning to a tab after the minimum interval.
  // It never runs when switching the event tabs or typing a search query.
  useEffect(() => {
    const refreshIfStale = () => {
      if (document.visibilityState !== "visible") return;
      const current = Date.now();
      setNowMs(current);
      if (current - lastRefreshRef.current < REFRESH_INTERVAL_MS) return;
      lastRefreshRef.current = current;
      router.refresh();
    };

    document.addEventListener("visibilitychange", refreshIfStale);
    window.addEventListener("focus", refreshIfStale);
    return () => {
      document.removeEventListener("visibilitychange", refreshIfStale);
      window.removeEventListener("focus", refreshIfStale);
    };
  }, [router]);

  const lists = useMemo(() => {
    const upcoming: PublicEvent[] = [];
    const past: PublicEvent[] = [];

    for (const event of events) {
      const end = Date.parse(event.end_at);
      if (!Number.isFinite(end)) continue;

      if (event.status === "published" && end >= nowMs) {
        upcoming.push(event);
      } else if (
        (event.status === "published" || event.status === "completed") &&
        end < nowMs
      ) {
        past.push(event);
      }
    }

    upcoming.sort((a, b) =>
      Date.parse(a.start_at) - Date.parse(b.start_at)
    );
    past.sort((a, b) => Date.parse(b.end_at) - Date.parse(a.end_at));
    return { upcoming, past };
  }, [events, nowMs]);

  const query = searchInput.trim().toLocaleLowerCase("id-ID");
  const visible = useMemo(() => {
    const items = lists[tab];
    if (!query) return items;
    return items.filter((event) =>
      event.title.toLocaleLowerCase("id-ID").includes(query)
    );
  }, [lists, query, tab]);

  const totalPages = Math.max(
    1,
    Math.ceil(visible.length / PUBLIC_EVENT_PAGE_SIZE)
  );
  const currentPage = Math.min(page, totalPages);
  const pageEvents = useMemo(
    () =>
      visible.slice(
        (currentPage - 1) * PUBLIC_EVENT_PAGE_SIZE,
        currentPage * PUBLIC_EVENT_PAGE_SIZE
      ),
    [visible, currentPage]
  );

  function changeTab(next: Tab) {
    if (next === tab) return;
    setTab(next);
    setPage(1);
  }

  function changePage(next: number) {
    if (next < 1 || next > totalPages) return;
    setPage(next);
  }

  return (
    <section aria-label="Jelajahi kegiatan" className="mt-6 sm:mt-8">
      <div className="rounded-2xl border border-brand-pink/10 bg-white p-3 shadow-sm sm:p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-brand-pink/15 px-3 transition focus-within:border-brand-pink">
            <Search size={18} aria-hidden="true" className="shrink-0 text-brand-pink" />
            <input
              type="search"
              aria-label="Cari kegiatan"
              placeholder="Cari nama kegiatan..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setPage(1);
              }}
              className="min-w-0 flex-1 bg-transparent py-3 text-sm text-brand-text outline-none placeholder:text-brand-muted"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => { setSearchInput(""); setPage(1); }}
                className="shrink-0 text-xs font-semibold text-brand-pink hover:text-brand-dark"
              >
                Hapus
              </button>
            )}
          </div>

          <div
            role="group"
            aria-label="Filter waktu kegiatan"
            className="relative grid w-full grid-cols-2 rounded-full border border-brand-pink/15 bg-brand-soft/40 p-1 md:w-[306px]"
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute bottom-1 top-1 left-1 w-[calc(50%-4px)] rounded-full bg-brand-pink shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                tab === "past" ? "translate-x-full" : "translate-x-0"
              }`}
            />
            <button
              type="button"
              aria-pressed={tab === "upcoming"}
              onClick={() => changeTab("upcoming")}
              className={`relative z-10 whitespace-nowrap rounded-full px-2 py-2.5 text-xs font-bold transition-colors sm:text-sm ${
                tab === "upcoming" ? "text-white" : "text-brand-muted hover:text-brand-pink"
              }`}
            >
              Terdekat ({lists.upcoming.length})
            </button>
            <button
              type="button"
              aria-pressed={tab === "past"}
              onClick={() => changeTab("past")}
              className={`relative z-10 whitespace-nowrap rounded-full px-2 py-2.5 text-xs font-bold transition-colors sm:text-sm ${
                tab === "past" ? "text-white" : "text-brand-muted hover:text-brand-pink"
              }`}
            >
              Sudah Lewat ({lists.past.length})
            </button>
          </div>
        </div>
      </div>

      {hasMore && (
        <p role="status" className="mt-3 rounded-lg bg-amber-50 px-4 py-2 text-xs text-amber-800">
          Daftar melebihi 200 kegiatan. Hanya 200 kegiatan terbaru ditampilkan; pagination server diperlukan untuk menampilkan seluruh arsip.
        </p>
      )}

      <div className="mb-4 mt-5 flex items-center justify-between gap-2">
        <p className="text-sm text-brand-muted">
          <strong className="text-brand-text">{visible.length}</strong>{" "}
          {tab === "upcoming" ? "kegiatan terdekat" : "kegiatan sudah lewat"}
          {query ? " sesuai pencarian" : ""}
        </p>
      </div>

      <div aria-live="polite" aria-atomic="false">
        {pageEvents.length ? (
          <div key={`${tab}-${query}-${currentPage}`} className="grid animate-[bkEventsFade_220ms_ease-out_both] gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 motion-reduce:animate-none">
            {pageEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div key={`empty-${tab}-${query}`} className="flex animate-[bkEventsFade_220ms_ease-out_both] flex-col items-center rounded-3xl border border-brand-pink/10 bg-brand-soft px-5 py-12 text-center motion-reduce:animate-none">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-brand-pink">
              <CalendarDays size={24} />
            </div>
            <h2 className="mt-4 font-heading text-lg font-extrabold text-brand-text">
              {query ? "Kegiatan Tidak Ditemukan" : tab === "upcoming" ? "Belum Ada Kegiatan Terdekat" : "Belum Ada Kegiatan Terdahulu"}
            </h2>
            <p className="mt-2 max-w-md text-sm leading-7 text-brand-muted">
              {query ? "Coba gunakan kata kunci yang berbeda." : tab === "upcoming" ? "Nantikan kegiatan mendatang bersama Berbagi Kebahagiaan." : "Belum ada kegiatan terdahulu yang ditampilkan."}
            </p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <nav aria-label="Navigasi halaman kegiatan" className="mt-8 flex items-center justify-center gap-3">
          <button type="button" disabled={currentPage <= 1} onClick={() => changePage(currentPage - 1)} aria-label="Halaman sebelumnya" className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-pink/15 bg-white text-brand-pink disabled:opacity-40">
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-bold text-brand-text">{currentPage} / {totalPages}</span>
          <button type="button" disabled={currentPage >= totalPages} onClick={() => changePage(currentPage + 1)} aria-label="Halaman berikutnya" className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-pink/15 bg-white text-brand-pink disabled:opacity-40">
            <ChevronRight size={18} />
          </button>
        </nav>
      )}

      {pageEvents.length > 0 && (
        <p className="mt-3 text-center text-xs text-brand-muted">
          {(currentPage - 1) * PUBLIC_EVENT_PAGE_SIZE + 1}–{Math.min(currentPage * PUBLIC_EVENT_PAGE_SIZE, visible.length)} dari {visible.length} kegiatan
        </p>
      )}

      <style>{`
        @keyframes bkEventsFade {
          from { opacity: 0; transform: translateY(7px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
