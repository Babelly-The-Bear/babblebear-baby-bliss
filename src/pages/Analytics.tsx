import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, TrendingUp, Clock, FileAudio, AlertCircle, Activity, Calendar } from "lucide-react";
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

export default function Analytics() {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>("");
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [assessments, setAssessments] = useState<AutismAssessment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjE4ZTcxNi1jNjk1LTRlNzQtYTMxMy1kZjFhZjZkYTQyMzIiLCJleHAiOjE3NTQ4MjQyNzN9.kdXC0OHzBUmfuITv3CS2nwoAhxMNe64CcqMMflu1rrE';

  useEffect(() => {
    loadChildren();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      loadChildData(selectedChild);
    }
  }, [selectedChild]);

  const loadChildren = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/children`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${ACCESS_TOKEN}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch children');
      }

      const childrenData: Child[] = await response.json();
      setChildren(childrenData);
      if (childrenData.length > 0) {
        setSelectedChild(childrenData[0].id);
      }
    } catch (error) {
      console.error("Failed to load children:", error);
      setError(error instanceof Error ? error.message : 'Failed to load children');
    } finally {
      setIsLoading(false);
    }
  };

  const loadChildData = async (childId: string) => {
    try {
      setIsLoading(true);
      
      // Load recordings and assessments in parallel
      const [recordingsResponse, assessmentsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/children/${childId}/recordings`, {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${ACCESS_TOKEN}`
          }
        }),
        fetch(`${API_BASE_URL}/children/${childId}/autism-assessments`, {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${ACCESS_TOKEN}`
          }
        })
      ]);

      if (!recordingsResponse.ok || !assessmentsResponse.ok) {
        throw new Error('Failed to fetch child data');
      }

      const recordingsData: Recording[] = await recordingsResponse.json();
      const assessmentsData: AutismAssessment[] = await assessmentsResponse.json();

      setRecordings(recordingsData);
      setAssessments(assessmentsData);
    } catch (error) {
      console.error("Failed to load child data:", error);
      setError(error instanceof Error ? error.message : 'Failed to load child data');
    } finally {
      setIsLoading(false);
    }
  };

  const generateNewAssessment = async () => {
    if (!selectedChild) return;

    try {
      setIsGenerating(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/children/${selectedChild}/autism-assessment`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${ACCESS_TOKEN}`
        },
        body: ''
      });

      if (!response.ok) {
        throw new Error('Failed to generate new assessment');
      }

      const newAssessment: AutismAssessment = await response.json();
      setAssessments(prev => [newAssessment, ...prev]);
    } catch (error) {
      console.error("Failed to generate assessment:", error);
      setError(error instanceof Error ? error.message : 'Failed to generate assessment');
    } finally {
      setIsGenerating(false);
    }
  };

  const getSelectedChildName = () => {
    const child = children.find(c => c.id === selectedChild);
    return child ? child.name : "Select Child";
  };

  const getLatestAssessment = () => {
    return assessments.length > 0 ? assessments[0] : null;
  };

  const getRiskLevelColor = (probability: number) => {
    if (probability <= 25) return "text-emerald-600";
    if (probability <= 50) return "text-amber-600";
    return "text-red-600";
  };

  const getRiskLevelBg = (probability: number) => {
    if (probability <= 25) return "bg-emerald-50 border-emerald-200";
    if (probability <= 50) return "bg-amber-50 border-amber-200";
    return "bg-red-50 border-red-200";
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const latestAssessment = getLatestAssessment();

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">
            Analytics & Assessments
          </h1>
          <p className="text-amber-700 text-lg">
            Comprehensive analysis of your child's speech development and assessments
          </p>
        </div>

        {/* Child Selector */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-amber-900">
              <Brain className="w-5 h-5" />
              Select Child for Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Select value={selectedChild} onValueChange={setSelectedChild}>
                <SelectTrigger className="w-full max-w-md">
                  <SelectValue placeholder="Select a child">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">👶</span>
                      {getSelectedChildName()}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {children.map((child) => (
                    <SelectItem key={child.id} value={child.id}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">👶</span>
                        {child.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button
                onClick={generateNewAssessment}
                disabled={!selectedChild || isGenerating || recordings.length === 0}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              >
                {isGenerating ? "Generating..." : "Generate New Assessment"}
              </Button>
            </div>
            {recordings.length === 0 && selectedChild && (
              <p className="text-amber-600 text-sm mt-2">
                No recordings available for assessment. Please record some sessions first.
              </p>
            )}
          </CardContent>
        </Card>

        {error && (
          <Card className="bg-red-50 border border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800 font-medium">Error</p>
              </div>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Latest Assessment */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-bold text-amber-900">
                  <Activity className="w-6 h-6" />
                  Latest Assessment Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : latestAssessment ? (
                  <div className="space-y-6">
                    {/* Risk Score */}
                    <div className={`rounded-lg border p-6 ${getRiskLevelBg(latestAssessment.autism_probability)}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-amber-900">Risk Assessment</h3>
                        <div className="text-right">
                          <div className={`text-3xl font-bold ${getRiskLevelColor(latestAssessment.autism_probability)}`}>
                            {latestAssessment.autism_probability}%
                          </div>
                          <div className="text-sm text-amber-600">
                            Confidence: {Math.round(latestAssessment.confidence_level * 100)}%
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Recordings Analyzed:</strong> {latestAssessment.total_recordings_analyzed}
                        </div>
                        <div>
                          <strong>Assessment Date:</strong> {new Date(latestAssessment.assessment_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Sound Categories */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-3">Dominant Sound Categories</h4>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(JSON.parse(latestAssessment.dominant_sound_categories)).map(([category, percentage]) => (
                          <span key={category} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {category}: {String(percentage)}%
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <h4 className="font-semibold text-amber-900 mb-3">Recommended Actions</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-amber-800">
                        {JSON.parse(latestAssessment.recommended_actions).map((action: string, index: number) => (
                          <li key={index}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Brain className="w-16 h-16 mx-auto text-amber-300 mb-4" />
                    <p className="text-amber-600">No assessments available yet.</p>
                    <p className="text-amber-500 text-sm mt-1">Generate your first assessment using the button above.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Recording Summary */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-amber-900">
                  <FileAudio className="w-5 h-5" />
                  Recording Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-amber-900">{recordings.length}</div>
                      <div className="text-amber-600">Total Recordings</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-amber-700">Analyzed:</span>
                        <span className="font-medium">{recordings.filter(r => r.is_analyzed).length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-amber-700">Total Duration:</span>
                        <span className="font-medium">
                          {formatDuration(recordings.reduce((sum, r) => sum + r.duration, 0))}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-amber-700">Latest Session:</span>
                        <span className="font-medium">
                          {recordings.length > 0 
                            ? new Date(recordings[0].recorded_at).toLocaleDateString()
                            : "None"
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Assessment History */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-amber-900">
                  <Calendar className="w-5 h-5" />
                  Assessment History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    {Array(3).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : assessments.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {assessments.slice(0, 5).map((assessment) => (
                      <div key={assessment.id} className="border border-amber-200 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <div className={`text-lg font-bold ${getRiskLevelColor(assessment.autism_probability)}`}>
                            {assessment.autism_probability}%
                          </div>
                          <div className="text-xs text-amber-600">
                            {new Date(assessment.assessment_date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-xs text-amber-700 mt-1">
                          {assessment.total_recordings_analyzed} recordings analyzed
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-amber-600 text-sm">No assessment history</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}