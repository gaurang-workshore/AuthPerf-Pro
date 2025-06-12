import React from 'react';
import { Clock, Zap, AlertTriangle } from 'lucide-react';
import { WaterfallData, WaterfallEntry } from '../types';

interface WaterfallChartProps {
  waterfallData: WaterfallData;
}

export function WaterfallChart({ waterfallData }: WaterfallChartProps) {
  const maxDuration = Math.max(...waterfallData.timeline.map(entry => entry.startTime + entry.duration));
  
  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'dns': return 'bg-blue-400';
      case 'connect': return 'bg-green-400';
      case 'ssl': return 'bg-yellow-400';
      case 'send': return 'bg-purple-400';
      case 'wait': return 'bg-red-400';
      case 'receive': return 'bg-indigo-400';
      default: return 'bg-gray-400';
    }
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="space-y-8">
      {/* Waterfall Summary */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Request Waterfall Analysis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-6 h-6 text-blue-600" />
              <h4 className="font-semibold text-blue-800">Total Duration</h4>
            </div>
            <p className="text-2xl font-bold text-blue-600">{formatTime(waterfallData.totalDuration)}</p>
          </div>

          <div className="bg-green-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-6 h-6 text-green-600" />
              <h4 className="font-semibold text-green-800">Parallel Requests</h4>
            </div>
            <p className="text-2xl font-bold text-green-600">{waterfallData.parallelRequests}</p>
          </div>

          <div className="bg-orange-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              <h4 className="font-semibold text-orange-800">Blocking Time</h4>
            </div>
            <p className="text-2xl font-bold text-orange-600">{formatTime(waterfallData.blockingTime)}</p>
          </div>

          <div className="bg-purple-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-6 h-6 text-purple-600" />
              <h4 className="font-semibold text-purple-800">Critical Path</h4>
            </div>
            <p className="text-2xl font-bold text-purple-600">{waterfallData.criticalPath.length}</p>
          </div>
        </div>

        {/* Legend */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Request Phases</h4>
          <div className="flex flex-wrap gap-4">
            {[
              { phase: 'dns', label: 'DNS Lookup', color: 'bg-blue-400' },
              { phase: 'connect', label: 'Connection', color: 'bg-green-400' },
              { phase: 'ssl', label: 'SSL Handshake', color: 'bg-yellow-400' },
              { phase: 'send', label: 'Request Sent', color: 'bg-purple-400' },
              { phase: 'wait', label: 'Waiting (TTFB)', color: 'bg-red-400' },
              { phase: 'receive', label: 'Content Download', color: 'bg-indigo-400' }
            ].map(({ phase, label, color }) => (
              <div key={phase} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${color}`}></div>
                <span className="text-sm text-gray-700">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Waterfall Chart */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Request Timeline</h3>
        
        <div className="space-y-3">
          {waterfallData.timeline.map((entry, index) => (
            <div key={entry.id} className="relative">
              {/* Request Info */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600 w-8">{index + 1}</span>
                  <div className="flex items-center gap-2">
                    {entry.blocking && (
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                    )}
                    <span className="font-medium text-gray-800 truncate max-w-xs">
                      {entry.name}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      entry.status >= 200 && entry.status < 300 ? 'text-green-600 bg-green-100' :
                      entry.status >= 400 ? 'text-red-600 bg-red-100' :
                      'text-yellow-600 bg-yellow-100'
                    }`}>
                      {entry.status}
                    </span>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {formatTime(entry.duration)}
                </span>
              </div>

              {/* Timeline Bar */}
              <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                {/* Start offset */}
                <div 
                  className="absolute top-0 left-0 h-full bg-transparent"
                  style={{ width: `${(entry.startTime / maxDuration) * 100}%` }}
                ></div>
                
                {/* Request phases */}
                <div 
                  className="absolute top-0 h-full flex"
                  style={{ 
                    left: `${(entry.startTime / maxDuration) * 100}%`,
                    width: `${(entry.duration / maxDuration) * 100}%`
                  }}
                >
                  {Object.entries(entry.phases).map(([phase, duration]) => (
                    duration > 0 && (
                      <div
                        key={phase}
                        className={`${getPhaseColor(phase)} flex items-center justify-center`}
                        style={{ width: `${(duration / entry.duration) * 100}%` }}
                        title={`${phase}: ${formatTime(duration)}`}
                      >
                        {duration > 50 && (
                          <span className="text-xs text-white font-medium">
                            {formatTime(duration)}
                          </span>
                        )}
                      </div>
                    )
                  ))}
                </div>
              </div>

              {/* Time markers */}
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{formatTime(entry.startTime)}</span>
                <span>{formatTime(entry.startTime + entry.duration)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Time scale */}
        <div className="mt-6 relative h-6 bg-gray-50 rounded">
          <div className="absolute inset-0 flex justify-between items-center px-2">
            <span className="text-xs text-gray-600">0ms</span>
            <span className="text-xs text-gray-600">{formatTime(maxDuration)}</span>
          </div>
        </div>
      </div>

      {/* Critical Path Analysis */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Critical Path Analysis</h3>
        
        <div className="space-y-4">
          {waterfallData.criticalPath.map((requestId, index) => {
            const entry = waterfallData.timeline.find(e => e.id === requestId);
            if (!entry) return null;
            
            return (
              <div key={requestId} className="flex items-center gap-4 p-4 bg-red-50 rounded-lg">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-red-600">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{entry.name}</h4>
                  <p className="text-sm text-gray-600">
                    Blocking request affecting overall load time
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">{formatTime(entry.duration)}</p>
                  <p className="text-xs text-gray-500">Duration</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}