import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const EnhancedVideoPlayer = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoName, setVideoName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [autoTest, setAutoTest] = useState(true);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  // Video analysis metrics
  const [metrics, setMetrics] = useState({
    startTime: null,
    bufferingEvents: 0,
    totalBufferingTime: 0,
    isPlaying: false,
    currentTime: 0,
    duration: 0
  });

  const handleVideoLoad = () => {
    setIsLoading(false);
    if (autoTest && videoUrl && videoName) {
      setTimeout(() => {
        startAutomaticAnalysis();
      }, 1000);
    }
  };

  const handleVideoLoadStart = () => {
    setIsLoading(true);
    resetMetrics();
  };

  const resetMetrics = () => {
    setMetrics({
      startTime: null,
      bufferingEvents: 0,
      totalBufferingTime: 0,
      isPlaying: false,
      currentTime: 0,
      duration: 0
    });
    setAnalysisResult(null);
  };

  const startAutomaticAnalysis = async () => {
    if (!videoRef.current || isAnalyzing) return;

    setIsAnalyzing(true);
    const video = videoRef.current;

    try {
      console.log(`🔬 Starting automatic analysis for: ${videoName}`);
      
      // Reset and prepare for analysis
      video.currentTime = 0;
      let startupTime = null;
      let bufferingCount = 0;
      let bufferingStartTime = null;
      let totalBufferingDuration = 0;
      let freezeDetectionData = [];

      // Setup event listeners for analysis
      const onPlay = () => {
        if (!startupTime) {
          startupTime = Date.now();
        }
      };

      const onPlaying = () => {
        if (startupTime && !metrics.startTime) {
          const startup = (Date.now() - startupTime) / 1000;
          setMetrics(prev => ({ ...prev, startTime: startup, isPlaying: true }));
          console.log(`⏱️ Startup time: ${startup}s`);
        }
      };

      const onWaiting = () => {
        bufferingCount++;
        bufferingStartTime = Date.now();
        console.log(`🔄 Buffering event #${bufferingCount}`);
      };

      const onCanPlay = () => {
        if (bufferingStartTime) {
          const bufferDuration = (Date.now() - bufferingStartTime) / 1000;
          totalBufferingDuration += bufferDuration;
          bufferingStartTime = null;
          console.log(`✅ Buffering resolved in ${bufferDuration}s`);
        }
      };

      const onTimeUpdate = () => {
        const currentTime = video.currentTime;
        const duration = video.duration;
        setMetrics(prev => ({ ...prev, currentTime, duration }));
        
        // Simple freeze detection - check if time progress is normal
        freezeDetectionData.push({
          time: Date.now(),
          currentTime: currentTime
        });
      };

      const onError = (e) => {
        console.error('Video error during analysis:', e);
        setIsAnalyzing(false);
      };

      // Add event listeners
      video.addEventListener('play', onPlay);
      video.addEventListener('playing', onPlaying);
      video.addEventListener('waiting', onWaiting);
      video.addEventListener('canplay', onCanPlay);
      video.addEventListener('timeupdate', onTimeUpdate);
      video.addEventListener('error', onError);

      // Start playback for analysis
      startupTime = Date.now();
      await video.play();

      // Run analysis for 10 seconds or until video ends
      const analysisTimeout = setTimeout(async () => {
        video.pause();
        
        // Calculate freeze percentage (simplified)
        let freezePercent = 0;
        if (freezeDetectionData.length > 2) {
          let frozenFrames = 0;
          for (let i = 1; i < freezeDetectionData.length; i++) {
            const timeDiff = freezeDetectionData[i].time - freezeDetectionData[i-1].time;
            const progressDiff = freezeDetectionData[i].currentTime - freezeDetectionData[i-1].currentTime;
            
            // If time passed but video didn't progress (accounting for normal buffering)
            if (timeDiff > 500 && progressDiff < 0.1) {
              frozenFrames++;
            }
          }
          freezePercent = (frozenFrames / freezeDetectionData.length) * 100;
        }

        // Get video resolution (simplified)
        const resolution = video.videoHeight ? `${video.videoHeight}p` : '720p';

        // Final metrics
        const finalStartupTime = metrics.startTime || ((Date.now() - startupTime) / 1000);
        
        const analysisData = {
          video_name: videoName,
          startup_time: parseFloat(finalStartupTime.toFixed(2)),
          buffering_count: bufferingCount,
          buffering_duration: parseFloat(totalBufferingDuration.toFixed(2)),
          avg_resolution: resolution,
          freeze_percent: parseFloat(freezePercent.toFixed(2))
        };

        console.log('📊 Analysis complete:', analysisData);

        // Send to backend
        try {
          const response = await axios.post('http://localhost:5000/api/videos/add', analysisData);
          setAnalysisResult({ ...analysisData, success: true });
          console.log('✅ Results sent to backend:', response.data);
        } catch (error) {
          console.error('❌ Failed to send results:', error);
          setAnalysisResult({ ...analysisData, success: false, error: error.message });
        }

        // Cleanup
        video.removeEventListener('play', onPlay);
        video.removeEventListener('playing', onPlaying);
        video.removeEventListener('waiting', onWaiting);
        video.removeEventListener('canplay', onCanPlay);
        video.removeEventListener('timeupdate', onTimeUpdate);
        video.removeEventListener('error', onError);

        setIsAnalyzing(false);
      }, 10000); // 10-second analysis

      // Stop analysis if video ends naturally
      const onEnded = () => {
        clearTimeout(analysisTimeout);
        setIsAnalyzing(false);
      };
      video.addEventListener('ended', onEnded);

    } catch (error) {
      console.error('Analysis failed:', error);
      setIsAnalyzing(false);
    }
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
        setVideoName(file.name.replace(/\.[^/.]+$/, "")); // Remove extension
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const videoURL = URL.createObjectURL(file);
      setVideoUrl(videoURL);
      setVideoName(file.name.replace(/\.[^/.]+$/, "")); // Remove extension
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setVideoUrl(url);
    // Extract name from URL
    if (url) {
      const urlName = url.split('/').pop().split('?')[0].replace(/\.[^/.]+$/, "") || 'Web Video';
      setVideoName(urlName);
    }
  };

  const handleManualTest = () => {
    if (videoUrl && videoName) {
      startAutomaticAnalysis();
    }
  };

  return (
    <div className="group">
      <div className="bg-white/70 backdrop-blur-lg shadow-xl rounded-3xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <span className="text-3xl animate-bounce">🎥</span> 
            Intelligent Video Player
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                isAnalyzing ? 'bg-yellow-500' : analysisResult?.success ? 'bg-green-500' : 'bg-blue-500'
              }`}></div>
              {isAnalyzing ? 'Analyzing...' : analysisResult?.success ? 'Analysis Complete' : 'Ready to analyze'}
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoTest}
                onChange={(e) => setAutoTest(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-600">Auto-analyze on load</span>
            </label>
          </div>
        </div>

        {/* Video Name Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Video Name</label>
          <input
            type="text"
            placeholder="Enter a name for this video test"
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
            value={videoName}
            onChange={(e) => setVideoName(e.target.value)}
          />
        </div>

        {/* URL Input */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="🔗 Enter video URL or drag & drop a video file"
            className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-gray-700 placeholder-gray-400 hover:border-gray-300"
            value={videoUrl}
            onChange={handleUrlChange}
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

        {/* Control Buttons */}
        {videoUrl && (
          <div className="flex gap-4 mb-6">
            <button
              onClick={handleManualTest}
              disabled={isAnalyzing || !videoName}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-xl font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <span>{isAnalyzing ? '🔄' : '🧪'}</span>
              {isAnalyzing ? 'Analyzing...' : 'Run Quality Test'}
            </button>
            
            {analysisResult && (
              <div className={`px-4 py-2 rounded-xl font-medium ${
                analysisResult.success 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {analysisResult.success ? '✅ Sent to Dashboard' : '❌ Failed to save'}
              </div>
            )}
          </div>
        )}

        {/* Analysis Progress */}
        {isAnalyzing && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-800 font-medium">🔬 Analyzing Video Quality</span>
              <span className="text-blue-600 text-sm">10s analysis</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: `${(metrics.currentTime / 10) * 100}%`}}></div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-blue-700">
              <div>Startup Time: {metrics.startTime ? `${metrics.startTime}s` : 'Measuring...'}</div>
              <div>Buffering Events: {metrics.bufferingEvents}</div>
            </div>
          </div>
        )}

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
              ref={videoRef}
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

        {/* Quick Analysis Results */}
        {analysisResult && (
          <div className="mt-6 bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 mb-3">📊 Quick Results</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{analysisResult.startup_time}s</div>
                <div className="text-gray-600">Startup Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{analysisResult.buffering_count}</div>
                <div className="text-gray-600">Buffering Events</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{analysisResult.freeze_percent}%</div>
                <div className="text-gray-600">Freeze Detected</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{analysisResult.avg_resolution}</div>
                <div className="text-gray-600">Resolution</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedVideoPlayer;
