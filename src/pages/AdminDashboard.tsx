import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { LogOut, Home, CheckCircle, XCircle, Clock, FileText, Key, Bitcoin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TokenManagement } from "@/components/admin/TokenManagement";
import CryptoTransactionsManagement from "@/components/admin/CryptoTransactionsManagement";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Application {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  application_type: string;
  status: string;
  created_at: string;
  notes?: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, [navigate]);

  const checkAdminStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    // Check if user has admin role
    const { data: roleData, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (error || !roleData) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/dashboard");
      return;
    }

    setIsAdmin(true);
    fetchApplications();
  };

  const fetchApplications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch applications");
      console.error(error);
    } else {
      setApplications(data || []);
    }
    setLoading(false);
  };

  const updateApplicationStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update application status");
      console.error(error);
    } else {
      toast.success(`Application ${status}`);
      fetchApplications();
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Navigation />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black mb-4">
              Admin <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage applications and access tokens
            </p>
          </div>

          <Tabs defaultValue="applications" className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="applications" className="gap-2">
                <FileText className="w-4 h-4" />
                Applications
              </TabsTrigger>
              <TabsTrigger value="crypto" className="gap-2">
                <Bitcoin className="w-4 h-4" />
                Crypto Payments
              </TabsTrigger>
              <TabsTrigger value="tokens" className="gap-2">
                <Key className="w-4 h-4" />
                Tokens
              </TabsTrigger>
            </TabsList>

            <TabsContent value="applications">
              <div className="bg-white border-2 border-border rounded-2xl p-6 shadow-lg">
                {loading ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading applications...</p>
                  </div>
                ) : applications.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No applications found</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">
                            {app.full_name}
                          </TableCell>
                          <TableCell>{app.email}</TableCell>
                          <TableCell>{app.phone}</TableCell>
                          <TableCell className="capitalize">
                            {app.application_type.replace("-", " ")}
                          </TableCell>
                          <TableCell>
                            {new Date(app.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(app.status)}
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                  app.status
                                )}`}
                              >
                                {app.status}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={app.status}
                              onValueChange={(value) =>
                                updateApplicationStatus(app.id, value)
                              }
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </TabsContent>

            <TabsContent value="crypto">
              <CryptoTransactionsManagement />
            </TabsContent>

            <TabsContent value="tokens">
              <TokenManagement />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
