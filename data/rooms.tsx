export const rooms = [
  {
    name: "Deluxe Suite",
    image: "/blueprint.webp",
    additionalImages: [
      "/room-1-1.webp",
      "/room-1-2.webp",
      "/room-1-3.webp",
      "/room-1-4.webp",
    ],
    price: 2400,
    capacity: 2,
    bedType: "King Bed",
    size: "40m²",
    view: "City View",
    description:
      "Modern comfort meets luxury in our Deluxe King Room, perfect for couples or business travelers seeking comfort and style.",
    features: [
      "Mountain View",
      "King Bed",
      "Private Balcony",
      "Complimentary Breakfast",
      "Mini Bar",
      "Air Conditioning",
    ],
    amenities: {
      bedroom: [
        "King-size premium mattress",
        "Luxury linens",
        "Blackout curtains",
        "Walk-in closet",
      ],
      bathroom: [
        "Rain shower",
        "Heated floors",
        "Premium toiletries",
        "Hair dryer",
      ],
      living: ["Workspace", '55" Smart TV', "Seating area", "Mini fridge"],
    },
    rating: 4.9,
    reviews: [
      {
        id: 1,
        user: "Sarah M.",
        avatar: "/avatars/sarah.jpg",
        rating: 5,
        date: "2024-02-15",
        comment: "Absolutely stunning room with incredible mountain views!",
      },
      {
        id: 2,
        user: "Robert K.",
        avatar: "/avatars/robert.jpg",
        rating: 4,
        date: "2024-02-12",
        comment:
          "The king-size bed was incredibly comfortable and the room service was exceptional.",
      },
      {
        id: 3,
        user: "Nina P.",
        avatar: "/avatars/nina.jpg",
        rating: 5,
        date: "2024-02-08",
        comment:
          "Loved the private balcony and the complimentary breakfast was delicious!",
      },
    ],
  },
  {
    name: "Forest Villa",
    image: "/blueprint.webp",
    additionalImages: [
      "/villa-1.webp",
      "/villa-2.webp",
      "/villa-3.webp",
      "/villa-4.webp",
    ],
    price: 3600,
    capacity: 3,
    bedType: "King Bed",
    size: "65m²",
    view: "Ocean View",
    description:
      "Experience ultimate luxury in our Premium Ocean Suite, featuring breathtaking views and a separate living area. Perfect for those seeking an elevated stay.",
    features: [
      "Private Pool",
      "Garden View",
      "Kitchenette",
      "Free WiFi",
      "Smart TV",
      "Outdoor Shower",
    ],
    amenities: {
      bedroom: [
        "Premium king bed",
        "High-thread count linens",
        "Panoramic windows",
        "Private terrace",
      ],
      bathroom: [
        "Dual vanity",
        "Soaking tub",
        "Outdoor shower",
        "Luxury bath products",
      ],
      living: ["Full kitchen", "Dining area", '65" OLED TV', "Sound system"],
    },
    rating: 4.8,
    reviews: [
      {
        id: 1,
        user: "Michael R.",
        avatar: "/avatars/michael.jpg",
        rating: 5,
        date: "2024-02-10",
        comment:
          "The private pool and garden view made our stay unforgettable!",
      },
      {
        id: 2,
        user: "Sophie L.",
        avatar: "/avatars/sophie.jpg",
        rating: 5,
        date: "2024-02-07",
        comment:
          "The outdoor shower was amazing and the kitchen was fully equipped. Perfect for a luxury getaway!",
      },
      {
        id: 3,
        user: "James H.",
        avatar: "/avatars/james.jpg",
        rating: 4,
        date: "2024-02-03",
        comment:
          "Spacious villa with great amenities. The sound system and OLED TV were top-notch.",
      },
    ],
  },
  {
    name: "Eco Pod",
    image: "/blueprint.webp",
    additionalImages: [
      "/pod-1.webp",
      "/pod-2.webp",
      "/pod-3.webp",
      "/pod-4.webp",
    ],
    price: 1800,
    capacity: 4,
    bedType: "2 Queen Beds",
    size: "55m²",
    view: "Garden View",
    description:
      "Our Family Comfort Room offers the perfect blend of space and convenience, with thoughtful amenities designed to make family stays comfortable and memorable.",
    features: [
      "Sustainable Design",
      "Star Gazing",
      "Private Deck",
      "Eco-Friendly Toiletries",
      "Complimentary Snacks",
      "Bicycle Rental",
    ],
    amenities: {
      bedroom: [
        "Organic bedding",
        "Solar-powered lighting",
        "Natural ventilation",
        "Recycled materials",
      ],
      bathroom: [
        "Water-saving fixtures",
        "Organic toiletries",
        "Composting toilet",
        "Solar-heated water",
      ],
      living: [
        "Sustainable furniture",
        "Energy monitor",
        "Recycling station",
        "Local guidebook",
      ],
    },
    rating: 4.7,
    reviews: [
      {
        id: 1,
        user: "Emma L.",
        avatar: "/avatars/emma.jpg",
        rating: 5,
        date: "2024-02-01",
        comment:
          "A perfect eco-friendly getaway with amazing stargazing opportunities!",
      },
      {
        id: 2,
        user: "Marcus T.",
        avatar: "/avatars/marcus.jpg",
        rating: 5,
        date: "2024-01-28",
        comment:
          "The sustainable design was impressive. Loved using the energy monitor and learning about eco-living.",
      },
      {
        id: 3,
        user: "Clara B.",
        avatar: "/avatars/clara.jpg",
        rating: 4,
        date: "2024-01-25",
        comment:
          "Great for families! The kids loved the bicycle rental and the local guidebook was very helpful.",
      },
    ],
  },
];

export interface Room {
  id: number;
  name: string;
  type: string;
  price: number;
  capacity: number;
  image_urls: string[];
  description: string;
  amenities: {
    icon: string;
    name: string;
  }[];
}

export const roomsMap = new Map(
  rooms.map((room) => [room.name.replace(/\s+/g, "-").toLowerCase(), room])
);
