import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Wallet, 
  CreditCard, 
  Settings, 
  Shield, 
  Bell,
  LogOut,
  Edit,
  Copy,
  ExternalLink,
  Trash2
} from "lucide-react";

const Profile = () => {
  const userProfile = {
    name: "John Doe",
    upiId: "johndoe@paytm",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    bankAccount: "****1234",
    isVerified: true,
    memberSince: "January 2024",
    totalTransactions: 45,
    totalVolume: "₹25,430"
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-dark p-4 pb-20"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-heading font-bold mb-2 text-foreground">
            Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </motion.div>

        {/* Profile Overview */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-gradient-primary border-cryptap-neon/20 shadow-glow-neon">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-cryptap-neon/20 flex items-center justify-center">
                  <User className="h-10 w-10 text-cryptap-neon" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold text-foreground">{userProfile.name}</h2>
                    {userProfile.isVerified && (
                      <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Member since {userProfile.memberSince}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-lg font-semibold text-cryptap-neon">
                        {userProfile.totalTransactions}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Transactions</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-cryptap-purple">
                        {userProfile.totalVolume}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Volume</p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="border-cryptap-neon/30 hover:bg-cryptap-neon/10">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Payment Methods */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card/30 backdrop-blur-sm border-muted/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <CreditCard className="h-5 w-5 text-cryptap-neon" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/10">
                  <div>
                    <p className="font-medium text-foreground">UPI ID</p>
                    <p className="text-sm text-muted-foreground">{userProfile.upiId}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(userProfile.upiId)}
                      className="h-8 w-8 p-0 hover:bg-cryptap-neon/10"
                    >
                      <Copy className="h-4 w-4 text-cryptap-neon" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/10">
                  <div>
                    <p className="font-medium text-foreground">Bank Account</p>
                    <p className="text-sm text-muted-foreground">{userProfile.bankAccount}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-cryptap-neon/10"
                    >
                      <Edit className="h-4 w-4 text-cryptap-neon" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full border-cryptap-neon/30 hover:bg-cryptap-neon/10">
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Wallet Information */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-card/30 backdrop-blur-sm border-muted/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Wallet className="h-5 w-5 text-cryptap-neon" />
                  Connected Wallet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cryptap-purple/20 flex items-center justify-center">
                      <Wallet className="h-5 w-5 text-cryptap-purple" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">MetaMask Wallet</p>
                      <p className="text-sm text-muted-foreground font-mono">
                        {userProfile.walletAddress.slice(0, 6)}...{userProfile.walletAddress.slice(-6)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(userProfile.walletAddress)}
                      className="flex-1 border-cryptap-neon/30 hover:bg-cryptap-neon/10"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Address
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`https://etherscan.io/address/${userProfile.walletAddress}`, '_blank')}
                      className="border-cryptap-purple/30 hover:bg-cryptap-purple/10"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <p className="text-sm text-green-400 font-medium">✓ Wallet Connected</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your wallet is securely connected and ready for transactions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Settings & Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Settings */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-card/30 backdrop-blur-sm border-muted/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Settings className="h-5 w-5 text-cryptap-neon" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-muted/10"
                >
                  <Bell className="h-4 w-4 mr-3 text-cryptap-neon" />
                  Notification Preferences
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-muted/10"
                >
                  <Shield className="h-4 w-4 mr-3 text-cryptap-purple" />
                  Security Settings
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-muted/10"
                >
                  <CreditCard className="h-4 w-4 mr-3 text-blue-400" />
                  Transaction Limits
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Account Actions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-card/30 backdrop-blur-sm border-muted/20">
              <CardHeader>
                <CardTitle className="text-foreground">Account Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full border-cryptap-neon/30 hover:bg-cryptap-neon/10"
                >
                  Export Transaction History
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-yellow-500/30 hover:bg-yellow-500/10"
                >
                  Backup Account Data
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-red-500/30 hover:bg-red-500/10 text-red-400"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;