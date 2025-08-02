import React, { useState, useEffect } from "react";
import { Child, BabbleSession, ParentNote } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/lib/utils";
import { Plus, Mic, TrendingUp, Heart, Calendar, Sun } from "lucide-react";
import { motion } from "framer-motion";

import Sidebar from "../components/dashboard/Sidebar";
import WelcomeHeader from "../components/dashboard/WelcomeHeader";
import BabbleScoreCard from "../components/dashboard/BabbleScoreCard";
import RecentSessions from "../components/dashboard/RecentSessions";
import QuickActions from "../components/dashboard/QuickActions";
import DailyInsights from "../components/dashboard/DailyInsights";

export default function Dashboard() {
  const [children, setChildren] = useState([]);
  const [recentSessions, setRecentSessions] = useState([]);
  const [todaysSessions, setTodaysSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const childrenData = await Child.list("-created_date");
      const sessionsData = await BabbleSession.list("-session_date", 10);
      
      // Filter today's sessions
      const today = new Date().toISOString().split('T')[0];
      const todaysData = sessionsData.filter(session => 
        session.session_date.startsWith(today)
      );

      setChildren(childrenData);
      setRecentSessions(sessionsData);
      setTodaysSessions(todaysData);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    }
    setIsLoading(false);
  };

  const averageScore = todaysSessions.length > 0 
    ? Math.round(todaysSessions.reduce((sum, session) => sum + session.babble_score, 0) / todaysSessions.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Sidebar 
        childrenCount={children.length}
        sessionsToday={todaysSessions.length}
        avgScore={averageScore}
      />
      
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Sun className="w-8 h-8 text-amber-500" />
                <h1 className="text-3xl font-bold text-amber-900">
                  Good Afternoon!
                </h1>
              </div>
              <p className="text-xl text-amber-700 mb-2">
                Welcome back to your BabbleBear dashboard
              </p>
              <div className="flex items-center gap-2 text-amber-600">
                <Heart className="w-4 h-4 text-red-400" />
                <span>
                  {children.length === 0 
                    ? "Ready to add your first child?"
                    : `Tracking ${children.length} ${children.length === 1 ? 'child' : 'children'}'s development`
                  }
                </span>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              <BabbleScoreCard
                score={averageScore}
                sessionsToday={todaysSessions.length}
                isLoading={isLoading}
              />
              
              <RecentSessions 
                sessions={recentSessions}
                children={children}
                isLoading={isLoading}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <QuickActions />
              <DailyInsights 
                todaysSessions={todaysSessions}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 