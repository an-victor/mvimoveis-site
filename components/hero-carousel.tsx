"use client";

import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface HeroCarouselProps {
  imageUrls: string[];
}

export function HeroCarousel({ imageUrls }: HeroCarouselProps) {
  if (!imageUrls || imageUrls.length === 0) {
    return (
      <div className="absolute inset-0 bg-cover bg-center bg-slate-300 flex items-center justify-center">
        <p className="text-slate-600">Banner indisponível</p>
      </div>
    );
  }

  return (
    <Carousel
      opts={{ loop: true }}
      plugins={[Autoplay({ delay: 5000 })]} // This plugin usage is now safe within a Client Component
      className="h-full w-full"
    >
      <CarouselContent className="h-full">
        {imageUrls.map((url, index) => (
          <CarouselItem key={index} className="h-full w-full">
            <div
              className="w-full h-full bg-cover bg-center relative"
              style={{ backgroundImage: `url(${url})` }}
            >
              {/* Optional overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-slate-900/30" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

