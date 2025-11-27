import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { CheckCircle2, Clock, Home, LogOut, DollarSign, Building2 } from "lucide-react";

const FundingApplication = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [applicationStatus, setApplicationStatus] = useState<string>("pending");
  const [fundingAmount, setFundingAmount] = useState<string>("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [accountDetails, setAccountDetails] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
    routingNumber: ""
  });

  useEffect(() => {
    const checkAuthAndFetchStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUserEmail(session.user.email || "");

      const { data: application, error } = await supabase
        .from("applications")
        .select("status, notes")
        .eq("user_id", session.user.id)
        .eq("application_type", "business funding")
        .order("created_at", { ascending: false })
        .maybeSingle();

      if (error) {
        console.error("Error fetching application:", error);
        return;
      }

      if (application) {
        setApplicationStatus(application.status);
        
        // Extract funding amount from notes
        if (application.notes) {
          const match = application.notes.match(/Funding Needed: ([^\n]+)/);
          if (match) {
            setFundingAmount(match[1]);
          }
        }
      }
    };

    checkAuthAndFetchStatus();

    const channel = supabase
      .channel('funding-application-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'applications',
          filter: `application_type=eq.business funding`
        },
        (payload) => {
          setApplicationStatus(payload.new.status);
        }
      )
      .subscribe();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        navigate("/auth");
      }
    });

    return () => {
      supabase.removeChannel(channel);
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (!accountDetails.accountName || !accountDetails.accountNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success("Payment information submitted! You will receive further instructions via email.");
    setShowPaymentForm(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 py-12 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Funding Application <span className="text-gradient">Tracking</span>
            </h1>
            <p className="text-lg text-muted-foreground">{userEmail}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white border-2 border-border rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center gap-4 mb-4">
                {applicationStatus === "approved" ? (
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                ) : (
                  <Clock className="w-8 h-8 text-yellow-600" />
                )}
                <h3 className="text-xl font-bold">Application Status</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Current Status:</p>
                <p className="text-lg font-semibold capitalize">{applicationStatus}</p>
                {fundingAmount && (
                  <>
                    <p className="text-sm text-muted-foreground mt-4">Requested Amount:</p>
                    <p className="text-lg font-semibold">{fundingAmount}</p>
                  </>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white border-2 border-border rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center gap-4 mb-4">
                <Building2 className="w-8 h-8 text-blue-600" />
                <h3 className="text-xl font-bold">Next Steps</h3>
              </div>
              <div className="space-y-2">
                {applicationStatus === "pending" && (
                  <p className="text-sm">Your application is being reviewed by our team. We'll notify you once a decision is made.</p>
                )}
                {applicationStatus === "approved" && !showPaymentForm && (
                  <>
                    <p className="text-sm mb-4">Congratulations! Your funding has been approved.</p>
                    <Button onClick={() => setShowPaymentForm(true)} className="button-gradient w-full">
                      Proceed to Payment
                    </Button>
                  </>
                )}
                {applicationStatus === "rejected" && (
                  <p className="text-sm">Unfortunately, your application was not approved. Please contact support for more information.</p>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white border-2 border-border rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center gap-4 mb-4">
                <DollarSign className="w-8 h-8 text-green-600" />
                <h3 className="text-xl font-bold">Need Help?</h3>
              </div>
              <p className="text-sm mb-4">
                If you have questions about your application or need assistance, our support team is here to help.
              </p>
              <Button variant="outline" className="w-full">Contact Support</Button>
            </motion.div>
          </div>

          {showPaymentForm && applicationStatus === "approved" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white border-2 border-border rounded-2xl p-8 md:p-12 shadow-lg"
            >
              <h2 className="text-3xl font-black mb-6">
                Processing Fee <span className="text-gradient">Payment</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                To process your approved funding, a one-time processing fee of <span className="font-bold text-foreground">$1,000.00</span> is required.
              </p>

              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method *</Label>
                  <select
                    id="paymentMethod"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Select payment method</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="wire_transfer">Wire Transfer</option>
                    <option value="check">Check</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountName">Account Holder Name *</Label>
                  <Input
                    id="accountName"
                    type="text"
                    placeholder="John Doe"
                    value={accountDetails.accountName}
                    onChange={(e) => setAccountDetails({ ...accountDetails, accountName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number *</Label>
                  <Input
                    id="accountNumber"
                    type="text"
                    placeholder="xxxx-xxxx-xxxx-1234"
                    value={accountDetails.accountNumber}
                    onChange={(e) => setAccountDetails({ ...accountDetails, accountNumber: e.target.value })}
                    required
                  />
                </div>

                {(paymentMethod === "bank_transfer" || paymentMethod === "wire_transfer") && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name *</Label>
                      <Input
                        id="bankName"
                        type="text"
                        placeholder="Bank of America"
                        value={accountDetails.bankName}
                        onChange={(e) => setAccountDetails({ ...accountDetails, bankName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="routingNumber">Routing Number *</Label>
                      <Input
                        id="routingNumber"
                        type="text"
                        placeholder="123456789"
                        value={accountDetails.routingNumber}
                        onChange={(e) => setAccountDetails({ ...accountDetails, routingNumber: e.target.value })}
                        required
                      />
                    </div>
                  </>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <strong>Note:</strong> After submitting your payment information, you will receive instructions on how to complete the $1,000 processing fee payment via your selected method.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="button-gradient flex-1">
                    Submit Payment Information
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowPaymentForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white border-2 border-border rounded-2xl p-8 mt-8 shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-4">Application Process Timeline</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Application Submitted</h3>
                  <p className="text-sm text-muted-foreground">Your business funding application has been received.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  applicationStatus === "approved" ? "bg-green-600" : "bg-gray-300"
                }`}>
                  {applicationStatus === "approved" ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <Clock className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">Review & Approval</h3>
                  <p className="text-sm text-muted-foreground">
                    {applicationStatus === "approved"
                      ? "Your application has been approved!"
                      : "Our team is reviewing your application."}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  showPaymentForm ? "bg-yellow-500" : "bg-gray-300"
                }`}>
                  <DollarSign className={`w-5 h-5 ${showPaymentForm ? "text-white" : "text-gray-600"}`} />
                </div>
                <div>
                  <h3 className="font-semibold">Processing Fee Payment</h3>
                  <p className="text-sm text-muted-foreground">Complete the $1,000 processing fee payment.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Funds Disbursement</h3>
                  <p className="text-sm text-muted-foreground">Your approved funding will be transferred to your account.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default FundingApplication;
