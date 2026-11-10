
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Heart, Sparkles } from "lucide-react";

import EventsExplorer from "@/components/events-explorer";
import { demoEvents } from "@/data/demo-events";

export const metadata: Metadata = {
  title: "Kegiatan | Berbagi Kebahagiaan",
  description:
    "Jelajahi kegiatan sosial dan kesempatan berbagi kebahagiaan bersama komunitas Berbagi Kebahagiaan.",
};

export default function Events() {
  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-7 sm:px-8 sm:py-10 lg:py-12">
      {/* Page Header */}
      <section className="relative isolate overflow-hidden rounded-none bg-transparent py-3 sm:rounded-[2rem] sm:bg-brand-soft sm:px-10 sm:py-12 lg:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 -z-10 hidden h-64 w-64 rounded-full bg-white/60 blur-3xl sm:block"
        />

        <div className="relative z-10 max-w-3xl">
          {/* Desktop Eyebrow */}
          <div className="mb-5 hidden w-fit items-center gap-2 rounded-full border border-brand-pink/15 bg-white/80 px-3.5 py-2 sm:inline-flex">
            <Heart
              size={14}
              fill="currentColor"
              className="text-brand-pink"
              aria-hidden="true"
            />

            <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-dark">
              Berbagi Kebahagiaan
            </span>
          </div>

          <h1 className="font-heading text-3xl font-extrabold leading-tight tracking-tight text-brand-text sm:text-4xl lg:text-5xl">
            Jelajahi{" "}
            <span className="text-brand-pink">
              Kegiatan.
            </span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-brand-muted sm:mt-4 sm:text-base">
            Temukan kegiatan sosial dan kesempatan untuk
            berbagi kebahagiaan bersama kami.
          </p>

          <Link
            href="/"
            className="group mt-5 hidden w-fit items-center gap-2 text-sm font-bold text-brand-dark transition-colors hover:text-brand-pink sm:inline-flex"
          >
            <ArrowLeft
              size={17}
              aria-hidden="true"
              className="transition-transform group-hover:-translate-x-1"
            />
            Kembali ke Beranda
          </Link>
        </div>

        <Sparkles
          aria-hidden="true"
          size={45}
          className="absolute bottom-6 right-7 hidden rotate-12 text-brand-pink/25 sm:block"
        />
      </section>

      {/* Search, Filter, List & Pagination */}
      <EventsExplorer events={demoEvents} />
    </main>
  );
}
