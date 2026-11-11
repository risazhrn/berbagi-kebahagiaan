/** Shared, browser-safe event model. Never import server-only modules here. */
export type EventTab = "upcoming" | "past";

export type PublicEvent = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  start_at: string;
  end_at: string;
  location: string;
  address: string | null;
  maps_url: string | null;
  price: number;
  quota: number;
  poster_path: string | null;
  status: string;
};

export const PUBLIC_EVENT_PAGE_SIZE = 9;

export function eventDate(date: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta",
  }).format(new Date(date));
}

export function eventTime(date: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Jakarta",
  }).format(new Date(date));
}

export function eventPrice(price: number): string {
  if (price === 0) return "Gratis";
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", maximumFractionDigits: 0,
  }).format(price);
}

export function eventPosterUrl(path: string | null): string | null {
  if (!path) return null;
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!baseUrl) return null;
  return `${baseUrl.replace(/\/$/, "")}/storage/v1/object/public/event-posters/${path.split("/").map(encodeURIComponent).join("/")}`;
}
