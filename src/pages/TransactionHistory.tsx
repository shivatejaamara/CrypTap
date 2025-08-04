import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { History, ExternalLink, Search, Filter, Download } from "lucide-react";
import transactionService, { Transaction } from "@/services/transactionService";

const TransactionHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterToken, setFilterToken] = useState("all");
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const allTransactions = transactionService.getAllTransactions();
    setTransactions(allTransactions);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/20 text-green-400 hover:bg-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30";
      case "failed":
        return "bg-red-500/20 text-red-400 hover:bg-red-500/30";
      default:
        return "bg-muted/20 text-muted-foreground";
    }
  };

  const getTokenColor = (symbol: string) => {
    switch (symbol) {
      case "MATIC":
        return "text-purple-400";
      case "USDT":
        return "text-green-400";
      case "ETH":
        return "text-blue-400";
      case "USDC":
        return "text-cyan-400";
      default:
        return "text-foreground";
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = (tx.upiId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tx.hash.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === "all" || tx.status === filterStatus;
    const matchesToken = filterToken === "all" || tx.token === filterToken;
    
    return matchesSearch && matchesStatus && matchesToken;
  });

  const totalAmount = filteredTransactions
    .filter(tx => tx.status === "confirmed")
    .reduce((sum, tx) => sum + parseFloat(tx.amountInr), 0);

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
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-heading font-bold mb-2 text-foreground">
            Transaction History
          </h1>
          <p className="text-muted-foreground">
            Track all your crypto payments and UPI transactions
          </p>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="bg-gradient-primary border-cryptap-neon/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-cryptap-neon">
                ₹{totalAmount.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Spent</div>
            </CardContent>
          </Card>
          <Card className="bg-card/30 backdrop-blur-sm border-muted/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">
                {filteredTransactions.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Transactions</div>
            </CardContent>
          </Card>
          <Card className="bg-card/30 backdrop-blur-sm border-muted/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                {filteredTransactions.filter(tx => tx.status === "confirmed").length}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          <Card className="bg-card/30 backdrop-blur-sm border-muted/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {filteredTransactions.filter(tx => tx.status === "pending").length}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="bg-card/30 backdrop-blur-sm border-muted/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Filter className="h-5 w-5 text-cryptap-neon" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search UPI ID or transaction hash..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background/50 border-muted"
                  />
                </div>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="bg-background/50 border-muted">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterToken} onValueChange={setFilterToken}>
                  <SelectTrigger className="bg-background/50 border-muted">
                    <SelectValue placeholder="Filter by Token" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tokens</SelectItem>
                    <SelectItem value="MATIC">MATIC</SelectItem>
                    <SelectItem value="USDT">USDT</SelectItem>
                    <SelectItem value="ETH">ETH</SelectItem>
                    <SelectItem value="USDC">USDC</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="border-cryptap-neon/30 hover:bg-cryptap-neon/10">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Transaction List */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {filteredTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.01 }}
            >
              <Card className="bg-card/30 backdrop-blur-sm border-muted/20 transition-all duration-300 hover:shadow-glow-purple">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                    {/* UPI ID & Time */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cryptap-neon/20 flex items-center justify-center">
                          <History className="h-5 w-5 text-cryptap-neon" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{transaction.upiId}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">₹{transaction.amountInr}</p>
                      <p className={`text-sm ${getTokenColor(transaction.token)}`}>
                        {transaction.amount} {transaction.token}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="text-center">
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </Badge>
                    </div>

                    {/* Transaction Hash */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground font-mono">
                          {transaction.hash.slice(0, 10)}...{transaction.hash.slice(-8)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-cryptap-neon/10"
                          onClick={() => window.open(`https://polygonscan.com/tx/${transaction.hash}`, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 text-cryptap-neon" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filteredTransactions.length === 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-12"
          >
            <History className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Transactions Found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterStatus !== "all" || filterToken !== "all"
                ? "Try adjusting your filters or search terms"
                : "You haven't made any transactions yet"}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default TransactionHistory;