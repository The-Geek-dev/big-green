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
import { LogOut, Heart, Sprout, Users, School } from "lucide-react";

const donationSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(20),
  donationAmount: z.string().min(1, "Please select or enter a donation amount"),
  donationPurpose: z.string().min(1, "Please select a donation purpose"),
  message: z.string().trim().min(20, "Please share why you want to donate (minimum 20 characters)").max(500),
  token: z.string().trim().min(1, "Access token is required").max(100)
});

type DonationFormType = z.infer<typeof donationSchema>;

const DonationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<DonationFormType>({
    fullName: "",
    email: "",
    phone: "",
    donationAmount: "",
    donationPurpose: "",
    message: "",
    token: ""
  });

  const donationAmounts = ["25", "50", "100", "250", "500", "1000"];

  const purposes = [
    { id: "community", title: "Community Gardens", icon: Sprout, description: "Support local urban farming initiatives" },
    { id: "schools", title: "School Programs", icon: School, description: "Fund educational sustainability programs" },
    { id: "general", title: "General Impact", icon: Users, description: "Support all our sustainability efforts" }
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
      donationSchema.parse(formData);
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
        toast.error("You must be logged in to make a donation");
        navigate("/auth");
        return;
      }

      const { data: isValid, error: tokenError } = await supabase
        .rpc('validate_and_consume_token', {
          _token_code: formData.token.trim(),
          _application_type: 'donation'
        });

      if (tokenError || !isValid) {
        toast.error("The token you entered is invalid, expired, or doesn't match donation type");
        setLoading(false);
        return;
      }

      const selectedPurpose = purposes.find(p => p.id === formData.donationPurpose);
      const notes = `Amount: $${formData.donationAmount}\nPurpose: ${selectedPurpose?.title}\nMessage: ${formData.message}`;

      const { error } = await supabase
        .from("applications")
        .insert({
          user_id: session.user.id,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: "N/A",
          city: "N/A",
          state: "N/A",
          zip_code: "00000",
          application_type: "donation",
          token_code: formData.token.trim(),
          notes: notes,
          status: "pending"
        });

      if (error) {
        console.error("Error submitting donation:", error);
        toast.error("Failed to submit donation. Please try again.");
        return;
      }

      toast.success("Thank you for your generous donation!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to submit donation. Please try again.");
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
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Make a <span className="text-gradient">Donation</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Your contribution helps us create lasting environmental impact
            </p>
          </div>

          <div className="bg-white border-2 border-border rounded-2xl p-8 md:p-12 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <Label>Donation Amount *</Label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {donationAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, donationAmount: amount }))}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.donationAmount === amount
                          ? 'border-green-tech bg-green-tech/10 font-semibold'
                          : 'border-border hover:border-green-tech/50'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                <Input
                  name="donationAmount"
                  type="number"
                  placeholder="Or enter custom amount"
                  value={formData.donationAmount}
                  onChange={handleChange}
                  disabled={loading}
                  min="1"
                />
              </div>

              <div className="space-y-4">
                <Label>Where should your donation go? *</Label>
                <div className="grid md:grid-cols-3 gap-4">
                  {purposes.map((purpose) => {
                    const Icon = purpose.icon;
                    const isSelected = formData.donationPurpose === purpose.id;
                    
                    return (
                      <Card
                        key={purpose.id}
                        className={`p-4 cursor-pointer transition-all ${
                          isSelected ? 'border-green-tech border-2 bg-green-tech/5' : 'hover:border-green-tech/50'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, donationPurpose: purpose.id }))}
                      >
                        <Icon className={`w-8 h-8 mb-2 ${isSelected ? 'text-green-tech' : 'text-muted-foreground'}`} />
                        <h3 className="font-semibold mb-1">{purpose.title}</h3>
                        <p className="text-xs text-muted-foreground">{purpose.description}</p>
                      </Card>
                    );
                  })}
                </div>
              </div>

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
                <Label htmlFor="message">Why do you want to donate? *</Label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Share your motivation for supporting our mission (minimum 20 characters)..."
                  value={formData.message}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="token">Access Token *</Label>
                <Input
                  id="token"
                  name="token"
                  type="text"
                  placeholder="Enter your donation access token..."
                  value={formData.token}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter your donation access token. Contact support if you don't have one.
                </p>
              </div>

              <Button type="submit" className="button-gradient w-full md:w-auto px-12" disabled={loading || !formData.donationAmount || !formData.donationPurpose}>
                {loading ? "Processing..." : "Complete Donation"}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DonationForm;