
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EventCreateForm from "@/components/admin/event-create-form";

export default function NewEventPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div>
        <Link
          href="/admin/dashboard/events"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#B82053] hover:underline"
        >
          <ArrowLeft size={16} />
          Kembali ke Daftar Kegiatan
        </Link>

        <h1 className="mt-3 text-2xl font-extrabold text-[#373634]">
          Tambah Kegiatan Baru
        </h1>

        <p className="mt-1 text-sm text-[#6E5F68]">
          Lengkapi informasi kegiatan sebelum menyimpan draft.
        </p>
      </div>

      <EventCreateForm />
    </div>
  );
}
