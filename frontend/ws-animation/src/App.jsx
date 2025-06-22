import React from 'react';
import WebSocketProvider from './context/WebSocketProvider.jsx';
import AnimationCanvas from './components/AnimationCanvas.jsx';
import ControlPanel from './components/ControlPanel.jsx';
import StatusIndicator from './components/StatusIndicator.jsx';

const App = () => {
  const wsUrl = import.meta.env.VITE_ENDPOINT;
  const httpUrl = wsUrl.replace(/^wss?/, 'https');

  return (
    <WebSocketProvider url={wsUrl}>
      <div className="min-h-screen bg-black text-white p-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">

          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">
              🎨 Real-Time WebSocket Animation
            </h1>
            <p className="text-gray-400">
              Interactive animation system with WebSocket
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="glow-bottom p-4 mb-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4 text-white">Animation Canvas</h2>
                <div className="aspect-video">
                  <AnimationCanvas />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glow-bottom p-6 rounded-lg min-h-[280px]">
                <ControlPanel />
              </div>

              <div className="glow-bottom p-6 rounded-lg min-h-[280px]">
                <StatusIndicator />
              </div>

              <div className="glow-bottom p-6 rounded-lg text-center">
                <h2 className="text-lg font-bold text-white mb-4">🛠️ Server Diagnostics</h2>
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href={`${httpUrl}/health`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    🔍 View Health
                  </a>
                  <a
                    href={`${httpUrl}/stats`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    📊 View Stats
                  </a>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Monitor backend status and usage
                </p>
              </div>
            </div>
          </div>

          <footer className="mt-12 text-center text-gray-600 text-xs">
            <p>© 2025 Real-Time WebSocket Animation System</p>
          </footer>
        </div>
      </div>
    </WebSocketProvider>
  );
};

export default App;
