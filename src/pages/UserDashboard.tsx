import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import logoColor from "@/assets/logo-color.png";
import { LogOut, Home } from "lucide-react";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  
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

  return <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-xl border-b border-border/50 py-3 px-4 md:px-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <img src={logoColor} alt="Big Green" className="h-8 w-auto" />
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden md:block">{userEmail}</span>
            {isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin")}
                className="gap-2 text-xs"
              >
                Admin Panel
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-2">
              <Home className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }}>
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back 👋
            </h1>
            <p className="text-muted-foreground">
              Track your impact and explore sustainable opportunities
            </p>
          </div>

          {/* Impact Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} 
              className="bg-card border border-border/50 rounded-xl p-5 hover:border-primary/50 transition-colors">
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">CO₂ Offset</p>
              <p className="text-3xl font-bold mb-0.5">2.4</p>
              <p className="text-sm text-muted-foreground">Tons</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} 
              className="bg-card border border-border/50 rounded-xl p-5 hover:border-primary/50 transition-colors">
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Trees Planted</p>
              <p className="text-3xl font-bold mb-0.5">47</p>
              <p className="text-sm text-muted-foreground">Trees</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} 
              className="bg-card border border-border/50 rounded-xl p-5 hover:border-primary/50 transition-colors">
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Energy Saved</p>
              <p className="text-3xl font-bold mb-0.5">1.2k</p>
              <p className="text-sm text-muted-foreground">kWh</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} 
              className="bg-card border border-border/50 rounded-xl p-5 hover:border-primary/50 transition-colors">
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Community Impact</p>
              <p className="text-3xl font-bold mb-0.5">89</p>
              <p className="text-sm text-muted-foreground">People</p>
            </motion.div>
          </div>

          {/* Projects Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Support Projects</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-card border border-border/50 rounded-xl overflow-hidden hover:border-primary/50 transition-all group">
                <div className="relative h-40 overflow-hidden">
                  <img src="/lovable-uploads/1e2a48dc-059b-4919-a1ed-44685d771a32.png" alt="Urban Farming Initiative" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1">Urban Farming Initiative</h3>
                  <p className="text-muted-foreground text-xs mb-3">
                    Transform vacant city lots into thriving community gardens
                  </p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium">$12,450 / $15,000</span>
                    <span className="text-xs text-muted-foreground">83%</span>
                  </div>
                  <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: '83%' }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border/50 rounded-xl overflow-hidden hover:border-primary/50 transition-all group">
                <div className="relative h-40 overflow-hidden">
                  <img src="/lovable-uploads/21f3edfb-62b5-4e35-9d03-7339d803b980.png" alt="Solar Education Program" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1">Solar Education Program</h3>
                  <p className="text-muted-foreground text-xs mb-3">
                    Bring renewable energy education to schools nationwide
                  </p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium">$8,200 / $10,000</span>
                    <span className="text-xs text-muted-foreground">82%</span>
                  </div>
                  <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: '82%' }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border/50 rounded-xl overflow-hidden hover:border-primary/50 transition-all group">
                <div className="relative h-40 overflow-hidden">
                  <img src="/lovable-uploads/5830bd79-3511-41dc-af6c-8db32d91fc2c.png" alt="Reforestation Drive" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1">Reforestation Drive</h3>
                  <p className="text-muted-foreground text-xs mb-3">
                    Plant native trees and restore ecosystems in deforested areas
                  </p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium">$18,900 / $20,000</span>
                    <span className="text-xs text-muted-foreground">95%</span>
                  </div>
                  <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Activities Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
            <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
            <div className="bg-card border border-border/50 rounded-xl p-5">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">✓</div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">Completed Carbon Footprint Assessment</h4>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">🌱</div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">Joined Urban Farming Community</h4>
                    <p className="text-xs text-muted-foreground">5 days ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">☀️</div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">Downloaded Solar Energy Guide</h4>
                    <p className="text-xs text-muted-foreground">1 week ago</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>;
};

export default UserDashboard;
