import { motion } from "framer-motion";
import { useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

const videos = [
  {
    id: 1,
    url: "/videos/big-green-hero-1.mp4",
    title: "Big Green Hero"
  }
];

const VideoItem = ({ video }: { video: typeof videos[0] }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse">
          <Skeleton className="w-full h-full" />
        </div>
      )}
      <video
        src={video.url}
        title={video.title}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onLoadedData={() => setIsLoading(false)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-transparent" />
    </div>
  );
};

export const HeroVideoCarousel = () => {
  return (
    <Carousel
      opts={{
        align: "center",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 4000,
        }),
      ]}
      className="w-full h-full"
    >
      <CarouselContent className="h-full">
        {videos.map((video) => (
          <CarouselItem key={video.id} className="h-full">
            <VideoItem video={video} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};
