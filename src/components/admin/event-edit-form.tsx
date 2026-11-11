import EventForm, { type EventData } from "@/components/admin/event-form";
export default function EventEditForm({ event }: { event: EventData }) {
  return <EventForm mode="edit" event={event} />;
}
