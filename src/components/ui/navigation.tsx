import { Button } from "@/components/ui/button";
import { Heart, Menu } from "lucide-react";

export const Navigation = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-warm-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-warm-500 to-warm-600 rounded-2xl flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-warm-800">BabbleBear</h1>
              <p className="text-xs text-warm-600">Speech Development</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-warm-700 hover:text-warm-800 transition-colors">Features</a>
            <a href="#how-it-works" className="text-warm-700 hover:text-warm-800 transition-colors">How It Works</a>
            <a href="#pricing" className="text-warm-700 hover:text-warm-800 transition-colors">Pricing</a>
            <a href="#support" className="text-warm-700 hover:text-warm-800 transition-colors">Support</a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="hidden sm:inline-flex border-warm-300 text-warm-700 hover:bg-warm-100 rounded-xl">
              Sign In
            </Button>
            <Button className="bg-gradient-to-r from-warm-500 to-warm-600 hover:from-warm-600 hover:to-warm-700 text-white rounded-xl shadow-warm">
              Get Started
            </Button>
            
            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5 text-warm-700" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};