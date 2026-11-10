
import Link from "next/link";
import { ArrowUpRight, Heart, MoveHorizontal } from "lucide-react";

import { EventCard } from "@/components/event-card";
import { demoEvents } from "@/data/demo-events";

const upcomingEvents = demoEvents.slice(0, 3);

export default function UpcomingEventsSection() {
  const hasEvents = upcomingEvents.length > 0;
  const hasMultipleEvents = upcomingEvents.length > 1;

  return (
    <section
      id="agenda"
      aria-labelledby="upcoming-events-heading"
      className="scroll-mt-28 pb-8 sm:pb-10"
    >
      {/* Section Header */}
      <div className="mb-7 flex flex-col gap-5 lg:mb-9 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2
            id="upcoming-events-heading"
            className="font-heading text-2xl font-extrabold leading-tight tracking-tight text-brand-text sm:text-3xl lg:text-4xl"
          >
            Kegiatan{" "}
            <span className="text-brand-pink">Mendatang.</span>
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-7 text-brand-muted">
            Temukan kegiatan mendatang dan kesempatan untuk
            berbagi kebahagiaan bersama kami.
          </p>
        </div>

        {/* Desktop CTA */}
        <Link
          href="/events"
          className="group hidden shrink-0 items-center gap-2 rounded-full border border-brand-pink/20 bg-white px-5 py-3 text-sm font-bold text-brand-pink transition-all duration-300 hover:border-brand-pink hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink lg:inline-flex"
        >
          Lihat Semua Kegiatan

          <ArrowUpRight
            size={17}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>

      {hasEvents ? (
        <>
          {/* Events: Swipe on Mobile & Tablet, Grid on Desktop */}
          <div
            aria-label="Daftar kegiatan mendatang"
            className="
              -mx-5 flex snap-x snap-mandatory gap-4
              overflow-x-auto overscroll-x-contain
              px-5 pb-5 scroll-smooth
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden

              sm:mx-0 sm:gap-5 sm:px-0

              lg:grid lg:grid-cols-3 lg:gap-6
              lg:overflow-visible lg:pb-0
            "
          >
            {upcomingEvents.map((event) => (
              <div
                key={event.slug}
                className="
                  min-w-0 w-[85%] shrink-0 snap-start
                  sm:w-[calc((100%-3.75rem)/2)]
                  lg:w-auto
                "
              >
                <EventCard event={event} />
              </div>
            ))}
          </div>

          {/* Swipe Hint: Mobile & Tablet */}
          {hasMultipleEvents}

          {/* Mobile & Tablet CTA */}
          <Link
            href="/events"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-brand-pink/20 bg-brand-soft px-6 py-3.5 text-sm font-bold text-brand-pink transition-all duration-300 hover:border-brand-pink hover:bg-brand-pink/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink lg:hidden"
          >
            Lihat Semua Kegiatan

            <ArrowUpRight
              size={17}
              aria-hidden="true"
            />
          </Link>
        </>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center rounded-3xl border border-brand-pink/10 bg-brand-soft px-5 py-12 text-center sm:px-8 sm:py-14">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-brand-pink">
            <Heart
              size={22}
              aria-hidden="true"
            />
          </div>

          <h3 className="font-heading text-lg font-extrabold text-brand-text">
            Belum Ada Kegiatan Mendatang
          </h3>

          <p className="mt-3 max-w-md text-sm leading-7 text-brand-muted">
            Nantikan kegiatan berikutnya dan kesempatan untuk
            berbagi kebahagiaan bersama kami.
          </p>

          <Link
            href="/events"
            className="group mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-pink transition-colors hover:text-brand-dark"
          >
            Jelajahi Semua Kegiatan

            <ArrowUpRight
              size={17}
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      )}
    </section>
  );
}
