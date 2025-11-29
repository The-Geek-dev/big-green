import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useScreenSize } from "@/hooks/useMediaQuery";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { LogOut, LayoutDashboard, FileText, TrendingUp, ArrowLeftRight, Users, Heart, Award, Bot, Menu, Home, Leaf } from "lucide-react";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { MyGardensView } from "@/components/dashboard/MyGardensView";
import { ProjectsView } from "@/components/dashboard/ProjectsView";
import { CommunityView } from "@/components/dashboard/CommunityView";
import { DocumentsView } from "@/components/dashboard/DocumentsView";
import { AnalyticsView } from "@/components/dashboard/AnalyticsView";
import { TransfersView } from "@/components/dashboard/TransfersView";
import { DonateView } from "@/components/dashboard/DonateView";
import { GrantsView } from "@/components/dashboard/GrantsView";
import { TierStatusView } from "@/components/dashboard/TierStatusView";
import { AIChat } from "@/components/AIChat";

const UserDashboard = () => {
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useScreenSize();
  const [userEmail, setUserEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSidebarSection, setActiveSidebarSection] = useState("Dashboard");

  const handleSidebarNavigation = (section: string) => {
    setActiveSidebarSection(section);
    setActiveTab(section);
    setIsSidebarOpen(false);
  };
  
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    
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
        const { data: applicationData, error } = await supabase
          .from("applications")
          .select("status")
          .eq("user_id", session.user.id)
          .maybeSingle();
        
        console.log("Application check:", { applicationData, error, userId: session.user.id });
        
        // Only redirect if we're sure the application doesn't exist or is not approved
        if (error) {
          console.error("Error checking application:", error);
        } else if (!applicationData) {
          console.log("No application found, redirecting to verification");
          navigate("/dashboard");
          return;
        } else if (applicationData.status !== "approved") {
          console.log("Application status:", applicationData.status);
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
        
        // Set up real-time subscription for application status changes
        channel = supabase
          .channel('user-application-changes')
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'applications',
              filter: `user_id=eq.${session.user.id}`
            },
            (payload) => {
              console.log('Application status updated:', payload);
              const newStatus = payload.new.status;
              
              // If application is no longer approved, redirect back
              if (newStatus !== 'approved') {
                toast.error("Your application status has changed");
                navigate("/dashboard");
              }
            }
          )
          .subscribe();
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
    
    return () => {
      subscription.unsubscribe();
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [navigate]);

  // Smooth scroll to top when tab changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [activeTab]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
  };

  const sidebarItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "My Gardens", icon: Home },
    { name: "Projects", icon: Leaf },
    { name: "Documents", icon: FileText },
    { name: "Analytics", icon: TrendingUp },
    { name: "Transfers", icon: ArrowLeftRight },
    { name: "Community", icon: Users },
    { name: "Donate", icon: Heart },
    { name: "Grants", icon: Award },
    { name: "AI Assistant", icon: Bot },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-white/10">
        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl font-bold mb-4">
          P
        </div>
        <div className="text-sm text-white/50">Logged in as</div>
        <div className="text-sm text-white truncate">{userEmail}</div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              onClick={() => handleSidebarNavigation(item.name)}
              className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${
                activeSidebarSection === item.name
                  ? "bg-white/10 text-white border-r-2 border-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.name}</span>
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/10">
        <Button
          variant="ghost"
          className="w-full justify-start text-white/70 hover:text-white hover:bg-white/5"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return <div className="min-h-screen bg-black text-white flex flex-col">
      <Navigation />
      
      <div className="flex flex-1 mt-20">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="w-20 lg:w-64 bg-black border-r border-white/10 flex flex-col">
          {/* Compact view for md screens */}
          <div className="lg:hidden flex flex-col items-center py-8 gap-6">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl font-bold">
              P
            </div>
            <div className="flex flex-col gap-3">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleSidebarNavigation(item.name)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      activeSidebarSection === item.name ? "bg-white" : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${activeSidebarSection === item.name ? "text-black" : "text-white"}`} />
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Full sidebar for lg screens */}
          <div className="hidden lg:flex flex-col h-full">
            <SidebarContent />
          </div>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <header className="bg-black border-b border-white/10 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile menu button */}
            {isMobile && (
              <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 bg-black border-white/10 p-0">
                  <SidebarContent />
                </SheetContent>
              </Sheet>
            )}

            {/* Tabs - scrollable on mobile */}
            <div className="flex-1 overflow-x-auto hide-scrollbar">
              <div className="flex items-center gap-4 lg:gap-8 min-w-max">
                {["Dashboard", "My Gardens", "Projects", "Community", "Donate", "Grants", "Tier Status", "AI Assistant"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-xs lg:text-sm font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab ? "text-white" : "text-white/50 hover:text-white/75"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* User profile - hidden on mobile */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600"></div>
                <div className="text-right">
                  <p className="text-xs font-medium">{isAdmin ? "Admin User" : "User"}</p>
                  <p className="text-xs text-white/50 truncate max-w-[100px]">{userEmail}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-white/50 hover:text-white">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div 
          ref={contentRef}
          className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto bg-gradient-to-br from-black via-black to-green-950/20 scroll-smooth"
        >
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
          >
            {activeTab === "Dashboard" && <DashboardView userEmail={userEmail} />}
            {activeTab === "My Gardens" && <MyGardensView />}
            {activeTab === "Projects" && <ProjectsView />}
            {activeTab === "Community" && <CommunityView />}
            {activeTab === "Documents" && <DocumentsView />}
            {activeTab === "Analytics" && <AnalyticsView />}
            {activeTab === "Transfers" && <TransfersView />}
            {activeTab === "Donate" && <DonateView />}
            {activeTab === "Grants" && <GrantsView onNavigateToTab={setActiveTab} />}
            {activeTab === "Tier Status" && <TierStatusView />}
            {activeTab === "AI Assistant" && <AIChat />}
          </motion.div>
        </div>
      </div>
      </div>
    </div>;
};

export default UserDashboard;
