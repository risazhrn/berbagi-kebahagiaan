import Link from "next/link";
import { ArrowUpRight, CalendarDays, ImageIcon, MapPin } from "lucide-react";
import {
  type PublicEvent, eventDate, eventPosterUrl, eventPrice,
} from "@/lib/events/event-model";

type EventCardProps = { event: PublicEvent };

export function EventCard({ event }: EventCardProps) {
  const poster = eventPosterUrl(event.poster_path);
  return (
    <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border border-rose-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-pink/30 hover:shadow-xl hover:shadow-brand-pink/10 focus-within:border-brand-pink focus-within:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden bg-brand-soft">
        {poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poster} alt={`Poster ${event.title}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 text-brand-pink shadow-sm">
              <ImageIcon size={25} aria-hidden="true" />
            </span>
            <p className="text-xs font-semibold text-brand-muted">Dokumentasi Kegiatan</p>
          </div>
        )}
        <span className="absolute left-4 top-4 max-w-[calc(100%-2rem)] truncate rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-brand-dark shadow-sm">
          {event.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-heading text-lg font-extrabold leading-snug text-brand-text transition-colors duration-300 group-hover:text-brand-pink sm:line-clamp-2">{event.title}</h3>
        <div className="mt-4 space-y-3">
          <div className="flex items-start gap-2.5 text-sm text-brand-muted">
            <CalendarDays size={17} aria-hidden="true" className="mt-0.5 shrink-0 text-brand-pink" />
            <span>{eventDate(event.start_at)}</span>
          </div>
          <div className="flex items-start gap-2.5 text-sm text-brand-muted">
            <MapPin size={17} aria-hidden="true" className="mt-0.5 shrink-0 text-brand-pink" />
            <span className="min-w-0 line-clamp-2">{event.location}</span>
          </div>
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 pt-7">
          <div className="min-w-0">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-brand-muted">Biaya Partisipasi</p>
            <p className="font-heading text-base font-extrabold text-brand-dark sm:text-lg">{eventPrice(event.price)}</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 pb-0.5 text-xs font-bold text-brand-pink transition-colors duration-300 group-hover:text-brand-dark sm:text-sm">
            Lihat Detail <ArrowUpRight size={17} aria-hidden="true" />
          </span>
        </div>
      </div>
      <Link href={`/events/${encodeURIComponent(event.slug)}`} aria-label={`Lihat detail kegiatan ${event.title}`} className="absolute inset-0 z-10 rounded-3xl focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-pink" />
    </article>
  );
}
