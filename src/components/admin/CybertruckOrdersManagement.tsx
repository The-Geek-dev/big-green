import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Check, X, Eye, Plus, Trash, Copy, Key, Truck } from "lucide-react";

interface CybertruckOrder {
  id: string;
  user_id: string;
  model: string;
  color: string;
  interior: string;
  accessories: string[];
  full_name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  token_key: string;
  token_key_verified: boolean;
  token_payment_status: string;
  order_status: string;
  admin_notes: string | null;
  created_at: string;
}

interface CybertruckToken {
  id: string;
  token_key: string;
  is_used: boolean;
  used_by: string | null;
  created_at: string;
  expires_at: string | null;
}

export const CybertruckOrdersManagement = () => {
  const [orders, setOrders] = useState<CybertruckOrder[]>([]);
  const [tokens, setTokens] = useState<CybertruckToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<CybertruckOrder | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [showAddTokenDialog, setShowAddTokenDialog] = useState(false);
  const [newTokenKey, setNewTokenKey] = useState("");
  const [generatingToken, setGeneratingToken] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchData = async () => {
    try {
      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from("cybertruck_orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);

      // Fetch tokens
      const { data: tokensData, error: tokensError } = await supabase
        .from("cybertruck_tokens")
        .select("*")
        .order("created_at", { ascending: false });

      if (tokensError) throw tokensError;
      setTokens(tokensData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("cybertruck_orders")
        .update({
          order_status: newStatus,
          admin_notes: adminNotes || null,
          verified_by: user?.id,
          verified_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (error) throw error;

      toast.success(`Order ${newStatus === "approved" ? "approved" : "rejected"}`);
      setSelectedOrder(null);
      setAdminNotes("");
      fetchData();
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
    }
  };

  const generateTokenKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let token = "CTK-";
    for (let i = 0; i < 12; i++) {
      if (i > 0 && i % 4 === 0) token += "-";
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewTokenKey(token);
  };

  const handleAddToken = async () => {
    if (!newTokenKey || newTokenKey.length < 8) {
      toast.error("Token key must be at least 8 characters");
      return;
    }

    setGeneratingToken(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("cybertruck_tokens")
        .insert({
          token_key: newTokenKey,
          created_by: user?.id,
        });

      if (error) throw error;

      toast.success("Token created successfully");
      setShowAddTokenDialog(false);
      setNewTokenKey("");
      fetchData();
    } catch (error) {
      console.error("Error creating token:", error);
      toast.error("Failed to create token");
    } finally {
      setGeneratingToken(false);
    }
  };

  const handleDeleteToken = async (tokenId: string) => {
    try {
      const { error } = await supabase
        .from("cybertruck_tokens")
        .delete()
        .eq("id", tokenId);

      if (error) throw error;

      toast.success("Token deleted");
      fetchData();
    } catch (error) {
      console.error("Error deleting token:", error);
      toast.error("Failed to delete token");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      case "shipped":
        return <Badge className="bg-blue-500">Shipped</Badge>;
      default:
        return <Badge className="bg-yellow-500">Pending</Badge>;
    }
  };

  const filteredOrders = statusFilter === "all" 
    ? orders 
    : orders.filter(o => o.order_status === statusFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="orders">
        <TabsList className="bg-white/10">
          <TabsTrigger value="orders" className="data-[state=active]:bg-primary">
            <Truck className="w-4 h-4 mr-2" />
            Orders ({orders.length})
          </TabsTrigger>
          <TabsTrigger value="tokens" className="data-[state=active]:bg-primary">
            <Key className="w-4 h-4 mr-2" />
            Token Keys ({tokens.length})
          </TabsTrigger>
        </TabsList>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-4">
          {/* Status Filter */}
          <div className="flex gap-2">
            {["all", "pending", "approved", "rejected", "shipped"].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className={statusFilter !== status ? "border-white/20 text-white hover:bg-white/10" : ""}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="text-white/70">Customer</TableHead>
                    <TableHead className="text-white/70">Model</TableHead>
                    <TableHead className="text-white/70">Token Key</TableHead>
                    <TableHead className="text-white/70">Status</TableHead>
                    <TableHead className="text-white/70">Date</TableHead>
                    <TableHead className="text-white/70">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-white">
                        <div>
                          <p className="font-medium">{order.full_name}</p>
                          <p className="text-white/50 text-sm">{order.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-white capitalize">{order.model.replace("-", " ")}</TableCell>
                      <TableCell className="text-white font-mono text-sm">{order.token_key || "N/A"}</TableCell>
                      <TableCell>{getStatusBadge(order.order_status)}</TableCell>
                      <TableCell className="text-white/70">
                        {new Date(order.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedOrder(order);
                              setAdminNotes(order.admin_notes || "");
                            }}
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {order.order_status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleStatusUpdate(order.id, "approved")}
                                className="bg-green-500 hover:bg-green-600"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleStatusUpdate(order.id, "rejected")}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredOrders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-white/50 py-8">
                        No orders found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tokens Tab */}
        <TabsContent value="tokens" className="space-y-4">
          <Button
            onClick={() => setShowAddTokenDialog(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Generate New Token
          </Button>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="text-white/70">Token Key</TableHead>
                    <TableHead className="text-white/70">Status</TableHead>
                    <TableHead className="text-white/70">Created</TableHead>
                    <TableHead className="text-white/70">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tokens.map((token) => (
                    <TableRow key={token.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-white font-mono">{token.token_key}</TableCell>
                      <TableCell>
                        {token.is_used ? (
                          <Badge className="bg-gray-500">Used</Badge>
                        ) : (
                          <Badge className="bg-green-500">Available</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-white/70">
                        {new Date(token.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(token.token_key)}
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          {!token.is_used && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteToken(token.id)}
                              className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {tokens.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-white/50 py-8">
                        No tokens found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="bg-gray-900 border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/50 text-sm">Customer</p>
                  <p className="font-medium">{selectedOrder.full_name}</p>
                  <p className="text-sm text-white/70">{selectedOrder.email}</p>
                </div>
                <div>
                  <p className="text-white/50 text-sm">Delivery Address</p>
                  <p className="text-sm">
                    {selectedOrder.address}<br />
                    {selectedOrder.city}, {selectedOrder.state} {selectedOrder.zip_code}<br />
                    {selectedOrder.country}
                  </p>
                </div>
                <div>
                  <p className="text-white/50 text-sm">Model</p>
                  <p className="capitalize">{selectedOrder.model.replace("-", " ")}</p>
                </div>
                <div>
                  <p className="text-white/50 text-sm">Color</p>
                  <p className="capitalize">{selectedOrder.color.replace("-", " ")}</p>
                </div>
                <div>
                  <p className="text-white/50 text-sm">Interior</p>
                  <p className="capitalize">{selectedOrder.interior}</p>
                </div>
                <div>
                  <p className="text-white/50 text-sm">Token Key</p>
                  <p className="font-mono text-sm">{selectedOrder.token_key}</p>
                </div>
              </div>
              
              {selectedOrder.accessories.length > 0 && (
                <div>
                  <p className="text-white/50 text-sm mb-2">Accessories</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedOrder.accessories.map((acc) => (
                      <Badge key={acc} variant="outline" className="border-white/20">
                        {acc}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-white/50 text-sm mb-2">Admin Notes</p>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this order..."
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              {selectedOrder.order_status === "pending" && (
                <DialogFooter className="gap-2">
                  <Button
                    onClick={() => handleStatusUpdate(selectedOrder.id, "rejected")}
                    variant="outline"
                    className="border-red-500 text-red-400 hover:bg-red-500/20"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate(selectedOrder.id, "approved")}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                </DialogFooter>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Token Dialog */}
      <Dialog open={showAddTokenDialog} onOpenChange={setShowAddTokenDialog}>
        <DialogContent className="bg-gray-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Generate New Token Key</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newTokenKey}
                onChange={(e) => setNewTokenKey(e.target.value)}
                placeholder="Token key..."
                className="bg-white/10 border-white/20 text-white font-mono"
              />
              <Button
                type="button"
                variant="outline"
                onClick={generateTokenKey}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Generate
              </Button>
            </div>
            <p className="text-white/50 text-sm">
              This token can be sold to Tier 3 users for $2,500 to claim their Cybertruck.
            </p>
            <DialogFooter>
              <Button
                onClick={handleAddToken}
                disabled={generatingToken || !newTokenKey}
                className="bg-primary hover:bg-primary/90"
              >
                {generatingToken ? "Creating..." : "Create Token"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
