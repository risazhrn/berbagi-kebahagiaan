
import Link from "next/link";
import {
  ArrowUpRight,
  Instagram,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const navigation = [
  { label: "Beranda", href: "/" },
  { label: "Tentang Kami", href: "/about" },
  { label: "Kegiatan", href: "/events" },
  { label: "Galeri", href: "/gallery" },
  { label: "Cek Status", href: "/status" },
];

const contacts = [
  {
    label: "WhatsApp",
    value: "083891818931",
    href: "https://wa.me/6283891818931",
    icon: Phone,
  },
  {
    label: "Email",
    value: "0berbagikebahagiaan@gmail.com",
    href: "mailto:0berbagikebahagiaan@gmail.com",
    icon: Mail,
  },
  {
    label: "Instagram",
    value: "@berbagi_kebahagiaannn",
    href: "https://www.instagram.com/berbagi_kebahagiaannn/",
    icon: Instagram,
  },
];

export default function SiteFooter() {
  return (
    <footer className="mt-16 bg-brand-text text-white">
      <div className="mx-auto max-w-7xl px-5 pb-8 pt-14 sm:px-8 lg:pt-16">
        <div className="grid gap-10 border-b border-white/15 pb-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-12">
          {/* Community Information */}
          <div className="space-y-4 lg:col-span-5">
            <h2 className="font-heading text-xl font-extrabold">
              Berbagi Kebahagiaan
            </h2>

            <p className="max-w-sm text-sm leading-7 text-white/65">
              Menciptakan Makna Melalui Tawa. Komunitas sosial
              berbasis di Bandung yang menghadirkan kebahagiaan
              melalui kepedulian, kreativitas, dan kebersamaan.
            </p>

            <div className="flex items-center gap-2 text-sm text-white/65">
              <MapPin
                size={17}
                className="shrink-0 text-brand-pink"
                aria-hidden="true"
              />
              Bandung, Jawa Barat, Indonesia
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-3">
            <h3 className="mb-5 font-heading text-sm font-bold">
              Navigasi
            </h3>

            <nav
              aria-label="Navigasi footer"
              className="flex flex-col items-start gap-3"
            >
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-white/65 transition-colors duration-200 hover:text-brand-pink"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-4">
            <h3 className="mb-5 font-heading text-sm font-bold">
              Hubungi Kami
            </h3>

            <div className="space-y-4">
              {contacts.map((contact) => {
                const Icon = contact.icon;

                return (
                  <a
                    key={contact.label}
                    href={contact.href}
                    target={
                      contact.label === "Email"
                        ? undefined
                        : "_blank"
                    }
                    rel={
                      contact.label === "Email"
                        ? undefined
                        : "noopener noreferrer"
                    }
                    className="group flex items-center gap-3 text-sm text-white/65 transition-colors hover:text-white"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-brand-pink transition-colors group-hover:bg-brand-pink group-hover:text-white">
                      <Icon size={18} aria-hidden="true" />
                    </span>

                    <span className="min-w-0 break-all">
                      {contact.value}
                    </span>

                    <ArrowUpRight
                      size={15}
                      className="ml-auto shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col gap-3 pt-7 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Berbagi Kebahagiaan.
            All rights reserved.
          </p>

          <p>Menciptakan Makna Melalui Tawa.</p>
        </div>
      </div>
    </footer>
  );
}
