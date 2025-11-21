import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import logoColor from "@/assets/logo-color.png";
import { LogOut, Home } from "lucide-react";
const Dashboard = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(async ({
      data: {
        session
      }
    }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUserEmail(session.user.email || "");
        
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
            {/* Status Card */}
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Application Status</h3>
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                  Pending
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                Your application is being reviewed. We'll contact you within 1-3 business days.
              </p>
            </motion.div>

            {/* Progress Card */}
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
              <h3 className="text-lg font-bold mb-4">Next Steps</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Application submitted ✓
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-muted rounded-full"></span>
                  Review in progress
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-muted rounded-full"></span>
                  Approval notification
                </li>
              </ul>
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

          {/* Additional Information */}
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
            <h2 className="text-2xl font-bold mb-4">What Happens Next?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">1. Application Review</h4>
                <p className="text-muted-foreground text-sm">
                  Our team will carefully review your application and verify all provided information.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">2. Notification</h4>
                <p className="text-muted-foreground text-sm">
                  You'll receive an email notification once your application has been reviewed.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">3. Onboarding</h4>
                <p className="text-muted-foreground text-sm">
                  If approved, we'll guide you through the onboarding process and next steps.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">4. Get Started</h4>
                <p className="text-muted-foreground text-sm">
                  Begin your journey with Big Green and start making a sustainable impact!
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>;
};
export default Dashboard;