import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardSpotlight } from "./CardSpotlight";

const PricingTier = ({
  name,
  price,
  description,
  features,
  isPopular,
}: {
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}) => (
  <CardSpotlight className={`h-full ${isPopular ? "border-primary" : "border-border"} border-2`}>
    <div className="relative h-full p-6 flex flex-col">
      {isPopular && (
        <span className="text-xs font-medium bg-primary/10 text-primary rounded-full px-3 py-1 w-fit mb-4">
          Most Popular
        </span>
      )}
      <h3 className="text-xl font-medium mb-2 text-foreground">{name}</h3>
      <div className="mb-4">
        <span className="text-4xl font-bold text-foreground">{price}</span>
        {price !== "Custom" && !price.startsWith("$8") && <span className="text-muted-foreground">/month</span>}
      </div>
      <p className="text-muted-foreground mb-6">{description}</p>
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <Check className="w-5 h-5 text-primary" />
            <span className="text-sm text-foreground/80">{feature}</span>
          </li>
        ))}
      </ul>
      <Button className="button-gradient w-full">
        Order Now
      </Button>
    </div>
  </CardSpotlight>
);

export const PricingSection = () => {
  return (
    <section className="container px-4 py-24">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-6xl font-normal mb-6 text-foreground"
        >
          Choose Your{" "}
          <span className="text-gradient font-medium">Tesla Model</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-lg text-muted-foreground"
        >
          Select the perfect electric vehicle for your lifestyle and budget
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <PricingTier
          name="Model 3"
          price="$40,240"
          description="Affordable luxury with impressive range and performance"
          features={[
            "272 miles range",
            "5.8s 0-60 mph",
            "Premium interior",
            "Autopilot included"
          ]}
        />
        <PricingTier
          name="Model Y"
          price="$52,990"
          description="Versatile SUV with space and efficiency"
          features={[
            "330 miles range",
            "4.8s 0-60 mph",
            "All-wheel drive",
            "Enhanced Autopilot",
            "Spacious interior"
          ]}
          isPopular
        />
        <PricingTier
          name="Model S"
          price="$88,490"
          description="Ultimate performance and luxury sedan"
          features={[
            "405 miles range",
            "3.1s 0-60 mph",
            "Ludicrous Mode",
            "Full Self-Driving",
            "Premium connectivity",
            "Executive rear seats"
          ]}
        />
      </div>
    </section>
  );
};