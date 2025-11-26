"use client";

import { motion } from "framer-motion";
import { Star, Award, Trophy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";
import marcusImg from "@/assets/testimonial-marcus.jpg";
import sarahImg from "@/assets/testimonial-sarah.jpg";
import davidImg from "@/assets/testimonial-david.jpg";
import jenniferImg from "@/assets/testimonial-jennifer.jpg";
import robertImg from "@/assets/testimonial-robert.jpg";
import amandaImg from "@/assets/testimonial-amanda.jpg";
const testimonials = [{
  name: "Marcus Thompson",
  tier: "Tier 1",
  tierIcon: Star,
  location: "Denver, CO",
  image: marcusImg,
  content: "I enrolled in Tier 1 three months ago and received my $65,000 grant immediately! The $20 daily bonus is amazing - it's like getting paid to grow food and invest. The welcome packet was professional and made me feel valued from day one."
}, {
  name: "Sarah Martinez",
  tier: "Tier 2",
  tierIcon: Award,
  location: "Austin, TX",
  image: sarahImg,
  content: "Best decision ever! After investing $1,000 to upgrade to Tier 2, my $100 daily rewards started immediately. The advanced analytics dashboard is incredible, and the 24/7 support team is always there when I need help. Already withdrew $25,000!"
}, {
  name: "David Chen",
  tier: "Tier 3",
  tierIcon: Trophy,
  location: "San Francisco, CA",
  image: davidImg,
  content: "Tier 3 VIP status changed my life! Getting $500 every 4 hours is unreal. The unlimited instant withdrawals mean I have complete financial freedom. And yes, I received my Cybertruck - it's sitting in my driveway right now. This is truly a legacy!"
}, {
  name: "Jennifer Park",
  tier: "Tier 1",
  tierIcon: Star,
  location: "Seattle, WA",
  image: jenniferImg,
  content: "The $65,000 grant helped me start my community garden project. Between the daily $20 bonus and growing my own food, I'm saving so much money. Big Green's mission to get everyone growing food really resonated with me. Highly recommend!"
}, {
  name: "Robert Williams",
  tier: "Tier 2",
  tierIcon: Award,
  location: "Miami, FL",
  image: robertImg,
  content: "The Quantum Leap to Tier 2 was worth every penny. Priority processing is a game changer - my withdrawal requests are handled instantly. The $100 daily adds up fast, and the certificate they sent made it feel official and legitimate."
}, {
  name: "Amanda Rodriguez",
  tier: "Tier 3",
  tierIcon: Trophy,
  location: "Los Angeles, CA",
  image: amandaImg,
  content: "As a Tier 3 VIP member, I'm living the dream. The $500 daily rewards every 4 hours means I'm earning $1,500+ per day. My Cybertruck arrived with all the documents as promised. The dedication advisor helped me maximize my crypto investments. Worth it!"
}];
const TestimonialsSection = () => {
  return <section className="py-20 overflow-hidden bg-background">
      <div className="container px-4">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true,
        margin: "-100px"
      }} transition={{
        duration: 0.8,
        ease: "easeOut"
      }} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal mb-3 md:mb-4 text-foreground">  Stories from Our Family<span className="text-gradient">Our Family </span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground px-4">
            See what our Tier 1, 2, and 3 members are saying about their grants and rewards
          </p>
        </motion.div>

        <div className="relative flex flex-col antialiased">
          <div className="relative flex overflow-hidden py-4">
            <div className="animate-marquee flex min-w-full shrink-0 items-stretch gap-8">
              {testimonials.map((testimonial, index) => <motion.div key={`${index}-1`} initial={{
              opacity: 0,
              scale: 0.9
            }} whileInView={{
              opacity: 1,
              scale: 1
            }} viewport={{
              once: true
            }} transition={{
              delay: index * 0.1
            }}>
                  <Card className="w-[340px] sm:w-[380px] md:w-[400px] shrink-0 glass border-border hover:border-primary/50 transition-all duration-300 p-6 md:p-8 hover-scale">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={testimonial.image} />
                          <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-foreground">{testimonial.name}</h4>
                          <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${testimonial.tier === "Tier 3" ? "bg-gradient-to-r from-primary to-yellow-500 text-white" : testimonial.tier === "Tier 2" ? "bg-primary/10 text-primary" : "bg-muted text-foreground"}`}>
                        <testimonial.tierIcon className="w-4 h-4" />
                        <span className="text-xs font-bold">{testimonial.tier}</span>
                      </div>
                    </div>
                    <p className="text-foreground/80 leading-relaxed">
                      {testimonial.content}
                    </p>
                  </Card>
                </motion.div>)}
            </div>
            <div className="animate-marquee flex min-w-full shrink-0 items-stretch gap-8">
              {testimonials.map((testimonial, index) => <Card key={`${index}-2`} className="w-[340px] sm:w-[380px] md:w-[400px] shrink-0 glass border-border hover:border-primary/50 transition-all duration-300 p-6 md:p-8 hover-scale">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={testimonial.image} />
                        <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-foreground">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${testimonial.tier === "Tier 3" ? "bg-gradient-to-r from-primary to-yellow-500 text-white" : testimonial.tier === "Tier 2" ? "bg-primary/10 text-primary" : "bg-muted text-foreground"}`}>
                      <testimonial.tierIcon className="w-4 h-4" />
                      <span className="text-xs font-bold">{testimonial.tier}</span>
                    </div>
                  </div>
                  <p className="text-foreground/80 leading-relaxed">
                    {testimonial.content}
                  </p>
                </Card>)}
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default TestimonialsSection;