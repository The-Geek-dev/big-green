import { useState, useEffect } from "react";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useScreenSize } from "@/hooks/useMediaQuery";

interface TourStep {
  title: string;
  description: string;
  spotlightPosition: {
    x: string;
    y: string;
    radius: string;
  };
  spotlightPositionMobile?: {
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
  tooltipPositionMobile?: {
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
    spotlightPositionMobile: { x: "50%", y: "40%", radius: "100px" },
    tooltipPosition: { top: "50%", left: "50%", right: "auto", bottom: "auto" },
    tooltipPositionMobile: { bottom: "20px", left: "50%", right: "auto", top: "auto" },
  },
  {
    title: "Navigation Menu",
    description: "Access all major sections from here - Home, Features, Grants, Investment opportunities, and more.",
    spotlightPosition: { x: "50%", y: "32px", radius: "200px" },
    spotlightPositionMobile: { x: "50%", y: "60px", radius: "120px" },
    tooltipPosition: { top: "120px", left: "50%", right: "auto", bottom: "auto" },
    tooltipPositionMobile: { top: "180px", left: "50%", right: "auto", bottom: "auto" },
  },
  {
    title: "Get Started",
    description: "Ready to begin? Click 'Get Started' to create your account and access grants and investment opportunities.",
    spotlightPosition: { x: "50%", y: "400px", radius: "180px" },
    spotlightPositionMobile: { x: "50%", y: "300px", radius: "120px" },
    tooltipPosition: { top: "500px", left: "50%", right: "auto", bottom: "auto" },
    tooltipPositionMobile: { bottom: "20px", left: "50%", right: "auto", top: "auto" },
  },
  {
    title: "AI Assistant 🤖",
    description: "Need help anytime? Click this button to chat with our AI assistant. Get instant answers to your questions!",
    spotlightPosition: { x: "calc(100% - 48px)", y: "calc(100% - 48px)", radius: "80px" },
    spotlightPositionMobile: { x: "calc(100% - 40px)", y: "calc(100% - 40px)", radius: "60px" },
    tooltipPosition: { bottom: "120px", right: "24px" },
    tooltipPositionMobile: { bottom: "120px", left: "50%", right: "auto", top: "auto" },
  },
];

export const WelcomeTour = () => {
  const { isMobile } = useScreenSize();
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
  const spotlightPos = isMobile && step.spotlightPositionMobile ? step.spotlightPositionMobile : step.spotlightPosition;
  const tooltipPos = isMobile && step.tooltipPositionMobile ? step.tooltipPositionMobile : step.tooltipPosition;

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
              background: `radial-gradient(circle ${spotlightPos.radius} at ${spotlightPos.x} ${spotlightPos.y}, transparent 0%, rgba(0, 0, 0, 0.75) 100%)`,
            }}
          />

          {/* Tour tooltip */}
          <motion.div
            key={`tooltip-${currentStep}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className={`fixed z-[70] bg-card border border-border rounded-lg shadow-xl p-4 md:p-6 ${
              isMobile ? "w-[90vw] max-w-sm" : "w-80"
            }`}
            style={{
              bottom: tooltipPos.bottom,
              top: tooltipPos.top,
              left: tooltipPos.left,
              right: tooltipPos.right,
              transform: tooltipPos.left === "50%" ? "translateX(-50%)" : undefined,
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

            <div className="space-y-3 md:space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between pr-6">
                  <h3 className="text-base md:text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {currentStep + 1} / {tourSteps.length}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="gap-1 w-full sm:w-auto"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Back</span>
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
                  className="gap-1 w-full sm:w-auto"
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
