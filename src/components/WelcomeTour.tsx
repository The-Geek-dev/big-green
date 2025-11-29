import { useState, useEffect } from "react";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface TourStep {
  title: string;
  description: string;
  spotlightPosition: {
    x: string;
    y: string;
    radius: string;
  };
  tooltipPosition: {
    bottom?: string;
    top?: string;
    left?: string;
    right?: string;
  };
}

const tourSteps: TourStep[] = [
  {
    title: "Welcome! 👋",
    description: "Let us show you around. This quick tour will highlight the key features to help you get started.",
    spotlightPosition: { x: "50%", y: "50%", radius: "150px" },
    tooltipPosition: { top: "50%", left: "50%", right: "auto", bottom: "auto" },
  },
  {
    title: "Navigation Menu",
    description: "Access all major sections from here - Home, Features, Grants, Investment opportunities, and more.",
    spotlightPosition: { x: "50%", y: "32px", radius: "200px" },
    tooltipPosition: { top: "120px", left: "50%", right: "auto", bottom: "auto" },
  },
  {
    title: "Get Started",
    description: "Ready to begin? Click 'Get Started' to create your account and access grants and investment opportunities.",
    spotlightPosition: { x: "50%", y: "400px", radius: "180px" },
    tooltipPosition: { top: "500px", left: "50%", right: "auto", bottom: "auto" },
  },
  {
    title: "AI Assistant 🤖",
    description: "Need help anytime? Click this button to chat with our AI assistant. Get instant answers to your questions!",
    spotlightPosition: { x: "calc(100% - 48px)", y: "calc(100% - 48px)", radius: "80px" },
    tooltipPosition: { bottom: "120px", right: "24px" },
  },
];

export const WelcomeTour = () => {
  const [showTour, setShowTour] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("hasSeenWelcomeTour");
    if (!hasSeenTour) {
      const timer = setTimeout(() => setShowTour(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("hasSeenWelcomeTour", "true");
    setShowTour(false);
  };

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleDismiss();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = tourSteps[currentStep];

  return (
    <AnimatePresence>
      {showTour && (
        <>
          {/* Overlay with spotlight effect */}
          <motion.div
            key={`spotlight-${currentStep}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] pointer-events-none"
            style={{
              background: `radial-gradient(circle ${step.spotlightPosition.radius} at ${step.spotlightPosition.x} ${step.spotlightPosition.y}, transparent 0%, rgba(0, 0, 0, 0.75) 100%)`,
            }}
          />

          {/* Tour tooltip */}
          <motion.div
            key={`tooltip-${currentStep}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed z-[70] w-80 bg-card border border-border rounded-lg shadow-xl p-6"
            style={{
              bottom: step.tooltipPosition.bottom,
              top: step.tooltipPosition.top,
              left: step.tooltipPosition.left,
              right: step.tooltipPosition.right,
              transform: step.tooltipPosition.left === "50%" ? "translateX(-50%)" : undefined,
            }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="absolute top-2 right-2 h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {currentStep + 1} / {tourSteps.length}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>

              <div className="flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex gap-1">
                  {tourSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full transition-all ${
                        index === currentStep
                          ? "w-6 bg-primary"
                          : "w-1.5 bg-muted"
                      }`}
                    />
                  ))}
                </div>

                <Button
                  size="sm"
                  onClick={handleNext}
                  className="gap-1"
                >
                  {currentStep === tourSteps.length - 1 ? "Finish" : "Next"}
                  {currentStep < tourSteps.length - 1 && (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
