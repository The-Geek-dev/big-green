import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";
import logoColor from "@/assets/logo-color.png";
import { LogOut, Building2 } from "lucide-react";

const businessSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(20),
  address: z.string().trim().min(5, "Address is required").max(200),
  city: z.string().trim().min(2, "City is required").max(100),
  state: z.string().trim().min(2, "State is required").max(50),
  zipCode: z.string().trim().min(5, "ZIP code is required").max(10),
  businessName: z.string().trim().min(2, "Business name is required").max(150),
  businessType: z.string().min(1, "Please select a business type"),
  yearsInBusiness: z.string().min(1, "Years in business is required"),
  fundingAmount: z.string().min(1, "Funding amount is required"),
  fundingPurpose: z.string().trim().min(50, "Please provide detailed funding purpose (minimum 50 characters)").max(1000),
  token: z.string().trim().min(1, "Access token is required").max(100)
});

type BusinessForm = z.infer<typeof businessSchema>;

const BusinessFunding = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BusinessForm>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    businessName: "",
    businessType: "",
    yearsInBusiness: "",
    fundingAmount: "",
    fundingPurpose: "",
    token: ""
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setFormData(prev => ({ ...prev, email: session.user.email || "" }));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
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
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      businessSchema.parse(formData);
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
        toast.error("You must be logged in to submit an application");
        navigate("/auth");
        return;
      }

      const { data: isValid, error: tokenError } = await supabase
        .rpc('validate_and_consume_token', {
          _token_code: formData.token.trim(),
          _application_type: 'business funding'
        });

      if (tokenError || !isValid) {
        toast.error("The token you entered is invalid, expired, or doesn't match business funding type");
        setLoading(false);
        return;
      }

      const notes = `Business: ${formData.businessName}\nType: ${formData.businessType}\nYears: ${formData.yearsInBusiness}\nFunding Needed: ${formData.fundingAmount}\nPurpose: ${formData.fundingPurpose}`;

      const { error } = await supabase
        .from("applications")
        .insert({
          user_id: session.user.id,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode,
          application_type: "business funding",
          token_code: formData.token.trim(),
          notes: notes,
          status: "pending"
        });

      if (error) {
        console.error("Error submitting application:", error);
        toast.error("Failed to submit application. Please try again.");
        return;
      }

      toast.success("Business funding application submitted successfully!");
      navigate("/funding-application");
    } catch (error) {
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-border py-4 px-4 md:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <img src={logoColor} alt="Big Green" className="h-10 w-auto" />
          <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Business <span className="text-gradient">Funding</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Get funding for your sustainable business venture
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

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={handleChange} required disabled={loading} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Street Address *</Label>
                <Input id="address" name="address" type="text" placeholder="123 Main St" value={formData.address} onChange={handleChange} required disabled={loading} />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" name="city" type="text" placeholder="City" value={formData.city} onChange={handleChange} required disabled={loading} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input id="state" name="state" type="text" placeholder="State" value={formData.state} onChange={handleChange} required disabled={loading} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input id="zipCode" name="zipCode" type="text" placeholder="12345" value={formData.zipCode} onChange={handleChange} required disabled={loading} />
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="text-xl font-bold mb-4">Business Information</h3>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input id="businessName" name="businessName" type="text" placeholder="Your Business Name" value={formData.businessName} onChange={handleChange} required disabled={loading} />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="businessType">Business Type *</Label>
                      <select
                        id="businessType"
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select type</option>
                        <option value="LLC">LLC</option>
                        <option value="Corporation">Corporation</option>
                        <option value="Sole Proprietorship">Sole Proprietorship</option>
                        <option value="Partnership">Partnership</option>
                        <option value="Non-Profit">Non-Profit</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="yearsInBusiness">Years in Business *</Label>
                      <Input id="yearsInBusiness" name="yearsInBusiness" type="number" placeholder="5" min="0" value={formData.yearsInBusiness} onChange={handleChange} required disabled={loading} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fundingAmount">Funding Amount Needed *</Label>
                    <Input id="fundingAmount" name="fundingAmount" type="text" placeholder="$50,000" value={formData.fundingAmount} onChange={handleChange} required disabled={loading} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fundingPurpose">How will you use the funding? *</Label>
                    <textarea
                      id="fundingPurpose"
                      name="fundingPurpose"
                      placeholder="Describe in detail how you plan to use the funding and the expected impact (minimum 50 characters)..."
                      value={formData.fundingPurpose}
                      onChange={handleChange}
                      disabled={loading}
                      required
                      rows={6}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="token">Access Token *</Label>
                <Input
                  id="token"
                  name="token"
                  type="text"
                  placeholder="Enter your business funding access token..."
                  value={formData.token}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter your business funding access token. Contact support if you don't have one.
                </p>
              </div>

              <Button type="submit" className="button-gradient w-full md:w-auto px-12" disabled={loading}>
                {loading ? "Submitting..." : "Submit Funding Application"}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BusinessFunding;