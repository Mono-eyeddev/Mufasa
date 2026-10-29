import { cn } from "@/lib/utils";

/**
 * Registration / crop marks at the four corners of an image frame. CSS only.
 * mix-blend-difference keeps them legible on ink, bone and photography alike.
 */
export function CropMarks({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn("crop-marks", className)}>
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}
