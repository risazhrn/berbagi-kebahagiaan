
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";

const navigation = [
  { label: "Beranda", href: "/" },
  { label: "Tentang", href: "/about" },
  { label: "Kegiatan", href: "/events" },
  { label: "Galeri", href: "/gallery" },
  { label: "Cek Status", href: "/status" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-rose-100 bg-brand-cream/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setIsMenuOpen(false)}
          className="flex shrink-0 items-center"
          aria-label="Beranda Berbagi Kebahagiaan"
        >
          <Image
            src="/logo.png"
            alt="Logo Berbagi Kebahagiaan"
            width={150}
            height={60}
            priority
            className="h-11 w-auto object-contain transition-transform duration-300 hover:scale-105 sm:h-12"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Navigasi utama"
          className="hidden items-center gap-5 lg:flex xl:gap-7"
        >
          {navigation.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`group relative py-2 text-sm font-medium transition-colors duration-200 ${
                  active
                    ? "text-brand-pink"
                    : "text-brand-muted hover:text-brand-pink"
                }`}
              >
                {item.label}

                <span
                  className={`absolute bottom-0 left-0 h-0.5 rounded-full bg-brand-pink transition-all duration-300 ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <Link
          href="/events"
          className="hidden shrink-0 items-center gap-2 rounded-full bg-brand-pink px-5 py-3 text-xs font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-lg hover:shadow-brand-pink/20 lg:inline-flex"
        >
          Ikut Kegiatan
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-brand-pink/15 bg-white text-brand-text transition-colors hover:bg-brand-soft hover:text-brand-pink lg:hidden"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile & Tablet Navigation */}
      <nav
        id="mobile-navigation"
        aria-label="Navigasi mobile"
        inert={!isMenuOpen}
        className={`grid overflow-hidden border-rose-100 bg-brand-cream transition-[grid-template-rows,opacity] duration-300 ease-in-out lg:hidden ${
          isMenuOpen
            ? "grid-rows-[1fr] border-t opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-5 sm:px-8">
            {navigation.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-brand-soft text-brand-pink"
                      : "text-brand-muted hover:bg-brand-soft hover:text-brand-pink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="mt-3 border-t border-rose-100 pt-4">
              <Link
                href="/events"
                onClick={() => setIsMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-pink px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
              >
                Ikut Kegiatan
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
