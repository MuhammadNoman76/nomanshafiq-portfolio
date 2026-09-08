import type { MetadataRoute } from "next";
import { profile } from "@/data/portfolio";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      { userAgent: "Googlebot", allow: "/", disallow: ["/api/"] }
    ],
    sitemap: `${profile.website}/sitemap.xml`,
    host: profile.website
  };
}
