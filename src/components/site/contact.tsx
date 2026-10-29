"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { siteConfig } from "@/content/site";
import { Reveal } from "./reveal";

const schema = z.object({
  name: z.string().min(2, "Add your name."),
  email: z.string().email("That email doesn't look right."),
  projectType: z.string().min(1, "Pick a project type."),
  message: z.string().min(10, "A line or two about the project helps."),
  // honeypot — humans never see or fill this
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

export function Contact({ providerConfigured }: { providerConfigured: boolean }) {
  const reduce = useReducedMotion();
  const [serverState, setServerState] = useState<
    { status: "idle" } | { status: "sending" } | { status: "error"; message: string } | { status: "sent" }
  >({ status: "idle" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { projectType: "" } });

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
        const data = (await res.json().catch(() => ({}))) as { message?: string };
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
        message: "Network error — email directly instead, it reaches the same inbox.",
      });
    }
  };

  const inputBase =
    "w-full rounded-[2px] border border-paper/25 bg-transparent px-4 py-3.5 text-[16px] text-paper placeholder:text-paper/35 focus:border-signal focus:outline-none transition-colors";

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="band-ink border-t border-paper/10 text-paper"
    >
      {/* marquee */}
      <div className="marquee-paused overflow-hidden border-b border-paper/10 py-6 md:py-8" aria-hidden="true">
        <div className="animate-marquee flex w-max items-center">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="flex items-center whitespace-nowrap">
              <span className="font-display px-6 text-[11vw] leading-none md:text-[7vw]">
                Let&apos;s make something
              </span>
              <span className="text-signal neon-text text-[4vw] md:text-[2.5vw]">✱</span>
            </span>
          ))}
        </div>
      </div>
      <h2 id="contact-heading" className="sr-only">
        Contact
      </h2>

      <div className="px-gutter section-y grid grid-cols-1 gap-14 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <p className="mono-label text-paper/50">( Contact )</p>
          <h3 className="font-display mt-6 text-5xl leading-[0.9] md:text-6xl">
            Start a project<span className="text-signal neon-text">.</span>
          </h3>
          <p className="mt-6 max-w-[40ch] text-[16px] leading-relaxed text-paper/75">
            Photography, design, film, identity or a campaign — write a line about what you need
            and the work that caught your eye.
          </p>

          <div className="mt-10 space-y-2">
            <p className="mono-label text-paper/45">Direct</p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="link-underline-accent font-display text-3xl text-paper md:text-4xl"
            >
              {siteConfig.email}
            </a>
          </div>

          {siteConfig.availableForCommissions && (
            <p className="mono-label neon-box mt-8 inline-block rounded-[20px] border border-signal px-3.5 py-2 text-signal">
              ✱ Available for commissions
            </p>
          )}

          {siteConfig.socials.length > 0 && (
            <div className="mt-10">
              <p className="mono-label text-paper/45">Elsewhere</p>
              <ul className="mt-3 flex flex-wrap gap-5">
                {siteConfig.socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mono-label link-underline text-paper/80 hover:text-paper"
                    >
                      {s.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Reveal>

        <Reveal delay={0.08} className="md:col-span-6 md:col-start-7">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {/* honeypot */}
            <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
              <label>
                Company
                <input type="text" tabIndex={-1} autoComplete="off" {...register("company")} />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="cf-name" className="mono-label mb-2 block text-paper/60">
                  Name
                </label>
                <input
                  id="cf-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "cf-name-err" : undefined}
                  className={inputBase}
                  {...register("name")}
                />
                {errors.name && (
                  <p id="cf-name-err" role="alert" className="mono-label mt-2 text-signal">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="cf-email" className="mono-label mb-2 block text-paper/60">
                  Email
                </label>
                <input
                  id="cf-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@studio.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "cf-email-err" : undefined}
                  className={inputBase}
                  {...register("email")}
                />
                {errors.email && (
                  <p id="cf-email-err" role="alert" className="mono-label mt-2 text-signal">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="cf-type" className="mono-label mb-2 block text-paper/60">
                Project type
              </label>
              <select
                id="cf-type"
                aria-invalid={!!errors.projectType}
                aria-describedby={errors.projectType ? "cf-type-err" : undefined}
                className={`${inputBase} appearance-none bg-ink ${errors.projectType ? "border-signal" : ""}`}
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
                <p id="cf-type-err" role="alert" className="mono-label mt-2 text-signal">
                  {errors.projectType.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="cf-message" className="mono-label mb-2 block text-paper/60">
                Message
              </label>
              <textarea
                id="cf-message"
                rows={5}
                placeholder="What are we making?"
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "cf-message-err" : undefined}
                className={`${inputBase} resize-y`}
                {...register("message")}
              />
              {errors.message && (
                <p id="cf-message-err" role="alert" className="mono-label mt-2 text-signal">
                  {errors.message.message}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-5 pt-2">
              <button
                type="submit"
                disabled={serverState.status === "sending"}
                className="mono-label min-h-[44px] rounded-[20px] bg-paper px-6 text-ink transition-colors hover:bg-signal hover:text-ink disabled:opacity-50"
              >
                {serverState.status === "sending" ? "Sending…" : "Send it →"}
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
                <p role={serverState.status === "error" ? "alert" : undefined} className="mono-label max-w-[42ch] text-paper/70">
                  {serverState.status === "error"
                    ? serverState.message
                    : "Form delivery isn't wired to an inbox yet — use the email address on the left."}
                </p>
              )}
            </div>
          </form>
        </Reveal>
      </div>

      <FooterWordmark />
    </section>
  );
}

/** Giant MUFASA® wordmark cropped at the bottom edge of the page. */
export function FooterWordmark({ tone = "ink" }: { tone?: "ink" | "paper" }) {
  const text = tone === "ink" ? "text-paper" : "text-ink";
  const rule = tone === "ink" ? "border-paper/10" : "border-ink/10";
  const sub = tone === "ink" ? "text-paper/40" : "text-ink/45";
  return (
    <footer aria-label="Footer" className={`bg-ink`}>
      {/* wordmark, cropped at the bottom edge */}
      <div aria-hidden="true" className="overflow-hidden" style={{ height: "17.5vw" }}>
        <p
          className={`px-gutter whitespace-nowrap text-center font-display text-[26vw] leading-[0.86] ${text} select-none`}
        >
          MUFAS
          <span className="relative inline-block align-bottom">
            <span
              className={`absolute text-[0.3em] text-signal neon-text-soft`}
              style={{ top: "0.04em", right: "-0.32em", lineHeight: 1 }}
            >
              ®
            </span>
            A
          </span>
        </p>
      </div>
      <div className={`px-gutter relative z-10 flex flex-wrap items-center justify-between gap-3 border-t ${rule} py-4 bg-ink`}>
        <p className={`mono-label ${sub}`}>© {new Date().getFullYear()} Victor Oginga — MUFASA®</p>
        <p className={`mono-label ${sub}`}>Photography · Design · Film</p>
      </div>
    </footer>
  );
}
