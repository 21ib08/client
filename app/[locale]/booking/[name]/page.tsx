"use client";

import { use } from "react";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BedDouble, Check } from "lucide-react";
import { Link } from "@/i18n/routing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TooltipProvider } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { useState, useMemo, useEffect } from "react";
import ImageGallery from "../../../../components/ImageGallery";
import supabase from "@/database/supabase";
import { cs } from "date-fns/locale";
import { startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

interface Room {
  id: number;
  name: string;
  type: string;
  price: number;
  image_urls: string[];
  capacity: number;
  amenities: string[];
  description: string;
}

interface Reservation {
  id: number;
  room_id: number;
  first_name: string;
  sure_name: string;
  start_date: string;
  end_date: string;
  email: string;
}

const customDayNames = {
  short: ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"],
  long: ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"],
};

const customMonthNames = {
  short: [
    "Led",
    "Úno",
    "Bře",
    "Dub",
    "Kvě",
    "Čvn",
    "Čvc",
    "Srp",
    "Zář",
    "Říj",
    "Lis",
    "Pro",
  ],
  long: [
    "Leden",
    "Únor",
    "Březen",
    "Duben",
    "Květen",
    "Červen",
    "Červenec",
    "Srpen",
    "Září",
    "Říjen",
    "Listopad",
    "Prosinec",
  ],
};

const formatDate = (
  date: Date | undefined | null,
  formatStr: string
): string => {
  if (!date) return "-";

  try {
    const validDate = new Date(date);
    if (isNaN(validDate.getTime())) {
      throw new Error("Invalid date");
    }

    if (formatStr.includes("EEEE")) {
      const dayIndex = validDate.getDay();
      return formatStr.replace("EEEE", customDayNames.long[dayIndex]);
    }
    if (formatStr.includes("EEE")) {
      const dayIndex = validDate.getDay();
      return formatStr.replace("EEE", customDayNames.short[dayIndex]);
    }
    return format(validDate, formatStr, { locale: cs });
  } catch (error) {
    console.error("Error formatting date:", error);
    try {
      return date.toLocaleDateString("cs-CZ");
    } catch {
      return "Neplatné datum";
    }
  }
};

const RangeCalendar = ({
  month,
  startDate,
  endDate,
  onSelectStart,
  onSelectEnd,
  isReserved,
  minDate,
}: {
  month: Date;
  startDate?: Date;
  endDate?: Date;
  onSelectStart: (date: Date) => void;
  onSelectEnd: (date: Date) => void;
  isReserved: (date: Date) => boolean;
  minDate?: Date;
}) => {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  let firstDayOffset = monthStart.getDay() - 1;
  if (firstDayOffset === -1) firstDayOffset = 6;
  const prefixDays = Array(firstDayOffset).fill(null);

  const isStart = (date: Date) => {
    if (!startDate) return false;
    try {
      const d1 = new Date(date);
      const d2 = new Date(startDate);

      if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
        return false;
      }

      return (
        d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear()
      );
    } catch {
      return false;
    }
  };

  const isEnd = (date: Date) => {
    if (!endDate) return false;
    try {
      const d1 = new Date(date);
      const d2 = new Date(endDate);

      if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
        return false;
      }

      return (
        d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear()
      );
    } catch {
      return false;
    }
  };

  const isInRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    const normalizedStart = new Date(startDate);
    normalizedStart.setHours(0, 0, 0, 0);
    const normalizedEnd = new Date(endDate);
    normalizedEnd.setHours(0, 0, 0, 0);
    return normalizedDate >= normalizedStart && normalizedDate <= normalizedEnd;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    return compareDate < today;
  };

  const isDisabledDate = (date: Date) => {
    if (isPastDate(date)) return true;

    if (minDate) {
      const normalizedMinDate = new Date(minDate);
      normalizedMinDate.setHours(0, 0, 0, 0);

      const normalizedDate = new Date(date);
      normalizedDate.setHours(0, 0, 0, 0);

      if (normalizedDate < normalizedMinDate) return true;
    }

    return isReserved(date);
  };

  const handleDateSelect = (date: Date) => {
    if (isDisabledDate(date)) return;

    if (!startDate || (startDate && endDate)) {
      onSelectStart(date);
    } else {
      onSelectEnd(date);
    }
  };

  const daysOfWeek = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"];

  return (
    <div className="p-1.5 border rounded-lg bg-card">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => {
            const prevMonth = new Date(month);
            prevMonth.setMonth(prevMonth.getMonth() - 1);
            if (typeof window !== "undefined") {
              const event = new CustomEvent("calendarMonth", {
                detail: prevMonth,
              });
              window.dispatchEvent(event);
            }
          }}
          className="p-1 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
          aria-label="Previous month"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h2 className="text-xs font-medium">
          {customMonthNames.long[month.getMonth()]} {month.getFullYear()}
        </h2>
        <button
          onClick={() => {
            const nextMonth = new Date(month);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            if (typeof window !== "undefined") {
              const event = new CustomEvent("calendarMonth", {
                detail: nextMonth,
              });
              window.dispatchEvent(event);
            }
          }}
          className="p-1 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
          aria-label="Next month"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-[1px]">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="text-[9px] text-muted-foreground font-medium text-center h-4"
          >
            {day}
          </div>
        ))}

        {prefixDays.map((_, index) => (
          <div key={`prefix-${index}`} className="aspect-square" />
        ))}

        {daysInMonth.map((date) => {
          const isReservedDate = isReserved(date);
          const isPast = isPastDate(date);
          const isDisabled = isDisabledDate(date);
          const isStartDate = isStart(date);
          const isEndDate = isEnd(date);
          const isInSelectedRange =
            isInRange(date) && !isStartDate && !isEndDate;

          return (
            <div
              key={date.toISOString()}
              onClick={() => !isDisabled && handleDateSelect(date)}
              className={`
                aspect-square flex items-center justify-center
                text-[10px] rounded-sm transition-colors
                relative min-h-[18px] min-w-[18px]
                font-medium
                ${
                  isStartDate || isEndDate
                    ? "bg-primary text-primary-foreground"
                    : isInSelectedRange
                    ? "bg-primary/20 text-foreground"
                    : isPast
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : isReservedDate
                    ? "bg-destructive/20 text-destructive-foreground cursor-not-allowed"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer"
                }
                ${
                  isToday(date) && !isStartDate && !isEndDate
                    ? "ring-1 ring-primary"
                    : ""
                }
              `}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>

      <div className="mt-2 pt-1.5 border-t flex items-center justify-between text-[9px] text-muted-foreground">
        <div className="flex items-center gap-0.5">
          <div className="w-2 h-2 bg-primary"></div>
          <span>Vybrané</span>
        </div>
        <div className="flex items-center gap-0.5">
          <div className="w-2 h-2 bg-destructive/20"></div>
          <span>Obsazené</span>
        </div>
        <div className="flex items-center gap-0.5">
          <div className="w-2 h-2 bg-muted"></div>
          <span>Minulé</span>
        </div>
      </div>
    </div>
  );
};

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const resolvedParams = use(params);

  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [room, setRoom] = useState<Room | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guestCount, setGuestCount] = useState<number>(1);

  useEffect(() => {
    const handleCalendarMonth = (e: Event) => {
      const customEvent = e as CustomEvent;
      setCalendarMonth(customEvent.detail);
    };

    window.addEventListener("calendarMonth", handleCalendarMonth);

    return () => {
      window.removeEventListener("calendarMonth", handleCalendarMonth);
    };
  }, []);

  const handleStartDateSelect = (selectedDate: Date) => {
    setDate(selectedDate);
    setCheckOut(undefined);
  };

  const handleEndDateSelect = (selectedDate: Date) => {
    if (date && selectedDate < date) {
      setCheckOut(date);
      setDate(selectedDate);
    } else {
      setCheckOut(selectedDate);
    }
  };

  const resetSelection = () => {
    setDate(undefined);
    setCheckOut(undefined);
  };

  useEffect(() => {
    async function fetchRoomAndReservations() {
      setLoading(true);
      try {
        const roomNameFromUrl = decodeURIComponent(
          resolvedParams.name.replace(/-/g, " ")
        );
        const { data: roomData, error: roomError } = await supabase
          .from("rooms")
          .select("*, reservations(*)")
          .ilike("name", roomNameFromUrl)
          .single();

        if (roomError) throw roomError;
        if (!roomData) throw new Error("Room not found");

        setRoom(roomData);
        const validReservations = (roomData.reservations || []).filter(
          (res: { start_date: string; end_date: string }) => {
            try {
              const checkIn = new Date(res.start_date);
              const checkOut = new Date(res.end_date);
              return !isNaN(checkIn.getTime()) && !isNaN(checkOut.getTime());
            } catch {
              console.warn("Invalid reservation data:", res);
              return false;
            }
          }
        );

        setReservations(validReservations);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRoomAndReservations();
  }, [resolvedParams.name]);

  const images = useMemo(() => {
    if (!room) return [];
    return room.image_urls || [];
  }, [room]);

  const calculateTotalPrice = () => {
    if (!date || !checkOut || !room) return null;

    try {
      // Validate dates
      const startDate = new Date(date);
      const endDate = new Date(checkOut);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error("Invalid date");
      }

      // Calculate number of nights
      const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      const diffDays = Math.max(
        1,
        Math.round(Math.abs((endDate.getTime() - startDate.getTime()) / oneDay))
      );

      // Base calculations
      const nightlyRate = room.price;
      const subtotal = nightlyRate * diffDays;

      // Fixed cleaning fee
      const cleaningFee = 500;

      // Total
      const total = subtotal + cleaningFee;

      return {
        nights: diffDays,
        nightlyRate: nightlyRate,
        subtotal: subtotal,
        cleaningFee: cleaningFee,
        total: total,
      };
    } catch (error) {
      console.error("Error calculating price:", error);
      return null;
    }
  };

  const isDateReserved = (date: Date) => {
    if (!reservations || reservations.length === 0) {
      return false;
    }

    try {
      const targetDate = new Date(date);
      if (isNaN(targetDate.getTime())) {
        return false; // Invalid date
      }

      targetDate.setHours(0, 0, 0, 0);

      for (const reservation of reservations) {
        try {
          let checkIn, checkOut;

          try {
            checkIn = new Date(reservation.start_date);
            if (isNaN(checkIn.getTime())) continue;
          } catch {
            continue;
          }

          try {
            checkOut = new Date(reservation.end_date);
            if (isNaN(checkOut.getTime())) continue;
          } catch {
            continue;
          }

          checkIn.setHours(0, 0, 0, 0);
          checkOut.setHours(0, 0, 0, 0);

          if (targetDate >= checkIn && targetDate < checkOut) {
            return true;
          }
        } catch {
          continue;
        }
      }
    } catch (error) {
      console.error("Error checking if date is reserved:", error);
      return false;
    }

    return false;
  };

  const nextImage = () => {
    if (images.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    if (images.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Add form validation
  const isFormValid = useMemo(() => {
    return (
      firstName.trim() !== "" &&
      surname.trim() !== "" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      date !== undefined &&
      checkOut !== undefined &&
      date < checkOut
    );
  }, [firstName, surname, email, date, checkOut]);

  // Add the handleReservation function
  const handleReservation = async () => {
    if (!isFormValid || !room || !date || !checkOut) {
      alert("Vyplňte prosím všechny údaje.");
      return;
    }

    setIsSubmitting(true);

    try {
      alert("Rezervace úspěšná! Vaše rezervace byla úspěšně vytvořena.");

      // Reset form
      setFirstName("");
      setSurname("");
      setEmail("");
      setDate(undefined);
      setCheckOut(undefined);
      setGuestCount(1);

      try {
        const { data: newReservations, error: refreshError } = await supabase
          .from("reservations")
          .select("*")
          .eq("room_id", room.id);

        if (refreshError) {
          console.warn("Error refreshing reservations:", refreshError);
        } else if (newReservations) {
          setReservations(newReservations);
        }
      } catch (refreshError) {
        console.warn("Failed to refresh reservations:", refreshError);
      }
    } catch (error) {
      console.error("Error submitting form:", error);

      if (error instanceof Error) {
        alert(`Chyba: Nepodařilo se vytvořit rezervaci. ${error.message}`);
      } else {
        alert(
          "Chyba: Nepodařilo se vytvořit rezervaci. Zkontrolujte připojení k internetu a zkuste to znovu."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Načítání detailů pokoje...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold text-destructive">Pokoj nenalezen</h2>
        <Link
          href="/booking"
          className="text-primary hover:underline mt-4 inline-block"
        >
          Zpět na seznam pokojů
        </Link>
      </div>
    );
  }

  const priceDetails = calculateTotalPrice();

  return (
    <TooltipProvider>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b mb-6 -mx-6 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-muted-foreground">
              <Link href="/booking" className="hover:text-primary">
                Rooms
              </Link>
              <span className="mx-2">→</span>
              <span className="font-medium text-foreground">{room.name}</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          {images.length > 0 ? (
            <ImageGallery
              images={images}
              name={room.name}
              currentIndex={currentImageIndex}
              onNext={nextImage}
              onPrevious={previousImage}
            />
          ) : (
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Žádné obrázky k dispozici</p>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">{room.name}</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-accent rounded-lg text-center">
              <Users className="w-5 h-5 mx-auto mb-2 text-primary" />
              <span className="text-sm font-medium">
                Up to {room.capacity} guests
              </span>
            </div>
            <div className="p-4 bg-accent rounded-lg text-center">
              <BedDouble className="w-5 h-5 mx-auto mb-2 text-primary" />
              <span className="text-sm font-medium">{room.type}</span>
            </div>
          </div>
        </div>

        <Card className="shadow-md mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">O pokoji</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose prose-sm max-w-none">
              <p className="leading-relaxed">{room.description}</p>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-base font-semibold mb-3">Vybavení</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {room.amenities && room.amenities.length > 0 ? (
                  room.amenities.map((amenity, index) => (
                    <div
                      key={`amenity-${index}`}
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <Check className="w-4 h-4 text-primary" />
                      {typeof amenity === "string" ? amenity : String(amenity)}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No amenities listed</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Detaily rezervace</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Kontaktní údaje</h3>

                <div className="space-y-2">
                  <Label htmlFor="firstName">Jméno</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Zadejte jméno"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="surname">Příjmení</Label>
                  <Input
                    id="surname"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    placeholder="Zadejte příjmení"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vas@email.cz"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="guests">Počet hostů</Label>
                <Select
                  value={guestCount.toString()}
                  onValueChange={(value) => setGuestCount(parseInt(value))}
                >
                  <SelectTrigger id="guests" className="w-full">
                    <SelectValue placeholder="Vyberte počet hostů" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(room.capacity)].map((_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1}{" "}
                        {i === 0
                          ? "host"
                          : i >= 1 && i <= 4
                          ? "hosté"
                          : "hostů"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {priceDetails ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span>{formatPrice(room.price)}</span>
                    <span className="text-muted-foreground text-sm font-normal">
                      za noc
                    </span>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {formatPrice(priceDetails.nightlyRate)} ×{" "}
                        {priceDetails.nights}{" "}
                        {(() => {
                          const nights = priceDetails.nights;
                          if (!nights) return "nocí";
                          if (nights === 1) return "noc";
                          if (nights >= 2 && nights <= 4) return "noci";
                          return "nocí";
                        })()}
                      </span>
                      <span>{formatPrice(priceDetails.subtotal)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Poplatek za úklid
                      </span>
                      <span>{formatPrice(priceDetails.cleaningFee)}</span>
                    </div>

                    <div className="pt-3 mt-3 border-t border-border">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Celkem</span>
                        <div className="text-right">
                          <div className="text-lg font-semibold">
                            {formatPrice(priceDetails.total)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            včetně daní
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-muted-foreground">
                  Vyberte termín pro zobrazení ceny
                </div>
              )}

              <Button
                size="lg"
                className="w-full mt-2"
                disabled={!isFormValid || isSubmitting}
                onClick={handleReservation}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                    Zpracování...
                  </div>
                ) : (
                  "Rezervovat"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Vyberte termín</CardTitle>
                {(date || checkOut) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetSelection}
                    className="h-7 px-2 text-xs"
                  >
                    Zrušit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <RangeCalendar
                month={calendarMonth}
                startDate={date}
                endDate={checkOut}
                onSelectStart={handleStartDateSelect}
                onSelectEnd={handleEndDateSelect}
                isReserved={isDateReserved}
                minDate={new Date()}
              />

              {date ? (
                <div className="bg-muted p-3 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-in</span>
                    <span className="font-medium">
                      {formatDate(date, "d. MMMM yyyy")}
                    </span>
                  </div>
                  {checkOut && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Check-out</span>
                        <span className="font-medium">
                          {formatDate(checkOut, "d. MMMM yyyy")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Délka pobytu
                        </span>
                        <span className="font-medium">
                          {calculateTotalPrice()?.nights || "-"}{" "}
                          {(() => {
                            const nights = calculateTotalPrice()?.nights;
                            if (!nights) return "nocí";
                            if (nights === 1) return "noc";
                            if (nights >= 2 && nights <= 4) return "noci";
                            return "nocí";
                          })()}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="bg-muted p-3 rounded-lg text-center text-sm text-muted-foreground">
                  Vyberte datum příjezdu a odjezdu
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
