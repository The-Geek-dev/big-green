import { Award, Lock, CheckCircle, Clock, TrendingUp, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface GrantsViewProps {
  onNavigateToTab: (tab: string) => void;
}

export const GrantsView = ({ onNavigateToTab }: GrantsViewProps) => {
  const [currentImpactScore, setCurrentImpactScore] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImpactScore = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('impact_score')
            .eq('user_id', user.id)
            .single();
          
          if (error) {
            console.error('Error fetching impact score:', error);
          } else if (data) {
            setCurrentImpactScore(data.impact_score);
          }

          // Set up realtime subscription
          const channel = supabase
            .channel('grants-profile-changes')
            .on(
              'postgres_changes',
              {
                event: 'UPDATE',
                schema: 'public',
                table: 'profiles',
                filter: `user_id=eq.${user.id}`
              },
              (payload) => {
                console.log('Grants: Impact score updated:', payload);
                if (payload.new && 'impact_score' in payload.new) {
                  setCurrentImpactScore(payload.new.impact_score as number);
                }
              }
            )
            .subscribe();

          return () => {
            supabase.removeChannel(channel);
          };
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImpactScore();
  }, []);

  const grants = [
    {
      title: "Green Starter Grant",
      amount: "$5,000",
      requiredScore: 0,
      icon: Zap,
      description: "Perfect for getting started with your first sustainability project",
      benefits: ["Project funding", "Mentorship program", "Marketing support"],
      locked: false
    },
    {
      title: "Community Impact Grant",
      amount: "$15,000",
      requiredScore: 100,
      icon: TrendingUp,
      description: "Scale your impact and reach more communities",
      benefits: ["Full project funding", "Technical resources", "Partnership opportunities"],
      locked: true
    },
    {
      title: "Innovation Excellence Grant",
      amount: "$50,000",
      requiredScore: 500,
      icon: Award,
      description: "For proven leaders creating transformative change",
      benefits: ["Major funding", "Global recognition", "Strategic partnerships", "Media coverage"],
      locked: true
    }
  ];

  const handleApply = (grantTitle: string, locked: boolean) => {
    if (locked) {
      return;
    }
    onNavigateToTab("Tier Status");
  };

  return (
    <div className="space-y-6">
      <div className="text-center max-w-3xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mx-auto mb-4">
          <Award className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Apply for Impact Grants</h2>
        <p className="text-white/70 text-lg">
          Build your impact score through successful projects and unlock larger grants to create even greater change.
        </p>
      </div>

      <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Your Impact Score</h3>
            <p className="text-white/60 text-sm">Complete projects to increase your score and unlock new grants</p>
          </div>
          <div className="text-right">
            {loading ? (
              <div className="text-white/60">Loading...</div>
            ) : (
              <>
                <div className="text-3xl font-bold text-white">{currentImpactScore}</div>
                <div className="text-xs text-white/60">points</div>
              </>
            )}
          </div>
        </div>
        <Progress value={(currentImpactScore / 500) * 100} className="h-3 bg-white/10" />
        <div className="flex justify-between mt-2 text-xs text-white/60">
          <span>Getting Started</span>
          <span>500+ points for top grants</span>
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Available Grants</h3>
        {grants.map((grant, index) => {
          const Icon = grant.icon;
          const isLocked = grant.locked && currentImpactScore < grant.requiredScore;
          
          return (
            <Card 
              key={index} 
              className={`border-white/10 p-6 transition-all ${
                isLocked 
                  ? 'bg-white/5 opacity-60' 
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                    isLocked ? 'bg-white/5' : 'bg-gradient-to-br from-green-400 to-green-600'
                  }`}>
                    {isLocked ? (
                      <Lock className="w-7 h-7 text-white/40" />
                    ) : (
                      <Icon className="w-7 h-7 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-xl font-bold text-white">{grant.title}</h4>
                      {!isLocked && (
                        <span className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs text-green-400 font-medium">
                          Available
                        </span>
                      )}
                    </div>
                    <p className="text-white/60 mb-3">{grant.description}</p>
                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <span className="text-white/60">Grant Amount: </span>
                        <span className="text-white font-semibold">{grant.amount}</span>
                      </div>
                      <div>
                        <span className="text-white/60">Required Score: </span>
                        <span className={currentImpactScore >= grant.requiredScore ? "text-green-400" : "text-white"}>
                          {grant.requiredScore}+
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white mb-1">{grant.amount}</div>
                  {isLocked && (
                    <div className="flex items-center gap-1 text-xs text-white/60">
                      <Clock className="w-3 h-3" />
                      <span>Locked</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-white/80 mb-2">What's included:</p>
                <ul className="space-y-2">
                  {grant.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                onClick={() => handleApply(grant.title, isLocked)}
                disabled={isLocked}
                className={isLocked 
                  ? "w-full bg-white/10 text-white/40 cursor-not-allowed hover:bg-white/10" 
                  : "w-full bg-white text-black hover:bg-white/90"
                }
              >
                {isLocked ? (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Unlock at {grant.requiredScore} points
                  </>
                ) : (
                  <>Apply Now</>
                )}
              </Button>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30 p-6">
        <h3 className="text-lg font-semibold text-white mb-3">How to Increase Your Impact Score</h3>
        <ul className="space-y-2 text-white/80">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <span>Complete sustainability projects successfully</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <span>Document measurable environmental impact</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <span>Engage with community members</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <span>Share knowledge and help others succeed</span>
          </li>
        </ul>
      </Card>
    </div>
  );
};
