import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Bitcoin, Loader2, ExternalLink } from "lucide-react";

interface CryptoTransaction {
  id: string;
  user_id: string;
  application_id: string | null;
  transaction_hash: string;
  crypto_type: string;
  amount_usd: number;
  crypto_amount: string;
  verification_status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  verified_at: string | null;
  verified_by: string | null;
}

const CryptoTransactionsManagement = () => {
  const [transactions, setTransactions] = useState<CryptoTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<CryptoTransaction | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<"approve" | "reject" | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("crypto_transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch transactions: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const openActionDialog = (transaction: CryptoTransaction, action: "approve" | "reject") => {
    setSelectedTransaction(transaction);
    setAdminNotes(transaction.admin_notes || "");
    setDialogAction(action);
    setDialogOpen(true);
  };

  const handleVerification = async () => {
    if (!selectedTransaction || !dialogAction) return;

    try {
      setActionLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      const newStatus = dialogAction === "approve" ? "verified" : "rejected";
      
      // Update transaction in database
      const { error: updateError } = await supabase
        .from("crypto_transactions")
        .update({
          verification_status: newStatus,
          admin_notes: adminNotes,
          verified_at: new Date().toISOString(),
          verified_by: user?.id,
        })
        .eq("id", selectedTransaction.id);

      if (updateError) throw updateError;

      // Get user email for notification
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(
        selectedTransaction.user_id
      );

      if (userError) {
        console.error("Failed to get user email:", userError);
      }

      // Send email notification
      if (userData?.user?.email) {
        try {
          const { error: emailError } = await supabase.functions.invoke(
            "send-crypto-notification",
            {
              body: {
                userEmail: userData.user.email,
                status: newStatus,
                transactionHash: selectedTransaction.transaction_hash,
                cryptoType: selectedTransaction.crypto_type,
                amountUsd: selectedTransaction.amount_usd,
                cryptoAmount: selectedTransaction.crypto_amount,
                adminNotes: adminNotes || undefined,
              },
            }
          );

          if (emailError) {
            console.error("Failed to send email notification:", emailError);
            toast.error("Transaction updated but email notification failed");
          }
        } catch (emailError) {
          console.error("Email notification error:", emailError);
        }
      }

      toast.success(`Transaction ${dialogAction === "approve" ? "approved" : "rejected"} successfully`);
      setDialogOpen(false);
      fetchTransactions();
    } catch (error: any) {
      toast.error("Failed to update transaction: " + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "verified":
        return <Badge className="bg-green-500">Verified</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getCryptoIcon = (type: string) => {
    return <Bitcoin className="w-4 h-4" />;
  };

  const filterByStatus = (status: string) => {
    return transactions.filter((t) => t.verification_status === status);
  };

  const TransactionTable = ({ data }: { data: CryptoTransaction[] }) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Crypto</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Transaction Hash</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No transactions found
              </TableCell>
            </TableRow>
          ) : (
            data.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {new Date(transaction.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getCryptoIcon(transaction.crypto_type)}
                    {transaction.crypto_type}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">${transaction.amount_usd}</div>
                    <div className="text-xs text-muted-foreground">
                      {transaction.crypto_amount} {transaction.crypto_type}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {transaction.transaction_hash.substring(0, 10)}...
                    </code>
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(transaction.verification_status)}</TableCell>
                <TableCell>
                  {transaction.verification_status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openActionDialog(transaction, "approve")}
                        className="gap-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openActionDialog(transaction, "reject")}
                        className="gap-1"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </Button>
                    </div>
                  )}
                  {transaction.verification_status !== "pending" && (
                    <span className="text-xs text-muted-foreground">
                      {transaction.admin_notes && "Has notes"}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Crypto Transactions Management</h2>
        <p className="text-muted-foreground">
          Review and verify cryptocurrency donation transactions
        </p>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({filterByStatus("pending").length})
          </TabsTrigger>
          <TabsTrigger value="verified">
            Verified ({filterByStatus("verified").length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({filterByStatus("rejected").length})
          </TabsTrigger>
          <TabsTrigger value="all">All ({transactions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card className="p-6">
            <TransactionTable data={filterByStatus("pending")} />
          </Card>
        </TabsContent>

        <TabsContent value="verified">
          <Card className="p-6">
            <TransactionTable data={filterByStatus("verified")} />
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card className="p-6">
            <TransactionTable data={filterByStatus("rejected")} />
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card className="p-6">
            <TransactionTable data={transactions} />
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === "approve" ? "Approve" : "Reject"} Transaction
            </DialogTitle>
            <DialogDescription>
              {dialogAction === "approve"
                ? "This will mark the transaction as verified."
                : "This will mark the transaction as rejected."}
            </DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <div className="text-sm">
                  <span className="font-medium">Transaction Hash:</span>
                  <code className="block mt-1 text-xs bg-muted p-2 rounded break-all">
                    {selectedTransaction.transaction_hash}
                  </code>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Amount:</span> ${selectedTransaction.amount_usd} ({selectedTransaction.crypto_amount} {selectedTransaction.crypto_type})
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Admin Notes</label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this verification..."
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleVerification}
              disabled={actionLoading}
              className={dialogAction === "reject" ? "bg-destructive hover:bg-destructive/90" : ""}
            >
              {actionLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {dialogAction === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CryptoTransactionsManagement;
