import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Clock, CheckCircle, XCircle, ArrowUpRight, ArrowDownLeft, Truck, TrendingUp, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CryptoTransaction {
  id: string;
  amount_usd: number;
  crypto_type: string;
  crypto_amount: string;
  verification_status: string;
  purpose: string;
  created_at: string;
  transaction_hash: string;
}

interface WithdrawalRequest {
  id: string;
  amount: number;
  crypto_type: string;
  wallet_address: string;
  status: string;
  created_at: string;
}

interface CybertruckOrder {
  id: string;
  model: string;
  color: string;
  order_status: string;
  token_payment_status: string;
  created_at: string;
}

export const TransactionsHistoryView = () => {
  const [cryptoTransactions, setCryptoTransactions] = useState<CryptoTransaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [cybertruckOrders, setCybertruckOrders] = useState<CybertruckOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | "pending" | "verified" | "rejected">("all");

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [cryptoRes, withdrawalRes, cybertruckRes] = await Promise.all([
        supabase
          .from("crypto_transactions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("withdrawal_requests")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("cybertruck_orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
      ]);

      if (cryptoRes.data) setCryptoTransactions(cryptoRes.data);
      if (withdrawalRes.data) setWithdrawals(withdrawalRes.data);
      if (cybertruckRes.data) setCybertruckOrders(cybertruckRes.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
      case "approved":
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "rejected":
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-400 animate-pulse" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
      case "approved":
      case "completed":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Verified</Badge>;
      case "rejected":
      case "cancelled":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>;
    }
  };

  const getPurposeLabel = (purpose: string) => {
    switch (purpose) {
      case "investment":
        return "Investment";
      case "tier-upgrade":
        return "Tier Upgrade";
      case "cybertruck-token":
        return "Cybertruck Token";
      default:
        return purpose;
    }
  };

  const filterStatus = (status: string) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "pending") return status === "pending";
    if (activeFilter === "verified") return status === "verified" || status === "approved" || status === "completed";
    if (activeFilter === "rejected") return status === "rejected" || status === "cancelled";
    return true;
  };

  const filteredCrypto = cryptoTransactions.filter(t => filterStatus(t.verification_status));
  const filteredWithdrawals = withdrawals.filter(w => filterStatus(w.status));
  const filteredCybertruck = cybertruckOrders.filter(o => filterStatus(o.order_status));

  const totalPending = cryptoTransactions.filter(t => t.verification_status === "pending").length +
    withdrawals.filter(w => w.status === "pending").length +
    cybertruckOrders.filter(o => o.order_status === "pending").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Transaction History</h2>
          <p className="text-white/60">Track all your transactions and their status</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchTransactions}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          {totalPending > 0 && (
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              {totalPending} Pending
            </Badge>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "pending", "verified", "rejected"] as const).map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(filter)}
            className={activeFilter === filter 
              ? "bg-primary text-white" 
              : "border-white/20 text-white/70 hover:bg-white/10"
            }
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </Button>
        ))}
      </div>

      {/* Crypto Transactions */}
      {filteredCrypto.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Crypto Transactions</h3>
          </div>
          <div className="space-y-3">
            {filteredCrypto.map((tx) => (
              <div
                key={tx.id}
                className="bg-white/5 rounded-xl p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <ArrowUpRight className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-white font-medium">${tx.amount_usd.toLocaleString()}</p>
                    <p className="text-white/50 text-sm">
                      {tx.crypto_amount} {tx.crypto_type.toUpperCase()} • {getPurposeLabel(tx.purpose)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden md:block">
                    <p className="text-white/50 text-xs">
                      {new Date(tx.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="text-white/30 text-xs truncate max-w-[120px]">
                      {tx.transaction_hash.slice(0, 10)}...
                    </p>
                  </div>
                  {getStatusBadge(tx.verification_status)}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Withdrawal Requests */}
      {filteredWithdrawals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <ArrowDownLeft className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Withdrawal Requests</h3>
          </div>
          <div className="space-y-3">
            {filteredWithdrawals.map((withdrawal) => (
              <div
                key={withdrawal.id}
                className="bg-white/5 rounded-xl p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <ArrowDownLeft className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">${withdrawal.amount.toLocaleString()}</p>
                    <p className="text-white/50 text-sm">
                      {withdrawal.crypto_type.toUpperCase()} • {withdrawal.wallet_address.slice(0, 10)}...
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden md:block">
                    <p className="text-white/50 text-xs">
                      {new Date(withdrawal.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  {getStatusBadge(withdrawal.status)}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Cybertruck Orders */}
      {filteredCybertruck.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gray-500/20 flex items-center justify-center">
              <Truck className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Cybertruck Orders</h3>
          </div>
          <div className="space-y-3">
            {filteredCybertruck.map((order) => (
              <div
                key={order.id}
                className="bg-white/5 rounded-xl p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium capitalize">{order.model.replace(/-/g, ' ')}</p>
                    <p className="text-white/50 text-sm capitalize">
                      {order.color} • Token: {order.token_payment_status}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden md:block">
                    <p className="text-white/50 text-xs">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  {getStatusBadge(order.order_status)}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {filteredCrypto.length === 0 && filteredWithdrawals.length === 0 && filteredCybertruck.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-white/50" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Transactions Found</h3>
          <p className="text-white/50">
            {activeFilter === "all" 
              ? "You haven't made any transactions yet."
              : `No ${activeFilter} transactions found.`}
          </p>
        </motion.div>
      )}
    </div>
  );
};
