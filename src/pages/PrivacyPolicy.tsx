import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
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
            PRIVACY <span className="highlight-yellow">POLICY</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-foreground/70 leading-relaxed max-w-4xl mb-8">
            Your privacy is important to us. This privacy policy explains how Big Green collects, uses, and protects 
            your personal information when you use our website and services.
          </p>
          <div className="prose prose-lg max-w-4xl">
            <p className="text-foreground/70">Last updated: {new Date().getFullYear()}</p>
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
