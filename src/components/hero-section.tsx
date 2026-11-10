import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  Sparkles,
} from "lucide-react";

import SectionLink from "@/components/section-link";


export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden rounded-[2rem] bg-brand-soft px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
      {/* Background Decorations */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 -z-10 h-64 w-64 rounded-full bg-white/50 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-20 -z-10 h-56 w-56 rounded-full bg-brand-pink/10 blur-3xl"
      />

      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
        {/* Hero Content */}
        <div className="relative z-10">
          {/* Eyebrow */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-pink/15 bg-white/70 px-3.5 py-2 shadow-sm">
            <Heart
              size={14}
              fill="currentColor"
              className="text-brand-pink"
              aria-hidden="true"
            />
            <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-dark">
              Komunitas Sosial Bandung
            </span>
          </div>

          {/* Heading */}
          <h1 className="max-w-xl font-heading text-4xl font-extrabold leading-[1.12] tracking-tight text-brand-text sm:text-5xl lg:text-[56px]">
            Menciptakan Makna{" "}
            <span className="relative inline-block text-brand-pink">
              Melalui
              <svg
                aria-hidden="true"
                viewBox="0 0 220 15"
                preserveAspectRatio="none"
                className="absolute -bottom-1 left-0 h-2 w-full text-brand-pink/30"
              >
                <path
                  d="M3 11 C60 2, 130 3, 217 9"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            <span className="text-brand-pink">Tawa.</span>
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-lg text-sm leading-7 text-brand-muted sm:text-base">
            Kami percaya kebahagiaan tumbuh dari hal-hal sederhana.
            Melalui permainan, aktivitas kreatif, edukasi, dan
            kunjungan sosial, kami menghadirkan momen penuh makna
            bersama anak-anak panti.
          </p>

          {/* CTA */}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/events"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-pink px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-brand-pink/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-pink"
            >
              Jelajahi Kegiatan
              <ArrowUpRight
                size={18}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>

            <SectionLink
                section="about"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-brand-pink/15 bg-white px-6 py-3.5 text-sm font-bold text-brand-dark transition-all duration-300 hover:bg-brand-pink/5"
                >
                Kenali Kami
                <ArrowRight
                    size={16}
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                />
                </SectionLink>
          </div>

          {/* Small Decorative Statement */}
          <div className="mt-7 flex items-center gap-3 border-t border-brand-pink/10 pt-5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-brand-pink shadow-sm">
              <Sparkles size={17} aria-hidden="true" />
            </div>

            <p className="text-xs font-medium leading-5 text-brand-muted">
              Berbagi cerita, menghadirkan senyuman,
              <br className="hidden sm:block" /> menciptakan kenangan bersama.
            </p>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="relative mx-auto w-full max-w-lg lg:mx-0">
          {/* Decorative Shape */}
          <div
            aria-hidden="true"
            className="absolute -right-3 -top-4 h-24 w-24 rounded-full bg-brand-pink/15 sm:h-32 sm:w-32"
          />

          {/* Main Photo Frame */}
          <div className="group relative rotate-[1deg] rounded-[2rem] bg-white p-2.5 shadow-[0_18px_45px_-20px_rgba(184,32,83,0.25)] transition-transform duration-500 hover:rotate-0">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-brand-soft">
              <Image
                src="/BK.jpg"
                alt="Dokumentasi kegiatan komunitas Berbagi Kebahagiaan bersama anak-anak panti"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </div>
          </div>

          {/* Compact Floating Card */}
          <div className="absolute -bottom-4 left-2 z-10 flex max-w-[220px] -rotate-[2deg] items-center gap-2.5 rounded-xl border border-brand-pink/10 bg-white p-3 shadow-lg shadow-brand-pink/10 sm:-left-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand-pink">
              <Heart
                size={17}
                fill="currentColor"
                aria-hidden="true"
              />
            </span>

            <div>
              <p className="font-heading text-xs font-extrabold text-brand-text">
                Momen Kebersamaan
              </p>
              <p className="mt-0.5 text-[10px] leading-4 text-brand-muted">
                Cerita kecil yang penuh makna
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
