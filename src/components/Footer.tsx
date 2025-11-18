import { Github, Twitter } from "lucide-react";
import { Button } from "./ui/button";

const Footer = () => {
  return (
    <footer className="w-full py-12 mt-20">
      <div className="container px-4">
        <div className="glass glass-hover rounded-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="font-medium text-lg text-foreground">Tesla</h3>
              <p className="text-sm text-muted-foreground">
                Accelerating the world's transition to sustainable energy.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Github className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Products</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Models
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Charging
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground text-center">
              © {new Date().getFullYear()} Tesla Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;