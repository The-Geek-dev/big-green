import { motion } from "framer-motion";
import { Star, Award, Trophy, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const TierStatusView = () => {
  const navigate = useNavigate();
  const [currentTier, setCurrentTier] = useState(1);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTierData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("tier_level, total_investment")
          .eq("user_id", user.id)
          .single();

        if (error) throw error;

        if (profile) {
          setCurrentTier(profile.tier_level);
          setTotalInvestment(profile.total_investment);
        }
      } catch (error) {
        console.error("Error fetching tier data:", error);
        toast.error("Failed to load tier information");
      } finally {
        setLoading(false);
      }
    };

    fetchTierData();

    // Set up real-time subscription for tier updates
    const setupRealtimeSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase
        .channel("tier-updates")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "profiles",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            if (payload.new) {
              setCurrentTier(payload.new.tier_level);
              setTotalInvestment(payload.new.total_investment);
              toast.success("Your tier has been updated!");
            }
          }
        )
        .subscribe();

      return channel;
    };

    let channel: any;
    setupRealtimeSubscription().then(ch => channel = ch);

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const tiers = [
    {
      id: 1,
      name: "Tier 1: The Gateway",
      icon: Star,
      grant: "$65,000",
      dailyBonus: "$20",
      color: "from-green-500 to-emerald-600",
      benefits: [
        "$65,000 instant grant eligibility",
        "$20 consistent daily bonus",
        "Official welcome packet via email",
        "Certificate of acknowledgment",
        "Basic crypto portfolio access"
      ]
    },
    {
      id: 2,
      name: "Tier 2: The Quantum Leap",
      icon: Award,
      grant: "$50,000",
      dailyBonus: "$100",
      investment: "$1,000",
      color: "from-primary to-purple-600",
      benefits: [
        "$100 daily rewards",
        "$50,000 withdrawal capacity",
        "24/7 premium support team",
        "Priority processing on all requests",
        "Advanced analytics dashboard",
        "Certificate and documents via email"
      ],
      badge: "Most Popular"
    },
    {
      id: 3,
      name: "Tier 3: The VIP Legacy",
      icon: Trophy,
      grant: "Unlimited",
      dailyBonus: "$500",
      frequency: "Every 4 hours",
      color: "from-primary to-yellow-500",
      benefits: [
        "$500 daily rewards (every 4 hours)",
        "Unlimited instant withdrawals",
        "Complimentary Cybertruck eligibility",
        "Tier 3 certificate via email",
        "All vehicle documents for Cybertruck",
        "AI-powered trading & dedicated advisor",
        "VIP exclusive events & networking"
      ],
      special: "🏆 COMPLIMENTARY CYBERTRUCK INCLUDED"
    }
  ];

  const currentTierData = tiers.find(t => t.id === currentTier) || tiers[0];
  const TierIcon = currentTierData.icon;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Tier Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentTierData.color} flex items-center justify-center`}>
              <TierIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{currentTierData.name}</h3>
              <p className="text-white/60">Total Investment: ${totalInvestment.toLocaleString()}</p>
            </div>
          </div>
          {currentTierData.badge && (
            <div className="px-4 py-2 bg-white/10 rounded-full text-sm font-medium text-white">
              {currentTierData.badge}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-white/60 text-sm mb-1">Total Grant</p>
            <p className="text-3xl font-bold text-white">{currentTierData.grant}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-white/60 text-sm mb-1">Daily Bonus</p>
            <p className="text-3xl font-bold text-white">{currentTierData.dailyBonus}</p>
            {currentTierData.frequency && (
              <p className="text-white/60 text-xs mt-1">{currentTierData.frequency}</p>
            )}
          </div>
        </div>

        {currentTierData.special && (
          <div className={`bg-gradient-to-r ${currentTierData.color} rounded-xl p-4 mb-6`}>
            <p className="text-white font-bold text-center">{currentTierData.special}</p>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-white/80 font-medium mb-3">Your Benefits:</p>
          {currentTierData.benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span className="text-white/70">{benefit}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* All Tiers Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        {tiers.map((tier, index) => {
          const Icon = tier.icon;
          const isCurrentTier = tier.id === currentTier;
          
          return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white/5 border-2 rounded-2xl p-6 transition-all duration-300 ${
                isCurrentTier 
                  ? 'border-primary shadow-lg shadow-primary/20' 
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{tier.name.split(':')[1]}</h4>
                  {tier.badge && (
                    <span className="text-xs text-primary">{tier.badge}</span>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div>
                  <p className="text-white/50 text-xs">Daily Rewards</p>
                  <p className="text-white font-bold text-xl">{tier.dailyBonus}</p>
                </div>
                {tier.investment && (
                  <div className="text-xs text-white/50">
                    Requires ${tier.investment} investment
                  </div>
                )}
              </div>

              {isCurrentTier ? (
                <div className="px-3 py-1.5 bg-primary/20 rounded-lg text-center">
                  <span className="text-primary text-sm font-medium">Current Tier</span>
                </div>
              ) : tier.id > currentTier ? (
                <Button
                  onClick={() => navigate("/investment")}
                  variant="outline"
                  size="sm"
                  className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  Upgrade
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : null}
            </motion.div>
          );
        })}
      </div>

      {/* Upgrade CTA */}
      {currentTier < 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-primary/10 to-yellow-500/10 border-2 border-primary/20 rounded-2xl p-6 text-center"
        >
          <h3 className="text-xl font-bold text-white mb-2">
            Ready to Upgrade?
          </h3>
          <p className="text-white/70 mb-4">
            Unlock higher rewards and exclusive benefits with the next tier
          </p>
          <Button
            onClick={() => navigate("/investment")}
            className="bg-gradient-to-r from-primary to-yellow-500 text-white hover:opacity-90"
          >
            Explore Investment Options
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </div>
  );
};
