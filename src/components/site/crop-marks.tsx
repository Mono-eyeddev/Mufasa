import { cn } from "@/lib/utils";

/** Registration / crop marks at the four corners of an image frame. CSS only. */
export function CropMarks({ onInk = false, className }: { onInk?: boolean; className?: string }) {
  return (
    <span aria-hidden="true" className={cn("crop-marks", onInk && "crop-marks-on-ink", className)}>
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}
