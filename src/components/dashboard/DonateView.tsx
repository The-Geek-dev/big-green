import { Heart, Target, Users, Sprout, CreditCard, QrCode } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export const DonateView = () => {
  const [amount, setAmount] = useState("");
  const presetAmounts = [10, 25, 50, 100, 250];

  const impactAreas = [
    {
      icon: Sprout,
      title: "Urban Gardens",
      description: "Fund community garden projects in urban areas",
      raised: "$0",
      goal: "$10,000"
    },
    {
      icon: Users,
      title: "Education Programs",
      description: "Support sustainability education initiatives",
      raised: "$0",
      goal: "$5,000"
    },
    {
      icon: Target,
      title: "Green Technology",
      description: "Invest in renewable energy solutions",
      raised: "$0",
      goal: "$15,000"
    }
  ];

  const handleDonate = () => {
    if (!amount) {
      toast.error("Please enter a donation amount");
      return;
    }
    toast.success(`Thank you for your pledge of $${amount}!`);
    setAmount("");
  };

  return (
    <div className="space-y-6">
      <div className="text-center max-w-3xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Make an Impact Through Giving</h2>
        <p className="text-white/70 text-lg">
          Your donation helps create sustainable communities and environmental projects. 
          Every contribution, no matter the size, makes a real difference.
        </p>
      </div>

      <Card className="bg-white/5 border-white/10 p-8 max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold text-white mb-6">Choose Your Contribution</h3>
        
        <div className="grid grid-cols-5 gap-3 mb-6">
          {presetAmounts.map((preset) => (
            <Button
              key={preset}
              onClick={() => setAmount(preset.toString())}
              variant={amount === preset.toString() ? "default" : "outline"}
              className={amount === preset.toString() 
                ? "bg-white text-black hover:bg-white/90" 
                : "border-white/20 text-white hover:bg-white/10"
              }
            >
              ${preset}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-white/70 mb-2 block">Custom Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60">$</span>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>

          <Button 
            onClick={handleDonate}
            className="w-full bg-white text-black hover:bg-white/90 h-12"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Continue to Payment
          </Button>

          <div className="flex items-center justify-center gap-4 pt-4">
            <div className="text-center">
              <QrCode className="w-8 h-8 text-white/40 mx-auto mb-1" />
              <span className="text-xs text-white/60">Crypto accepted</span>
            </div>
          </div>
        </div>
      </Card>

      <div>
        <h3 className="text-2xl font-bold text-white mb-4 text-center">Where Your Donation Goes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {impactAreas.map((area, index) => {
            const Icon = area.icon;
            return (
              <Card key={index} className="bg-white/5 border-white/10 p-6 hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">{area.title}</h4>
                <p className="text-white/60 text-sm mb-4">{area.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Raised</span>
                    <span className="text-white font-medium">{area.raised}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" style={{ width: "0%" }} />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Goal: {area.goal}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30 p-6 text-center">
        <p className="text-white/90 mb-2">
          <span className="font-semibold">Tax deductible:</span> Your donation may be tax-deductible. Consult your tax advisor for details.
        </p>
        <p className="text-white/70 text-sm">
          100% of your donation goes directly to environmental and community projects.
        </p>
      </Card>
    </div>
  );
};
