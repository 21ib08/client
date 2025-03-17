"use client";
import { HeroSection } from "@/components/HeroSection";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Mail,
  MessageSquare,
  ClipboardList,
  MapPin,
  Phone,
  Loader2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { getSingleImageFromFolder } from "@/database/supabase";
import { staticConfig } from "@/data/staticConfig";

export default function ContactPage() {
  const t = useTranslations("contact");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    type: "",
    message: "",
  });
  const supabase = createClientComponentClient();

  // Define contact info directly here - NOT using translations
  const contactInfo = [
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Find Us Here",
      content: ["123 Luxury Avenue", "Paradise City, PC 12345"],
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Call Us",
      content: [
        "Front Desk: +1 (234) 567-8900",
        "Reservations: +1 (234) 567-8901",
      ],
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Write to Us",
      content: ["reservations@luxuryhotel.com", "concierge@luxuryhotel.com"],
    },
  ];

  // Use the resort location from staticConfig
  const resortLocation = staticConfig.resortLocation;

  useEffect(() => {
    async function fetchHeroImage() {
      try {
        const image = await getSingleImageFromFolder("contact");
        if (image) {
          setHeroImage(image);
        }
      } catch (error) {
        console.error("Failed to fetch contact hero image:", error);
      }
    }

    fetchHeroImage();
  }, []);

  const getTranslation = (key: string, fallback: string) => {
    try {
      return t(key);
    } catch {
      return fallback;
    }
  };

  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/Map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  const inquiryTypes = [
    {
      value: "rezervace",
      label: getTranslation("reservation-inquiry", "Reservation Inquiry"),
    },
    {
      value: "special",
      label: getTranslation("special-arrangements", "Special Arrangements"),
    },
    {
      value: "sluzby",
      label: getTranslation("hotel-services", "Hotel Services"),
    },
    {
      value: "vazba",
      label: getTranslation("guest-feedback", "Guest Feedback"),
    },
    {
      value: "ostatni",
      label: getTranslation("other-matters", "Other Matters"),
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.message || !formData.type) {
      toast.error(
        getTranslation(
          "error-required-fields",
          "Please fill in all required fields"
        )
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("inquiries").insert([
        {
          email: formData.email,
          message: formData.message,
          type: formData.type,
          firstName: formData.firstName,
          lastName: formData.lastName,
          created_at: new Date().toISOString().split("T")[0],
        },
      ]);

      if (error) {
        throw error;
      }

      toast.success(getTranslation("success-title", "Message Sent"), {
        description: getTranslation(
          "success-message",
          "Thank you for your inquiry. We'll get back to you soon!"
        ),
      });

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        type: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(getTranslation("error-title", "Error"), {
        description: getTranslation(
          "error-message",
          "There was a problem sending your message. Please try again."
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <HeroSection
        title={getTranslation("title", "Get in Touch")}
        subtitle={getTranslation(
          "subtitle",
          "We're here to help with any questions you might have"
        )}
        backgroundImage={heroImage}
      />

      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-card rounded-lg shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6">
              {getTranslation("ready-to-connect", "Ready to Connect?")}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <label htmlFor="firstName" className="text-sm font-medium">
                      {getTranslation("first-name", "First Name")}
                    </label>
                  </div>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder={getTranslation("first-name", "First Name")}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <label htmlFor="lastName" className="text-sm font-medium">
                      {getTranslation("last-name", "Last Name")}
                    </label>
                  </div>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder={getTranslation("last-name", "Last Name")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <label htmlFor="email" className="text-sm font-medium">
                    {getTranslation("email", "Email")} *
                  </label>
                </div>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={getTranslation("email", "Email")}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <ClipboardList className="w-4 h-4 text-muted-foreground" />
                  <label htmlFor="type" className="text-sm font-medium">
                    {getTranslation("nature-of-inquiry", "Nature of Inquiry")} *
                  </label>
                </div>
                <Select
                  value={formData.type}
                  onValueChange={handleSelectChange}
                  required
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={getTranslation(
                        "select-inquiry",
                        "Select Inquiry Type"
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {inquiryTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <label htmlFor="message" className="text-sm font-medium">
                    {getTranslation("your-message", "Your Message")} *
                  </label>
                </div>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={getTranslation(
                    "message-placeholder",
                    "How can we help you?"
                  )}
                  rows={5}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {getTranslation("sending", "Sending...")}
                  </>
                ) : (
                  getTranslation("send-inquiry", "Send Inquiry")
                )}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">
                {getTranslation("contact-info.find-us", "Find Us Here")}
              </h2>
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full text-primary">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <div className="text-muted-foreground mt-1 space-y-1">
                        {item.content.map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="h-[300px] rounded-lg overflow-hidden border">
              <Map
                posix={resortLocation}
                zoom={15}
                title="Bio Kolna Resort - Jičín"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
