import React, { useState, useEffect } from "react";
import { Child, BabbleSession } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { format, subDays } from "date-fns";

export default function Analytics() {
  const [children, setChildren] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState(null);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const childrenData = await Child.list("-created_date");
      const sessionsData = await BabbleSession.list("-session_date", 50);
      
      setChildren(childrenData);
      setSessions(sessionsData);
      
      if (childrenData.length > 0) {
        setSelectedChild(childrenData[0]);
      }
    } catch (error) {
      console.error("Failed to load analytics data:", error);
    }
    setIsLoading(false);
  };

  const getChildSessions = (childId) => {
    return sessions.filter(session => session.child_id === childId)
      .sort((a, b) => new Date(a.session_date) - new Date(b.session_date));
  };

  const getAverageScore = (childId) => {
    const childSessions = getChildSessions(childId);
    if (childSessions.length === 0) return 0;
    return Math.round(childSessions.reduce((sum, session) => sum + session.babble_score, 0) / childSessions.length);
  };

  const getLowScoreSessions = (childId) => {
    return getChildSessions(childId).filter(session => session.babble_score < 50);
  };

  const formatChartData = (childId) => {
    const childSessions = getChildSessions(childId);
    return childSessions.map((session, index) => ({
      session: index + 1,
      score: session.babble_score,
      date: format(new Date(session.session_date), "MMM d"),
      fullDate: session.session_date
    }));
  };

  const getScoreTrend = (childId) => {
    const childSessions = getChildSessions(childId);
    if (childSessions.length < 2) return "stable";
    
    const recentScores = childSessions.slice(-3).map(s => s.babble_score);
    const avgRecent = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
    const avgOverall = getAverageScore(childId);
    
    if (avgRecent > avgOverall + 5) return "improving";
    if (avgRecent < avgOverall - 5) return "declining";
    return "stable";
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "improving": return <TrendingUp className="w-5 h-5 text-emerald-500" />;
      case "declining": return <TrendingDown className="w-5 h-5 text-red-500" />;
      default: return <Activity className="w-5 h-5 text-amber-500" />;
    }
  };

  const getTrendText = (trend) => {
    switch (trend) {
      case "improving": return "Improving";
      case "declining": return "Needs Attention";
      default: return "Stable";
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case "improving": return "text-emerald-600";
      case "declining": return "text-red-600";
      default: return "text-amber-600";
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="h-8 bg-white/60 rounded-xl animate-pulse" />
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="h-96 bg-white/60 rounded-3xl animate-pulse" />
            <div className="h-96 bg-white/60 rounded-3xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center md:text-left"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">
            Speech Development Analytics
          </h1>
          <p className="text-xl text-amber-700">
            Track your children's speech development progress over time
          </p>
        </motion.div>

        {/* Child Selector */}
        {children.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-3"
          >
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => setSelectedChild(child)}
                className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                  selectedChild?.id === child.id
                    ? "bg-amber-100 text-amber-900 border border-amber-200"
                    : "bg-white/60 text-amber-700 hover:bg-amber-50"
                }`}
              >
                {child.name}
              </button>
            ))}
          </motion.div>
        )}

        {selectedChild ? (
          <div className="space-y-8">
            {/* Overview Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-3 gap-6"
            >
              <Card className="bg-white/80 backdrop-blur-sm teddy-shadow border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-amber-600">Average Score</p>
                      <p className="text-3xl font-bold text-amber-900">
                        {getAverageScore(selectedChild.id)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full flex items-center justify-center">
                      <Activity className="w-6 h-6 text-amber-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm teddy-shadow border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-amber-600">Total Sessions</p>
                      <p className="text-3xl font-bold text-amber-900">
                        {getChildSessions(selectedChild.id).length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full flex items-center justify-center">
                      <span className="text-lg">📊</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm teddy-shadow border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-amber-600">Trend</p>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(getScoreTrend(selectedChild.id))}
                        <p className={`text-xl font-bold ${getTrendColor(getScoreTrend(selectedChild.id))}`}>
                          {getTrendText(getScoreTrend(selectedChild.id))}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Score Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm teddy-shadow border-0">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-amber-900">
                    {selectedChild.name}'s Score Progression
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={formatChartData(selectedChild.id)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#92400e"
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="#92400e"
                          fontSize={12}
                          domain={[0, 100]}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                            border: "1px solid #fbbf24",
                            borderRadius: "12px"
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="score" 
                          stroke="#f59e0b" 
                          strokeWidth={3}
                          dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: "#d97706", strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Warnings for Low Scores */}
            {getLowScoreSessions(selectedChild.id).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-red-50/80 backdrop-blur-sm teddy-shadow border-red-200">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-red-900 flex items-center gap-2">
                      <AlertTriangle className="w-6 h-6" />
                      Low Score Alert
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <p className="text-red-700">
                        {selectedChild.name} has had {getLowScoreSessions(selectedChild.id).length} session(s) with scores below 50.
                      </p>
                      <div className="bg-white/60 rounded-xl p-4">
                        <h4 className="font-semibold text-red-900 mb-2">Recommendation:</h4>
                        <p className="text-red-700">
                          Consider consulting with a pediatrician or speech therapist to discuss your child's speech development. 
                          Early intervention can be very beneficial for speech development.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Recent Sessions Bar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm teddy-shadow border-0">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-amber-900">
                    Recent Session Scores
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={formatChartData(selectedChild.id).slice(-10)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#92400e"
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="#92400e"
                          fontSize={12}
                          domain={[0, 100]}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                            border: "1px solid #fbbf24",
                            borderRadius: "12px"
                          }}
                        />
                        <Bar 
                          dataKey="score" 
                          fill="#f59e0b"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full flex items-center justify-center teddy-shadow">
              <span className="text-4xl">📊</span>
            </div>
            <h3 className="text-2xl font-bold text-amber-900 mb-4">
              No Children Available
            </h3>
            <p className="text-amber-700 mb-6 max-w-md mx-auto">
              Add children to your profile to start tracking their speech development analytics
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
} 