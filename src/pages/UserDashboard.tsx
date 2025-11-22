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

  return <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border py-4 px-4 md:px-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <img src={logoColor} alt="Big Green" className="h-10 w-auto" />
          <div className="flex gap-2">
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/admin")}
                className="gap-2"
              >
                Admin Panel
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => navigate("/")} className="gap-2">
              <Home className="w-4 h-4" />
              Home
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }}>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black mb-4">
              Welcome to Your <span className="text-gradient">Big Green</span> Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              {userEmail}
            </p>
          </div>

          {/* Impact Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} 
              className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
              <p className="text-sm opacity-90 mb-2">CO₂ Offset</p>
              <p className="text-4xl font-black mb-1">2.4</p>
              <p className="text-sm opacity-90">Tons</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} 
              className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
              <p className="text-sm opacity-90 mb-2">Trees Planted</p>
              <p className="text-4xl font-black mb-1">47</p>
              <p className="text-sm opacity-90">Trees</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} 
              className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl p-6 shadow-lg">
              <p className="text-sm opacity-90 mb-2">Energy Saved</p>
              <p className="text-4xl font-black mb-1">1.2k</p>
              <p className="text-sm opacity-90">kWh</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} 
              className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
              <p className="text-sm opacity-90 mb-2">Community Impact</p>
              <p className="text-4xl font-black mb-1">89</p>
              <p className="text-sm opacity-90">People</p>
            </motion.div>
          </div>

          {/* Projects Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
            <h2 className="text-3xl font-black mb-6">Projects You Can Support</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white border-2 border-border rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <img src="/lovable-uploads/1e2a48dc-059b-4919-a1ed-44685d771a32.png" alt="Urban Farming Initiative" className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Urban Farming Initiative</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Transform vacant city lots into thriving community gardens and urban farms.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary">$12,450 / $15,000</span>
                    <Button size="sm" className="button-gradient">Support</Button>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-border rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <img src="/lovable-uploads/21f3edfb-62b5-4e35-9d03-7339d803b980.png" alt="Solar Education Program" className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Solar Education Program</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Bring renewable energy education to schools and communities nationwide.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary">$8,200 / $10,000</span>
                    <Button size="sm" className="button-gradient">Support</Button>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-border rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <img src="/lovable-uploads/5830bd79-3511-41dc-af6c-8db32d91fc2c.png" alt="Reforestation Drive" className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Reforestation Drive</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Plant native trees and restore ecosystems in deforested areas.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary">$18,900 / $20,000</span>
                    <Button size="sm" className="button-gradient">Support</Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Activities Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }} 
            className="bg-white border-2 border-border rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Your Recent Activities</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">✓</div>
                <div className="flex-1">
                  <h4 className="font-semibold">Completed Carbon Footprint Assessment</h4>
                  <p className="text-sm text-muted-foreground">2 days ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">🌱</div>
                <div className="flex-1">
                  <h4 className="font-semibold">Joined Urban Farming Community</h4>
                  <p className="text-sm text-muted-foreground">5 days ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold">☀️</div>
                <div className="flex-1">
                  <h4 className="font-semibold">Downloaded Solar Energy Guide</h4>
                  <p className="text-sm text-muted-foreground">1 week ago</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>;
};

export default UserDashboard;
