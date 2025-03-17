"use client";

import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Twitter,
  Facebook,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: "https://facebook.com",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://instagram.com",
    },
    { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
  ];

  const contactInfo = {
    address: t("address-line1") + ", " + t("address-line3"),
    phone: "+420 493 545 111",
    email: "info@apartmá.cz",
  };

  return (
    <footer className="w-full bg-card border-t">
      <div className="max-w-7xl mx-auto px-6">
        <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <div>
              <h3 className="font-heading text-xl text-foreground mb-3">
                {t("hotel-name")}
              </h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">
                {t("description")}
              </p>
            </div>

            <div className="pt-2">
              <p className="text-sm font-medium text-foreground mb-3">
                {t("follow-us")}
              </p>
              <div className="flex items-center gap-6">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <social.icon className="w-5 h-5" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-lg text-foreground mb-6">
              {t("contact")}
            </h4>
            <ul className="space-y-4 font-body">
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{contactInfo.address}</span>
              </li>
              <li>
                <Link
                  href={`tel:${contactInfo.phone}`}
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  {t("phone")}: {contactInfo.phone}
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  {t("email")}: {contactInfo.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-lg text-foreground mb-6">
              {t("operating-hours")}
            </h4>
            <ul className="space-y-3 font-body">
              <li className="flex justify-between text-muted-foreground">
                <span>{t("check-in")}</span>
                <span>15:00</span>
              </li>
              <li className="flex justify-between text-muted-foreground">
                <span>{t("check-out")}</span>
                <span>11:00</span>
              </li>
              <li className="flex justify-between text-muted-foreground">
                <span>{t("front-desk")}</span>
                <span>24/7</span>
              </li>
              <li className="flex justify-between text-muted-foreground">
                <span>{t("room-service")}</span>
                <span>24/7</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t py-6">
          <div className="flex justify-center items-center text-sm text-muted-foreground font-body">
            <p>
              © {currentYear} {t("hotel-name")}. {t("all-rights-reserved")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
