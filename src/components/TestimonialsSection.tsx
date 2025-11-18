"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";

const testimonials = [
  {
    name: "Michael Chen",
    role: "Model 3 Owner",
    image: "https://avatars.githubusercontent.com/u/1234567?v=4",
    content: "Switching to Tesla was the best decision I've made. The autopilot technology and instant torque make every drive incredible. Zero gas stations, zero emissions!"
  },
  {
    name: "Sarah Johnson",
    role: "Model Y Owner",
    image: "https://avatars.githubusercontent.com/u/2345678?v=4",
    content: "The Model Y has transformed our family road trips. With its spacious interior and Supercharger network, we've never felt range anxiety. Tesla truly delivers on innovation."
  },
  {
    name: "David Wilson",
    role: "Model S Owner",
    image: "https://avatars.githubusercontent.com/u/3456789?v=4",
    content: "The performance is mind-blowing - 0-60 in under 3 seconds! Plus the over-the-air updates keep making the car better. It's like getting a new car every few months."
  },
  {
    name: "Emily Zhang",
    role: "Model 3 Performance Owner",
    image: "https://avatars.githubusercontent.com/u/4567890?v=4",
    content: "I've saved thousands on fuel costs, and the maintenance is minimal. The instant acceleration and tech features make it feel like driving a spaceship."
  },
  {
    name: "James Rodriguez",
    role: "Model X Owner",
    image: "https://avatars.githubusercontent.com/u/5678901?v=4",
    content: "The falcon wing doors always turn heads, but it's the safety features and autopilot that truly impressed me. Tesla has redefined what a luxury SUV should be."
  },
  {
    name: "Lisa Thompson",
    role: "Model S Plaid Owner",
    image: "https://avatars.githubusercontent.com/u/6789012?v=4",
    content: "The Plaid's performance is absolutely insane - fastest production car I've ever driven. Combined with the elegant design and premium interior, it's perfection."
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
          <h2 className="text-5xl font-normal mb-4 text-foreground">Loved by Drivers</h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of satisfied Tesla owners worldwide
          </p>
        </motion.div>

        <div className="relative flex flex-col antialiased">
          <div className="relative flex overflow-hidden py-4">
            <div className="animate-marquee flex min-w-full shrink-0 items-stretch gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={`${index}-1`} className="w-[400px] shrink-0 glass border-border hover:border-primary/50 transition-all duration-300 p-8">
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
            <div className="animate-marquee flex min-w-full shrink-0 items-stretch gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={`${index}-2`} className="w-[400px] shrink-0 glass border-border hover:border-primary/50 transition-all duration-300 p-8">
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
