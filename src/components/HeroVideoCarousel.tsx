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
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    title: "Community Garden Success Story"
  },
  {
    id: 2,
    url: "https://www.youtube.com/embed/jNQXAC9IVRw",
    title: "School Garden Program"
  },
  {
    id: 3,
    url: "https://www.youtube.com/embed/9bZkp7q19f0",
    title: "Urban Farming Initiative"
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
              <iframe
                src={video.url}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};
