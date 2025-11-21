import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { z } from "zod";
import logoColor from "@/assets/logo-color.png";
import { LogOut } from "lucide-react";
const applicationSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(20),
  address: z.string().trim().min(5, "Address is required").max(200),
  tier: z.enum(["tier1", "tier2", "tier3"], {
    required_error: "Please select a tier"
  }),
  message: z.string().trim().max(1000, "Message must be less than 1000 characters").optional()
});
type ApplicationForm = z.infer<typeof applicationSchema>;
const Application = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [formData, setFormData] = useState<ApplicationForm>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    tier: "tier1",
    message: ""
  });
  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUserEmail(session.user.email || "");
        setFormData(prev => ({
          ...prev,
          email: session.user.email || ""
        }));
      }
    });

    // Listen for auth changes
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate("/auth");
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    try {
      applicationSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
    }
    setLoading(true);
    try {
      // Here you would typically send the form data to your backend
      // For now, we'll just show a success message
      console.log("Form submitted:", formData);
      toast.success("Application submitted successfully! We'll be in touch soon.");

      // Reset form
      setFormData({
        fullName: "",
        email: userEmail,
        phone: "",
        address: "",
        tier: "tier1",
        message: ""
      });
    } catch (error) {
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border py-4 px-4 md:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <img src={logoColor} alt="Big Green" className="h-10 w-auto" />
          <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }}>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
               Application <span className="text-gradient">Application</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Complete the form below to apply for your Big Green    
            </p>
          </div>

          <div className="bg-white border-2 border-border rounded-2xl p-8 md:p-12 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input id="fullName" name="fullName" type="text" placeholder="John Doe" value={formData.fullName} onChange={handleChange} required disabled={loading} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required disabled={loading} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={handleChange} required disabled={loading} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tier">Investment Tier *</Label>
                  <select id="tier" name="tier" value={formData.tier} onChange={handleChange} required disabled={loading} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <option value="tier1">Tier 1 - The Gateway ($65,000)</option>
                    <option value="tier2">Tier 2 - The Quantum Leap ($1,000 investment)</option>
                    <option value="tier3">Tier 3 - The VIP Legacy (Cybertruck included)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input id="address" name="address" type="text" placeholder="123 Main St, City, State, ZIP" value={formData.address} onChange={handleChange} required disabled={loading} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Additional Information (Optional)</Label>
                <Textarea id="message" name="message" placeholder="Tell us more about your interest in Big Green and sustainable investing..." value={formData.message} onChange={handleChange} disabled={loading} rows={5} maxLength={1000} />
              </div>

              <div className="bg-muted/50 border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  By submitting this application, you agree to our terms and conditions. 
                  We will review your application and contact you within 2-3 business days.
                </p>
              </div>

              <Button type="submit" className="button-gradient w-full md:w-auto px-12" disabled={loading}>
                {loading ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>;
};
export default Application;