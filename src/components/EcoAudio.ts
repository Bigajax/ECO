import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { cn } from "@/lib/utils" // Supondo que isso seja para mesclar nomes de classes
import styles from './EcoAudio.module.css'; // Importe o arquivo CSS

// Define a fonte Inter globalmente (se já não estiver)
const inter = "Inter";

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
    <div className={cn(inter, styles.root, "flex flex-col items-center justify-center relative p-4 tab-content active")} id="eco-audio-content">
      <div className="absolute top-8 left-8">
        <button className={cn(styles.glassBubble, "p-4 w-12 h-12 flex items-center justify-center")}>
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

      <div className={cn(styles.glassBubble, "w-20 h-20 flex items-center justify-center mb-20")}>
        <span className="text-white text-2xl font-light">ECO</span>
      </div>

      <div className={cn(styles.glassBubble, "w-64 h-64 flex items-center justify-center mb-16 p-4")}>
        <div ref={waveformRef} className="w-full h-full flex items-center">
          {!audioUrl && !isPlaying && (
            <div className={styles.audioWave}>
              {[...Array(7)].map((_, i) => (
                <span
                  key={i}
                  className={styles.animatePulse}
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
          className={cn(styles.glassBubble, "w-16 h-16 flex items-center justify-center")}
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
          className={cn(styles.glassBubble, "w-16 h-16 flex items-center justify-center")}
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
      <div className={styles.root}>
      <div className="flex justify-center mt-8">
        <button
          className={cn(styles.tabButton, activeTab === 'home' && styles.active)}
          onClick={() => setActiveTab('home')}
        >
          Home
        </button>
        <button
          className={cn(styles.tabButton, activeTab === 'eco-audio' && styles.active)}
          onClick={() => setActiveTab('eco-audio')}
        >
          Eco Audio
        </button>
      </div>

      <div className={cn(styles.tabContent, activeTab === 'home' && styles.active)} id="home-content">
        <div className="flex flex-col items-center justify-center pt-20">
          <h1 className="text-4xl font-bold text-white mb-4">Bem-vindo à Página Inicial</h1>
          <p className="text-lg text-white">Esta é a página inicial do seu aplicativo.</p>
        </div>
      </div>

      {activeTab === 'eco-audio' && <EcoAudio />}
      </div>
    </div>
  );
};

export default HomePage;
