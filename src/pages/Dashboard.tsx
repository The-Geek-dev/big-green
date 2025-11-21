import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import logoColor from "@/assets/logo-color.png";
import { 
  LogOut, 
  Home as HomeIcon, 
  Users, 
  Search as SearchIcon, 
  Bell, 
  User,
  Settings,
  BarChart3,
  Calendar,
  Mail
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("John");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUserEmail(session.user.email || "");
        const name = session.user.email?.split('@')[0] || "John";
        setUserName(name.charAt(0).toUpperCase() + name.slice(1));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e5f3a] via-[#2d7549] to-[#3a8f5a] flex">
      {/* Sidebar */}
      <aside className="w-48 bg-[#1a2b23]/80 backdrop-blur-sm border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <img src={logoColor} alt="Big Green Foundation" className="h-8 w-auto" />
        </div>
        
        <nav className="flex-1 p-3 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/20 text-primary-foreground text-sm font-medium">
            <HomeIcon className="w-4 h-4" />
            Home
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:bg-white/5 text-sm">
            <Users className="w-4 h-4" />
            Phorus
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:bg-white/5 text-sm">
            <SearchIcon className="w-4 h-4" />
            Higgs
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:bg-white/5 text-sm">
            <Calendar className="w-4 h-4" />
            Meple
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:bg-white/5 text-sm">
            <Settings className="w-4 h-4" />
            Dashboard
          </button>
        </nav>

        <div className="p-3 space-y-1 border-t border-white/10">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:bg-white/5 text-sm">
            <BarChart3 className="w-4 h-4" />
            Sevintred
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:bg-white/5 text-sm">
            <Mail className="w-4 h-4" />
            Criphs
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-[#1a2b23]/60 backdrop-blur-sm border-b border-white/10 px-6 py-3">
          <div className="flex items-center justify-between">
            <nav className="flex items-center gap-6">
              <button className="text-white/70 hover:text-white text-sm font-medium">Home</button>
              <button className="text-primary border-b-2 border-primary text-sm font-medium pb-1">About Us</button>
              <button className="text-white/70 hover:text-white text-sm font-medium">Programs</button>
              <button className="text-white/70 hover:text-white text-sm font-medium">Get Involved</button>
              <button className="text-white/70 hover:text-white text-sm font-medium">Contact</button>
            </nav>
            
            <div className="flex items-center gap-3">
              <button className="text-white/70 hover:text-white">
                <SearchIcon className="w-5 h-5" />
              </button>
              <button className="text-white/70 hover:text-white relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
              </button>
              <button className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-white text-sm font-medium">
                {userName.charAt(0)}
              </button>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl">
            {/* Welcome Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {userName}!</h1>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                    <input 
                      type="text" 
                      placeholder="Search" 
                      className="pl-10 pr-4 py-2 bg-[#1a2b23]/60 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/50 w-64"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="p-2 bg-[#1a2b23]/60 rounded-lg text-white/70 hover:text-white relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
                </button>
                <button className="p-2 bg-[#1a2b23]/60 rounded-lg text-white/70 hover:text-white">
                  <User className="w-5 h-5" />
                </button>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white rounded-full px-6"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </div>
            </div>

            {/* Your Impact Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Your Impact</h2>
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                  Advaction
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-[#1a2b23]/60 border-white/10 p-4">
                  <div className="text-white/60 text-sm mb-1">Auzonis</div>
                  <div className="text-white text-4xl font-bold mb-2">36,277</div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/60 text-xs">100tling</span>
                    <Badge className="bg-primary/20 text-primary border-0 text-xs">Amlees</Badge>
                  </div>
                </Card>

                <Card className="bg-[#1a2b23]/60 border-white/10 p-4">
                  <div className="text-white/60 text-sm mb-1">Dessunfor</div>
                  <div className="text-white text-4xl font-bold mb-2">1,96</div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/60 text-xs">100tling</span>
                    <Badge className="bg-red-500/20 text-red-400 border-0 text-xs">Damagerd</Badge>
                  </div>
                </Card>

                <Card className="bg-[#1a2b23]/60 border-white/10 p-4">
                  <div className="text-white/60 text-sm mb-1">EencMet</div>
                  <div className="text-white/70 text-xs mb-2">Am mijer chi year trent or parayrand this tipyluty.</div>
                  <div className="text-white text-2xl font-bold mb-2">1,524</div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/60 text-xs">Mam(s)onie</span>
                    <Badge className="bg-primary hover:bg-primary/90 text-white border-0 text-xs">Propellers</Badge>
                  </div>
                </Card>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Recent Activity</h2>
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                  Adojuct
                </Button>
              </div>
              
              <Card className="bg-[#1a2b23]/60 border-white/10">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left text-white text-sm font-medium p-4">Contributions</th>
                        <th className="text-left text-white text-sm font-medium p-4">Mereos</th>
                        <th className="text-left text-white text-sm font-medium p-4">Fiolo</th>
                        <th className="text-left text-white text-sm font-medium p-4">Conlact</th>
                        <th className="text-left text-white text-sm font-medium p-4">Tp</th>
                        <th className="text-left text-white text-sm font-medium p-4">Amills</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/10">
                        <td className="text-white text-sm p-4">Commit[butions</td>
                        <td className="text-white text-sm p-4">20,955</td>
                        <td className="text-white text-sm p-4">26,90%</td>
                        <td className="text-white text-sm p-4">37,409</td>
                        <td className="text-white text-sm p-4">29</td>
                        <td className="text-primary text-sm p-4">$4 302k</td>
                      </tr>
                      <tr>
                        <td className="text-white text-sm p-4">Dirges fonds</td>
                        <td className="text-white text-sm p-4">1,342</td>
                        <td className="text-white text-sm p-4">1,604</td>
                        <td className="text-white text-sm p-4">17500</td>
                        <td className="text-white text-sm p-4">00</td>
                        <td className="text-primary text-sm p-4">$4 300k</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Upcoming Events Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Upcoming Events</h2>
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                  Enffy
                </Button>
              </div>
              
              <Card className="bg-[#1a2b23]/60 border-white/10 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#2d4a3a] flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium text-sm">Upcoming Events ^</div>
                        <div className="text-white/60 text-xs">C: sutley Actavettien Veumboeurd</div>
                      </div>
                      <div className="text-primary font-bold">$tih $4</div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#2d4a3a] flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium text-sm">Upcoming Event</div>
                        <div className="text-white/60 text-xs">C: sutley Actavettien Veumboeurd</div>
                      </div>
                      <div className="text-primary font-bold">$tih $3</div>
                    </div>
                  </div>

                  <div className="ml-8 relative">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        className="text-[#2d4a3a]"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.17)}`}
                        className="text-primary"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">17%</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
