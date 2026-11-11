
"use client";

import { useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export default function AdminLoginForm() {
  const router = useRouter();

  const [supabase] = useState(() => createClient());
  const submittingRef = useRef(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (submittingRef.current) return;

    submittingRef.current = true;
    setLoading(true);
    setErrorMessage("");

    try {
      // Login menggunakan Supabase Auth
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (error || !data.user) {
        setErrorMessage(
          "Email atau password tidak sesuai."
        );
        return;
      }

      // Periksa apakah user merupakan admin
      const { data: admin, error: adminError } =
        await supabase
          .from("admins")
          .select("id")
          .eq("id", data.user.id)
          .maybeSingle();

      if (adminError || !admin) {
        await supabase.auth.signOut();

        setErrorMessage(
          "Akun ini tidak memiliki akses administrator."
        );
        return;
      }

      // Arahkan admin ke dashboard
      router.replace("/admin/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Admin login failed:", error);

      setErrorMessage(
        "Login gagal. Silakan coba kembali."
      );
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-brand-cream px-5 py-10">
      <div className="w-full max-w-md">
        {/* BRAND */}
        <div className="mb-7 flex flex-col items-center text-center">
          <Link
            href="/"
            aria-label="Kembali ke beranda"
          >
            <Image
              src="/logo.png"
              alt="Berbagi Kebahagiaan"
              width={180}
              height={72}
              priority
              className="h-auto max-h-20 w-auto object-contain"
            />
          </Link>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-brand-pink/15 bg-white px-4 py-2">
            <ShieldCheck
              size={15}
              className="text-brand-pink"
              aria-hidden="true"
            />

            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-dark">
              Administrator Area
            </span>
          </div>
        </div>

        {/* LOGIN CARD */}
        <section className="rounded-[2rem] border border-brand-pink/10 bg-white p-6 shadow-xl shadow-brand-pink/5 sm:p-9">
          <div className="text-center">
            <h1 className="font-heading text-2xl font-extrabold text-brand-text sm:text-3xl">
              Selamat Datang!
            </h1>

            <p className="mt-3 text-sm leading-6 text-brand-muted">
              Masuk untuk mengelola kegiatan dan informasi
              Berbagi Kebahagiaan.
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="mt-8 space-y-5"
          >
            {/* EMAIL */}
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
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  autoComplete="username"
                  placeholder="Masukkan email admin"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-rose-100 bg-brand-cream/60 py-3.5 pl-12 pr-4 text-sm text-brand-text outline-none transition focus:border-brand-pink focus:ring-4 focus:ring-brand-pink/10 disabled:opacity-60"
                />
              </div>
            </div>

            {/* PASSWORD */}
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
                  type={
                    showPassword ? "text" : "password"
                  }
                  name="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  autoComplete="current-password"
                  placeholder="Masukkan password"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-rose-100 bg-brand-cream/60 py-3.5 pl-12 pr-12 text-sm text-brand-text outline-none transition focus:border-brand-pink focus:ring-4 focus:ring-brand-pink/10 disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? "Sembunyikan password"
                      : "Tampilkan password"
                  }
                  aria-pressed={showPassword}
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-brand-muted transition hover:text-brand-pink disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* ERROR MESSAGE */}
            {errorMessage && (
              <p
                role="alert"
                aria-live="polite"
                className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700"
              >
                {errorMessage}
              </p>
            )}

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-brand-pink px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Sedang Masuk..."
                : "Masuk ke Dashboard"}
            </button>
          </form>
        </section>

        {/* BACK TO WEBSITE */}
        <div className="mt-7 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-muted transition-colors hover:text-brand-pink"
          >
            <ArrowLeft
              size={17}
              aria-hidden="true"
            />
            Kembali ke Website
          </Link>
        </div>
      </div>
    </main>
  );
}
