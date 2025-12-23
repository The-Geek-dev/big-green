import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
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
import { CheckCircle, XCircle, Clock, Wallet, DollarSign } from "lucide-react";
import { sendNotification, createInAppNotification } from "@/utils/notifications";

interface WithdrawalRequest {
  id: string;
  user_id: string;
  user_email: string | null;
  amount: number;
  crypto_type: string;
  wallet_address: string;
  status: string;
  admin_notes: string | null;
  processed_by: string | null;
  processed_at: string | null;
  created_at: string;
  updated_at: string;
}

const WithdrawalRequestsManagement = () => {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);
  const [actionType, setActionType] = useState<"approved" | "rejected" | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("withdrawal_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch withdrawal requests");
      console.error(error);
    } else {
      setRequests(data || []);
    }
    setLoading(false);
  };

  const openActionDialog = (request: WithdrawalRequest, action: "approved" | "rejected") => {
    setSelectedRequest(request);
    setActionType(action);
    setAdminNotes(request.admin_notes || "");
    setDialogOpen(true);
  };

  const handleProcessRequest = async () => {
    if (!selectedRequest || !actionType) return;

    setProcessing(true);
    const { data: { session } } = await supabase.auth.getSession();

    const { error } = await supabase
      .from("withdrawal_requests")
      .update({
        status: actionType,
        admin_notes: adminNotes,
        processed_by: session?.user.id,
        processed_at: new Date().toISOString(),
      })
      .eq("id", selectedRequest.id);

    if (error) {
      toast.error("Failed to process withdrawal request");
      console.error(error);
    } else {
      const notificationType = actionType === "approved" ? "withdrawal_approved" : "withdrawal_rejected";
      
      // Create in-app notification
      await createInAppNotification(
        selectedRequest.user_id,
        notificationType,
        {
          amount: Number(selectedRequest.amount),
          cryptoType: selectedRequest.crypto_type,
          walletAddress: selectedRequest.wallet_address,
          adminNotes: adminNotes || undefined,
        }
      );
      
      // Send email notification if we have email
      if (selectedRequest.user_email) {
        await sendNotification(
          notificationType,
          selectedRequest.user_email,
          undefined,
          {
            amount: Number(selectedRequest.amount),
            cryptoType: selectedRequest.crypto_type,
            walletAddress: selectedRequest.wallet_address,
            adminNotes: adminNotes || undefined,
          }
        );
      }
      
      toast.success(`Withdrawal request ${actionType}`);
      fetchRequests();
    }

    setProcessing(false);
    setDialogOpen(false);
    setSelectedRequest(null);
    setActionType(null);
    setAdminNotes("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500/20 text-green-600 border-green-500/30"><CheckCircle className="w-3 h-3 mr-1" /> Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/20 text-red-600 border-red-500/30"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
    }
  };

  const getCryptoIcon = () => <Wallet className="w-4 h-4 text-primary" />;

  const filterByStatus = (status: string | null) => {
    if (!status) return requests;
    return requests.filter((r) => r.status === status);
  };

  const RequestsTable = ({ data }: { data: WithdrawalRequest[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Crypto</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Wallet Address</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
              No withdrawal requests found
            </TableCell>
          </TableRow>
        ) : (
          data.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                <span className="text-sm font-medium">
                  {request.user_email || "N/A"}
                </span>
              </TableCell>
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
              No withdrawal requests found
            </TableCell>
          </TableRow>
        ) : (
              <TableCell>
                <div className="flex items-center gap-2">
                  {getCryptoIcon()}
                  <span className="uppercase font-medium">{request.crypto_type}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span className="font-semibold">{Number(request.amount).toLocaleString()}</span>
                </div>
              </TableCell>
              <TableCell>
                <code className="text-xs bg-muted px-2 py-1 rounded max-w-[200px] truncate block">
                  {request.wallet_address}
                </code>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(request.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>{getStatusBadge(request.status)}</TableCell>
              <TableCell>
                {request.status === "pending" ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 border-green-500/50 hover:bg-green-500/10"
                      onClick={() => openActionDialog(request, "approved")}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-500/50 hover:bg-red-500/10"
                      onClick={() => openActionDialog(request, "rejected")}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    {request.processed_at
                      ? `Processed ${new Date(request.processed_at).toLocaleDateString()}`
                      : "—"}
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  if (loading) {
    return (
      <div className="bg-card border-2 border-border rounded-2xl p-6 shadow-lg">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading withdrawal requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border-2 border-border rounded-2xl p-6 shadow-lg">
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="w-4 h-4" />
            Pending ({filterByStatus("pending").length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="gap-2">
            <CheckCircle className="w-4 h-4" />
            Approved ({filterByStatus("approved").length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="gap-2">
            <XCircle className="w-4 h-4" />
            Rejected ({filterByStatus("rejected").length})
          </TabsTrigger>
          <TabsTrigger value="all">All ({requests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <RequestsTable data={filterByStatus("pending")} />
        </TabsContent>
        <TabsContent value="approved">
          <RequestsTable data={filterByStatus("approved")} />
        </TabsContent>
        <TabsContent value="rejected">
          <RequestsTable data={filterByStatus("rejected")} />
        </TabsContent>
        <TabsContent value="all">
          <RequestsTable data={requests} />
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approved" ? "Approve" : "Reject"} Withdrawal Request
            </DialogTitle>
            <DialogDescription>
              {actionType === "approved"
                ? "Confirm that you have processed this withdrawal and sent the funds."
                : "Provide a reason for rejecting this withdrawal request."}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-semibold">${Number(selectedRequest.amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Crypto:</span>
                  <span className="uppercase font-medium">{selectedRequest.crypto_type}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Wallet:</span>
                  <code className="text-xs bg-background p-2 rounded break-all">
                    {selectedRequest.wallet_address}
                  </code>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Admin Notes</label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder={
                    actionType === "approved"
                      ? "Transaction ID or confirmation details..."
                      : "Reason for rejection..."
                  }
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleProcessRequest}
              disabled={processing}
              className={
                actionType === "approved"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {processing
                ? "Processing..."
                : actionType === "approved"
                ? "Confirm Approval"
                : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WithdrawalRequestsManagement;
