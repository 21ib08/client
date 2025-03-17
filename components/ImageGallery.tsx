"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

// Create a separate ImageGallery component for better performance
export default function ImageGallery({
  images,
  name,
  currentIndex,
  onNext,
  onPrevious,
}: {
  images: string[];
  name: string;
  currentIndex: number;
  onNext: () => void;
  onPrevious: () => void;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative aspect-[2/1] cursor-pointer group">
          <Image
            src={images[currentIndex]}
            alt={`${name} - View Gallery`}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-background/10 group-hover:bg-background/20 transition-colors" />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] h-[90vh] p-0">
        <DialogTitle className="sr-only">Image Gallery - {name}</DialogTitle>
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="relative w-full h-full max-h-[85vh]">
            <Image
              src={images[currentIndex]}
              alt={`${name} - Image ${currentIndex + 1}`}
              fill
              className="object-contain"
              priority
            />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrevious();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full"
          >
            <ChevronRight className="w-6 h-6 text-foreground" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
