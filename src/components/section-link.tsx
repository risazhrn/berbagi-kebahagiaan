
"use client";

import type {
  ComponentProps,
  MouseEvent,
  ReactNode,
} from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SectionId = "hero" | "about" | "agenda" | "gallery";

type SectionLinkProps = Omit<
  ComponentProps<typeof Link>,
  "href" | "onClick"
> & {
  section: SectionId;
  children: ReactNode;
};

const STORAGE_KEY = "bk-pending-section";

export default function SectionLink({
  section,
  children,
  ...props
}: SectionLinkProps) {
  const pathname = usePathname();

  const handleClick = (
    event: MouseEvent<HTMLAnchorElement>
  ) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    if (pathname === "/") {
      event.preventDefault();

      const element = document.getElementById(section);

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      element?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });

      return;
    }

    sessionStorage.setItem(STORAGE_KEY, section);
  };

  return (
    <Link
      {...props}
      href="/"
      scroll={false}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
