import { motion } from "framer-motion";
import { Star, Award, Trophy, ArrowRight, CheckCircle, Clock, Download, Wallet, Timer, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PendingUpgrade {
  id: string;
  amount_usd: number;
  created_at: string;
  verification_status: string;
}

export const TierStatusView = () => {
  const navigate = useNavigate();
  const [currentTier, setCurrentTier] = useState(1);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [timeUntilNextBonus, setTimeUntilNextBonus] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [accumulatedBonus, setAccumulatedBonus] = useState(0);
  const [pendingUpgrade, setPendingUpgrade] = useState<PendingUpgrade | null>(null);
  // Calculate time until next bonus (resets at midnight UTC)
  const calculateTimeUntilReset = useCallback(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setUTCHours(24, 0, 0, 0);
    const diff = tomorrow.getTime() - now.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return { hours, minutes, seconds };
  }, []);

  // Update countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeUntilNextBonus(calculateTimeUntilReset());
    }, 1000);

    setTimeUntilNextBonus(calculateTimeUntilReset());

    return () => clearInterval(timer);
  }, [calculateTimeUntilReset]);

  useEffect(() => {
    const fetchTierData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Investor');

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("tier_level, total_investment")
          .eq("user_id", user.id)
          .single();

        if (error) throw error;

        if (profile) {
          setCurrentTier(profile.tier_level);
          setTotalInvestment(profile.total_investment);
          
          // Calculate accumulated bonus based on tier (simulated based on days since account creation)
          const dailyBonus = profile.tier_level === 3 ? 500 : profile.tier_level === 2 ? 100 : 20;
          // Simulate some accumulated bonus (in real app, this would come from database)
          setAccumulatedBonus(dailyBonus * 3); // 3 days worth as example
        }

        // Check for pending tier upgrade transactions
        const { data: pendingTx } = await supabase
          .from("crypto_transactions")
          .select("id, amount_usd, created_at, verification_status")
          .eq("user_id", user.id)
          .eq("purpose", "tier-upgrade")
          .eq("verification_status", "pending")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (pendingTx) {
          setPendingUpgrade(pendingTx);
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

  const handleDownloadCertificate = () => {
    // Generate a simple certificate as downloadable content
    const tierNames = ['Gateway', 'Quantum Leap', 'VIP Legacy'];
    const tierName = tierNames[currentTier - 1];
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    const certificateContent = `
═══════════════════════════════════════════════════════════════
                    CERTIFICATE OF ACKNOWLEDGMENT
═══════════════════════════════════════════════════════════════

                         This certifies that

                            ${userName.toUpperCase()}

           is a recognized member of the ${tierName} Tier
              in the Big Green Environmental Initiative

                      Investment: $${totalInvestment.toLocaleString()}
                      Tier Level: ${currentTier}
                      Date Issued: ${date}

                    Daily Rewards: $${currentTier === 3 ? 500 : currentTier === 2 ? 100 : 20}

═══════════════════════════════════════════════════════════════
                     Big Green Environmental
                  Committed to a Sustainable Future
═══════════════════════════════════════════════════════════════
    `;

    const blob = new Blob([certificateContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BigGreen_Certificate_Tier${currentTier}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Certificate downloaded successfully!");
  };

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

  // Calculate withdrawable amount ($65,000 base + accumulated bonus)
  const baseWithdrawable = 65000;
  const withdrawableAmount = baseWithdrawable + accumulatedBonus;
  const portfolioValue = totalInvestment + withdrawableAmount;
  const dailyBonusAmount = currentTier === 3 ? 500 : currentTier === 2 ? 100 : 20;

  return (
    <div className="space-y-6">
      {/* Pending Tier Upgrade Banner */}
      {pendingUpgrade && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-xl border border-yellow-500/40 rounded-2xl p-5"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/30 flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-400 animate-pulse" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                Tier Upgrade Pending Verification
                <span className="px-2 py-0.5 bg-yellow-500/30 text-yellow-300 text-xs rounded-full">
                  Processing
                </span>
              </h4>
              <p className="text-white/60 text-sm">
                Your ${pendingUpgrade.amount_usd.toLocaleString()} tier upgrade payment is being verified by our team. 
                This usually takes 24-48 hours.
              </p>
              <p className="text-white/40 text-xs mt-1">
                Submitted on {new Date(pendingUpgrade.created_at).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Portfolio & Daily Bonus Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Portfolio Value Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-xl border border-green-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Portfolio Value</p>
              <p className="text-sm text-white/40">Withdrawable Amount</p>
            </div>
          </div>
          <p className="text-4xl font-bold text-white mb-2">${withdrawableAmount.toLocaleString()}</p>
          <div className="flex items-center justify-between">
            <span className="px-2 py-1 bg-green-500/20 rounded-lg text-green-400 text-sm">+${accumulatedBonus} earned</span>
            <Button
              onClick={() => navigate("/withdraw")}
              size="sm"
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Withdraw
            </Button>
          </div>
        </motion.div>

        {/* Daily Bonus Countdown Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-primary/20 to-purple-600/20 backdrop-blur-xl border border-primary/30 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Timer className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Daily Bonus</p>
              <p className="text-2xl font-bold text-white">${dailyBonusAmount}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 grid grid-cols-3 gap-2">
              <div className="bg-black/30 rounded-lg p-2 text-center">
                <p className="text-2xl font-mono font-bold text-white">{String(timeUntilNextBonus.hours).padStart(2, '0')}</p>
                <p className="text-xs text-white/50">Hours</p>
              </div>
              <div className="bg-black/30 rounded-lg p-2 text-center">
                <p className="text-2xl font-mono font-bold text-white">{String(timeUntilNextBonus.minutes).padStart(2, '0')}</p>
                <p className="text-xs text-white/50">Min</p>
              </div>
              <div className="bg-black/30 rounded-lg p-2 text-center">
                <p className="text-2xl font-mono font-bold text-white">{String(timeUntilNextBonus.seconds).padStart(2, '0')}</p>
                <p className="text-xs text-white/50">Sec</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-white/40 mt-3 text-center">Until next bonus</p>
        </motion.div>

        {/* Certificate Download Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-yellow-500/20 to-orange-600/20 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <Award className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Certificate</p>
              <p className="text-sm text-white/40">Tier {currentTier} Member</p>
            </div>
          </div>
          <p className="text-sm text-white/70 mb-4">Download your official certificate of acknowledgment</p>
          <Button
            onClick={handleDownloadCertificate}
            className="w-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/30"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Certificate
          </Button>
        </motion.div>
      </div>

      {/* Current Tier Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-white/60 text-sm mb-1">Total Grant</p>
            <p className="text-2xl font-bold text-white">{currentTierData.grant}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-white/60 text-sm mb-1">Daily Bonus</p>
            <p className="text-2xl font-bold text-white">{currentTierData.dailyBonus}</p>
            {currentTierData.frequency && (
              <p className="text-white/60 text-xs mt-1">{currentTierData.frequency}</p>
            )}
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-white/60 text-sm mb-1">Earned So Far</p>
            <p className="text-2xl font-bold text-green-400">${accumulatedBonus}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-white/60 text-sm mb-1">Can Withdraw</p>
            <p className="text-2xl font-bold text-primary">${withdrawableAmount.toLocaleString()}</p>
          </div>
        </div>

        {currentTierData.special && (
          <div className={`bg-gradient-to-r ${currentTierData.color} rounded-xl p-4 mb-6`}>
            <p className="text-white font-bold text-center">{currentTierData.special}</p>
          </div>
        )}

        {/* Cybertruck Button for Tier 3 */}
        {currentTier === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 mb-6 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center">
                  <Truck className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">Tesla Cybertruck</h4>
                  <p className="text-white/60 text-sm">Your complimentary VIP reward is ready to customize</p>
                </div>
              </div>
              <Button
                onClick={() => navigate("/cybertruck-customize")}
                className="bg-white text-black hover:bg-white/90 font-bold px-6"
              >
                <Truck className="w-4 h-4 mr-2" />
                Customize Cybertruck
              </Button>
            </div>
          </motion.div>
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
              transition={{ delay: 0.4 + index * 0.1 }}
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
                  onClick={() => navigate("/crypto-payment", { 
                    state: { 
                      amount: tier.id === 2 ? 1000 : 3500,
                      purpose: "tier-upgrade",
                      targetTier: tier.id
                    }
                  })}
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
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-primary/10 to-yellow-500/10 border-2 border-primary/20 rounded-2xl p-6 text-center"
        >
          <h3 className="text-xl font-bold text-white mb-2">
            Ready to Upgrade?
          </h3>
          <p className="text-white/70 mb-4">
            Unlock higher rewards and exclusive benefits with the next tier
          </p>
          <Button
            onClick={() => navigate("/crypto-payment", { 
              state: { 
                amount: currentTier === 1 ? 1000 : 3500,
                purpose: "tier-upgrade",
                targetTier: currentTier + 1
              }
            })}
            className="bg-gradient-to-r from-primary to-yellow-500 text-white hover:opacity-90"
          >
            Upgrade to Tier {currentTier + 1}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </div>
  );
};
