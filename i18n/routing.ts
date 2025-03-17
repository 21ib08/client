import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en", "cz"],

  defaultLocale: "cz",
  pathnames: {
    "/": "/",
    "/booking": {
      cz: "/rezervace",
      en: "/booking",
    },
    "/contact": {
      cz: "/kontakt",
      en: "/contact",
    },
    "/booking/[name]": {
      cz: "/rezervace/[name]",
      en: "/booking/[name]",
    },
    "/booking/checkout": {
      cz: "/rezervace/pokladna",
      en: "/booking/checkout",
    },
    "/news": {
      cz: "/aktuality",
      en: "/news",
    },
    "/surroundings": {
      cz: "/okolí",
      en: "/surroundings",
    },
  },
});

export type Locale = (typeof routing.locales)[number];
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
