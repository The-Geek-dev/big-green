import { motion } from "framer-motion";
import { ArrowRight, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { FeaturesSection } from "@/components/features/FeaturesSection";
import { PricingSection } from "@/components/pricing/PricingSection";
import LogoCarousel from "@/components/LogoCarousel";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import greenFarming1 from "@/assets/green-farming-1.jpg";
import greenFarming2 from "@/assets/green-farming-2.jpg";
import greenFarming3 from "@/assets/green-farming-3.jpg";
const Index = () => {
  return <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      {/* Hero Section */}
      <motion.section initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }} className="relative bg-white px-4 pt-32 pb-24 overflow-hidden">
        <div className="container max-w-7xl">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.2
        }} className="mb-8">
            <span className="text-sm font-semibold tracking-[0.2em] uppercase text-foreground/60">
              JOIN US
            </span>
          </motion.div>
          
          <motion.h1 initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.3
        }} className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] mb-12 max-w-5xl">
            LET'S GET <span className="highlight-yellow">EVERYONE</span> IN AMERICA GROWING FOOD!
          </motion.h1>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.5
        }} className="flex items-center justify-center mt-16">
            <ArrowRight className="w-16 h-16 text-foreground animate-bounce" />
          </motion.div>
        </div>

        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.8
      }} className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full hidden lg:block">
          
        </motion.div>
      </motion.section>

      {/* Logo Carousel */}
      <LogoCarousel />

      {/* Features Section */}
      <div id="features" className="bg-background">
        <FeaturesSection />
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="bg-background">
        <PricingSection />
      </div>

      {/* Mission Section */}
      <section className="relative py-24 bg-white">
        <div className="container max-w-7xl px-4">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }} className="text-center mb-16">
            <span className="text-sm font-semibold tracking-[0.2em] uppercase text-foreground/60 mb-6 block">
              BIG GREEN BELIEVES
            </span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-tight max-w-5xl mx-auto mb-8">
              GROWING FOOD CHANGES LIVES
            </h2>
            <p className="text-xl md:text-2xl text-foreground/70 max-w-4xl mx-auto leading-relaxed">
              Growing food improves nutrition security and mental health, gets us into nature, and opens our eyes to the weather 
              volatility created by climate change. For twelve years, Big Green has helped people grow their own food with school and 
              home-based programs. Our work across the country brings hundreds of thousands of gardens to life in schools, homes, 
              and communities each year.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="relative bg-background py-24">
        <div className="container max-w-7xl px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -40
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }}>
              <img src={greenFarming2} alt="Students learning about food and gardening" className="w-full h-auto rounded-2xl shadow-2xl" />
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            x: 40
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }}>
              <span className="text-sm font-semibold tracking-[0.2em] uppercase text-foreground/60 mb-6 block">
                AT SCHOOL
              </span>
              <h3 className="text-5xl md:text-6xl font-black tracking-tight leading-tight mb-6">
                WE GIVE GARDENS AND GRANTS <span className="highlight-yellow">TO SCHOOLS.</span>
              </h3>
              <p className="text-xl text-foreground/70 leading-relaxed">
                Jumpstart helps educators improve their edible garden programs for healthier students and a healthier planet. 
                We provide funding, resources, and support to transform outdoor learning spaces into thriving educational gardens.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Green Technology Section */}
      <section className="relative py-24 bg-green-tech overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        </div>
        
        <div className="container px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <motion.div initial={{
            opacity: 0,
            x: -40
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }} className="text-left">
              <motion.div className="inline-block mb-6 px-6 py-2 rounded-full bg-white/20 backdrop-blur-sm">
                <span className="text-sm font-medium text-white">
                  🌱 Sustainable Future
                </span>
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Green Technology Meets Smart Investment
              </h2>

              <p className="text-lg text-white/90 mb-8 leading-relaxed">
                Access exclusive government grants and incentives when you combine Big Green vehicle ownership with sustainable crypto investments. 
                Qualify for federal tax credits on electric vehicles, renewable energy rebates for charging infrastructure, and blockchain 
                sustainability grants.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                {[{
                value: "$7,500",
                label: "Federal EV Tax Credit Available",
                icon: "💰"
              }, {
                value: "$12K+",
                label: "Average Grant Value Per User",
                icon: "🎁"
              }, {
                value: "45+",
                label: "Active Grant Programs",
                icon: "📋"
              }].map((stat, index) => <motion.div key={index} initial={{
                opacity: 0,
                scale: 0.8
              }} whileInView={{
                opacity: 1,
                scale: 1
              }} viewport={{
                once: true
              }} transition={{
                delay: 0.2 + index * 0.1
              }} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-xs text-white/80">{stat.label}</div>
                  </motion.div>)}
              </div>

              <Button size="lg" className="bg-white text-green-tech hover:bg-white/90 font-semibold">
                Check Grant Eligibility
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            x: 40
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }}>
              <img src={greenFarming3} alt="Sustainable green technology and farming" className="w-full h-auto rounded-2xl shadow-2xl border-4 border-white/20" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <div className="bg-background">
        <TestimonialsSection />
      </div>

      {/* CTA Section */}
      <section className="relative py-24 bg-white">
        <div className="container max-w-7xl px-4 text-center">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-8 max-w-4xl mx-auto">
              READY TO <span className="highlight-yellow">START GROWING?</span>
            </h2>
            <p className="text-xl md:text-2xl text-foreground/70 mb-12 max-w-3xl mx-auto">
              Join thousands driving Big Green vehicles and investing in crypto. Start your journey to sustainable living and smart investing today.
            </p>
            <motion.div whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }}>
              <Button size="lg" className="bg-foreground text-white hover:bg-foreground/90 font-semibold px-8 py-6 text-lg">
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <div className="bg-background">
        <Footer />
      </div>
    </div>;
};
export default Index;