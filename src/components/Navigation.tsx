import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Award } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import logoColor from "@/assets/logo-color.png";
import { supabase } from "@/integrations/supabase/client";
const Navigation = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [impactScore, setImpactScore] = useState<number>(0);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkAuthAndFetchScore = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setIsAuthenticated(true);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('impact_score')
          .eq('user_id', user.id)
          .single();
        
        if (data && !error) {
          setImpactScore(data.impact_score);
        }

        // Set up realtime subscription for impact score changes
        const channel = supabase
          .channel('profile-changes')
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'profiles',
              filter: `user_id=eq.${user.id}`
            },
            (payload) => {
              console.log('Impact score updated:', payload);
              if (payload.new && 'impact_score' in payload.new) {
                setImpactScore(payload.new.impact_score as number);
              }
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuthAndFetchScore();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAuthAndFetchScore();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const navItems = [{
    name: "Features",
    href: "/features",
    onClick: () => navigate("/features")
  }, {
    name: "Packages",
    href: "/packages",
    onClick: () => navigate("/packages")
  }, {
    name: "Reviews",
    href: "/reviews",
    onClick: () => navigate("/reviews")
  }];
  return <header className={`fixed top-3 sm:top-3.5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 rounded-full ${isScrolled ? "h-12 sm:h-14 glass backdrop-blur-xl border border-border scale-95 w-[92%] sm:w-[90%] max-w-2xl" : "h-12 sm:h-14 bg-card/80 backdrop-blur-sm w-[95%] max-w-3xl"}`}>
      <div className="mx-auto h-full px-4 sm:px-6">
        <nav className="flex items-center justify-between h-full">
          <div className="flex items-center">
            <img src={logoColor} alt="Big Green" className="h-6 sm:h-8 w-auto" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map(item => <a key={item.name} href={item.href} onClick={e => {
            e.preventDefault();
            if (item.onClick) {
              item.onClick();
            }
          }} className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300">
                {item.name}
              </a>)}
            {isAuthenticated ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-black rounded-full hover:scale-105 transition-all duration-300 font-semibold"
              >
                <Award className="w-4 h-4" />
                <span>{impactScore}</span>
              </button>
            ) : (
              <Button onClick={() => navigate("/auth")} size="sm" className="button-gradient hover-scale">
                ​APPLY NOW  
              </Button>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="glass h-9 w-9 sm:h-10 sm:w-10">
                  <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-[#1B1B1B]">
                <div className="flex flex-col gap-4 mt-8">
                  {navItems.map(item => <a key={item.name} href={item.href} className="text-lg text-muted-foreground hover:text-foreground transition-colors" onClick={e => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  if (item.onClick) {
                    item.onClick();
                  }
                }}>
                      {item.name}
                    </a>)}
                  {isAuthenticated ? (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate("/dashboard");
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-black rounded-full hover:scale-105 transition-all duration-300 font-semibold mt-4"
                    >
                      <Award className="w-5 h-5" />
                      <span>Impact Score: {impactScore}</span>
                    </button>
                  ) : (
                    <Button onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate("/auth");
                  }} className="button-gradient mt-4 hover-scale">
                      Apply Now
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>;
};
export default Navigation;