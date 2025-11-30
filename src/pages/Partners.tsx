import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Partners = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white px-3 sm:px-4 pt-24 sm:pt-32 pb-12 sm:pb-16"
      >
        <div className="container max-w-7xl px-2 sm:px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-tight mb-6">
            OUR <span className="highlight-yellow">PARTNERS</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-foreground/70 leading-relaxed max-w-4xl">
            Big Green works with incredible partners across the country to expand our reach and impact. From corporate 
            sponsors to nonprofit organizations, our partners share our vision of getting everyone growing food and 
            building sustainable communities.
          </p>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default Partners;
