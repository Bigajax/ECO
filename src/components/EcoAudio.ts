import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { cn } from "@/lib/utils" // Supondo que isso seja para mesclar nomes de classes

// Define a fonte Inter globalmente (se já não estiver)
const inter = "Inter";

// Estilos (Considere mover para um arquivo CSS separado ou uma solução de CSS-in-JS)
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
  border: 1px solid rgba(25, 255, 255, 0.3);
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
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
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
      <div>
        <h1>Eco Audio</h1>
        {audioUrl && (
          <button onClick={togglePlayback}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        )}
        <div ref={waveformRef} />
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

      <div className={cn("tab-content", activeTab === 'home' && 'active')} id="home-content">
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
