import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Award } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export default function BabbleScoreCard({ score, sessionsToday, isLoading }) {
  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-500";
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Attention";
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-amber-300/30 rounded-full transform translate-x-8 -translate-y-8" />
      
      <CardHeader className="relative">
        <CardTitle className="flex items-center justify-between">
          <span className="text-2xl font-bold text-amber-900">Today's Babble Score</span>
          <div className="w-8 h-8 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full flex items-center justify-center">
            <Award className="w-5 h-5 text-amber-700" />
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-32" />
            <Skeleton className="h-4 w-48" />
            <div className="flex gap-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex items-center gap-4"
            >
              <div className={`text-6xl font-bold ${getScoreColor(score)}`}>
                {score}
              </div>
              <div>
                <div className="text-lg font-semibold text-amber-900">
                  {getScoreLabel(score)}
                </div>
                <div className="text-amber-600">
                  Based on {sessionsToday} session{sessionsToday !== 1 ? 's' : ''} today
                </div>
              </div>
            </motion.div>

            <div className="flex items-center gap-6 pt-4 border-t border-amber-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <span className="text-sm text-amber-700">
                  +12% from yesterday
                </span>
              </div>
              <div className="text-sm text-amber-600">
                Weekly average: 78
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 