import type { Metadata } from "next";
import { getProjects } from "@/lib/content";
import { WorkArchive } from "@/components/site/work-archive";
import { Contact } from "@/components/site/contact";

export const metadata: Metadata = {
  title: "Work — the full archive",
  description:
    "The complete MUFASA® archive — photography, graphic design, film, branding and campaign work by Victor Oginga.",
};

export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{ discipline?: string }>;
}) {
  const { discipline } = await searchParams;
  const projects = getProjects();
  const providerConfigured = Boolean(process.env.RESEND_API_KEY || process.env.CONTACT_WEBHOOK_URL);

  return (
    <>
      <section aria-labelledby="archive-heading" className="band-ink px-gutter pt-32 pb-24 text-paper md:pt-40 md:pb-32">
        <p className="mono-label text-paper/50">( The archive )</p>
        <h1 id="archive-heading" className="font-display mt-6 text-[16vw] leading-[0.86] md:text-[10vw]">
          Work<span className="text-signal neon-text">.</span>
        </h1>
        <p className="mt-6 max-w-[52ch] text-[17px] leading-relaxed text-paper/75">
          Everything on the roll — photography, design boards, film, identity systems and
          campaigns. Filter by discipline or read it as a list.
        </p>

        <div className="mt-12 md:mt-16">
          <WorkArchive projects={projects} initialDiscipline={discipline ?? null} />
        </div>
      </section>

      <Contact providerConfigured={providerConfigured} />
    </>
  );
}
