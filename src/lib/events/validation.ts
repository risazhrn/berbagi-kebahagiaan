export type EventField =
  | "title" | "category" | "description" | "start_at" | "end_at"
  | "price" | "quota" | "location" | "address" | "poster_path";

export type EventErrors = Partial<Record<EventField, string>>;
export type EventPayload = {
  title: string;
  category: string;
  description: string;
  start_at: string; // WIB: YYYY-MM-DDTHH:mm
  end_at: string;
  location: string;
  address: string | null;
  price: number;
  quota: number;
  poster_path?: string | null;
};

export function parseWib(value: unknown): string | null {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  const date = new Date(`${value}:00+07:00`);
  if (!Number.isFinite(date.getTime())) return null;
  const normalized = new Date(date.getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 16);
  return normalized === value ? date.toISOString() : null;
}

const stringValue = (value: unknown) => typeof value === "string" ? value.trim() : "";

export function validateEvent(value: unknown): {
  data: Omit<EventPayload, "poster_path"> | null;
  errors: EventErrors;
} {
  const input = value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown> : {};
  const errors: EventErrors = {};
  const title = stringValue(input.title);
  const category = stringValue(input.category);
  const description = stringValue(input.description);
  const location = stringValue(input.location);
  const address = input.address == null ? "" : stringValue(input.address);
  const start_at = parseWib(input.start_at);
  const end_at = parseWib(input.end_at);
  const price = input.price;
  const quota = input.quota;

  if (title.length < 3 || title.length > 200) errors.title = "Nama kegiatan harus 3–200 karakter.";
  if (!category || category.length > 100) errors.category = "Kategori wajib diisi (maksimal 100 karakter).";
  if (!description || description.length > 10000) errors.description = "Deskripsi wajib diisi (maksimal 10.000 karakter).";
  if (!location || location.length > 200) errors.location = "Nama lokasi wajib diisi (maksimal 200 karakter).";
  if (input.address != null && typeof input.address !== "string") errors.address = "Alamat harus berupa teks.";
  else if (address.length > 1000) errors.address = "Alamat maksimal 1.000 karakter.";
  if (!start_at) errors.start_at = "Tanggal dan jam mulai tidak valid. Gunakan WIB.";
  if (!end_at) errors.end_at = "Tanggal dan jam selesai tidak valid. Gunakan WIB.";
  if (start_at && end_at && new Date(end_at) <= new Date(start_at)) errors.end_at = "Waktu selesai harus setelah waktu mulai.";
  if (typeof price !== "number" || !Number.isSafeInteger(price) || price < 1 || price > 2147483647)
    errors.price = "Harga tiket harus bilangan bulat Rp1–Rp2.147.483.647.";
  if (typeof quota !== "number" || !Number.isSafeInteger(quota) || quota < 1 || quota > 2147483647)
    errors.quota = "Kuota harus bilangan bulat 1–2.147.483.647.";

  if (Object.keys(errors).length || !start_at || !end_at || typeof price !== "number" || typeof quota !== "number")
    return { data: null, errors };
  return {
    data: { title, category, description, location, address: address || null,
      start_at: start_at!, end_at: end_at!, price: price as number, quota: quota as number },
    errors,
  };
}

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isAdminPosterPath(path: unknown, userId: string): path is string {
  return typeof path === "string" && UUID_RE.test(userId) &&
    new RegExp(`^posters/${userId}/[a-f0-9-]{36}\\.(jpg|png|webp)$`, "i").test(path);
}

export async function parseJsonBody(request: Request): Promise<Record<string, unknown> | null> {
  if (!request.headers.get("content-type")?.includes("application/json")) return null;
  const length = Number(request.headers.get("content-length") || 0);
  if (!Number.isFinite(length) || length > 64 * 1024) return null;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > 64 * 1024) return null;
    const value: unknown = JSON.parse(raw);
    return value && typeof value === "object" && !Array.isArray(value)
      ? value as Record<string, unknown> : null;
  } catch { return null; }
}

export function slugify(title: string): string {
  return title.normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    .slice(0, 70).replace(/-$/, "") || "kegiatan";
}
