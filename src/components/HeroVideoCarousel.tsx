import { motion } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const videos = [
  {
    id: 1,
    url: "/videos/big-green-hero-1.mp4",
    title: "Big Green Hero"
  }
];

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
            <div className="relative w-full h-full">
              <video
                src={video.url}
                title={video.title}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-transparent" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};
