
"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import {
  AlertTriangle,
  LoaderCircle,
  Send,
  Trash2,
  X,
} from "lucide-react";

export type EventAction = "publish" | "delete";

type Props = {
  open: boolean;
  action: EventAction;
  eventTitle: string;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function EventConfirmModal({
  open,
  action,
  eventTitle,
  loading,
  onClose,
  onConfirm,
}: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    cancelRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        if (!loading) onClose();
      }

      if (event.key !== "Tab") return;

      const buttons = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled)'
        ) ?? []
      );

      if (buttons.length === 0) {
        event.preventDefault();
        return;
      }

      const first = buttons[0];
      const last = buttons[buttons.length - 1];

      if (
        event.shiftKey &&
        document.activeElement === first
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [open, loading, onClose]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  const isDelete = action === "delete";

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#24171D]/60 p-4 backdrop-blur-[3px]"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !loading
        ) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="w-full max-w-[420px] rounded-3xl bg-white p-5 shadow-2xl sm:p-7"
      >
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Tutup modal"
            className="rounded-lg p-2 text-[#8A7880] transition hover:bg-[#FFF2F6] disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>

        <div className="flex flex-col items-center text-center">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
              isDelete ? "bg-red-50" : "bg-[#FDE8EF]"
            }`}
          >
            {isDelete ? (
              <Trash2 size={29} className="text-red-600" />
            ) : (
              <Send size={29} className="text-[#EE3A77]" />
            )}
          </div>

          <h2
            id={titleId}
            className="mt-5 font-heading text-xl font-extrabold text-[#373634]"
          >
            {isDelete
              ? "Hapus Kegiatan?"
              : "Publikasikan Kegiatan?"}
          </h2>

          <p
            id={descriptionId}
            className="mt-3 text-sm leading-6 text-[#6E5F68]"
          >
            {isDelete
              ? "Draft ini akan dihapus secara permanen dan tidak dapat dikembalikan."
              : "Kegiatan akan ditampilkan pada website Berbagi Kebahagiaan dan dapat dilihat pengunjung."}
          </p>

          <div className="mt-5 w-full rounded-xl border border-[#F2E4E9] bg-[#FFF9F6] px-4 py-3">
            <p className="break-words text-sm font-bold text-[#373634]">
              {eventTitle}
            </p>
          </div>

          {isDelete && (
            <div className="mt-4 flex items-start gap-2 text-left text-xs leading-5 text-red-600">
              <AlertTriangle
                size={16}
                className="mt-0.5 shrink-0"
              />
              <span>
                Pastikan kamu memilih kegiatan yang benar.
                Tindakan ini tidak dapat dibatalkan.
              </span>
            </div>
          )}
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-[#F2E4E9] px-4 py-3 text-sm font-bold text-[#6E5F68] transition hover:bg-[#FFF9F6] disabled:opacity-50"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
              isDelete
                ? "bg-red-600 hover:bg-red-700"
                : "bg-[#EE3A77] hover:bg-[#B82053]"
            }`}
          >
            {loading ? (
              <LoaderCircle
                size={17}
                className="animate-spin"
              />
            ) : isDelete ? (
              <Trash2 size={16} />
            ) : (
              <Send size={16} />
            )}

            {loading
              ? "Memproses..."
              : isDelete
                ? "Ya, Hapus"
                : "Publikasikan"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
