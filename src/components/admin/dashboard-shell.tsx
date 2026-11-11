
"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ChartNoAxesCombined,
  ChevronRight,
  CreditCard,
  ExternalLink,
  FileText,
  HeartHandshake,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  label: string;
  href?: string;
  icon: LucideIcon;
};

type Props = {
  children: ReactNode;
  logoutAction: () => Promise<void>;
};

const navigation: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Kegiatan",
    href: "/admin/dashboard/events",
    icon: CalendarDays,
  },
  {
    label: "Pendaftaran",
    icon: Users,
  },
  {
    label: "Pembayaran",
    icon: CreditCard,
  },
  {
    label: "Galeri",
    icon: Images,
  },
  {
    label: "Konten Website",
    icon: FileText,
  },
  {
    label: "Laporan",
    icon: ChartNoAxesCombined,
  },
];

export default function DashboardShell({
  children,
  logoutAction,
}: Props) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const currentPage =
    [...navigation]
      .filter((item) => item.href)
      .reverse()
      .find(
        (item) =>
          pathname === item.href ||
          pathname.startsWith(`${item.href}/`)
      ) ?? navigation[0];

  const isActive = (item: NavItem) => {
    if (!item.href) return false;

    if (item.href === "/admin/dashboard") {
      return pathname === item.href;
    }

    return (
      pathname === item.href ||
      pathname.startsWith(`${item.href}/`)
    );
  };

  function SidebarContent() {
    return (
      <>
        <Link
          href="/admin/dashboard"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-3 px-2"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FDE8EF]">
            <HeartHandshake
              size={24}
              className="text-[#EE3A77]"
            />
          </span>

          <span>
            <span className="block font-heading text-sm font-extrabold leading-5 text-[#373634]">
              Berbagi
            </span>

            <span className="block font-heading text-sm font-extrabold text-[#EE3A77]">
              Kebahagiaan
            </span>

            <span className="mt-1 block text-[10px] font-bold uppercase tracking-widest text-[#A18B95]">
              Admin Panel
            </span>
          </span>
        </Link>

        <div className="mt-9 px-2">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-[#A18B95]">
            Menu Utama
          </p>

          <nav
            aria-label="Navigasi admin"
            className="space-y-1"
          >
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);

              const className = [
                "flex w-full items-center gap-3",
                "rounded-xl px-3 py-3",
                "text-sm font-semibold transition",
                active
                  ? "bg-[#FDE8EF] text-[#B82053]"
                  : "text-[#6E5F68] hover:bg-[#FFF4F7] hover:text-[#EE3A77]",
              ].join(" ");

              if (!item.href) {
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#A18B95]"
                    title="Modul belum tersedia"
                  >
                    <Icon size={19} />
                    <span className="flex-1">
                      {item.label}
                    </span>
                    <span className="text-[10px]">
                      Segera
                    </span>
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={
                    active ? "page" : undefined
                  }
                  className={className}
                >
                  <Icon
                    size={19}
                    className="shrink-0"
                  />

                  <span className="flex-1">
                    {item.label}
                  </span>

                  {active && (
                    <ChevronRight size={15} />
                  )}
                </Link>
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

  return (
    <div className="min-h-[100dvh] bg-[#FFF9F6] text-[#373634]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col overflow-y-auto border-r border-[#F2E4E9] bg-white px-4 py-7 lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {menuOpen && (
        <button
          type="button"
          aria-label="Tutup navigasi"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* Mobile sidebar */}
      <aside
        aria-label="Navigasi admin mobile"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(85vw,290px)] flex-col overflow-y-auto bg-white px-4 py-6 shadow-xl transition-transform duration-300 lg:hidden ${
          menuOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="mb-3 flex justify-end">
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Tutup menu"
            className="rounded-lg p-2 text-[#6E5F68] hover:bg-[#FDE8EF]"
          >
            <X size={20} />
          </button>
        </div>

        <SidebarContent />
      </aside>

      {/* Content wrapper */}
      <div className="min-h-[100dvh] lg:pl-64">
        {/* Shared Header */}
        <header className="sticky top-0 z-20 border-b border-[#F2E4E9] bg-white/95 backdrop-blur-md">
          <div className="flex h-[76px] items-center justify-between gap-4 px-4 sm:px-7 lg:px-9">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                aria-label="Buka navigasi"
                onClick={() => setMenuOpen(true)}
                className="rounded-xl border border-[#F2E4E9] p-2.5 lg:hidden"
              >
                <Menu size={20} />
              </button>

              <div className="min-w-0">
                <p className="text-[11px] font-medium text-[#A18B95]">
                  Admin Panel
                </p>

                <h1 className="truncate font-heading text-lg font-extrabold sm:text-xl">
                  {currentPage.label}
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
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FDE8EF] text-sm font-extrabold text-[#B82053]"
              >
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-7 sm:py-8 lg:px-9 lg:py-9">
          {children}
        </main>

        <footer className="px-4 pb-7 pt-6 text-center text-xs text-[#A18B95] sm:px-7">
          Berbagi Kebahagiaan — Admin Management
        </footer>
      </div>
    </div>
  );
}
