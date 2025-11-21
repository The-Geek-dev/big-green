import { motion } from "framer-motion";
import { TrendingUp, Shield, Zap, ArrowRight, Trophy, Award, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import teslaModel3 from "@/assets/tesla-model-3.jpg";
import teslaModelY from "@/assets/tesla-model-y.jpg";
import teslaModelS from "@/assets/tesla-model-s.jpg";
import teslaCybertruck from "@/assets/tesla-cybertruck.jpg";

export const CryptoInvestmentSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="container px-4 py-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold tracking-[0.2em] uppercase text-foreground/60 mb-6 block">
            BIG GREEN × TESLA PARTNERSHIP
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-tight mb-6 md:mb-8 px-4">
            DRIVE GREEN, <span className="highlight-yellow">INVEST SMART</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground/70 max-w-4xl mx-auto leading-relaxed px-4">
            Big Green partners with Tesla to offer exclusive crypto investment opportunities 
            for sustainable vehicle owners. Get started with growing food and smart investing.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            {
              icon: <TrendingUp className="w-8 h-8" />,
              title: "Crypto Portfolio",
              description: "Access curated crypto investment tools designed for Tesla and Big Green vehicle owners"
            },
            {
              icon: <Shield className="w-8 h-8" />,
              title: "Secure Platform",
              description: "Bank-level security with multi-factor authentication and cold storage protection"
            },
            {
              icon: <Zap className="w-8 h-8" />,
              title: "Instant Trading",
              description: "Real-time market access with zero trading fees for Big Green members"
            }
          ].map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
              className="bg-white border-2 border-border rounded-2xl p-6 md:p-8 hover:border-primary transition-all duration-300"
            >
              <div className="text-primary mb-3 md:mb-4">{benefit.icon}</div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-foreground">{benefit.title}</h3>
              <p className="text-sm md:text-base text-foreground/70">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Investment Tiers */}
        <div className="space-y-20">
          {/* Tier 1 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img 
                src={teslaModel3} 
                alt="Tier 1 - The Gateway to an Unprecedented Grant" 
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <Star className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black">
                  TIER 1: THE GATEWAY
                </h3>
              </div>
              <div className="text-2xl sm:text-2xl md:text-3xl font-bold mb-2">
                <span className="text-primary">$65,000</span>
                <span className="text-sm md:text-lg text-foreground/60 ml-2">Total Grant</span>
              </div>
              <div className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">
                <span className="text-primary">+$20</span>
                <span className="text-sm md:text-base text-foreground/60 ml-2">Daily Bonus</span>
              </div>
              <p className="text-base sm:text-lg md:text-xl text-foreground/70 mb-4 md:mb-6">
                Your journey begins not with a small gesture, but with a monumental one. 
                You instantly become eligible for a massive $65,000 total grant. This isn't a future 
                possibility; it's an immediate reality.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="font-semibold">$65,000 instant grant eligibility</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>$20 consistent daily bonus</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Official welcome packet via email</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Certificate of acknowledgment</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Basic crypto portfolio access</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Tier 2 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <Award className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black">
                  TIER 2: THE QUANTUM LEAP
                </h3>
              </div>
              <div className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-primary to-purple-600 text-white rounded-full text-xs md:text-sm font-bold mb-3 md:mb-4">
                One-time $1,000 Investment Required
              </div>
              <div className="text-2xl md:text-3xl font-bold mb-2">
                <span className="text-primary">$100</span>
                <span className="text-sm md:text-lg text-foreground/60 ml-2">Daily Rewards</span>
              </div>
              <div className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">
                <span className="text-primary">$50,000</span>
                <span className="text-sm md:text-base text-foreground/60 ml-2">Withdrawal Capacity</span>
              </div>
              <p className="text-base sm:text-lg md:text-xl text-foreground/70 mb-4 md:mb-6">
                This is where you make the pivotal decision to turn this immense potential into tangible wealth. 
                Your entire experience accelerates with this single, one-time investment of just $1,000.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="font-semibold">$100 daily rewards</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>$50,000 withdrawal capacity</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>24/7 premium support team</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Priority processing on all requests</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Advanced analytics dashboard</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Certificate and documents via email</span>
                </li>
              </ul>
              <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                Most Popular
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2"
            >
              <img 
                src={teslaModelY} 
                alt="Tier 2 - The Quantum Leap" 
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>

          {/* Tier 3 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img 
                src={teslaCybertruck} 
                alt="Tier 3 - The VIP Legacy with Cybertruck" 
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <Trophy className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black">
                  TIER 3: THE VIP LEGACY
                </h3>
              </div>
              <div className="text-2xl md:text-3xl font-bold mb-2">
                <span className="text-primary">$500</span>
                <span className="text-sm md:text-lg text-foreground/60 ml-2">Daily Rewards</span>
              </div>
              <div className="text-sm md:text-base text-foreground/70 mb-3 md:mb-4 font-medium">
                Claimable Every 4 Hours
              </div>
              <div className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-primary to-yellow-500 text-white rounded-full text-xs md:text-sm font-bold mb-4 md:mb-6">
                🏆 COMPLIMENTARY CYBERTRUCK INCLUDED
              </div>
              <p className="text-base sm:text-lg md:text-xl text-foreground/70 mb-4 md:mb-6">
                This is the pinnacle. This tier is for those who are ready to claim their place among the elite. 
                As a VIP member, you gain ultimate financial freedom with unlimited, instant withdrawals. 
                The wait is over. The funds are yours, on your terms.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="font-semibold">$500 daily rewards (every 4 hours)</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="font-semibold">Unlimited instant withdrawals</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="font-semibold">Complimentary Cybertruck eligibility</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Tier 3 certificate via email</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>All vehicle documents for Cybertruck</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>AI-powered trading & dedicated advisor</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>VIP exclusive events & networking</span>
                </li>
              </ul>
              <div className="bg-gradient-to-r from-primary/10 to-yellow-500/10 border-2 border-primary/20 rounded-xl p-3 md:p-4 mt-4 md:mt-6">
                <p className="text-xs md:text-sm text-foreground/80 italic">
                  "We're not just offering rewards; we're offering a legacy."
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-16 md:mt-20"
        >
          <Button onClick={() => navigate("/auth")} size="lg" className="button-gradient text-base md:text-lg px-6 md:px-8 py-5 md:py-6">
            Start Your Investment Journey
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
