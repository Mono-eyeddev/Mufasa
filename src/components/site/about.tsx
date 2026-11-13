
import Image from "next/image";
import { siteConfig } from "@/content/site";
import type { Media } from "@/content/types";
import { Reveal } from "./reveal";
import { CropMarks } from "./crop-marks";
import { RotatingBadge } from "./rotating-badge";
import DotField from "./DotField";

const profileDetails = [
  {
    label: "Creative practice",
    value: "Photography, Graphic Design, Filmmaking",
  },
  {
    label: "Visual direction",
    value: "Brand Identity, Campaigns, Creative Direction",
  },
  {
    label: "Approach",
    value: "Concept, Direction, Production, Execution",
  },
];

export function About({ portrait }: { portrait: Media }) {
  return (
    <>
      {/* =====================================================
          ABOUT — STICKY PORTRAIT + SCROLLING BIOGRAPHY
      ====================================================== */}
      <section
        id="about"
        aria-labelledby="about-heading"
        className="relative isolate band-ink-2 border-t border-paper/10 px-gutter section-y text-paper"
      >
        {/* Interactive background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-75"
        >
          <DotField
            gradientFrom="#FD802E"
            gradientTo="#ECE7DC"
            dotRadius={1.1}
            dotSpacing={17}
            pattern="grid"
            gradientAngle={135}
            cursorRadius={190}
            bulgeStrength={0.35}
            glowColor="#FD802E"
            glowRadius={125}
            glowIntensity={0.55}
            baseOpacity={0.18}
            sparkle={false}
            waveAmplitude={0}
            speed={1}
            interactive={true}
            holdToZoom={false}
            intro={true}
            opacity={0.75}
            maxDevicePixelRatio={1.5}
          />
        </div>

        {/* Main layout */}
        <div className="relative z-10 grid grid-cols-1 items-start gap-12 md:grid-cols-12 md:gap-8">

          {/* LEFT COLUMN — STICKY PORTRAIT */}
          <div className="md:col-span-5 md:self-stretch">
            <div className="relative mx-auto w-full max-w-[460px] md:sticky md:top-28">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-full rounded-b-[2px] bg-bone">
                <Image
                  src="https://res.cloudinary.com/lbs3zryh/image/upload/v1794558042/about.jpg"
                  alt="Victor Oginga — MUFASA"
                  fill
                  priority
                  sizes="(min-width: 768px) 40vw, 90vw"
                  className="object-cover object-center"
                />

                <CropMarks />
              </div>

              <div className="mt-5 flex items-center justify-between border-b border-paper/15 pb-4">
                <p className="mono-label text-paper/50">
                  ( Victor Oginga: MUFASA® )
                </p>

                <span className="mono-label text-[#FD802E]">
                  01 / 01
                </span>
              </div>

              <p className="mono-label mt-4 text-paper/40">
                PHOTOGRAPHER · DESIGNER · FILMMAKER
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN — SCROLLING BIOGRAPHY */}
          <div className="min-w-0 md:col-span-7 md:col-start-6">

            {/* INTRODUCTION */}
            <Reveal>
              <p className="mono-label text-paper/50">
                ( About )
              </p>

              <h2
                id="about-heading"
                className="font-display mt-6 w-full text-5xl leading-[0.98] md:text-6xl lg:text-7xl"
              >
                Hi, I&apos;m Victor.
                <span className="text-signal neon-text">.</span>
              </h2>

              <p className="mt-6 w-full text-xl leading-relaxed text-paper/90 md:text-2xl">
                Photographer, graphic designer, filmmaker and creative
                director. I make visual work that brings ideas to life
                through images, design and moving pictures.
              </p>

              <div className="mt-8 w-full space-y-5 text-[15px] leading-[1.9] text-paper/70 md:text-[16px]">
                <p>
                  Working under the name MUFASA®, I move between
                  different creative disciplines to tell stories,
                  shape visual identities and create work that
                  connects with people.
                </p>

                <p>
                  My work spans photography, graphic design, film,
                  branding and campaign development. Each discipline
                  offers a different way to communicate, but they
                  all begin with the same thing: an idea worth
                  bringing to life.
                </p>

                <p>
                  I enjoy the process of taking an idea from its
                  earliest stages and developing it into something
                  people can see, experience and remember.
                </p>
              </div>
            </Reveal>

            {/* CREATIVE PHILOSOPHY */}
            <Reveal>
              <div className="mt-14 border-t border-paper/15 pt-8">
                <p className="mono-label text-[#FD802E]">
                  ( How I Think )
                </p>

                <h3 className="font-display mt-5 w-full text-3xl leading-[1.1] md:text-4xl">
                  I think beyond the frame.
                </h3>

                <div className="mt-6 w-full space-y-5 text-[15px] leading-[1.9] text-paper/70 md:text-[16px]">
                  <p>
                    Good creative work is more than making something
                    visually appealing. It is about understanding
                    what needs to be communicated, who it is for and
                    how the final work should make someone feel.
                  </p>

                  <p>
                    Whether I am behind a camera, working on a
                    visual identity or developing a film, I pay
                    attention to the details that bring the bigger
                    picture together. The composition, the message,
                    the atmosphere and the feeling all matter.
                  </p>

                  <p>
                    I believe in creating with intention, staying
                    curious and allowing each project to find its
                    own visual language.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* HOW I WORK */}
            <Reveal>
              <div className="mt-14 border-t border-paper/15 pt-8">
                <p className="mono-label text-[#FD802E]">
                  ( How I Work )
                </p>

                <h3 className="font-display mt-5 w-full text-3xl leading-[1.1] md:text-4xl">
                  From the first idea to the final frame.
                </h3>

                <div className="mt-6 w-full space-y-5 text-[15px] leading-[1.9] text-paper/70 md:text-[16px]">
                  <p>
                    Every project starts with a conversation and
                    an understanding of the vision. From there,
                    I explore the creative direction and work out
                    how best to translate that vision into a
                    visual experience.
                  </p>

                  <p>
                    Some ideas call for photography. Others need
                    design, film or a combination of disciplines.
                    I approach each brief on its own terms, choosing
                    the right creative direction for the story
                    that needs to be told.
                  </p>

                  <p>
                    The aim is always to create work that feels
                    considered, distinctive and true to the
                    original idea.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* PROFILE DETAILS */}
            <Reveal>
              <div className="mt-14 border-t border-paper/15 pt-8">
                <p className="mono-label text-paper/45">
                  ( A Few Details )
                </p>

                <dl className="mt-7">
                  {profileDetails.map((item) => (
                    <div
                      key={item.label}
                      className="grid grid-cols-[115px_1fr] gap-4 border-b border-paper/10 py-4"
                    >
                      <dt className="mono-label pt-1 text-paper/40">
                        {item.label}
                      </dt>

                      <dd className="text-[14px] leading-relaxed text-paper/80">
                        {item.value}
                      </dd>
                    </div>
                  ))}

                  <div className="grid grid-cols-[115px_1fr] gap-4 border-b border-paper/10 py-4">
                    <dt className="mono-label pt-1 text-paper/40">
                      Based
                    </dt>

                    <dd className="text-[14px] text-paper/80">
                      {siteConfig.location ?? "Location on request"}
                    </dd>
                  </div>

                  <div className="grid grid-cols-[115px_1fr] gap-4 border-b border-paper/10 py-4">
                    <dt className="mono-label pt-1 text-paper/40">
                      Availability
                    </dt>

                    <dd className="text-[14px] text-paper/80">
                      {siteConfig.availableForCommissions ? (
                        <span className="text-signal neon-text-soft">
                          Available for commissions
                        </span>
                      ) : (
                        "Booking by enquiry"
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </Reveal>

            {/* CONTACT CTA */}
            <Reveal>
              <div className="mt-14 border-t border-paper/15 pt-8">
                <p className="mono-label text-paper/45">
                  HAVE SOMETHING IN MIND?
                </p>

                <h3 className="font-display mt-5 w-full text-3xl leading-tight md:text-4xl">
                  Let&apos;s make something worth remembering.
                </h3>

                <div className="mt-7">
                  <RotatingBadge targetId="contact" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =====================================================
          IN MY OWN WORDS — INDEPENDENT FULL-WIDTH SECTION
      ====================================================== */}
      <section
        id="about-reel"
        aria-labelledby="about-reel-heading"
        className="relative isolate overflow-hidden band-ink border-t border-paper/10 px-gutter pt-20 pb-16 text-paper md:pt-24 md:pb-20"
      >
        {/* Background atmosphere */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_45%,rgba(253,128,46,0.09),transparent_45%)]"
        />

        <div className="relative z-10">
          <Reveal>
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="mono-label text-[#FD802E]">
                  ( In My Own Words )
                </p>

                <h2
                  id="about-reel-heading"
                  className="font-display mt-5 text-4xl leading-none tracking-tight md:text-6xl lg:text-7xl"
                >
                  Beyond the work
                  <span className="text-signal neon-text">.</span>
                </h2>
              </div>

              <span className="mono-label hidden pb-1 text-paper/35 md:block">
                A short reel about who I am and how I work.
              </span>
            </div>
          </Reveal>

          {/* Video placeholder */}
          <Reveal>
            <div
              role="img"
              aria-label="MUFASA introduction reel coming soon"
              className="group relative mt-9 aspect-video w-full overflow-hidden border border-paper/15 bg-[#111] md:mt-12"
            >
              {/* Cinematic background */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,rgba(253,128,46,0.18),transparent_50%),linear-gradient(135deg,#171717_0%,#080808_60%,#182027_100%)] transition-transform duration-700 group-hover:scale-[1.025]"
              />

              {/* Grid texture */}
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(236,231,220,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(236,231,220,0.25)_1px,transparent_1px)] [background-size:40px_40px]"
              />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex size-16 items-center justify-center rounded-full border border-[#FD802E]/70 text-[#FD802E] transition-all duration-500 group-hover:scale-110 group-hover:bg-[#FD802E]/10 md:size-20">
                  <span className="ml-1 text-2xl">▶</span>
                </div>
              </div>

              {/* Minimal corner details */}
              <span className="mono-label absolute bottom-4 left-4 text-paper/40">
                MUFASA®
              </span>

              <span className="mono-label absolute bottom-4 right-4 text-paper/40">
                00:00
              </span>

              {/* Accent line */}
              <div
                aria-hidden="true"
                className="absolute left-0 top-0 h-[2px] w-0 bg-[#FD802E] transition-all duration-700 group-hover:w-full"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
