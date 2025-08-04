import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, User, CreditCard, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import web3Service from "@/services/web3Service";

const WalletOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    upiId: "",
    bankAccount: "",
    walletAddress: ""
  });

  const steps = [
    {
      number: 1,
      title: "Personal Information",
      description: "Enter your basic details",
      icon: User
    },
    {
      number: 2,
      title: "Bank & UPI Details",
      description: "Connect your payment methods",
      icon: CreditCard
    },
    {
      number: 3,
      title: "Connect Wallet",
      description: "Link your MetaMask wallet",
      icon: Wallet
    }
  ];

  const { toast } = useToast();

  const connectMetaMask = async () => {
    try {
      await web3Service.initialize();
      const address = await web3Service.connectWallet();
      setFormData(prev => ({
        ...prev,
        walletAddress: address
      }));
      
      toast({
        title: "Wallet Connected!",
        description: "MetaMask wallet successfully connected to Polygon network",
      });
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect MetaMask wallet",
        variant: "destructive",
      });
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      console.log('Onboarding completed:', formData);
      navigate('/dashboard');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.fullName.trim().length > 0;
      case 2:
        return formData.upiId.trim().length > 0 || formData.bankAccount.trim().length > 0;
      case 3:
        return formData.walletAddress.length > 0;
      default:
        return false;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-dark p-4 flex items-center justify-center"
    >
      <div className="max-w-2xl mx-auto w-full">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-heading font-bold mb-2 bg-gradient-neon bg-clip-text text-transparent">
            Welcome to CrypTap
          </h1>
          <p className="text-muted-foreground">
            Let's set up your account to start making crypto payments
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                  currentStep >= step.number
                    ? "bg-cryptap-neon border-cryptap-neon text-cryptap-dark"
                    : "border-muted text-muted-foreground"
                }`}>
                  {currentStep > step.number ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <step.icon className="h-6 w-6" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 transition-all duration-300 ${
                    currentStep > step.number ? "bg-cryptap-neon" : "bg-muted"
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <h2 className="text-xl font-semibold text-foreground">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-muted-foreground">
              {steps[currentStep - 1].description}
            </p>
          </div>
        </motion.div>

        {/* Form Content */}
        <motion.div
          key={currentStep}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-card/30 backdrop-blur-sm border-muted/20">
            <CardHeader>
              <CardTitle className="text-foreground">
                Step {currentStep} of 3
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName" className="text-foreground">Full Name *</Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="bg-background/50 border-muted"
                    />
                  </div>
                  <div className="p-4 rounded-lg bg-cryptap-neon/10 border border-cryptap-neon/20">
                    <h4 className="font-semibold text-foreground mb-2">Why do we need this?</h4>
                    <p className="text-sm text-muted-foreground">
                      Your name helps us personalize your experience and is required for compliance purposes.
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="upiId" className="text-foreground">UPI ID</Label>
                    <Input
                      id="upiId"
                      placeholder="yourname@upi (e.g., yourname@paytm)"
                      value={formData.upiId}
                      onChange={(e) => handleInputChange('upiId', e.target.value)}
                      className="bg-background/50 border-muted"
                    />
                  </div>
                  <div className="text-center text-muted-foreground">OR</div>
                  <div>
                    <Label htmlFor="bankAccount" className="text-foreground">Bank Account Number</Label>
                    <Input
                      id="bankAccount"
                      placeholder="Enter your bank account number"
                      value={formData.bankAccount}
                      onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                      className="bg-background/50 border-muted"
                    />
                  </div>
                  <div className="p-4 rounded-lg bg-cryptap-purple/10 border border-cryptap-purple/20">
                    <h4 className="font-semibold text-foreground mb-2">Secure & Private</h4>
                    <p className="text-sm text-muted-foreground">
                      Your banking information is encrypted and stored securely. We use this to help you with UPI payments.
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  {!formData.walletAddress ? (
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center">
                        <Wallet className="h-12 w-12 text-cryptap-neon" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Connect Your Wallet
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Connect your MetaMask wallet to start making crypto payments
                      </p>
                      <Button
                        onClick={connectMetaMask}
                        className="bg-cryptap-neon hover:bg-cryptap-neon/80 text-cryptap-dark font-semibold"
                      >
                        <Wallet className="h-4 w-4 mr-2" />
                        Connect MetaMask
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                        <CheckCircle className="h-12 w-12 text-green-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Wallet Connected!
                      </h3>
                      <p className="text-muted-foreground mb-2">
                        Your MetaMask wallet has been successfully connected
                      </p>
                      <p className="text-sm font-mono bg-muted/20 p-2 rounded text-foreground">
                        {formData.walletAddress.slice(0, 6)}...{formData.walletAddress.slice(-6)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  className="border-muted hover:bg-muted/10"
                >
                  Previous
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="bg-cryptap-neon hover:bg-cryptap-neon/80 text-cryptap-dark font-semibold"
                >
                  {currentStep === 3 ? "Complete Setup" : "Next"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WalletOnboarding;