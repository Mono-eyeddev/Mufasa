
"use client";

import Link from "next/link";
import RippleGrid from "./RippleGrid";
import { motion, useReducedMotion } from "framer-motion";

import {
  ArrowDownRight,
  ArrowUpRight,
  Instagram,
  Youtube,
  MessageCircle,
} from "lucide-react";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Selected work", href: "/work" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

const socials = [
  { label: "Instagram", href: "#", icon: Instagram },
  { label: "YouTube", href: "#", icon: Youtube },
  { label: "WhatsApp", href: "#", icon: MessageCircle },
];

export default function Footer() {
  const reducedMotion = useReducedMotion();

  return (
    <footer className="relative isolate overflow-hidden bg-ink text-paper">
    
<div aria-hidden="true" className="absolute inset-0 z-0 overflow-hidden">
  {/* Deep petrol ambient accent */}
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(35,61,76,0.28),transparent_65%)]" />

  {/* Interactive orange ripple grid */}

<RippleGrid
  color="#FD802E"
  variant="lines"
  cellSize={48}
  lineWidth={1.1}
  glow={0.45}
  rippleStrength={0.9}
  rippleSpeed={0.8}
  rippleSize={1.1}
  autoRipple="random"
  rippleInterval={3.5}
  mouseInteraction={true}
  clickRipple={true}
  intro={true}
  fade={0.45}
  opacity={0.75}
/>

</div>


       <div className="relative z-10 px-gutter">


        {/* Information grid */}
        <div className="grid grid-cols-2 gap-12 border-t border-paper/15 py-12 md:grid-cols-4 md:gap-8">
          <div className="col-span-2 md:col-span-1">
            <p className="font-display text-3xl tracking-tight">
              OGINGA<span className="text-pumpkin">®</span>
            </p>
            <p className="mono-label mt-3 max-w-48 leading-relaxed text-paper/45">
              VISUAL STORIES.
              <br />
              DISTINCT IDENTITIES.
              <br />
              MEANINGFUL IMPACT.
            </p>
          </div>

          <div>
            <p className="mono-label mb-5 text-paper/35">EXPLORE</p>
            <ul className="space-y-3">
              {navigation.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-paper/75 transition-colors hover:text-pumpkin"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mono-label mb-5 text-paper/35">CONNECT</p>
            <ul className="space-y-3">
              {socials.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 text-sm text-paper/75 transition-colors hover:text-pumpkin"
                  >
                    <Icon size={15} />
                    {label}
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mono-label mb-5 text-paper/35">LOCATION</p>
            <p className="text-sm leading-relaxed text-paper/75">
              Nairobi, Kenya
              <br />
              Available worldwide.
            </p>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="flex flex-col justify-between gap-4 border-t border-paper/15 py-6 sm:flex-row sm:items-center">
          <p className="mono-label text-paper/40">
            © {new Date().getFullYear()} OGINGA®
          </p>

          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-pumpkin" />
            <p className="mono-label text-paper/40">
              PHOTOGRAPHY · DESIGN · FILM
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
