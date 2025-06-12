import React, { useState } from 'react';
import { 
  BarChart3, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Database,
  Zap,
  Shield,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ApiAnalysis, ApiCall, PerformanceGrade } from '../types';

interface ApiAnalysisViewProps {
  apiAnalysis: ApiAnalysis;
  performanceGrade: PerformanceGrade;
}

export function ApiAnalysisView({ apiAnalysis, performanceGrade }: ApiAnalysisViewProps) {
  const [showAllCalls, setShowAllCalls] = useState(false);
  const [sortBy, setSortBy] = useState<'responseTime' | 'endpoint' | 'status'>('responseTime');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-100';
      case 'B': return 'text-blue-600 bg-blue-100';
      case 'C': return 'text-yellow-600 bg-yellow-100';
      case 'D': return 'text-orange-600 bg-orange-100';
      case 'F': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600 bg-green-100';
    if (status >= 300 && status < 400) return 'text-blue-600 bg-blue-100';
    if (status >= 400 && status < 500) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'text-green-600 bg-green-100';
      case 'POST': return 'text-blue-600 bg-blue-100';
      case 'PUT': return 'text-yellow-600 bg-yellow-100';
      case 'DELETE': return 'text-red-600 bg-red-100';
      case 'PATCH': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const sortedCalls = [...apiAnalysis.calls].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'responseTime':
        aValue = a.responseTime;
        bValue = b.responseTime;
        break;
      case 'endpoint':
        aValue = a.endpoint;
        bValue = b.endpoint;
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      default:
        return 0;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const displayedCalls = showAllCalls ? sortedCalls : sortedCalls.slice(0, 10);

  const handleSort = (column: 'responseTime' | 'endpoint' | 'status') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  return (
    <div className="space-y-8">
      {/* Performance Grades */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`rounded-xl p-6 ${getGradeColor(performanceGrade.overall)}`}>
          <div className="flex items-center justify-between mb-3">
            <Activity className="w-6 h-6" />
            <span className="text-3xl font-bold">{performanceGrade.overall}</span>
          </div>
          <h3 className="font-semibold">Overall Grade</h3>
          <p className="text-sm opacity-80">{performanceGrade.score}/100</p>
        </div>

        <div className={`rounded-xl p-6 ${getGradeColor(performanceGrade.api)}`}>
          <div className="flex items-center justify-between mb-3">
            <Database className="w-6 h-6" />
            <span className="text-3xl font-bold">{performanceGrade.api}</span>
          </div>
          <h3 className="font-semibold">API Performance</h3>
          <p className="text-sm opacity-80">{Math.round(apiAnalysis.averageResponseTime)}ms avg</p>
        </div>

        <div className={`rounded-xl p-6 ${getGradeColor(performanceGrade.security)}`}>
          <div className="flex items-center justify-between mb-3">
            <Shield className="w-6 h-6" />
            <span className="text-3xl font-bold">{performanceGrade.security}</span>
          </div>
          <h3 className="font-semibold">Security</h3>
          <p className="text-sm opacity-80">{Math.round((1 - apiAnalysis.failureRate) * 100)}% success</p>
        </div>

        <div className={`rounded-xl p-6 ${getGradeColor(performanceGrade.caching)}`}>
          <div className="flex items-center justify-between mb-3">
            <Zap className="w-6 h-6" />
            <span className="text-3xl font-bold">{performanceGrade.caching}</span>
          </div>
          <h3 className="font-semibold">Caching</h3>
          <p className="text-sm opacity-80">{Math.round(apiAnalysis.cacheHitRatio)}% hit rate</p>
        </div>
      </div>

      {/* API Overview Stats */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">API Call Analysis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{apiAnalysis.totalCalls}</div>
            <div className="text-sm text-gray-600">Total API Calls</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{apiAnalysis.uniqueEndpoints}</div>
            <div className="text-sm text-gray-600">Unique Endpoints</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{Math.round(apiAnalysis.averageResponseTime)}ms</div>
            <div className="text-sm text-gray-600">Average Response</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{Math.round(apiAnalysis.totalDataTransferred / 1024)}KB</div>
            <div className="text-sm text-gray-600">Data Transferred</div>
          </div>
        </div>

        {/* HTTP Methods Distribution */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">HTTP Methods Distribution</h4>
          <div className="flex flex-wrap gap-3">
            {Object.entries(apiAnalysis.methodDistribution).map(([method, count]) => (
              <div key={method} className={`px-4 py-2 rounded-lg ${getMethodColor(method)}`}>
                <span className="font-semibold">{method}</span>
                <span className="ml-2 text-sm opacity-80">({count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fastest vs Slowest */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-green-800">Fastest Endpoint</h4>
            </div>
            <div className="space-y-2">
              <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getMethodColor(apiAnalysis.fastestCall.method)}`}>
                {apiAnalysis.fastestCall.method}
              </div>
              <p className="font-medium text-gray-800">{apiAnalysis.fastestCall.endpoint}</p>
              <p className="text-2xl font-bold text-green-600">{apiAnalysis.fastestCall.responseTime}ms</p>
            </div>
          </div>

          <div className="bg-red-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <h4 className="font-semibold text-red-800">Slowest Endpoint</h4>
            </div>
            <div className="space-y-2">
              <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getMethodColor(apiAnalysis.slowestCall.method)}`}>
                {apiAnalysis.slowestCall.method}
              </div>
              <p className="font-medium text-gray-800">{apiAnalysis.slowestCall.endpoint}</p>
              <p className="text-2xl font-bold text-red-600">{apiAnalysis.slowestCall.responseTime}ms</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed API Calls Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Individual API Calls</h3>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Showing {displayedCalls.length} of {apiAnalysis.calls.length} calls
            </span>
            {apiAnalysis.calls.length > 10 && (
              <button
                onClick={() => setShowAllCalls(!showAllCalls)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showAllCalls ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    View All {apiAnalysis.calls.length} Calls
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Method</th>
                <th 
                  className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('endpoint')}
                >
                  <div className="flex items-center gap-2">
                    Endpoint
                    {getSortIcon('endpoint')}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-2">
                    Status
                    {getSortIcon('status')}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('responseTime')}
                >
                  <div className="flex items-center gap-2">
                    Response Time
                    {getSortIcon('responseTime')}
                  </div>
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">TTFB</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Size</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Cache</th>
              </tr>
            </thead>
            <tbody>
              {displayedCalls.map((call) => (
                <tr key={call.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(call.method)}`}>
                      {call.method}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-800 max-w-xs truncate" title={call.endpoint}>
                    {call.endpoint}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(call.status)}`}>
                      {call.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold">
                    <span className={
                      call.responseTime > 500 ? 'text-red-600' :
                      call.responseTime > 200 ? 'text-orange-600' :
                      'text-green-600'
                    }>
                      {call.responseTime}ms
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{call.ttfb}ms</td>
                  <td className="py-3 px-4 text-gray-600">
                    {Math.round((call.requestSize + call.responseSize) / 1024)}KB
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      call.cacheStatus === 'hit' ? 'text-green-600 bg-green-100' :
                      call.cacheStatus === 'revalidated' ? 'text-yellow-600 bg-yellow-100' :
                      'text-red-600 bg-red-100'
                    }`}>
                      {call.cacheStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {!showAllCalls && apiAnalysis.calls.length > 10 && (
          <div className="mt-6 text-center">
            <button 
              onClick={() => setShowAllCalls(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              View All {apiAnalysis.calls.length} API Calls
            </button>
          </div>
        )}
      </div>
    </div>
  );
}