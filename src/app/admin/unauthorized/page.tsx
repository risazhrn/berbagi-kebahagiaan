import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="mx-auto max-w-lg px-5 py-20 text-center">
      <h1 className="font-heading text-2xl font-bold text-brand-text">
        Akses Ditolak
      </h1>

      <p className="mt-4 text-sm text-brand-muted">
        Akun ini tidak memiliki izin untuk mengakses dashboard.
      </p>

      <Link
        href="/"
        className="mt-6 inline-flex text-sm font-bold text-brand-pink"
      >
        Kembali ke Website
      </Link>
    </main>
  );
}