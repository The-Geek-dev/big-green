import { motion } from "framer-motion";
import microsoftLogo from "@/assets/microsoft.png";
import metaLogo from "@/assets/meta.png";
import oracleLogo from "@/assets/oracle.png";
import nikeLogo from "@/assets/nike.png";
import intelLogo from "@/assets/intel.png";
import appleLogo from "@/assets/apple-logo.png";

const LogoCarousel = () => {
  // Partner companies affiliated with Tesla and Big Green
  const logos = [
    microsoftLogo,
    metaLogo,
    oracleLogo,
    nikeLogo,
    intelLogo,
    appleLogo,
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