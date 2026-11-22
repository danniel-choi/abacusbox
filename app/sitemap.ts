import type { MetadataRoute } from "next";
import { calculators } from "@/lib/calculators";
import { blogPosts } from "@/lib/content";
import { SITE_URL } from "@/lib/constants";
import { hubContents, hubOrder } from "@/lib/hub-content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL
    },
    ...calculators.map((calculator) => ({
      url: `${SITE_URL}/calculators/${calculator.slug}`
    })),
    ...blogPosts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`
    })),
    ...hubOrder.map((key) => ({
      url: `${SITE_URL}${hubContents[key].path}`
    })),
    ...["calculators", "toolbox", "resources", "about", "editorial-policy", "privacy", "terms", "contact", "blog"].map((path) => ({
      url: `${SITE_URL}/${path}`
    })),
    ...["image-tools", "json-formatter", "text-counter", "drawing-board", "youtube-thumbnail", "image-metadata", "developer-tools"].map((tool) => ({
      url: `${SITE_URL}/toolbox/${tool}`
    }))
  ];
}
