"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/HeroSection";
import { useState, useEffect } from "react";
import { getSingleImageFromFolder } from "@/database/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";

// Extended data with more information for the dialog
const surroundings = [
  {
    id: 1,
    title: "Hrubá Skála Castle",
    description:
      "Explore the stunning castle perched on a rock formation with breathtaking views.",
    image:
      "https://safcehsuzmgqtbrcwuxm.supabase.co/storage/v1/object/public/images/surroundings_imgs/zamek-hruba-skala-wiki.jpg",
    fullDescription: `Hrubá Skála Castle is one of the most picturesque castles in the Czech Republic. 
    Originally built in the 14th century, it sits dramatically atop sandstone rock formations.
    
    The castle has been rebuilt several times throughout history and now serves as a luxury hotel. 
    Visitors can explore the castle grounds, enjoy panoramic views of the surrounding landscape, 
    and hike through the adjacent rock formations.
    
    Distance from resort: 15 km
    Opening hours: 9:00 - 17:00 (April to October)`,
    location: "Hrubá Skála, 511 01 Turnov",
    website:
      "https://www.cesky-raj.info/en/tourist-destinations/hruba-skala-chateau/",
  },
  {
    id: 2,
    title: "Prachov Rocks",
    description:
      "Hike through unique sandstone formations and enjoy scenic trails.",
    image:
      "https://safcehsuzmgqtbrcwuxm.supabase.co/storage/v1/object/public/images/surroundings_imgs/088be744-be54-4d91-9d9a-2a93a666dc09.webp",
    fullDescription: `The Prachov Rocks (Prachovské skály) are a protected natural rock formation and one of the most popular destinations in Bohemian Paradise.
    
    This stunning rock city features towering sandstone formations, narrow passages, and viewpoints offering breathtaking panoramas. The area has over 400 individual rock towers, some reaching heights of 40 meters.
    
    Visitors can explore well-marked hiking trails of varying difficulty, making it perfect for both casual walkers and experienced hikers.
    
    Distance from resort: 10 km
    Opening hours: Open year-round, 8:00 - 18:00 (summer), 8:00 - 16:00 (winter)`,
    location: "Prachov 37, 506 01 Jičín",
    website: "https://www.prachovskeskaly.com/en/",
  },
  {
    id: 3,
    title: "Turnov",
    description:
      "Visit the charming town known for its glassmaking and historical sites.",
    image:
      "https://safcehsuzmgqtbrcwuxm.supabase.co/storage/v1/object/public/images/surroundings_imgs/8051e672-8cbb-4579-b5fc-73df0be5661f.webp",
    fullDescription: `Turnov is a historic town located in the heart of Bohemian Paradise, known as the center of gemstone cutting and jewelry making in the Czech Republic.
    
    The town features a charming historic center with Renaissance and Baroque buildings. Visitors can explore the Museum of Bohemian Paradise, which houses an impressive collection of gemstones and jewelry.
    
    Don't miss the Synagogue, St. Nicholas Church, and the beautiful town square. Turnov is also an excellent base for exploring the surrounding natural attractions.
    
    Distance from resort: 20 km
    Main attractions: Museum of Bohemian Paradise, Dlaskův statek (folk architecture)`,
    location: "Turnov, 511 01",
    website: "https://www.turnov.cz/en/",
  },
  {
    id: 4,
    title: "Valdštejn Castle",
    description:
      "Discover the ruins of this medieval castle with panoramic views of the countryside.",
    image:
      "https://safcehsuzmgqtbrcwuxm.supabase.co/storage/v1/object/public/images/surroundings_imgs/4366559a-22a1-4a1c-bc76-9734d77997e5.webp",
    fullDescription: `Valdštejn Castle is the oldest castle in the Bohemian Paradise region, founded in the 13th century by the Markvartic family.
    
    The castle is built on sandstone rocks and connected by a stone bridge with statues of saints. Inside, visitors can explore the chapel of St. John of Nepomuk, the Classical House, and enjoy magnificent views of the surrounding landscape.
    
    The castle hosts various cultural events, medieval festivals, and exhibitions throughout the year.
    
    Distance from resort: 18 km
    Opening hours: 9:00 - 17:00 (April to October)`,
    location: "Turnov - Pelešany, 511 01",
    website: "https://www.hrad-valdstejn.cz/en",
  },
  {
    id: 5,
    title: "Jičín Castle",
    description:
      "Explore the historic castle in Jičín, known for its beautiful architecture and gardens.",
    image:
      "https://safcehsuzmgqtbrcwuxm.supabase.co/storage/v1/object/public/images/surroundings_imgs/c1a67d97-6482-4fcc-b9ac-555d3cacca82.webp",
    fullDescription: `Jičín Castle, located in the heart of Jičín town, was built in the early 17th century by Albrecht von Wallenstein, a famous military commander.
    
    The castle features beautiful Renaissance and Baroque architecture. Today, it houses the Regional Museum and Gallery of Jičín, which showcases the history of the region and art exhibitions.
    
    The castle is connected to the main square by a covered arcade, and nearby you can find the beautiful Wallenstein Loggia and gardens.
    
    Distance from resort: 2 km
    Opening hours: 9:00 - 17:00 (Tuesday to Sunday)`,
    location: "Valdštejnovo náměstí 1, 506 01 Jičín",
    website: "https://www.jicin.org/zamek-jicin",
  },
  {
    id: 6,
    title: "Fairytale Town of Jičín",
    description:
      "Discover the charming town of Jičín, famous for its fairy tale connections and beautiful square.",
    image:
      "https://safcehsuzmgqtbrcwuxm.supabase.co/storage/v1/object/public/images/surroundings_imgs/692d5d0e-2ef1-417a-a644-573cdb16817a.jpg",
    fullDescription: `Jičín is known as the "Fairytale Town" due to its connection with the famous Czech fairy tale character Rumcajs, created by writer Václav Čtvrtek.
    
    The town features a beautiful main square with colorful Renaissance and Baroque houses, dominated by the Valdice Gate tower. Visitors can climb the tower for panoramic views of the town and surrounding countryside.
    
    Every September, Jičín hosts the popular "Jičín - Town of Fairy Tales" festival, attracting thousands of visitors with performances, workshops, and fairy tale characters.
    
    Distance from resort: 1 km
    Main attractions: Valdice Gate, Wallenstein Square, St. James Church`,
    location: "Jičín, 506 01",
    website: "https://www.jicin.org/en",
  },
];

export default function SurroundingsPage() {
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<
    (typeof surroundings)[0] | null
  >(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const t = useTranslations("surroundings");

  // Translate surroundings data based on current locale
  const translatedSurroundings = surroundings.map((place) => ({
    ...place,
    title: t(`places.${place.id}.title`, { fallback: place.title }),
    description: t(`places.${place.id}.description`, {
      fallback: place.description,
    }),
    fullDescription: t(`places.${place.id}.fullDescription`, {
      fallback: place.fullDescription,
    }),
    location: t(`places.${place.id}.location`, { fallback: place.location }),
  }));

  // Fetch hero image from Supabase
  useEffect(() => {
    async function fetchHeroImage() {
      try {
        const image = await getSingleImageFromFolder("surroundings");
        if (image) {
          setHeroImage(image);
        }
      } catch (error) {
        console.error("Failed to fetch surroundings hero image:", error);
      }
    }

    fetchHeroImage();
  }, []);

  const handleOpenDialog = (place: (typeof surroundings)[0]) => {
    setSelectedPlace(place);
    setIsDialogOpen(true);
  };

  return (
    <>
      <HeroSection
        title={t("hero-title")}
        subtitle={t("hero-subtitle")}
        backgroundImage={heroImage}
      />

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading mb-4">
              {t("attractions-title")}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-body">
              {t("attractions-subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {translatedSurroundings.map((place) => (
              <Card
                key={place.id}
                className="group p-6 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
              >
                <div className="relative mb-4 overflow-hidden rounded-lg">
                  <Image
                    src={place.image}
                    alt={place.title}
                    width={500}
                    height={300}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-xl font-heading mb-2 text-primary">
                  {place.title}
                </h3>
                <p className="text-muted-foreground font-body mb-4 line-clamp-3">
                  {place.description}
                </p>
                <Button
                  className="w-full mt-4 font-body"
                  onClick={() => handleOpenDialog(place)}
                >
                  {t("more-info")}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Detail Dialog - Fixed to remove duplicate X */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading text-primary">
              {selectedPlace?.title}
            </DialogTitle>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>

          {selectedPlace && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image
                  src={selectedPlace.image}
                  alt={selectedPlace.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col">
                <DialogDescription className="text-foreground whitespace-pre-line mb-4">
                  {selectedPlace.fullDescription}
                </DialogDescription>

                <div className="mt-auto space-y-2 pt-4 border-t">
                  <p className="text-sm font-medium text-foreground">
                    {t("location")}:{" "}
                    <span className="text-muted-foreground">
                      {selectedPlace.location}
                    </span>
                  </p>
                  {selectedPlace.website && (
                    <p className="text-sm font-medium text-foreground">
                      {t("website")}:{" "}
                      <a
                        href={selectedPlace.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {t("visit-website")}
                      </a>
                    </p>
                  )}
                </div>

                <Button className="mt-6" onClick={() => setIsDialogOpen(false)}>
                  {t("close")}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
