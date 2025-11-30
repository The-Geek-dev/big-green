import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Jumpstart = () => {
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
            <span className="highlight-yellow">JUMPSTART</span> PROGRAM
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-foreground/70 leading-relaxed max-w-4xl">
            Our Jumpstart program provides schools with funding, resources, and support to transform outdoor 
            learning spaces into thriving educational gardens. We equip educators with the tools and knowledge 
            to integrate garden-based learning into their curriculum.
          </p>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default Jumpstart;
