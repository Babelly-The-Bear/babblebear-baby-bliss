import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Clock, Link as LinkIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface Recording {
  id: string;
  child_id: string;
  session_name: string;
  duration: number;
  recorded_at: string;
  is_analyzed: boolean;
  notes: string;
}

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

export default function RecentSessions() {
  const [sessions, setSessions] = useState<Recording[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjE4ZTcxNi1jNjk1LTRlNzQtYTMxMy1kZjFhZjZkYTQyMzIiLCJleHAiOjE3NTQyMTgxODV9.d6wUIzEbj_e0FAkrGS-vgI_zZhhCkiZdMA1gjnEzrnI';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch recordings and children in parallel
        const [recordingsResponse, childrenResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/recordings`, {
            headers: {
              'accept': 'application/json',
              'Authorization': `Bearer ${ACCESS_TOKEN}`
            }
          }),
          fetch(`${API_BASE_URL}/children`, {
            headers: {
              'accept': 'application/json',
              'Authorization': `Bearer ${ACCESS_TOKEN}`
            }
          })
        ]);

        if (!recordingsResponse.ok || !childrenResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const recordingsData = await recordingsResponse.json();
        const childrenData = await childrenResponse.json();

        setSessions(recordingsData);
        setChildren(childrenData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getChildName = (childId: string) => {
    const child = children.find(c => c.id === childId);
    return child ? child.name : "Unknown Child";
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-500";
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-amber-900">
          <LinkIcon className="w-6 h-6" />
          Recent Sessions
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {error ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <LinkIcon className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-red-600 font-medium">Failed to load sessions</p>
            <p className="text-red-500 text-sm mt-1">{error}</p>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-amber-50">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-8 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : sessions.length > 0 ? (
          <div className="space-y-3">
            {sessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 transition-colors duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full flex items-center justify-center">
                    <span className="text-lg">👶</span>
                  </div>
                  <div>
                    <div className="font-semibold text-amber-900">
                      {getChildName(session.child_id)}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-amber-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(session.duration)}
                      </div>
                      <span>•</span>
                      <span>
                        {format(new Date(session.recorded_at), "MMM d, h:mm a")}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                  <div className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                    {session.is_analyzed ? 'Analyzed' : 'Pending'}
                  </div>
                  {session.session_name && (
                    <div className="text-xs text-amber-600 max-w-20 truncate">
                      {session.session_name}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full flex items-center justify-center">
              <LinkIcon className="w-8 h-8 text-amber-700" />
            </div>
            <p className="text-amber-700 font-medium">No sessions recorded yet</p>
            <p className="text-amber-600 text-sm mt-1">Start recording to see your baby's progress</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}