import React from 'react';
import { useConfigStore } from '../store/useConfigStore';
import { Maximize, Minimize, RotateCcw, Target, Settings, ChevronLeft } from 'lucide-react';

const OverlayControls = () => {
  const { triggerCameraReset, resetConfig } = useConfigStore();

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="overlay-controls">
      <button className="overlay-btn" onClick={triggerCameraReset} title="Center View">
        <Target size={20} />
      </button>
      <button className="overlay-btn" onClick={handleFullscreen} title="Toggle Fullscreen">
        <Maximize size={20} />
      </button>
      <button className="overlay-btn" onClick={resetConfig} title="Reset Configuration">
        <RotateCcw size={20} />
      </button>
      <button className="overlay-btn" title="Dimensions">
        <Settings size={20} />
      </button>
      <button className="overlay-btn" title="Back">
        <ChevronLeft size={20} />
      </button>
    </div>
  );
};

export default OverlayControls;
