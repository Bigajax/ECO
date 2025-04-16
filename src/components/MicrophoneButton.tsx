import React from 'react';
import { Mic } from 'lucide-react';

interface MicrophoneButtonProps {
  onClick: () => void;
}

const MicrophoneButton = ({ onClick }: MicrophoneButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-all"
    >
      <Mic size={16} />
    </button>
  );
};

export default MicrophoneButton;

