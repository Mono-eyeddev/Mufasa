
import Link from "next/link";
import { photographyCategories } from "@/content/photography";

export default function PhotographyPage() {
  return (
    <main className="min-h-screen bg-[#080808] text-[#ECE7DC]">

      {/* COMPACT ANIMATED PHOTOGRAPHY HEADING */}
      <section className="relative isolate overflow-hidden bg-[#233D4C]">

        {/* Animated background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(242,140,40,0.18),transparent_65%)]" />

          <div className="absolute -top-32 left-[15%] h-64 w-64 rounded-full bg-[#F28C28]/20 blur-[100px] animate-[float_9s_ease-in-out_infinite]" />

          <div className="absolute -bottom-40 right-[10%] h-72 w-72 rounded-full bg-[#F28C28]/10 blur-[110px] animate-[float_12s_ease-in-out_infinite_reverse]" />

          <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(rgba(236,231,220,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(236,231,220,0.2)_1px,transparent_1px)] bg-[size:55px_55px]" />
        </div>

        <div className="relative mx-auto max-w-[1600px] px-gutter pb-12 pt-12 md:pb-16 md:pt-20">

          <header className="text-center">


            <h1 className="font-display text-5xl leading-none tracking-tight text-[#ECE7DC] sm:text-6xl md:text-7xl">
              Photography
              <span className="text-[#F28C28]">.</span>
            </h1>

            <div className="mt-5 flex items-center justify-center gap-3">
              <span className="h-px w-7 bg-[#F28C28]" />

              <span className="mono-label text-[9px] text-[#ECE7DC]/55">
                {photographyCategories.length} CATEGORIES
              </span>

              <span className="h-px w-7 bg-[#F28C28]" />
            </div>

            <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-[#ECE7DC]/55">
              A collection of moments, people, places and stories
              captured through the lens of Victor Oginga.
            </p>

          </header>
        </div>

        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#F28C28]/60 to-transparent" />
      </section>

      {/* PHOTOGRAPHY CATEGORIES */}
      <section className="px-gutter pb-28 pt-8 md:pt-10">

        <div className="mb-8 flex items-center justify-between border-b border-[#ECE7DC]/10 pb-4">
          <p className="mono-label text-[#F28C28]">
            Explore by category
          </p>

          <span className="mono-label text-[#ECE7DC]/35">
            {String(photographyCategories.length).padStart(2, "0")} CATEGORIES
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {photographyCategories.map((category, index) => (
            <Link
              key={category.slug}
              href={`/photography/${category.slug}`}
              className="group block"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#233D4C]/30">

                {category.cover || category.collections[0]?.cover ? (
                  <img
                    src={
                      category.cover?.src ||
                      category.collections[0].cover.src
                    }
                    alt={
                      category.cover?.alt ||
                      category.collections[0].cover.alt
                    }
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#233D4C] via-[#111] to-[#080808]">
                    <span className="font-display text-8xl text-[#ECE7DC]/[0.06]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/90 via-[#080808]/10 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 md:p-7">

                  <div>
                    <p className="mono-label mb-3 text-[#F28C28]">
                      CATEGORY {String(index + 1).padStart(2, "0")}
                    </p>

                    <h2 className="font-display text-3xl text-[#ECE7DC] md:text-4xl">
                      {category.title}
                    </h2>

                    <p className="mt-2 text-xs text-[#ECE7DC]/50">
                      {category.collections.length}{" "}
                      {category.collections.length === 1
                        ? "collection"
                        : "collections"}
                    </p>
                  </div>

                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ECE7DC]/30 text-lg text-[#ECE7DC] transition-all duration-300 group-hover:border-[#F28C28] group-hover:bg-[#F28C28] group-hover:text-[#080808]">
                    ↗
                  </span>

                </div>
              </div>
            </Link>
          ))}

        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(35px, 25px, 0) scale(1.15);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-\\[float_9s_ease-in-out_infinite\\],
          .animate-\\[float_12s_ease-in-out_infinite_reverse\\] {
            animation: none;
          }
        }
      `}</style>

    </main>
  );
}
