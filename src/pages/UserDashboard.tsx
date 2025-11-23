import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import logoColor from "@/assets/logo-color.png";
import { LogOut, LayoutDashboard, FileText, TrendingUp, ArrowLeftRight, Users } from "lucide-react";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { MyGardensView } from "@/components/dashboard/MyGardensView";
import { ProjectsView } from "@/components/dashboard/ProjectsView";
import { CommunityView } from "@/components/dashboard/CommunityView";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [activeSidebarSection, setActiveSidebarSection] = useState("Dashboard");

  const handleSidebarNavigation = (section: string) => {
    setActiveSidebarSection(section);
    setActiveTab(section);
  };
  
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
          <button 
            onClick={() => handleSidebarNavigation("Dashboard")}
            className="w-12 h-12 rounded-xl bg-white flex items-center justify-center hover:bg-white/90 transition-colors"
          >
            <LayoutDashboard className="w-5 h-5 text-black" />
          </button>
          <button 
            onClick={() => handleSidebarNavigation("Documents")}
            className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <FileText className="w-5 h-5 text-white" />
          </button>
          <button 
            onClick={() => handleSidebarNavigation("Analytics")}
            className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <TrendingUp className="w-5 h-5 text-white" />
          </button>
          <button 
            onClick={() => handleSidebarNavigation("Transfers")}
            className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <ArrowLeftRight className="w-5 h-5 text-white" />
          </button>
          <button 
            onClick={() => handleSidebarNavigation("Community")}
            className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
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
              {["Dashboard", "My Gardens", "Projects", "Community"].map((tab) => (
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
                  <p className="text-xs font-medium">{isAdmin ? "Admin User" : "User"}</p>
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
            {activeTab === "Dashboard" && <DashboardView userEmail={userEmail} />}
            {activeTab === "My Gardens" && <MyGardensView />}
            {activeTab === "Projects" && <ProjectsView />}
            {activeTab === "Community" && <CommunityView />}
          </motion.div>
        </div>
      </div>
    </div>;
};

export default UserDashboard;
