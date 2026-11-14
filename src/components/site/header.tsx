
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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

  // Reset header visibility after route navigation.
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

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
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

        // Home is always active near the top.
        if (scrollPosition < 80) {
          setActiveSection("home");
          return;
        }

        let currentSection: string | null = null;

        // Find the last section that has crossed the reading position.
        for (const item of NAV) {
          const section = document.getElementById(item.sectionId);

          if (!section) continue;

          const sectionTop =
            section.getBoundingClientRect().top + scrollPosition;

          if (sectionTop <= readingPosition) {
            currentSection = item.sectionId;
          }
        }

        // Keep Contact active at the bottom of the page.
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

    // Recheck after the page has completed its initial layout.
    const initialUpdate = window.setTimeout(updateActiveSection, 300);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(initialUpdate);

      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [pathname]);

  // Determine which navigation item is active.
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
          className={`flex h-14 items-center justify-between px-gutter transition-all duration-500 md:h-16 ${
            scrolled && !menuOpen
              ? "border-b border-[#FD802E]/15 bg-[#233D4C]/90 shadow-[0_8px_30px_rgba(0,0,0,0.2)] backdrop-blur-xl"
              : "bg-transparent"
          }`}
        >
          {/* Brand */}
          <Link
            href="/"
            className="font-display text-[22px] leading-none text-paper transition-colors duration-300 hover:text-[#FD802E] md:text-2xl"
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

          {/* Mobile menu trigger */}
          <button
            type="button"
            className="mono-label inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-paper transition-colors duration-300 hover:text-[#FD802E] md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
          >
            Menu
          </button>
        </div>
      </header>

      {/* Mobile navigation overlay */}
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

  // Scroll lock, Escape key and keyboard focus management.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

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
      aria-label="Menu"
      className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-[#080808] text-paper"
      initial={reduce ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.3 }}
    >
      {/* Petrol blue atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-[#233D4C]/45 blur-[120px]"
      />

      {/* Orange ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 bottom-20 h-80 w-80 rounded-full bg-[#FD802E]/10 blur-[120px]"
      />

      {/* Mobile header */}
      <div className="relative z-10 flex h-14 shrink-0 items-center justify-between border-b border-paper/10 px-gutter">
        <Link
          href="/"
          onClick={onClose}
          className="font-display text-[22px] leading-none"
        >
          OGINGA
          <span className="align-super text-[0.55em] text-[#FD802E]">
            ®
          </span>
        </Link>

        <button
          type="button"
          onClick={onClose}
          className="mono-label inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-paper transition-colors hover:text-[#FD802E]"
        >
          Close
        </button>
      </div>

      {/* Navigation links */}
      <nav
        aria-label="Mobile"
        className="relative z-10 mt-10 flex flex-col px-gutter"
      >
        {items.map((item, index) => (
          <motion.div
            key={item.label}
            initial={
              reduce
                ? { y: 0, opacity: 1 }
                : { y: 40, opacity: 0 }
            }
            animate={{ y: 0, opacity: 1 }}
            transition={
              reduce
                ? { duration: 0 }
                : {
                    delay: 0.06 * index + 0.1,
                    duration: 0.5,
                    ease: [0.2, 0.8, 0.2, 1],
                  }
            }
          >
            <Link
              href={item.href}
              onClick={onClose}
              className="group flex min-h-[64px] items-center justify-between border-b border-paper/15 py-3"
            >
              <span className="font-display text-5xl leading-[0.9] text-paper transition-colors duration-300 group-hover:text-[#FD802E]">
                {item.label}
              </span>

              <span className="mono-label text-[#FD802E]/60 transition-colors group-hover:text-[#FD802E]">
                {String(index + 1).padStart(2, "0")}
              </span>
            </Link>
          </motion.div>
        ))}
      </nav>

      {/* Footer */}
      <div className="relative z-10 mt-auto border-t border-paper/10 px-gutter pb-10 pt-6">
        <p className="mono-label text-paper/50">
          {siteConfig.email}
        </p>

        {siteConfig.availableForCommissions && (
          <p className="mono-label mt-2 text-[#FD802E]">
            ✱ Available for commissions
          </p>
        )}
      </div>
    </motion.div>
  );
}
