import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: "/",
      },
      {
        userAgent: "Bingbot",
        disallow: "/",
      },
      {
        userAgent: "Applebot",
        disallow: "/",
      },
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "http://localhost:3000/sitemap.xml",
    host: "http://localhost:3000",
  };
}
