import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import logoColor from "@/assets/logo-color.png";
import { Copy, Check, Bitcoin, Wallet, ArrowLeft } from "lucide-react";

const CryptoPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const donationAmount = location.state?.amount || "0";
  const [copiedWallet, setCopiedWallet] = useState<string | null>(null);

  const wallets = [
    {
      id: "btc",
      name: "Bitcoin (BTC)",
      icon: Bitcoin,
      address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      color: "from-orange-400 to-orange-600"
    },
    {
      id: "usdt",
      name: "USDT (TRC20)",
      icon: Wallet,
      address: "TMwFHYXLJaRUPeW6421aqXL4ZEzPRFGkGT",
      color: "from-green-400 to-green-600"
    },
    {
      id: "eth",
      name: "Ethereum (ETH)",
      icon: Wallet,
      address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      color: "from-blue-400 to-purple-600"
    }
  ];

  const copyToClipboard = async (address: string, walletId: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedWallet(walletId);
      toast.success("Wallet address copied!");
      setTimeout(() => setCopiedWallet(null), 2000);
    } catch (error) {
      toast.error("Failed to copy address");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-border py-4 px-4 md:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <img src={logoColor} alt="Big Green" className="h-10 w-auto" />
          <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <Bitcoin className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Complete Your <span className="text-gradient">Crypto Donation</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              Send your donation of <span className="font-bold text-foreground">${donationAmount}</span> to any of these wallets
            </p>
            <p className="text-sm text-muted-foreground">
              Your transaction will be processed once we receive the payment
            </p>
          </div>

          <div className="space-y-6">
            {wallets.map((wallet) => {
              const Icon = wallet.icon;
              const isCopied = copiedWallet === wallet.id;

              return (
                <Card key={wallet.id} className="p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${wallet.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg mb-2">{wallet.name}</h3>
                      <div className="bg-muted rounded-lg p-3 mb-3">
                        <p className="text-sm font-mono break-all">{wallet.address}</p>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(wallet.address, wallet.id)}
                        className="gap-2"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy Address
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="mt-8 p-6 bg-amber-50 border-2 border-amber-200 rounded-xl">
            <h4 className="font-bold mb-2">Important Information</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Send the exact amount or more to the wallet address</li>
              <li>• Double-check the wallet address before sending</li>
              <li>• Transactions are irreversible once sent</li>
              <li>• Processing may take a few minutes to confirm</li>
              <li>• Contact support if you need assistance</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CryptoPayment;
