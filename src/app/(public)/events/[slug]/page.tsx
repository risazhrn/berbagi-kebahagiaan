
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Heart,
  Info,
  MapPin,
  Ticket,
  Users,
} from "lucide-react";

import { demoEvents } from "@/data/demo-events";

type EventDetailProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: EventDetailProps): Promise<Metadata> {
  const { slug } = await params;

  const event = demoEvents.find(
    (item) => item.slug === slug
  );

  if (!event) {
    return {
      title: "Kegiatan Tidak Ditemukan",
    };
  }

  return {
    title: `${event.title} | Berbagi Kebahagiaan`,
    description: event.description,
  };
}

export default async function EventDetail({
  params,
}: EventDetailProps) {
  const { slug } = await params;

  const event = demoEvents.find(
    (item) => item.slug === slug
  );

  if (!event) {
    notFound();
  }

  const isFree = event.type === "free";

  const formattedPrice = isFree
    ? "Gratis"
    : `Rp ${event.price.toLocaleString("id-ID")}`;

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:py-12">
      {/* Back Navigation */}
      <Link
        href="/events"
        className="group mb-7 inline-flex items-center gap-2 text-sm font-semibold text-brand-muted transition-colors hover:text-brand-pink"
      >
        <ArrowLeft
          size={17}
          aria-hidden="true"
          className="transition-transform group-hover:-translate-x-1"
        />
        Kembali ke Daftar Kegiatan
      </Link>

      {/* Event Header */}
      <section className="relative isolate overflow-hidden rounded-[2rem] bg-brand-soft px-6 py-9 sm:px-10 sm:py-12 lg:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 -z-10 h-64 w-64 rounded-full bg-white/60 blur-3xl"
        />

        <div className="relative max-w-3xl">
          {/* Category Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-pink/15 bg-white px-4 py-2">
            <Heart
              size={14}
              fill="currentColor"
              className="text-brand-pink"
              aria-hidden="true"
            />

            <span className="text-xs font-bold text-brand-dark">
              {event.category}
            </span>
          </div>

          <h1 className="font-heading text-3xl font-extrabold leading-tight tracking-tight text-brand-text sm:text-4xl lg:text-5xl">
            {event.title}
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-brand-muted sm:text-base">
            {event.description}
          </p>
        </div>
      </section>

      {/* Event Content */}
      <div className="mt-9 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* Main Content */}
        <div className="space-y-6">
          {/* About Event */}
          <section
            aria-labelledby="event-about-heading"
            className="rounded-3xl border border-brand-pink/10 bg-white p-6 sm:p-8"
          >
            <h2
              id="event-about-heading"
              className="font-heading text-xl font-extrabold text-brand-text sm:text-2xl"
            >
              Tentang Kegiatan
            </h2>

            <div className="mt-4 h-1 w-12 rounded-full bg-brand-pink" />

            <p className="mt-6 whitespace-pre-line text-sm leading-8 text-brand-muted sm:text-base">
              {event.description}
            </p>
          </section>

          {/* Event Information */}
          <section
            aria-labelledby="event-information-heading"
            className="rounded-3xl border border-brand-pink/10 bg-white p-6 sm:p-8"
          >
            <h2
              id="event-information-heading"
              className="font-heading text-xl font-extrabold text-brand-text"
            >
              Informasi Kegiatan
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {/* Date */}
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand-pink">
                  <CalendarDays
                    size={20}
                    aria-hidden="true"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium text-brand-muted">
                    Tanggal Kegiatan
                  </p>

                  <p className="mt-1 text-sm font-bold text-brand-text">
                    {event.date}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand-pink">
                  <MapPin
                    size={20}
                    aria-hidden="true"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium text-brand-muted">
                    Lokasi Kegiatan
                  </p>

                  <p className="mt-1 text-sm font-bold text-brand-text">
                    {event.location}
                  </p>
                </div>
              </div>

              {/* Quota */}
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand-pink">
                  <Users
                    size={20}
                    aria-hidden="true"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium text-brand-muted">
                    Kuota Peserta
                  </p>

                  <p className="mt-1 text-sm font-bold text-brand-text">
                    {event.quota} peserta
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand-pink">
                  <Ticket
                    size={20}
                    aria-hidden="true"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium text-brand-muted">
                    Biaya Partisipasi
                  </p>

                  <p className="mt-1 text-sm font-bold text-brand-text">
                    {formattedPrice}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Registration Sidebar */}
        <aside className="lg:sticky lg:top-28">
          <div className="overflow-hidden rounded-3xl border border-brand-pink/10 bg-white shadow-lg shadow-brand-pink/5">
            {/* Price Section */}
            <div className="bg-brand-soft px-6 py-7">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-dark">
                Biaya Partisipasi
              </p>

              <p className="mt-2 font-heading text-3xl font-extrabold text-brand-pink">
                {formattedPrice}
              </p>

              <p className="mt-2 text-xs text-brand-muted">
                Per peserta
              </p>
            </div>

            {/* Summary */}
            <div className="space-y-5 px-6 py-7">
              <div className="flex items-start gap-3">
                <CalendarDays
                  size={19}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-brand-pink"
                />

                <div>
                  <p className="text-xs text-brand-muted">
                    Tanggal
                  </p>
                  <p className="mt-1 text-sm font-semibold text-brand-text">
                    {event.date}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin
                  size={19}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-brand-pink"
                />

                <div>
                  <p className="text-xs text-brand-muted">
                    Lokasi
                  </p>
                  <p className="mt-1 text-sm font-semibold text-brand-text">
                    {event.location}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users
                  size={19}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-brand-pink"
                />

                <div>
                  <p className="text-xs text-brand-muted">
                    Kuota
                  </p>
                  <p className="mt-1 text-sm font-semibold text-brand-text">
                    {event.quota} peserta
                  </p>
                </div>
              </div>

              <div className="border-t border-brand-pink/10 pt-5">
                <button
                  type="button"
                  disabled
                  className="w-full cursor-not-allowed rounded-full bg-brand-pink/45 px-6 py-3.5 text-sm font-bold text-white"
                >
                  Pendaftaran Belum Dibuka
                </button>

                <div className="mt-4 flex items-start gap-2 rounded-2xl bg-brand-soft p-3">
                  <Info
                    size={17}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-brand-dark"
                  />

                  <p className="text-xs leading-5 text-brand-muted">
                    Fitur pendaftaran online belum tersedia
                    pada tahap pengembangan ini.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
