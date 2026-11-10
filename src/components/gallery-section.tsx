
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Heart,
} from "lucide-react";

type GalleryItem = {
  id: number;
  title: string;
  image?: string;
  alt?: string;
};

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: "Dokumentasi Kegiatan 01",
    // image: "/gallery/kegiatan-01.jpg",
    // alt: "Dokumentasi kegiatan pertama",
  },
  {
    id: 2,
    title: "Dokumentasi Kegiatan 02",
  },
  {
    id: 3,
    title: "Dokumentasi Kegiatan 03",
  },
  {
    id: 4,
    title: "Dokumentasi Kegiatan 04",
  },
  {
    id: 5,
    title: "Dokumentasi Kegiatan 05",
  },
];

const AUTO_SCROLL_INTERVAL = 4000;

export default function GallerySection() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Menghitung ukuran card dan jarak antar-card
  const getScrollStep = useCallback(() => {
    const carousel = carouselRef.current;

    if (!carousel) return 0;

    const firstCard =
      carousel.firstElementChild as HTMLElement | null;

    if (!firstCard) return 0;

    const styles = window.getComputedStyle(carousel);
    const gap = parseFloat(styles.columnGap) || 0;

    return firstCard.getBoundingClientRect().width + gap;
  }, []);

  // Memperbarui status navigasi
  const updateScrollState = useCallback(() => {
    const carousel = carouselRef.current;

    if (!carousel) return;

    const maxScroll =
      carousel.scrollWidth - carousel.clientWidth;

    const step = getScrollStep();

    setCanScrollPrev(carousel.scrollLeft > 2);
    setCanScrollNext(carousel.scrollLeft < maxScroll - 2);

    if (step > 0) {
      const index = Math.round(carousel.scrollLeft / step);

      setCurrentIndex(
        Math.min(
          Math.max(index, 0),
          galleryItems.length - 1
        )
      );
    }
  }, [getScrollStep]);

  // Scroll carousel
  const scrollCarousel = useCallback(
    (direction: "next" | "prev") => {
      const carousel = carouselRef.current;

      if (!carousel) return;

      const step = getScrollStep();

      if (!step) return;

      const maxScroll = Math.max(
        0,
        carousel.scrollWidth - carousel.clientWidth
      );

      // Jangan animasikan jika pengguna memilih
      // reduced motion.
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const behavior: ScrollBehavior = reduceMotion
        ? "auto"
        : "smooth";

      if (direction === "next") {
        const isAtEnd =
          carousel.scrollLeft >= maxScroll - 2;

        carousel.scrollTo({
          left: isAtEnd
            ? 0
            : Math.min(carousel.scrollLeft + step, maxScroll),
          behavior: isAtEnd ? "auto" : behavior,
        });
      } else {
        const isAtStart = carousel.scrollLeft <= 2;

        carousel.scrollTo({
          left: isAtStart
            ? maxScroll
            : Math.max(carousel.scrollLeft - step, 0),
          behavior: isAtStart ? "auto" : behavior,
        });
      }
    },
    [getScrollStep]
  );

  // Auto scroll ke kanan
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    if (reducedMotion.matches) return;

    const interval = window.setInterval(() => {
      if (
        pausedRef.current ||
        document.hidden ||
        !carouselRef.current
      ) {
        return;
      }

      const carousel = carouselRef.current;

      if (
        carousel.scrollWidth <= carousel.clientWidth + 2
      ) {
        return;
      }

      scrollCarousel("next");
    }, AUTO_SCROLL_INTERVAL);

    return () => window.clearInterval(interval);
  }, [scrollCarousel]);

  // Update saat scroll dan resize
  useEffect(() => {
    const carousel = carouselRef.current;

    if (!carousel) return;

    let frameId = 0;

    const update = () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        updateScrollState();
        frameId = 0;
      });
    };

    updateScrollState();

    carousel.addEventListener("scroll", update, {
      passive: true,
    });

    window.addEventListener("resize", update);

    return () => {
      carousel.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [updateScrollState]);

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="scroll-mt-28 py-14 sm:py-16"
    >
      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h2
            id="gallery-heading"
            className="font-heading text-3xl font-extrabold leading-tight tracking-tight text-brand-text sm:text-4xl"
          >
            Cerita dari{" "}
            <span className="text-brand-pink">
              Setiap Kegiatan.
            </span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-brand-muted">
            Setiap pertemuan menyimpan cerita, tawa, dan
            momen kebersamaan yang berharga.
            Mari lihat perjalanan kecil yang penuh makna
            bersama Berbagi Kebahagiaan.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex shrink-0 items-center gap-3">

          <button
            type="button"
            onClick={() => scrollCarousel("prev")}
            disabled={
              galleryItems.length === 0 || !canScrollPrev
                ? !canScrollNext
                : false
            }
            aria-label="Foto sebelumnya"
            aria-controls="gallery-carousel"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-pink/20 bg-white text-brand-pink transition-all duration-200 hover:border-brand-pink hover:bg-brand-pink hover:text-white active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft size={19} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => scrollCarousel("next")}
            disabled={
              !canScrollPrev && !canScrollNext
            }
            aria-label="Foto berikutnya"
            aria-controls="gallery-carousel"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-pink text-white shadow-md shadow-brand-pink/15 transition-all duration-200 hover:bg-brand-dark hover:shadow-lg active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowRight size={19} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div
        id="gallery-carousel"
        ref={carouselRef}
        role="region"
        aria-label="Dokumentasi kegiatan Berbagi Kebahagiaan"
        aria-roledescription="carousel"
        tabIndex={0}
        onMouseEnter={() => {
          pausedRef.current = true;
        }}
        onMouseLeave={() => {
          pausedRef.current = false;
        }}
        onFocusCapture={() => {
          pausedRef.current = true;
        }}
        onBlurCapture={(event) => {
          if (
            !event.currentTarget.contains(
              event.relatedTarget as Node | null
            )
          ) {
            pausedRef.current = false;
          }
        }}
        onTouchStart={() => {
          pausedRef.current = true;
        }}
        onTouchEnd={() => {
          pausedRef.current = false;
        }}
        className="relative flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {galleryItems.map((item) => (
          <article
            key={item.id}
            className="group relative w-[85%] shrink-0 snap-start overflow-hidden rounded-3xl border border-brand-pink/10 bg-brand-soft sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
          >
            {/* Gallery Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-brand-soft">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.alt || item.title}
                  fill
                  sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="relative flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                  <div
                    aria-hidden="true"
                    className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-brand-pink/10"
                  />

                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-pink shadow-sm transition-transform duration-300 group-hover:-translate-y-1">
                    <Camera size={25} aria-hidden="true" />
                  </div>

                  <p className="relative text-sm font-semibold text-brand-text">
                    {item.title}
                  </p>

                  <p className="relative text-xs text-brand-muted">
                    Foto kegiatan akan segera hadir
                  </p>
                </div>
              )}

              {/* Overlay saat hover */}
              {item.image && (
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/65 via-transparent to-transparent p-5">
                  <p className="translate-y-1 font-heading text-sm font-bold text-white transition-transform duration-300 group-hover:translate-y-0">
                    {item.title}
                  </p>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-brand-muted">
          <Heart
            size={16}
            className="shrink-0 text-brand-pink"
            aria-hidden="true"
          />
          <p>
            Setiap senyuman memiliki cerita yang layak dikenang.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-brand-muted">
          <span className="font-bold text-brand-pink">
            {String(currentIndex + 1).padStart(2, "0")}
          </span>
          <span>/</span>
          <span>
            {String(galleryItems.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}
