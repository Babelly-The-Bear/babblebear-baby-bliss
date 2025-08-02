import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Mic, TrendingUp, Heart, Baby, Star } from "lucide-react";
import { motion } from "framer-motion";
import heroTeddy from "@/assets/hero-teddy.jpg";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl">🧸</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-amber-900">BabbleBear</h1>
            <p className="text-xs text-amber-600">Speech Development</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" className="text-amber-700 hover:text-amber-900">
            About
          </Button>
          <Button variant="ghost" className="text-amber-700 hover:text-amber-900">
            Features
          </Button>
          <Link to="/dashboard">
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              Sign In
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
              <span>Speech Development Made Simple</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-amber-900 leading-tight">
              Meet
              <span className="text-amber-600 block">BabbleBear</span>
            </h1>
            
            <p className="text-xl text-amber-700 leading-relaxed">
              Your cuddly companion for monitoring baby's speech development. 
              Advanced AI analysis in a warm, teddy bear embrace that grows with your little one.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl px-8 py-4 text-lg font-medium shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  Start Monitoring
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-2 border-amber-300 text-amber-700 hover:bg-amber-100 rounded-2xl px-8 py-4 text-lg transition-all duration-300">
                Watch Demo
              </Button>
            </div>
            
            <div className="flex items-center space-x-6 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-700">10K+</div>
                <div className="text-sm text-amber-500">Happy Families</div>
              </div>
              <div className="w-px h-8 bg-amber-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-700">95%</div>
                <div className="text-sm text-amber-500">Accuracy Rate</div>
              </div>
              <div className="w-px h-8 bg-amber-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-700">24/7</div>
                <div className="text-sm text-amber-500">Monitoring</div>
              </div>
            </div>
          </motion.div>
          
          {/* Hero Image */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <Card className="p-8 bg-gradient-to-br from-amber-100 to-orange-100 border-0 shadow-xl rounded-3xl overflow-hidden">
              <img 
                src={heroTeddy} 
                alt="BabbleBear - Cute teddy bear with smartphone" 
                className="w-full h-auto rounded-2xl shadow-lg"
              />
              
              {/* Floating elements */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg animate-bounce">
                <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
              </div>
              
              <div className="absolute bottom-4 left-4 bg-green-100/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <div className="text-xs font-medium text-amber-900">
                  🎵 Babbling detected
                </div>
                <div className="text-xs text-amber-600 mt-1">
                  Progress: 87%
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-amber-900 mb-4">
              Why Choose BabbleBear?
            </h2>
            <p className="text-xl text-amber-700 max-w-2xl mx-auto">
              Advanced AI technology wrapped in a warm, family-friendly interface
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-4">Smart Recording</h3>
              <p className="text-amber-700">
                Capture your baby's precious sounds with our intelligent recording system
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-4">Progress Tracking</h3>
              <p className="text-amber-700">
                Monitor development milestones with detailed analytics and insights
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-4">Family Focused</h3>
              <p className="text-amber-700">
                Designed with love for families, making speech development accessible
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-amber-100 to-orange-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-amber-900 mb-6">
            Ready to Start Your Baby's Speech Journey?
          </h2>
          <p className="text-xl text-amber-700 mb-8">
            Join thousands of families who trust BabbleBear for their child's development
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl px-12 py-6 text-xl font-medium shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-amber-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🧸</span>
            </div>
            <h3 className="text-xl font-bold">BabbleBear</h3>
          </div>
          <p className="text-amber-200 mb-4">
            Making speech development accessible and enjoyable for every family
          </p>
          <div className="flex justify-center gap-6 text-amber-300">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Contact Us</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing; 