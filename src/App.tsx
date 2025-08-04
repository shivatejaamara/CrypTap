import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

import Index from "./pages/index";
import WalletOnboarding from "./pages/WalletOnboarding";
import Dashboard from "./pages/Dashboard";
import ScanPay from "./pages/ScanPay";
import SendMoney from "./pages/SendMoney";
import LivePrices from "./pages/Liveprices";
import TransactionHistory from "./pages/TransactionHistory";
import Profile from "./pages/Profile";
import Navigation from "./components/Navigation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/onboarding" element={<WalletOnboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scan-pay" element={<ScanPay />} />
            <Route path="/send-money" element={<SendMoney />} />
            <Route path="/prices" element={<LivePrices />} />
            <Route path="/history" element={<TransactionHistory />} />
            <Route path="/profile" element={<Profile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Navigation />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
