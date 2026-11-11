import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/auth/admin";
import EventEditForm from "@/components/admin/event-edit-form";

export const dynamic = "force-dynamic";
export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const { data: event, error } = await supabase.from("events").select(
    "id,title,category,description,start_at,end_at,location,address,price,quota,status,poster_path"
  ).eq("id",id).maybeSingle();
  if (error || !event) notFound();
  return <div className="mx-auto max-w-6xl space-y-4">
    <Link href="/admin/dashboard/events" className="inline-flex items-center gap-2 text-sm font-semibold text-[#B82053]"><ArrowLeft size={17}/>Kembali ke Daftar Kegiatan</Link>
    <div><h2 className="font-heading text-2xl font-extrabold text-[#373634]">Edit Kegiatan</h2><p className="mt-1 text-sm text-[#6E5F68]">Perbarui informasi dan poster kegiatan.</p></div>
    <EventEditForm event={event}/>
  </div>;
}
