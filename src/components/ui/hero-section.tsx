import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import heroTeddy from "@/assets/hero-teddy.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-warm-50 to-warm-100 overflow-hidden">
      {/* Cozy background pattern */}
      <div className="absolute inset-0 cozy-texture opacity-50" />
      
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-peach-100 text-warm-700 px-4 py-2 rounded-full text-sm font-medium animate-gentle-bounce">
              <span className="w-2 h-2 bg-peach-400 rounded-full animate-soft-pulse"></span>
              <span>Speech Development Made Simple</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-warm-800 leading-tight">
              Meet
              <span className="text-warm-600 block animate-cozy-float">
                BabbleBear
              </span>
            </h1>
            
            <p className="text-xl text-warm-600 leading-relaxed">
              Your cuddly companion for monitoring baby's speech development. 
              Advanced AI analysis in a warm, teddy bear embrace that grows with your little one.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-to-r from-warm-500 to-warm-600 hover:from-warm-600 hover:to-warm-700 text-white rounded-2xl px-8 py-4 text-lg font-medium shadow-cozy transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                Start Monitoring
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-warm-300 text-warm-700 hover:bg-warm-100 rounded-2xl px-8 py-4 text-lg transition-all duration-300">
                Watch Demo
              </Button>
            </div>
            
            <div className="flex items-center space-x-6 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-warm-700">10K+</div>
                <div className="text-sm text-warm-500">Happy Families</div>
              </div>
              <div className="w-px h-8 bg-warm-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warm-700">95%</div>
                <div className="text-sm text-warm-500">Accuracy Rate</div>
              </div>
              <div className="w-px h-8 bg-warm-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warm-700">24/7</div>
                <div className="text-sm text-warm-500">Monitoring</div>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative">
            <Card className="p-8 bg-gradient-to-br from-warm-100 to-peach-100 border-0 shadow-cozy rounded-3xl overflow-hidden">
              <img 
                src={heroTeddy} 
                alt="BabbleBear - Cute teddy bear with smartphone" 
                className="w-full h-auto rounded-2xl shadow-soft"
              />
              
              {/* Floating elements */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-warm animate-gentle-bounce">
                <div className="w-3 h-3 bg-peach-400 rounded-full animate-soft-pulse"></div>
              </div>
              
              <div className="absolute bottom-4 left-4 bg-sage-100/90 backdrop-blur-sm rounded-2xl p-4 shadow-warm">
                <div className="text-xs font-medium text-warm-700">
                  🎵 Babbling detected
                </div>
                <div className="text-xs text-warm-500 mt-1">
                  Progress: 87%
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};