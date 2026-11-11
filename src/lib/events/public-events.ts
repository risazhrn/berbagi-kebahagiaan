import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { PublicEvent } from "@/lib/events/event-model";

const EVENT_FIELDS =
  "id,slug,title,category,description,start_at,end_at,location,address,maps_url,price,quota,poster_path,status";

// Client-side filtering is intended for a small catalog. Check for overflow
// so extra records are never silently mistaken for the complete catalog.
export const MAX_PUBLIC_EVENTS = 200;

export async function getAllPublicEvents(): Promise<{
  events: PublicEvent[];
  hasMore: boolean;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select(EVENT_FIELDS)
    .in("status", ["published", "completed"])
    .eq("is_archived", false)
    .order("start_at", { ascending: false });

  if (error) {
    console.error("Load public events:", error);
    throw new Error("Gagal memuat kegiatan publik.");
  }

  const rows = (data ?? []) as unknown as PublicEvent[];
  return {
    events: rows.slice(0, MAX_PUBLIC_EVENTS),
    hasMore: rows.length > MAX_PUBLIC_EVENTS,
  };
}

// Used by the home page; keep this server-side.
export async function getUpcomingEvents(): Promise<PublicEvent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_FIELDS)
    .eq("status", "published")
    .gte("end_at", new Date().toISOString())
    .order("start_at", { ascending: true })
    .limit(3);

  if (error) {
    console.error("Load upcoming events:", error);
    throw new Error("Gagal memuat kegiatan mendatang.");
  }
  return (data ?? []) as unknown as PublicEvent[];
}

// Used by /events/[slug]. Completed events remain accessible as archives.
export async function getPublishedEventBySlug(
  slug: string
): Promise<PublicEvent | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_FIELDS)
    .eq("slug", slug)
    .in("status", ["published", "completed"])
    .maybeSingle();

  if (error) {
    console.error("Load event detail:", error);
    throw new Error("Gagal memuat detail kegiatan.");
  }
  return data as unknown as PublicEvent | null;
}
