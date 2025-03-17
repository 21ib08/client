"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Link as NextLink } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback, memo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Room } from "@/data/rooms";
import { useTranslations } from "next-intl";
import { getHomeCarouselImages, getRooms } from "@/database/supabase";
import Icon from "@/components/ui/icon";
import Map from "@/components/Map";
import { staticConfig } from "@/data/staticConfig";

const HeroImage = memo(
  ({
    image,
    isActive,
    index,
  }: {
    image: string;
    isActive: boolean;
    index: number;
  }) => (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: isActive ? 1 : 0,
        zIndex: isActive ? 10 : 0,
        transition: "opacity 1500ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <Image
        src={image}
        alt={`Hotel view ${index + 1}`}
        fill
        className="object-cover"
        priority={index === 0}
        sizes="100vw"
        quality={90}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
    </div>
  )
);
HeroImage.displayName = "HeroImage";

const RoomCard = memo(
  ({
    room,
    t,
    index,
  }: {
    room: Room;
    t: ReturnType<typeof useTranslations>;
    index: number;
  }) => (
    <Card className="overflow-hidden hover:shadow-custom-xl dark:shadow-custom-sm dark:hover:shadow-glow transition-all duration-300 ease-in-out dark:bg-card/95 backdrop-blur-sm h-full">
      <div className="relative aspect-[4/3] overflow-hidden group">
        <Image
          src={room.image_urls[0] || "/placeholder.jpg"}
          alt={room.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          loading={index < 2 ? "eager" : "lazy"}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <Badge className="absolute top-4 right-4 z-10">
          {t("from")} {room.price}Kč/{t("night")}
        </Badge>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-heading mb-4">{room.name}</h3>
        <p className="text-muted-foreground mb-4">{room.description}</p>
        {room.amenities && room.amenities.length > 0 && (
          <ul className="space-y-2 font-body">
            {room.amenities.map((amenity, index) => {
              return (
                <li
                  key={index}
                  className="flex items-center text-muted-foreground"
                >
                  <Icon
                    name={amenity.icon}
                    className="w-4 h-4 mr-2 text-primary"
                  />
                  {amenity.name}
                </li>
              );
            })}
          </ul>
        )}
        <NextLink
          href={{
            pathname: "/booking/[name]",
            params: { name: room.name.replace(/\s+/g, "-") },
          }}
        >
          <Button className="w-full mt-6 font-body">{t("details")}</Button>
        </NextLink>
      </div>
    </Card>
  )
);
RoomCard.displayName = "RoomCard";

export default function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const t = useTranslations("home");

  // Use hardcoded images to prevent blinking
  const [images, setImages] = useState<string[]>([
    "/images/hero1.jpg",
    "/images/hero2.jpg",
    "/images/hero3.jpg",
  ]);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        // Load rooms from database
        const roomsData = await getRooms();
        setRooms(roomsData);

        // Optionally load images in the background, but don't show loading state
        const carouselImages = await getHomeCarouselImages();
        if (carouselImages.length > 0) {
          setImages(carouselImages);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [currentImageIndex, images.length]);

  const handleSlideChange = useCallback((index: number) => {
    setCurrentImageIndex(index);
  }, []);

  // Use the static resort location
  const resortLocation = staticConfig.resortLocation;

  return (
    <>
      {/* Hero Section */}
      <section className="relative flex items-center justify-center bg-background text-foreground overflow-hidden min-h-[calc(100vh-4rem)]">
        <div className="absolute inset-0">
          {images.map((image, index) => (
            <HeroImage
              key={`hero-image-${index}`}
              image={image}
              isActive={currentImageIndex === index}
              index={index}
            />
          ))}
        </div>
        <div className="relative z-10 text-center text-white space-y-8 max-w-3xl mx-auto px-4">
          <span className="inline-block text-sm uppercase tracking-[0.2em] font-light bg-white/10 px-4 py-2 rounded-full">
            {t("subtitle")}
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight leading-tight">
            {t("title")}
          </h1>
          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              className="group relative overflow-hidden text-lg px-8 py-6 font-body"
              asChild
            >
              <NextLink
                href="/booking"
                className="flex items-center gap-2"
                prefetch
              >
                {t("booking-button")}
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </NextLink>
            </Button>
          </div>
        </div>
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                currentImageIndex === index
                  ? "w-12 bg-white"
                  : "w-3 bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Rooms Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading mb-4">
              {t("accommodations")}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-body">
              {t("accommodations-deb")}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {rooms.map((room, index) => (
              <div
                key={index}
                className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)]"
              >
                <RoomCard room={room} t={t} index={index} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section with Simplified UI */}
      <section className="pt-12 md:pt-24 pb-24 bg-background relative">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading mb-4">{t("location")}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-body">
              {t("location-desc")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
            {/* Map on the left (or top on mobile) */}
            <div className="lg:col-span-3 h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-md order-2 lg:order-1">
              <Map
                posix={resortLocation}
                zoom={15}
                title="Bio Kolna Resort - Jičín"
              />
            </div>

            {/* Info card on the right (or bottom on mobile) */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <div className="bg-card/80 backdrop-blur-sm p-8 rounded-lg shadow-md h-full flex flex-col justify-center">
                <div className="space-y-8">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-lg mb-1">
                        {t("address")}
                      </h4>
                      <p className="text-muted-foreground">
                        {t("address-line1")}
                        <br />
                        {t("address-line2")}
                        <br />
                        {t("address-line3")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-lg mb-1">
                        {t("contact-info")}
                      </h4>
                      <p className="text-muted-foreground">
                        {t("phone")}:{" "}
                        <a
                          href="tel:+420493545111"
                          className="hover:text-primary transition-colors"
                        >
                          +420 493 545 111
                        </a>
                        <br />
                        {t("email")}:{" "}
                        <a
                          href="mailto:info@apartmá.cz"
                          className="hover:text-primary transition-colors"
                        >
                          info@apartmá.cz
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-lg mb-1">
                        {t("opening-hours")}
                      </h4>
                      <div className="grid grid-cols-2 gap-x-4 text-muted-foreground">
                        <div>{t("reception")}:</div>
                        <div>8:00 - 22:00</div>
                        <div>{t("restaurant")}:</div>
                        <div>7:00 - 21:00</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
