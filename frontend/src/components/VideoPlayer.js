import React, { useState, useRef } from "react";

const VideoPlayer = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  const handleVideoLoadStart = () => {
    setIsLoading(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('video/')) {
        const videoURL = URL.createObjectURL(file);
        setVideoUrl(videoURL);
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const videoURL = URL.createObjectURL(file);
      setVideoUrl(videoURL);
    }
  };

  return (
    <div className="group">
      <div className="bg-white/70 backdrop-blur-lg shadow-xl rounded-3xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <span className="text-3xl animate-bounce">🎥</span> 
            Video Player
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Ready to analyze
          </div>
        </div>

        {/* URL Input */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="🔗 Enter video URL or drag & drop a video file"
            className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-gray-700 placeholder-gray-400 hover:border-gray-300"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            🌐
          </div>
        </div>

        {/* Drag & Drop Zone */}
        <div 
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 mb-6 ${
            isDragOver 
              ? 'border-blue-500 bg-blue-50 scale-105' 
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="text-4xl mb-4">
            {isDragOver ? '🎯' : '📁'}
          </div>
          <p className="text-gray-600 font-medium">
            {isDragOver ? 'Drop your video here!' : 'Click to browse or drag & drop video files'}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Supports MP4, WebM, AVI, MOV formats
          </p>
        </div>

        {/* Video Display */}
        {videoUrl && (
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/20 rounded-xl backdrop-blur-sm z-10">
                <div className="flex items-center gap-3 text-white">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  <span>Loading video...</span>
                </div>
              </div>
            )}
            <video
              src={videoUrl}
              controls
              onLoadStart={handleVideoLoadStart}
              onLoadedData={handleVideoLoad}
              className="w-full rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200"
              poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f3f4f6'/%3E%3Ctext x='400' y='300' text-anchor='middle' fill='%236b7280' font-size='24' font-family='Arial, sans-serif'%3E🎬 Video Preview%3C/text%3E%3C/svg%3E"
            />
          </div>
        )}

        {!videoUrl && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-50">🎬</div>
            <p className="text-gray-500">No video loaded</p>
            <p className="text-sm text-gray-400">Add a URL or upload a file to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
