
"use client";

import { useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";

import { EventCard } from "@/components/event-card";
import type { DemoEvent } from "@/data/demo-events";

type EventsExplorerProps = {
  events: DemoEvent[];
};

const ITEMS_PER_PAGE = 6;

export default function EventsExplorer({
  events,
}: EventsExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const sectionRef = useRef<HTMLElement>(null);

  // Search events based on keyword
  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase("id-ID");

    if (!query) return events;

    return events.filter((event) => {
      const searchableText = [
        event.title,
        event.category,
        event.location,
        event.description,
      ]
        .join(" ")
        .toLocaleLowerCase("id-ID");

      return searchableText.includes(query);
    });
  }, [events, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(
    filteredEvents.length / ITEMS_PER_PAGE
  );

  const safePage = Math.min(
    currentPage,
    Math.max(1, totalPages)
  );

  const paginatedEvents = useMemo(() => {
    const startIndex = (safePage - 1) * ITEMS_PER_PAGE;

    return filteredEvents.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredEvents, safePage]);

  // Generate maximum 5 page numbers
  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
    }

    const startPage = Math.max(
      1,
      Math.min(safePage - 2, totalPages - 4)
    );

    return Array.from(
      { length: 5 },
      (_, index) => startPage + index
    );
  }, [safePage, totalPages]);

  const hasSearch = searchQuery.trim().length > 0;

  // Update search and reset pagination
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  // Change page
  const goToPage = (page: number) => {
    if (
      page < 1 ||
      page > totalPages ||
      page === safePage
    ) {
      return;
    }

    setCurrentPage(page);

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    sectionRef.current?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <section
      ref={sectionRef}
      id="events-list"
      aria-label="Daftar kegiatan"
      className="mt-7 scroll-mt-28 sm:mt-12"
    >
      {/* Section Heading */}
      <div className="mb-6 hidden sm:block">
        <h2 className="font-heading text-2xl font-extrabold tracking-tight text-brand-text sm:text-3xl">
          Temukan{" "}
          <span className="text-brand-pink">
            Kegiatan.
          </span>
        </h2>

        <p className="mt-2 max-w-xl text-sm leading-6 text-brand-muted">
          Cari kegiatan berdasarkan nama, kategori,
          atau lokasi yang kamu inginkan.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6 sm:mb-8">
        <div className="relative w-full">
          <label
            htmlFor="event-search"
            className="sr-only"
          >
            Cari kegiatan
          </label>

          <Search
            size={19}
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-pink"
          />

          <input
            id="event-search"
            type="search"
            value={searchQuery}
            onChange={(event) =>
              handleSearch(event.target.value)
            }
            placeholder="Cari nama kegiatan, kategori, atau lokasi..."
            autoComplete="off"
            className="h-12 w-full rounded-2xl border border-rose-100 bg-white py-3 pl-12 pr-12 text-sm text-brand-text shadow-sm outline-none transition-all duration-200 placeholder:text-brand-muted/70 focus:border-brand-pink focus:ring-4 focus:ring-brand-pink/10 sm:h-14"
          />

          {/* Clear Search Button */}
          {searchQuery.length > 0 && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Hapus pencarian"
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-brand-muted transition-colors duration-200 hover:bg-brand-soft hover:text-brand-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink"
            >
              <X
                size={17}
                aria-hidden="true"
              />
            </button>
          )}
        </div>
      </div>

      {/* Clear Search Action */}
      {hasSearch && (
        <div className="mb-5 flex justify-end">
          <button
            type="button"
            onClick={clearSearch}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-pink transition-colors hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink"
          >
            <X size={15} aria-hidden="true" />
            Reset Pencarian
          </button>
        </div>
      )}

      {/* Event Cards */}
      {paginatedEvents.length > 0 ? (
        <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {paginatedEvents.map((event) => (
            <EventCard
              key={event.slug}
              event={event}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center rounded-3xl border border-brand-pink/10 bg-brand-soft px-5 py-14 text-center sm:px-8 sm:py-16">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-pink shadow-sm">
            <Search
              size={26}
              aria-hidden="true"
            />
          </div>

          <h3 className="font-heading text-lg font-extrabold text-brand-text sm:text-xl">
            {events.length === 0
              ? "Belum Ada Kegiatan"
              : "Kegiatan Tidak Ditemukan"}
          </h3>

          <p className="mt-3 max-w-md text-sm leading-7 text-brand-muted">
            {events.length === 0
              ? "Nantikan informasi kegiatan berikutnya bersama Berbagi Kebahagiaan."
              : "Coba gunakan kata kunci lain untuk menemukan kegiatan yang kamu cari."}
          </p>

          {hasSearch && (
            <button
              type="button"
              onClick={clearSearch}
              className="mt-6 rounded-full bg-brand-pink px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink"
            >
              Tampilkan Semua Kegiatan
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          aria-label="Navigasi halaman kegiatan"
          className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:mt-12"
        >
          {/* Previous */}
          <button
            type="button"
            onClick={() => goToPage(safePage - 1)}
            disabled={safePage === 1}
            aria-label="Halaman sebelumnya"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-100 bg-white text-brand-text transition-colors hover:border-brand-pink hover:text-brand-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink disabled:cursor-not-allowed disabled:opacity-40 sm:h-11 sm:w-11"
          >
            <ChevronLeft
              size={19}
              aria-hidden="true"
            />
          </button>

          {/* Page Numbers */}
          {pageNumbers.map((page) => {
            const active = page === safePage;

            return (
              <button
                key={page}
                type="button"
                onClick={() => goToPage(page)}
                aria-label={`Halaman ${page}`}
                aria-current={active ? "page" : undefined}
                className={`flex h-10 min-w-10 items-center justify-center rounded-xl px-2 text-sm font-bold transition-all duration-200 sm:h-11 sm:min-w-11 ${
                  active
                    ? "bg-brand-pink text-white shadow-md shadow-brand-pink/15"
                    : "border border-rose-100 bg-white text-brand-muted hover:border-brand-pink hover:text-brand-pink"
                }`}
              >
                {page}
              </button>
            );
          })}

          {/* Next */}
          <button
            type="button"
            onClick={() => goToPage(safePage + 1)}
            disabled={safePage === totalPages}
            aria-label="Halaman berikutnya"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-100 bg-white text-brand-text transition-colors hover:border-brand-pink hover:text-brand-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink disabled:cursor-not-allowed disabled:opacity-40 sm:h-11 sm:w-11"
          >
            <ChevronRight
              size={19}
              aria-hidden="true"
            />
          </button>
        </nav>
      )}
    </section>
  );
}
