import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { motion } from 'framer-motion';
import { Mic, Square, Play, Brain, FileText, RefreshCw, Pause, HelpCircle } from 'lucide-react';
import axios from 'axios';
import { generateQuestions } from '../nlpUtils';

export const VoiceRecorder = forwardRef((props, ref) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [summary, setSummary] = useState<{ detailedSummary: string } | null>(null);
  const [questions, setQuestions] = useState<string[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDemoButton, setShowDemoButton] = useState(true);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const voiceRecorderSectionRef = useRef<HTMLDivElement | null>(null);

  const ASSEMBLYAI_API_KEY = '16e64d73c6fb4763bd0eda1b6eeaab50'; // Replace with your actual API key

  useImperativeHandle(ref, () => ({
    startRecording: () => {
      setShowDemoButton(false);
      startRecording();
      if (voiceRecorderSectionRef.current) {
        voiceRecorderSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    },
  }));

  useEffect(() => {
    return () => {
      if (document.body.dataset.recordingTimer) {
        clearInterval(Number(document.body.dataset.recordingTimer));
      }
    };
  }, []);

  useEffect(() => {
    if (audioElementRef.current && audioUrl) {
      audioElementRef.current.src = audioUrl;
    }
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setRecordedAudio(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        if (audioElementRef.current) {
          audioElementRef.current.src = url;
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      const timer = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      document.body.dataset.recordingTimer = String(timer);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Microphone access denied. Please allow microphone permissions in your browser settings to use this feature.');
    }
  };

  const stopRecording = () => {
    if (!isRecording || !mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    setIsRecording(false);
    clearInterval(Number(document.body.dataset.recordingTimer));

    mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
  };

  const togglePlayback = () => {
    if (audioElementRef.current) {
      if (isPlaying) {
        audioElementRef.current.pause();
      } else {
        audioElementRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const generateSummary = async () => {
    if (!recordedAudio) {
      console.error('No recorded audio found.');
      return;
    }

    setIsProcessing(true);

    try {
      const uploadResponse = await axios.post(
        'https://api.assemblyai.com/v2/upload',
        recordedAudio,
        {
          headers: {
            'Authorization': ASSEMBLYAI_API_KEY,
            'Content-Type': 'audio/wav',
          },
        }
      );

      const audioUrl = uploadResponse.data.upload_url;

      const transcriptionResponse = await axios.post(
        'https://api.assemblyai.com/v2/transcript',
        {
          audio_url: audioUrl,
          summarization: true,
          summary_model: 'informative',
          summary_type: 'bullets',
        },
        {
          headers: {
            'Authorization': ASSEMBLYAI_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      const transcriptId = transcriptionResponse.data.id;

      let transcriptionResult;
      while (true) {
        const statusResponse = await axios.get(
          `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
          {
            headers: {
              'Authorization': ASSEMBLYAI_API_KEY,
            },
          }
        );

        transcriptionResult = statusResponse.data;
        if (transcriptionResult.status === 'completed' || transcriptionResult.status === 'error') {
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      if (transcriptionResult.status === 'error') {
        throw new Error(transcriptionResult.error);
      }

      const summaryText = transcriptionResult.summary;
      setSummary({
        detailedSummary: summaryText,
      });

    } catch (error) {
      console.error('Error generating summary:', error);
      alert('An error occurred while processing your request. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateQuestions = async () => {
    console.log('Summary:', summary); // Debugging line
    if (!summary) {
      console.error('No summary available to generate questions from.');
      return;
    }

    setIsGeneratingQuestions(true);

    try {
      const generatedQuestions = await generateQuestions(summary.detailedSummary);
      console.log('Generated Questions:', generatedQuestions); // Debugging line
      setQuestions(generatedQuestions);
    } catch (error) {
      console.error('Error generating questions:', error);
      alert('An error occurred while generating questions. Please try again.');
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-white" ref={voiceRecorderSectionRef}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Focus on Learning, Let Us Handle the Notes</h2>
            <p className="text-gray-600">Transform your study experience with AI-powered note-taking. Capture, organize, and enhance your learning journey automatically.</p>
          </div>

          {showDemoButton && (
            <div className="text-center mb-8">
              <button
                onClick={() => {
                  setShowDemoButton(false);
                  startRecording();
                }}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto transition-colors"
              >
                Try Free Demo
              </button>
            </div>
          )}

          {!showDemoButton && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <div className="flex flex-col items-center mb-8">
                <motion.div
                  animate={{
                    scale: isRecording ? [1, 1.1, 1] : 1,
                    transition: {
                      repeat: isRecording ? Infinity : 0,
                      duration: 1,
                    },
                  }}
                  className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${isRecording ? 'bg-red-100' : 'bg-primary/10'}`}
                >
                  {isRecording ? (
                    <Square className="w-10 h-10 text-red-500 cursor-pointer" onClick={stopRecording} />
                  ) : (
                    <Mic className="w-10 h-10 text-primary cursor-pointer" onClick={startRecording} />
                  )}
                </motion.div>
                {isRecording && (
                  <div className="text-red-500 font-mono text-xl mb-2">{formatTime(recordingTime)}</div>
                )}
                <p className="text-gray-600">
                  {isRecording ? 'Recording in progress...' : 'Click the microphone to start recording'}
                </p>
              </div>

              {audioUrl && !isRecording && (
                <div className="border-t border-b border-gray-100 py-6 mb-6">
                  <div className="flex items-center justify-center gap-4">
                    <button 
                      onClick={togglePlayback} 
                      className="text-primary hover:text-primary-dark transition-colors"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </button>
                    <div className="text-gray-600">Recorded Lecture</div>
                    <audio ref={audioElementRef} onEnded={() => setIsPlaying(false)} />
                  </div>
                </div>
              )}

              {audioUrl && !isRecording && (
                <div className="text-center space-y-4">
                  <button
                    onClick={generateSummary}
                    disabled={isProcessing}
                    className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <motion.div 
                          animate={{ rotate: 360 }} 
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        >
                          <RefreshCw className="w-5 h-5" />
                        </motion.div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Brain className="w-5 h-5" />
                        Generate Summary
                      </>
                    )}
                  </button>

                  {summary && (
                    <button
                      onClick={handleGenerateQuestions}
                      disabled={isGeneratingQuestions}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto transition-colors disabled:opacity-50"
                    >
                      {isGeneratingQuestions ? (
                        <>
                          <motion.div 
                            animate={{ rotate: 360 }} 
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                          >
                            <RefreshCw className="w-5 h-5" />
                          </motion.div>
                          Generating Questions...
                        </>
                      ) : (
                        <>
                          <HelpCircle className="w-5 h-5" />
                          Generate Practice Questions
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              {summary && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="mt-8 space-y-6"
                >
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-5 h-5 text-primary" />
                      <h3 className="text-xl font-semibold">Lecture Summary</h3>
                    </div>
                    <p className="text-gray-700 whitespace-pre-line">{summary.detailedSummary}</p>
                  </div>

                  {questions && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <HelpCircle className="w-5 h-5 text-green-500" />
                        <h3 className="text-xl font-semibold">Practice Questions</h3>
                      </div>
                      <ol className="list-decimal list-inside space-y-4 text-gray-700">
                        {questions.map((question, index) => (
                          <li key={index} className="pl-2">{question}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
});