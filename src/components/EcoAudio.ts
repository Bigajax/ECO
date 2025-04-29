// Ecoaudio.ts

import React, { useState } from 'react';
import { Mic, FileText } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-blue-100 to-pink-200 flex flex-col items-center justify-between py-8 px-4">
      {children}
    </div>
  );
};

const Header: React.FC = () => {
  return (
    <div className="w-full flex justify-center mb-6">
      <h1 className="text-4xl font-light tracking-widest text-white opacity-80">ECO</h1>
    </div>
  );
};

interface ButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  label: string;
  color?: string;
}

const Button: React.FC<ButtonProps> = ({
  icon,
  onClick,
  label,
  color = 'bg-white bg-opacity-15'
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-16 h-16 rounded-full
        ${color} backdrop-blur-xl
        flex items-center justify-center
        shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
        border border-white border-opacity-20
        transition-all duration-200 ease-in-out
        before:content-[''] before:absolute before:inset-0
        before:rounded-full before:bg-gradient-to-b
        before:from-white before:to-transparent
        before:opacity-20 before:z-0
        hover:shadow-[0_8px_40px_0_rgba(31,38,135,0.4)]
        hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50
        relative
      `}
      aria-label={label}
    >
      <div className="z-10">{icon}</div>
    </button>
  );
};

const ControlButtons: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);

  const handleRecord = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-center space-x-8">
        <Button
          icon={<Mic size={24} className={`text-white ${isRecording ? 'text-red-500' : ''}`} />}
          onClick={handleRecord}
          color={isRecording ? 'bg-red-400 bg-opacity-30' : 'bg-white bg-opacity-20'}
          label="Record"
        />
        <Button
          icon={<FileText size={24} className="text-white" />}
          onClick={() => {}}
          label="Document"
        />
      </div>
    </div>
  );
};

const MainControl: React.FC = () => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="flex-1 flex items-center justify-center w-full">
      <button
        onClick={handleClick}
        className={`
          w-48 h-48 md:w-56 md:h-56 rounded-full
          bg-white bg-opacity-15 backdrop-blur-xl
          flex items-center justify-center
          shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
          border border-white border-opacity-20
          transition-all duration-300 ease-in-out
          before:content-[''] before:absolute before:inset-0
          before:rounded-full before:bg-gradient-to-b
          before:from-white before:to-transparent
          before:opacity-20 before:z-0
          hover:shadow-[0_8px_40px_0_rgba(31,38,135,0.4)]
          hover:scale-105 active:scale-95 relative
          ${isActive ? 'bg-opacity-25 border-opacity-40' : ''}
        `}
        aria-label="Main eco control"
      >
        {isActive && (
          <div className="w-8 h-8 rounded-full bg-green-400 bg-opacity-50 animate-pulse z-10" />
        )}
      </button>
    </div>
  );
};

const Ecoaudio = () => {
    return (
        <Layout>
            <Header />
            <MainControl/>
            <ControlButtons/>
        </Layout>
    )
}

export default Ecoaudio;

