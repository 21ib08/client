"use client";
import { HeroSection } from "@/components/HeroSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import {
  BedDouble,
  Users,
  Maximize,
  Eye,
  Check,
  Clock,
  CalendarCheck,
  CreditCard,
  CigaretteOff,
  Dog,
  Baby,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { getSingleImageFromFolder, getRooms } from "@/database/supabase";
import Icon from "@/components/ui/icon";

// Update the Room interface to match your database structure
interface Room {
  id: number;
  name: string;
  type: string;
  price: number;
  image_urls: string[]; // Array of image URLs
  capacity: number;
  amenities: Array<{
    icon: string; // This will be the name of the Lucide icon
    name: string;
  }>;
  description: string;
  // These fields aren't in your DB, so we'll need to handle them differently
  bedType?: string;
  size?: string;
  view?: string;
  features?: string[];
}

export default function Booking() {
  const t = useTranslations("booking");
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Define FAQs with translations
  const faqs = [
    {
      question: t("faq.check-in-times.question"),
      answer: t("faq.check-in-times.answer"),
    },
    {
      question: t("faq.breakfast.question"),
      answer: t("faq.breakfast.answer"),
    },
    {
      question: t("faq.cancellation.question"),
      answer: t("faq.cancellation.answer"),
    },
  ];

  // Define amenities with translations
  const amenities = [
    {
      name: t("amenities.panoramic-views.name"),
      description: t("amenities.panoramic-views.description"),
      icon: <Icon name="Mountain" className="w-6 h-6 text-primary" />,
    },
    {
      name: t("amenities.eco-friendly.name"),
      description: t("amenities.eco-friendly.description"),
      icon: <Icon name="Leaf" className="w-6 h-6 text-primary" />,
    },
    {
      name: t("amenities.local-wines.name"),
      description: t("amenities.local-wines.description"),
      icon: <Icon name="Wine" className="w-6 h-6 text-primary" />,
    },
    {
      name: t("amenities.wifi.name"),
      description: t("amenities.wifi.description"),
      icon: <Icon name="Wifi" className="w-6 h-6 text-primary" />,
    },
    {
      name: t("amenities.breakfast.name"),
      description: t("amenities.breakfast.description"),
      icon: <Icon name="UtensilsCrossed" className="w-6 h-6 text-primary" />,
    },
    {
      name: t("amenities.welcome-treats.name"),
      description: t("amenities.welcome-treats.description"),
      icon: <Icon name="Utensils" className="w-6 h-6 text-primary" />,
    },
    {
      name: t("amenities.grill.name"),
      description: t("amenities.grill.description"),
      icon: <Icon name="Flame" className="w-6 h-6 text-primary" />,
    },
    {
      name: t("amenities.hiking.name"),
      description: t("amenities.hiking.description"),
      icon: <Icon name="MapPin" className="w-6 h-6 text-primary" />,
    },
    {
      name: t("amenities.golf.name"),
      description: t("amenities.golf.description"),
      icon: <Icon name="Flag" className="w-6 h-6 text-primary" />,
    },
    {
      name: t("amenities.swimming.name"),
      description: t("amenities.swimming.description"),
      icon: <Icon name="Waves" className="w-6 h-6 text-primary" />,
    },
  ];

  // Define policies with translations
  const policies = [
    {
      title: t("policies.check-in.title"),
      description: t("policies.check-in.description"),
      icon: <Clock className="w-6 h-6 text-primary" />,
    },
    {
      title: t("policies.cancellation.title"),
      description: t("policies.cancellation.description"),
      icon: <CalendarCheck className="w-6 h-6 text-primary" />,
    },
    {
      title: t("policies.payment.title"),
      description: t("policies.payment.description"),
      icon: <CreditCard className="w-6 h-6 text-primary" />,
    },
    {
      title: t("policies.smoking.title"),
      description: t("policies.smoking.description"),
      icon: <CigaretteOff className="w-6 h-6 text-primary" />,
    },
    {
      title: t("policies.pets.title"),
      description: t("policies.pets.description"),
      icon: <Dog className="w-6 h-6 text-primary" />,
    },
    {
      title: t("policies.children.title"),
      description: t("policies.children.description"),
      icon: <Baby className="w-6 h-6 text-primary" />,
    },
  ];

  // Fetch a hero image from Supabase for the booking page
  useEffect(() => {
    async function fetchHeroImage() {
      try {
        // Get the image from the 'booking' folder
        const image = await getSingleImageFromFolder("booking");
        if (image) {
          setHeroImage(image);
        }
      } catch (error) {
        console.error("Failed to fetch hero image:", error);
      }
    }

    fetchHeroImage();
  }, []);

  // Fetch rooms from Supabase
  useEffect(() => {
    async function fetchRooms() {
      setIsLoading(true);
      try {
        const roomsData = await getRooms();
        setRooms(roomsData);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRooms();
  }, []);

  return (
    <>
      <HeroSection
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        height="medium"
        backgroundImage={heroImage}
      />

      <section className="w-full bg-background pt-12 pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-heading text-foreground mb-4">
              {t("available-rooms")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-body">
              {t("choose-from")}
            </p>
          </div>
        </div>
      </section>
      <section className="w-full bg-background">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-heading text-foreground mb-2">
                {t("no-rooms-available")}
              </h3>
              <p className="text-muted-foreground">{t("check-back-later")}</p>
            </div>
          ) : (
            <div className="space-y-8">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="w-full bg-card rounded-xl overflow-hidden border
                  shadow-custom-sm hover:shadow-custom-xl
                  dark:shadow-custom-sm dark:hover:shadow-glow
                  transition-all duration-300 ease-in-out
                  dark:bg-card/95"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="relative h-72 overflow-hidden group">
                      {room.image_urls && room.image_urls.length > 0 ? (
                        <Image
                          width={1200}
                          height={800}
                          src={room.image_urls[0]}
                          alt={room.name}
                          className="absolute inset-0 w-full h-full object-cover
                          group-hover:scale-105 transition-transform duration-500"
                          priority
                          quality={95}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        // Fallback when no image is available
                        <div className="absolute inset-0 w-full h-full bg-slate-200 flex items-center justify-center">
                          <BedDouble className="w-16 h-16 text-slate-400" />
                        </div>
                      )}
                      <Badge
                        className="absolute top-4 right-4 bg-background/95 
                        text-foreground font-body backdrop-blur-sm
                        shadow-custom-sm"
                      >
                        {t("from")} {room.price} Kč/{t("night")}
                      </Badge>
                    </div>

                    <div className="md:col-span-2 p-6 space-y-4">
                      <h3
                        className="text-2xl font-heading text-foreground 
                        hover:text-primary transition-colors duration-200"
                      >
                        {room.name}
                      </h3>

                      <div className="flex flex-wrap gap-4 font-body">
                        <div
                          key={`room-capacity-${room.id}`}
                          className="flex items-center gap-1.5 text-sm text-muted-foreground
                          hover:text-foreground transition-colors duration-200"
                        >
                          <Users className="w-4 h-4" />
                          {t("up-to")} {room.capacity} {t("guests")}
                        </div>

                        {room.type && (
                          <div
                            key={`room-type-${room.id}`}
                            className="flex items-center gap-1.5 text-sm text-muted-foreground
                            hover:text-foreground transition-colors duration-200"
                          >
                            <BedDouble className="w-4 h-4" />
                            {room.type}
                          </div>
                        )}

                        {room.size && (
                          <div
                            key={`room-size-${room.id}`}
                            className="flex items-center gap-1.5 text-sm text-muted-foreground
                            hover:text-foreground transition-colors duration-200"
                          >
                            <Maximize className="w-4 h-4" />
                            {room.size}
                          </div>
                        )}

                        {room.view && (
                          <div
                            key={`room-view-${room.id}`}
                            className="flex items-center gap-1.5 text-sm text-muted-foreground
                            hover:text-foreground transition-colors duration-200"
                          >
                            <Eye className="w-4 h-4" />
                            {room.view}
                          </div>
                        )}
                      </div>

                      <p className="text-muted-foreground font-body leading-relaxed">
                        {room.description}
                      </p>

                      <div className="grid grid-cols-2 gap-3">
                        {room.amenities && room.amenities.length > 0 ? (
                          room.amenities.map((amenity, index) => {
                            // Handle both string and object formats
                            if (typeof amenity === "string") {
                              return (
                                <div
                                  key={`amenity-${room.id}-${index}`}
                                  className="flex items-center gap-2 text-sm text-muted-foreground font-body
                                  hover:text-foreground transition-colors duration-200"
                                >
                                  <Check className="w-4 h-4 text-primary" />
                                  {amenity}
                                </div>
                              );
                            }

                            return (
                              <div
                                key={`amenity-${room.id}-${index}`}
                                className="flex items-center gap-2 text-sm text-muted-foreground font-body
                                hover:text-foreground transition-colors duration-200"
                              >
                                <Icon
                                  name={amenity.icon || "Check"}
                                  className="w-4 h-4 text-primary"
                                />
                                {amenity.name}
                              </div>
                            );
                          })
                        ) : (
                          <div className="col-span-2 text-sm text-muted-foreground">
                            {t("amenities-not-available")}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t mt-6">
                        <div className="font-heading text-foreground text-lg">
                          {room.price} Kč &nbsp;
                          <span className="text-sm text-muted-foreground font-body">
                            {t("per-night")}
                          </span>
                        </div>
                        <Link
                          href={{
                            pathname: `/booking/[name]`,
                            params: {
                              name: room.name.replace(/\s+/g, "-"),
                            },
                          }}
                        >
                          <Button
                            className="font-body hover:shadow-custom-md 
                            transition-all duration-300"
                          >
                            {t("book-now")}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="w-full bg-background py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading text-foreground mb-4">
              {t("hotel-amenities")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-body">
              {t("experience-luxury")}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {amenities.map((amenity) => (
              <div
                key={amenity.name}
                className="group bg-card rounded-xl p-6 text-center 
                border backdrop-blur-sm
                shadow-custom-sm hover:shadow-custom-xl
                dark:shadow-custom-sm dark:hover:shadow-glow
                transition-all duration-300 ease-in-out
                hover:-translate-y-1 hover:bg-card/95
                dark:bg-card/95"
              >
                <div
                  className="h-12 w-12 rounded-full 
                  bg-primary/10 flex items-center justify-center 
                  mb-4 mx-auto 
                  group-hover:bg-primary/20 group-hover:scale-110
                  transition-all duration-300 ease-in-out
                  shadow-custom-sm"
                >
                  {amenity.icon}
                </div>
                <h3
                  className="font-heading text-lg text-foreground mb-2
                group-hover:text-primary transition-colors duration-300"
                >
                  {amenity.name}
                </h3>
                <p
                  className="text-sm text-muted-foreground font-body
                group-hover:text-foreground transition-colors duration-300"
                >
                  {amenity.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="w-full bg-background py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading text-foreground mb-4">
              {t("hotel-policies")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-body">
              {t("important-information")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {policies.map((policy) => (
              <Card
                key={policy.title}
                className="group bg-card p-6 
                backdrop-blur-sm
                shadow-custom-sm hover:shadow-custom-xl
                dark:shadow-custom-sm dark:hover:shadow-glow
                transition-all duration-300 ease-in-out
                hover:-translate-y-1 hover:bg-card/95
                dark:bg-card/95"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="h-12 w-12 rounded-full 
                    bg-primary/10 flex items-center justify-center shrink-0
                    group-hover:bg-primary/20 group-hover:scale-110
                    transition-all duration-300 ease-in-out
                    shadow-custom-sm"
                  >
                    {policy.icon}
                  </div>
                  <div>
                    <h3
                      className="text-lg font-heading text-foreground mb-2
                      group-hover:text-primary transition-colors duration-300"
                    >
                      {policy.title}
                    </h3>
                    <p
                      className="text-sm text-muted-foreground font-body
                      group-hover:text-foreground transition-colors duration-300"
                    >
                      {policy.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="w-full bg-background py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading text-foreground mb-4">
              {t("frequently-asked-questions")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-body">
              {t("find-answers")}
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question}>
                <AccordionTrigger className="font-heading text-foreground">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="font-body text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  );
}
