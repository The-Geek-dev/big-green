import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Key, CreditCard, Check, Info } from "lucide-react";
import { z } from "zod";

const orderSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address must be at least 5 characters").max(200),
  city: z.string().min(2, "City must be at least 2 characters").max(100),
  state: z.string().min(2, "State must be at least 2 characters").max(100),
  zipCode: z.string().min(3, "Zip code must be at least 3 characters").max(20),
  country: z.string().min(2, "Country must be at least 2 characters").max(100),
  tokenKey: z.string().min(8, "Token key must be at least 8 characters").max(50),
});

const CybertruckOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    tokenKey: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const customization = location.state as {
    model: string;
    color: string;
    interior: string;
    accessories: string[];
  } | null;

  useEffect(() => {
    if (!customization) {
      toast.error("Please customize your Cybertruck first");
      navigate("/cybertruck-customize");
      return;
    }

    const loadUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setFormData(prev => ({
          ...prev,
          email: user.email || "",
          fullName: user.user_metadata?.full_name || "",
        }));
      }
    };

    loadUserData();
  }, [customization, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateToken = async () => {
    if (!formData.tokenKey || formData.tokenKey.length < 8) {
      setErrors(prev => ({ ...prev, tokenKey: "Token key must be at least 8 characters" }));
      return;
    }

    setValidatingToken(true);
    try {
      const { data, error } = await supabase
        .from("cybertruck_tokens")
        .select("*")
        .eq("token_key", formData.tokenKey)
        .eq("is_used", false)
        .single();

      if (error || !data) {
        setTokenValid(false);
        setErrors(prev => ({ ...prev, tokenKey: "Invalid or already used token key" }));
      } else {
        setTokenValid(true);
        toast.success("Token key validated successfully!");
      }
    } catch (error) {
      setTokenValid(false);
      setErrors(prev => ({ ...prev, tokenKey: "Failed to validate token key" }));
    } finally {
      setValidatingToken(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = orderSchema.parse(formData);
      
      if (!tokenValid) {
        toast.error("Please enter and validate a token key");
        return;
      }

      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to continue");
        navigate("/auth");
        return;
      }

      // Create the order
      const { error: orderError } = await supabase
        .from("cybertruck_orders")
        .insert({
          user_id: user.id,
          model: customization!.model,
          color: customization!.color,
          interior: customization!.interior,
          accessories: customization!.accessories,
          full_name: validated.fullName,
          email: validated.email,
          address: validated.address,
          city: validated.city,
          state: validated.state,
          zip_code: validated.zipCode,
          country: validated.country,
          token_key: validated.tokenKey,
          token_key_verified: true,
        });

      if (orderError) throw orderError;

      // Mark token as used
      await supabase
        .from("cybertruck_tokens")
        .update({ is_used: true, used_by: user.id, used_at: new Date().toISOString() })
        .eq("token_key", validated.tokenKey);

      toast.success("Order submitted successfully!");
      navigate("/user-dashboard", { state: { orderSuccess: true } });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        console.error("Error submitting order:", error);
        toast.error("Failed to submit order");
      }
    } finally {
      setLoading(false);
    }
  };

  const modelNames: Record<string, string> = {
    "all-wheel-drive": "All-Wheel Drive",
    "cyberbeast": "Cyberbeast",
  };

  const colorNames: Record<string, string> = {
    "stainless-steel": "Stainless Steel",
    "matte-black": "Matte Black Wrap",
    "satin-white": "Satin White Wrap",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navigation />
      
      <div className="container max-w-4xl mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-center mb-2">Complete Your Order</h1>
          <p className="text-white/60 text-center mb-8">Fill in your delivery details and token key</p>

          {/* Order Summary */}
          {customization && (
            <Card className="bg-white/5 border-white/10 mb-8">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="text-white/80">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-white/50 text-sm">Model</p>
                    <p className="font-medium">{modelNames[customization.model]}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">Exterior</p>
                    <p className="font-medium">{colorNames[customization.color]}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">Interior</p>
                    <p className="font-medium capitalize">{customization.interior}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">Accessories</p>
                    <p className="font-medium">{customization.accessories.length} items</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Token Key Notice */}
          <Card className="bg-gradient-to-r from-primary/20 to-yellow-500/20 border-primary/30 mb-8">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Key className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Need a Token Key?</h3>
                  <p className="text-white/70 text-sm mb-3">
                    Token keys are required to verify your Cybertruck order. Get your unique token key for $2,500.
                  </p>
                  <Button
                    onClick={() => navigate("/crypto-payment", { 
                      state: { 
                        amount: 2500, 
                        purpose: "cybertruck-token",
                        returnTo: "/cybertruck-order",
                        customization
                      } 
                    })}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Get Token Key for $2,500
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Form */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName" className="text-white/80">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="John Doe"
                      />
                      {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-white/80">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="john@example.com"
                      />
                      {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Delivery Address</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address" className="text-white/80">Street Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="123 Main Street"
                      />
                      {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city" className="text-white/80">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="bg-white/10 border-white/20 text-white"
                          placeholder="Austin"
                        />
                        {errors.city && <p className="text-red-400 text-sm mt-1">{errors.city}</p>}
                      </div>
                      <div>
                        <Label htmlFor="state" className="text-white/80">State</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="bg-white/10 border-white/20 text-white"
                          placeholder="Texas"
                        />
                        {errors.state && <p className="text-red-400 text-sm mt-1">{errors.state}</p>}
                      </div>
                      <div>
                        <Label htmlFor="zipCode" className="text-white/80">Zip Code</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          className="bg-white/10 border-white/20 text-white"
                          placeholder="78701"
                        />
                        {errors.zipCode && <p className="text-red-400 text-sm mt-1">{errors.zipCode}</p>}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="country" className="text-white/80">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="United States"
                      />
                      {errors.country && <p className="text-red-400 text-sm mt-1">{errors.country}</p>}
                    </div>
                  </div>
                </div>

                {/* Token Key */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Token Key Verification</h3>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Input
                        id="tokenKey"
                        name="tokenKey"
                        value={formData.tokenKey}
                        onChange={(e) => {
                          handleChange(e);
                          setTokenValid(null);
                        }}
                        className={`bg-white/10 border-white/20 text-white ${
                          tokenValid === true ? "border-green-500" : 
                          tokenValid === false ? "border-red-500" : ""
                        }`}
                        placeholder="Enter your token key"
                      />
                      {errors.tokenKey && <p className="text-red-400 text-sm mt-1">{errors.tokenKey}</p>}
                    </div>
                    <Button
                      type="button"
                      onClick={validateToken}
                      disabled={validatingToken || !formData.tokenKey}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      {validatingToken ? "Validating..." : tokenValid ? <Check className="w-4 h-4" /> : "Validate"}
                    </Button>
                  </div>
                  {tokenValid && (
                    <p className="text-green-400 text-sm mt-2 flex items-center gap-2">
                      <Check className="w-4 h-4" /> Token key is valid and ready to use
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading || !tokenValid}
                  className="w-full bg-primary hover:bg-primary/90 py-6 text-lg"
                >
                  {loading ? "Submitting Order..." : "Submit Order"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CybertruckOrder;
