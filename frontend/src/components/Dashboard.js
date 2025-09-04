import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const socket = io("http://localhost:5000");

export default function Dashboard() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('startup_time');
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Fetch initial data with loading state
    fetch("http://localhost:5000/api/videos")
      .then(res => res.json())
      .then(data => {
        setResults(data);
        setIsLoading(false);
        setTimeout(() => setAnimate(true), 100);
      })
      .catch(err => {
        console.error('Failed to fetch data:', err);
        setIsLoading(false);
      });

    // Listen for real-time updates with animation
    socket.on("new_result", (newResult) => {
      setResults((prev) => [newResult, ...prev]);
      setAnimate(false);
      setTimeout(() => setAnimate(true), 50);
    });

    return () => {
      socket.off("new_result");
    };
  }, []);

  // Calculate summary statistics
  const summaryStats = {
    totalTests: results.length,
    avgStartupTime: results.length ? (results.reduce((sum, r) => sum + parseFloat(r.startup_time), 0) / results.length).toFixed(2) : 0,
    totalBufferingEvents: results.reduce((sum, r) => sum + parseInt(r.buffering_count), 0),
    avgFreezePercent: results.length ? (results.reduce((sum, r) => sum + parseFloat(r.freeze_percent), 0) / results.length).toFixed(2) : 0
  };

  if (isLoading) {
    return (
      <div className="bg-white/70 backdrop-blur-lg shadow-xl rounded-3xl p-8 border border-white/20">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <div className="text-xl text-gray-600">📄 Loading dashboard data...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Live Status */}
      <div className="bg-white/70 backdrop-blur-lg shadow-xl rounded-3xl p-8 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <span className="text-4xl animate-pulse">📉</span>
            Video Quality Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 font-medium">Live Monitoring</span>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
        
        {/* Summary Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Tests</p>
                <p className="text-3xl font-bold">{summaryStats.totalTests}</p>
              </div>
              <div className="text-4xl opacity-80">🎥</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Avg Startup Time</p>
                <p className="text-3xl font-bold">{summaryStats.avgStartupTime}s</p>
              </div>
              <div className="text-4xl opacity-80">⏱️</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Total Buffering</p>
                <p className="text-3xl font-bold">{summaryStats.totalBufferingEvents}</p>
              </div>
              <div className="text-4xl opacity-80">🔄</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Avg Freeze %</p>
                <p className="text-3xl font-bold">{summaryStats.avgFreezePercent}%</p>
              </div>
              <div className="text-4xl opacity-80">❄️</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Startup Time Chart */}
        <div className={`bg-white/70 backdrop-blur-lg shadow-xl rounded-3xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-500 ${animate ? 'animate-slide-up' : ''}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">⏱️</span>
              Startup Time Analysis
            </h3>
            <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              Trending
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={results.slice().reverse()}>
              <defs>
                <linearGradient id="startupGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="video_name" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="startup_time" 
                stroke="#3B82F6" 
                fill="url(#startupGradient)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Buffering Analysis */}
        <div className={`bg-white/70 backdrop-blur-lg shadow-xl rounded-3xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-500 ${animate ? 'animate-slide-up' : ''}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">🔄</span>
              Buffering Events
            </h3>
            <div className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
              Performance
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={results.slice().reverse()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="video_name" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }}
              />
              <Bar 
                dataKey="buffering_count" 
                fill="url(#bufferingGradient)"
                radius={[8, 8, 0, 0]}
              >
                <defs>
                  <linearGradient id="bufferingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Freeze Analysis - Full Width */}
      <div className={`bg-white/70 backdrop-blur-lg shadow-xl rounded-3xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-500 ${animate ? 'animate-slide-up' : ''}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">❄️</span>
            Freeze Detection Analysis
          </h3>
          <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            AI Powered
          </div>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={results.slice().reverse()}>
            <defs>
              <linearGradient id="freezeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#EC4899" stopOpacity={0.8}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="video_name" stroke="#6B7280" fontSize={12} />
            <YAxis stroke="#6B7280" fontSize={12} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="freeze_percent" 
              stroke="url(#freezeGradient)"
              strokeWidth={4}
              dot={{ fill: '#8B5CF6', r: 6 }}
              activeDot={{ r: 8, fill: '#EC4899' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Modern Data Table */}
      <div className="bg-white/70 backdrop-blur-lg shadow-xl rounded-3xl border border-white/20 overflow-hidden">
        <div className="p-8 pb-0">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
            <span className="text-2xl">📄</span>
            Detailed Test Results
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Video Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Startup Time</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buffering</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resolution</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Freeze %</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {results.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">{row.video_name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-900">{row.startup_time}s</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        parseFloat(row.startup_time) < 2 ? 'bg-green-100 text-green-800' :
                        parseFloat(row.startup_time) < 4 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {parseFloat(row.startup_time) < 2 ? 'Fast' :
                         parseFloat(row.startup_time) < 4 ? 'Moderate' : 'Slow'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.buffering_count} events ({row.buffering_duration}s)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      row.avg_resolution === '1080p' ? 'bg-blue-100 text-blue-800' :
                      row.avg_resolution === '720p' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {row.avg_resolution}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900">{row.freeze_percent}%</span>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            parseFloat(row.freeze_percent) < 1 ? 'bg-green-400' :
                            parseFloat(row.freeze_percent) < 5 ? 'bg-yellow-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${Math.min(parseFloat(row.freeze_percent) * 10, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {results.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-50">📈</div>
            <p className="text-gray-500 text-lg">No test results yet</p>
            <p className="text-gray-400 text-sm">Run some video tests to see analytics here</p>
          </div>
        )}
      </div>
    </div>
  );
}
