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

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Quick Actions Card */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.1
          }} className="bg-white border-2 border-primary/20 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  View Programs
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Track Progress
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  View Resources
                </Button>
              </div>
            </motion.div>

            {/* Stats Card */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.2
          }} className="bg-white border-2 border-border rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold mb-4">Your Impact</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Programs Enrolled</p>
                  <p className="text-2xl font-bold text-primary">0</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Resources Accessed</p>
                  <p className="text-2xl font-bold text-primary">0</p>
                </div>
              </div>
            </motion.div>

            {/* Support Card */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.3
          }} className="bg-white border-2 border-border rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold mb-4">Need Help?</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Our support team is here to assist you with any questions.
              </p>
              <Button className="button-gradient w-full">
                Contact Support
              </Button>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.4
        }} className="bg-white border-2 border-border rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Explore Programs</h4>
                <p className="text-muted-foreground text-sm">
                  Discover available programs and opportunities tailored to your needs.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Access Resources</h4>
                <p className="text-muted-foreground text-sm">
                  Browse educational materials and tools to help you succeed.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Track Your Progress</h4>
                <p className="text-muted-foreground text-sm">
                  Monitor your journey and see the impact you're making.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Connect With Community</h4>
                <p className="text-muted-foreground text-sm">
                  Join others in making a sustainable difference together.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>;
};

export default UserDashboard;
