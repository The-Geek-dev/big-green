import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Wallet, Bitcoin, ArrowRight, AlertTriangle, Lock, Loader2, TrendingUp, Gift, Info } from "lucide-react";

const Withdraw = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const withdrawalType = (location.state as { type?: string })?.type || "grant";
  
  const [loading, setLoading] = useState(true);
  const [currentTier, setCurrentTier] = useState(1);
  const [withdrawableAmount, setWithdrawableAmount] = useState(0);
  const [selectedCrypto, setSelectedCrypto] = useState("usdt");
  const [walletAddress, setWalletAddress] = useState("");
  const [selectedAmount, setSelectedAmount] = useState("full");
  const [customAmount, setCustomAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  useEffect(() => {
    const checkTierStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/auth");
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("tier_level, total_investment")
          .eq("user_id", user.id)
          .single();

        if (error) throw error;

        if (profile) {
          setCurrentTier(profile.tier_level);
          
          if (withdrawalType === "investment") {
            // For investment withdrawals, use verified investment total
            const { data: transactions } = await supabase
              .from("crypto_transactions")
              .select("amount_usd")
              .eq("user_id", user.id)
              .eq("verification_status", "verified");
            
            if (transactions && transactions.length > 0) {
              const totalInvestment = transactions.reduce((sum, tx) => sum + Number(tx.amount_usd), 0);
              // Add estimated returns (8%)
              const estimatedReturns = Math.floor(totalInvestment * 0.08);
              setWithdrawableAmount(totalInvestment + estimatedReturns);
            } else {
              setWithdrawableAmount(0);
            }
          } else {
            // For grant withdrawals, use the original logic
            const dailyBonus = profile.tier_level === 3 ? 500 : profile.tier_level === 2 ? 100 : 20;
            const accumulatedBonus = dailyBonus * 3; // Simulated 3 days
            setWithdrawableAmount(65000 + accumulatedBonus);
          }
        }
      } catch (error) {
        console.error("Error fetching tier:", error);
        toast.error("Failed to load account information");
      } finally {
        setLoading(false);
      }
    };

    checkTierStatus();
  }, [navigate, withdrawalType]);

  const handleUpgrade = () => {
    navigate("/crypto-payment", { state: { amount: "1000", purpose: "tier-upgrade" } });
  };

  const handleWithdrawSubmit = async () => {
    if (!walletAddress.trim()) {
      toast.error("Please enter your wallet address");
      return;
    }

    const amount = selectedAmount === "full" ? withdrawableAmount : 
                   selectedAmount === "custom" ? parseFloat(customAmount) || 0 : 
                   parseFloat(selectedAmount) || 0;

    const MIN_WITHDRAWAL = 5000;

    if (amount <= 0) {
      toast.error("Please select a valid withdrawal amount");
      return;
    }

    if (amount < MIN_WITHDRAWAL) {
      toast.error(`Minimum withdrawal amount is $${MIN_WITHDRAWAL.toLocaleString()}`);
      return;
    }

    if (amount > withdrawableAmount) {
      toast.error("Amount exceeds available balance");
      return;
    }

    // Check tier status on submit
    if (currentTier === 1) {
      setShowUpgradePrompt(true);
      return;
    }

    setSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to submit a withdrawal request");
        return;
      }

      const { error } = await supabase
        .from("withdrawal_requests")
        .insert({
          user_id: user.id,
          amount: amount,
          crypto_type: selectedCrypto.toUpperCase(),
          wallet_address: walletAddress.trim(),
          status: "pending"
        });

      if (error) throw error;

      toast.success("Withdrawal request submitted successfully! Our team will process it within 24-48 hours.");
      navigate("/user-dashboard");
    } catch (error) {
      console.error("Error submitting withdrawal:", error);
      toast.error("Failed to submit withdrawal request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const cryptoOptions = [
    { id: "usdt", name: "USDT (TRC20)", icon: Wallet, placeholder: "Enter your USDT TRC20 wallet address" },
    { id: "btc", name: "Bitcoin (BTC)", icon: Bitcoin, placeholder: "Enter your Bitcoin wallet address" },
    { id: "eth", name: "Ethereum (ETH)", icon: Wallet, placeholder: "Enter your Ethereum wallet address" },
  ];

  const getWithdrawalAmount = () => {
    if (selectedAmount === "full") return withdrawableAmount;
    if (selectedAmount === "custom") return parseFloat(customAmount) || 0;
    return parseFloat(selectedAmount) || 0;
  };

  const amountOptions = [
    { id: "full", label: `Full Balance ($${withdrawableAmount.toLocaleString()})` },
    { id: "50000", label: "$50,000" },
    { id: "25000", label: "$25,000" },
    { id: "10000", label: "$10,000" },
    { id: "custom", label: "Custom Amount" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-2xl mx-auto px-4 py-12 mt-20">
        <AnimatePresence mode="wait">
          {showUpgradePrompt ? (
            <motion.div
              key="upgrade"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 text-center border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/10">
                <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-10 h-10 text-amber-500" />
                </div>
                
                <h1 className="text-3xl font-black mb-4">
                  Upgrade Required
                </h1>
                
                <div className="flex items-center justify-center gap-2 text-amber-600 mb-6">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">You are currently on Tier 1</span>
                </div>

                <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                  To unlock withdrawal capabilities and access your <span className="font-bold text-foreground">${withdrawableAmount.toLocaleString()}</span> funds, 
                  you need to upgrade to Tier 2: Quantum Leap.
                </p>

                <div className="bg-card rounded-xl p-4 mb-4 border text-left">
                  <p className="text-sm text-muted-foreground mb-2">Your withdrawal details:</p>
                  <p className="font-mono text-sm break-all">{walletAddress}</p>
                  <p className="text-xs text-muted-foreground mt-1">{cryptoOptions.find(c => c.id === selectedCrypto)?.name}</p>
                </div>

                <div className="bg-card rounded-xl p-6 mb-6 border">
                  <h3 className="font-bold mb-4">Tier 2 Benefits Include:</h3>
                  <ul className="text-left text-sm space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      $100 daily rewards (5x more than Tier 1)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      Full withdrawal access unlocked
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      24/7 premium support team
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      Priority processing on all requests
                    </li>
                  </ul>
                </div>

                <div className="bg-primary/10 rounded-xl p-4 mb-6">
                  <p className="text-sm text-muted-foreground">Upgrade Investment Required</p>
                  <p className="text-3xl font-black text-primary">$1,000</p>
                </div>

                <Button 
                  onClick={handleUpgrade}
                  className="button-gradient w-full py-6 text-lg font-bold"
                >
                  Upgrade to Tier 2 Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <button 
                  onClick={() => setShowUpgradePrompt(false)}
                  className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Back to withdrawal form
                </button>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  withdrawalType === "investment" 
                    ? "bg-gradient-to-br from-blue-400 to-indigo-600" 
                    : "bg-gradient-to-br from-green-400 to-emerald-600"
                }`}>
                  {withdrawalType === "investment" ? (
                    <TrendingUp className="w-8 h-8 text-white" />
                  ) : (
                    <Gift className="w-8 h-8 text-white" />
                  )}
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h1 className="text-3xl md:text-4xl font-black">
                    Withdraw {withdrawalType === "investment" ? "Investment" : "Grant"} <span className="text-gradient">Funds</span>
                  </h1>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                          <Info className="w-5 h-5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-xs p-4">
                        <p className="font-semibold mb-2">Tier Requirements for Withdrawals</p>
                        <ul className="text-sm space-y-1">
                          <li><span className="text-amber-500">• Tier 1:</span> Must upgrade to Tier 2 ($1,000) to withdraw</li>
                          <li><span className="text-blue-500">• Tier 2:</span> Full withdrawal access unlocked</li>
                          <li><span className="text-purple-500">• Tier 3:</span> Priority processing + higher limits</li>
                        </ul>
                        <p className="text-xs text-muted-foreground mt-2">Min. withdrawal: $5,000</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-muted-foreground">
                  Available balance: <span className="font-bold text-foreground">${withdrawableAmount.toLocaleString()}</span>
                </p>
                {withdrawalType === "investment" && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Includes principal + ~8% estimated returns
                  </p>
                )}
                {currentTier === 1 && (
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-600 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Tier 2 upgrade required to withdraw</span>
                  </div>
                )}
              </div>

              <Card className="p-6 mb-6">
                <h3 className="font-bold mb-4">Select Cryptocurrency</h3>
                <RadioGroup value={selectedCrypto} onValueChange={setSelectedCrypto} className="space-y-3">
                  {cryptoOptions.map((crypto) => {
                    const Icon = crypto.icon;
                    return (
                      <div
                        key={crypto.id}
                        className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedCrypto === crypto.id 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedCrypto(crypto.id)}
                      >
                        <RadioGroupItem value={crypto.id} id={crypto.id} />
                        <Icon className="w-5 h-5 text-muted-foreground" />
                        <Label htmlFor={crypto.id} className="cursor-pointer flex-1">
                          {crypto.name}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </Card>

              <Card className="p-6 mb-6">
                <Label htmlFor="wallet" className="text-base font-bold mb-3 block">
                  Your {cryptoOptions.find(c => c.id === selectedCrypto)?.name} Wallet Address
                </Label>
                <Input
                  id="wallet"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder={cryptoOptions.find(c => c.id === selectedCrypto)?.placeholder}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Make sure to double-check your wallet address. Transactions are irreversible.
                </p>
              </Card>

              <Card className="p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Select Withdrawal Amount</h3>
                  <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full font-medium">
                    Min: $5,000
                  </span>
                </div>
                <RadioGroup value={selectedAmount} onValueChange={setSelectedAmount} className="space-y-3">
                  {amountOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedAmount === option.id 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedAmount(option.id)}
                    >
                      <RadioGroupItem value={option.id} id={`amount-${option.id}`} />
                      <Label htmlFor={`amount-${option.id}`} className="cursor-pointer flex-1">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {selectedAmount === "custom" && (
                  <div className="mt-4">
                    <Label htmlFor="customAmount" className="text-sm mb-2 block">Enter Amount (USD)</Label>
                    <Input
                      id="customAmount"
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Enter amount in USD"
                      max={withdrawableAmount}
                      className="font-mono"
                    />
                    {parseFloat(customAmount) > withdrawableAmount && (
                      <p className="text-xs text-red-500 mt-1">Amount exceeds available balance</p>
                    )}
                  </div>
                )}
              </Card>

              <Card className="p-6 mb-6 bg-green-50 border-green-200">
                <h4 className="font-bold mb-2">Withdrawal Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-bold">${getWithdrawalAmount().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Network</span>
                    <span>{cryptoOptions.find(c => c.id === selectedCrypto)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Processing Time</span>
                    <span>24-48 hours</span>
                  </div>
                </div>
              </Card>

              <Button
                onClick={handleWithdrawSubmit}
                disabled={submitting || !walletAddress.trim()}
                className="button-gradient w-full py-6 text-lg font-bold"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Submit Withdrawal Request
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              <button 
                onClick={() => navigate(withdrawalType === "investment" ? "/investment" : "/user-dashboard")}
                className="w-full mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Return to {withdrawalType === "investment" ? "Investment Dashboard" : "Dashboard"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Withdraw;
