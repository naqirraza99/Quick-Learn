import React, { useRef } from 'react';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { VoiceRecorder } from './components/VoiceRecorder';

function App() {
  const voiceRecorderRef = useRef(null);

  const handleTryDemo = () => {
    if (voiceRecorderRef.current) {
      voiceRecorderRef.current.startRecording();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Hero onTryDemo={handleTryDemo} />
      <Features />
      <VoiceRecorder ref={voiceRecorderRef} />
    </div>
  );
}

export default App;