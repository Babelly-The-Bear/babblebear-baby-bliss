import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/lib/utils";
import { Plus, Mic, TrendingUp, Heart, Calendar, Sun } from "lucide-react";
import { motion } from "framer-motion";

import BabbleScoreCard from "../components/dashboard/BabbleScoreCard";
import RecentSessions from "../components/dashboard/RecentSessions";
import QuickActions from "../components/dashboard/QuickActions";
import DailyInsights from "../components/dashboard/DailyInsights";

interface Child {
  id: string;
  name: string;
  date_of_birth: string;
  gender: "male" | "female";
  weight_at_birth: number;
  height_at_birth: number;
  notes: string;
  created_at: string;
}

interface Recording {
  id: string;
  child_id: string;
  session_name: string;
  duration: number;
  recorded_at: string;
  is_analyzed: boolean;
  notes: string;
}

export default function Dashboard() {
  const [children, setChildren] = useState<Child[]>([]);
  const [recentSessions, setRecentSessions] = useState<Recording[]>([]);
  const [todaysSessions, setTodaysSessions] = useState<Recording[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjE4ZTcxNi1jNjk1LTRlNzQtYTMxMy1kZjFhZjZkYTQyMzIiLCJleHAiOjE3NTQ4MjQyNzN9.kdXC0OHzBUmfuITv3CS2nwoAhxMNe64CcqMMflu1rrE';

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load children and recordings
      const [childrenResponse, recordingsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/children`, {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${ACCESS_TOKEN}`
          }
        }),
        fetch(`${API_BASE_URL}/recordings`, {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${ACCESS_TOKEN}`
          }
        })
      ]);

      if (!childrenResponse.ok || !recordingsResponse.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const childrenData: Child[] = await childrenResponse.json();
      const recordingsData: Recording[] = await recordingsResponse.json();
      
      // Filter today's sessions
      const today = new Date().toISOString().split('T')[0];
      const todaysData = recordingsData.filter(session => 
        session.recorded_at.startsWith(today)
      );

      setChildren(childrenData);
      setRecentSessions(recordingsData.slice(0, 10)); // Get recent 10 sessions
      setTodaysSessions(todaysData);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    }
    setIsLoading(false);
  };

  const averageScore = 85; // Default score for display purposes

  return (
    <div className="p-8">
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
              <BabbleScoreCard />
              
              <RecentSessions />
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
  );
}