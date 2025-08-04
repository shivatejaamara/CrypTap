import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Wallet, 
  QrCode, 
  History, 
  TrendingUp, 
  Home,
  User,
  Send
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { 
      icon: Home, 
      label: "Dashboard", 
      path: "/dashboard",
      color: "text-cryptap-neon"
    },
    { 
      icon: QrCode, 
      label: "Scan & Pay", 
      path: "/scan-pay",
      color: "text-cryptap-purple"
    },
    { 
      icon: Send, 
      label: "Send Money", 
      path: "/send-money",
      color: "text-cryptap-neon"
    },
    { 
      icon: TrendingUp, 
      label: "Live Prices", 
      path: "/prices",
      color: "text-blue-400"
    },
    { 
      icon: History, 
      label: "History", 
      path: "/history",
      color: "text-yellow-400"
    },
    { 
      icon: User, 
      label: "Profile", 
      path: "/profile",
      color: "text-green-400"
    }
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-t border-muted/20"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.div
                key={item.path}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center gap-1 h-auto py-2 px-3 transition-all duration-300 ${
                    isActive
                      ? "bg-cryptap-neon/20 text-cryptap-neon"
                      : "hover:bg-muted/20 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? "text-cryptap-neon" : ""}`} />
                  <span className="text-xs font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cryptap-neon rounded-full"
                    />
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;