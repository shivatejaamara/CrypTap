import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, QrCode, History, TrendingUp, Send, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@/hooks/useWallet";
import transactionService, { Transaction } from "@/services/transactionService";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isConnected, address, balance, connectWallet } = useWallet();
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    totalAmountInr: 0,
    totalAmountMatic: 0,
  });

  useEffect(() => {
    // Load recent transactions and stats
    const transactions = transactionService.getRecentTransactions(3);
    const statistics = transactionService.getStatistics();
    setRecentTransactions(transactions);
    setStats(statistics);
  }, []);

  const quickActions = [
    {
      title: "Scan QR & Pay",
      description: "Scan UPI QR codes and pay with crypto",
      icon: QrCode,
      color: "from-cryptap-neon to-cryptap-purple",
      route: "/scan-pay"
    },
    {
      title: "Send Money",
      description: "Send crypto payments to UPI IDs",
      icon: Send,
      color: "from-cryptap-purple to-cryptap-midnight",
      route: "/send-money"
    },
    {
      title: "Live Prices",
      description: "Track real-time crypto prices",
      icon: TrendingUp,
      color: "from-cryptap-midnight to-cryptap-neon",
      route: "/prices"
    },
    {
      title: "Transaction History",
      description: "View all your payment history",
      icon: History,
      color: "from-cryptap-neon to-cryptap-midnight",
      route: "/history"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-dark p-4"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-heading font-bold mb-2 bg-gradient-neon bg-clip-text text-transparent">
            CrypTap Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Bridge Web3 payments with traditional UPI
          </p>
        </motion.div>

        {/* Wallet Status Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-gradient-primary border-cryptap-neon/20 shadow-glow-neon">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-foreground">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-cryptap-neon" />
                  Wallet Status
                </div>
                {!isConnected && (
                  <Button
                    onClick={connectWallet}
                    size="sm"
                    className="bg-cryptap-neon hover:bg-cryptap-neon/80 text-cryptap-dark"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Connect
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isConnected ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-cryptap-neon">
                      ₹{(parseFloat(balance || '0') * 42.5).toFixed(0)}
                    </p>
                    <p className="text-muted-foreground">Portfolio Value</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-cryptap-purple">
                      {parseFloat(balance || '0').toFixed(4)} MATIC
                    </p>
                    <p className="text-muted-foreground">Available Balance</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">Connected</p>
                    <p className="text-muted-foreground text-xs font-mono">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cryptap-neon/10 flex items-center justify-center">
                    <Wallet className="h-8 w-8 text-cryptap-neon" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Connect Your Wallet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Connect MetaMask to start making real MATIC payments
                  </p>
                  <Button
                    onClick={connectWallet}
                    className="bg-cryptap-neon hover:bg-cryptap-neon/80 text-cryptap-dark font-semibold"
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect MetaMask
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card 
                className="cursor-pointer transition-all duration-300 hover:shadow-glow-purple bg-card/50 backdrop-blur-sm border-muted/20"
                onClick={() => navigate(action.route)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                    <action.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-heading font-semibold mb-2 text-foreground">
                    {action.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-card/30 backdrop-blur-sm border-muted/20">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-cryptap-neon mb-1">
                  {stats.confirmed}
                </div>
                <div className="text-muted-foreground text-sm">
                  Successful Payments
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="bg-card/30 backdrop-blur-sm border-muted/20">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-cryptap-purple mb-1">
                  ₹{stats.totalAmountInr.toFixed(0)}
                </div>
                <div className="text-muted-foreground text-sm">
                  Total Sent (INR)
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="bg-card/30 backdrop-blur-sm border-muted/20">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {stats.totalAmountMatic.toFixed(4)}
                </div>
                <div className="text-muted-foreground text-sm">
                  Total MATIC Sent
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="bg-card/30 backdrop-blur-sm border-muted/20">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/10">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          tx.status === 'confirmed' ? 'bg-green-500/20' : 
                          tx.status === 'pending' ? 'bg-yellow-500/20' : 'bg-red-500/20'
                        }`}>
                          <Send className={`h-4 w-4 ${
                            tx.status === 'confirmed' ? 'text-green-400' : 
                            tx.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {tx.upiId ? `Paid to ${tx.upiId}` : `Sent to ${tx.to.slice(0, 6)}...${tx.to.slice(-4)}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(tx.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">₹{tx.amountInr}</p>
                        <p className="text-sm text-cryptap-neon">{tx.amount} {tx.token}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Send className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No transactions yet</p>
                    <p className="text-sm">Start by making your first payment</p>
                  </div>
                )}
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4 border-cryptap-neon/30 hover:bg-cryptap-neon/10"
                onClick={() => navigate("/history")}
              >
                View All Transactions
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;