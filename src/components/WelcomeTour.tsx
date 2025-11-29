import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export const WelcomeTour = () => {
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("hasSeenWelcomeTour");
    if (!hasSeenTour) {
      // Small delay to let the page load
      const timer = setTimeout(() => setShowTour(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("hasSeenWelcomeTour", "true");
    setShowTour(false);
  };

  return (
    <AnimatePresence>
      {showTour && (
        <>
          {/* Overlay with spotlight effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] pointer-events-none"
            style={{
              background: "radial-gradient(circle 80px at calc(100% - 48px) calc(100% - 48px), transparent 0%, rgba(0, 0, 0, 0.7) 100%)",
            }}
          />

          {/* Tour tooltip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ delay: 0.2 }}
            className="fixed bottom-28 right-6 z-[70] w-80 bg-card border border-border rounded-lg shadow-xl p-6"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="absolute top-2 right-2 h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">
                Need Help? 👋
              </h3>
              <p className="text-sm text-muted-foreground">
                Click the AI assistant button below to get instant help, ask questions, or learn more about our platform.
              </p>
              <Button onClick={handleDismiss} className="w-full">
                Got it!
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
