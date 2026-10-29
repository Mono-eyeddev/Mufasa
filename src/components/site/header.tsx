"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "@/content/site";

const NAV = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/#services", sectionId: "services" },
  { label: "About", href: "/#about", sectionId: "about" },
  { label: "Contact", href: "/#contact", sectionId: "contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);

  // hide on scroll down, show on scroll up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (y > lastY.current && y > 120 && !menuOpen) setHidden(true);
      else setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  // scroll-spy for home sections
  useEffect(() => {
    if (pathname !== "/") return;
    const ids = NAV.map((n) => n.sectionId).filter(Boolean) as string[];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveSection(e.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [pathname]);

  const isActive = (item: (typeof NAV)[number]) => {
    if (item.href === "/work") return pathname.startsWith("/work");
    if (item.sectionId) return pathname === "/" && activeSection === item.sectionId;
    return false;
  };

  return (
    <>
      <header
        aria-hidden={hidden && !menuOpen}
        className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] ${
          hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"
        } ${scrolled ? "mix-blend-normal" : ""}`}
      >
        <div
          className={`px-gutter flex h-14 items-center justify-between transition-colors duration-500 md:h-16 ${
            scrolled && !menuOpen
              ? "bg-ink/85 backdrop-blur-sm border-b border-paper/10"
              : "bg-transparent"
          }`}
        >
          <Link
            href="/"
            className="font-display text-[22px] md:text-2xl leading-none text-paper hover:text-signal transition-colors"
            aria-label="MUFASA® — home"
          >
            MUFASA<span className="text-signal align-super text-[0.55em] leading-none">®</span>
          </Link>

          <nav aria-label="Primary" className="hidden md:flex items-center gap-7">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isActive(item) ? "page" : undefined}
                className={`mono-label link-underline py-2 transition-colors ${
                  isActive(item) ? "text-paper" : "text-paper/60 hover:text-paper"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/#contact"
              className="mono-label rounded-[20px] border border-paper/70 px-4 py-2.5 text-paper transition-colors hover:bg-signal hover:border-signal hover:text-ink"
            >
              Start a project
            </Link>
          </nav>

          <button
            type="button"
            className="md:hidden mono-label min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-paper"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
          >
            Menu
          </button>
        </div>
      </header>

      <AnimatePresence>{menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}</AnimatePresence>
    </>
  );
}

function MenuOverlay({ onClose }: { onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // scroll lock + ESC + focus trap
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = panelRef.current?.querySelector<HTMLElement>("a, button");
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusables = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
        );
        if (focusables.length === 0) return;
        const firstEl = focusables[0];
        const lastEl = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const items = [...NAV, { label: "Start a project", href: "/#contact" }];

  return (
    <motion.div
      ref={panelRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-[60] band-ink text-paper flex flex-col"
      initial={reduce ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-gutter h-14 flex items-center justify-between">
        <span className="font-display text-[22px] leading-none">
          MUFASA<span className="text-signal align-super text-[0.55em]">®</span>
        </span>
        <button
          type="button"
          onClick={onClose}
          className="mono-label min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-paper"
        >
          Close
        </button>
      </div>

      <nav aria-label="Mobile" className="px-gutter mt-10 flex flex-col">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={reduce ? { y: 0 } : { y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={reduce ? { duration: 0 } : { delay: 0.06 * i + 0.1, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <Link
              href={item.href}
              onClick={onClose}
              className="group flex min-h-[64px] items-center justify-between border-b border-paper/15 py-3"
            >
              <span className="font-display text-5xl leading-[0.9] text-paper group-hover:text-signal transition-colors">
                {item.label}
              </span>
              <span className="mono-label text-paper/50">0{i + 1}</span>
            </Link>
          </motion.div>
        ))}
      </nav>

      <div className="px-gutter mt-auto pb-10">
        <p className="mono-label text-paper/50">{siteConfig.email}</p>
        {siteConfig.availableForCommissions && (
          <p className="mono-label mt-2 text-signal neon-text-soft">✱ Available for commissions</p>
        )}
      </div>
    </motion.div>
  );
}
