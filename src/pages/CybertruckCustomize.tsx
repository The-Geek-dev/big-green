import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ChevronRight, Lock } from "lucide-react";

import cybertruckImage from "@/assets/tesla-cybertruck.jpg";

const CybertruckCustomize = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userTier, setUserTier] = useState(1);
  const [selectedModel, setSelectedModel] = useState("all-wheel-drive");
  const [selectedColor, setSelectedColor] = useState("stainless-steel");
  const [selectedInterior, setSelectedInterior] = useState("dark");
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);

  useEffect(() => {
    const checkEligibility = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error("Please sign in to access this page");
          navigate("/auth");
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("tier_level")
          .eq("user_id", user.id)
          .single();

        if (error) throw error;

        setUserTier(profile?.tier_level || 1);

        if (profile?.tier_level < 3) {
          toast.error("You need to be Tier 3 to access Cybertruck customization");
          navigate("/user-dashboard");
        }
      } catch (error) {
        console.error("Error checking eligibility:", error);
        toast.error("Failed to verify eligibility");
        navigate("/user-dashboard");
      } finally {
        setLoading(false);
      }
    };

    checkEligibility();
  }, [navigate]);

  const models = [
    { id: "all-wheel-drive", name: "All-Wheel Drive", price: "$79,990", range: "325 mi", acceleration: "4.1s" },
    { id: "cyberbeast", name: "Cyberbeast", price: "$99,990", range: "301 mi", acceleration: "2.6s" },
  ];

  const colors = [
    { id: "stainless-steel", name: "Stainless Steel", hex: "#C0C0C0" },
    { id: "matte-black", name: "Matte Black Wrap", hex: "#1a1a1a" },
    { id: "satin-white", name: "Satin White Wrap", hex: "#f5f5f5" },
  ];

  const interiors = [
    { id: "dark", name: "Dark Interior", color: "#1a1a1a" },
    { id: "light", name: "Light Interior", color: "#d4d4d4" },
  ];

  const accessories = [
    { id: "fsd", name: "Full Self-Driving Capability", price: "$12,000" },
    { id: "tow-hitch", name: "Tow Hitch", price: "$1,500" },
    { id: "wheel-covers", name: "Wheel Covers", price: "$400" },
    { id: "floor-mats", name: "All-Weather Floor Mats", price: "$225" },
    { id: "cargo-cover", name: "Cargo Cover", price: "$195" },
  ];

  const toggleAccessory = (id: string) => {
    setSelectedAccessories(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    navigate("/cybertruck-order", {
      state: {
        model: selectedModel,
        color: selectedColor,
        interior: selectedInterior,
        accessories: selectedAccessories,
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (userTier < 3) {
    return null;
  }

  const selectedModelData = models.find(m => m.id === selectedModel)!;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <div className="flex flex-col lg:flex-row min-h-screen pt-20">
        {/* Left Side - Vehicle Preview */}
        <div className="lg:w-2/3 relative flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-900 to-black">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl"
          >
            <img
              src={cybertruckImage}
              alt="Tesla Cybertruck"
              className="w-full h-auto object-contain"
              style={{
                filter: selectedColor === "matte-black" ? "brightness(0.7)" : 
                        selectedColor === "satin-white" ? "brightness(1.1) saturate(0.8)" : "none"
              }}
            />
          </motion.div>
          
          {/* Color indicator */}
          <div className="mt-8 flex items-center gap-4">
            {colors.map((color) => (
              <button
                key={color.id}
                onClick={() => setSelectedColor(color.id)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  selectedColor === color.id ? "border-white scale-125" : "border-transparent"
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Right Side - Configuration */}
        <div className="lg:w-1/3 bg-white text-black p-8 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Header */}
            <h1 className="text-4xl font-bold tracking-tight mb-2 font-mono">CYBERTRUCK</h1>
            
            <div className="flex gap-8 mb-6 text-sm">
              <div>
                <span className="text-2xl font-bold">{selectedModelData.range}</span>
                <p className="text-gray-500">Range (est.)</p>
              </div>
              <div>
                <span className="text-2xl font-bold">11,000<span className="text-sm">lbs</span></span>
                <p className="text-gray-500">Towing capacity</p>
              </div>
              <div>
                <span className="text-2xl font-bold">{selectedModelData.acceleration}</span>
                <p className="text-gray-500">0-60 mph</p>
              </div>
            </div>

            {/* Model Selection */}
            <div className="border-b pb-4 mb-4">
              <p className="text-sm text-gray-500 mb-3">Select Model</p>
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`w-full flex items-center justify-between p-4 border rounded-lg mb-2 transition-all ${
                    selectedModel === model.id 
                      ? "border-black bg-gray-50" 
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <span className="font-medium">{model.name}</span>
                  <span className="text-gray-600">{model.price}</span>
                </button>
              ))}
            </div>

            {/* Interior Selection */}
            <div className="border-b pb-4 mb-4">
              <p className="text-sm text-gray-500 mb-3">Interior</p>
              <div className="flex gap-4">
                {interiors.map((interior) => (
                  <button
                    key={interior.id}
                    onClick={() => setSelectedInterior(interior.id)}
                    className={`flex-1 p-4 border rounded-lg transition-all ${
                      selectedInterior === interior.id 
                        ? "border-black" 
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <div 
                      className="w-8 h-8 rounded-full mb-2 mx-auto" 
                      style={{ backgroundColor: interior.color }}
                    />
                    <span className="text-sm">{interior.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Accessories */}
            <div className="border-b pb-4 mb-4">
              <p className="text-sm text-gray-500 mb-3">Accessories (Optional)</p>
              {accessories.map((accessory) => (
                <button
                  key={accessory.id}
                  onClick={() => toggleAccessory(accessory.id)}
                  className={`w-full flex items-center justify-between p-3 border rounded-lg mb-2 transition-all ${
                    selectedAccessories.includes(accessory.id) 
                      ? "border-black bg-gray-50" 
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                      selectedAccessories.includes(accessory.id) ? "bg-black border-black" : "border-gray-300"
                    }`}>
                      {selectedAccessories.includes(accessory.id) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-sm">{accessory.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">{accessory.price}</span>
                </button>
              ))}
            </div>

            {/* VIP Notice */}
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 mb-6">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-yellow-800">🏆 VIP Tier 3 Exclusive</p>
                <p className="text-xs text-yellow-700 mt-1">
                  As a VIP Legacy member, your Cybertruck is complimentary! You only need a valid Token Key to complete your order.
                </p>
              </CardContent>
            </Card>

            {/* Continue Button */}
            <Button
              onClick={handleContinue}
              className="w-full bg-black text-white hover:bg-gray-800 py-6 text-lg"
            >
              Continue to Order Details
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CybertruckCustomize;
