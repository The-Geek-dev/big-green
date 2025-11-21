"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";

const testimonials = [
  {
    name: "Michael Chen",
    role: "Model 3 Owner & Crypto Investor",
    image: "https://avatars.githubusercontent.com/u/1234567?v=4",
    content: "Switching to Big Green and using their crypto platform was brilliant. I charge my car, track my portfolio, and enjoy zero emissions - all seamlessly integrated!"
  },
  {
    name: "Sarah Johnson",
    role: "Model Y Owner & Day Trader",
    image: "https://avatars.githubusercontent.com/u/2345678?v=4",
    content: "The unified platform is genius. I can manage my Big Green vehicle's energy costs and optimize my crypto investments from the same dashboard. Pure innovation!"
  },
  {
    name: "David Wilson",
    role: "Model S Owner & Blockchain Enthusiast",
    image: "https://avatars.githubusercontent.com/u/3456789?v=4",
    content: "Big Green's autopilot frees up my commute time to monitor markets. The integration between sustainable transport and digital assets is the future!"
  },
  {
    name: "Emily Zhang",
    role: "Tech Investor",
    image: "https://avatars.githubusercontent.com/u/4567890?v=4",
    content: "I've saved thousands on fuel and made smart crypto moves through their platform. Big Green isn't just about cars - it's a complete lifestyle ecosystem."
  },
  {
    name: "James Rodriguez",
    role: "Model X Owner & Portfolio Manager",
    image: "https://avatars.githubusercontent.com/u/5678901?v=4",
    content: "The security features for both vehicle and crypto wallet are top-tier. Big Green understands that modern wealth management requires innovation."
  },
  {
    name: "Lisa Thompson",
    role: "Early Adopter",
    image: "https://avatars.githubusercontent.com/u/6789012?v=4",
    content: "From supercharging to crypto yields, everything earns returns. Big Green has redefined what it means to invest in your future, literally and figuratively."
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 overflow-hidden bg-background">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-normal mb-4 text-foreground">
            Loved by <span className="text-gradient">Innovators</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Join thousands driving Big Green vehicles and investing in crypto worldwide
          </p>
        </motion.div>

        <div className="relative flex flex-col antialiased">
          <div className="relative flex overflow-hidden py-4">
            <div className="animate-marquee flex min-w-full shrink-0 items-stretch gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={`${index}-1`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="w-[400px] shrink-0 glass border-border hover:border-primary/50 transition-all duration-300 p-8 hover-scale">
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={testimonial.image} />
                        <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-foreground">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-foreground/80 leading-relaxed">
                      {testimonial.content}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="animate-marquee flex min-w-full shrink-0 items-stretch gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={`${index}-2`} className="w-[400px] shrink-0 glass border-border hover:border-primary/50 transition-all duration-300 p-8 hover-scale">
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={testimonial.image} />
                      <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-foreground/80 leading-relaxed">
                    {testimonial.content}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
