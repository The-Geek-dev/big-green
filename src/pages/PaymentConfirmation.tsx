import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { z } from "zod";
import logoColor from "@/assets/logo-color.png";
import { ArrowLeft, CheckCircle2, Clock, XCircle, Send } from "lucide-react";

const transactionSchema = z.object({
  transactionHash: z.string()
    .trim()
    .min(10, "Transaction hash must be at least 10 characters")
    .max(200, "Transaction hash is too long"),
  cryptoType: z.enum(["BTC", "ETH", "USDT"]),
  cryptoAmount: z.string().min(1, "Crypto amount is required")
});

type TransactionFormType = z.infer<typeof transactionSchema>;

interface Transaction {
  id: string;
  transaction_hash: string;
  crypto_type: string;
  amount_usd: number;
  crypto_amount: string;
  verification_status: string;
  created_at: string;
  admin_notes: string | null;
}

const PaymentConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { amount, cryptoType, cryptoAmount, applicationId } = location.state || {};
  
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [formData, setFormData] = useState<TransactionFormType>({
    transactionHash: "",
    cryptoType: cryptoType || "BTC",
    cryptoAmount: cryptoAmount || ""
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      } else {
        loadTransactions();
      }
    };
    checkAuth();
  }, [navigate]);

  const loadTransactions = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from("crypto_transactions")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error("Error loading transactions:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      transactionSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in");
        navigate("/auth");
        return;
      }

      const { error } = await supabase
        .from("crypto_transactions")
        .insert({
          user_id: session.user.id,
          application_id: applicationId || null,
          transaction_hash: formData.transactionHash.trim(),
          crypto_type: formData.cryptoType,
          amount_usd: parseFloat(amount || "0"),
          crypto_amount: formData.cryptoAmount,
          verification_status: "pending"
        });

      if (error) {
        console.error("Error submitting transaction:", error);
        toast.error("Failed to submit transaction. Please try again.");
        return;
      }

      toast.success("Transaction submitted! We'll verify it shortly.");
      setFormData({ ...formData, transactionHash: "" });
      loadTransactions();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to submit transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-amber-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-500">Verified</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-border py-4 px-4 md:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <img src={logoColor} alt="Big Green" className="h-10 w-auto" />
          <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Confirm Your <span className="text-gradient">Payment</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Submit your transaction hash to verify your donation
            </p>
          </div>

          <Card className="p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Submit Transaction Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cryptoType">Cryptocurrency *</Label>
                <select
                  id="cryptoType"
                  value={formData.cryptoType}
                  onChange={(e) => setFormData({ ...formData, cryptoType: e.target.value as any })}
                  disabled={loading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="USDT">USDT (TRC20)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cryptoAmount">Amount Sent (in crypto) *</Label>
                <Input
                  id="cryptoAmount"
                  name="cryptoAmount"
                  type="text"
                  placeholder="0.00012345"
                  value={formData.cryptoAmount}
                  onChange={(e) => setFormData({ ...formData, cryptoAmount: e.target.value })}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="transactionHash">Transaction Hash / TXID *</Label>
                <Input
                  id="transactionHash"
                  name="transactionHash"
                  type="text"
                  placeholder="Enter your transaction hash or TXID"
                  value={formData.transactionHash}
                  onChange={(e) => setFormData({ ...formData, transactionHash: e.target.value })}
                  disabled={loading}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Find this in your wallet's transaction history after sending the payment
                </p>
              </div>

              <Button
                type="submit"
                className="button-gradient w-full md:w-auto px-12"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit for Verification"}
              </Button>
            </form>
          </Card>

          {transactions.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Your Transactions</h2>
              {transactions.map((tx) => (
                <Card key={tx.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(tx.verification_status)}
                      <div>
                        <h3 className="font-bold">{tx.crypto_type} Transaction</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(tx.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(tx.verification_status)}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount (USD):</span>
                      <span className="font-semibold">${tx.amount_usd}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount ({tx.crypto_type}):</span>
                      <span className="font-semibold">{tx.crypto_amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transaction Hash:</span>
                      <span className="font-mono text-xs break-all">{tx.transaction_hash}</span>
                    </div>
                    {tx.admin_notes && (
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <p className="text-xs font-semibold mb-1">Admin Notes:</p>
                        <p className="text-xs">{tx.admin_notes}</p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
