import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { CryptoInvestmentSection } from "@/components/crypto/CryptoInvestmentSection";
import Footer from "@/components/Footer";

const Packages = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      {/* Hero Header */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white px-3 sm:px-4 pt-24 sm:pt-32 pb-12 sm:pb-16"
      >
        <div className="container max-w-7xl relative z-10 px-2 sm:px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4 sm:mb-6"
          >
            <span className="text-xs sm:text-sm font-semibold tracking-[0.15em] sm:tracking-[0.2em] uppercase text-foreground/60">
              INVESTMENT TIERS
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[0.95] mb-4 sm:mb-6 max-w-4xl mx-auto"
          >
            CHOOSE YOUR <span className="highlight-yellow">INVESTMENT</span> TIER
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm sm:text-base md:text-lg text-foreground/70 max-w-3xl mx-auto"
          >
            Select the tier that best fits your investment goals and start earning rewards today
          </motion.p>
        </div>
      </motion.section>

      {/* Investment Packages */}
      <div className="bg-background">
        <CryptoInvestmentSection />
      </div>

      <Footer />
    </div>
  );
};

export default Packages;
