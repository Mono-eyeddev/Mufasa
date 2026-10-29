import { projects } from "@/content/projects";
import type { Discipline, Project } from "@/content/types";

/**
 * Single access layer for all content. A CMS can replace this module later
 * without touching a single component.
 */

export function getProjects(): Project[] {
  return [...projects].sort((a, b) => a.order - b.order);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeatured(): Project[] {
  return getProjects().filter((p) => p.featured);
}

export function getByDiscipline(discipline: Discipline): Project[] {
  return getProjects().filter((p) => p.discipline.includes(discipline));
}

export function getProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}

export function getAdjacentProjects(slug: string): {
  next: Project | undefined;
} {
  const all = getProjects();
  const i = all.findIndex((p) => p.slug === slug);
  if (i === -1) return { next: undefined };
  return { next: all[(i + 1) % all.length] };
}

/** Projects for the homepage grid — the full archive is on /work. */
export function getHomeGrid(): Project[] {
  return getProjects().slice(0, 8);
}
