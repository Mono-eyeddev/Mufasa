"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useReducedMotion } from "framer-motion";
import type { Media } from "@/content/types";
import { CropMarks } from "./crop-marks";

/**
 * Fullscreen media viewer: arrows, swipe, ESC, caption, counter, neighbour preload.
 * Renders into a portal; locks scroll; restores focus on close.
 */
export function Lightbox({
  items,
  index,
  onIndex,
  onClose,
  label = "Media viewer",
}: {
  items: Media[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
  label?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);

  // scroll lock + ESC + arrows + focus
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.querySelector<HTMLElement>("[data-close]")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onIndex((index + 1) % items.length);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onIndex((index - 1 + items.length) % items.length);
      } else if (e.key === "Tab" && ref.current) {
        const focusables = Array.from(
          ref.current.querySelectorAll<HTMLElement>("button:not([disabled])")
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [index, items.length, onClose, onIndex]);

  const item = items[index];
  if (!item) return null;

  return createPortal(
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 z-[70] flex flex-col bg-ink/97 backdrop-blur-sm"
      onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX.current;
        if (Math.abs(dx) > 48) {
          onIndex(dx < 0 ? (index + 1) % items.length : (index - 1 + items.length) % items.length);
        }
        touchX.current = null;
      }}
    >
      {/* top bar */}
      <div className="flex items-center justify-between px-gutter py-4 text-paper">
        <p className="mono-label">
          {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </p>
        <button
          type="button"
          data-close
          onClick={onClose}
          className="mono-label min-h-[44px] px-3 text-paper hover:text-signal"
        >
          Close ✕
        </button>
      </div>

      {/* stage */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-gutter">
        {item.kind === "video" && item.poster ? (
          <video
            key={item.src}
            src={item.src}
            poster={item.poster}
            controls
            playsInline
            preload="metadata"
            className="max-h-full max-w-full rounded-[2px]"
            aria-label={item.alt}
          />
        ) : (
          <div className="relative h-full w-full">
            <Image
              key={item.src}
              src={item.src}
              alt={item.alt}
              fill
              sizes="100vw"
              className={`object-contain ${reduce ? "" : "animate-[hero-fade-in_0.35s_ease]"}`}
              priority
            />
          </div>
        )}

        {/* arrows */}
        <button
          type="button"
          aria-label="Previous frame"
          onClick={() => onIndex((index - 1 + items.length) % items.length)}
          className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-[20px] bg-paper/10 text-paper hover:bg-signal md:left-6"
        >
          ←
        </button>
        <button
          type="button"
          aria-label="Next frame"
          onClick={() => onIndex((index + 1) % items.length)}
          className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-[20px] bg-paper/10 text-paper hover:bg-signal md:right-6"
        >
          →
        </button>
      </div>

      {/* caption */}
      <div className="px-gutter py-5">
        <p className="mx-auto max-w-[70ch] text-center text-sm leading-snug text-paper/70">{item.alt}</p>
      </div>

      {/* neighbour preload */}
      <div aria-hidden="true" className="pointer-events-none fixed h-px w-px overflow-hidden opacity-0">
        <Image
          src={items[(index + 1) % items.length]?.src ?? item.src}
          alt=""
          width={8}
          height={8}
          sizes="1px"
        />
      </div>
    </div>,
    document.body
  );
}

/** Contact-sheet frame tile used inside the grid. */
export function ContactSheetFrame({
  media,
  frameNo,
  onOpen,
  priority = false,
}: {
  media: Media;
  frameNo: string;
  onOpen: () => void;
  priority?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative block w-full text-left"
      aria-label={`Open frame ${frameNo} — ${media.alt}`}
    >
      <div
        className="relative w-full overflow-hidden rounded-[2px] bg-paper/5"
        style={{ aspectRatio: `${media.width} / ${media.height}` }}
      >
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          placeholder={media.blurDataURL ? "blur" : "empty"}
          blurDataURL={media.blurDataURL}
          priority={priority}
          className="object-cover opacity-85 transition-all duration-500 group-hover:scale-[1.03] group-hover:opacity-100"
        />
        <CropMarks onInk className="opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <p className="mono-label mt-1.5 text-paper/40 transition-colors group-hover:text-paper/80">
        {frameNo}
      </p>
    </button>
  );
}
