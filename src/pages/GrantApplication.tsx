import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { z } from "zod";
import logoColor from "@/assets/logo-color.png";
import { LogOut, Award, Zap, TrendingUp } from "lucide-react";

const grantSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(20),
  address: z.string().trim().min(5, "Address is required").max(200),
  city: z.string().trim().min(2, "City is required").max(100),
  state: z.string().trim().min(2, "State is required").max(50),
  zipCode: z.string().trim().min(5, "ZIP code is required").max(10),
  grantTier: z.string().min(1, "Please select a grant tier"),
  projectDescription: z.string().trim().min(50, "Project description must be at least 50 characters").max(1000),
  token: z.string().trim().min(1, "Access token is required").max(100)
});

type GrantForm = z.infer<typeof grantSchema>;

const GrantApplication = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<GrantForm>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    grantTier: "",
    projectDescription: "",
    token: ""
  });

  const grantTiers = [
    {
      id: "starter",
      title: "Green Starter Grant",
      amount: "$5,000",
      icon: Zap,
      requiredScore: 0,
      description: "Perfect for getting started with your first sustainability project"
    },
    {
      id: "community",
      title: "Community Impact Grant",
      amount: "$15,000",
      icon: TrendingUp,
      requiredScore: 100,
      description: "Scale your impact and reach more communities"
    },
    {
      id: "innovation",
      title: "Innovation Excellence Grant",
      amount: "$50,000",
      icon: Award,
      requiredScore: 500,
      description: "For proven leaders creating transformative change"
    }
  ];

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      grantSchema.parse(formData);
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
          _application_type: 'grant application'
        });

      if (tokenError || !isValid) {
        toast.error("The token you entered is invalid, expired, or doesn't match grant application type");
        setLoading(false);
        return;
      }

      const selectedTier = grantTiers.find(t => t.id === formData.grantTier);
      const notes = `Grant Tier: ${selectedTier?.title}\nProject: ${formData.projectDescription}`;

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
          application_type: "grant application",
          token_code: formData.token.trim(),
          notes: notes,
          status: "pending"
        });

      if (error) {
        console.error("Error submitting application:", error);
        toast.error("Failed to submit application. Please try again.");
        return;
      }

      toast.success("Grant application submitted successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-border py-4 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <img src={logoColor} alt="Big Green" className="h-10 w-auto" />
          <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Grant <span className="text-gradient">Application</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Apply for a sustainability grant to fund your impact project
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {grantTiers.map((tier) => {
              const Icon = tier.icon;
              const isSelected = formData.grantTier === tier.id;
              
              return (
                <Card 
                  key={tier.id}
                  className={`p-6 cursor-pointer transition-all ${
                    isSelected ? 'border-green-tech border-2 bg-green-tech/5' : 'hover:border-green-tech/50'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, grantTier: tier.id }))}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{tier.title}</h3>
                  <p className="text-2xl font-bold text-green-tech mb-2">{tier.amount}</p>
                  <p className="text-sm text-muted-foreground mb-2">{tier.description}</p>
                  <p className="text-xs text-muted-foreground">Required Score: {tier.requiredScore}+</p>
                </Card>
              );
            })}
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

              <div className="space-y-2">
                <Label htmlFor="projectDescription">Project Description *</Label>
                <textarea
                  id="projectDescription"
                  name="projectDescription"
                  placeholder="Describe your sustainability project, its goals, and expected impact (minimum 50 characters)..."
                  value={formData.projectDescription}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  rows={6}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="token">Access Token *</Label>
                <Input
                  id="token"
                  name="token"
                  type="text"
                  placeholder="Enter your grant access token..."
                  value={formData.token}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter your grant access token. Contact support if you don't have one.
                </p>
              </div>

              <Button type="submit" className="button-gradient w-full md:w-auto px-12" disabled={loading || !formData.grantTier}>
                {loading ? "Submitting..." : "Submit Grant Application"}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GrantApplication;