import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { Copy, Check, Bitcoin, Wallet, ArrowLeft, TrendingUp, Heart, ArrowUpCircle } from "lucide-react";

interface CryptoPrices {
  bitcoin: number;
  ethereum: number;
  tether: number;
}

type PaymentPurpose = "donation" | "tier-upgrade";

const CryptoPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Determine payment purpose and amount
  const queryAmount = searchParams.get("amount");
  const stateAmount = location.state?.amount;
  const statePurpose = location.state?.purpose as PaymentPurpose | undefined;
  
  // If amount comes from query params (DonateView), it's a donation
  // If amount comes from state (Withdraw page), it's a tier upgrade
  const paymentPurpose: PaymentPurpose = statePurpose || (queryAmount ? "donation" : "tier-upgrade");
  const donationAmount = queryAmount || stateAmount || "0";
  
  const [copiedWallet, setCopiedWallet] = useState<string | null>(null);
  const [prices, setPrices] = useState<CryptoPrices | null>(null);
  const [loadingPrices, setLoadingPrices] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=usd'
        );
        const data = await response.json();
        setPrices({
          bitcoin: data.bitcoin.usd,
          ethereum: data.ethereum.usd,
          tether: data.tether.usd
        });
        setLoadingPrices(false);
      } catch (error) {
        console.error('Error fetching crypto prices:', error);
        toast.error('Failed to fetch current crypto prices');
        setLoadingPrices(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  const calculateCryptoAmount = (cryptoId: 'bitcoin' | 'ethereum' | 'tether') => {
    if (!prices || !donationAmount) return '0.00000000';
    const amount = parseFloat(donationAmount);
    const cryptoAmount = amount / prices[cryptoId];
    return cryptoAmount.toFixed(8);
  };

  const wallets = [
    {
      id: "btc",
      name: "Bitcoin (BTC)",
      cryptoId: "bitcoin" as const,
      icon: Bitcoin,
      address: "1152hrFxyzpKT9y4mRb5nbRjKbKrUmsPpd",
      color: "from-orange-400 to-orange-600"
    },
    {
      id: "usdt",
      name: "USDT (TRC20)",
      cryptoId: "tether" as const,
      icon: Wallet,
      address: "TQHm39utDGnAWprFyAceHuUCkyRbQvM9zP",
      color: "from-green-400 to-green-600"
    },
    {
      id: "eth",
      name: "Ethereum (ETH)",
      cryptoId: "ethereum" as const,
      icon: Wallet,
      address: "0x289205aa6594228cf623c7eabe1abfa9ea6ca770",
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

  const isDonation = paymentPurpose === "donation";
  
  // Determine which tier upgrade based on amount
  const getTierUpgradeInfo = () => {
    const amount = parseFloat(donationAmount);
    if (amount >= 3500) {
      return { tier: 3, name: "Tier 3 VIP Legacy" };
    }
    return { tier: 2, name: "Tier 2 Quantum Leap" };
  };
  
  const tierInfo = getTierUpgradeInfo();
  
  const headerConfig = {
    donation: {
      icon: Heart,
      iconGradient: "from-pink-400 to-red-500",
      title: "Complete Your",
      highlight: "Crypto Donation",
      subtitle: `Send your donation of`,
      bgAccent: "bg-green-50 border-green-200",
      infoBg: "bg-pink-50 border-pink-200"
    },
    "tier-upgrade": {
      icon: ArrowUpCircle,
      iconGradient: tierInfo.tier === 3 ? "from-purple-400 to-pink-500" : "from-yellow-400 to-orange-500",
      title: "Upgrade to",
      highlight: tierInfo.name,
      subtitle: `Send the upgrade fee of`,
      bgAccent: tierInfo.tier === 3 ? "bg-purple-50 border-purple-200" : "bg-yellow-50 border-yellow-200",
      infoBg: tierInfo.tier === 3 ? "bg-purple-50 border-purple-200" : "bg-amber-50 border-amber-200"
    }
  };

  const config = headerConfig[paymentPurpose];
  const HeaderIcon = config.icon;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-12 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${config.iconGradient} flex items-center justify-center mx-auto mb-4`}>
              <HeaderIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              {config.title} <span className="text-gradient">{config.highlight}</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              {config.subtitle} <span className="font-bold text-foreground">${donationAmount}</span> to any of these wallets
            </p>
            {loadingPrices ? (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4 animate-pulse" />
                Loading current crypto prices...
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {isDonation 
                  ? "Your transaction will be processed once we receive the payment"
                  : "Your tier will be upgraded once we verify your payment"
                }
              </p>
            )}
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
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg">{wallet.name}</h3>
                        {!loadingPrices && prices && (
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Amount to send</p>
                            <p className="font-bold text-sm">
                              {calculateCryptoAmount(wallet.cryptoId)} {wallet.id.toUpperCase()}
                            </p>
                          </div>
                        )}
                      </div>
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

          <div className="mt-8 space-y-4">
            <Card className={`p-6 ${config.bgAccent} border-2`}>
              <h4 className="font-bold mb-3">After Sending Payment</h4>
              <p className="text-sm text-muted-foreground mb-4">
                {isDonation 
                  ? "Once you've sent your donation, submit your transaction hash to verify your payment."
                  : "Once you've sent the upgrade fee, submit your transaction hash to complete your tier upgrade."
                }
              </p>
              <Button
                className="button-gradient"
                onClick={() => navigate("/payment-confirmation", {
                  state: {
                    amount: donationAmount,
                    cryptoType: "BTC",
                    cryptoAmount: calculateCryptoAmount("bitcoin"),
                    purpose: paymentPurpose
                  }
                })}
              >
                Submit Transaction Hash
              </Button>
            </Card>

            <div className={`p-6 ${config.infoBg} border-2 rounded-xl`}>
              <h4 className="font-bold mb-2">Important Information</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Send the exact amount or more to the wallet address</li>
                <li>• Double-check the wallet address before sending</li>
                <li>• Transactions are irreversible once sent</li>
                <li>• Processing may take a few minutes to confirm</li>
                {isDonation ? (
                  <li>• Your donation is tax-deductible</li>
                ) : (
                  <li>• Your tier benefits will activate after verification</li>
                )}
                <li>• Contact support if you need assistance</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CryptoPayment;
