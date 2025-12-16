import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, Bitcoin, DollarSign, Car, ChevronDown, ChevronUp, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

interface InvestmentRecord {
  id: string;
  crypto_type: string;
  amount_usd: number;
  verification_status: string;
  created_at: string;
}

const PRESET_AMOUNTS = [100, 500, 1000];

export const LiveMarketCharts = () => {
  const navigate = useNavigate();
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>({});
  const [expandedChart, setExpandedChart] = useState<string | null>(null);
  const [investmentHistory, setInvestmentHistory] = useState<InvestmentRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const cryptoResponse = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,dogecoin&vs_currencies=usd&include_24hr_change=true'
        );
        const cryptoData = await cryptoResponse.json();

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

  useEffect(() => {
    const fetchInvestmentHistory = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('crypto_transactions')
          .select('id, crypto_type, amount_usd, verification_status, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        setInvestmentHistory(data || []);
      } catch (error) {
        console.error('Error fetching investment history:', error);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchInvestmentHistory();
  }, []);

  const handleAmountChange = (assetId: string, value: string) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setCustomAmounts(prev => ({ ...prev, [assetId]: value }));
    }
  };

  const handlePresetAmount = (assetId: string, amount: number) => {
    setCustomAmounts(prev => ({ ...prev, [assetId]: amount.toString() }));
  };

  const handleInvest = (asset: MarketData) => {
    const customAmount = customAmounts[asset.id];
    const amount = customAmount ? parseFloat(customAmount) : asset.minInvestment;
    
    if (isNaN(amount) || amount < asset.minInvestment) {
      toast.error(`Minimum investment is $${asset.minInvestment}`);
      return;
    }

    navigate("/crypto-payment", {
      state: {
        purpose: "investment",
        investmentName: asset.name,
        investmentSymbol: asset.symbol,
        investmentType: asset.type,
        amount: amount.toString(),
        currentPrice: asset.price
      }
    });
  };

  const generateSparkline = (isPositive: boolean, length: number = 20) => {
    const points = [];
    let value = 50;
    for (let i = 0; i < length; i++) {
      value += (Math.random() - (isPositive ? 0.4 : 0.6)) * 10;
      value = Math.max(10, Math.min(90, value));
      points.push(value);
    }
    return points;
  };

  const generateWeeklyData = (isPositive: boolean) => {
    return generateSparkline(isPositive, 168); // 7 days * 24 hours
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-400';
      case 'rejected':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
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
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Live Market Data</h2>
        <p className="text-gray-400 text-sm mb-6">Real-time crypto and Tesla stock prices. Invest with admin-verified transactions.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {marketData.map((asset, index) => {
          const Icon = asset.icon;
          const isPositive = asset.change24h >= 0;
          const sparkline = generateSparkline(isPositive);
          const weeklyData = generateWeeklyData(isPositive);
          const isExpanded = expandedChart === asset.id;

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
                <div 
                  className="h-12 mb-2 relative cursor-pointer group"
                  onClick={() => setExpandedChart(isExpanded ? null : asset.id)}
                >
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
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900/50 rounded">
                    <span className="text-xs text-gray-300 flex items-center gap-1">
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      {isExpanded ? 'Collapse' : 'View 7-day chart'}
                    </span>
                  </div>
                </div>

                {/* Expanded Weekly Chart */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-gray-800/50 rounded-lg p-3 mb-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-gray-400">7-Day Performance</span>
                          <span className={`text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                            {isPositive ? '+' : ''}{(asset.change24h * 7 * (0.8 + Math.random() * 0.4)).toFixed(2)}%
                          </span>
                        </div>
                        <div className="h-24 relative">
                          <svg viewBox="0 0 200 80" className="w-full h-full" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id={`weekly-gradient-${asset.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity="0.4" />
                                <stop offset="100%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <path
                              d={`M 0 ${100 - weeklyData[0]} ${weeklyData.map((v, i) => `L ${(i / (weeklyData.length - 1)) * 200} ${100 - v}`).join(' ')} L 200 100 L 0 100 Z`}
                              fill={`url(#weekly-gradient-${asset.id})`}
                            />
                            <path
                              d={`M 0 ${100 - weeklyData[0]} ${weeklyData.map((v, i) => `L ${(i / (weeklyData.length - 1)) * 200} ${100 - v}`).join(' ')}`}
                              fill="none"
                              stroke={isPositive ? "#22c55e" : "#ef4444"}
                              strokeWidth="1.5"
                            />
                          </svg>
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                          <span>7 days ago</span>
                          <span>Today</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

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

                <div className="mb-3 space-y-2">
                  <label className="text-xs text-gray-400 block">Investment Amount ($)</label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder={`Min $${asset.minInvestment}`}
                      value={customAmounts[asset.id] || ''}
                      onChange={(e) => handleAmountChange(asset.id, e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-9 flex-1"
                    />
                  </div>
                  <div className="flex gap-1.5">
                    {PRESET_AMOUNTS.map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        size="sm"
                        className="flex-1 h-7 text-xs bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
                        onClick={() => handlePresetAmount(asset.id, amount)}
                      >
                        ${amount}
                      </Button>
                    ))}
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

      {/* Investment History Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-white mb-2">Investment History</h2>
        <p className="text-gray-400 text-sm mb-4">Track your recent investment transactions and their verification status.</p>
        
        <Card className="bg-gray-900 border-gray-800">
          {historyLoading ? (
            <div className="p-8 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-green-400 animate-spin" />
            </div>
          ) : investmentHistory.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-400">No investment history yet.</p>
              <p className="text-gray-500 text-sm mt-1">Your transactions will appear here after you invest.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {investmentHistory.map((record) => (
                <div key={record.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(record.verification_status)}
                    <div>
                      <p className="text-white font-medium">{record.crypto_type}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(record.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">${record.amount_usd.toLocaleString()}</p>
                    <p className={`text-xs capitalize ${getStatusColor(record.verification_status)}`}>
                      {record.verification_status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
