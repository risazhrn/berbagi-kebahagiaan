
"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChartNoAxesCombined,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  ExternalLink,
  FileText,
  HeartHandshake,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Search,
  ShieldCheck,
  Ticket,
  Users,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";

type ModuleId =
  | "overview"
  | "events"
  | "registrations"
  | "payments"
  | "gallery"
  | "content"
  | "reports";

type NavItem = {
  id: ModuleId;
  title: string;
  icon: LucideIcon;
  description: string;
};

const navigation: NavItem[] = [
  {
    id: "overview",
    title: "Dashboard",
    icon: LayoutDashboard,
    description: "Ringkasan aktivitas komunitas",
  },
  {
    id: "events",
    title: "Kegiatan",
    icon: CalendarDays,
    description: "Kelola informasi dan jadwal kegiatan",
  },
  {
    id: "registrations",
    title: "Pendaftaran",
    icon: Users,
    description: "Kelola peserta setiap kegiatan",
  },
  {
    id: "payments",
    title: "Pembayaran",
    icon: CreditCard,
    description: "Pantau transaksi DOKU",
  },
  {
    id: "gallery",
    title: "Galeri",
    icon: Images,
    description: "Dokumentasi kegiatan komunitas",
  },
  {
    id: "content",
    title: "Konten Website",
    icon: FileText,
    description: "Kelola informasi website",
  },
  {
    id: "reports",
    title: "Laporan",
    icon: ChartNoAxesCombined,
    description: "Ringkasan dan analitik kegiatan",
  },
];

type DashboardShellProps = {
  logoutAction: () => Promise<void>;
};

function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#EE3A77]">
            {eyebrow}
          </p>
        )}

        <h2 className="font-heading text-xl font-extrabold tracking-tight text-[#373634] sm:text-2xl">
          {title}
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6E5F68]">
          {description}
        </p>
      </div>

      {action}
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center px-5 py-9 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FDE8EF]">
        <Icon size={25} className="text-[#EE3A77]" />
      </div>

      <h3 className="font-heading text-base font-bold text-[#373634]">
        {title}
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-[#6E5F68]">
        {description}
      </p>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#F2E4E9] bg-white shadow-[0_8px_32px_rgba(55,54,52,0.025)]">
      <div className="border-b border-[#F6EAF0] px-5 py-4 sm:px-6">
        <h3 className="font-heading text-base font-bold text-[#373634]">
          {title}
        </h3>

        {subtitle && (
          <p className="mt-1 text-xs leading-5 text-[#6E5F68]">
            {subtitle}
          </p>
        )}
      </div>

      {children}
    </section>
  );
}

function SummaryCard({
  title,
  icon: Icon,
  description,
}: {
  title: string;
  icon: LucideIcon;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[#F2E4E9] bg-white p-5 shadow-[0_8px_32px_rgba(55,54,52,0.025)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FDE8EF]">
          <Icon size={20} className="text-[#EE3A77]" />
        </div>
      </div>

      <p className="mt-5 text-sm font-medium text-[#6E5F68]">
        {title}
      </p>

      <p className="mt-2 text-3xl font-extrabold text-[#373634]">
        —
      </p>

      <p className="mt-2 text-xs text-[#A18B95]">
        {description}
      </p>
    </div>
  );
}

function Overview({
  onNavigate,
}: {
  onNavigate: (id: ModuleId) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-[#EE3A77] p-6 text-white sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-14 h-48 w-48 rounded-full border-[32px] border-white/10"
        />

        <div className="relative z-10 max-w-xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold">
            <HeartHandshake size={15} />
            Berbagi Kebahagiaan
          </div>

          <h2 className="font-heading text-2xl font-extrabold sm:text-3xl">
            Selamat datang, Admin!
          </h2>

          <p className="mt-3 text-sm leading-7 text-white/90">
            Kelola kegiatan, pantau pendaftaran, dan hadirkan
            lebih banyak momen kebahagiaan melalui komunitas.
          </p>

          <button
            type="button"
            onClick={() => onNavigate("events")}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#B82053] transition hover:bg-[#FFF0F5]"
          >
            Kelola Kegiatan
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard
          title="Total Kegiatan"
          icon={CalendarDays}
          description="Menunggu modul kegiatan"
        />
        <SummaryCard
          title="Total Pendaftaran"
          icon={Ticket}
          description="Menunggu modul peserta"
        />
        <SummaryCard
          title="Pembayaran Berhasil"
          icon={CheckCircle2}
          description="Menunggu integrasi DOKU"
        />
        <SummaryCard
          title="Total Pendapatan"
          icon={Wallet}
          description="Menunggu integrasi DOKU"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Panel
          title="Kegiatan Terbaru"
          subtitle="Kegiatan yang dibuat dan dipublikasikan oleh admin."
        >
          <EmptyState
            icon={CalendarDays}
            title="Belum ada data kegiatan"
            description="Daftar kegiatan akan muncul setelah modul Events terhubung ke Supabase."
          />
        </Panel>

        <Panel
          title="Aktivitas Pendaftaran"
          subtitle="Pendaftaran dan pembayaran terbaru."
        >
          <EmptyState
            icon={Users}
            title="Belum ada aktivitas"
            description="Aktivitas peserta akan tersedia setelah modul pendaftaran selesai."
          />
        </Panel>
      </div>

      <Panel
        title="Akses Cepat"
        subtitle="Pilih modul yang ingin kamu kelola."
      >
        <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
          {navigation
            .filter((item) =>
              ["events", "registrations", "gallery"].includes(item.id)
            )
            .map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className="group flex items-center gap-3 rounded-xl border border-[#F2E4E9] p-4 text-left transition hover:border-[#EE3A77]/40 hover:bg-[#FFF8FA]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FDE8EF]">
                    <Icon size={19} className="text-[#EE3A77]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[#373634]">
                      {item.title}
                    </p>

                    <p className="mt-1 text-xs text-[#6E5F68]">
                      {item.description}
                    </p>
                  </div>

                  <ChevronRight
                    size={16}
                    className="shrink-0 text-[#BBA5AE] transition group-hover:translate-x-0.5 group-hover:text-[#EE3A77]"
                  />
                </button>
              );
            })}
        </div>
      </Panel>
    </div>
  );
}

const moduleDescriptions: Record<
  Exclude<ModuleId, "overview">,
  {
    title: string;
    description: string;
    icon: LucideIcon;
    emptyTitle: string;
    emptyDescription: string;
    features: string[];
  }
> = {
  events: {
    title: "Manajemen Kegiatan",
    description: "Kelola jadwal, harga tiket, kuota, poster, dan status publikasi kegiatan.",
    icon: CalendarDays,
    emptyTitle: "Belum ada kegiatan",
    emptyDescription: "Fitur tambah, edit, hapus, dan publikasi kegiatan akan diaktifkan setelah tabel events dibuat.",
    features: ["Tambah & Edit Event", "Draft & Publikasi", "Jadwal & Kuota"],
  },
  registrations: {
    title: "Peserta & Pendaftaran",
    description: "Pantau peserta yang terdaftar pada setiap kegiatan dan status konfirmasinya.",
    icon: Users,
    emptyTitle: "Data peserta belum tersedia",
    emptyDescription: "Daftar peserta dan ekspor Excel akan tersedia setelah modul registrasi diimplementasikan.",
    features: ["Filter Event", "Status Registrasi", "Ekspor Excel"],
  },
  payments: {
    title: "Manajemen Pembayaran",
    description: "Pantau transaksi tiket melalui DOKU Checkout.",
    icon: CreditCard,
    emptyTitle: "Transaksi belum tersedia",
    emptyDescription: "Data pembayaran akan ditampilkan setelah integrasi DOKU Sandbox dan webhook selesai.",
    features: ["Invoice", "Status DOKU", "Riwayat Pembayaran"],
  },
  gallery: {
    title: "Manajemen Galeri",
    description: "Kelola foto dokumentasi kegiatan yang ditampilkan di website.",
    icon: Images,
    emptyTitle: "Galeri belum terhubung",
    emptyDescription: "Upload foto dan pengaturan galeri akan tersedia setelah Supabase Storage dikonfigurasi.",
    features: ["Upload Foto", "Urutan Foto", "Publikasi"],
  },
  content: {
    title: "Konten Website",
    description: "Perbarui konten halaman publik tanpa perlu mengubah source code.",
    icon: FileText,
    emptyTitle: "Editor konten belum tersedia",
    emptyDescription: "Pengelolaan konten akan diaktifkan setelah modul Content Management dibuat.",
    features: ["Homepage", "Tentang Komunitas", "Informasi Website"],
  },
  reports: {
    title: "Laporan & Analitik",
    description: "Lihat ringkasan performa kegiatan, pendaftaran, dan pembayaran.",
    icon: ChartNoAxesCombined,
    emptyTitle: "Laporan belum tersedia",
    emptyDescription: "Grafik dan ringkasan akan ditampilkan dari data nyata setelah modul terkait selesai.",
    features: ["Statistik Kegiatan", "Ringkasan Pendapatan", "Laporan Peserta"],
  },
};

function ModuleView({ module }: { module: Exclude<ModuleId, "overview"> }) {
  const current = moduleDescriptions[module];
  const Icon = current.icon;

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Pengelolaan"
        title={current.title}
        description={current.description}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        {current.features.map((feature) => (
          <div
            key={feature}
            className="flex items-center gap-2 rounded-xl border border-[#F2E4E9] bg-white px-4 py-3"
          >
            <span className="h-2 w-2 shrink-0 rounded-full bg-[#EE3A77]" />
            <span className="text-xs font-semibold text-[#6E5F68]">
              {feature}
            </span>
          </div>
        ))}
      </div>

      <Panel title={current.title}>
        <EmptyState
          icon={Icon}
          title={current.emptyTitle}
          description={current.emptyDescription}
        />
      </Panel>
    </div>
  );
}

export default function DashboardShell({
  logoutAction,
}: DashboardShellProps) {
  const [activeModule, setActiveModule] =
    useState<ModuleId>("overview");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function navigate(id: ModuleId) {
    setActiveModule(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function SidebarContent() {
    return (
      <>
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FDE8EF]">
            <HeartHandshake size={23} className="text-[#EE3A77]" />
          </div>

          <div>
            <p className="font-heading text-sm font-extrabold leading-5 text-[#373634]">
              Berbagi
              <span className="block text-[#EE3A77]">
                Kebahagiaan
              </span>
            </p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A18B95]">
              Admin Panel
            </p>
          </div>
        </div>

        <div className="mt-9 px-3">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#A18B95]">
            Menu Utama
          </p>

          <nav aria-label="Navigasi admin" className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = activeModule === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(item.id)}
                  aria-current={active ? "page" : undefined}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                    active
                      ? "bg-[#FDE8EF] text-[#B82053]"
                      : "text-[#6E5F68] hover:bg-[#FFF4F7] hover:text-[#EE3A77]"
                  }`}
                >
                  <Icon size={19} />
                  <span className="flex-1">{item.title}</span>
                  {active && <ChevronRight size={15} />}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto space-y-2 border-t border-[#F6EAF0] pt-5">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#6E5F68] transition hover:bg-[#FFF4F7] hover:text-[#EE3A77]"
          >
            <ExternalLink size={18} />
            Lihat Website
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-[#B82053] transition hover:bg-[#FDE8EF]"
            >
              <LogOut size={18} />
              Keluar
            </button>
          </form>
        </div>
      </>
    );
  }

  const current = navigation.find(
    (item) => item.id === activeModule
  )!;

  return (
    <div className="min-h-[100dvh] bg-[#FFF9F6] text-[#373634]">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-[#F2E4E9] bg-white px-4 py-7 lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Backdrop */}
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Tutup menu navigasi"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-[#373634]/45 lg:hidden"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        aria-label="Menu admin mobile"
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(85vw,290px)] flex-col bg-white px-4 py-6 shadow-xl transition-transform duration-300 lg:hidden ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
        inert={!mobileMenuOpen}
      >
        <div className="mb-3 flex justify-end">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Tutup menu"
            className="rounded-lg p-2 text-[#6E5F68] hover:bg-[#FDE8EF]"
          >
            <X size={20} />
          </button>
        </div>

        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="min-h-[100dvh] lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-[#F2E4E9] bg-white/95 backdrop-blur-md">
          <div className="flex h-[76px] items-center justify-between gap-4 px-4 sm:px-7 lg:px-9">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Buka menu navigasi"
                className="rounded-xl border border-[#F2E4E9] p-2.5 text-[#373634] lg:hidden"
              >
                <Menu size={20} />
              </button>

              <div className="min-w-0">
                <p className="text-[11px] font-medium text-[#A18B95]">
                  Admin Panel
                </p>

                <h1 className="truncate font-heading text-lg font-extrabold text-[#373634] sm:text-xl">
                  {current.title}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-2 rounded-full bg-[#F3FBF5] px-3 py-2 text-xs font-semibold text-[#24804B] sm:inline-flex">
                <ShieldCheck size={15} />
                Super Admin
              </span>

              <div
                aria-label="Super Admin"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FDE8EF] text-sm font-extrabold text-[#B82053]"
              >
                A
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-7 sm:py-8 lg:px-9 lg:py-9">
          {activeModule === "overview" ? (
            <Overview onNavigate={navigate} />
          ) : (
            <ModuleView module={activeModule} />
          )}
        </main>

        <footer className="px-4 pb-7 pt-6 text-center text-xs text-[#A18B95] sm:px-7">
          Berbagi Kebahagiaan — Admin Management
        </footer>
      </div>
    </div>
  );
}
