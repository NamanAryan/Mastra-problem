
import { Shield, Github, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-[#0f1a14] bg-[#0a0a12] py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-[#00ff88] p-1 rounded">
                <Shield className="w-4 h-4 text-[#0a0a12]" />
              </div>
              <span className="font-bold text-white">ChainSleuth</span>
            </div>
            <p className="text-sm text-gray-500">
              AI-powered blockchain forensics for a safer Web3.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-500 hover:text-[#00ff88] transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-[#00ff88] transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <a href="#" className="hover:text-[#00ff88] transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#00ff88] transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#00ff88] transition-colors">
                  API
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#00ff88] transition-colors">
                  Integrations
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <a href="#" className="hover:text-[#00ff88] transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#00ff88] transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#00ff88] transition-colors">
                  Case Studies
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#00ff88] transition-colors">
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <a href="#" className="hover:text-[#00ff88] transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#00ff88] transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#00ff88] transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#00ff88] transition-colors">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#0f1a14] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            © 2024 ChainSleuth. All rights reserved.
          </p>
          <p className="text-sm text-gray-600">
            Built for the future of finance.
          </p>
        </div>
      </div>
    </footer>
  );
};
