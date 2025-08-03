import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, Square, Play, Pause, Clock, Upload, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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

export default function Record() {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingAssessment, setIsGeneratingAssessment] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioData, setAudioData] = useState<Blob | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [currentRecording, setCurrentRecording] = useState<Recording | null>(null);
  const [autismAssessment, setAutismAssessment] = useState<AutismAssessment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [autoAssessment, setAutoAssessment] = useState<boolean>(true);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjE4ZTcxNi1jNjk1LTRlNzQtYTMxMy1kZjFhZjZkYTQyMzIiLCJleHAiOjE3NTQ4MjQyNzN9.kdXC0OHzBUmfuITv3CS2nwoAhxMNe64CcqMMflu1rrE';

  useEffect(() => {
    loadChildren();
    return () => {
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const loadChildren = async () => {
    try {
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
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioData(audioBlob);
        analyzeAudio(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const createRecordingSession = async (): Promise<Recording | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/recordings`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          child_id: selectedChild,
          session_name: `Session ${new Date().toLocaleString()}`,
          notes: `Recording duration: ${recordingTime} seconds`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create recording session');
      }

      const recording: Recording = await response.json();
      return recording;
    } catch (error) {
      console.error('Failed to create recording session:', error);
      setError(error instanceof Error ? error.message : 'Failed to create recording session');
      return null;
    }
  };

  const uploadAudioFile = async (recording: Recording, audioBlob: Blob): Promise<boolean> => {
    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.wav');

      const response = await fetch(`${API_BASE_URL}/recordings/${recording.id}/upload`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${ACCESS_TOKEN}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload audio file');
      }

      return true;
    } catch (error) {
      console.error('Failed to upload audio file:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload audio file');
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  const triggerAnalysis = async (recording: Recording): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/recordings/${recording.id}/analyze`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${ACCESS_TOKEN}`
        },
        body: ''
      });

      if (!response.ok) {
        throw new Error('Failed to trigger analysis');
      }

      return true;
    } catch (error) {
      console.error('Failed to trigger analysis:', error);
      return false;
    }
  };

  const triggerAutismAssessment = async (childId: string): Promise<AutismAssessment | null> => {
    try {
      setIsGeneratingAssessment(true);
      
      const response = await fetch(`${API_BASE_URL}/children/${childId}/autism-assessment`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${ACCESS_TOKEN}`
        },
        body: ''
      });

      if (!response.ok) {
        throw new Error('Failed to generate autism assessment');
      }

      const assessment: AutismAssessment = await response.json();
      return assessment;
    } catch (error) {
      console.error('Failed to generate autism assessment:', error);
      return null;
    } finally {
      setIsGeneratingAssessment(false);
    }
  };

  const analyzeAudio = async (audioBlob: Blob) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Step 1: Create recording session
      const recording = await createRecordingSession();
      if (!recording) {
        throw new Error('Failed to create recording session');
      }
      
      setCurrentRecording(recording);

      // Step 2: Upload audio file
      const uploadSuccess = await uploadAudioFile(recording, audioBlob);
      if (!uploadSuccess) {
        throw new Error('Failed to upload audio file');
      }

      // Step 3: Trigger analysis automatically
      setIsUploading(false); // Upload completed, now analyzing
      const analysisTriggered = await triggerAnalysis(recording);

      // Step 4: Generate autism assessment if enabled
      let assessment: AutismAssessment | null = null;
      if (autoAssessment && selectedChild) {
        assessment = await triggerAutismAssessment(selectedChild);
        setAutismAssessment(assessment);
      }

      // Show success results
      setAnalysisResults({
        recording: recording,
        duration: recordingTime,
        success: true,
        analysisTriggered: analysisTriggered,
        autismAssessment: assessment,
        message: analysisTriggered 
          ? 'Recording uploaded and analysis started successfully!' 
          : 'Recording uploaded successfully! Analysis will be available shortly.'
      });

    } catch (error) {
      console.error("Process failed:", error);
      setError(error instanceof Error ? error.message : 'Process failed');
      setAnalysisResults({
        success: false,
        message: 'Failed to process recording',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    
    setIsAnalyzing(false);
  };

  const resetSession = () => {
    setAudioData(null);
    setAnalysisResults(null);
    setCurrentRecording(null);
    setAutismAssessment(null);
    setRecordingTime(0);
    setError(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSelectedChildName = () => {
    const child = children.find(c => c.id === selectedChild);
    return child ? child.name : "Select Child";
  };

  return (
    <div className="p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">
              Record Babble Session
            </h1>
            <p className="text-amber-700 text-lg">
              Capture your baby's precious sounds and track their speech development
            </p>
          </div>

          {!analysisResults ? (
            <div className="space-y-6">
              {/* Child Selector */}
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-bold text-amber-900">
                    <Clock className="w-5 h-5" />
                    Select Child
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={selectedChild} onValueChange={setSelectedChild}>
                    <SelectTrigger className="w-full">
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
                </CardContent>
              </Card>

              {/* Assessment Options */}
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-bold text-amber-900">
                    <Brain className="w-5 h-5" />
                    Assessment Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="auto-assessment" 
                      checked={autoAssessment}
                      onCheckedChange={setAutoAssessment}
                    />
                    <Label htmlFor="auto-assessment" className="text-amber-800">
                      Generate autism assessment after recording
                    </Label>
                  </div>
                  <p className="text-sm text-amber-600 mt-2">
                    When enabled, an autism assessment will be automatically generated using all available recordings for this child.
                  </p>
                </CardContent>
              </Card>

              {/* Recording Interface */}
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
                <CardContent className="p-8 text-center">
                  <div className="space-y-6">
                    <motion.div
                      animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg"
                    >
                      <Mic className="w-16 h-16 text-white" />
                    </motion.div>
                    
                    <div className="text-4xl font-bold text-amber-900">
                      {formatTime(recordingTime)}
                    </div>
                    
                    <p className="text-amber-700 text-lg">
                      {isRecording ? "Recording in progress..." : "Ready to capture babbles and coos"}
                    </p>
                    
                    <Button
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={!selectedChild || isAnalyzing || isUploading}
                      className={`w-48 h-12 text-lg font-medium rounded-2xl ${
                        isRecording 
                          ? "bg-red-500 hover:bg-red-600" 
                          : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                      } text-white shadow-lg transition-all duration-300 hover:shadow-xl`}
                    >
                      {isRecording ? "Stop Recording" : "Start Recording"}
                    </Button>
                    
                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                        <p className="text-red-800 font-medium">Error</p>
                        <p className="text-red-600 text-sm">{error}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {(isAnalyzing || isUploading || isGeneratingAssessment) && (
                <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
                  <CardContent className="p-8 text-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full flex items-center justify-center"
                    >
                      {isUploading ? (
                        <Upload className="w-8 h-8 text-amber-700" />
                      ) : isGeneratingAssessment ? (
                        <Brain className="w-8 h-8 text-amber-700" />
                      ) : (
                        <span className="text-2xl">🧸</span>
                      )}
                    </motion.div>
                    <h3 className="text-xl font-semibold text-amber-900 mb-2">
                      {isUploading 
                        ? "Uploading Recording..." 
                        : isGeneratingAssessment
                          ? "Generating Autism Assessment..."
                          : isAnalyzing 
                            ? "Analyzing Your Baby's Sounds..." 
                            : "Processing..."
                      }
                    </h3>
                    <p className="text-amber-700">
                      {isUploading 
                        ? "Securely uploading the audio file to BabbleBear servers"
                        : isGeneratingAssessment
                          ? "Creating comprehensive autism assessment using all recordings"
                          : isAnalyzing 
                            ? "BabbleBear is listening carefully and starting the analysis process"
                            : "Processing your baby's recording"
                      }
                    </p>
                    
                    {/* Progress indicator */}
                    <div className="mt-4 flex justify-center space-x-2">
                      <div className={`w-3 h-3 rounded-full transition-colors ${isUploading ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                      <div className={`w-3 h-3 rounded-full transition-colors ${!isUploading && (isAnalyzing || isGeneratingAssessment) ? 'bg-amber-500' : !isUploading ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                      <div className={`w-3 h-3 rounded-full transition-colors ${isGeneratingAssessment ? 'bg-amber-500' : autoAssessment && !isUploading && !isAnalyzing ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                    </div>
                    <div className="mt-2 text-xs text-amber-600">
                      {isUploading ? "Step 1: Upload" : isGeneratingAssessment ? "Step 3: Assessment" : "Step 2: Analysis"}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardContent className="p-8 text-center">
                <div className="space-y-6">
                  <div className={`w-16 h-16 mx-auto ${analysisResults.success ? 'bg-gradient-to-br from-emerald-200 to-emerald-300' : 'bg-gradient-to-br from-red-200 to-red-300'} rounded-full flex items-center justify-center`}>
                    <span className="text-2xl">{analysisResults.success ? "✅" : "❌"}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-amber-900">
                    {analysisResults.success ? "Upload Complete!" : "Upload Failed"}
                  </h3>
                  
                  {analysisResults.success ? (
                    <>
                      <div className="space-y-2">
                        <p className="text-amber-700">
                          Recording uploaded successfully for {formatTime(analysisResults.duration)} session
                        </p>
                        {analysisResults.recording && (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <p className="text-sm text-amber-800">
                              <strong>Session ID:</strong> {analysisResults.recording.id}
                            </p>
                            <p className="text-sm text-amber-800">
                              <strong>Created:</strong> {new Date(analysisResults.recording.recorded_at).toLocaleString()}
                            </p>
                            <p className="text-sm text-amber-800">
                              <strong>Analysis Status:</strong> {analysisResults.analysisTriggered ? '✅ Started' : '⏳ Queued'}
                            </p>
                          </div>
                        )}
                        {analysisResults.autismAssessment && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Brain className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-800">Autism Assessment Results</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="text-blue-800">
                                <strong>Risk Level:</strong> {analysisResults.autismAssessment.autism_probability}%
                              </div>
                              <div className="text-blue-800">
                                <strong>Recordings Analyzed:</strong> {analysisResults.autismAssessment.total_recordings_analyzed}
                              </div>
                              <div className="text-blue-800 col-span-2">
                                <strong>Sound Categories:</strong>
                                <div className="mt-1">
                                  {Object.entries(JSON.parse(analysisResults.autismAssessment.dominant_sound_categories)).map(([category, percentage]) => (
                                    <span key={category} className="inline-block bg-blue-100 rounded px-2 py-1 mr-1 mb-1">
                                      {category}: {String(percentage)}%
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="mt-2 text-xs text-blue-700">
                              <strong>Assessment Date:</strong> {new Date(analysisResults.autismAssessment.assessment_date).toLocaleString()}
                            </div>
                          </div>
                        )}
                        {analysisResults.analysisTriggered && (
                          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mt-2">
                            <p className="text-sm text-emerald-800">
                              <strong>🎯 Analysis in Progress:</strong> Your baby's sounds are being analyzed. 
                              Check the dashboard in a few minutes to see the results!
                            </p>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-red-700">
                        {analysisResults.message}
                      </p>
                      {analysisResults.error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <p className="text-sm text-red-800">{analysisResults.error}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <Button
                    onClick={resetSession}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl px-8 py-3 text-lg font-medium shadow-lg transition-all duration-300"
                  >
                    Record Another Session
                  </Button>
                  
                  {analysisResults.success && analysisResults.analysisTriggered && (
                    <p className="text-xs text-amber-600 mt-2">
                      💡 Tip: Visit the Dashboard to see your analysis results and babble scores
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
  );
}