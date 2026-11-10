
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { EventCard } from "@/components/event-card";
import { demoEvents } from "@/data/demo-events";

export default function Home() {
  const upcomingEvents = demoEvents.slice(0, 3);

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-12 lg:py-16">
      {/* Hero Section */}
      <section className="grid items-center gap-10 overflow-hidden rounded-[2rem] bg-brand-soft p-6 sm:p-10 lg:grid-cols-2 lg:gap-14 lg:p-14">
        {/* Hero Content */}
        <div className="space-y-6">
          <span className="inline-block text-xs font-extrabold uppercase tracking-[0.18em] text-brand-dark">
            Komunitas Sosial • Bandung
          </span>

          <h1 className="font-heading text-4xl font-extrabold leading-[1.15] tracking-tight text-brand-text sm:text-5xl lg:text-6xl">
            Menciptakan Makna{" "}
            <span className="text-brand-pink">Melalui Tawa.</span>
          </h1>

          <p className="max-w-lg text-sm leading-7 text-brand-muted sm:text-base">
            Kami menghadirkan momen bermakna melalui permainan,
            aktivitas kreatif, edukasi, dan kunjungan sosial bersama
            anak-anak panti.
          </p>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
            <Link
              href="/events"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-pink px-7 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink"
            >
              Jelajahi Kegiatan
              <ArrowRight size={18} aria-hidden="true" />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-full border border-brand-pink/15 bg-white px-7 py-3.5 text-sm font-bold text-brand-dark transition-colors duration-200 hover:bg-brand-pink/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink"
            >
              Kenali Kami
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white shadow-lg shadow-brand-pink/10 sm:rounded-3xl">
          <Image
            src="/BK.jpg"
            alt="Dokumentasi kegiatan bersama komunitas Berbagi Kebahagiaan"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section
        aria-labelledby="upcoming-events-heading"
        className="mt-16 sm:mt-20 lg:mt-24"
      >
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-pink">
              Agenda Komunitas
            </span>

            <h2
              id="upcoming-events-heading"
              className="font-heading text-2xl font-extrabold tracking-tight text-brand-text sm:text-3xl"
            >
              Kegiatan Mendatang
            </h2>

            <p className="max-w-xl text-sm leading-6 text-brand-muted">
              Temukan kegiatan sosial yang bisa kamu ikuti dan
              jadilah bagian dari cerita kebahagiaan bersama kami.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-brand-pink transition-colors hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink"
          >
            Lihat Semua Kegiatan
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        {upcomingEvents.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-brand-pink/10 bg-brand-soft p-10 text-center sm:p-14">
            <h3 className="font-heading text-lg font-bold text-brand-text">
              Belum Ada Kegiatan Mendatang
            </h3>

            <p className="mt-2 text-sm text-brand-muted">
              Nantikan kegiatan seru berikutnya bersama Berbagi Kebahagiaan.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
