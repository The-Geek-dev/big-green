import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FloatingAIChat } from "@/components/FloatingAIChat";
import { WelcomeTour } from "@/components/WelcomeTour";
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
import Features from "./pages/Features";
import Packages from "./pages/Packages";
import Reviews from "./pages/Reviews";
import OurImpact from "./pages/OurImpact";
import Jumpstart from "./pages/Jumpstart";
import HomeGardens from "./pages/HomeGardens";
import Grantmaking from "./pages/Grantmaking";
import AboutUs from "./pages/AboutUs";
import Partners from "./pages/Partners";
import Team from "./pages/Team";
import Careers from "./pages/Careers";
import Finances from "./pages/Finances";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import ForEducators from "./pages/ForEducators";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Withdraw from "./pages/Withdraw";

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
        <Route path="/features" element={<Features />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/our-impact" element={<OurImpact />} />
        <Route path="/jumpstart" element={<Jumpstart />} />
        <Route path="/home-gardens" element={<HomeGardens />} />
        <Route path="/grantmaking" element={<Grantmaking />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/team" element={<Team />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/finances" element={<Finances />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/for-educators" element={<ForEducators />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
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
      <Route path="/withdraw" element={<Withdraw />} />
          </Routes>
          <FloatingAIChat />
          <WelcomeTour />
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;