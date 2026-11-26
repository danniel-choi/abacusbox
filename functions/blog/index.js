const SITE_URL = "https://www.abacusbox.com";

export async function onRequest(context) {
  const { request, env } = context;
  const asset = await fetchBlogIndexAsset(env, request);
  if (asset.status === 404) return asset;

  const db = env.calcrule || env.CONTENT_DB || null;
  if (!db) return asset;

  try {
    const result = await db.prepare(`
      SELECT slug, title, excerpt, published_at
      FROM posts
      WHERE status = 'published'
        AND type = 'blog'
        AND COALESCE(visibility, 'public') = 'public'
        AND slug NOT LIKE '%-hourly'
      ORDER BY datetime(published_at) DESC, id DESC
      LIMIT 12
    `).all();
    const posts = result.results || [];
    if (posts.length === 0) return asset;

    const html = await asset.text();
    const discovery = renderDiscoveryLinks(posts);
    if (!html.includes("<!-- d1-blog-discovery -->")) {
      const enriched = html.replace("</body>", `${discovery}</body>`);
      const headers = new Headers(asset.headers);
      headers.set("content-type", "text/html; charset=utf-8");
      headers.set("cache-control", "public, max-age=300, s-maxage=900");
      return new Response(enriched, { status: asset.status, headers });
    }
  } catch {
    // The static blog page remains available if D1 is unavailable or not migrated.
  }

  return asset;
}

async function fetchBlogIndexAsset(env, request) {
  if (!env.ASSETS) return new Response(null, { status: 404 });
  const response = await env.ASSETS.fetch(request);
  if (response.status !== 404) return response;

  const url = new URL(request.url);
  if (url.pathname.endsWith("/")) return env.ASSETS.fetch(new Request(`${url.origin}/blog.html${url.search}`, request));
  return env.ASSETS.fetch(new Request(`${url.origin}${url.pathname}.html${url.search}`, request));
}

function renderDiscoveryLinks(posts) {
  const items = posts.map((post) => {
    const href = `${SITE_URL}/blog/${encodeURIComponent(String(post.slug || ""))}`;
    const title = escapeHtml(post.title || post.slug || "계산 가이드");
    const excerpt = escapeHtml(post.excerpt || "계산 기준과 결과 해석을 함께 확인하는 가이드입니다.");
    return `<li><a href="${href}"><strong>${title}</strong><span>${excerpt}</span></a></li>`;
  }).join("");

  return `<!-- d1-blog-discovery --><section aria-labelledby="latest-d1-blog" style="max-width:72rem;margin:2rem auto;padding:0 1rem"><h2 id="latest-d1-blog">최근 계산 가이드</h2><ul>${items}</ul></section>`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
