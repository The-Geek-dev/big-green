import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FloatingAIChat } from "@/components/FloatingAIChat";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Application from "./pages/Application";
import GrantApplication from "./pages/GrantApplication";
import InvestmentDashboard from "./pages/InvestmentDashboard";
import BusinessFunding from "./pages/BusinessFunding";
import FundingApplication from "./pages/FundingApplication";
import DonationForm from "./pages/DonationForm";
import CryptoPayment from "./pages/CryptoPayment";
import PaymentConfirmation from "./pages/PaymentConfirmation";
import DashboardVerification from "./pages/DashboardVerification";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/application" element={<Application />} />
      <Route path="/grant-application" element={<GrantApplication />} />
      <Route path="/investment" element={<InvestmentDashboard />} />
      <Route path="/business-funding" element={<BusinessFunding />} />
      <Route path="/funding-application" element={<FundingApplication />} />
      <Route path="/donation" element={<DonationForm />} />
      <Route path="/crypto-payment" element={<CryptoPayment />} />
      <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
      <Route path="/dashboard" element={<DashboardVerification />} />
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
          <FloatingAIChat />
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;