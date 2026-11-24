
import { PhotographyGallery } from "@/components/site/Photography-gallery";
import Link from "next/link";
import { notFound } from "next/navigation";
import { photographyCategories } from "@/content/photography";

type Props = {
  params: Promise<{
    category: string;
    collection: string;
  }>;
};

export function generateStaticParams() {
  return photographyCategories.flatMap((category) =>
    category.collections.map((collection) => ({
      category: category.slug,
      collection: collection.slug,
    }))
  );
}

export default async function PhotographyCollectionPage({
  params,
}: Props) {
  const { category: categorySlug, collection: collectionSlug } =
    await params;

  const category = photographyCategories.find(
    (item) => item.slug === categorySlug
  );

  if (!category) notFound();

  const collection = category.collections.find(
    (item) => item.slug === collectionSlug
  );

  if (!collection) notFound();

  return (
    <main className="min-h-screen bg-[#080808] text-[#ECE7DC]">

      {/* COMPACT COLLECTION HEADING */}
      <section className="relative isolate overflow-hidden bg-[#233D4C]">

        {/* Animated background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(242,140,40,0.18),transparent_65%)]" />

          <div className="absolute -top-32 left-[15%] h-64 w-64 rounded-full bg-[#F28C28]/20 blur-[100px] animate-[float_9s_ease-in-out_infinite]" />

          <div className="absolute -bottom-40 right-[10%] h-72 w-72 rounded-full bg-[#F28C28]/10 blur-[110px] animate-[float_12s_ease-in-out_infinite_reverse]" />

          <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(rgba(236,231,220,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(236,231,220,0.2)_1px,transparent_1px)] bg-[size:55px_55px]" />

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#080808]/25" />
        </div>

        <div className="relative mx-auto max-w-[1600px] px-5 md:px-10 pt-7 md:pt-16 pb-12 md:pb-16">

          <Link
            href={`/photography/${category.slug}`}
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#ECE7DC]/60 hover:text-[#F28C28] transition-colors"
          >
            <span className="text-base">←</span>
            Back to {category.title}
          </Link>

          <header className="text-center mt-12 md:mt-14">

            <p className="text-[9px] md:text-[10px] uppercase tracking-[0.35em] text-[#F28C28] mb-4">
              OGINGA® / PHOTOGRAPHY / {category.title}
            </p>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-semibold tracking-[-0.05em] leading-none text-[#ECE7DC]">
              {collection.title}
            </h1>

            <div className="flex items-center justify-center gap-3 mt-5">
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#ECE7DC]/55">
                {collection.images.length} Photographs
              </span>
            </div>

          </header>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#F28C28]/60 to-transparent" />
      </section>

      {/* GALLERY */}
      <section className="px-5 md:px-10 pt-8 md:pt-10 pb-24">
        <div className="mx-auto max-w-[1600px]">

          <div className="flex items-center justify-between mb-7 border-b border-[#ECE7DC]/10 pb-4">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#F28C28]">
              The gallery
            </p>

            <p className="text-[9px] uppercase tracking-[0.2em] text-[#ECE7DC]/35">
              ® / {category.title}
            </p>
          </div>

          {collection.images.length > 0 ? (
            <PhotographyGallery images={collection.images} />
          ) : (
            <div className="border border-[#ECE7DC]/10 bg-[#233D4C]/20 py-24 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-[#ECE7DC]/45">
                Photographs coming soon
              </p>
            </div>
          )}

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
