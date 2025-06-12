import React, { useState } from 'react';
import { 
  BarChart3, 
  Shield, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Download,
  Eye,
  Server,
  Globe,
  Zap,
  Database,
  Activity,
  Network,
  Lock,
  Users
} from 'lucide-react';
import { TestResult } from '../types';

interface ResultsDisplayProps {
  testResult: TestResult;
  onExportReport: (format: 'json' | 'pdf' | 'html') => void;
}

export function ResultsDisplay({ testResult, onExportReport }: ResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'network' | 'api' | 'assets' | 'security' | 'recommendations'>('overview');

  if (testResult.status !== 'completed') {
    return null;
  }

  const { performance, recommendations } = testResult;
  
  // Safely handle security object that might be undefined
  const security = testResult.security || {
    headers: [],
    tokenExposure: [],
    openEndpoints: [],
    sslAnalysis: {
      valid: false,
      grade: 'N/A',
      protocol: 'Unknown',
      cipher: 'Unknown',
      issues: ['Security analysis not available']
    }
  };

  // Safely handle other potentially undefined objects
  const networkRequests = testResult.networkRequests || [];
  const apiCalls = testResult.apiCalls || [];
  const assets = testResult.assets || {
    totalSize: 0,
    compressedSize: 0,
    unoptimizedAssets: [],
    largestAssets: [],
    cacheableAssets: []
  };
  const authentication = testResult.authentication || {
    method: 'Unknown',
    tokenLocation: 'unknown' as const,
    tokenName: 'Unknown',
    tokenValue: '',
    injectionSuccess: false,
    memberstackDetected: false,
    gatedContentLoaded: false,
    redirectsHandled: 0
  };

  const getPerformanceGrade = (score: number) => {
    if (score >= 90) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 80) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 70) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (score >= 60) return { grade: 'D', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { grade: 'F', color: 'text-red-600', bg: 'bg-red-100' };
  };

  // Calculate performance scores safely
  const performanceScore = performance?.coreWebVitals?.lcp ? 
    Math.max(0, 100 - (performance.coreWebVitals.lcp / 50)) : 75;
  const performanceGrade = getPerformanceGrade(performanceScore);

  const securityScore = security.headers.length > 0 ? 
    Math.round((security.headers.filter(h => h.present).length / security.headers.length) * 100) : 0;
  const securityGrade = getPerformanceGrade(securityScore);

  const apiScore = performance?.apiMetrics?.averageResponseTime ? 
    Math.max(0, 100 - (performance.apiMetrics.averageResponseTime / 10)) : 85;
  const apiGrade = getPerformanceGrade(apiScore);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Authenticated Performance Results</h2>
            <p className="text-gray-600">
              Completed in {Math.round(testResult.duration / 1000)}s • {testResult.timestamp.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Target: {testResult.configuration.targetUrl}
            </p>
          </div>
          <div className="flex gap-3">
            {['json', 'pdf', 'html'].map((format) => (
              <button
                key={format}
                onClick={() => onExportReport(format as any)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                {format.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Performance Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-8">
          <div className={`${performanceGrade.bg} rounded-xl p-6`}>
            <div className="flex items-center justify-between mb-3">
              <Zap className={`w-6 h-6 ${performanceGrade.color}`} />
              <span className={`text-2xl font-bold ${performanceGrade.color}`}>
                {performanceGrade.grade}
              </span>
            </div>
            <h3 className="font-semibold text-gray-800">Overall</h3>
            <p className="text-sm text-gray-600">{Math.round(performanceScore)}/100</p>
          </div>

          <div className={`${apiGrade.bg} rounded-xl p-6`}>
            <div className="flex items-center justify-between mb-3">
              <Database className={`w-6 h-6 ${apiGrade.color}`} />
              <span className={`text-2xl font-bold ${apiGrade.color}`}>
                {apiGrade.grade}
              </span>
            </div>
            <h3 className="font-semibold text-gray-800">API Performance</h3>
            <p className="text-sm text-gray-600">
              {Math.round(performance?.apiMetrics?.averageResponseTime || 0)}ms avg
            </p>
          </div>

          <div className={`${securityGrade.bg} rounded-xl p-6`}>
            <div className="flex items-center justify-between mb-3">
              <Shield className={`w-6 h-6 ${securityGrade.color}`} />
              <span className={`text-2xl font-bold ${securityGrade.color}`}>
                {securityGrade.grade}
              </span>
            </div>
            <h3 className="font-semibold text-gray-800">Security</h3>
            <p className="text-sm text-gray-600">{securityScore}/100</p>
          </div>

          <div className="bg-blue-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <Clock className="w-6 h-6 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">
                {Math.round(performance?.coreWebVitals?.lcp || 0)}ms
              </span>
            </div>
            <h3 className="font-semibold text-gray-800">LCP</h3>
            <p className="text-sm text-gray-600">Largest Contentful Paint</p>
          </div>

          <div className="bg-purple-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <Users className="w-6 h-6 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">
                {authentication.memberstackDetected ? 'Yes' : 'No'}
              </span>
            </div>
            <h3 className="font-semibold text-gray-800">Memberstack</h3>
            <p className="text-sm text-gray-600">Detected</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: Eye },
              { id: 'performance', label: 'Performance', icon: BarChart3 },
              { id: 'network', label: 'Network', icon: Network },
              { id: 'api', label: 'API Calls', icon: Database },
              { id: 'assets', label: 'Assets', icon: Globe },
              { id: 'security', label: 'Security', icon: Shield },
              { id: 'recommendations', label: 'Recommendations', icon: TrendingUp }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Authentication Status */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6">Authentication Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className={`rounded-xl p-6 ${
                    authentication.injectionSuccess ? 'bg-green-50' : 'bg-red-50'
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      {authentication.injectionSuccess ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                      )}
                      <h4 className="font-semibold text-gray-800">Token Injection</h4>
                    </div>
                    <p className="text-lg font-bold">
                      {authentication.injectionSuccess ? 'Success' : 'Failed'}
                    </p>
                    <p className="text-sm text-gray-600">Method: {authentication.method}</p>
                  </div>

                  <div className={`rounded-xl p-6 ${
                    authentication.memberstackDetected ? 'bg-blue-50' : 'bg-yellow-50'
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      <Shield className={`w-6 h-6 ${
                        authentication.memberstackDetected ? 'text-blue-500' : 'text-yellow-500'
                      }`} />
                      <h4 className="font-semibold text-gray-800">Memberstack</h4>
                    </div>
                    <p className="text-lg font-bold">
                      {authentication.memberstackDetected ? 'Detected' : 'Not Found'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Load time: {Math.round(performance?.loadingMetrics?.memberstackReady || 0)}ms
                    </p>
                  </div>

                  <div className={`rounded-xl p-6 ${
                    authentication.gatedContentLoaded ? 'bg-green-50' : 'bg-orange-50'
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      <Lock className={`w-6 h-6 ${
                        authentication.gatedContentLoaded ? 'text-green-500' : 'text-orange-500'
                      }`} />
                      <h4 className="font-semibold text-gray-800">Gated Content</h4>
                    </div>
                    <p className="text-lg font-bold">
                      {authentication.gatedContentLoaded ? 'Loaded' : 'Not Loaded'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Visible: {Math.round(performance?.loadingMetrics?.gatedContentVisible || 0)}ms
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Activity className="w-6 h-6 text-gray-500" />
                      <h4 className="font-semibold text-gray-800">Redirects</h4>
                    </div>
                    <p className="text-lg font-bold">{authentication.redirectsHandled}</p>
                    <p className="text-sm text-gray-600">Handled during auth</p>
                  </div>
                </div>
              </div>

              {/* Core Web Vitals */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6">Core Web Vitals</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  {[
                    { 
                      label: 'TTFB', 
                      value: performance?.coreWebVitals?.ttfb || 0, 
                      unit: 'ms', 
                      threshold: 400,
                      description: 'Time to First Byte'
                    },
                    { 
                      label: 'FCP', 
                      value: performance?.coreWebVitals?.fcp || 0, 
                      unit: 'ms', 
                      threshold: 1500,
                      description: 'First Contentful Paint'
                    },
                    { 
                      label: 'LCP', 
                      value: performance?.coreWebVitals?.lcp || 0, 
                      unit: 'ms', 
                      threshold: 2500,
                      description: 'Largest Contentful Paint'
                    },
                    { 
                      label: 'FID', 
                      value: performance?.coreWebVitals?.fid || 0, 
                      unit: 'ms', 
                      threshold: 100,
                      description: 'First Input Delay'
                    },
                    { 
                      label: 'CLS', 
                      value: performance?.coreWebVitals?.cls || 0, 
                      unit: '', 
                      threshold: 0.1,
                      description: 'Cumulative Layout Shift'
                    }
                  ].map(({ label, value, unit, threshold, description }) => {
                    const isGood = value <= threshold;
                    return (
                      <div key={label} className={`rounded-xl p-6 ${
                        isGood ? 'bg-green-50' : 'bg-red-50'
                      }`}>
                        <h4 className="font-semibold text-gray-800 mb-2">{label}</h4>
                        <p className={`text-2xl font-bold ${
                          isGood ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {Math.round(value * 100) / 100}{unit}
                        </p>
                        <p className="text-xs text-gray-600">{description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Target: ≤{threshold}{unit}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Stats */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-800 mb-2">Total Requests</h4>
                    <p className="text-2xl font-bold text-blue-600">{networkRequests.length}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-800 mb-2">API Calls</h4>
                    <p className="text-2xl font-bold text-purple-600">{apiCalls.length}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-800 mb-2">Total Size</h4>
                    <p className="text-2xl font-bold text-green-600">
                      {Math.round((assets.totalSize || 0) / 1024)}KB
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-800 mb-2">Failed Requests</h4>
                    <p className="text-2xl font-bold text-orange-600">
                      {networkRequests.filter(req => req.failed).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-8">
              <h3 className="text-xl font-bold text-gray-800">Performance Metrics</h3>
              
              {/* Loading Timeline */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-800 mb-4">Loading Timeline</h4>
                <div className="space-y-3">
                  {[
                    { label: 'First Paint', value: performance?.loadingMetrics?.firstPaint || 0 },
                    { label: 'DOM Content Loaded', value: performance?.loadingMetrics?.domContentLoaded || 0 },
                    { label: 'Memberstack Ready', value: performance?.loadingMetrics?.memberstackReady || 0 },
                    { label: 'Gated Content Visible', value: performance?.loadingMetrics?.gatedContentVisible || 0 },
                    { label: 'Load Complete', value: performance?.loadingMetrics?.loadComplete || 0 }
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span className="font-medium text-gray-800">{label}</span>
                      <span className="font-semibold text-gray-800">{Math.round(value)}ms</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'network' && (
            <div className="space-y-8">
              <h3 className="text-xl font-bold text-gray-800">Network Requests</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">URL</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Duration</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {networkRequests.slice(0, 20).map((request) => (
                      <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-800 max-w-xs truncate" title={request.url}>
                          {new URL(request.url).pathname}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {request.type}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            request.status >= 200 && request.status < 300 ? 'bg-green-100 text-green-800' :
                            request.status >= 400 ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold">
                          <span className={
                            request.duration > 1000 ? 'text-red-600' :
                            request.duration > 500 ? 'text-orange-600' :
                            'text-green-600'
                          }>
                            {Math.round(request.duration)}ms
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {Math.round(request.responseSize / 1024)}KB
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-8">
              <h3 className="text-xl font-bold text-gray-800">API Calls Analysis</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 rounded-xl p-6">
                  <h4 className="font-semibold text-blue-800 mb-2">Total API Calls</h4>
                  <p className="text-3xl font-bold text-blue-600">{apiCalls.length}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-6">
                  <h4 className="font-semibold text-green-800 mb-2">Authenticated</h4>
                  <p className="text-3xl font-bold text-green-600">
                    {apiCalls.filter(api => api.isAuthenticated).length}
                  </p>
                </div>
                <div className="bg-red-50 rounded-xl p-6">
                  <h4 className="font-semibold text-red-800 mb-2">Failed</h4>
                  <p className="text-3xl font-bold text-red-600">
                    {apiCalls.filter(api => api.failed).length}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Endpoint</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Method</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Duration</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Auth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiCalls.map((api) => (
                      <tr key={api.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-800 max-w-xs truncate" title={api.endpoint}>
                          {api.endpoint}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            api.method === 'GET' ? 'bg-green-100 text-green-800' :
                            api.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {api.method}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            api.status >= 200 && api.status < 300 ? 'bg-green-100 text-green-800' :
                            api.status >= 400 ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {api.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold">
                          <span className={
                            api.duration > 500 ? 'text-red-600' :
                            api.duration > 200 ? 'text-orange-600' :
                            'text-green-600'
                          }>
                            {Math.round(api.duration)}ms
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {api.isAuthenticated ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-gray-400" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'assets' && (
            <div className="space-y-8">
              <h3 className="text-xl font-bold text-gray-800">Asset Analysis</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 rounded-xl p-6">
                  <h4 className="font-semibold text-blue-800 mb-2">Total Size</h4>
                  <p className="text-3xl font-bold text-blue-600">
                    {Math.round((assets.totalSize || 0) / 1024)}KB
                  </p>
                </div>
                <div className="bg-green-50 rounded-xl p-6">
                  <h4 className="font-semibold text-green-800 mb-2">Compressed</h4>
                  <p className="text-3xl font-bold text-green-600">
                    {Math.round((assets.compressedSize || 0) / 1024)}KB
                  </p>
                </div>
                <div className="bg-orange-50 rounded-xl p-6">
                  <h4 className="font-semibold text-orange-800 mb-2">Savings</h4>
                  <p className="text-3xl font-bold text-orange-600">
                    {Math.round(((assets.totalSize - assets.compressedSize) / assets.totalSize) * 100) || 0}%
                  </p>
                </div>
              </div>

              {assets.largestAssets && assets.largestAssets.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Largest Assets</h4>
                  <div className="space-y-3">
                    {assets.largestAssets.map((asset, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800 truncate max-w-md" title={asset.url}>
                            {new URL(asset.url).pathname.split('/').pop()}
                          </p>
                          <p className="text-sm text-gray-500 capitalize">{asset.type}</p>
                        </div>
                        <span className="font-semibold text-gray-800">
                          {Math.round(asset.size / 1024)}KB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8">
              {/* Security Headers */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6">Security Headers Audit</h3>
                <div className="space-y-3">
                  {security.headers.length > 0 ? security.headers.map((header, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {header.present ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <AlertTriangle className={`w-5 h-5 ${
                            header.severity === 'critical' ? 'text-red-500' :
                            header.severity === 'high' ? 'text-orange-500' :
                            header.severity === 'medium' ? 'text-yellow-500' : 'text-gray-500'
                          }`} />
                        )}
                        <div>
                          <p className="font-medium text-gray-800">{header.name}</p>
                          <p className="text-sm text-gray-600">{header.recommendation}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          header.present ? 'bg-green-100 text-green-800' : 
                          header.severity === 'critical' ? 'bg-red-100 text-red-800' :
                          header.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                          header.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {header.present ? 'Present' : header.severity}
                        </span>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500">
                      <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No security headers analysis available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* SSL Information */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6">SSL/TLS Configuration</h3>
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    {security.sslAnalysis.valid ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-red-500" />
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-800">SSL Grade: {security.sslAnalysis.grade}</h4>
                      <p className="text-sm text-gray-600">
                        {security.sslAnalysis.valid ? 'Valid SSL certificate' : 'SSL issues detected'}
                      </p>
                    </div>
                  </div>
                  {security.sslAnalysis.issues && security.sslAnalysis.issues.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-800">Issues:</h5>
                      {security.sslAnalysis.issues.map((issue, index) => (
                        <p key={index} className="text-sm text-red-600">• {issue}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Token Exposure */}
              {security.tokenExposure && security.tokenExposure.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Token Exposure Analysis</h3>
                  <div className="space-y-3">
                    {security.tokenExposure.map((exposure, index) => (
                      <div key={index} className={`p-4 rounded-lg border ${
                        exposure.exposed ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
                      }`}>
                        <div className="flex items-center gap-3">
                          {exposure.exposed ? (
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                          <div>
                            <p className="font-medium text-gray-800">{exposure.location}</p>
                            <p className="text-sm text-gray-600">{exposure.details}</p>
                            <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded ${
                              exposure.risk === 'critical' ? 'bg-red-100 text-red-800' :
                              exposure.risk === 'high' ? 'bg-orange-100 text-orange-800' :
                              exposure.risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {exposure.risk} risk
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800">Optimization Recommendations</h3>
              {recommendations && recommendations.length > 0 ? recommendations.map((rec, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        rec.priority === 'critical' ? 'bg-red-100' :
                        rec.priority === 'high' ? 'bg-orange-100' :
                        rec.priority === 'medium' ? 'bg-yellow-100' :
                        'bg-blue-100'
                      }`}>
                        <AlertTriangle className={`w-5 h-5 ${
                          rec.priority === 'critical' ? 'text-red-600' :
                          rec.priority === 'high' ? 'text-orange-600' :
                          rec.priority === 'medium' ? 'text-yellow-600' :
                          'text-blue-600'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{rec.title}</h4>
                        <p className="text-sm text-gray-600 capitalize">
                          {rec.category} • {rec.priority} priority
                          {rec.memberStackSpecific && ' • Memberstack Specific'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-gray-800 mb-1">Issue:</h5>
                      <p className="text-gray-700">{rec.description}</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 mb-1">Solution:</h5>
                      <p className="text-gray-700">{rec.solution}</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 mb-1">Expected Impact:</h5>
                      <p className="text-green-700">{rec.impact}</p>
                    </div>
                    {rec.estimatedImprovement && (
                      <div>
                        <h5 className="font-medium text-gray-800 mb-1">Estimated Improvement:</h5>
                        <p className="text-blue-700">{rec.estimatedImprovement}</p>
                      </div>
                    )}
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No recommendations available</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}