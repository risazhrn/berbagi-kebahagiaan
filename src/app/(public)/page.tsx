
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import UpcomingEventsSection from "@/components/upcoming-event-section";
import GallerySection from "@/components/gallery-section";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:py-12">
      <HeroSection />
      <AboutSection />
      <UpcomingEventsSection />
      <GallerySection />
    </main>
  );
}
