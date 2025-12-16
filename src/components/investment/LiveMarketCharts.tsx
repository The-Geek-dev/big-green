import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, Bitcoin, DollarSign, Car } from "lucide-react";
import { motion } from "framer-motion";

interface MarketData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  icon: any;
  color: string;
  minInvestment: number;
  type: "crypto" | "stock";
}

export const LiveMarketCharts = () => {
  const navigate = useNavigate();
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        // Fetch crypto prices
        const cryptoResponse = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,dogecoin&vs_currencies=usd&include_24hr_change=true'
        );
        const cryptoData = await cryptoResponse.json();

        // Tesla stock data (simulated for demo - in production use a stock API)
        const teslaStocks = [
          { id: "tsla", name: "Tesla Inc.", symbol: "TSLA", price: 248.50, change24h: 2.45, type: "stock" as const },
          { id: "tsla-options", name: "Tesla Options", symbol: "TSLA-OPT", price: 15.30, change24h: -1.20, type: "stock" as const },
        ];

        const combinedData: MarketData[] = [
          {
            id: "bitcoin",
            name: "Bitcoin",
            symbol: "BTC",
            price: cryptoData.bitcoin?.usd || 0,
            change24h: cryptoData.bitcoin?.usd_24h_change || 0,
            icon: Bitcoin,
            color: "from-orange-400 to-orange-600",
            minInvestment: 100,
            type: "crypto"
          },
          {
            id: "ethereum",
            name: "Ethereum",
            symbol: "ETH",
            price: cryptoData.ethereum?.usd || 0,
            change24h: cryptoData.ethereum?.usd_24h_change || 0,
            icon: DollarSign,
            color: "from-blue-400 to-purple-600",
            minInvestment: 50,
            type: "crypto"
          },
          {
            id: "solana",
            name: "Solana",
            symbol: "SOL",
            price: cryptoData.solana?.usd || 0,
            change24h: cryptoData.solana?.usd_24h_change || 0,
            icon: DollarSign,
            color: "from-purple-400 to-pink-600",
            minInvestment: 25,
            type: "crypto"
          },
          {
            id: "dogecoin",
            name: "Dogecoin",
            symbol: "DOGE",
            price: cryptoData.dogecoin?.usd || 0,
            change24h: cryptoData.dogecoin?.usd_24h_change || 0,
            icon: DollarSign,
            color: "from-yellow-400 to-yellow-600",
            minInvestment: 10,
            type: "crypto"
          },
          {
            ...teslaStocks[0],
            icon: Car,
            color: "from-red-400 to-red-600",
            minInvestment: 250
          },
          {
            ...teslaStocks[1],
            icon: Car,
            color: "from-red-500 to-pink-600",
            minInvestment: 100
          }
        ];

        setMarketData(combinedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching market data:', error);
        setLoading(false);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleInvest = (asset: MarketData) => {
    navigate("/crypto-payment", {
      state: {
        purpose: "investment",
        investmentName: asset.name,
        investmentSymbol: asset.symbol,
        investmentType: asset.type,
        amount: asset.minInvestment.toString(),
        currentPrice: asset.price
      }
    });
  };

  // Generate mini chart data (simulated sparkline)
  const generateSparkline = (isPositive: boolean) => {
    const points = [];
    let value = 50;
    for (let i = 0; i < 20; i++) {
      value += (Math.random() - (isPositive ? 0.4 : 0.6)) * 10;
      value = Math.max(10, Math.min(90, value));
      points.push(value);
    }
    return points;
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-800 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Live Market Data</h2>
        <p className="text-gray-400 text-sm mb-6">Real-time crypto and Tesla stock prices. Invest with admin-verified transactions.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {marketData.map((asset, index) => {
          const Icon = asset.icon;
          const isPositive = asset.change24h >= 0;
          const sparkline = generateSparkline(isPositive);

          return (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 bg-gray-900 border-gray-800 hover:border-green-600/50 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${asset.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{asset.name}</h3>
                      <p className="text-xs text-gray-400">{asset.symbol}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {isPositive ? '+' : ''}{asset.change24h.toFixed(2)}%
                  </div>
                </div>

                {/* Mini Sparkline Chart */}
                <div className="h-12 mb-3 relative">
                  <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id={`gradient-${asset.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d={`M 0 ${100 - sparkline[0]} ${sparkline.map((v, i) => `L ${(i / (sparkline.length - 1)) * 100} ${100 - v}`).join(' ')} L 100 100 L 0 100 Z`}
                      fill={`url(#gradient-${asset.id})`}
                    />
                    <path
                      d={`M 0 ${100 - sparkline[0]} ${sparkline.map((v, i) => `L ${(i / (sparkline.length - 1)) * 100} ${100 - v}`).join(' ')}`}
                      fill="none"
                      stroke={isPositive ? "#22c55e" : "#ef4444"}
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-400">Current Price</p>
                    <p className="text-lg font-bold text-white">
                      ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Min. Investment</p>
                    <p className="text-sm font-semibold text-green-400">${asset.minInvestment}</p>
                  </div>
                </div>

                <Button
                  className="w-full button-gradient text-sm"
                  size="sm"
                  onClick={() => handleInvest(asset)}
                >
                  Invest Now
                </Button>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
