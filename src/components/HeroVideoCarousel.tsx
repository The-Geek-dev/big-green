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
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
      className="w-full"
    >
      <CarouselContent>
        {videos.map((video) => (
          <CarouselItem key={video.id}>
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
              <video
                src={video.url}
                title={video.title}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};
