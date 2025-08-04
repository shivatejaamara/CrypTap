import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, RefreshCw, DollarSign } from "lucide-react";
import axios from "axios";

interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  image: string;
}

const LivePrices = () => {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const cryptoIds = ["bitcoin", "ethereum", "matic-network", "tether", "usd-coin", "binancecoin", "solana"];

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${cryptoIds.join(',')}&order=market_cap_desc&per_page=10&page=1&sparkline=false`
      );
      setPrices(response.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching crypto prices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchPrices, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `₹${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `₹${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `₹${(marketCap / 1e6).toFixed(2)}M`;
    }
    return `₹${marketCap.toFixed(2)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-dark p-4"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2 text-foreground">
              Live Crypto Prices
            </h1>
            <p className="text-muted-foreground">
              Real-time cryptocurrency prices in INR
            </p>
          </div>
          <Button
            onClick={fetchPrices}
            disabled={loading}
            variant="outline"
            className="border-cryptap-neon/30 hover:bg-cryptap-neon/10"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </motion.div>

        {/* Last Updated Info */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="bg-card/30 backdrop-blur-sm border-muted/20">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-cryptap-neon" />
                  <span className="text-foreground">Market Data</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Price Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="bg-card/30 backdrop-blur-sm border-muted/20">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-muted rounded-full"></div>
                        <div>
                          <div className="h-4 bg-muted rounded w-16 mb-1"></div>
                          <div className="h-3 bg-muted rounded w-12"></div>
                        </div>
                      </div>
                      <div className="h-6 bg-muted rounded w-24 mb-2"></div>
                      <div className="h-4 bg-muted rounded w-20"></div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            prices.map((crypto, index) => (
              <motion.div
                key={crypto.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="bg-card/30 backdrop-blur-sm border-muted/20 transition-all duration-300 group-hover:shadow-glow-purple">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold text-foreground">{crypto.name}</h3>
                        <p className="text-sm text-muted-foreground uppercase">
                          {crypto.symbol}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-foreground">
                          {formatPrice(crypto.current_price)}
                        </span>
                        <Badge
                          variant={crypto.price_change_percentage_24h >= 0 ? "default" : "destructive"}
                          className={`${
                            crypto.price_change_percentage_24h >= 0
                              ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                              : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                          }`}
                        >
                          {crypto.price_change_percentage_24h >= 0 ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                        </Badge>
                      </div>
                      
                      <div className="pt-2 border-t border-muted/20">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Market Cap</span>
                          <span className="text-foreground font-medium">
                            {formatMarketCap(crypto.market_cap)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Auto-refresh Notice */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Prices update automatically every 30 seconds • Data provided by CoinGecko
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LivePrices;