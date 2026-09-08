import type { MetadataRoute } from "next";
import { profile, projects } from "@/data/portfolio";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: profile.website,
      lastModified,
      changeFrequency: "monthly",
      priority: 1
    },
    ...projects.map((project) => ({
      url: `${profile.website}/work/${project.id}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8
    }))
  ];
}
