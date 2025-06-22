import React from 'react';
import WebSocketProvider from './context/WebSocketProvider.jsx';
import AnimationCanvas from './components/AnimationCanvas.jsx';
import ControlPanel from './components/ControlPanel.jsx';
import StatusIndicator from './components/StatusIndicator.jsx';

const App = () => (
  <WebSocketProvider url="ws://localhost:8080">
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">🎨 Real-Time WebSocket Animation</h1>
          <p className="text-center text-gray-600">Interactive animation system with WebSocket</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Animation Canvas</h2>
              <div className="aspect-video">
                <AnimationCanvas />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <ControlPanel />
            <StatusIndicator />
          </div>
        </div>

        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>WebSocket Animation System - MVP Prototype</p>
        </footer>
      </div>
    </div>
  </WebSocketProvider>
);

export default App;
