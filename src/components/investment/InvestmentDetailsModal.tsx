import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { 
  TrendingUp, 
  Shield, 
  FileText, 
  Clock, 
  DollarSign,
  AlertCircle,
  CheckCircle,
  BarChart3
} from "lucide-react";

interface InvestmentOption {
  title: string;
  description: string;
  minInvestment: string;
  expectedReturn: string;
  risk: string;
  icon: any;
}

interface InvestmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  investment: InvestmentOption | null;
}

const investmentDetails = {
  "Green Energy Portfolio": {
    fullDescription: "Our Green Energy Portfolio provides diversified exposure to renewable energy projects across solar, wind, and hydroelectric sectors. This carefully curated portfolio includes investments in established clean energy companies and promising startups developing next-generation sustainable technology.",
    keyFeatures: [
      "Diversified across 15+ renewable energy projects",
      "Geographic distribution across North America and Europe",
      "Mix of established companies and growth-stage ventures",
      "Quarterly performance reviews and rebalancing"
    ],
    documentation: [
      { title: "Investment Prospectus", size: "2.4 MB" },
      { title: "Risk Assessment Report", size: "1.8 MB" },
      { title: "Historical Performance Data", size: "890 KB" },
      { title: "ESG Impact Statement", size: "1.2 MB" }
    ],
    faqs: [
      {
        question: "How is my investment diversified?",
        answer: "Your investment is spread across multiple renewable energy sectors including solar (40%), wind (35%), hydroelectric (15%), and emerging technologies (10%). This diversification helps minimize risk while maximizing potential returns."
      },
      {
        question: "What are the tax benefits?",
        answer: "Renewable energy investments may qualify for various tax credits and incentives. We recommend consulting with a tax professional to understand how these benefits apply to your specific situation."
      },
      {
        question: "Can I withdraw my investment early?",
        answer: "Yes, though early withdrawal may incur fees depending on the holding period. Full details are available in the Investment Prospectus."
      },
      {
        question: "How often will I receive returns?",
        answer: "Returns are distributed quarterly, with detailed performance reports sent to your dashboard. You can choose to reinvest returns or receive them as cash distributions."
      }
    ]
  },
  "Sustainable Agriculture": {
    fullDescription: "Invest in the future of food production through our Sustainable Agriculture portfolio. This fund supports regenerative farming practices, vertical farming technologies, and innovative agricultural solutions that reduce environmental impact while increasing yields.",
    keyFeatures: [
      "Focus on regenerative and organic farming operations",
      "Investments in agritech and precision agriculture",
      "Support for small to medium-sized sustainable farms",
      "Direct impact on food security and soil health"
    ],
    documentation: [
      { title: "Agricultural Investment Guide", size: "3.1 MB" },
      { title: "Farm Portfolio Overview", size: "2.2 MB" },
      { title: "Sustainability Metrics Report", size: "1.5 MB" },
      { title: "Market Analysis & Trends", size: "2.8 MB" }
    ],
    faqs: [
      {
        question: "What types of farms are included?",
        answer: "Our portfolio includes organic vegetable farms, regenerative cattle ranching operations, vertical farming facilities, and innovative agritech companies developing sustainable farming solutions."
      },
      {
        question: "How is sustainability measured?",
        answer: "We track multiple metrics including soil health improvement, water usage reduction, carbon sequestration, biodiversity enhancement, and elimination of synthetic pesticides."
      },
      {
        question: "What are the seasonal variations in returns?",
        answer: "Agricultural investments naturally experience seasonal variations. Our diversified approach across different crop cycles and geographic regions helps smooth out these variations throughout the year."
      },
      {
        question: "How hands-on can I be with my investment?",
        answer: "While direct farm management isn't required, we offer farm visit opportunities and regular updates. Some investors choose to volunteer at partner farms for a deeper connection to their investment."
      }
    ]
  },
  "Impact Fund": {
    fullDescription: "Our Impact Fund combines financial returns with measurable environmental and social benefits. This mixed portfolio invests across renewable energy, sustainable agriculture, green technology, and social enterprises that are creating positive change while generating solid returns.",
    keyFeatures: [
      "Balanced portfolio with lower risk profile",
      "Investments across multiple impact sectors",
      "Detailed impact reporting and metrics",
      "Lower minimum investment threshold"
    ],
    documentation: [
      { title: "Impact Fund Overview", size: "2.6 MB" },
      { title: "Social Impact Assessment", size: "1.9 MB" },
      { title: "Financial Performance Report", size: "1.4 MB" },
      { title: "Portfolio Composition Guide", size: "2.1 MB" }
    ],
    faqs: [
      {
        question: "How do you measure impact?",
        answer: "We use standardized impact metrics including CO2 reduction, jobs created, communities served, and UN Sustainable Development Goals alignment. All metrics are third-party verified annually."
      },
      {
        question: "Is this fund suitable for beginners?",
        answer: "Yes! The Impact Fund is designed as an entry point for impact investors. With a lower minimum investment and balanced risk profile, it's perfect for those new to sustainable investing."
      },
      {
        question: "Can I choose specific sectors within the fund?",
        answer: "The fund is managed as a unified portfolio for optimal diversification. However, we offer sector-specific funds for investors wanting concentrated exposure to particular areas."
      },
      {
        question: "How transparent is the reporting?",
        answer: "We provide quarterly financial reports and semi-annual impact reports. All investments are disclosed, and you can track both financial performance and social/environmental impact through your dashboard."
      }
    ]
  }
};

export const InvestmentDetailsModal = ({ isOpen, onClose, investment }: InvestmentDetailsModalProps) => {
  const navigate = useNavigate();
  
  if (!investment) return null;

  const details = investmentDetails[investment.title as keyof typeof investmentDetails];
  const Icon = investment.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-3xl font-bold text-white mb-2">
                {investment.title}
              </DialogTitle>
              <p className="text-gray-400">{investment.description}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Investment Highlights */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <DollarSign className="w-5 h-5 text-green-400 mb-2" />
              <p className="text-xs text-gray-400 mb-1">Min. Investment</p>
              <p className="text-lg font-bold text-white">{investment.minInvestment}</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <TrendingUp className="w-5 h-5 text-blue-400 mb-2" />
              <p className="text-xs text-gray-400 mb-1">Expected Return</p>
              <p className="text-lg font-bold text-green-400">{investment.expectedReturn}</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <AlertCircle className="w-5 h-5 text-yellow-400 mb-2" />
              <p className="text-xs text-gray-400 mb-1">Risk Level</p>
              <p className="text-lg font-bold text-white">{investment.risk}</p>
            </div>
          </div>

          <Separator className="bg-gray-800" />

          {/* Full Description */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-400" />
              Investment Overview
            </h3>
            <p className="text-gray-300 leading-relaxed">{details.fullDescription}</p>
          </div>

          {/* Key Features */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Key Features
            </h3>
            <ul className="space-y-2">
              {details.keyFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator className="bg-gray-800" />

          {/* Documentation */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-400" />
              Investment Documentation
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {details.documentation.map((doc, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-green-600/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-green-400" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">{doc.title}</p>
                      <p className="text-xs text-gray-400">{doc.size}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-gray-800" />

          {/* FAQs */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              Frequently Asked Questions
            </h3>
            <Accordion type="single" collapsible className="space-y-2">
              {details.faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-gray-800/50 rounded-lg border border-gray-700 px-4"
                >
                  <AccordionTrigger className="text-white hover:text-green-400 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-green-600/30">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Ready to Invest?</h4>
                <p className="text-sm text-gray-400">Start your application to join this investment opportunity</p>
              </div>
              <Button
                size="lg"
                className="button-gradient"
                onClick={() => {
                  onClose();
                  navigate("/application");
                }}
              >
                Start Application
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};