
"use client";

import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const PLACEHOLDER_VIDEO =
  "https://videos.pexels.com/video-files/2169880/2169880-uhd_2560_1440_30fps.mp4";

const POSTER =
  "https://images.pexels.com/videos/2169880/free-video-2169880.jpg?auto=compress&cs=tinysrgb&w=1440";

export function Showreel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [duration, setDuration] = useState("--:--");

  const formatDuration = (seconds: number) => {
    if (!Number.isFinite(seconds)) return "--:--";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <section
      id="showreel"
      className="relative isolate overflow-hidden bg-[#080808]"
    >
      {/* Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={POSTER}
        onLoadedMetadata={(event) =>
          setDuration(formatDuration(event.currentTarget.duration))
        }
        className="block aspect-video w-full object-cover"
      >
        <source src={PLACEHOLDER_VIDEO} type="video/mp4" />
      </video>

      {/* Cinematic overlays */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#080808] via-transparent to-[#080808]/50" />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#080808] via-[#080808]/75 to-transparent" />

      {/* Left editorial rail */}
      <div className="pointer-events-none absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-5 md:flex">
        <span className="font-mono text-[10px] tracking-[0.25em] text-[#FD802E]">
          MU—01
        </span>

        <span className="h-16 w-px bg-white/30" />

        <span
          className="font-mono text-[9px] tracking-[0.3em] text-white/60"
          style={{ writingMode: "vertical-rl" }}
        >
          SHOWREEL / 2026
        </span>
      </div>

      {/* Right editorial rail */}
      <div className="pointer-events-none absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-5 md:flex">
        <span className="font-mono text-[9px] tracking-[0.2em] text-white/50">
          RUN TIME
        </span>

        <span className="font-mono text-sm tracking-wider text-white">
          {duration}
        </span>

        <span className="h-16 w-px bg-white/30" />

        <span
          className="font-mono text-[9px] tracking-[0.3em] text-[#FD802E]"
          style={{ writingMode: "vertical-rl" }}
        >
          MOTION / VISUALS
        </span>
      </div>

      {/* Bottom metadata */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-between px-5 pb-5 md:px-10 md:pb-7">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FD802E]" />
          <span className="font-mono text-[9px] tracking-[0.2em] text-white/60">
            NOW PLAYING
          </span>
        </div>

        <span className="font-mono text-[9px] tracking-[0.2em] text-white/50">
          MUFASA® — CREATIVE ARCHIVE
        </span>
      </div>

      {/* Sound control */}
      <button
        type="button"
        onClick={toggleSound}
        aria-label={muted ? "Unmute video" : "Mute video"}
        className="absolute bottom-5 right-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white/80 backdrop-blur-md transition hover:border-[#FD802E] hover:text-[#FD802E] md:bottom-7 md:right-10"
      >
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
    </section>
  );
}
