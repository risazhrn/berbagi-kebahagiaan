
"use client";

import { useEffect, useState } from "react";
import type { MouseEvent } from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";

type HomeSection = "hero" | "about" | "agenda" | "gallery";

type NavigationItem = {
  label: string;
  href: string;
  key: "home" | "about" | "agenda" | "gallery" | "status";
  section?: HomeSection;
};

const STORAGE_KEY = "bk-pending-section";

const navigation: NavigationItem[] = [
  {
    label: "Beranda",
    href: "/",
    key: "home",
    section: "hero",
  },
  {
    label: "Tentang",
    href: "/",
    key: "about",
    section: "about",
  },
  {
    label: "Kegiatan",
    href: "/",
    key: "agenda",
    section: "agenda",
  },
  {
    label: "Galeri",
    href: "/",
    key: "gallery",
    section: "gallery",
  },
  {
    label: "Cek Status",
    href: "/status",
    key: "status",
  },
];

function isHomeSection(
  value: string | null
): value is HomeSection {
  return (
    value === "hero" ||
    value === "about" ||
    value === "agenda" ||
    value === "gallery"
  );
}

function scrollToSection(
  section: HomeSection,
  behavior: ScrollBehavior = "smooth"
): boolean {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const scrollBehavior: ScrollBehavior = reducedMotion
    ? "auto"
    : behavior;

  if (section === "hero") {
    window.scrollTo({
      top: 0,
      behavior: scrollBehavior,
    });

    return true;
  }

  const element = document.getElementById(section);

  if (!element) return false;

  element.scrollIntoView({
    behavior: scrollBehavior,
    block: "start",
  });

  return true;
}

export default function SiteHeader() {
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] =
    useState<HomeSection>("hero");

  // Detect active section when scrolling
  useEffect(() => {
    if (pathname !== "/") return;

    let frameId = 0;

    const updateActiveSection = () => {
      const about = document.getElementById("about");
      const agenda = document.getElementById("agenda");
      const gallery = document.getElementById("gallery");

      const activationLine = Math.min(
        180,
        window.innerHeight * 0.35
      );

      const scrollBottom =
        window.scrollY + window.innerHeight;

      const documentHeight =
        document.documentElement.scrollHeight;

      const isAtBottom =
        documentHeight - scrollBottom <= 5;

      let currentSection: HomeSection = "hero";

      if (
        gallery &&
        (
          gallery.getBoundingClientRect().top <=
            activationLine ||
          isAtBottom
        )
      ) {
        currentSection = "gallery";
      } else if (
        agenda &&
        agenda.getBoundingClientRect().top <=
          activationLine
      ) {
        currentSection = "agenda";
      } else if (
        about &&
        about.getBoundingClientRect().top <=
          activationLine
      ) {
        currentSection = "about";
      }

      setActiveSection((previous) =>
        previous === currentSection
          ? previous
          : currentSection
      );
    };

    const onScroll = () => {
      if (frameId) return;

      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        updateActiveSection();
      });
    };

    updateActiveSection();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [pathname]);

  // Restore the selected section after page navigation
  useEffect(() => {
    if (pathname !== "/") return;

    const pending = sessionStorage.getItem(STORAGE_KEY);

    if (!isHomeSection(pending)) return;

    let frameId = 0;
    let attempts = 0;
    let cancelled = false;

    const restoreSection = () => {
      if (cancelled) return;

      const elementExists =
        pending === "hero" ||
        document.getElementById(pending) !== null;

      if (elementExists) {
        sessionStorage.removeItem(STORAGE_KEY);

        scrollToSection(pending, "auto");
        setActiveSection(pending);

        return;
      }

      // Wait briefly for homepage sections to mount
      if (attempts < 60) {
        attempts += 1;

        frameId = window.requestAnimationFrame(
          restoreSection
        );
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    };

    frameId = window.requestAnimationFrame(
      restoreSection
    );

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frameId);
    };
  }, [pathname]);

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleSectionClick = (
    event: MouseEvent<HTMLAnchorElement>,
    section: HomeSection
  ) => {
    // Keep normal behavior for modified clicks
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    setIsMenuOpen(false);

    if (pathname === "/") {
      // Same page: prevent navigation and scroll directly
      event.preventDefault();

      scrollToSection(section);
      setActiveSection(section);

      return;
    }

    // Different page: remember destination
    // before navigating to the homepage
    sessionStorage.setItem(STORAGE_KEY, section);
  };

  const isActive = (key: NavigationItem["key"]) => {
    if (pathname === "/") {
      if (key === "home") {
        return activeSection === "hero";
      }

      return key === activeSection;
    }

    if (key === "agenda") {
      return (
        pathname === "/events" ||
        pathname.startsWith("/events/")
      );
    }

    if (key === "status") {
      return (
        pathname === "/status" ||
        pathname.startsWith("/status/")
      );
    }

    return false;
  };

  const currentPage = (
    item: NavigationItem,
    active: boolean
  ): "page" | "location" | undefined => {
    if (!active) return undefined;

    if (
      pathname === "/" &&
      item.section &&
      item.section !== "hero"
    ) {
      return "location";
    }

    return "page";
  };

  return (
    <header className="sticky top-0 z-50 border-b border-rose-100 bg-brand-cream/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        {/* Logo */}
        <Link
          href="/"
          scroll={false}
          onClick={(event) =>
            handleSectionClick(event, "hero")
          }
          aria-label="Kembali ke Beranda"
          className="flex shrink-0 items-center"
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
            const active = isActive(item.key);

            return (
              <Link
                key={item.key}
                href={item.href}
                scroll={
                  item.section ? false : undefined
                }
                onClick={
                  item.section
                    ? (event) =>
                        handleSectionClick(
                          event,
                          item.section!
                        )
                    : undefined
                }
                aria-current={currentPage(item, active)}
                className={`group relative py-2 text-sm font-medium transition-colors duration-200 ${
                  active
                    ? "text-brand-pink"
                    : "text-brand-muted hover:text-brand-pink"
                }`}
              >
                {item.label}

                <span
                  aria-hidden="true"
                  className={`absolute bottom-0 left-0 h-0.5 rounded-full bg-brand-pink transition-all duration-300 ${
                    active
                      ? "w-full"
                      : "w-0 group-hover:w-full"
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
          <ArrowUpRight
            size={16}
            aria-hidden="true"
          />
        </Link>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={
            isMenuOpen ? "Tutup menu" : "Buka menu"
          }
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() =>
            setIsMenuOpen((previous) => !previous)
          }
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-brand-pink/15 bg-white text-brand-text transition-colors hover:bg-brand-soft hover:text-brand-pink lg:hidden"
        >
          {isMenuOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      <nav
        id="mobile-navigation"
        aria-label="Navigasi mobile"
        inert={!isMenuOpen}
        className={`grid overflow-hidden bg-brand-cream transition-[grid-template-rows,opacity] duration-300 ease-in-out lg:hidden ${
          isMenuOpen
            ? "grid-rows-[1fr] border-t border-rose-100 opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-5 sm:px-8">
            {navigation.map((item) => {
              const active = isActive(item.key);

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  scroll={
                    item.section ? false : undefined
                  }
                  onClick={(event) => {
                    if (item.section) {
                      handleSectionClick(
                        event,
                        item.section
                      );
                    } else {
                      setIsMenuOpen(false);
                    }
                  }}
                  aria-current={currentPage(item, active)}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                    active
                      ? "bg-brand-soft font-bold text-brand-pink"
                      : "text-brand-muted hover:bg-brand-soft hover:text-brand-pink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Mobile CTA */}
            <div className="mt-3 border-t border-rose-100 pt-4">
              <Link
                href="/events"
                onClick={() => setIsMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-pink px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
              >
                Ikut Kegiatan
                <ArrowUpRight
                  size={17}
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
