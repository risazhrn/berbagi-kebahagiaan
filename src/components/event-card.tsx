
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  ImageIcon,
  MapPin,
} from "lucide-react";

import type { DemoEvent } from "@/data/demo-events";

type EventCardProps = {
  event: DemoEvent;
};

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function EventCard({ event }: EventCardProps) {
  const formattedPrice =
    event.type === "free"
      ? "Gratis"
      : currencyFormatter.format(event.price);

  return (
    <article
      className="
        group relative flex h-full min-w-0 flex-col
        overflow-hidden rounded-3xl
        border border-rose-100 bg-white
        shadow-sm
        transition-all duration-300
        hover:-translate-y-1
        hover:border-brand-pink/30
        hover:shadow-xl hover:shadow-brand-pink/10
        focus-within:border-brand-pink
        focus-within:shadow-lg
      "
    >
      {/* Poster Placeholder */}
      <div className="relative aspect-[16/10] overflow-hidden bg-brand-soft">
        {/* Decorations */}
        <div
          aria-hidden="true"
          className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-brand-pink/10 transition-transform duration-500 group-hover:scale-110"
        />

        <div
          aria-hidden="true"
          className="absolute -bottom-16 -left-12 h-40 w-40 rounded-full border-[20px] border-white/40"
        />

        {/* Placeholder Content */}
        <div className="relative flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 text-brand-pink shadow-sm transition-transform duration-300 group-hover:-translate-y-1">
            <ImageIcon
              size={25}
              aria-hidden="true"
            />
          </span>

          <p className="text-xs font-semibold text-brand-muted">
            Dokumentasi Kegiatan
          </p>
        </div>

        {/* Category Badge */}
        <span className="absolute left-4 top-4 max-w-[calc(100%-2rem)] truncate rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-brand-dark shadow-sm">
          {event.category}
        </span>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Event Title */}
        <h3 className="min-h-0 font-heading text-lg font-extrabold leading-snug text-brand-text transition-colors duration-300 group-hover:text-brand-pink sm:line-clamp-2">
          {event.title}
        </h3>

        {/* Event Information */}
        <div className="mt-4 space-y-3">
          {/* Date */}
          <div className="flex items-start gap-2.5 text-sm text-brand-muted">
            <CalendarDays
              size={17}
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-brand-pink"
            />

            <span className="min-w-0">
              {event.date}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-start gap-2.5 text-sm text-brand-muted">
            <MapPin
              size={17}
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-brand-pink"
            />

            <span className="min-w-0 line-clamp-2">
              {event.location}
            </span>
          </div>
        </div>

        {/* Price & Detail - Without Divider */}
        <div className="mt-auto flex items-end justify-between gap-3 pt-7">
          {/* Price */}
          <div className="min-w-0">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-brand-muted">
              Biaya Partisipasi
            </p>

            <p className="font-heading text-base font-extrabold text-brand-dark sm:text-lg">
              {formattedPrice}
            </p>
          </div>

          {/* Detail */}
          <span className="inline-flex shrink-0 items-center gap-1.5 pb-0.5 text-xs font-bold text-brand-pink transition-colors duration-300 group-hover:text-brand-dark sm:text-sm">
            Lihat Detail

            <ArrowUpRight
              size={17}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </div>

      {/* Full Card Clickable */}
      <Link
        href={`/events/${event.slug}`}
        aria-label={`Lihat detail kegiatan ${event.title}`}
        className="absolute inset-0 z-10 rounded-3xl focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-pink"
      >
        <span className="sr-only">
          Buka detail {event.title}
        </span>
      </Link>
    </article>
  );
}
