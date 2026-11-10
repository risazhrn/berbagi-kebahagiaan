
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Info,
  LockKeyhole,
  Search,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Cek Status Pendaftaran | Berbagi Kebahagiaan",
  description:
    "Periksa status pendaftaran kegiatan sosial Berbagi Kebahagiaan menggunakan kode registrasi.",
};

export default function Status() {
  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
      <section className="mx-auto max-w-2xl">
        {/* Page Heading */}
        <div className="mb-8 text-center sm:mb-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-pink/15 bg-brand-soft px-4 py-2">
            <ClipboardCheck
              size={16}
              className="text-brand-pink"
              aria-hidden="true"
            />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-dark">
              Status Registrasi
            </span>
          </div>

          <h1 className="font-heading text-3xl font-extrabold leading-tight tracking-tight text-brand-text sm:text-4xl">
            Cek Status{" "}
            <span className="text-brand-pink">
              Pendaftaran.
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-brand-muted sm:text-base">
            Sudah mendaftar kegiatan? Periksa perkembangan
            pendaftaranmu dengan menggunakan kode registrasi
            yang kamu terima.
          </p>
        </div>

        {/* Status Checker Card */}
        <div className="overflow-hidden rounded-[2rem] border border-brand-pink/10 bg-white shadow-lg shadow-brand-pink/5">
          {/* Card Accent */}
          <div className="h-1.5 w-full bg-brand-pink" />

          <div className="p-6 sm:p-9">
            <div className="mb-7 flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand-pink">
                <Search size={21} aria-hidden="true" />
              </div>

              <div>
                <h2 className="font-heading text-lg font-extrabold text-brand-text">
                  Cari Pendaftaranmu
                </h2>

                <p className="mt-1 text-sm leading-6 text-brand-muted">
                  Masukkan kode registrasi untuk melihat
                  status keikutsertaanmu.
                </p>
              </div>
            </div>

            {/* Registration Form */}
            <form className="space-y-5">
              <div>
                <label
                  htmlFor="registration-code"
                  className="mb-2 block text-sm font-semibold text-brand-text"
                >
                  Kode Pendaftaran
                </label>

                <div className="relative">
                  <ClipboardCheck
                    size={19}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted"
                  />

                  <input
                    id="registration-code"
                    name="registrationCode"
                    type="text"
                    placeholder="Contoh: BK-2026-XXXX"
                    autoComplete="off"
                    disabled
                    className="h-13 w-full rounded-xl border border-rose-100 bg-brand-cream/60 py-3.5 pl-12 pr-4 text-sm text-brand-text outline-none placeholder:text-brand-muted/60 disabled:cursor-not-allowed disabled:opacity-70"
                  />
                </div>

                <p className="mt-2 text-xs leading-5 text-brand-muted">
                  Kode registrasi diberikan setelah kamu
                  menyelesaikan formulir pendaftaran.
                </p>
              </div>

              <button
                type="button"
                disabled
                className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-brand-pink/50 px-6 py-3.5 text-sm font-bold text-white"
              >
                <Search size={18} aria-hidden="true" />
                Cek Status Pendaftaran
              </button>
            </form>

            {/* Development Notice */}
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-brand-pink/10 bg-brand-soft p-4">
              <Info
                size={19}
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-brand-pink"
              />

              <p className="text-xs leading-6 text-brand-muted">
                Fitur pengecekan status sedang dalam tahap
                pengembangan dan belum dapat digunakan.
              </p>
            </div>
          </div>
        </div>

        {/* Explore Activities */}
        <div className="mt-8 text-center">
          <Link
            href="/events"
            className="group inline-flex items-center gap-2 text-sm font-bold text-brand-pink transition-colors hover:text-brand-dark"
          >
            Jelajahi Kegiatan Lainnya
            <ArrowUpRight
              size={17}
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </section>
    </main>
  );
}
