import { motion } from "framer-motion";
import { TrendingUp, Shield, Zap, ArrowRight, Trophy, Award, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import teslaModel3 from "@/assets/tesla-model-3.jpg";
import teslaModelY from "@/assets/tesla-model-y.jpg";
import teslaModelS from "@/assets/tesla-model-s.jpg";
import teslaCybertruck from "@/assets/tesla-cybertruck.jpg";

export const CryptoInvestmentSection = () => {
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
          <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-8">
            DRIVE GREEN, <span className="highlight-yellow">INVEST SMART</span>
          </h2>
          <p className="text-xl md:text-2xl text-foreground/70 max-w-4xl mx-auto leading-relaxed">
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
              className="bg-white border-2 border-border rounded-2xl p-8 hover:border-primary transition-all duration-300"
            >
              <div className="text-primary mb-4">{benefit.icon}</div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">{benefit.title}</h3>
              <p className="text-foreground/70">{benefit.description}</p>
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
                alt="Investment Tier 1 - Tesla Model 3" 
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-8 h-8 text-primary" />
                <h3 className="text-4xl md:text-5xl font-black">
                  TIER 1
                </h3>
              </div>
              <div className="text-3xl font-bold mb-6">
                <span className="text-primary">$65,000</span>
                <span className="text-lg text-foreground/60 ml-2">Investment Grant</span>
              </div>
              <p className="text-xl text-foreground/70 mb-6">
                Start your sustainable investment journey with Tier 1. Get access to exclusive crypto portfolios, 
                green technology grants, and your Tesla Model 3.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Tesla Model 3 vehicle</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>$65,000 investment grant</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Basic crypto portfolio access</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Sustainable farming resources</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Email support & investment guides</span>
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
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-8 h-8 text-primary" />
                <h3 className="text-4xl md:text-5xl font-black">
                  TIER 2
                </h3>
              </div>
              <div className="text-3xl font-bold mb-6">
                <span className="text-primary">$85,000</span>
                <span className="text-lg text-foreground/60 ml-2">Investment Grant</span>
              </div>
              <p className="text-xl text-foreground/70 mb-6">
                Upgrade to Tier 2 for advanced trading tools, higher grant value, and the versatile Tesla Model Y. 
                Perfect for serious sustainable investors.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Tesla Model Y vehicle</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>$85,000 investment grant</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Advanced crypto trading tools</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Portfolio analytics & insights</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Community garden funding</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Priority support & market insights</span>
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
                alt="Investment Tier 2 - Tesla Model Y" 
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
                alt="Investment Tier 3 - Tesla Cybertruck Reward" 
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-8 h-8 text-primary" />
                <h3 className="text-4xl md:text-5xl font-black">
                  TIER 3
                </h3>
              </div>
              <div className="text-3xl font-bold mb-6">
                <span className="text-primary">$120,000</span>
                <span className="text-lg text-foreground/60 ml-2">Investment Grant</span>
              </div>
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-primary to-yellow-500 text-white rounded-full text-sm font-bold mb-6">
                🏆 INCLUDES CYBERTRUCK REWARD
              </div>
              <p className="text-xl text-foreground/70 mb-6">
                The ultimate sustainable investment package. Get AI-powered trading, maximum grants, 
                and receive both a Tesla Model S and a Cybertruck as your reward.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="font-semibold">Tesla Model S + Cybertruck reward</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>$120,000 investment grant</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>AI-powered trading algorithms</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Dedicated investment advisor</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Enterprise farming grants</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Custom API access & 24/7 concierge</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Exclusive events & networking</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-20"
        >
          <Button size="lg" className="button-gradient text-lg px-8 py-6">
            Start Your Investment Journey
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
