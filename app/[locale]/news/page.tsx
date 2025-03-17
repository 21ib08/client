"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { HeroSection } from "@/components/HeroSection";
import { useState, useEffect } from "react";
import { getSingleImageFromFolder } from "@/database/supabase";

const events = [
  {
    id: 1,
    title: "Hudební festival",
    date: "15. června 2023",
    description:
      "Připojte se k nám na den plný hudby a zábavy na každoročním hudebním festivalu.",
    image: "/images/music-festival.jpg",
  },
  {
    id: 2,
    title: "Umělecká výstava",
    date: "20. července 2023",
    description:
      "Prozkoumejte nejnovější díla místních umělců na naší umělecké výstavě.",
    image: "/images/art-exhibition.jpg",
  },
  {
    id: 3,
    title: "Gastronomický veletrh",
    date: "10. srpna 2023",
    description:
      "Ochutnejte lahodné pokrmy z celého světa na našem gastronomickém veletrhu.",
    image: "/images/food-fair.jpg",
  },
  {
    id: 4,
    title: "Technologická konference",
    date: "5. září 2023",
    description:
      "Seznamte se s nejnovějšími trendy v technologiích na naší technologické konferenci.",
    image: "/images/tech-conference.jpg",
  },
];

export default function EventsPage() {
  const [heroImage, setHeroImage] = useState<string | null>(null);

  // Fetch hero image from Supabase
  useEffect(() => {
    async function fetchHeroImage() {
      try {
        const image = await getSingleImageFromFolder("news");
        if (image) {
          setHeroImage(image);
        }
      } catch (error) {
        console.error("Failed to fetch news hero image:", error);
      }
    }

    fetchHeroImage();
  }, []);

  return (
    <>
      <HeroSection
        title="Objevte nadcházející události"
        subtitle="Připojte se k nám pro vzrušující zážitky a nezapomenutelné okamžiky!"
        backgroundImage={heroImage}
      />

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading mb-4">
              Nadcházející události
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-body">
              Objevte vzrušující události, které se brzy uskuteční!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <Card
                key={event.id}
                className="group p-6 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
              >
                <div className="relative mb-4">
                  <Image
                    src={event.image}
                    alt={event.title}
                    width={500}
                    height={300}
                    className="w-full h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-xl font-heading mb-2 text-foreground">
                  {event.title}
                </h3>
                <p className="text-muted-foreground font-body mb-2">
                  {event.date}
                </p>
                <p className="text-muted-foreground font-body mb-4">
                  {event.description}
                </p>
                <Button className="w-full mt-4 font-body bg-primary">
                  Zobrazit detaily
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
