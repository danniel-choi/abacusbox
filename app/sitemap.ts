import type { MetadataRoute } from "next";
import { calculators } from "@/lib/calculators";
import { blogPosts, communityPosts } from "@/lib/content";
import { SITE_URL } from "@/lib/constants";

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
    ...communityPosts.map((post) => ({
      url: `${SITE_URL}/community/post?slug=${post.slug}`,
      lastModified: new Date(post.publishedAt)
    })),
    ...["about", "editorial-policy", "privacy", "terms", "contact", "contact/post", "blog", "community", "blog/post", "community/post"].map((path) => ({
      url: `${SITE_URL}/${path}`,
      lastModified: new Date()
    }))
  ];
}
