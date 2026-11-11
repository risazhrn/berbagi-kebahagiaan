import {
  Heart
} from "lucide-react";

export default function AboutSection() {
  return (
    <section
        id="about"
        aria-labelledby="about-heading"
        className="scroll-mt-28 py-16 sm:py-20"
        >
      <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        {/* About Content */}
        <div>
          <h2
            id="about-heading"
            className="max-w-xl font-heading text-3xl font-extrabold leading-[1.2] tracking-tight text-brand-text sm:text-4xl"
          >
            Hal Sederhana,
            <br />
            <span className="text-brand-pink">
              Makna yang Berharga.
            </span>
          </h2>

          <p className="mt-5 max-w-xl text-sm leading-8 text-brand-muted sm:text-base">
            Berbagi Kebahagiaan adalah program sosial berbasis
            kunjungan di Bandung yang menghadirkan pengalaman
            interaktif dan bermakna kepada anak-anak panti melalui
            permainan, aktivitas kreatif, edukasi, dan penyaluran
            bantuan sesuai kebutuhan.
          </p>

          <div className="mt-7 flex items-center gap-3">
            <div className="h-px w-10 bg-brand-pink" />

            <p className="text-xs font-semibold italic text-brand-dark sm:text-sm">
              Karena setiap senyuman memiliki cerita.
            </p>
          </div>
        </div>

        {/* Vision Card */}
        <div className="relative overflow-hidden rounded-[2rem] bg-brand-soft p-7 sm:p-9">
          {/* Decorative Elements */}
          <div
            aria-hidden="true"
            className="absolute -right-12 -top-12 h-40 w-40 rounded-full border-[24px] border-brand-pink/10"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-16 -left-14 h-36 w-36 rounded-full bg-white/50"
          />

          <div className="relative z-10">
            <div className="mb-7 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-pink shadow-sm">
                <Heart
                  size={22}
                  fill="currentColor"
                  aria-hidden="true"
                />
              </div>

            </div>

            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-brand-pink">
              Visi Kami
            </p>

            <h3 className="max-w-sm font-heading text-xl font-extrabold leading-snug text-brand-text sm:text-2xl">
              Menghadirkan Kebahagiaan,
              Menumbuhkan Kepedulian.
            </h3>

            <p className="mt-4 max-w-md text-sm leading-7 text-brand-muted">
              Menciptakan ruang kebahagiaan yang bermakna melalui
              tawa yang menjadi jembatan kepedulian sosial.
            </p>

            <div className="mt-7 h-1 w-14 rounded-full bg-brand-pink" />
          </div>
        </div>
      </div>
    </section>
  );
}