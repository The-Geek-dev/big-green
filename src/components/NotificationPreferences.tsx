import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell, Mail, DollarSign, FileText, Gift, TrendingUp, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface NotificationPreferencesData {
  email_transactions: boolean;
  email_grants: boolean;
  email_applications: boolean;
  email_withdrawals: boolean;
  email_tier_upgrades: boolean;
}

const defaultPreferences: NotificationPreferencesData = {
  email_transactions: true,
  email_grants: true,
  email_applications: true,
  email_withdrawals: true,
  email_tier_upgrades: true,
};

export const NotificationPreferences = () => {
  const [preferences, setPreferences] = useState<NotificationPreferencesData>(defaultPreferences);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalPreferences, setOriginalPreferences] = useState<NotificationPreferencesData>(defaultPreferences);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from("notification_preferences")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error loading preferences:", error);
        return;
      }

      if (data) {
        const prefs = {
          email_transactions: data.email_transactions,
          email_grants: data.email_grants,
          email_applications: data.email_applications,
          email_withdrawals: data.email_withdrawals,
          email_tier_upgrades: data.email_tier_upgrades,
        };
        setPreferences(prefs);
        setOriginalPreferences(prefs);
      } else {
        // Create default preferences for existing user
        const { error: insertError } = await supabase
          .from("notification_preferences")
          .insert({ user_id: session.user.id });

        if (insertError) {
          console.error("Error creating preferences:", insertError);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key: keyof NotificationPreferencesData) => {
    const newPreferences = { ...preferences, [key]: !preferences[key] };
    setPreferences(newPreferences);
    setHasChanges(JSON.stringify(newPreferences) !== JSON.stringify(originalPreferences));
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please log in to save preferences");
        return;
      }

      const { error } = await supabase
        .from("notification_preferences")
        .update(preferences)
        .eq("user_id", session.user.id);

      if (error) throw error;

      setOriginalPreferences(preferences);
      setHasChanges(false);
      toast.success("Notification preferences saved!");
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  const preferenceItems = [
    {
      key: "email_transactions" as const,
      icon: DollarSign,
      title: "Transaction Notifications",
      description: "Receive emails when your transactions are submitted, verified, or rejected",
    },
    {
      key: "email_grants" as const,
      icon: Gift,
      title: "Grant Notifications",
      description: "Receive emails about your grant applications status",
    },
    {
      key: "email_applications" as const,
      icon: FileText,
      title: "Application Notifications",
      description: "Receive emails about your general applications",
    },
    {
      key: "email_withdrawals" as const,
      icon: TrendingUp,
      title: "Withdrawal Notifications",
      description: "Receive emails about your withdrawal requests",
    },
    {
      key: "email_tier_upgrades" as const,
      icon: Bell,
      title: "Tier Upgrade Notifications",
      description: "Receive emails about your tier upgrade payments and status",
    },
  ];

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <CardTitle>Email Notification Preferences</CardTitle>
        </div>
        <CardDescription>
          Choose which email notifications you want to receive. In-app notifications will still be shown.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {preferenceItems.map((item) => (
          <div key={item.key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-1">
                <Label htmlFor={item.key} className="font-medium cursor-pointer">
                  {item.title}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
            <Switch
              id={item.key}
              checked={preferences[item.key]}
              onCheckedChange={() => handleToggle(item.key)}
            />
          </div>
        ))}

        <div className="flex justify-end pt-4">
          <Button 
            onClick={savePreferences} 
            disabled={!hasChanges || saving}
            className="min-w-[120px]"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Preferences"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
