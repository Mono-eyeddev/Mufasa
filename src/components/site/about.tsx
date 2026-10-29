import Image from "next/image";
import { siteConfig } from "@/content/site";
import type { Media } from "@/content/types";
import { Reveal } from "./reveal";
import { CropMarks } from "./crop-marks";
import { RotatingBadge } from "./rotating-badge";

/**
 * About — portrait in a tall arch, factual bio, rotating ® badge.
 * No invented history: only what the config carries.
 */
export function About({ portrait }: { portrait: Media }) {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="px-gutter section-y border-t border-ink/10 bg-paper text-ink"
    >
      <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-6">
        <Reveal className="md:col-span-5">
          <div className="relative mx-auto w-full max-w-[380px]">
            {/* tall arch crop */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[2px] bg-bone">
              <Image
                src={portrait.src}
                alt={portrait.alt}
                fill
                sizes="(min-width: 768px) 30vw, 70vw"
                placeholder={portrait.blurDataURL ? "blur" : "empty"}
                blurDataURL={portrait.blurDataURL}
                className="object-cover"
              />
              <CropMarks />
            </div>
            <p className="mono-label mt-4 text-center text-ink/50">
              ( Victor Oginga — MUFASA® )
            </p>
          </div>
        </Reveal>

        <div className="md:col-span-6 md:col-start-7">
          <Reveal>
            <p className="mono-label text-ink/50">( About )</p>
            <h2 id="about-heading" className="font-display mt-6 text-5xl md:text-6xl">
              The name on the contact sheet<span className="text-signal">.</span>
            </h2>
            <div className="mt-8 max-w-[54ch] space-y-5 text-[17px] leading-relaxed text-ink/80">
              <p>
                Victor Oginga works under the name MUFASA® — photographer, graphic designer and
                filmmaker. The studio's output moves between stills, identities and moving
                pictures, often within the same project.
              </p>
              <p>
                Work is made start to finish in-house: shot, designed, directed and cut. Briefs
                are accepted across photography, design, film, branding and campaign direction.
              </p>
            </div>

            <dl className="mt-10 space-y-3 border-t border-ink/15 pt-6">
              <div className="flex items-baseline gap-4">
                <dt className="mono-label w-24 shrink-0 text-ink/45">Disciplines</dt>
                <dd className="text-[15px] text-ink/80">Photography · Graphic Design · Film · Branding · Creative Direction</dd>
              </div>
              <div className="flex items-baseline gap-4">
                <dt className="mono-label w-24 shrink-0 text-ink/45">Based</dt>
                <dd className="text-[15px] text-ink/80">{siteConfig.location ?? "Location on request"}</dd>
              </div>
              <div className="flex items-baseline gap-4">
                <dt className="mono-label w-24 shrink-0 text-ink/45">Status</dt>
                <dd className="text-[15px] text-ink/80">
                  {siteConfig.availableForCommissions ? (
                    <span className="text-signal">✱ Available for commissions</span>
                  ) : (
                    "Booking by enquiry"
                  )}
                </dd>
              </div>
            </dl>

            <div className="mt-10">
              <RotatingBadge targetId="contact" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
