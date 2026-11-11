import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Heart, Sparkles } from "lucide-react";

import EventsExplorer from "@/components/events-explorer";
import { getAllPublicEvents } from "@/lib/events/public-events";

export const metadata: Metadata = {
  title: "Kegiatan | Berbagi Kebahagiaan",
  description:
    "Jelajahi kegiatan mendatang dan kegiatan terdahulu bersama Berbagi Kebahagiaan.",
};

// Fresh Supabase data on initial page navigation; no server round-trip on tab clicks.
export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const { events, hasMore } = await getAllPublicEvents();

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-7 sm:px-8 sm:py-10 lg:py-12">
      <section className="relative isolate overflow-hidden rounded-none bg-transparent py-3 sm:rounded-[2rem] sm:bg-brand-soft sm:px-10 sm:py-12 lg:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 -z-10 hidden h-64 w-64 rounded-full bg-white/60 blur-3xl sm:block"
        />
        <div className="relative z-10 max-w-3xl">
          <div className="mb-5 hidden w-fit items-center gap-2 rounded-full border border-brand-pink/15 bg-white/80 px-3.5 py-2 sm:inline-flex">
            <Heart size={14} fill="currentColor" className="text-brand-pink" aria-hidden="true" />
            <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-dark">
              Berbagi Kebahagiaan
            </span>
          </div>
          <h1 className="font-heading text-3xl font-extrabold leading-tight tracking-tight text-brand-text sm:text-4xl lg:text-5xl">
            Jelajahi <span className="text-brand-pink">Kegiatan.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-brand-muted sm:mt-4 sm:text-base">
            Temukan kegiatan mendatang dan lihat kembali kegiatan yang telah diselenggarakan bersama Berbagi Kebahagiaan.
          </p>
          <Link
            href="/"
            className="group mt-5 hidden w-fit items-center gap-2 text-sm font-bold text-brand-dark transition-colors hover:text-brand-pink sm:inline-flex"
          >
            <ArrowLeft size={17} aria-hidden="true" className="transition-transform group-hover:-translate-x-1" />
            Kembali ke Beranda
          </Link>
        </div>
        <Sparkles aria-hidden="true" size={45} className="absolute bottom-6 right-7 hidden rotate-12 text-brand-pink/25 sm:block" />
      </section>

      <EventsExplorer events={events} hasMore={hasMore} />
    </main>
  );
}
