
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);

      if (y > lastY.current && y > 120 && !menuOpen) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  // Scroll spy for home sections
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
    if (item.sectionId) {
      return pathname === "/" && activeSection === item.sectionId;
    }
    return false;
  };

  return (
    <>
      <header
        aria-hidden={hidden && !menuOpen}
        className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] ${
          hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"
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
            aria-label="MUFASA® — home"
          >
            MUFASA
            <span className="align-super text-[0.55em] leading-none text-[#FD802E]">
              ®
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav
            aria-label="Primary"
            className="hidden items-center gap-7 md:flex"
          >
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isActive(item) ? "page" : undefined}
                className={`mono-label link-underline relative py-2 transition-colors duration-300 ${
                  isActive(item)
                    ? "text-[#FD802E]"
                    : "text-paper/65 hover:text-[#FD802E]"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Primary CTA */}
            <Link
              href="/#contact"
              className="mono-label rounded-[20px] border border-[#FD802E]/70 bg-[#FD802E] px-4 py-2.5 text-[#080808] transition-all duration-300 hover:border-[#FFC247] hover:bg-[#FFC247] hover:shadow-[0_0_25px_rgba(253,128,46,0.25)]"
            >
              Start a project
            </Link>
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

      <AnimatePresence>
        {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

function MenuOverlay({ onClose }: { onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Scroll lock + ESC + focus trap
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
          panelRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled])'
          )
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
      className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-[#080808] text-paper"
      initial={reduce ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.3 }}
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
      <div className="relative z-10 flex h-14 items-center justify-between border-b border-paper/10 px-gutter">
        <Link
          href="/"
          onClick={onClose}
          className="font-display text-[22px] leading-none"
        >
          MUFASA
          <span className="align-super text-[0.55em] text-[#FD802E]">®</span>
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
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={reduce ? { y: 0 } : { y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={
              reduce
                ? { duration: 0 }
                : {
                    delay: 0.06 * i + 0.1,
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
                0{i + 1}
              </span>
            </Link>
          </motion.div>
        ))}
      </nav>

      {/* Footer */}
      <div className="relative z-10 mt-auto border-t border-paper/10 px-gutter pb-10 pt-6">
        <p className="mono-label text-paper/50">{siteConfig.email}</p>

        {siteConfig.availableForCommissions && (
          <p className="mono-label mt-2 text-[#FD802E]">
            ✱ Available for commissions
          </p>
        )}
      </div>
    </motion.div>
  );
}
