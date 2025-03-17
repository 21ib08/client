"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  backgroundImage?: string | null;
  backgroundColor?: string;
  height?: "small" | "medium" | "large";
  eyebrow?: string;
}

export function HeroSection({
  title,
  subtitle,
  backgroundImage,
  backgroundColor = "bg-gradient-to-t from-slate-50 to-slate-900",
  height = "medium",
  eyebrow,
}: HeroSectionProps) {
  const heights = {
    small: "h-[60vh]",
    medium: "h-[80vh]",
    large: "h-[100vh]",
  };

  return (
    <section
      className={cn(
        "relative flex items-center justify-center text-foreground overflow-hidden",
        heights[height],
        !backgroundImage ? backgroundColor : "bg-background"
      )}
    >
      {backgroundImage && (
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50/50 to-slate-900/90" />
        </div>
      )}
      <div className="relative text-center text-white space-y-6 max-w-3xl mx-auto px-4 z-10">
        {eyebrow && (
          <span className="inline-block text-sm uppercase tracking-[0.2em] font-light bg-white/10 px-4 py-2 rounded-full">
            {eyebrow}
          </span>
        )}
        <h1 className="text-4xl md:text-6xl font-heading font-bold">{title}</h1>
        <p className="text-lg md:text-xl font-body text-white/90">{subtitle}</p>
      </div>
    </section>
  );
}
