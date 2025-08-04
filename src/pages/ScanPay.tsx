import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Camera, X, ArrowRight, Wallet, CheckCircle, AlertCircle } from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/useWallet";
import web3Service from "@/services/web3Service";
import transactionService from "@/services/transactionService";

const ScanPay = () => {
  const { toast } = useToast();
  const { isConnected, address, connectWallet } = useWallet();
  const [isScanning, setIsScanning] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState("MATIC");
  const [isProcessing, setIsProcessing] = useState(false);
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const tokens = [
    { symbol: "MATIC", name: "Polygon", rate: 42.5, color: "text-purple-400" },
    { symbol: "USDT", name: "Tether", rate: 83.2, color: "text-green-400" },
    { symbol: "ETH", name: "Ethereum", rate: 165000, color: "text-blue-400" },
    { symbol: "USDC", name: "USD Coin", rate: 83.1, color: "text-cyan-400" }
  ];

  const startScanning = () => {
    setIsScanning(true);
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );
    
    scanner.render(
      (decodedText) => {
        // Extract UPI ID from QR code
        const upiMatch = decodedText.match(/pa=([^&]+)/);
        if (upiMatch) {
          setUpiId(upiMatch[1]);
          setIsScanning(false);
          scanner.clear();
        }
      },
      (error) => {
        console.warn("QR Code scan error:", error);
      }
    );
    
    scannerRef.current = scanner;
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
    }
    setIsScanning(false);
  };

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

  // Check if UPI ID can be resolved
  useEffect(() => {
    if (upiId) {
      const resolved = web3Service.resolveUpiToWallet(upiId);
      setResolvedAddress(resolved);
    }
  }, [upiId]);

  const handlePayment = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your MetaMask wallet first",
        variant: "destructive",
      });
      return;
    }

    if (!upiId || !amount || !cryptoAmount) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!resolvedAddress) {
      toast({
        title: "UPI ID not mapped",
        description: "This UPI ID is not mapped to any wallet address",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const result = await web3Service.sendPaymentToUpi(upiId, cryptoAmount);

      // Log the transaction
      const transaction = transactionService.addTransaction({
        hash: result.hash,
        from: result.from,
        to: result.to,
        amount: result.amount,
        amountInr: amount,
        token: selectedToken,
        upiId: result.upiId,
        status: 'pending',
      });

      toast({
        title: "Payment sent!",
        description: `Successfully paid ₹${amount} to ${upiId}`,
      });

      // Reset form
      setUpiId("");
      setAmount("");
      setCryptoAmount("");

      // Wait for confirmation and update transaction
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-dark p-4"
    >
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-heading font-bold mb-2 text-foreground">
            Scan & Pay
          </h1>
          <p className="text-muted-foreground">
            Scan UPI QR codes and pay with cryptocurrency
          </p>
        </motion.div>

        {/* QR Scanner Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="bg-card/30 backdrop-blur-sm border-muted/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <QrCode className="h-5 w-5 text-cryptap-neon" />
                QR Code Scanner
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isScanning ? (
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-xl bg-cryptap-neon/10 flex items-center justify-center">
                    <Camera className="h-16 w-16 text-cryptap-neon" />
                  </div>
                  <Button
                    onClick={startScanning}
                    className="bg-cryptap-neon hover:bg-cryptap-neon/80 text-cryptap-dark font-semibold"
                  >
                    Start Scanning
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-foreground">Scanning for QR Code...</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={stopScanning}
                      className="border-red-500 text-red-500 hover:bg-red-500/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div id="qr-reader" className="rounded-lg overflow-hidden"></div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Manual UPI Input */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="bg-card/30 backdrop-blur-sm border-muted/20">
            <CardHeader>
              <CardTitle className="text-foreground">Manual Entry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="upi" className="text-foreground">UPI ID</Label>
                <Input
                  id="upi"
                  placeholder="merchant@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="bg-background/50 border-muted"
                />
                {upiId && (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    {resolvedAddress ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-green-500">UPI ID mapped to wallet</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-red-500">UPI ID not mapped to wallet</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              <div>
                <Label htmlFor="amount" className="text-foreground">Amount (INR)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    calculateCrypto(e.target.value);
                  }}
                  className="bg-background/50 border-muted"
                />
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
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Payment Preview */}
        {amount && upiId && (
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
                  Payment Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">To:</span>
                    <span className="font-medium text-foreground">{upiId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="text-xl font-bold text-cryptap-neon">₹{amount}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 py-2">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">You'll pay:</span>
                    <span className="text-xl font-bold text-cryptap-purple">
                      {cryptoAmount} {selectedToken}
                    </span>
                  </div>
                  
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
                      onClick={handlePayment}
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
                          <Wallet className="h-4 w-4 mr-2" />
                          Pay Real MATIC
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ScanPay;