import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Muhammad Noman — AI Engineer Portfolio",
    short_name: "Noman",
    description: "AI engineering, agentic AI, LLM products, and full-stack work by Muhammad Noman.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f3eb",
    theme_color: "#f26343",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }]
  };
}
