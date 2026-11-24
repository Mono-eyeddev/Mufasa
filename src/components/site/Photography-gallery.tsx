
"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type Photo = {
  src: string;
  alt: string;
};

export function PhotographyGallery({ images }: { images: Photo[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);

  const previous = useCallback(() => {
    setActiveIndex((current) =>
      current === null
        ? null
        : (current - 1 + images.length) % images.length
    );
  }, [images.length]);

  const next = useCallback(() => {
    setActiveIndex((current) =>
      current === null ? null : (current + 1) % images.length
    );
  }, [images.length]);

  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeIndex, close, next, previous]);

  return (
    <>
      {/* Uniform photography grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {images.map((photo, index) => (
          <button
            key={`${photo.src}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`View photograph ${index + 1}`}
            className="group relative block w-full aspect-[4/5] overflow-hidden bg-[#233D4C]/30 text-left"
          >
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <span className="absolute bottom-4 right-4 text-[10px] tracking-widest text-[#ECE7DC] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {String(index + 1).padStart(2, "0")}
            </span>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#080808]/95 p-4 md:p-10"
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close viewer"
              className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-[#ECE7DC]/20 text-[#ECE7DC] transition hover:border-[#F28C28] hover:text-[#F28C28]"
            >
              <X size={22} />
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                previous();
              }}
              aria-label="Previous photograph"
              className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#ECE7DC]/20 bg-[#233D4C]/40 text-[#ECE7DC] transition hover:border-[#F28C28] hover:text-[#F28C28] md:left-8"
            >
              <ChevronLeft size={24} />
            </button>

            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="flex h-full w-full flex-col items-center justify-center"
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={images[activeIndex].src}
                alt={images[activeIndex].alt}
                className="max-h-[82vh] max-w-full object-contain"
              />

              <p className="mono-label mt-5 text-xs text-[#ECE7DC]/50">
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(images.length).padStart(2, "0")}
              </p>
            </motion.div>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                next();
              }}
              aria-label="Next photograph"
              className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#ECE7DC]/20 bg-[#233D4C]/40 text-[#ECE7DC] transition hover:border-[#F28C28] hover:text-[#F28C28] md:right-8"
            >
              <ChevronRight size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
