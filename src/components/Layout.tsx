import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/lib/utils";
import { Home, Mic, Baby, TrendingUp, Heart, User } from "lucide-react";
import { motion } from "framer-motion";

const navigationItems = [
  { name: "Dashboard", icon: Home, path: "/dashboard" },
  { name: "Record Session", icon: Mic, path: "/record" },
  { name: "My Children", icon: Baby, path: "/children" },
  { name: "Analytics", icon: TrendingUp, path: "/analytics" },
];

interface LayoutProps {
  children: React.ReactNode;
  currentPageName?: string;
  childrenCount?: number;
  sessionsToday?: number;
  avgScore?: number;
}

export default function Layout({ 
  children, 
  currentPageName, 
  childrenCount = 0, 
  sessionsToday = 0, 
  avgScore = 0 
}: LayoutProps) {
  const location = useLocation();

  return (
    <>
      <style>
        {`
          :root {
            --warm-brown: #8B5A3C;
            --toffee: #A0724C;
            --caramel: #C8956D;
            --mocha: #6B4423;
            --cream: #F5F1EB;
            --peach: #F4C2A7;
            --sage: #A8B5A0;
            --vanilla: #F9F6F0;
          }
          
          .cozy-gradient {
            background: linear-gradient(135deg, var(--vanilla) 0%, var(--cream) 100%);
          }
          
          .teddy-shadow {
            box-shadow: 0 8px 32px rgba(139, 90, 60, 0.15);
          }
          
          .warm-glow {
            box-shadow: 0 0 20px rgba(200, 149, 109, 0.3);
          }
        `}
      </style>
      <div className="min-h-screen flex w-full cozy-gradient">
        {/* Sidebar - keeping the existing design */}
        <div className="w-64 bg-white/90 backdrop-blur-sm border-r border-amber-200 h-screen fixed left-0 top-0 p-6 flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">🧸</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-amber-900">BabbleBear</h1>
              <p className="text-xs text-amber-600">Speech Development</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.name} to={item.path}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-amber-100 text-amber-900 border border-amber-200"
                          : "text-amber-700 hover:bg-amber-50"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Quick Stats */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-4">
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between px-4 py-3 bg-amber-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-amber-700">Sessions Today</span>
                </div>
                <span className="font-bold text-amber-900">{sessionsToday}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 bg-amber-50 rounded-xl">
                <span className="text-sm text-amber-700">Avg. Score</span>
                <span className="font-bold text-green-600">{avgScore}</span>
              </div>
            </div>
          </div>

          {/* Parent Dashboard */}
          <div className="mt-auto">
            <div className="flex items-center gap-3 px-4 py-3 bg-amber-100 rounded-xl">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-amber-900">Parent Dashboard</div>
                <div className="text-xs text-amber-600">Track your baby's progress</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 flex flex-col ml-64">
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </>
  );
} 