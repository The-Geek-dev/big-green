import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Calendar, Plus } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const chartData = [
  { time: "Jan", value: 0 },
  { time: "Feb", value: 0 },
  { time: "Mar", value: 0 },
  { time: "Apr", value: 0 },
  { time: "May", value: 0 },
  { time: "Jun", value: 0 },
  { time: "Jul", value: 0 },
  { time: "Aug", value: 0 },
];

const transactions: Array<{ name: string; change: string; date: string; amount: string; status: string }> = [];

export const DashboardView = ({ userEmail }: { userEmail: string }) => {
  const navigate = useNavigate();

  const handleStartNewProject = () => {
    navigate("/application");
  };

  return (
    <>
      {/* Welcome Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Welcome back, {userEmail.split('@')[0]}</h1>
          <p className="text-white/50">Here's your environmental impact and garden analytics.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
            <Calendar className="w-4 h-4 mr-2" />
            January 2024 - August 2024
          </Button>
          <Button size="sm" className="bg-green-500 hover:bg-green-600 text-black font-medium" onClick={handleStartNewProject}>
            <Plus className="w-4 h-4 mr-2" />
            Start New Project
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Left Stats Column */}
        <div className="space-y-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <p className="text-xs text-white/50 uppercase tracking-wide mb-2">Impact This Month</p>
              <p className="text-4xl font-bold mb-2">0<span className="text-2xl text-white/50"> people</span></p>
              <div className="space-y-3 mt-4">
                <div>
                  <p className="text-xs text-white/50 mb-1">MONTHLY GROWTH</p>
                  <p className="text-white/70 text-sm font-medium">0%</p>
                </div>
                <div>
                  <p className="text-xs text-white/50 mb-1">ACTIVE GARDENS</p>
                  <p className="text-sm font-medium">0 gardens</p>
                </div>
                <div>
                  <p className="text-xs text-white/50 mb-1">TOTAL CO₂ OFFSET</p>
                  <p className="text-sm font-medium">0 tons</p>
                </div>
                <div>
                  <p className="text-xs text-white/50 mb-1">ENERGY SAVED</p>
                  <p className="text-sm font-medium">0 kWh</p>
                </div>
              </div>
              <Button 
                className="w-full mt-6 bg-green-500 hover:bg-green-600 text-black font-medium"
                onClick={() => toast.info("No data available to download yet")}
              >
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
              <CardTitle className="text-lg">Community Impact</CardTitle>
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
                <span className="text-xs text-white/50">Gardens</span>
                <span className="text-sm font-bold">0</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                <span className="text-xs text-white/50">Members</span>
                <span className="text-sm font-bold">0</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Impact Score */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <p className="text-sm text-white/50 mb-4">Your impact score</p>
              <div className="relative w-40 h-40 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="#ffffff10" strokeWidth="12" fill="none" />
                  <circle cx="80" cy="80" r="70" stroke="#10b981" strokeWidth="12" fill="none" strokeDasharray={`${70 * 2 * Math.PI * 0} ${70 * 2 * Math.PI}`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-sm text-white/50 mb-1">0%</div>
                  <div className="text-5xl font-bold">-</div>
                  <div className="text-white/50 text-xs mt-1">No data</div>
                </div>
              </div>
              <p className="text-xs text-white/50 text-center">No activity yet</p>
              <p className="text-sm text-center mt-2">Start your first project to begin tracking impact</p>
            </CardContent>
          </Card>

          {/* Garden Stats Card */}
          <Card className="bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-white text-lg">🌱</span>
                  </div>
                  <div>
                    <p className="font-medium">Active Gardens</p>
                    <p className="text-xs text-white/50">Your Projects</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/50">Growth Rate</p>
                  <p className="text-sm font-bold text-white/50">0%</p>
                </div>
              </div>
              <p className="text-3xl font-bold mt-4">0</p>
              <p className="text-white/50 text-xs">No gardens yet</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Activity History */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl">Recent Activity</CardTitle>
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
              {transactions.length === 0 ? (
                <TableRow className="border-white/10">
                  <TableCell colSpan={4} className="text-center text-white/50 py-8">
                    No activity yet. Start your first project to see your impact!
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction, index) => (
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
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};
