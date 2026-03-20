import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Clock, CheckCircle, XCircle, ArrowDownToLine } from "lucide-react";
import { format } from "date-fns";

interface FundingApplication {
  id: string;
  status: string;
  created_at: string;
  full_name: string;
  notes: string | null;
}

interface WithdrawalRequest {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  crypto_type: string;
  wallet_address: string;
  admin_notes: string | null;
}

export const FundingStatusView = () => {
  const [applications, setApplications] = useState<FundingApplication[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const APPROVED_AMOUNT = 150000;

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [appsRes, withdrawalsRes] = await Promise.all([
        supabase
          .from("applications")
          .select("id, status, created_at, full_name, notes")
          .eq("user_id", user.id)
          .in("application_type", ["business funding", "business_funding"])
          .order("created_at", { ascending: false }),
        supabase
          .from("withdrawal_requests")
          .select("id, amount, status, created_at, crypto_type, wallet_address, admin_notes")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
      ]);

      if (appsRes.data) setApplications(appsRes.data);
      if (withdrawalsRes.data) setWithdrawals(withdrawalsRes.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const approvedApp = applications.find((a) => a.status === "approved");
  const totalDisbursed = withdrawals
    .filter((w) => w.status === "approved" || w.status === "completed")
    .reduce((sum, w) => sum + Number(w.amount), 0);
  const pendingDisbursements = withdrawals.filter((w) => w.status === "pending");
  const remainingBalance = APPROVED_AMOUNT - totalDisbursed;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
      case "completed":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30"><CheckCircle className="w-3 h-3 mr-1" /> {status}</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge className="bg-white/10 text-white/60 border-white/20">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-white/10 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 h-24 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <Briefcase className="w-7 h-7 text-emerald-400" />
          Funding Status
        </h1>
        <p className="text-white/60 mt-1">Track your business funding application progress and disbursement status.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <p className="text-white/50 text-sm">Approved Amount</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">
              ${approvedApp ? APPROVED_AMOUNT.toLocaleString("en-US", { minimumFractionDigits: 2 }) : "0.00"}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <p className="text-white/50 text-sm">Total Disbursed</p>
            <p className="text-2xl font-bold text-white mt-1">
              ${totalDisbursed.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <p className="text-white/50 text-sm">Remaining Balance</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">
              ${(approvedApp ? remainingBalance : 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <p className="text-white/50 text-sm">Application Status</p>
            <div className="mt-2">
              {approvedApp ? getStatusBadge("approved") : applications.length > 0 ? getStatusBadge(applications[0].status) : <span className="text-white/40 text-sm">No application</span>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Disbursements */}
      {pendingDisbursements.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            Pending Withdrawals
          </h2>
          <div className="space-y-3">
            {pendingDisbursements.map((w) => (
              <Card key={w.id} className="bg-yellow-500/5 border-yellow-500/20">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">${Number(w.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                    <p className="text-sm text-white/50">{w.crypto_type.toUpperCase()} · {format(new Date(w.created_at), "MMM d, yyyy")}</p>
                  </div>
                  {getStatusBadge("pending")}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Withdrawal History */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <ArrowDownToLine className="w-5 h-5 text-white/70" />
          Withdrawal History
        </h2>
        {withdrawals.length === 0 ? (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-8 text-center">
              <p className="text-white/40">No withdrawal requests yet.</p>
              <p className="text-white/30 text-sm mt-1">Submit a withdrawal request to start receiving your funds.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {withdrawals.map((w) => (
              <Card key={w.id} className="bg-white/5 border-white/10">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">${Number(w.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                    <p className="text-xs text-white/40">
                      {w.crypto_type.toUpperCase()} · {w.wallet_address.slice(0, 8)}...{w.wallet_address.slice(-6)} · {format(new Date(w.created_at), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                    {w.admin_notes && <p className="text-xs text-white/50 italic">Note: {w.admin_notes}</p>}
                  </div>
                  {getStatusBadge(w.status)}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Application History */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Application History</h2>
        <div className="space-y-2">
          {applications.map((app) => (
            <Card key={app.id} className="bg-white/5 border-white/10">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{app.full_name}</p>
                  <p className="text-xs text-white/40">{format(new Date(app.created_at), "MMM d, yyyy")}</p>
                  {app.notes && <p className="text-xs text-white/50 mt-1">{app.notes}</p>}
                </div>
                {getStatusBadge(app.status)}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
