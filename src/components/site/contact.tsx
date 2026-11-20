
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { siteConfig } from "@/content/site";
import { Reveal } from "./reveal";
import ElectricBorder from "./ElectricBorder";

const schema = z.object({
  name: z.string().min(2, "Add your name."),
  email: z.string().email("That email doesn't look right."),
  projectType: z.string().min(1, "Pick a project type."),
  message: z.string().min(10, "A line or two about the project helps."),
  company: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof schema>;

const PROJECT_TYPES = [
  "Photography",
  "Graphic Design",
  "Film & Video",
  "Branding & Identity",
  "Campaign / Creative Direction",
  "Something else",
];

type Ease = [number, number, number, number];
const EASE: Ease = [0.16, 1, 0.3, 1];

/* ------------------------------------------------------------------ */
/* Masked headline reveal                                              */
/* ------------------------------------------------------------------ */

function MaskLine({
  children,
  delay = 0,
  reduce,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  reduce: boolean;
  className?: string;
}) {
  return (
    <span className={`block overflow-hidden pb-[0.1em] -mb-[0.1em] ${className}`}>
      <motion.span
        className="block"
        initial={reduce ? false : { y: "110%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 1, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Rolling email interaction                                           */
/* ------------------------------------------------------------------ */

function RollingEmail({ email }: { email: string }) {
  const roll =
    "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none";

  return (
    <a
      href={`mailto:${email}`}
      aria-label={`Email ${email}`}
      className="group block rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-signal"
    >
      <span
        aria-hidden="true"
        className="font-display flex flex-wrap text-[clamp(1.25rem,4.5vw,4rem)] leading-[1.15] tracking-[-0.045em] text-paper"
      >
        {[...email].map((ch, i) => (
          <span
            key={i}
            className="relative inline-block h-[1.15em] overflow-hidden"
          >
            <span
              className={`block group-hover:-translate-y-full group-focus-visible:-translate-y-full motion-reduce:group-hover:translate-y-0 motion-reduce:group-focus-visible:translate-y-0 ${roll}`}
              style={{ transitionDelay: `${i * 14}ms` }}
            >
              {ch}
            </span>

            <span
              className={`absolute left-0 top-full block text-signal group-hover:-translate-y-full group-focus-visible:-translate-y-full motion-reduce:group-hover:translate-y-0 motion-reduce:group-focus-visible:translate-y-0 ${roll}`}
              style={{ transitionDelay: `${i * 14}ms` }}
            >
              {ch}
            </span>
          </span>
        ))}
      </span>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Viewfinder crop marks                                               */
/* ------------------------------------------------------------------ */

const CORNERS = {
  tl: "-left-2.5 -top-2.5 border-l border-t origin-top-left",
  tr: "-right-2.5 -top-2.5 border-r border-t origin-top-right",
  bl: "-bottom-2.5 -left-2.5 border-b border-l origin-bottom-left",
  br: "-bottom-2.5 -right-2.5 border-b border-r origin-bottom-right",
} as const;

function CropMark({
  pos,
  reduce,
  delay,
}: {
  pos: keyof typeof CORNERS;
  reduce: boolean;
  delay: number;
}) {
  return (
    <motion.span
      aria-hidden="true"
      className={`pointer-events-none absolute h-6 w-6 border-signal ${CORNERS[pos]}`}
      initial={reduce ? false : { opacity: 0, scale: 0.3 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Contact section                                                     */
/* ------------------------------------------------------------------ */

export function Contact({
  providerConfigured,
}: {
  providerConfigured: boolean;
}) {
  const reduce = !!useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [serverState, setServerState] = useState<
    | { status: "idle" }
    | { status: "sending" }
    | { status: "error"; message: string }
    | { status: "sent" }
  >({ status: "idle" });

  // Scroll-linked decorative asterisk
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 140]);

  useEffect(() => {
    return () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { projectType: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setServerState({ status: "sending" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        setServerState({ status: "sent" });
        reset();
      } else {
        const data = (await res.json().catch(() => ({}))) as {
          message?: string;
        };

        setServerState({
          status: "error",
          message:
            data.message ??
            "Something went wrong sending the form. Email directly instead — it reaches the same inbox.",
        });
      }
    } catch {
      setServerState({
        status: "error",
        message:
          "Network error — email directly instead, it reaches the same inbox.",
      });
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopied(true);

      if (copyTimer.current) clearTimeout(copyTimer.current);

      copyTimer.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      // The mailto link remains available.
    }
  };

  // Staggered form entrance
  const formVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduce ? 0 : 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const fieldVariants = {
    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduce ? 0 : 0.7,
        ease: EASE,
      },
    },
  };

  const inputBase =
    "w-full rounded-[2px] border border-paper/20 bg-transparent px-4 py-3 text-sm text-paper placeholder:text-paper/35 transition-colors hover:border-paper/40 focus:border-signal focus:bg-paper/[0.03] focus:outline-none";

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-labelledby="contact-heading"
      className="band-ink relative overflow-clip border-t border-paper/10 text-paper"
    >
      {/* Marquee */}
      <div
        className="marquee-paused relative z-10 overflow-hidden border-b border-paper/10 py-5 md:py-6"
        aria-hidden="true"
      >
        <div className="animate-marquee flex w-max items-center">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="flex items-center whitespace-nowrap">
              <span className="font-display px-5 text-[7vw] font-medium leading-none tracking-[-0.045em] text-paper/90 sm:text-[5vw] md:px-7 md:text-[3.8vw] lg:text-[3.2vw]">
                Let&apos;s make something
              </span>

              <span className="text-signal neon-text text-[2.5vw] sm:text-[2vw] md:text-[1.4vw]">
                ✳
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Petrol background wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[70%] bg-[radial-gradient(ellipse_70%_60%_at_15%_0%,rgba(35,61,76,0.55),transparent_70%)]"
      />

      {/* Decorative rotating asterisk */}
      <motion.span
        aria-hidden="true"
        style={reduce ? undefined : { rotate }}
        className="pointer-events-none absolute -right-[5vw] top-[14%] select-none text-[26vw] leading-none text-paper/[0.035] md:top-[8%] md:text-[19vw]"
      >
        ✳
      </motion.span>

      <h2 id="contact-heading" className="sr-only">
        Contact
      </h2>

      <div className="px-gutter section-y relative">
        {/* Opening headline and introduction */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end">
          <h2
            className="font-display text-[clamp(3.2rem,8vw,7rem)] leading-[0.92] tracking-[-0.055em] md:col-span-9"
            aria-label="Start a project."
          >
            <MaskLine reduce={reduce}>Start a</MaskLine>

            <MaskLine
              reduce={reduce}
              delay={0.12}
              className="md:pl-[11vw]"
            >
              project<span className="text-signal neon-text">.</span>
            </MaskLine>
          </h2>

          <Reveal delay={0.25} className="md:col-span-3 md:pb-3">
            <p className="max-w-[32ch] text-sm leading-[1.8] text-paper/65 md:text-[15px]">
             Lets make something unimaginable happen
            </p>
          </Reveal>
        </div>

        {/* Direct email */}
        <Reveal delay={0.1} className="mt-14 md:mt-20">
          <div className="border-y border-paper/10 py-7 md:py-10">
            <div className="flex items-center justify-between gap-4">
              <p className="mono-label text-paper/45">Direct</p>

              <button
                type="button"
                onClick={copyEmail}
                className="mono-label min-h-[44px] rounded-[2px] px-1 text-paper/70 transition-colors hover:text-signal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
              >
                <span aria-live="polite">
                  {copied ? "✱ Copied" : "Copy address"}
                </span>
              </button>
            </div>

            <div className="mt-4 md:mt-5">
              <RollingEmail email={siteConfig.email} />
            </div>
          </div>
        </Reveal>

        {/* Social links and contact form */}
        <div className="mt-14 grid grid-cols-1 gap-12 md:mt-20 md:grid-cols-12 md:gap-y-0">
          {/* Social links */}
          <Reveal className="md:col-span-4 md:sticky md:top-28 md:self-start">
            {siteConfig.availableForCommissions && (
              <p className="mono-label neon-box inline-block rounded-[20px] border border-signal px-3.5 py-2 text-signal">
                ✱ Available for commissions
              </p>
            )}

            {siteConfig.socials.length > 0 && (
              <div
                className={
                  siteConfig.availableForCommissions ? "mt-10" : ""
                }
              >
                <p className="mono-label text-paper/45">Elsewhere</p>

                <ul className="mt-4 border-t border-paper/10">
                  {siteConfig.socials.map((s) => (
                    <li key={s.label} className="border-b border-paper/10">
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex min-h-[52px] items-center justify-between overflow-hidden py-3 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-signal"
                      >
                        <span
                          aria-hidden="true"
                          className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-signal transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
                        />

                        <span className="font-display text-2xl tracking-[-0.035em] text-paper/80 transition-[transform,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 group-hover:text-paper motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
                          {s.label}
                        </span>

                        <span
                          aria-hidden="true"
                          className="mono-label text-signal transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"
                        >
                          ↗
                        </span>

                        <span className="sr-only">
                          (opens in a new tab)
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Reveal>

          {/* Contact form */}
          <div className="relative md:col-span-7 md:col-start-6">
            <CropMark pos="tl" reduce={reduce} delay={0} />
            <CropMark pos="tr" reduce={reduce} delay={0.08} />
            <CropMark pos="bl" reduce={reduce} delay={0.16} />
            <CropMark pos="br" reduce={reduce} delay={0.24} />

            <motion.form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="relative space-y-4 px-1 py-1 md:px-6 md:py-5"
              variants={formVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            >
              {/* Honeypot */}
              <div
                className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
                aria-hidden="true"
              >
                <label>
                  Company
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...register("company")}
                  />
                </label>
              </div>

              {/* Name and email */}
              <motion.div
                variants={fieldVariants}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2"
              >
                <div>
                  <label
                    htmlFor="cf-name"
                    className="mono-label mb-2 block text-paper/60"
                  >
                    Name
                  </label>

                  <input
                    id="cf-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your name"
                    aria-invalid={!!errors.name}
                    aria-describedby={
                      errors.name ? "cf-name-err" : undefined
                    }
                    className={inputBase}
                    {...register("name")}
                  />

                  {errors.name && (
                    <p
                      id="cf-name-err"
                      role="alert"
                      className="mono-label mt-2 text-signal"
                    >
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="cf-email"
                    className="mono-label mb-2 block text-paper/60"
                  >
                    Email
                  </label>

                  <input
                    id="cf-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@studio.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={
                      errors.email ? "cf-email-err" : undefined
                    }
                    className={inputBase}
                    {...register("email")}
                  />

                  {errors.email && (
                    <p
                      id="cf-email-err"
                      role="alert"
                      className="mono-label mt-2 text-signal"
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Project type */}
              <motion.div variants={fieldVariants}>
                <label
                  htmlFor="cf-type"
                  className="mono-label mb-2 block text-paper/60"
                >
                  Project type
                </label>

                <select
                  id="cf-type"
                  aria-invalid={!!errors.projectType}
                  aria-describedby={
                    errors.projectType ? "cf-type-err" : undefined
                  }
                  className={`${inputBase} appearance-none bg-ink ${
                    errors.projectType ? "border-signal" : ""
                  }`}
                  {...register("projectType")}
                >
                  <option value="" disabled className="bg-ink">
                    Select a type…
                  </option>

                  {PROJECT_TYPES.map((t) => (
                    <option key={t} value={t} className="bg-ink">
                      {t}
                    </option>
                  ))}
                </select>

                {errors.projectType && (
                  <p
                    id="cf-type-err"
                    role="alert"
                    className="mono-label mt-2 text-signal"
                  >
                    {errors.projectType.message}
                  </p>
                )}
              </motion.div>

              {/* Message */}
              <motion.div variants={fieldVariants}>
                <label
                  htmlFor="cf-message"
                  className="mono-label mb-2 block text-paper/60"
                >
                  Message
                </label>

                <ElectricBorder
                  color="#FD802E"
                  glowColor="#FD802E"
                  speed={0.8}
                  chaos={0.45}
                  spread={0.3}
                  thickness={1.2}
                  strands={2}
                  glow={0.7}
                  intensity={0.9}
                  arcs={0.8}
                  flicker={0.45}
                  borderRadius={2}
                  offset={1}
                  interactive={true}
                  cursorRadius={70}
                  theme="dark"
                  className="w-full"
                >
                  <textarea
                    id="cf-message"
                    rows={5}
                    placeholder="What are we making?"
                    aria-invalid={!!errors.message}
                    aria-describedby={
                      errors.message ? "cf-message-err" : undefined
                    }
                    className={`${inputBase} resize-y`}
                    {...register("message")}
                  />
                </ElectricBorder>

                {errors.message && (
                  <p
                    id="cf-message-err"
                    role="alert"
                    className="mono-label mt-2 text-signal"
                  >
                    {errors.message.message}
                  </p>
                )}
              </motion.div>

              {/* Submit */}
              <motion.div
                variants={fieldVariants}
                className="flex flex-wrap items-center gap-5 pt-2"
              >
                <button
                  type="submit"
                  disabled={serverState.status === "sending"}
                  className="group relative inline-flex min-h-[46px] items-center gap-3 overflow-hidden rounded-[20px] bg-paper px-6 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal disabled:opacity-50"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 origin-left scale-x-0 bg-signal transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
                  />

                  <span className="mono-label relative">
                    {serverState.status === "sending"
                      ? "Sending…"
                      : "Send it"}
                  </span>

                  <span
                    aria-hidden="true"
                    className="mono-label relative transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                  >
                    →
                  </span>
                </button>

                {serverState.status === "sent" && (
                  <motion.p
                    role="status"
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mono-label neon-text-soft text-signal"
                  >
                    ✱ Sent — you&apos;ll hear back soon.
                  </motion.p>
                )}

                {(serverState.status === "error" || !providerConfigured) && (
                  <p
                    role={
                      serverState.status === "error" ? "alert" : undefined
                    }
                    className="mono-label max-w-[42ch] text-paper/70"
                  >
                    {serverState.status === "error"
                      ? serverState.message
                      : "Form delivery isn't wired to an inbox yet — use the email address above."}
                  </p>
                )}
              </motion.div>
            </motion.form>
          </div>
        </div>
      </div>
    </section>
  );
}
