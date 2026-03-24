import React from 'react';
import Scene from './components/Scene';
import Controls from './components/Controls';
import OverlayControls from './components/OverlayControls';
import './App.css';

function App() {
  return (
    <div className="configurator-container">
      <div className="canvas-container">
        <Scene />
        <OverlayControls />
      </div>
      <div className="controls-container">
        <Controls />
      </div>
    </div>
  );
}

export default App;
