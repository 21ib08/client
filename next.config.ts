import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    domains: ["safcehsuzmgqtbrcwuxm.supabase.co"],
  },
};

export default withNextIntl(nextConfig);
