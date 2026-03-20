import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface UserProfile {
  user_id: string;
  tier_level: number;
  total_investment: number;
  impact_score: number;
  email?: string;
  application_type?: string;
}

const TIER_LABELS: Record<number, string> = {
  1: "Gateway (Tier 1)",
  2: "Quantum Leap (Tier 2)",
  3: "VIP Legacy (Tier 3)",
};

const TIER_COLORS: Record<number, string> = {
  1: "bg-zinc-100 text-zinc-800",
  2: "bg-blue-100 text-blue-800",
  3: "bg-amber-100 text-amber-800",
};

export const UserTierManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);

    // Fetch profiles
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("user_id, tier_level, total_investment, impact_score")
      .order("tier_level", { ascending: false });

    if (profilesError) {
      toast.error("Failed to fetch user profiles");
      setLoading(false);
      return;
    }

    // Fetch applications to get emails and types
    const { data: apps } = await supabase
      .from("applications")
      .select("user_id, email, application_type, status")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    // Map email/type to user_id (latest approved app)
    const userAppMap = new Map<string, { email: string; application_type: string }>();
    if (apps) {
      for (const app of apps) {
        if (!userAppMap.has(app.user_id)) {
          userAppMap.set(app.user_id, { email: app.email, application_type: app.application_type });
        }
      }
    }

    const enriched: UserProfile[] = (profiles || []).map((p) => ({
      ...p,
      email: userAppMap.get(p.user_id)?.email || "Unknown",
      application_type: userAppMap.get(p.user_id)?.application_type || "N/A",
    }));

    setUsers(enriched);
    setLoading(false);
  };

  const updateTier = async (userId: string, newTier: number) => {
    const { error } = await supabase
      .from("profiles")
      .update({ tier_level: newTier })
      .eq("user_id", userId);

    if (error) {
      toast.error("Failed to update tier");
      console.error(error);
    } else {
      toast.success(`Tier updated to ${TIER_LABELS[newTier]}`);
      setUsers((prev) =>
        prev.map((u) => (u.user_id === userId ? { ...u, tier_level: newTier } : u))
      );
    }
  };

  const filtered = users.filter(
    (u) =>
      (u.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.application_type || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white border-2 border-border rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">User Tier Management</h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by email or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No users found</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Application Type</TableHead>
              <TableHead>Current Tier</TableHead>
              <TableHead>Total Investment</TableHead>
              <TableHead>Impact Score</TableHead>
              <TableHead>Change Tier</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((user) => (
              <TableRow key={user.user_id}>
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell className="capitalize">
                  {(user.application_type || "N/A").replace(/_/g, " ")}
                </TableCell>
                <TableCell>
                  <Badge className={TIER_COLORS[user.tier_level] || ""}>
                    {TIER_LABELS[user.tier_level] || `Tier ${user.tier_level}`}
                  </Badge>
                </TableCell>
                <TableCell>
                  ${Number(user.total_investment).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell>{user.impact_score}</TableCell>
                <TableCell>
                  <Select
                    value={String(user.tier_level)}
                    onValueChange={(val) => updateTier(user.user_id, Number(val))}
                  >
                    <SelectTrigger className="w-44">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Gateway (Tier 1)</SelectItem>
                      <SelectItem value="2">Quantum Leap (Tier 2)</SelectItem>
                      <SelectItem value="3">VIP Legacy (Tier 3)</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
