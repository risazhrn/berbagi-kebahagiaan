
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

type EventFilter = "all" | "free" | "paid";

const ITEMS_PER_PAGE = 6;

const filters: {
  label: string;
  value: EventFilter;
}[] = [
  { label: "Semua", value: "all" },
  { label: "Gratis", value: "free" },
  { label: "Berbayar", value: "paid" },
];

export default function EventsExplorer({
  events,
}: EventsExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] =
    useState<EventFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const sectionRef = useRef<HTMLElement>(null);

  // Search and filter events
  const filteredEvents = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLocaleLowerCase("id-ID");

    return events.filter((event) => {
      const searchableText = [
        event.title,
        event.category,
        event.location,
        event.description,
      ]
        .join(" ")
        .toLocaleLowerCase("id-ID");

      const matchesSearch =
        !query || searchableText.includes(query);

      const matchesType =
        activeFilter === "all" ||
        event.type === activeFilter;

      return matchesSearch && matchesType;
    });
  }, [events, searchQuery, activeFilter]);

  // Pagination
  const totalPages = Math.ceil(
    filteredEvents.length / ITEMS_PER_PAGE
  );

  const safePage = Math.min(
    currentPage,
    Math.max(1, totalPages)
  );

  const paginatedEvents = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;

    return filteredEvents.slice(
      start,
      start + ITEMS_PER_PAGE
    );
  }, [filteredEvents, safePage]);

  // Show maximum 5 page numbers
  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
    }

    const start = Math.max(
      1,
      Math.min(safePage - 2, totalPages - 4)
    );

    return Array.from(
      { length: 5 },
      (_, index) => start + index
    );
  }, [safePage, totalPages]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    activeFilter !== "all";

  // Search handler
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Filter handler
  const handleFilter = (filter: EventFilter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  // Reset search and filters
  const resetFilters = () => {
    setSearchQuery("");
    setActiveFilter("all");
    setCurrentPage(1);
  };

  // Change pagination
  const goToPage = (page: number) => {
    if (
      page < 1 ||
      page > totalPages ||
      page === safePage
    ) {
      return;
    }

    setCurrentPage(page);

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    sectionRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
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

        <p className="mt-2 text-sm leading-6 text-brand-muted">
          Cari kegiatan berdasarkan nama, kategori,
          atau lokasi.
        </p>
      </div>

      {/* Search and Filter Container */}
      <div className="mb-6 space-y-3 sm:rounded-3xl sm:border sm:border-rose-100 sm:bg-white sm:p-5 sm:shadow-sm lg:flex lg:items-center lg:gap-4 lg:space-y-0">
        {/* Search Input */}
        <div className="relative min-w-0 flex-1">
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
            placeholder="Cari kegiatan..."
            autoComplete="off"
            className="h-12 w-full rounded-2xl border border-rose-100 bg-white py-3 pl-12 pr-11 text-sm text-brand-text outline-none transition-all duration-200 placeholder:text-brand-muted/70 focus:border-brand-pink focus:ring-4 focus:ring-brand-pink/10 sm:bg-brand-cream/60"
          />

          {/* Clear Search */}
          {searchQuery.length > 0 && (
            <button
              type="button"
              onClick={() => handleSearch("")}
              aria-label="Hapus pencarian"
              className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-brand-muted transition-colors hover:bg-brand-soft hover:text-brand-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink"
            >
              <X size={17} aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Filter Buttons - No Decorative Icon */}
        <div
          role="group"
          aria-label="Filter biaya kegiatan"
          className="grid w-full grid-cols-3 gap-2 lg:w-auto lg:shrink-0 lg:rounded-2xl lg:bg-brand-cream lg:p-1.5"
        >
          {filters.map((filter) => {
            const active = activeFilter === filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => handleFilter(filter.value)}
                aria-pressed={active}
                className={`min-w-0 rounded-xl px-3 py-3 text-xs font-bold transition-all duration-200 sm:px-5 ${
                  active
                    ? "bg-brand-pink text-white shadow-sm"
                    : "border border-rose-100 bg-white text-brand-muted hover:border-brand-pink/30 hover:text-brand-pink lg:border-transparent"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset Filter */}
      {hasActiveFilters && (
        <div className="mb-5 flex justify-end">
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-pink transition-colors hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink"
          >
            <X size={15} aria-hidden="true" />
            Reset Filter
          </button>
        </div>
      )}

      {/* Event Grid */}
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
              : "Coba gunakan kata kunci lain atau ubah filter untuk menemukan kegiatan."}
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 rounded-full bg-brand-pink px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink"
            >
              Tampilkan Semua Kegiatan
            </button>
          )}
        </div>
      )}

      {/* Pagination - Hidden When Only One Page */}
      {totalPages > 1 && (
        <nav
          aria-label="Navigasi halaman kegiatan"
          className="mt-10 flex items-center justify-center gap-2 sm:mt-12"
        >
          {/* Previous Page */}
          <button
            type="button"
            onClick={() => goToPage(safePage - 1)}
            disabled={safePage === 1}
            aria-label="Halaman sebelumnya"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-100 bg-white text-brand-text transition-colors hover:border-brand-pink hover:text-brand-pink disabled:cursor-not-allowed disabled:opacity-40 sm:h-11 sm:w-11"
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
                aria-current={
                  active ? "page" : undefined
                }
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

          {/* Next Page */}
          <button
            type="button"
            onClick={() => goToPage(safePage + 1)}
            disabled={safePage === totalPages}
            aria-label="Halaman berikutnya"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-100 bg-white text-brand-text transition-colors hover:border-brand-pink hover:text-brand-pink disabled:cursor-not-allowed disabled:opacity-40 sm:h-11 sm:w-11"
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
