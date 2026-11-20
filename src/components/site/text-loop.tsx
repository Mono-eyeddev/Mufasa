
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const PHRASES = [
  "LET'S MAKE SOMETHING",
  "UNEXPECTED",
  "WORTH REMEMBERING",
];

export default function TextLoop() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const animation = gsap.to(track, {
      xPercent: -50,
      duration: 28,
      ease: "none",
      repeat: -1,
    });

    const pause = () => animation.pause();
    const play = () => animation.play();

    track.addEventListener("mouseenter", pause);
    track.addEventListener("mouseleave", play);
    track.addEventListener("focusin", pause);
    track.addEventListener("focusout", play);

    return () => {
      animation.kill();
      track.removeEventListener("mouseenter", pause);
      track.removeEventListener("mouseleave", play);
      track.removeEventListener("focusin", pause);
      track.removeEventListener("focusout", play);
    };
  }, []);

  const repeatedPhrases = [...PHRASES, ...PHRASES];

  return (
    <div
      className="hero-text-loop relative w-full overflow-hidden border-b border-paper/10 py-7 md:py-10"
      aria-label="Let's make something unexpected worth remembering"
    >
      <div
        ref={trackRef}
        className="flex w-max items-center"
        aria-hidden="true"
      >
        {repeatedPhrases.map((phrase, index) => (
          <div
            key={`${phrase}-${index}`}
            className="flex shrink-0 items-center"
          >
            <span className="font-display whitespace-nowrap text-[9vw] font-semibold leading-none tracking-[-0.055em] text-paper md:text-[6vw] lg:text-[4.5vw]">
              {phrase}
            </span>

            <span className="mx-7 font-display text-[8vw] leading-none text-[#FD802E] md:mx-12 md:text-[4vw]">
              ✳
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
