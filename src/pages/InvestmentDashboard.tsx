import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { TrendingUp, DollarSign, PieChart, Activity, ArrowUpRight } from "lucide-react";

const InvestmentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate("/auth");
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const investmentOptions = [
    {
      title: "Green Energy Portfolio",
      description: "Diversified investment in renewable energy projects",
      minInvestment: "$1,000",
      expectedReturn: "8-12% annually",
      risk: "Medium",
      icon: Activity
    },
    {
      title: "Sustainable Agriculture",
      description: "Support regenerative farming and food systems",
      minInvestment: "$5,000",
      expectedReturn: "10-15% annually",
      risk: "Medium-High",
      icon: TrendingUp
    },
    {
      title: "Impact Fund",
      description: "Mixed portfolio of high-impact sustainability ventures",
      minInvestment: "$500",
      expectedReturn: "6-10% annually",
      risk: "Low-Medium",
      icon: PieChart
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-12 mt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Investment <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Invest in sustainable projects and track your impact portfolio
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Investment</p>
                  <p className="text-2xl font-bold">$0</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Start investing to see your portfolio grow</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Returns</p>
                  <p className="text-2xl font-bold">$0</p>
                </div>
              </div>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                0% growth
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Projects</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">No active investments yet</p>
            </Card>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Investment Opportunities</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {investmentOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{option.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{option.description}</p>
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Min. Investment:</span>
                        <span className="font-semibold">{option.minInvestment}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Expected Return:</span>
                        <span className="font-semibold text-green-600">{option.expectedReturn}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Risk Level:</span>
                        <span className="font-semibold">{option.risk}</span>
                      </div>
                    </div>
                    <Button className="w-full button-gradient" onClick={() => navigate("/application")}>
                      Learn More
                    </Button>
                  </Card>
                );
              })}
            </div>
          </div>

          <Card className="p-8 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Ready to Start Investing?</h3>
                <p className="text-muted-foreground mb-4">
                  Join thousands of investors making a positive impact on the planet while growing their wealth. 
                  Complete our investment application to get started.
                </p>
                <Button size="lg" className="button-gradient" onClick={() => navigate("/application")}>
                  Start Investment Application
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default InvestmentDashboard;