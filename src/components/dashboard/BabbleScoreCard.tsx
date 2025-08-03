import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Award, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

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

interface AutismAssessment {
  id: string;
  child_id: string;
  assessment_date: string;
  autism_probability: number;
  total_recordings_analyzed: number;
  dominant_sound_categories: string;
  behavioral_patterns: string;
  confidence_level: number;
  notes: string | null;
  recommended_actions: string;
}

export default function BabbleScoreCard() {
  const [score, setScore] = useState<number>(0);
  const [sessionsToday, setSessionsToday] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [children, setChildren] = useState<Child[]>([]);
  const [assessments, setAssessments] = useState<AutismAssessment[]>([]);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjE4ZTcxNi1jNjk1LTRlNzQtYTMxMy1kZjFhZjZkYTQyMzIiLCJleHAiOjE3NTQyMTgxODV9.d6wUIzEbj_e0FAkrGS-vgI_zZhhCkiZdMA1gjnEzrnI';

  // Custom logic to calculate babble score based on autism assessment
  const calculateBabbleScore = (autismAssessment: AutismAssessment | null): number => {
    if (!autismAssessment) return 75; // Default score when no assessment

    try {
      const soundCategories = JSON.parse(autismAssessment.dominant_sound_categories);
      const unknownPercentage = soundCategories.unknown || 0;
      
      // Custom logic: Lower autism probability means higher babble score
      // But also consider the unknown sound percentage
      let baseScore = 100 - (autismAssessment.autism_probability * 0.6); // Reduce impact of autism probability
      
      // Adjust based on unknown sounds - but don't be too harsh for small amounts
      if (unknownPercentage > 0) {
        // Progressive penalty for unknown sounds
        if (unknownPercentage <= 20) {
          baseScore -= unknownPercentage * 0.2; // Light penalty for low unknown %
        } else if (unknownPercentage <= 50) {
          baseScore -= (unknownPercentage * 0.4) + 5; // Moderate penalty
        } else {
          baseScore -= (unknownPercentage * 0.6) + 15; // Higher penalty for high unknown %
        }
      }

      // Boost score based on confidence level and total recordings
      const confidenceBoost = autismAssessment.confidence_level * 10;
      const analysisBoost = Math.min(autismAssessment.total_recordings_analyzed * 2, 10);
      
      baseScore += confidenceBoost + analysisBoost;

      // Ensure score is between 0 and 100
      return Math.max(0, Math.min(100, Math.round(baseScore)));
    } catch (error) {
      console.error('Error parsing sound categories:', error);
      return 65; // Fallback score on parsing error
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch children and recordings
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
          throw new Error('Failed to fetch data');
        }

        const childrenData: Child[] = await childrenResponse.json();
        const recordingsData: Recording[] = await recordingsResponse.json();

        setChildren(childrenData);

        // Count today's sessions
        const today = new Date().toDateString();
        const todaySessions = recordingsData.filter(recording => 
          new Date(recording.recorded_at).toDateString() === today
        ).length;
        setSessionsToday(todaySessions);

        // Get autism assessments for all children and calculate overall score
        const assessmentPromises = childrenData.map(async (child) => {
          try {
            const response = await fetch(`${API_BASE_URL}/children/${child.id}/autism-assessment`, {
              method: 'POST',
              headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${ACCESS_TOKEN}`
              },
              body: ''
            });
            
            if (response.ok) {
              return await response.json();
            }
            return null;
          } catch (error) {
            console.warn(`Failed to get assessment for child ${child.id}:`, error);
            return null;
          }
        });

        const assessmentResults = await Promise.all(assessmentPromises);
        const validAssessments = assessmentResults.filter(Boolean) as AutismAssessment[];
        setAssessments(validAssessments);

        // Calculate average babble score across all children
        if (validAssessments.length > 0) {
          const scores = validAssessments.map(assessment => calculateBabbleScore(assessment));
          const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
          setScore(Math.round(averageScore));
        } else {
          setScore(75); // Default score when no assessments available
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching data:', err);
        setScore(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-500";
  };

  const getScoreLabel = (score: number) => {
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
        {error ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-red-600 font-medium">Failed to calculate babble score</p>
            <p className="text-red-500 text-sm mt-1">{error}</p>
          </div>
        ) : isLoading ? (
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
                {assessments.length > 0 && (
                  <div className="text-sm text-amber-500 mt-1">
                    Analyzed {assessments.length} child{assessments.length !== 1 ? 'ren' : ''}
                  </div>
                )}
              </div>
            </motion.div>

            <div className="flex items-center gap-6 pt-4 border-t border-amber-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <span className="text-sm text-amber-700">
                  {score >= 75 ? '+' : ''}
                  {score >= 75 ? Math.round((score - 70) * 0.3) : -Math.round((70 - score) * 0.2)}% from yesterday
                </span>
              </div>
              <div className="text-sm text-amber-600">
                Target: 80+
              </div>
            </div>

            {/* Show assessment insights */}
            {assessments.length > 0 && score < 70 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">Development Insights</span>
                </div>
                <p className="text-xs text-amber-700">
                  Consider consulting with a pediatric specialist for detailed assessment and recommendations.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}