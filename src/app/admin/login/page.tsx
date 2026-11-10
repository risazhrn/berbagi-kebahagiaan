
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

export default function Login() {
  return (
    <main className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-brand-cream px-5 py-10">
      {/* Background Decorations */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-brand-pink/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-brand-pink/10 blur-3xl"
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" aria-label="Kembali ke Beranda">
            <Image
              src="/logo.png"
              alt="Logo Berbagi Kebahagiaan"
              width={180}
              height={72}
              priority
              className="h-auto max-h-20 w-auto object-contain"
            />
          </Link>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-brand-pink/15 bg-white px-4 py-2">
            <ShieldCheck
              size={15}
              aria-hidden="true"
              className="text-brand-pink"
            />
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-dark">
              Administrator Area
            </span>
          </div>
        </div>

        {/* Login Card */}
        <section className="rounded-[2rem] border border-brand-pink/10 bg-white p-6 shadow-xl shadow-brand-pink/5 sm:p-9">
          <div className="text-center">
            <h1 className="font-heading text-2xl font-extrabold tracking-tight text-brand-text sm:text-3xl">
              Selamat Datang!
            </h1>

            <p className="mt-3 text-sm leading-6 text-brand-muted">
              Masuk untuk mengelola kegiatan dan informasi
              komunitas Berbagi Kebahagiaan.
            </p>
          </div>

          {/* Login Form - Disabled Until Auth Integration */}
          <form className="mt-8 space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="admin-email"
                className="mb-2 block text-sm font-semibold text-brand-text"
              >
                Email
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted"
                />

                <input
                  id="admin-email"
                  type="email"
                  name="email"
                  autoComplete="username"
                  placeholder="Masukkan email admin"
                  disabled
                  className="w-full rounded-xl border border-rose-100 bg-brand-cream/60 py-3.5 pl-12 pr-4 text-sm text-brand-text outline-none placeholder:text-brand-muted/60 disabled:cursor-not-allowed disabled:opacity-70"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 block text-sm font-semibold text-brand-text"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted"
                />

                <input
                  id="admin-password"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  placeholder="Masukkan password"
                  disabled
                  className="w-full rounded-xl border border-rose-100 bg-brand-cream/60 py-3.5 pl-12 pr-4 text-sm text-brand-text outline-none placeholder:text-brand-muted/60 disabled:cursor-not-allowed disabled:opacity-70"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="button"
              disabled
              className="mt-2 w-full cursor-not-allowed rounded-full bg-brand-pink/50 px-6 py-3.5 text-sm font-bold text-white"
            >
              Masuk ke Dashboard
            </button>
          </form>

          {/* Development Notice */}
          <div
            role="status"
            className="mt-6 rounded-xl border border-brand-pink/10 bg-brand-soft px-4 py-3"
          >
            <p className="text-center text-xs leading-5 text-brand-muted">
              Akses administrator belum tersedia.
              Sistem autentikasi sedang dalam tahap pengembangan.
            </p>
          </div>
        </section>

        {/* Back Navigation */}
        <div className="mt-7 text-center">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-brand-muted transition-colors hover:text-brand-pink"
          >
            <ArrowLeft
              size={17}
              aria-hidden="true"
              className="transition-transform group-hover:-translate-x-1"
            />
            Kembali ke Website
          </Link>
        </div>

        {/* Copyright */}
        <p className="mt-5 text-center text-xs text-brand-muted/70">
          © {new Date().getFullYear()} Berbagi Kebahagiaan
        </p>
      </div>
    </main>
  );
}
