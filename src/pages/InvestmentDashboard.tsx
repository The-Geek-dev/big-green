import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { InvestmentDetailsModal } from "@/components/investment/InvestmentDetailsModal";
import { LiveMarketCharts } from "@/components/investment/LiveMarketCharts";
import { TrendingUp, DollarSign, PieChart, Activity, ArrowUpRight } from "lucide-react";

const InvestmentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }
      
      setUser(session.user);
      
      // Check if user has an approved investment application (get the most recent one)
      const { data: application } = await supabase
        .from("applications")
        .select("status, application_type")
        .eq("user_id", session.user.id)
        .eq("application_type", "investment")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (!application) {
        toast.error("No investment application found. Please submit an application first.");
        navigate("/application");
        return;
      }
      
      if (application.status !== "approved") {
        toast.error("Your investment application is still pending approval.");
        navigate("/dashboard");
        return;
      }
      
      setHasAccess(true);
      setLoading(false);
    };
    
    checkAccess();

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-12 mt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Investment <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="text-lg text-gray-400">
              Invest in sustainable projects and track your impact portfolio
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 bg-gray-900 border-gray-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Investment</p>
                  <p className="text-2xl font-bold text-white">$0</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Start investing to see your portfolio grow</p>
            </Card>

            <Card className="p-6 bg-gray-900 border-gray-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Returns</p>
                  <p className="text-2xl font-bold text-white">$0</p>
                </div>
              </div>
              <p className="text-xs text-green-400 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                0% growth
              </p>
            </Card>

            <Card className="p-6 bg-gray-900 border-gray-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Active Projects</p>
                  <p className="text-2xl font-bold text-white">0</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">No active investments yet</p>
            </Card>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Investment Opportunities</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {investmentOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <Card key={index} className="p-6 bg-gray-900 border-gray-800 hover:border-green-600/50 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{option.title}</h3>
                    <p className="text-sm text-gray-400 mb-4">{option.description}</p>
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Min. Investment:</span>
                        <span className="font-semibold text-white">{option.minInvestment}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Expected Return:</span>
                        <span className="font-semibold text-green-400">{option.expectedReturn}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Risk Level:</span>
                        <span className="font-semibold text-white">{option.risk}</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full button-gradient" 
                      onClick={() => {
                        setSelectedInvestment(option);
                        setIsModalOpen(true);
                      }}
                    >
                      Learn More
                    </Button>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Live Market Charts Section */}
          <div className="mb-12">
            <LiveMarketCharts />
          </div>

          <Card className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 border-green-600/30">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">Need Help Investing?</h3>
                <p className="text-gray-400 mb-4">
                  All investments require admin verification before reflecting on your dashboard.
                  Contact support if you have any questions about the investment process.
                </p>
                <Button size="lg" className="button-gradient" onClick={() => navigate("/contact")}>
                  Contact Support
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <InvestmentDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        investment={selectedInvestment}
      />
    </div>
  );
};

export default InvestmentDashboard;