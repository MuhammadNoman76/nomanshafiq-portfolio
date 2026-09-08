import type { Metadata, Viewport } from "next";
import { profile } from "@/data/portfolio";
import "./globals.css";

const siteUrl = profile.website;
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Muhammad Noman | AI Engineer, Agentic AI & Full-Stack Developer",
    template: "%s | Muhammad Noman"
  },
  description:
    "Muhammad Noman is a Lead AI Engineer and Full-Stack Developer in Karachi, Pakistan, building AI agents, LLM applications, RAG systems, and production products with Python, Next.js, LangChain, Azure, and GCP.",
  applicationName: "Muhammad Noman Portfolio",
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  publisher: profile.name,
  category: "technology",
  keywords: [
    "Muhammad Noman",
    "Muhammad Noman AI Engineer",
    "AI Engineer Pakistan",
    "AI Engineer Karachi",
    "Lead AI Engineer",
    "Agentic AI Engineer",
    "AI Agent Developer",
    "LLM Engineer",
    "LangChain Developer",
    "LangGraph Developer",
    "RAG Developer",
    "Full Stack AI Developer",
    "Next.js Developer Pakistan",
    "Python AI Developer",
    "Azure AI Engineer",
    "Google Cloud AI Engineer",
    "AI Portfolio Pakistan"
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Muhammad Noman | AI Engineer & Product Builder",
    description: "AI agents, LLM products, and full-stack systems designed, built, and shipped from Karachi to the world.",
    url: siteUrl,
    siteName: "Muhammad Noman",
    locale: "en_PK",
    type: "website",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Muhammad Noman — AI Engineer and Full-Stack Developer" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Noman | AI Engineer & Product Builder",
    description: "Agentic AI, LLM products, full-stack engineering, and cloud systems.",
    images: ["/opengraph-image.png"]
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  verification: googleVerification ? { google: googleVerification } : undefined,
  icons: { icon: "/favicon.svg" },
  other: {
    "geo.region": "PK-SD",
    "geo.placename": "Karachi",
    "profile:first_name": "Muhammad",
    "profile:last_name": "Noman"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f6f3eb",
  colorScheme: "light"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-PK">
      <head>
        <link rel="me" href={profile.github} />
        <link rel="me" href={profile.linkedin} />
      </head>
      <body>{children}</body>
    </html>
  );
}
