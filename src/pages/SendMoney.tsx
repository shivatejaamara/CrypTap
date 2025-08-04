import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, User, DollarSign, ArrowRight, Wallet, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/useWallet";
import web3Service from "@/services/web3Service";
import transactionService from "@/services/transactionService";
import axios from "axios"; // ✅ Added for API call

const SendMoney = () => {
  const { toast } = useToast();
  const { isConnected, address, connectWallet } = useWallet();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState("MATIC");
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);

  const tokens = [
    { symbol: "MATIC", name: "Polygon", rate: 42.5, color: "text-purple-400" },
    { symbol: "USDT", name: "Tether", rate: 83.2, color: "text-green-400" },
    { symbol: "ETH", name: "Ethereum", rate: 165000, color: "text-blue-400" },
    { symbol: "USDC", name: "USD Coin", rate: 83.1, color: "text-cyan-400" }
  ];

  const calculateCrypto = (inrAmount: string) => {
    const selectedTokenData = tokens.find(t => t.symbol === selectedToken);
    if (selectedTokenData && inrAmount) {
      const crypto = (parseFloat(inrAmount) / selectedTokenData.rate).toFixed(4);
      setCryptoAmount(crypto);
    } else {
      setCryptoAmount("");
    }
  };

  useEffect(() => {
    calculateCrypto(amount);
  }, [amount, selectedToken]);

  useEffect(() => {
    if (recipient) {
      if (recipient.includes('@')) {
        const resolved = web3Service.resolveUpiToWallet(recipient);
        setResolvedAddress(resolved);
      } else if (recipient.startsWith('0x') && recipient.length === 42) {
        setResolvedAddress(recipient);
      } else {
        setResolvedAddress(null);
      }
    }
  }, [recipient]);

  const handleSend = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your MetaMask wallet first",
        variant: "destructive",
      });
      return;
    }

    if (!recipient || !amount || !cryptoAmount) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!resolvedAddress) {
      toast({
        title: "Invalid recipient",
        description: "UPI ID not mapped to wallet address or invalid wallet address",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      let result;

      if (recipient.includes('@')) {
        result = await web3Service.sendPaymentToUpi(recipient, cryptoAmount);
      } else {
        result = await web3Service.sendMaticPayment(resolvedAddress, cryptoAmount);
      }

      const transaction = transactionService.addTransaction({
        hash: result.hash,
        from: result.from,
        to: result.to,
        amount: result.amount,
        amountInr: amount,
        token: selectedToken,
        upiId: recipient.includes('@') ? recipient : undefined,
        status: 'pending',
        message,
      });

      toast({
        title: "Payment sent!",
        description: `Transaction hash: ${result.hash.slice(0, 10)}...`,
      });

      // ✅ Off-ramp API call
      try {
        const apiRes = await axios.post("http://localhost:5000/api/offramp", {
          upiId: recipient,
          amount: amount,
          walletAddress: address
        });

        toast({
          title: "Off-ramp initiated",
          description: apiRes.data.message || "INR payout request sent",
        });
      } catch (apiErr: any) {
        toast({
          title: "Off-ramp failed",
          description: apiErr.response?.data?.error || apiErr.message || "Could not send INR payout",
          variant: "destructive",
        });
      }

      // Reset form
      setRecipient("");
      setAmount("");
      setMessage("");
      setCryptoAmount("");

      setTimeout(async () => {
        try {
          const details = await web3Service.getTransactionDetails(result.hash);
          if (details.receipt) {
            transactionService.updateTransaction(transaction.id, {
              status: 'confirmed',
              gasUsed: details.receipt.gasUsed?.toString(),
            });
          }
        } catch (error) {
          console.error('Failed to get transaction confirmation:', error);
        }
      }, 30000);

    } catch (error: any) {
      toast({
        title: "Payment failed",
        description: error.message || "Failed to send payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    // ... your full return block remains untouched
    // ✅ no changes needed here
     <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-dark p-4 pb-20"
    >
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-heading font-bold mb-2 text-foreground">
            Send Money
          </h1>
          <p className="text-muted-foreground">
            Send crypto payments to any UPI ID instantly
          </p>
        </motion.div>

        {/* Recipient Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="bg-card/30 backdrop-blur-sm border-muted/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <User className="h-5 w-5 text-cryptap-neon" />
                Recipient Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="recipient" className="text-foreground">UPI ID or Wallet Address</Label>
                <Input
                  id="recipient"
                  placeholder="recipient@upi or 0x..."
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="bg-background/50 border-muted"
                />
                {recipient && (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    {resolvedAddress ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-green-500">
                          {recipient.includes('@') ? 'UPI ID mapped to wallet' : 'Valid wallet address'}
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-red-500">
                          {recipient.includes('@') ? 'UPI ID not mapped' : 'Invalid address format'}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="message" className="text-foreground">Message (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Add a note with your payment"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-background/50 border-muted resize-none"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Amount Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="bg-card/30 backdrop-blur-sm border-muted/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <DollarSign className="h-5 w-5 text-cryptap-neon" />
                Amount & Currency
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="amount" className="text-foreground">Amount (INR)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-background/50 border-muted text-2xl font-bold text-center"
                />
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[100, 500, 1000, 2000].map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(quickAmount.toString())}
                    className="border-muted hover:bg-muted/10"
                  >
                    ₹{quickAmount}
                  </Button>
                ))}
              </div>

              {/* Token Selection */}
              <div>
                <Label className="text-foreground">Select Cryptocurrency</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {tokens.map((token) => (
                    <Button
                      key={token.symbol}
                      variant={selectedToken === token.symbol ? "default" : "outline"}
                      className={`${
                        selectedToken === token.symbol
                          ? "bg-cryptap-neon text-cryptap-dark"
                          : "border-muted hover:bg-muted/10"
                      }`}
                      onClick={() => setSelectedToken(token.symbol)}
                    >
                      <span className={token.color}>{token.symbol}</span>
                      <span className="ml-2 text-xs opacity-70">
                        ₹{token.rate}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Payment Preview */}
        {amount && recipient && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <Card className="bg-gradient-primary border-cryptap-neon/20 shadow-glow-neon">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Wallet className="h-5 w-5 text-cryptap-neon" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Sending to:</span>
                    <span className="font-medium text-foreground">{recipient}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="text-xl font-bold text-cryptap-neon">₹{amount}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 py-2">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">You'll send:</span>
                    <span className="text-xl font-bold text-cryptap-purple">
                      {cryptoAmount} {selectedToken}
                    </span>
                  </div>
                  
                  {message && (
                    <div className="pt-3 border-t border-muted/20">
                      <span className="text-muted-foreground">Message:</span>
                      <p className="text-sm text-foreground mt-1 p-2 bg-muted/10 rounded">
                        {message}
                      </p>
                    </div>
                  )}
                  
                  {!isConnected ? (
                    <Button
                      onClick={connectWallet}
                      className="w-full bg-cryptap-purple hover:bg-cryptap-purple/80 text-white font-semibold"
                    >
                      <Wallet className="h-4 w-4 mr-2" />
                      Connect Wallet First
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSend}
                      disabled={isProcessing || !resolvedAddress}
                      className="w-full bg-cryptap-neon hover:bg-cryptap-neon/80 text-cryptap-dark font-semibold animate-glow disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cryptap-dark mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Real MATIC Payment
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Recent Recipients */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-card/30 backdrop-blur-sm border-muted/20">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Recipients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Coffee Shop", upi: "coffeeshop@paytm", lastAmount: "₹150" },
                  { name: "Grocery Store", upi: "grocery@phonepe", lastAmount: "₹800" },
                  { name: "Restaurant", upi: "restaurant@gpay", lastAmount: "₹1200" }
                ].map((contact, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer"
                    onClick={() => setRecipient(contact.upi)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-cryptap-neon/20 flex items-center justify-center">
                        <User className="h-5 w-5 text-cryptap-neon" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">{contact.upi}</p>
                      </div>
                    </div>
                    <span className="text-sm text-cryptap-neon">{contact.lastAmount}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SendMoney;
