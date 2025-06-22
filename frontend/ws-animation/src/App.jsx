import React from 'react';
import WebSocketProvider from './context/WebSocketProvider.jsx';
import AnimationCanvas from './components/AnimationCanvas.jsx';
import ControlPanel from './components/ControlPanel.jsx';
import StatusIndicator from './components/StatusIndicator.jsx';

const App = () => {
  const wsUrl = import.meta.env.VITE_ENDPOINT;
  const httpUrl = wsUrl.replace(/^wss/, 'https'); // Convert WebSocket URL to HTTP for diagnostics

  return (
    <WebSocketProvider url={wsUrl}>
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
              🎨 Real-Time WebSocket Animation
            </h1>
            <p className="text-center text-gray-600">
              Interactive animation system with WebSocket
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2/3: Animation Canvas */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Animation Canvas</h2>
                <div className="aspect-video">
                  <AnimationCanvas />
                </div>
              </div>
            </div>

            {/* Right 1/3: Controls + Status + Diagnostics */}
            <div className="space-y-6">
              <ControlPanel />
              <StatusIndicator />

              {/* New Server Diagnostics Section */}
              <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center gap-4">
                <h2 className="text-lg font-bold text-gray-800">🛠️ Server Diagnostics</h2>
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href={`${httpUrl}/health`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
                  >
                    🔍 View Health
                  </a>
                  <a
                    href={`${httpUrl}/stats`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
                  >
                    📊 View Stats
                  </a>
                </div>
                <p className="text-sm text-gray-500 text-center">
                  Monitor backend status and usage
                </p>
              </div>
            </div>
          </div>

          <footer className="mt-12 text-center text-gray-400 text-xs">
            <p>© 2025 Real-Time WebSocket Animation System</p>
          </footer>
        </div>
      </div>
    </WebSocketProvider>
  );
};

export default App;
