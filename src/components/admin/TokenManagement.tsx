import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Copy, Trash2, Edit, CheckCircle, XCircle, Key } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface Token {
  id: string;
  token_code: string;
  application_type: string;
  is_active: boolean;
  max_uses: number | null;
  current_uses: number;
  created_at: string;
  expires_at: string | null;
}

export const TokenManagement = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingToken, setEditingToken] = useState<Token | null>(null);
  const [formData, setFormData] = useState({
    token_code: "",
    application_type: "",
    max_uses: "",
    expires_at: "",
    is_active: true,
  });

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tokens")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch tokens");
      console.error(error);
    } else {
      setTokens(data || []);
    }
    setLoading(false);
  };

  const generateRandomToken = () => {
    const prefix = formData.application_type
      .toUpperCase()
      .replace(/\s+/g, "")
      .substring(0, 4);
    const randomString = Math.random().toString(36).substring(2, 10).toUpperCase();
    const timestamp = Date.now().toString(36).toUpperCase();
    return `${prefix}-${randomString}-${timestamp}`;
  };

  const handleGenerateToken = () => {
    if (!formData.application_type) {
      toast.error("Please select an application type first");
      return;
    }
    setFormData((prev) => ({ ...prev, token_code: generateRandomToken() }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.token_code || !formData.application_type) {
      toast.error("Token code and application type are required");
      return;
    }

    try {
      const tokenData = {
        token_code: formData.token_code,
        application_type: formData.application_type,
        is_active: formData.is_active,
        max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
        expires_at: formData.expires_at || null,
      };

      if (editingToken) {
        const { error } = await supabase
          .from("tokens")
          .update(tokenData)
          .eq("id", editingToken.id);

        if (error) throw error;
        toast.success("Token updated successfully");
      } else {
        const { error } = await supabase
          .from("tokens")
          .insert([tokenData]);

        if (error) throw error;
        toast.success("Token created successfully");
      }

      setDialogOpen(false);
      resetForm();
      fetchTokens();
    } catch (error: any) {
      toast.error(error.message || "Failed to save token");
      console.error(error);
    }
  };

  const handleEdit = (token: Token) => {
    setEditingToken(token);
    setFormData({
      token_code: token.token_code,
      application_type: token.application_type,
      max_uses: token.max_uses?.toString() || "",
      expires_at: token.expires_at ? token.expires_at.split("T")[0] : "",
      is_active: token.is_active,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this token?")) return;

    const { error } = await supabase
      .from("tokens")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete token");
      console.error(error);
    } else {
      toast.success("Token deleted successfully");
      fetchTokens();
    }
  };

  const toggleTokenStatus = async (token: Token) => {
    const { error } = await supabase
      .from("tokens")
      .update({ is_active: !token.is_active })
      .eq("id", token.id);

    if (error) {
      toast.error("Failed to update token status");
      console.error(error);
    } else {
      toast.success(`Token ${!token.is_active ? "activated" : "deactivated"}`);
      fetchTokens();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Token copied to clipboard");
  };

  const resetForm = () => {
    setFormData({
      token_code: "",
      application_type: "",
      max_uses: "",
      expires_at: "",
      is_active: true,
    });
    setEditingToken(null);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const getUsagePercentage = (token: Token) => {
    if (!token.max_uses) return 0;
    return (token.current_uses / token.max_uses) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Token Management</h2>
          <p className="text-muted-foreground">
            Create and manage access tokens for applications
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button className="button-gradient gap-2">
              <Plus className="w-4 h-4" />
              Create Token
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingToken ? "Edit Token" : "Create New Token"}
              </DialogTitle>
              <DialogDescription>
                {editingToken
                  ? "Update the token settings below"
                  : "Generate a new access token for applications"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="application_type">Application Type *</Label>
                <Select
                  value={formData.application_type}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, application_type: value }))
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grant application">Grant Application</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                    <SelectItem value="business funding">Business Funding</SelectItem>
                    <SelectItem value="donation">Donation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="token_code">Token Code *</Label>
                <div className="flex gap-2">
                  <Input
                    id="token_code"
                    value={formData.token_code}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        token_code: e.target.value.toUpperCase(),
                      }))
                    }
                    placeholder="TOKEN-CODE-HERE"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGenerateToken}
                    className="gap-2"
                  >
                    <Key className="w-4 h-4" />
                    Generate
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_uses">Max Uses (Optional)</Label>
                <Input
                  id="max_uses"
                  type="number"
                  value={formData.max_uses}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, max_uses: e.target.value }))
                  }
                  placeholder="Leave empty for unlimited"
                  min="1"
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty for unlimited uses
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expires_at">Expiration Date (Optional)</Label>
                <Input
                  id="expires_at"
                  type="date"
                  value={formData.expires_at}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, expires_at: e.target.value }))
                  }
                  min={new Date().toISOString().split("T")[0]}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty for no expiration
                </p>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">Active Status</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, is_active: checked }))
                  }
                />
              </div>

              <DialogFooter>
                <Button type="submit" className="button-gradient w-full">
                  {editingToken ? "Update Token" : "Create Token"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading tokens...</p>
          </div>
        ) : tokens.length === 0 ? (
          <div className="text-center py-12">
            <Key className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No tokens created yet</p>
            <Button
              onClick={() => setDialogOpen(true)}
              variant="outline"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Your First Token
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Token Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokens.map((token) => {
                  const expired = isExpired(token.expires_at);
                  const usagePercent = getUsagePercentage(token);
                  const maxedOut = token.max_uses && token.current_uses >= token.max_uses;

                  return (
                    <TableRow key={token.id}>
                      <TableCell className="font-mono font-medium">
                        <div className="flex items-center gap-2">
                          <span>{token.token_code}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(token.token_code)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">
                        {token.application_type}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {token.is_active && !expired && !maxedOut ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-green-600 text-sm font-medium">
                                Active
                              </span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-red-600" />
                              <span className="text-red-600 text-sm font-medium">
                                {expired ? "Expired" : maxedOut ? "Max Uses" : "Inactive"}
                              </span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            {token.current_uses}
                            {token.max_uses ? ` / ${token.max_uses}` : " / ∞"}
                          </div>
                          {token.max_uses && (
                            <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all ${
                                  usagePercent >= 100
                                    ? "bg-red-500"
                                    : usagePercent >= 75
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                }`}
                                style={{ width: `${Math.min(usagePercent, 100)}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {token.expires_at ? (
                          <span
                            className={expired ? "text-red-600 font-medium" : ""}
                          >
                            {new Date(token.expires_at).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Never</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(token.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Switch
                            checked={token.is_active}
                            onCheckedChange={() => toggleTokenStatus(token)}
                            disabled={expired || maxedOut}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(token)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(token.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
            <Key className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold mb-2">About Access Tokens</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Tokens are required for users to submit applications</li>
              <li>• Each token is tied to a specific application type</li>
              <li>• Set usage limits to control how many times a token can be used</li>
              <li>• Add expiration dates for time-limited campaigns</li>
              <li>• Deactivate tokens at any time to prevent further use</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};