import Link from "next/link";

export default function NotFound() {
  return (
    <section className="px-gutter flex min-h-[80svh] flex-col justify-center bg-paper py-32 text-ink">
      <p className="mono-label text-ink/50">( 404 — Frame missing )</p>
      <h1 className="font-display mt-6 text-[18vw] leading-[0.86] md:text-[10vw]">
        Not developed<span className="text-signal">.</span>
      </h1>
      <p className="mt-6 max-w-[46ch] text-[17px] leading-relaxed text-ink/75">
        This frame didn&apos;t make the contact sheet. The roll is still worth a look.
      </p>
      <Link
        href="/"
        className="mono-label mt-10 inline-flex min-h-[44px] w-fit items-center rounded-[20px] border border-ink px-5 transition-colors hover:bg-ink hover:text-paper"
      >
        ← Back to the start
      </Link>
    </section>
  );
}
