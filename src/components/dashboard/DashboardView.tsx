import { Card, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDownToLine, ArrowUpFromLine, Clock, CheckCircle, XCircle, TrendingUp, Heart, Award, Briefcase, Shield, Star, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface DashboardViewProps {
  userEmail: string;
  applicationType: string;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
}

// Config per application type
const APP_CONFIG: Record<string, {
  label: string;
  baseGrant: number;
  icon: React.ElementType;
  gradient: string;
  accentColor: string;
  chartColor: string;
  description: string;
}> = {
  business_funding: {
    label: "Business Funding",
    baseGrant: 150000,
    icon: Briefcase,
    gradient: "from-emerald-500/20 to-teal-600/20",
    accentColor: "text-emerald-400",
    chartColor: "#10b981",
    description: "Your business funding portfolio",
  },
  "business funding": {
    label: "Business Funding",
    baseGrant: 150000,
    icon: Briefcase,
    gradient: "from-emerald-500/20 to-teal-600/20",
    accentColor: "text-emerald-400",
    chartColor: "#10b981",
    description: "Your business funding portfolio",
  },
  grant: {
    label: "Grant",
    baseGrant: 65000,
    icon: Award,
    gradient: "from-green-500/20 to-emerald-600/20",
    accentColor: "text-green-400",
    chartColor: "#22c55e",
    description: "Your grant funding overview",
  },
  "grant application": {
    label: "Grant",
    baseGrant: 65000,
    icon: Award,
    gradient: "from-green-500/20 to-emerald-600/20",
    accentColor: "text-green-400",
    chartColor: "#22c55e",
    description: "Your grant funding overview",
  },
  investment: {
    label: "Investment",
    baseGrant: 65000,
    icon: TrendingUp,
    gradient: "from-blue-500/20 to-indigo-600/20",
    accentColor: "text-blue-400",
    chartColor: "#3b82f6",
    description: "Your investment portfolio",
  },
  donation: {
    label: "Donation",
    baseGrant: 65000,
    icon: Heart,
    gradient: "from-pink-500/20 to-rose-600/20",
    accentColor: "text-pink-400",
    chartColor: "#ec4899",
    description: "Your donation impact overview",
  },
};

const DEFAULT_CONFIG = APP_CONFIG.grant;

export const DashboardView = ({ userEmail, applicationType }: DashboardViewProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ tier_level: number; total_investment: number; impact_score: number } | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chartPeriod, setChartPeriod] = useState<"1D" | "1W" | "1M" | "All">("1M");
  const [activeBottomTab, setActiveBottomTab] = useState<"positions" | "history">("positions");
  const [applications, setApplications] = useState<{ id: string; application_type: string; status: string; created_at: string }[]>([]);

  const config = APP_CONFIG[applicationType] || DEFAULT_CONFIG;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("tier_level, total_investment, impact_score")
          .eq("user_id", user.id)
          .maybeSingle();

        if (profileData) setProfile(profileData);

        // Fetch recent transactions (crypto + withdrawals)
        const { data: cryptoTx } = await supabase
          .from("crypto_transactions")
          .select("id, amount_usd, verification_status, created_at, purpose")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        const { data: withdrawals } = await supabase
          .from("withdrawal_requests")
          .select("id, amount, status, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        // Fetch active applications
        const { data: apps } = await supabase
          .from("applications")
          .select("id, application_type, status, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (apps) setApplications(apps);

        const combined: Transaction[] = [
          ...(cryptoTx || []).map((t) => ({
            id: t.id,
            type: t.purpose === "tier-upgrade" ? "Tier Upgrade" : "Deposit",
            amount: t.amount_usd,
            status: t.verification_status,
            created_at: t.created_at,
          })),
          ...(withdrawals || []).map((w) => ({
            id: w.id,
            type: "Withdrawal",
            amount: w.amount,
            status: w.status,
            created_at: w.created_at,
          })),
        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 8);

        setTransactions(combined);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const tierLevel = profile?.tier_level || 1;
  const dailyBonus = tierLevel === 3 ? 500 : tierLevel === 2 ? 100 : 20;
  const accumulatedBonus = dailyBonus * 3;
  const totalBalance = config.baseGrant + accumulatedBonus;
  const totalCash = config.baseGrant + accumulatedBonus;

  // Generate chart data based on period
  const generateChartData = () => {
    const points = chartPeriod === "1D" ? 24 : chartPeriod === "1W" ? 7 : chartPeriod === "1M" ? 30 : 12;
    const labels = chartPeriod === "1D"
      ? Array.from({ length: points }, (_, i) => `${i}h`)
      : chartPeriod === "1W"
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : chartPeriod === "1M"
      ? Array.from({ length: 30 }, (_, i) => `${i + 1}`)
      : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Simulate a growth line toward current balance
    return labels.map((label, i) => ({
      time: label,
      value: Math.round((totalBalance / points) * (i + 1) * (0.85 + Math.random() * 0.3)),
    }));
  };

  const chartData = generateChartData();

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getStatusIcon = (status: string) => {
    if (status === "verified" || status === "approved") return <CheckCircle className="w-4 h-4 text-green-400" />;
    if (status === "rejected") return <XCircle className="w-4 h-4 text-red-400" />;
    return <Clock className="w-4 h-4 text-yellow-400" />;
  };

  const getStatusLabel = (status: string) => {
    if (status === "verified" || status === "approved") return "Completed";
    if (status === "rejected") return "Rejected";
    return "In progress";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  const Icon = config.icon;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* User Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <Icon className={`w-5 h-5 ${config.accentColor}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-white">{userEmail.split("@")[0]}</p>
            <p className="text-xs text-white/50">{config.label} Account</p>
          </div>
        </div>
      </motion.div>

      {/* Balance Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center py-6"
      >
        <p className="text-5xl md:text-6xl font-bold text-white tracking-tight">
          ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </p>
        <div className="flex items-center justify-center gap-3 mt-2">
          <span className={`text-sm font-medium ${config.accentColor}`}>
            +${accumulatedBonus.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          <span className="text-sm text-white/50">
            ${totalCash.toLocaleString()} cash
          </span>
        </div>
      </motion.div>

      {/* Portfolio Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={config.chartColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={config.chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" hide />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  padding: "6px 10px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "#fff" }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, "Value"]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={config.chartColor}
                strokeWidth={2}
                fill="url(#chartGradient)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2 mt-4">
          {(["1D", "1W", "1M", "All"] as const).map((period) => (
            <button
              key={period}
              onClick={() => setChartPeriod(period)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                chartPeriod === period
                  ? "bg-white/15 text-white"
                  : "text-white/50 hover:text-white/75"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Deposit / Withdraw Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 gap-3"
      >
        <Button
          onClick={() => navigate("/crypto-payment")}
          className="bg-white text-black hover:bg-white/90 rounded-full py-6 text-base font-semibold"
        >
          <ArrowDownToLine className="w-5 h-5 mr-2" />
          Deposit
        </Button>
        <Button
          onClick={() => navigate("/withdraw")}
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10 rounded-full py-6 text-base font-semibold"
        >
          <ArrowUpFromLine className="w-5 h-5 mr-2" />
          Withdraw
        </Button>
      </motion.div>

      {/* Positions / History */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-0">
            <div className="flex border-b border-white/10">
              <button
                onClick={() => setActiveBottomTab("positions")}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeBottomTab === "positions"
                    ? "text-white border-b-2 border-white"
                    : "text-white/50 hover:text-white"
                }`}
              >
                Positions
              </button>
              <button
                onClick={() => setActiveBottomTab("history")}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeBottomTab === "history"
                    ? "text-white border-b-2 border-white"
                    : "text-white/50 hover:text-white"
                }`}
              >
                History
              </button>
            </div>

            {activeBottomTab === "positions" ? (
              <div className="divide-y divide-white/5">
                {/* Tier Status Card */}
                <div className="px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tierLevel === 3 ? "bg-yellow-500/20" : tierLevel === 2 ? "bg-purple-500/20" : "bg-white/10"
                      }`}>
                        {tierLevel === 3 ? <Star className="w-5 h-5 text-yellow-400" /> :
                         tierLevel === 2 ? <Zap className="w-5 h-5 text-purple-400" /> :
                         <Shield className="w-5 h-5 text-white/70" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {tierLevel === 3 ? "VIP Legacy" : tierLevel === 2 ? "Quantum Leap" : "Gateway"}
                        </p>
                        <p className="text-xs text-white/50">Tier {tierLevel} · ${dailyBonus}/day bonus</p>
                      </div>
                    </div>
                    <Badge className={`${
                      tierLevel === 3 ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                      tierLevel === 2 ? "bg-purple-500/20 text-purple-400 border-purple-500/30" :
                      "bg-white/10 text-white/70 border-white/20"
                    }`}>
                      Tier {tierLevel}
                    </Badge>
                  </div>
                </div>

                {/* Holdings */}
                <div className="px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                        <Icon className={`w-5 h-5 ${config.accentColor}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{config.label} Balance</p>
                        <p className="text-xs text-white/50">Base + bonuses</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                      <p className={`text-xs ${config.accentColor}`}>+${accumulatedBonus.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Total Investment */}
                {(profile?.total_investment ?? 0) > 0 && (
                  <div className="px-5 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">Total Invested</p>
                          <p className="text-xs text-white/50">Verified deposits</p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-white">${(profile?.total_investment ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                )}

                {/* Active Applications / Grants / Funding */}
                {applications.length > 0 && (
                  <>
                    <div className="px-5 pt-4 pb-2">
                      <p className="text-xs font-medium text-white/40 uppercase tracking-wider">Active Positions</p>
                    </div>
                    {applications.map((app) => (
                      <div key={app.id} className="px-5 py-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                              {app.application_type === "business_funding" || app.application_type === "business funding"
                                ? <Briefcase className="w-4 h-4 text-emerald-400" />
                                : app.application_type === "investment"
                                ? <TrendingUp className="w-4 h-4 text-blue-400" />
                                : app.application_type === "donation"
                                ? <Heart className="w-4 h-4 text-pink-400" />
                                : <Award className="w-4 h-4 text-green-400" />}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white capitalize">
                                {app.application_type.replace(/_/g, " ")}
                              </p>
                              <p className="text-xs text-white/40">
                                {new Date(app.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge className={`text-xs ${
                            app.status === "approved" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                            app.status === "rejected" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                            "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                          }`}>
                            {app.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {applications.length === 0 && (profile?.total_investment ?? 0) === 0 && (
                  <div className="py-8 text-center text-white/50 text-sm">
                    No active positions yet.
                  </div>
                )}
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {transactions.length === 0 ? (
                  <div className="py-12 text-center text-white/50 text-sm">
                    No transactions yet. Make your first deposit to get started.
                  </div>
                ) : (
                  transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                          {getStatusIcon(tx.status)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{tx.type}</p>
                          <p className="text-xs text-white/50">{getStatusLabel(tx.status)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-white">
                          ${tx.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-white/40">{formatTimeAgo(tx.created_at)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
