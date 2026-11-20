
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/content/site";
import CaptureButton from "./capture-button";

const NAV = [
  { label: "Home", href: "/#home", sectionId: "home" },
  { label: "Work", href: "/#work", sectionId: "work" },
  { label: "Services", href: "/#services", sectionId: "services" },
  {
    label: "Behind the Scenes",
    href: "/#behind-the-scenes",
    sectionId: "behind-the-scenes",
  },
  { label: "About", href: "/#about", sectionId: "about" },
  { label: "Brands", href: "/#brands", sectionId: "brands" },
  { label: "Contact", href: "/#contact", sectionId: "contact" },
];

type NavItem = (typeof NAV)[number];

export function SiteHeader() {
  const pathname = usePathname();

  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    setHidden(false);
    lastY.current = window.scrollY;
  }, [pathname]);

  // Header scroll behaviour.
  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;

      ticking.current = true;

      window.requestAnimationFrame(() => {
        const currentY = window.scrollY;

        setScrolled(currentY > 24);

        if (menuOpen) {
          setHidden(false);
        } else if (currentY > lastY.current && currentY > 120) {
          setHidden(true);
        } else {
          setHidden(false);
        }

        lastY.current = currentY;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  // Track the active homepage section.
  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection(null);
      return;
    }

    let frame = 0;

    const updateActiveSection = () => {
      if (frame) return;

      frame = window.requestAnimationFrame(() => {
        frame = 0;

        const scrollPosition = window.scrollY;
        const readingPosition =
          scrollPosition + window.innerHeight * 0.38;

        if (scrollPosition < 80) {
          setActiveSection("home");
          return;
        }

        let currentSection: string | null = null;

        for (const item of NAV) {
          const section = document.getElementById(item.sectionId);

          if (!section) continue;

          const sectionTop =
            section.getBoundingClientRect().top + scrollPosition;

          if (sectionTop <= readingPosition) {
            currentSection = item.sectionId;
          }
        }

        const atBottom =
          window.innerHeight + scrollPosition >=
          document.documentElement.scrollHeight - 10;

        if (atBottom && document.getElementById("contact")) {
          currentSection = "contact";
        }

        if (currentSection) {
          setActiveSection(currentSection);
        }
      });
    };

    updateActiveSection();

    window.addEventListener("scroll", updateActiveSection, {
      passive: true,
    });

    window.addEventListener("resize", updateActiveSection);

    const initialUpdate = window.setTimeout(updateActiveSection, 300);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(initialUpdate);
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [pathname]);

  const isActive = (item: NavItem) => {
    return pathname === "/" && activeSection === item.sectionId;
  };

  return (
    <>
      <header
        aria-hidden={hidden && !menuOpen}
        className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] ${
          hidden && !menuOpen
            ? "-translate-y-full"
            : "translate-y-0"
        }`}
      >
        <div
          className={`flex h-[60px] items-center justify-between px-gutter transition-all duration-500 md:h-16 ${
            scrolled && !menuOpen
              ? "border-b border-[#FD802E]/15 bg-[#233D4C]/90 shadow-[0_8px_30px_rgba(0,0,0,0.2)] backdrop-blur-xl"
              : "bg-transparent"
          }`}
        >
          {/* Brand */}
          <Link
            href="/"
            className="font-display text-[20px] leading-none text-paper transition-colors duration-300 hover:text-[#FD802E] md:text-2xl"
            aria-label="OGINGA®: home"
          >
            OGINGA
            <span className="align-super text-[0.55em] leading-none text-[#FD802E]">
              ®
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav
            aria-label="Primary"
            className="hidden items-center gap-5 lg:flex xl:gap-7"
          >
            {NAV.map((item) => {
              const active = isActive(item);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={active ? "location" : undefined}
                  className={`mono-label link-underline relative py-2 transition-colors duration-300 ${
                    active
                      ? "text-[#FD802E]"
                      : "text-paper/60 hover:text-[#FD802E]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <CaptureButton />
          </nav>

          {/* Mobile / tablet menu trigger */}
          <button
            type="button"
            className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-paper/15 bg-paper/[0.04] px-3.5 text-paper transition-all duration-300 hover:border-[#FD802E]/60 hover:bg-[#FD802E]/10 lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label="Open navigation menu"
            onClick={() => setMenuOpen(true)}
          >
            <span className="mono-label text-[10px] tracking-[0.16em] transition-colors group-hover:text-[#FD802E]">
              MENU
            </span>
            <Menu
              size={17}
              strokeWidth={1.7}
              className="transition-colors group-hover:text-[#FD802E]"
            />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <MenuOverlay onClose={() => setMenuOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

function MenuOverlay({ onClose }: { onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const previousFocus = document.activeElement as HTMLElement | null;

    const firstElement =
      panelRef.current?.querySelector<HTMLElement>("a, button");

    firstElement?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusableElements = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])'
        )
      );

      if (focusableElements.length === 0) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [onClose]);

  const items = [
    ...NAV,
    { label: "Start a project", href: "/#contact" },
  ];

  return (
    <motion.div
      ref={panelRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      className="fixed inset-0 z-[60] flex h-[100dvh] min-h-0 flex-col overflow-x-hidden overflow-y-hidden bg-[#080808] text-paper"
      initial={reduce ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.25 }}
    >
      {/* Ambient atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-16 h-72 w-72 rounded-full bg-[#233D4C]/40 blur-[100px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 bottom-24 h-64 w-64 rounded-full bg-[#FD802E]/10 blur-[100px]"
      />

      {/* Menu header */}
      <div className="relative z-10 flex h-[60px] shrink-0 items-center justify-between border-b border-paper/10 px-gutter md:h-16">
        <Link
          href="/"
          onClick={onClose}
          className="font-display text-[20px] leading-none text-paper"
        >
          OGINGA
          <span className="align-super text-[0.55em] text-[#FD802E]">
            ®
          </span>
        </Link>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation menu"
          className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-paper/15 px-3.5 text-paper transition-colors hover:border-[#FD802E]/60 hover:text-[#FD802E]"
        >
          <span className="mono-label text-[10px] tracking-[0.16em]">
            CLOSE
          </span>
          <X size={17} strokeWidth={1.7} />
        </button>
      </div>

      {/* Navigation */}
      <nav
        aria-label="Mobile"
       className="relative z-10 ml-auto mr-0 min-h-0 w-full max-w-2xl flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-gutter pb-8 pt-5 text-right"
      >
        <p className="mono-label mb-3 text-[9px] tracking-[0.22em] text-paper/35">
          NAVIGATION / 001
        </p>

        {items.map((item, index) => (
          <motion.div
            key={item.label}
            initial={reduce ? { y: 0, opacity: 1 } : { y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={
              reduce
                ? { duration: 0 }
                : {
                    delay: 0.035 * index,
                    duration: 0.35,
                    ease: [0.2, 0.8, 0.2, 1],
                  }
            }
          >
            <Link
              href={item.href}
              onClick={onClose}
              className="group flex min-h-[51px] flex-row-reverse items-center justify-between gap-4 border-b border-paper/10 py-2.5 text-right transition-colors duration-300 hover:border-[#FD802E]/40"
            >
             <span className="min-w-0 break-words font-display text-[clamp(1.35rem,6vw,2.35rem)] leading-tight text-paper transition-colors duration-300 group-hover:text-[#FD802E]">
                {item.label}
              </span>

<span className="flex w-12 shrink-0 items-center justify-end gap-2">
  <span className="mono-label text-[9px] tracking-[0.12em] text-paper/30 transition-colors group-hover:text-[#FD802E]">
    {String(index + 1).padStart(2, "0")}
  </span>
  <ArrowUpRight
    size={15}
    strokeWidth={1.5}
    className="text-[#FD802E]/50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#FD802E]"
  />
</span>
            </Link>
          </motion.div>
        ))}
      </nav>
    </motion.div>
  );
}
