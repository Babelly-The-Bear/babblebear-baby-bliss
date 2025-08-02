import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Square, Mic } from "lucide-react";
import microphoneIcon from "@/assets/microphone-icon.jpg";

export const AudioInterface = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [waveformData, setWaveformData] = useState<number[]>([]);

  // Simulate recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Simulate waveform animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setWaveformData(prev => {
          const newData = [...prev, Math.random() * 100];
          return newData.slice(-20); // Keep last 20 data points
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setDuration(0);
      setWaveformData([]);
    } else {
      setIsRecording(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-warm-100 to-warm-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-warm-800 mb-4">
            Simple Audio Monitoring
          </h2>
          <p className="text-lg text-warm-600 max-w-2xl mx-auto">
            One-click recording sessions that capture your baby's precious babbles and coos 
            with real-time analysis and cozy visual feedback.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-gradient-to-br from-white to-warm-50 border-0 shadow-cozy rounded-3xl">
            
            {/* Microphone Visual */}
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-warm-400 to-warm-600 p-6 shadow-cozy transition-all duration-300 ${
                  isRecording ? 'animate-soft-pulse scale-110' : ''
                }`}>
                  <Mic className="w-full h-full text-white" />
                </div>
                
                {isRecording && (
                  <div className="absolute inset-0 rounded-full border-4 border-peach-400 animate-ping"></div>
                )}
              </div>
            </div>

            {/* Recording Controls */}
            <div className="text-center mb-8">
              <Button
                onClick={toggleRecording}
                size="lg"
                className={`rounded-2xl px-8 py-4 text-lg font-medium transition-all duration-300 ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-gradient-to-r from-warm-500 to-warm-600 hover:from-warm-600 hover:to-warm-700 text-white'
                } shadow-cozy hover:shadow-xl hover:-translate-y-1`}
              >
                {isRecording ? (
                  <>
                    <Square className="mr-2 h-5 w-5" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" />
                    Start Recording
                  </>
                )}
              </Button>
            </div>

            {/* Timer */}
            <div className="text-center mb-8">
              <div className="text-3xl font-bold text-warm-700 font-mono">
                {formatTime(duration)}
              </div>
              <div className="text-sm text-warm-500 mt-1">
                {isRecording ? 'Recording in progress...' : 'Ready to record'}
              </div>
            </div>

            {/* Waveform Visualization */}
            <div className="bg-warm-100 rounded-2xl p-6 felt-texture">
              <h4 className="text-sm font-medium text-warm-700 mb-4 text-center">
                Audio Waveform
              </h4>
              <div className="flex items-end justify-center space-x-1 h-24">
                {Array.from({ length: 20 }, (_, i) => {
                  const height = waveformData[i] || 10;
                  return (
                    <div
                      key={i}
                      className={`w-3 bg-gradient-to-t from-warm-500 to-peach-400 rounded-full transition-all duration-200 ${
                        isRecording ? 'opacity-100' : 'opacity-30'
                      }`}
                      style={{ height: `${Math.max(height, 10)}%` }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Status Indicators */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center p-4 bg-sage-100 rounded-2xl">
                <div className="text-lg font-bold text-warm-700">24</div>
                <div className="text-xs text-warm-500">Sounds Detected</div>
              </div>
              <div className="text-center p-4 bg-peach-100 rounded-2xl">
                <div className="text-lg font-bold text-warm-700">89%</div>
                <div className="text-xs text-warm-500">Babble Quality</div>
              </div>
              <div className="text-center p-4 bg-warm-200 rounded-2xl">
                <div className="text-lg font-bold text-warm-700">3.2m</div>
                <div className="text-xs text-warm-500">Total Today</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};