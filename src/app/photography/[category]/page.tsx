
import Link from "next/link";
import { notFound } from "next/navigation";
import { photographyCategories } from "@/content/photography";

type Props = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return photographyCategories.map((category) => ({
    category: category.slug,
  }));
}

export default async function PhotographyCategoryPage({
  params,
}: Props) {
  const { category: slug } = await params;

  const category = photographyCategories.find(
    (item) => item.slug === slug
  );

  if (!category) notFound();

  return (
    <main className="min-h-screen bg-[#080808] text-[#ECE7DC]">

      {/* COMPACT ANIMATED CATEGORY HEADING */}
      <section className="relative isolate overflow-hidden bg-[#233D4C]">

        {/* Animated background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(242,140,40,0.18),transparent_65%)]" />

          <div className="absolute -top-32 left-[15%] h-64 w-64 rounded-full bg-[#F28C28]/20 blur-[100px] animate-[float_9s_ease-in-out_infinite]" />

          <div className="absolute -bottom-40 right-[10%] h-72 w-72 rounded-full bg-[#F28C28]/10 blur-[110px] animate-[float_12s_ease-in-out_infinite_reverse]" />

          <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(rgba(236,231,220,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(236,231,220,0.2)_1px,transparent_1px)] bg-[size:55px_55px]" />
        </div>

        <div className="relative mx-auto max-w-[1600px] px-gutter pt-7 md:pt-16 pb-12 md:pb-16">

          {/* Back navigation */}
          <Link
            href="/photography"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#ECE7DC]/60 transition-colors hover:text-[#F28C28]"
          >
            <span className="text-base">←</span>
            All photography
          </Link>

          {/* Centered heading */}
          <header className="mt-12 text-center md:mt-14">

            <p className="mono-label mb-4 text-[9px] text-[#F28C28] md:text-[10px]">
              OGINGA® / PHOTOGRAPHY ARCHIVE
            </p>

            <h1 className="font-display text-5xl leading-none tracking-tight text-[#ECE7DC] sm:text-6xl md:text-7xl">
              {category.title}
              <span className="text-[#F28C28]">.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-[#ECE7DC]/55">
              Explore the individual stories and collections captured
              by Victor Oginga.
            </p>

          </header>
        </div>

        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#F28C28]/60 to-transparent" />
      </section>

      {/* COLLECTIONS */}
      <section className="px-gutter pb-28 pt-8 md:pt-10">

        <div className="mb-8 flex items-center justify-between border-b border-[#ECE7DC]/10 pb-4">
          <p className="mono-label text-[#F28C28]">
            Individual collections
          </p>

          <span className="mono-label text-[#ECE7DC]/35">
            {String(category.collections.length).padStart(2, "0")} STORIES
          </span>
        </div>

        {category.collections.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {category.collections.map((collection, index) => (
              <Link
                key={collection.slug}
                href={`/photography/${category.slug}/${collection.slug}`}
                className="group block"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#233D4C]/30">

                  <img
                    src={collection.cover.src}
                    alt={collection.cover.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/90 via-transparent to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">

                    <div>
                      <p className="mono-label mb-3 text-[#F28C28]">
                        STORY {String(index + 1).padStart(2, "0")}
                      </p>

                      <h2 className="font-display text-3xl text-[#ECE7DC]">
                        {collection.title}
                      </h2>

                      <p className="mt-2 text-xs text-[#ECE7DC]/50">
                        {collection.images.length} photographs
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
        ) : (
          <div className="flex min-h-[300px] flex-col items-center justify-center border border-[#ECE7DC]/10 bg-[#233D4C]/10 text-center">

            <span className="font-display text-6xl text-[#ECE7DC]/10">
              00
            </span>

            <p className="mono-label mt-5 text-xs text-[#F28C28]">
              COLLECTIONS COMING SOON
            </p>

            <p className="mt-3 text-sm text-[#ECE7DC]/35">
              New stories will be added to this archive.
            </p>

          </div>
        )}
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
