import { motion } from "framer-motion";

const LogoCarousel = () => {
  // Partner companies affiliated with Tesla and Big Green
  const logos = [
    "/lovable-uploads/5830bd79-3511-41dc-af6c-8db32d91fc2c.png", // Tesla
    "/lovable-uploads/bb50362c-6879-4868-bbc9-c6e051fd8d7d.png", // Panasonic
    "/lovable-uploads/1e2a48dc-059b-4919-a1ed-44685d771a32.png", // SpaceX
    "/lovable-uploads/bf56a0c6-48e4-49f7-b286-8e3fda9a3385.png", // SolarCity
    "/lovable-uploads/7cc724d4-3e14-4e7c-9e7a-8d613fde54d0.png", // Renewable Energy Partner
    "/lovable-uploads/0dbe1b75-2c74-4ff8-ba55-4be4d74abe72.png", // EV Charging Network
    "/lovable-uploads/21f3edfb-62b5-4e35-9d03-7339d803b980.png", // Green Energy Solutions
    "/lovable-uploads/7335619d-58a9-41ad-a233-f7826f56f3e9.png", // Battery Technology
    "/lovable-uploads/79f2b901-8a4e-42a5-939f-fae0828e0aef.png", // Sustainable Transport
    "/lovable-uploads/86329743-ee49-4f2e-96f7-50508436273d.png", // Solar Infrastructure
    "/lovable-uploads/a2c0bb3a-a47b-40bf-ba26-d79f2f9e741b.png", // Clean Energy Alliance
    "/lovable-uploads/b6436838-5c1a-419a-9cdc-1f9867df073d.png", // Electric Mobility
    "/lovable-uploads/c32c6788-5e4a-4fee-afee-604b03113c7f.png", // Green Tech Partners
    "/lovable-uploads/e143cef1-4ad0-404b-b47a-147e89bc017c.png", // Sustainability Network
  ];

  const extendedLogos = [...logos, ...logos, ...logos];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="w-full overflow-hidden bg-gradient-to-r from-background via-muted/30 to-background py-16 mt-20 border-y border-border/50"
    >
      <motion.div 
        className="flex space-x-16"
        initial={{ opacity: 0, x: "0%" }}
        animate={{
          opacity: 1,
          x: "-50%"
        }}
        transition={{
          opacity: { duration: 0.5 },
          x: {
            duration: 15,
            repeat: Infinity,
            ease: "linear",
            delay: 0.5
          }
        }}
        style={{
          width: "fit-content",
          display: "flex",
          gap: "4rem"
        }}
      >
        {extendedLogos.map((logo, index) => (
          <motion.img
            key={`logo-${index}`}
            src={logo}
            alt={`Partner logo ${index + 1}`}
            className="h-12 object-contain brightness-0 dark:brightness-100 opacity-70"
            initial={{ opacity: 0.5, filter: "grayscale(100%)" }}
            whileHover={{ 
              opacity: 1,
              scale: 1.1,
              transition: { duration: 0.2 }
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default LogoCarousel;