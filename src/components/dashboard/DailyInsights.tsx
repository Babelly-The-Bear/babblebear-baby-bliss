import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, AlertTriangle, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function DailyInsights({ todaysSessions, isLoading }) {
  const generateInsights = () => {
    if (todaysSessions.length === 0) {
      return [
        {
          type: "suggestion",
          icon: Lightbulb,
          title: "First Session",
          message: "Record your first session today to start tracking progress!"
        }
      ];
    }

    const insights = [];
    const avgScore = todaysSessions.reduce((sum, s) => sum + s.babble_score, 0) / todaysSessions.length;
    
    if (avgScore >= 80) {
      insights.push({
        type: "positive",
        icon: Heart,
        title: "Great Progress!",
        message: "Your baby's babbling shows excellent development patterns today."
      });
    } else if (avgScore < 60) {
      insights.push({
        type: "attention",
        icon: AlertTriangle,  
        title: "Keep Monitoring",
        message: "Consider more interactive play sessions to encourage vocalization."
      });
    }

    insights.push({
      type: "suggestion",
      icon: Lightbulb,
      title: "Daily Tip",
      message: "Reading aloud can help boost phoneme diversity in your baby's speech."
    });

    return insights;
  };

  const getInsightStyle = (type) => {
    switch (type) {
      case "positive":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "attention":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  const insights = generateInsights();

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-amber-900">
          Daily Insights
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-2xl border ${getInsightStyle(insight.type)}`}
          >
            <div className="flex items-start gap-3">
              <insight.icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold mb-1">{insight.title}</div>
                <div className="text-sm">{insight.message}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
} 