import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, Zap, Shield, TrendingUp, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: "Instant Payments",
      description: "Pay merchants instantly using cryptocurrency through UPI QR codes"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your transactions are secured with blockchain technology"
    },
    {
      icon: TrendingUp,
      title: "Live Crypto Prices",
      description: "Real-time price tracking for all major cryptocurrencies"
    },
    {
      icon: Wallet,
      title: "MetaMask Integration",
      description: "Seamlessly connect your existing crypto wallet"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-dark overflow-hidden">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative"
      >
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-16">
          <div className="text-center">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-6xl font-heading font-bold mb-6 bg-gradient-neon bg-clip-text text-transparent">
                CrypTap
              </h1>
              <p className="text-2xl text-muted-foreground mb-4">
                Bridge Web3 Payments with Traditional UPI
              </p>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Pay any UPI merchant with cryptocurrency. Scan QR codes, send payments, 
                and track transactions seamlessly between crypto and traditional payments.
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Button
                onClick={() => navigate("/onboarding")}
                className="bg-cryptap-neon hover:bg-cryptap-neon/80 text-cryptap-dark font-semibold text-lg px-8 py-3 animate-glow"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                className="border-cryptap-purple/30 hover:bg-cryptap-purple/10 text-lg px-8 py-3"
              >
                View Demo
              </Button>
            </motion.div>
          </div>

          {/* Features Grid */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="bg-card/30 backdrop-blur-sm border-muted/20 h-full transition-all duration-300 hover:shadow-glow-purple">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center">
                      <feature.icon className="h-8 w-8 text-cryptap-neon" />
                    </div>
                    <h3 className="font-heading font-semibold mb-2 text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-20 h-20 bg-cryptap-neon/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-20 w-32 h-32 bg-cryptap-purple/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-1/4 w-24 h-24 bg-cryptap-neon/10 rounded-full blur-xl"
        />
      </motion.div>

      {/* How It Works Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 bg-gradient-primary"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold mb-4 text-foreground">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Simple steps to start making crypto payments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Connect Wallet",
                description: "Link your MetaMask wallet and add your UPI details for seamless transactions"
              },
              {
                step: "02", 
                title: "Scan QR Code",
                description: "Scan any UPI QR code or enter merchant details to initiate payment"
              },
              {
                step: "03",
                title: "Pay with Crypto",
                description: "Choose your cryptocurrency and complete the payment through MetaMask"
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-neon flex items-center justify-center">
                  <span className="text-2xl font-bold text-cryptap-dark">{step.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
