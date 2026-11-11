import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Heart, Info, MapPin, Ticket, Users, Clock3, ImageIcon } from "lucide-react";
import { getPublishedEventBySlug } from "@/lib/events/public-events";
import { eventDate, eventTime, eventPrice, eventPosterUrl } from "@/lib/events/event-model";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getPublishedEventBySlug(slug);
  if (!event) return { title: "Kegiatan Tidak Ditemukan | Berbagi Kebahagiaan" };
  return { title: `${event.title} | Berbagi Kebahagiaan`, description: event.description.slice(0, 160) };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = await getPublishedEventBySlug(slug);
  if (!event) notFound();

  const price = eventPrice(event.price);
  const date = eventDate(event.start_at);
  const start = eventTime(event.start_at);
  const end = eventTime(event.end_at);
  const poster = eventPosterUrl(event.poster_path);
  const hasEnded = new Date(event.end_at).getTime() < Date.now();

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:py-12">
      <Link href="/events" className="group mb-7 inline-flex items-center gap-2 text-sm font-semibold text-brand-muted transition-colors hover:text-brand-pink"><ArrowLeft size={17} aria-hidden="true" />Kembali ke Daftar Kegiatan</Link>
      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-3xl border border-brand-pink/10 bg-brand-soft">
            {poster ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={poster} alt={`Poster ${event.title}`} className="aspect-video w-full object-contain" />
            ) : (
              <div className="flex aspect-video flex-col items-center justify-center gap-2 text-brand-pink"><ImageIcon size={40} /><span className="text-sm text-brand-muted">Belum ada poster</span></div>
            )}
          </div>
          <section aria-labelledby="event-about-heading" className="rounded-3xl border border-brand-pink/10 bg-white p-6 sm:p-8">
            <h2 id="event-about-heading" className="font-heading text-xl font-extrabold text-brand-text">Tentang Kegiatan</h2>
            <div className="mt-4 h-1 w-12 rounded-full bg-brand-pink" />
            <p className="mt-5 whitespace-pre-line break-words text-sm leading-8 text-brand-muted sm:text-base">{event.description}</p>
          </section>
          <section aria-labelledby="event-information-heading" className="rounded-3xl border border-brand-pink/10 bg-white p-6 sm:p-8">
            <h2 id="event-information-heading" className="font-heading text-xl font-extrabold text-brand-text">Informasi Kegiatan</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <InfoItem icon={CalendarDays} label="Tanggal Kegiatan" value={date} />
              <InfoItem icon={Clock3} label="Waktu" value={`${start}–${end} WIB`} />
              <InfoItem icon={MapPin} label="Lokasi" value={event.location} />
              <InfoItem icon={Users} label="Kuota Peserta" value={`${event.quota} peserta`} />
              <InfoItem icon={Ticket} label="Biaya Partisipasi" value={price} />
            </div>
            {event.address && <p className="mt-5 whitespace-pre-line text-sm leading-7 text-brand-muted">Alamat: {event.address}</p>}
            {event.maps_url && /^https:\/\//i.test(event.maps_url) && <a href={event.maps_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-bold text-brand-pink hover:underline">Lihat lokasi di Maps</a>}
          </section>
        </div>
        <aside className="lg:sticky lg:top-28">
          <div className="overflow-hidden rounded-3xl border border-brand-pink/10 bg-white shadow-lg shadow-brand-pink/5">
            <div className="bg-brand-soft px-6 py-7"><p className="text-xs font-bold uppercase tracking-wider text-brand-dark">Biaya Partisipasi</p><p className="mt-2 font-heading text-3xl font-extrabold text-brand-pink">{price}</p><p className="mt-2 text-xs text-brand-muted">Per peserta</p></div>
            <div className="space-y-5 px-6 py-7">
              <div className="text-sm text-brand-muted"><CalendarDays size={18} className="mr-2 inline text-brand-pink" />{date}</div>
              <div className="text-sm text-brand-muted"><MapPin size={18} className="mr-2 inline text-brand-pink" />{event.location}</div>
              <div className="text-sm text-brand-muted"><Users size={18} className="mr-2 inline text-brand-pink" />Kuota {event.quota} peserta</div>
              <div className="border-t border-brand-pink/10 pt-5">
                <button type="button" disabled className="w-full cursor-not-allowed rounded-full bg-brand-pink/45 px-6 py-3.5 text-sm font-bold text-white">{hasEnded ? "Kegiatan Telah Berakhir" : "Pendaftaran Belum Dibuka"}</button>
                <div className="mt-4 flex items-start gap-2 rounded-2xl bg-brand-soft p-3"><Info size={17} className="mt-0.5 shrink-0 text-brand-dark" /><p className="text-xs leading-5 text-brand-muted">Fitur pendaftaran online belum tersedia pada tahap pengembangan ini.</p></div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand-pink"><Icon size={20} aria-hidden="true" /></div>
      <div className="min-w-0"><p className="text-xs font-medium text-brand-muted">{label}</p><p className="mt-1 text-sm font-bold text-brand-text">{value}</p></div>
    </div>
  );
}
