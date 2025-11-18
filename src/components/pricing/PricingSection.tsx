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
  <CardSpotlight className={`h-full ${isPopular ? "border-primary" : "border-border"} border-2 transition-all duration-300 hover:scale-105`}>
    <div className="relative h-full p-6 flex flex-col">
      {isPopular && (
        <motion.span 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs font-medium bg-primary/10 text-primary rounded-full px-3 py-1 w-fit mb-4"
        >
          Most Popular
        </motion.span>
      )}
      <h3 className="text-xl font-medium mb-2 text-foreground">{name}</h3>
      <div className="mb-4">
        <span className="text-4xl font-bold text-foreground">{price}</span>
        {price !== "Custom" && !price.startsWith("$8") && <span className="text-muted-foreground">/month</span>}
      </div>
      <p className="text-muted-foreground mb-6">{description}</p>
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, index) => (
          <motion.li 
            key={index} 
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * index }}
            className="flex items-center gap-2"
          >
            <Check className="w-5 h-5 text-primary" />
            <span className="text-sm text-foreground/80">{feature}</span>
          </motion.li>
        ))}
      </ul>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button className="button-gradient w-full">
          Get Started
        </Button>
      </motion.div>
    </div>
  </CardSpotlight>
);

export const PricingSection = () => {
  return (
    <section className="container px-4 py-24">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-6xl font-normal mb-6 text-foreground"
        >
          Choose Your{" "}
          <span className="text-gradient font-medium">Package</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-lg text-muted-foreground"
        >
          Tesla vehicles paired with crypto investment tools - select your perfect combination
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <PricingTier
            name="Starter Package"
            price="$40,240"
            description="Model 3 + Basic Crypto Portfolio"
            features={[
              "Tesla Model 3",
              "272 miles range",
              "Basic crypto tracking",
              "Email support"
            ]}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <PricingTier
            name="Pro Package"
            price="$52,990"
            description="Model Y + Advanced Trading Tools"
            features={[
              "Tesla Model Y",
              "330 miles range",
              "Advanced trading tools",
              "Portfolio analytics",
              "Priority support"
            ]}
            isPopular
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <PricingTier
            name="Elite Package"
            price="$88,490"
            description="Model S + Premium Investment Suite"
            features={[
              "Tesla Model S",
              "405 miles range",
              "AI-powered trading",
              "Dedicated advisor",
              "Custom API access",
              "24/7 concierge"
            ]}
          />
        </motion.div>
      </div>
    </section>
  );
};