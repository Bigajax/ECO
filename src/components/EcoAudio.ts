import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { cn } from "@/lib/utils" // Assuming this is for class name merging

// Define the Inter font globally (if it's not already)
const inter = "Inter";

// Styles (Consider moving to a separate CSS file or a CSS-in-JS solution)
const styles = `
:root {
  --serylian-blue: #87CEEB;
  --quartz-pink: #FFB7C5;
}

body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background: linear-gradient(180deg, var(--serylian-blue) 0%, var(--quartz-pink) 100%);
}

.glass-bubble {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  transition: all 0.3s ease;
}

.glass-bubble:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.25);
}

.glass-bubble:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.audio-wave {
  display: flex;
  align-items: center;
  gap: 4px;
}

.audio-wave span {
  width: 4px;
  height: 20px;
  background: white;
  border-radius: 2px;
}

@keyframes pulse {
  0%,
  100% {
    transform: scaleY(1);
  }

  50% {
    transform: scaleY(0.5);
  }
}

.animate-pulse {
  animation: pulse 1s infinite;
}

.tab-button {
  padding: 10px 20px;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  margin-right: 10px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: background-color 0.3s ease, transform 0.2s ease;
  font-family: 'Inter', sans-serif;
  backdrop-filter: blur(5px);
}

.tab-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.tab-button.active {
  background-color: rgba(255, 255, 255, 0.5);
  border-color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.tab-content {
  display: none;
}

.tab-content.active {
  display: block;
  width: 100%;
}
`;

const EcoAudio = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const waveformRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (waveformRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: 'white',
        progressColor: 'rgba(255, 255, 255, 0.5)',
        cursorColor: 'transparent', // Make cursor invisible
        barWidth: 4,
        barGap: 3,
        height: 40,
        normalize: true,
        backend: 'MediaElement', // Use MediaElement backend
      });

        wavesurferRef.current.on('play', () => setIsPlaying(true));
        wavesurferRef.current.on('pause', () => setIsPlaying(false));
        wavesurferRef.current.on('finish', () => setIsPlaying(false)); // Reset state
    }

    return () => {
      wavesurferRef.current?.destroy();
    };
  }, []);

    useEffect(() => {
        if (audioUrl && wavesurferRef.current) {
             wavesurferRef.current.load(audioUrl);
        }
    }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        if(wavesurferRef.current){
           wavesurferRef.current.load(url);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const togglePlayback = () => {
    if (wavesurferRef.current) {
      if (isPlaying) {
        wavesurferRef.current.pause();
      } else {
        wavesurferRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className={cn(inter, "min-h-screen flex flex-col items-center justify-center relative p-4 tab-content active")} id="eco-audio-content">
      <style>{styles}</style>
      <div className="absolute top-8 left-8">
        <button className="glass-bubble p-4 w-12 h-12 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fillRule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div className="glass-bubble w-20 h-20 flex items-center justify-center mb-20">
        <span className="text-white text-2xl font-light">ECO</span>
      </div>

      <div className="glass-bubble w-64 h-64 flex items-center justify-center mb-16 p-4">
        <div ref={waveformRef} className="w-full h-full flex items-center">
          {!audioUrl && !isRecording && (
            <div className="audio-wave">
              {[...Array(7)].map((_, i) => (
                <span
                  key={i}
                  className="animate-pulse"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    height: i === 3 ? '32px' : i === 2 || i === 4 ? '24px' : '16px',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-8">
        <button
          className="glass-bubble w-16 h-16 flex items-center justify-center"
          onClick={togglePlayback}
          disabled={!audioUrl}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            {isPlaying ? (
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
            ) : (
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
            )}
          </svg>
        </button>
        <button
          className="glass-bubble w-20 h-20 flex items-center justify-center"
          onClick={isRecording ? stopRecording : startRecording}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill={isRecording ? '#ff4444' : 'white'}>
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        </button>
        <button
          className="glass-bubble w-16 h-16 flex items-center justify-center"
          onClick={() => {
            setAudioUrl(null);
            setIsPlaying(false);
            wavesurferRef.current?.empty();
          }}
          disabled={!audioUrl}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-gradient-to-b from-serylian-blue to-quartz-pink">
      <style>{styles}</style>
      <div className="flex justify-center mt-8">
        <button
          className={cn("tab-button", activeTab === 'home' && 'active')}
          onClick={() => setActiveTab('home')}
        >
          Home
        </button>
        <button
          className={cn("tab-button", activeTab === 'eco-audio' && 'active')}
          onClick={() => setActiveTab('eco-audio')}
        >
          Eco Audio
        </button>
      </div>

      <div className="tab-content active" id="home-content">
        <div className="flex flex-col items-center justify-center pt-20">
          <h1 className="text-4xl font-bold text-white mb-4">Bem-vindo à Página Inicial</h1>
          <p className="text-lg text-white">Esta é a página inicial do seu aplicativo.</p>
        </div>
      </div>

      {activeTab === 'eco-audio' && <EcoAudio />}
    </div>
  );
};

export default HomePage;

