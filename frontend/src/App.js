import React from "react";
import EnhancedVideoPlayer from "./components/EnhancedVideoPlayer";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 lg:p-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Header */}
      <header className="relative z-10 text-center mb-8">
        <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 animate-fade-in">
          🎬 Smart Video Quality Analyzer
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto animate-slide-up">
          Professional video quality testing with real-time analytics and automated performance monitoring
        </p>
      </header>
      
      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        <EnhancedVideoPlayer />
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
