import { Heart, Mail, Shield, FileText } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-warm-800 text-warm-100">
      <div className="container mx-auto px-6 py-16">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-peach-400 to-peach-500 rounded-2xl flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">BabbleBear</h3>
                <p className="text-xs text-warm-300">Speech Development</p>
              </div>
            </div>
            <p className="text-warm-300 text-sm leading-relaxed">
              Nurturing your baby's communication journey with warmth, technology, and love.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-warm-100 mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-warm-300 hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="text-warm-300 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-warm-300 hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#" className="text-warm-300 hover:text-white transition-colors">Demo</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-warm-100 mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-warm-300 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-warm-300 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-warm-300 hover:text-white transition-colors">Community</a></li>
              <li><a href="#" className="text-warm-300 hover:text-white transition-colors">Pediatrician Portal</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-warm-100 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-warm-300 hover:text-white transition-colors flex items-center space-x-1">
                  <Shield className="h-3 w-3" />
                  <span>Privacy Policy</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-warm-300 hover:text-white transition-colors flex items-center space-x-1">
                  <FileText className="h-3 w-3" />
                  <span>Terms of Service</span>
                </a>
              </li>
              <li><a href="#" className="text-warm-300 hover:text-white transition-colors">COPPA Compliance</a></li>
              <li><a href="#" className="text-warm-300 hover:text-white transition-colors">Data Security</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-warm-700 pt-8 mb-8">
          <div className="max-w-md">
            <h4 className="font-semibold text-warm-100 mb-2">Stay Connected</h4>
            <p className="text-warm-300 text-sm mb-4">
              Get parenting tips and development insights delivered with love.
            </p>
            <div className="flex space-x-2">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-warm-700 border border-warm-600 rounded-xl text-warm-100 placeholder-warm-400 focus:outline-none focus:border-peach-400"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-peach-400 to-peach-500 text-white rounded-xl hover:from-peach-500 hover:to-peach-600 transition-all duration-300 flex items-center">
                <Mail className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-warm-700 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-warm-400 text-sm">
            © 2024 BabbleBear. Made with ❤️ for growing families.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span className="text-warm-400 text-sm">Trusted by 10,000+ families</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-peach-400 rounded-full animate-soft-pulse"></div>
              <span className="text-warm-400 text-sm">System Status: All Good</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};