import React, { useState, useRef, useEffect } from "react";
import { Child, BabbleSession } from "@/entities/all";
import { InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, Square, Play, Pause, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";



export default function Record() {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioData, setAudioData] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

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
      const childrenData = await Child.list("-created_date");
      setChildren(childrenData);
      if (childrenData.length > 0) {
        setSelectedChild(childrenData[0].id);
      }
    } catch (error) {
      console.error("Failed to load children:", error);
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
      audioStream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const analyzeAudio = async (audioBlob) => {
    setIsAnalyzing(true);
    
    try {
      // Simulate audio analysis with LLM
      const mockAnalysis = await InvokeLLM({
        prompt: `Analyze this baby speech recording session of ${recordingTime} seconds. Generate realistic babble analysis results including babble score (0-100), phoneme diversity, sound types detected, total vocalizations, and any developmental flags.`,
        response_json_schema: {
          type: "object",
          properties: {
            babble_score: { type: "number", minimum: 0, maximum: 100 },
            phoneme_diversity: { type: "number" },
            sound_types: { type: "array", items: { type: "string" } },
            total_vocalizations: { type: "number" },
            longest_vocalization: { type: "number" },
            flags: { type: "array", items: { type: "string" } }
          }
        }
      });

      // Save session to database
      const session = await BabbleSession.create({
        child_id: selectedChild,
        duration_seconds: recordingTime,
        babble_score: mockAnalysis.babble_score,
        analysis_results: mockAnalysis,
        session_date: new Date().toISOString()
      });

      setAnalysisResults({
        ...mockAnalysis,
        duration: recordingTime
      });

    } catch (error) {
      console.error("Analysis failed:", error);
    }
    
    setIsAnalyzing(false);
  };

  const resetSession = () => {
    setAudioData(null);
    setAnalysisResults(null);
    setRecordingTime(0);
  };

  const formatTime = (seconds) => {
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
                      disabled={!selectedChild || isAnalyzing}
                      className={`w-48 h-12 text-lg font-medium rounded-2xl ${
                        isRecording 
                          ? "bg-red-500 hover:bg-red-600" 
                          : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                      } text-white shadow-lg transition-all duration-300 hover:shadow-xl`}
                    >
                      {isRecording ? "Stop Recording" : "Start Recording"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {isAnalyzing && (
                <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
                  <CardContent className="p-8 text-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full flex items-center justify-center"
                    >
                      <span className="text-2xl">🧸</span>
                    </motion.div>
                    <h3 className="text-xl font-semibold text-amber-900 mb-2">
                      Analyzing Your Baby's Sounds...
                    </h3>
                    <p className="text-amber-700">
                      BabbleBear is listening carefully to understand the speech patterns
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardContent className="p-8 text-center">
                <div className="space-y-6">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-200 to-emerald-300 rounded-full flex items-center justify-center">
                    <span className="text-2xl">✅</span>
                  </div>
                  <h3 className="text-2xl font-bold text-amber-900">
                    Analysis Complete!
                  </h3>
                  <div className="text-4xl font-bold text-emerald-600">
                    {analysisResults.babble_score}
                  </div>
                  <p className="text-amber-700">
                    Babble Score for {formatTime(analysisResults.duration)} session
                  </p>
                  <Button
                    onClick={resetSession}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl px-8 py-3 text-lg font-medium shadow-lg transition-all duration-300"
                  >
                    Record Another Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 