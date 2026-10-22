import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/constants";

export function buildHubMetadata(path: string, title: string, description: string): Metadata {
  const url = `${SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | 계산의정석`,
      description,
      type: "website",
      locale: "ko_KR",
      url,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${title} - 계산의정석`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | 계산의정석`,
      description,
      images: [DEFAULT_OG_IMAGE]
    }
  };
}
