
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  HeartHandshake,
  Images,
  Ticket,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

type SummaryItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const summary: SummaryItem[] = [
  {
    title: "Total Kegiatan",
    description: "Menunggu data kegiatan",
    icon: CalendarDays,
  },
  {
    title: "Total Pendaftaran",
    description: "Menunggu modul peserta",
    icon: Ticket,
  },
  {
    title: "Pembayaran Berhasil",
    description: "Menunggu integrasi DOKU",
    icon: CheckCircle2,
  },
  {
    title: "Total Pendapatan",
    description: "Menunggu integrasi DOKU",
    icon: Wallet,
  },
];

function EmptyPanel({
  title,
  description,
  emptyTitle,
  emptyDescription,
  icon: Icon,
}: {
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  icon: LucideIcon;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#F2E4E9] bg-white">
      <div className="border-b border-[#F6EAF0] p-5">
        <h2 className="font-heading font-bold text-[#373634]">
          {title}
        </h2>
        <p className="mt-1 text-xs text-[#6E5F68]">
          {description}
        </p>
      </div>

      <div className="flex min-h-56 flex-col items-center justify-center p-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FDE8EF]">
          <Icon size={24} className="text-[#EE3A77]" />
        </div>
        <h3 className="mt-4 font-semibold">
          {emptyTitle}
        </h3>
        <p className="mt-2 max-w-xs text-sm leading-6 text-[#6E5F68]">
          {emptyDescription}
        </p>
      </div>
    </section>
  );
}

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <section className="relative overflow-hidden rounded-3xl bg-[#EE3A77] p-6 text-white sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-14 h-48 w-48 rounded-full border-[32px] border-white/10"
        />

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold">
            <HeartHandshake size={15} />
            Berbagi Kebahagiaan
          </div>

          <h2 className="mt-5 font-heading text-2xl font-extrabold sm:text-3xl">
            Selamat datang, Admin!
          </h2>

          <p className="mt-3 text-sm leading-7 text-white/90">
            Kelola kegiatan, pantau pendaftaran, dan
            hadirkan lebih banyak momen kebahagiaan
            melalui komunitas.
          </p>

          <Link
            href="/admin/dashboard/events"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#B82053] transition hover:bg-[#FFF0F5]"
          >
            Kelola Kegiatan
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Summary */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {summary.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-[#F2E4E9] bg-white p-5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FDE8EF]">
                <Icon size={20} className="text-[#EE3A77]" />
              </div>

              <p className="mt-5 text-sm font-medium text-[#6E5F68]">
                {item.title}
              </p>

              <p className="mt-2 text-3xl font-extrabold text-[#373634]">
                —
              </p>

              <p className="mt-2 text-xs text-[#A18B95]">
                {item.description}
              </p>
            </div>
          );
        })}
      </section>

      {/* Activity */}
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <EmptyPanel
          title="Kegiatan Terbaru"
          description="Kegiatan yang dibuat dan dipublikasikan oleh admin."
          emptyTitle="Belum ada data kegiatan"
          emptyDescription="Ringkasan kegiatan akan terhubung dengan Supabase pada pengembangan berikutnya."
          icon={CalendarDays}
        />

        <EmptyPanel
          title="Aktivitas Pendaftaran"
          description="Pendaftaran dan pembayaran terbaru."
          emptyTitle="Belum ada aktivitas"
          emptyDescription="Aktivitas peserta akan tampil setelah modul registrasi dibuat."
          icon={Users}
        />
      </div>

      {/* Quick Access */}
      <section className="rounded-2xl border border-[#F2E4E9] bg-white p-5">
        <h2 className="font-heading font-bold">
          Akses Cepat
        </h2>

        <p className="mt-1 text-xs text-[#6E5F68]">
          Kelola fitur website yang sudah tersedia.
        </p>

        <Link
          href="/admin/dashboard/events"
          className="mt-5 flex items-center gap-3 rounded-xl border border-[#F2E4E9] p-4 transition hover:border-[#EE3A77]/40 hover:bg-[#FFF8FA]"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FDE8EF]">
            <CalendarDays
              size={20}
              className="text-[#EE3A77]"
            />
          </div>

          <div className="flex-1">
            <p className="text-sm font-bold">
              Manajemen Kegiatan
            </p>
            <p className="mt-1 text-xs text-[#6E5F68]">
              Tambah dan lihat data kegiatan.
            </p>
          </div>

          <ArrowRight
            size={17}
            className="text-[#EE3A77]"
          />
        </Link>

        <div className="mt-3 flex items-center gap-2 text-xs text-[#A18B95]">
          <Images size={15} />
          Modul Galeri, Pendaftaran, dan Laporan menyusul.
        </div>
      </section>
    </div>
  );
}
