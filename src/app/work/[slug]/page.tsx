import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdjacentProjects, getProjectBySlug, getProjectSlugs } from "@/lib/content";
import { ProjectView } from "@/components/site/project-view";
import { FooterWordmark } from "@/components/site/contact";
import { DISCIPLINE_LABEL } from "@/content/types";
import { siteConfig } from "@/content/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: `${project.title} — ${project.discipline.map((d) => DISCIPLINE_LABEL[d]).join(", ")}`,
    description: project.summary,
    openGraph: {
      title: `${project.title} — MUFASA®`,
      description: project.summary,
      type: "article",
      url: `${siteConfig.url}/work/${project.slug}`,
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  const { next } = getAdjacentProjects(slug);

  return (
    <>
      <ProjectView project={project} next={next!} />
      <FooterWordmark />
    </>
  );
}
