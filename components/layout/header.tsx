"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Link } from "@/i18n/routing";
import { useState } from "react";
import LocaleSwitcher from "../LocaleSwitcher";
import { useTranslations } from "next-intl";

export default function Header() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("links");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur shadow-sm">
      <div className="w-full px-4 lg:px-6">
        <div className="flex h-16 justify-between items-center">
          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[80vw] max-w-[400px]">
                <nav className="flex flex-col gap-4 mt-6">
                  <Link
                    href="/news"
                    prefetch
                    className="text-lg font-medium px-2 py-1.5 rounded-md hover:text-primary transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {t("news")}
                  </Link>
                  <Link
                    href="/surroundings"
                    prefetch
                    className="text-lg font-medium px-2 py-1.5 rounded-md hover:text-primary transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {t("surroundings")}
                  </Link>
                  <Link
                    href="/contact"
                    prefetch
                    className="text-lg font-medium px-2 py-1.5 rounded-md hover:text-primary transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {t("contact")}
                  </Link>
                  <Link
                    href="/booking"
                    prefetch
                    className="text-lg font-medium px-2 py-1.5 rounded-md hover:text-primary transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {t("booking")}
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" prefetch>
            <h1 className="text-xl font-bold text-primary whitespace-nowrap">
              Logo
            </h1>
          </Link>

          {/* Desktop Navigation and Controls */}
          <div className="hidden lg:flex items-center gap-4 sm:gap-6">
            <nav className="flex items-center gap-1 sm:gap-2 md:gap-4">
              <Link
                href="/news"
                prefetch
                className="px-3 py-2 text-sm font-medium rounded-md hover:text-primary transition-colors"
              >
                {t("news")}
              </Link>
              <Link
                href="/surroundings"
                prefetch
                className="px-3 py-2 text-sm font-medium rounded-md hover:text-primary transition-colors"
              >
                {t("surroundings")}
              </Link>
              <Link
                href="/contact"
                prefetch
                className="px-3 py-2 text-sm font-medium rounded-md hover:text-primary transition-colors"
              >
                {t("contact")}
              </Link>
              <Link
                href="/booking"
                prefetch
                className="px-3 py-2 text-sm font-medium rounded-md hover:text-primary transition-colors"
              >
                {t("booking")}
              </Link>
            </nav>
            <ModeToggle />
            <LocaleSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
