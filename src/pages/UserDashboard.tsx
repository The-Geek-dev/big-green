import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import logoColor from "@/assets/logo-color.png";
import { LogOut, Home, LayoutDashboard, FileText, TrendingUp, ArrowLeftRight, Users, Calendar, Download, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const chartData = [
  { time: "2:00pm", value: 8000 },
  { time: "3:00pm", value: 8200 },
  { time: "4:00pm", value: 8100 },
  { time: "5:00pm", value: 8420 },
  { time: "6:00pm", value: 8500 },
  { time: "7:00pm", value: 8350 },
  { time: "8:00pm", value: 8420 },
  { time: "9:00pm", value: 8500 },
];

const transactions = [
  { name: "Urban Farming Grant", change: "-8.43%", date: "12 Jun, 2024", amount: "$14,092.33", status: "Success" },
  { name: "Solar Initiative", change: "+2.34%", date: "16 May, 2024", amount: "$2,439.00", status: "Success" },
  { name: "Tree Planting Fund", change: "+16.84", date: "21 Feb, 2024", amount: "$687.00", status: "Success" },
];

const UserDashboard = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  
  useEffect(() => {
    // Check if user is logged in and verified
    supabase.auth.getSession().then(async ({
      data: {
        session
      }
    }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUserEmail(session.user.email || "");
        
        // Check application status
        const { data: applicationData } = await supabase
          .from("applications")
          .select("status")
          .eq("user_id", session.user.id)
          .maybeSingle();
        
        // Redirect to verification page if not approved
        if (!applicationData || applicationData.status !== "approved") {
          navigate("/dashboard");
          return;
        }
        
        // Check if user is admin
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin")
          .maybeSingle();
        
        setIsAdmin(!!roleData);
      }
    });

    // Listen for auth changes
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate("/auth");
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
  };

  return <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-20 bg-black border-r border-white/10 flex flex-col items-center py-8 gap-6">
        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl font-bold">
          P
        </div>
        <div className="flex flex-col gap-3">
          <button className="w-12 h-12 rounded-xl bg-white flex items-center justify-center hover:bg-white/90 transition-colors">
            <LayoutDashboard className="w-5 h-5 text-black" />
          </button>
          <button className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
            <FileText className="w-5 h-5 text-white" />
          </button>
          <button className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
            <TrendingUp className="w-5 h-5 text-white" />
          </button>
          <button className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
            <ArrowLeftRight className="w-5 h-5 text-white" />
          </button>
          <button className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
            <Users className="w-5 h-5 text-white" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <header className="bg-black border-b border-white/10 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              {["Dashboard", "Reports", "Projects", "Community"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-sm font-medium transition-colors ${
                    activeTab === tab ? "text-white" : "text-white/50 hover:text-white/75"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600"></div>
                <div className="text-right">
                  <p className="text-xs font-medium">Admin User</p>
                  <p className="text-xs text-white/50">{userEmail}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-white/50 hover:text-white">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-8 overflow-auto bg-gradient-to-br from-black via-black to-green-950/20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Welcome Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-1">Welcome back, {userEmail.split('@')[0]}</h1>
                <p className="text-white/50">Here's a look at your performance and analytics.</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                  <Calendar className="w-4 h-4 mr-2" />
                  January 2024 - May 2024
                </Button>
                <Button size="sm" className="bg-green-500 hover:bg-green-600 text-black font-medium">
                  <Plus className="w-4 h-4 mr-2" />
                  Add new coin
                </Button>
              </div>
            </div>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-3 gap-6 mb-6">
              {/* Left Stats Column */}
              <div className="space-y-6">
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <p className="text-xs text-white/50 uppercase tracking-wide mb-2">Spent This Month</p>
                    <p className="text-4xl font-bold mb-2">$5,950<span className="text-2xl text-white/50">.64</span></p>
                    <div className="space-y-3 mt-4">
                      <div>
                        <p className="text-xs text-white/50 mb-1">24HR CHANGE</p>
                        <p className="text-green-400 text-sm font-medium">+ 2.34%</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/50 mb-1">VOLUME (24H)</p>
                        <p className="text-sm font-medium">$84.42B</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/50 mb-1">MARKET CAP</p>
                        <p className="text-sm font-medium">$804.42B</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/50 mb-1">AVG MONTHLY GROWING</p>
                        <p className="text-sm font-medium">$804.42B</p>
                      </div>
                    </div>
                    <Button className="w-full mt-6 bg-green-500 hover:bg-green-600 text-black font-medium">
                      <Download className="w-4 h-4 mr-2" />
                      Download Report
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Center Chart */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm lg:col-span-1">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Active credit</CardTitle>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="time" stroke="#ffffff50" style={{ fontSize: '10px' }} />
                      <YAxis stroke="#ffffff50" style={{ fontSize: '10px' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#000', 
                          border: '1px solid #ffffff20',
                          borderRadius: '8px',
                          padding: '8px'
                        }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        fill="url(#colorValue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-xs text-white/50">1 BTC</span>
                      <span className="text-sm font-bold">$8,420.04</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="text-xs text-white/50">1 ETH</span>
                      <span className="text-sm font-bold">$2,980.81</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Credit Score */}
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <p className="text-sm text-white/50 mb-4">Your credit score</p>
                    <div className="relative w-40 h-40 mx-auto mb-4">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="#ffffff10"
                          strokeWidth="12"
                          fill="none"
                        />
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="#10b981"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${70 * 2 * Math.PI * 0.8} ${70 * 2 * Math.PI}`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-sm text-white/50 mb-1">80%</div>
                        <div className="text-5xl font-bold">660</div>
                        <div className="text-green-400 text-xs mt-1">+2.34%</div>
                      </div>
                    </div>
                    <p className="text-xs text-white/50 text-center">Last Check on 21 Apr</p>
                    <p className="text-sm text-center mt-2">Your credit score is average</p>
                  </CardContent>
                </Card>

                {/* Bitcoin Card */}
                <Card className="bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                          <span className="text-white font-bold">₿</span>
                        </div>
                        <div>
                          <p className="font-medium">Bitcoin</p>
                          <p className="text-xs text-white/50">BTC</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-white/50">Reward Rate</p>
                        <p className="text-sm font-bold text-green-400">14.7%</p>
                      </div>
                    </div>
                    <p className="text-3xl font-bold mt-4">$52,291</p>
                    <p className="text-green-400 text-xs">+9.06%</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Payment History */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-white/50">NAME</TableHead>
                      <TableHead className="text-white/50">DATE</TableHead>
                      <TableHead className="text-white/50">PRICE</TableHead>
                      <TableHead className="text-white/50">STATUS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction, index) => (
                      <TableRow key={index} className="border-white/10 hover:bg-white/5">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500"></div>
                            <div>
                              <p className="font-medium">{transaction.name}</p>
                              <p className={`text-xs ${transaction.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                                {transaction.change}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-white/70">{transaction.date}</TableCell>
                        <TableCell className="text-white/70">{transaction.amount}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1 text-xs text-green-400">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                            {transaction.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

          </motion.div>
        </div>
      </div>
    </div>;
};

export default UserDashboard;
