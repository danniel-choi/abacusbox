import type { MetadataRoute } from "next";
import { calculators } from "@/lib/calculators";
import { blogPosts } from "@/lib/content";
import { SITE_URL } from "@/lib/constants";
import { hubContents, hubOrder } from "@/lib/hub-content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date()
    },
    ...calculators.map((calculator) => ({
      url: `${SITE_URL}/calculators/${calculator.slug}`,
      lastModified: new Date()
    })),
    ...blogPosts.map((post) => ({
      url: `${SITE_URL}/blog/post?slug=${post.slug}`,
      lastModified: new Date(post.publishedAt)
    })),
    ...hubOrder.map((key) => ({
      url: `${SITE_URL}${hubContents[key].path}`,
      lastModified: new Date()
    })),
    ...["calculators", "about", "editorial-policy", "privacy", "terms", "contact", "blog", "community"].map((path) => ({
      url: `${SITE_URL}/${path}`,
      lastModified: new Date()
    }))
  ];
}
