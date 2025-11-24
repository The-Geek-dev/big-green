import { motion } from "framer-motion";
import greenFarming1 from "@/assets/green-farming-1.jpg";
import greenFarming2 from "@/assets/green-farming-2.jpg";
import greenFarming3 from "@/assets/green-farming-3.jpg";
import personalGarden from "@/assets/personal-garden.jpg";
import schoolClassroom from "@/assets/school-classroom.jpg";

const CommunityPhotoCarousel = () => {
  const photos = [
    { src: personalGarden, size: "small", alt: "Community member tending their personal garden" },
    { src: schoolClassroom, size: "tall", alt: "Students learning about sustainable farming" },
    { src: greenFarming2, size: "large", alt: "Community gardening project in action" },
    { src: greenFarming1, size: "medium", alt: "Fresh produce from community gardens" },
    { src: greenFarming3, size: "small", alt: "Group of volunteers working together" },
  ];

  return (
    <section className="relative py-24 bg-background overflow-hidden">
      <div className="container max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold tracking-[0.2em] uppercase text-foreground/60 mb-6 block">
            OUR COMMUNITY
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto px-4">
            GROWING TOGETHER <span className="highlight-yellow">ACROSS AMERICA</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {photos.map((photo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              className={`
                relative overflow-hidden rounded-2xl shadow-lg cursor-pointer
                ${photo.size === "large" ? "col-span-2 row-span-2" : ""}
                ${photo.size === "tall" ? "row-span-2" : ""}
                ${photo.size === "medium" ? "col-span-2" : ""}
              `}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto">
            Join thousands of families, schools, and communities growing their own food and building a sustainable future together.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunityPhotoCarousel;
