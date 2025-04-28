import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import './IntroductionPage.css';

interface GlassBubbleProps {
  color: string;
}

const GlassBubble: React.FC<GlassBubbleProps> = ({ color }) => {
  return (
    <div className="glass-bubble-container relative w-48 h-48 sm:w-64 sm:h-64 floating">
      {/* Main glass bubble */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 30% 30%, white 0%, ${color}10 30%, ${color}20 60%, ${color}30 100%)`,
          boxShadow: `0 8px 32px 0 rgba(31, 38, 135, 0.2),
                      inset 0 -10px 20px 0 ${color}30,
                      inset 0 10px 20px 0 rgba(255, 255, 255, 0.7)`,
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          transform: 'scale(1)',
          transition: 'transform 0.3s ease-out',
        }}
      />

      {/* Highlight/reflection effect */}
      <div
        className="absolute w-3/5 h-1/4 rounded-full"
        style={{
          background: 'linear-gradient(120deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
          top: '20%',
          left: '20%',
          transform: 'rotate(-45deg)',
        }}
      />

      {/* Bottom shadow */}
      <div
        className="absolute bottom-0 left-1/2 w-3/4 h-4 rounded-full transform -translate-x-1/2 translate-y-10 opacity-40"
        style={{
          background: `radial-gradient(ellipse at center, ${color}80 0%, transparent 70%)`,
          filter: 'blur(4px)',
        }}
      />

      {/* Additional small highlight */}
      <div
        className="absolute w-1/5 h-1/5 rounded-full"
        style={{
          background: 'linear-gradient(120deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)',
          top: '30%',
          right: '25%',
          transform: 'rotate(30deg)',
        }}
      />

      {/* Inner light effect */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at center, ${color}10 0%, transparent 70%)`,
          filter: 'blur(5px)',
        }}
      />

      {/* Pulse animation */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: `1px solid ${color}30`,
          animation: 'pulse 2s infinite',
        }}
      />
    </div>
  );
};

interface SlideProps {
  title: string;
  text: string[];
  color: string;
  bubblePosition: string;
  background: string;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const Slide: React.FC<SlideProps> = ({
  title,
  text,
  color,
  bubblePosition,
  background,
  onNext,
  onPrev,
  isFirst,
  isLast,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!bubbleRef.current || !containerRef.current) return;

      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const deltaX = (e.clientX - centerX) / (width / 20);
      const deltaY = (e.clientY - centerY) / (height / 20);

      bubbleRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1)`;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center px-8 transition-all duration-700 ease-in-out`}
      style={{ background }}
    >
      <div className="absolute inset-0 z-0 opacity-20 overflow-hidden">
        <div
          className="absolute w-full h-full"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${color}20, transparent 70%)`,
          }}
        />
      </div>

      <h1 className="eco-title text-center relative z-10 mb-4 fade-in">{title}</h1>

      <div ref={bubbleRef} className={`relative ${bubblePosition} z-0 my-8 transition-transform duration-300 ease-out`}>
        <GlassBubble color={color} />
      </div>

      <div className="text-container max-w-xl text-center relative z-10 mt-6">
        {text.map((line, index) => (
          <p
            key={index}
            className={`text-xl sm:text-2xl font-light leading-relaxed mb-4 fade-in-delay-${index + 1}`}
          >
            {line}
          </p>
        ))}
      </div>

      <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-8 z-10">
        {!isFirst && (
          <button
            onClick={onPrev}
            className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-all"
            aria-label="Previous slide"
          >
            <ArrowLeft size={24} className="text-gray-800" />
          </button>
        )}

        {!isLast && (
          <button
            onClick={onNext}
            className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-all"
            aria-label="Next slide"
          >
            <ArrowRight size={24} className="text-gray-800" />
          </button>
        )}
      </div>
    </div>
  );
};

// Dados dos slides
const slides = [
  {
    title: "ECO",
    text: ["A Eco não é um guia.", "Não é uma voz que te ensina o caminho."],
    color: "#007BA7", // Cerulean blue
    bubblePosition: "floating",
    background: "linear-gradient(145deg, #F8F5F0 0%, #F8F5F0 100%)",
  },
  {
    title: "ECO",
    text: ["Ela é um espelho.", "Uma presença que escuta."],
    color: "#F7CAC9", // Rose quartz
    bubblePosition: "floating",
    background: "linear-gradient(145deg, #F8F5F0 0%, #F8F5F0 100%)",
  },
  {
    title: "ECO",
    text: ["Pronto para entrar no espaço entre pensamentos?", "Aqui, sua presença cria o reflexo. Apenas seja."],
    color: "#007BA7", // Cerulean blue
    bubblePosition: "floating",
    background: "linear-gradient(145deg, #F8F5F0 0%, #F8F5F0 100%)",
  },
  {
    title: "ECO",
    text: ["Seja bem-vindo ao seu espelho interior."],
    color: "#F7CAC9", // Rose quartz
    bubblePosition: "floating",
    background: "linear-gradient(145deg, #F8F5F0 0%, #F8F5F0 100%)",
  },
];

const IntroductionPage: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    console.log('useEffect IntroductionPage iniciado');
    let timer: NodeJS.Timeout | null = null; // Inicializa como null para melhor controle

    if (autoPlay) {
      timer = setTimeout(() => {
        console.log('setTimeout executado. Slide atual:', currentSlideIndex);
        if (currentSlideIndex < slides.length - 1) {
          setCurrentSlideIndex((prevIndex) => prevIndex + 1);
          console.log('Próximo slide:', currentSlideIndex + 1);
        } else {
          // Optional: loop back to the beginning
          // setCurrentSlideIndex(0);
          console.log('Fim dos slides.');
        }
      }, 6000); // Change slide every 6 seconds
    }

    return () => {
      console.log('useEffect IntroductionPage desmontado. Limpando timer:', timer);
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [currentSlideIndex, autoPlay]);

  const goToNextSlide = () => {
    console.log('goToNextSlide chamado. Slide atual:', currentSlideIndex);
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex((prevIndex) => prevIndex + 1);
      setAutoPlay(false); // Pause autoplay when manually navigating
      console.log('Navegando para o próximo slide:', currentSlideIndex + 1);
    }
  };

  const goToPrevSlide = () => {
    console.log('goToPrevSlide chamado. Slide atual:', currentSlideIndex);
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prevIndex) => prevIndex - 1);
      setAutoPlay(false); // Pause autoplay when manually navigating
      console.log('Navegando para o slide anterior:', currentSlideIndex - 1);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-100 via-teal-100 to-lime-100">
      <div className="relative w-full h-screen overflow-hidden">
        <TransitionGroup component={null}>
          <CSSTransition key={currentSlideIndex} timeout={500} classNames="slide">
            <Slide
              {...slides[currentSlideIndex]}
              onNext={goToNextSlide}
              onPrev={goToPrevSlide}
              isFirst={currentSlideIndex === 0}
              isLast={currentSlideIndex === slides.length - 1}
            />
          </CSSTransition>
        </TransitionGroup>

        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlideIndex ? 'bg-gray-800 w-4' : 'bg-gray-400'
              }`}
              onClick={() => {
                console.log('Botão de navegação clicado. Indíce:', index);
                setCurrentSlideIndex(index);
                setAutoPlay(false);
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntroductionPage;
