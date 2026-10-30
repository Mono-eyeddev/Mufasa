
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Flight = {
  x: number;
  startY: number;
  targetY: number;
};

type SmokeParticle = {
  id: number;
  x: number;
  y: number;
  size: number;
  drift: number;
  duration: number;
};

type ExplosionPosition = {
  x: number;
  y: number;
};

const FLIGHT_DURATION = 1600;
const EXPLOSION_DURATION = 1200;

const SPARKS = Array.from({ length: 40 }, (_, i) => ({
  angle: (i / 40) * Math.PI * 2,
  distance: 65 + ((i * 43) % 130),
  size: 2 + (i % 4),
  delay: (i % 7) * 0.025,
}));

export default function RocketBackToTop() {
  const [visible, setVisible] = useState(false);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [smoke, setSmoke] = useState<SmokeParticle[]>([]);
  const [explosion, setExplosion] = useState<ExplosionPosition | null>(null);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const launchingRef = useRef(false);
  const particleId = useRef(0);
  const animationFrame = useRef<number | null>(null);
  const cleanupTimer = useRef<number | null>(null);

  // Show the button only when the page is sufficiently scrolled.
  useEffect(() => {
    const handleScroll = () => {
      if (!launchingRef.current) {
        setVisible(window.scrollY > 350);
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current);
      }

      if (cleanupTimer.current !== null) {
        window.clearTimeout(cleanupTimer.current);
      }
    };
  }, []);

  // Smoothly scroll the document to the top.
  const animateScroll = useCallback(
    (duration: number) => {
      const initialScroll = window.scrollY;
      const startTime = performance.now();

      const step = (now: number) => {
        const progress = Math.min(
          (now - startTime) / duration,
          1
        );

        const eased = 1 - Math.pow(1 - progress, 3);

        window.scrollTo(
          0,
          Math.round(initialScroll * (1 - eased))
        );

        if (progress < 1) {
          animationFrame.current = requestAnimationFrame(step);
        }
      };

      animationFrame.current = requestAnimationFrame(step);
    },
    []
  );

  const launchRocket = () => {
    if (launchingRef.current || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();

    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    // Keep the explosion within the hero's visible area.
    const targetY = Math.max(
      130,
      Math.min(window.innerHeight * 0.28, 250)
    );

    launchingRef.current = true;

    setVisible(false);
    setSmoke([]);
    setExplosion(null);

    setFlight({
      x: startX,
      startY,
      targetY,
    });

    // Scroll and rocket animation share the same duration.
    animateScroll(FLIGHT_DURATION);

    const startTime = performance.now();
    let lastSmokeTime = 0;

    const animateFlight = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / FLIGHT_DURATION, 1);

      const eased = 1 - Math.pow(1 - progress, 3);

      const currentY =
        startY + (targetY - startY) * eased;

      // Emit smoke at the rocket's current position.
      if (
        elapsed - lastSmokeTime > 65 &&
        progress < 0.96
      ) {
        lastSmokeTime = elapsed;

        const particle: SmokeParticle = {
          id: particleId.current++,
          x: startX + (Math.random() - 0.5) * 26,
          y: currentY + 22,
          size: 12 + Math.random() * 22,
          drift: (Math.random() - 0.5) * 65,
          duration: 1.2 + Math.random() * 0.8,
        };

        setSmoke((previous) => [
          ...previous.slice(-100),
          particle,
        ]);
      }

      if (progress < 1) {
        animationFrame.current =
          requestAnimationFrame(animateFlight);
      } else {
        animationFrame.current = null;

        // Trigger the explosion at the hero.
        setFlight(null);
        setExplosion({
          x: startX,
          y: targetY,
        });

        cleanupTimer.current = window.setTimeout(() => {
          setExplosion(null);
          setSmoke([]);
          launchingRef.current = false;
          setVisible(window.scrollY > 350);
        }, EXPLOSION_DURATION);
      }
    };

    animationFrame.current =
      requestAnimationFrame(animateFlight);
  };

  return (
    <>
      {/* FLOATING LAUNCH BUTTON */}
      <AnimatePresence>
        {visible && !flight && (
          <motion.button
            ref={buttonRef}
            type="button"
            aria-label="Launch rocket and return to top"
            onClick={launchRocket}
            initial={{
              opacity: 0,
              scale: 0.6,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.5,
            }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
            className="fixed bottom-7 right-7 z-[100] flex h-14 w-14 items-center justify-center rounded-full border border-[#CCFF00]/50 bg-[#10110B]/95 text-[#CCFF00] shadow-[0_0_24px_rgba(204,255,0,0.2)] backdrop-blur-xl transition-shadow hover:shadow-[0_0_35px_rgba(204,255,0,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#CCFF00]"
          >
            <motion.svg
              viewBox="0 0 48 48"
              width="32"
              height="32"
              fill="none"
              animate={{
                y: [0, -3, 0],
                rotate: [0, 2, 0, -2, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <path
                d="M24 3C15 11 12 21 13 31L24 39L35 31C36 21 33 11 24 3Z"
                fill="#CCFF00"
                fillOpacity=".12"
                stroke="#CCFF00"
                strokeWidth="1.8"
              />

              <circle
                cx="24"
                cy="21"
                r="4.2"
                fill="#10110B"
                stroke="#CCFF00"
                strokeWidth="2"
              />

              <path
                d="M13 25L6 34L14 32L17 28M35 25L42 34L34 32L31 28"
                stroke="#CCFF00"
                strokeWidth="1.8"
              />

              <path
                d="M19 34L24 46L29 34L24 39L19 34Z"
                fill="#CCFF00"
              />
            </motion.svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ROCKET FLIGHT AND EXHAUST */}
      <AnimatePresence>
        {flight && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[9998] overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* LONG LIME EXHAUST TRAIL */}
            <motion.div
              className="absolute w-4 rounded-full bg-[#CCFF00] blur-md"
              style={{
                left: flight.x - 8,
                top: flight.targetY,
                height: flight.startY - flight.targetY,
                transformOrigin: "bottom",
              }}
              initial={{
                scaleY: 0,
                opacity: 0,
              }}
              animate={{
                scaleY: 1,
                opacity: [0, 0.9, 0.45],
              }}
              transition={{
                duration: FLIGHT_DURATION / 1000,
                ease: "linear",
              }}
            />

            {/* WHITE-HOT EXHAUST CORE */}
            <motion.div
              className="absolute w-1 rounded-full bg-white blur-sm"
              style={{
                left: flight.x - 2,
                top: flight.targetY,
                height: flight.startY - flight.targetY,
                transformOrigin: "bottom",
              }}
              initial={{
                scaleY: 0,
                opacity: 0,
              }}
              animate={{
                scaleY: 1,
                opacity: [0, 1, 0.6],
              }}
              transition={{
                duration: FLIGHT_DURATION / 1000,
                ease: "linear",
              }}
            />

            {/* LINGERING SMOKE CLOUDS */}
            {smoke.map((particle) => (
              <motion.span
                key={particle.id}
                className="absolute rounded-full bg-[#85877B]/75 blur-md"
                style={{
                  left: particle.x,
                  top: particle.y,
                  width: particle.size,
                  height: particle.size,
                }}
                initial={{
                  opacity: 0.7,
                  scale: 0.45,
                }}
                animate={{
                  opacity: 0,
                  scale: 2.8,
                  x: particle.drift,
                  y: 75,
                }}
                transition={{
                  duration: particle.duration,
                  ease: "easeOut",
                }}
              />
            ))}

            {/* ROCKET BODY */}
            <motion.div
              className="absolute"
              style={{
                left: flight.x,
                top: flight.startY,
                x: "-50%",
                y: "-50%",
              }}
              animate={{
                top: flight.targetY,
                rotate: [0, -2, 2, -1, 0],
              }}
              transition={{
                top: {
                  duration: FLIGHT_DURATION / 1000,
                  ease: [0.22, 1, 0.36, 1],
                },
                rotate: {
                  duration: 0.3,
                  repeat: 5,
                },
              }}
            >
              <svg
                width="48"
                height="64"
                viewBox="0 0 48 64"
                fill="none"
              >
                <path
                  d="M24 2C14 14 11 27 13 43L24 53L35 43C37 27 34 14 24 2Z"
                  fill="#171A0C"
                  stroke="#CCFF00"
                  strokeWidth="2"
                />

                <path
                  d="M24 5C17 16 16 26 17 38L24 45L31 38C32 26 31 16 24 5Z"
                  fill="#CCFF00"
                  fillOpacity=".12"
                />

                <circle
                  cx="24"
                  cy="27"
                  r="6"
                  fill="#10110B"
                  stroke="#CCFF00"
                  strokeWidth="2"
                />

                <path
                  d="M13 35L4 48L14 45L18 40M35 35L44 48L34 45L30 40"
                  stroke="#CCFF00"
                  strokeWidth="2"
                />

                <path
                  d="M18 47L24 63L30 47L24 53L18 47Z"
                  fill="#CCFF00"
                />
              </svg>

              {/* ANIMATED ENGINE FLAME */}
              <motion.div
                className="absolute left-1/2 top-[85%] h-16 w-5 -translate-x-1/2 rounded-full bg-gradient-to-b from-white via-[#CCFF00] to-transparent blur-sm"
                animate={{
                  scaleY: [0.8, 1.6, 0.9],
                  scaleX: [0.9, 1.2, 0.8],
                  opacity: [1, 0.75, 1],
                }}
                transition={{
                  duration: 0.12,
                  repeat: Infinity,
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULL-SCREEN HERO EXPLOSION */}
      <AnimatePresence>
        {explosion && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[9999] overflow-visible"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Explosion
              x={explosion.x}
              y={explosion.y}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* =========================================
   CINEMATIC EXPLOSION
========================================= */

function Explosion({
  x,
  y,
}: {
  x: number;
  y: number;
}) {
  return (
    <div
      className="absolute"
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* CENTRAL WHITE-HOT FLASH */}
      <motion.div
        className="absolute -left-10 -top-10 h-20 w-20 rounded-full bg-white blur-xl"
        initial={{
          opacity: 1,
          scale: 0.2,
        }}
        animate={{
          opacity: 0,
          scale: 4,
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
      />

      {/* LIME ENERGY CORE */}
      <motion.div
        className="absolute -left-12 -top-12 h-24 w-24 rounded-full bg-[#CCFF00] blur-2xl"
        initial={{
          opacity: 1,
          scale: 0.3,
        }}
        animate={{
          opacity: 0,
          scale: 4.5,
        }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
      />

      {/* PRIMARY SHOCKWAVE */}
      <motion.div
        className="absolute -left-5 -top-5 h-10 w-10 rounded-full border-2 border-[#CCFF00] shadow-[0_0_30px_#CCFF00]"
        initial={{
          scale: 0.2,
          opacity: 1,
        }}
        animate={{
          scale: 9,
          opacity: 0,
        }}
        transition={{
          duration: 0.9,
          ease: "easeOut",
        }}
      />

      {/* SECONDARY SHOCKWAVE */}
      <motion.div
        className="absolute -left-5 -top-5 h-10 w-10 rounded-full border border-white"
        initial={{
          scale: 0.2,
          opacity: 0.9,
        }}
        animate={{
          scale: 6,
          opacity: 0,
        }}
        transition={{
          duration: 0.8,
          delay: 0.12,
          ease: "easeOut",
        }}
      />

      {/* OUTWARD-FLYING SPARKS */}
      {SPARKS.map((spark, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-[#CCFF00] shadow-[0_0_14px_#CCFF00]"
          style={{
            width: spark.size,
            height: spark.size,
          }}
          initial={{
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
          }}
          animate={{
            x: Math.cos(spark.angle) * spark.distance,
            y: Math.sin(spark.angle) * spark.distance,
            opacity: 0,
            scale: 0.1,
          }}
          transition={{
            duration: 0.9,
            delay: spark.delay,
            ease: "easeOut",
          }}
        />
      ))}

      {/* SECONDARY HOT DEBRIS */}
      {SPARKS.slice(0, 16).map((spark, i) => (
        <motion.span
          key={`debris-${i}`}
          className="absolute rounded-full bg-white shadow-[0_0_10px_white]"
          style={{
            width: 2,
            height: 2,
          }}
          initial={{
            x: 0,
            y: 0,
            opacity: 1,
          }}
          animate={{
            x: Math.cos(spark.angle + 0.2) * spark.distance * 0.65,
            y: Math.sin(spark.angle + 0.2) * spark.distance * 0.65,
            opacity: 0,
          }}
          transition={{
            duration: 0.7,
            delay: spark.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
