import * as React from "react";
import { Shield, AlertTriangle } from "lucide-react";

const Footer = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  (props, ref) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer ref={ref} className="bg-secondary/50 border-t border-border" {...props}>
      {/* Disclaimer Banner */}
      <div className="bg-risk-moderate/10 border-b border-risk-moderate/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-risk-moderate flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Important Disclaimer:</strong> CapitalCare AI provides educational risk analysis only and is not financial advice. We do not recommend buying, selling, or holding any securities. Past performance does not indicate future results. All investment decisions involve risk and should be made in consultation with a qualified financial advisor. We do not guarantee accuracy of data or analysis.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <a href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-hero flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-serif text-lg font-semibold text-foreground">
                CapitalCare
              </span>
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Understand risk before you invest. Calm, clarity-first AI analysis for thoughtful investors.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 font-sans text-sm">Product</h4>
            <ul className="space-y-3">
              <li><a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#analysis" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Company Analysis</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">API Access</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 font-sans text-sm">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Learning Center</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Risk Glossary</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Methodology</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 font-sans text-sm">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © {currentYear} CapitalCare AI. All rights reserved. Not registered with the SEC or any regulatory body.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-xs text-muted-foreground">🇺🇸 US Markets Only</span>
              <span className="text-xs text-muted-foreground">🔒 Privacy First</span>
              <span className="text-xs text-muted-foreground">📊 Educational Only</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});
Footer.displayName = "Footer";

export default Footer;
