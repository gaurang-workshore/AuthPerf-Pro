import React, { useState } from 'react';
import { Play, Globe, Settings, Target, Zap } from 'lucide-react';
import { TestConfiguration } from '../types';
import { AuthConfigForm } from './AuthConfigForm';

interface TestConfigurationFormProps {
  onStartTest: (config: TestConfiguration) => void;
  isLoading?: boolean;
}

export function TestConfigurationForm({ onStartTest, isLoading = false }: TestConfigurationFormProps) {
  const [config, setConfig] = useState<TestConfiguration>({
    targetUrl: '',
    authMethod: 'memberstack',
    authToken: '',
    tokenName: '_ms-mem',
    waitForSelector: '',
    testScope: 'full-page',
    includeScreenshot: true,
    performanceThresholds: {
      ttfb: 400,
      fcp: 1500,
      lcp: 2500,
      apiResponse: 300
    }
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'auth' | 'advanced'>('basic');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (config.targetUrl && config.authToken && !isLoading) {
      onStartTest(config);
    }
  };

  const isFormValid = config.targetUrl && config.authToken;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Target className="w-7 h-7" />
          Authenticated Performance Test
        </h2>
        <p className="text-blue-100 mt-2">
          Test your Memberstack-protected pages with real authentication and comprehensive analysis
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          {[
            { id: 'basic', label: 'Target & Scope', icon: Globe },
            { id: 'auth', label: 'Authentication', icon: Settings },
            { id: 'advanced', label: 'Advanced Options', icon: Zap }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
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

      <form onSubmit={handleSubmit} className="p-8">
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Target URL *
              </label>
              <input
                type="url"
                value={config.targetUrl}
                onChange={(e) => setConfig(prev => ({ ...prev, targetUrl: e.target.value }))}
                placeholder="https://your-site.webflow.io/dashboard"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
              <p className="text-sm text-gray-600 mt-2">
                Enter the URL of a gated/protected page that requires authentication
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Test Scope
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { 
                    id: 'full-page', 
                    label: 'Full Page Analysis', 
                    description: 'Complete performance audit including assets, APIs, and security'
                  },
                  { 
                    id: 'api-only', 
                    label: 'API Focus', 
                    description: 'Focus on API calls and authentication performance'
                  },
                  { 
                    id: 'assets-only', 
                    label: 'Assets Focus', 
                    description: 'Analyze loading performance of images, CSS, and JS'
                  }
                ].map(({ id, label, description }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setConfig(prev => ({ ...prev, testScope: id as any }))}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      config.testScope === id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium mb-2">{label}</div>
                    <div className="text-sm opacity-80">{description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'auth' && (
          <AuthConfigForm config={config} onChange={setConfig} />
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Thresholds</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Time to First Byte (ms)
                  </label>
                  <input
                    type="number"
                    value={config.performanceThresholds.ttfb}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      performanceThresholds: {
                        ...prev.performanceThresholds,
                        ttfb: parseInt(e.target.value) || 400
                      }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    First Contentful Paint (ms)
                  </label>
                  <input
                    type="number"
                    value={config.performanceThresholds.fcp}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      performanceThresholds: {
                        ...prev.performanceThresholds,
                        fcp: parseInt(e.target.value) || 1500
                      }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Largest Contentful Paint (ms)
                  </label>
                  <input
                    type="number"
                    value={config.performanceThresholds.lcp}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      performanceThresholds: {
                        ...prev.performanceThresholds,
                        lcp: parseInt(e.target.value) || 2500
                      }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    API Response Time (ms)
                  </label>
                  <input
                    type="number"
                    value={config.performanceThresholds.apiResponse}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      performanceThresholds: {
                        ...prev.performanceThresholds,
                        apiResponse: parseInt(e.target.value) || 300
                      }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Additional Options</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="includeScreenshot"
                    checked={config.includeScreenshot}
                    onChange={(e) => setConfig(prev => ({ ...prev, includeScreenshot: e.target.checked }))}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="includeScreenshot" className="text-sm font-medium text-gray-700">
                    Capture screenshot of authenticated page
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Running Authenticated Test...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Start Authenticated Performance Test
              </>
            )}
          </button>
          
          {!isFormValid && (
            <p className="text-sm text-red-600 mt-2 text-center">
              Please provide both target URL and authentication token
            </p>
          )}
        </div>
      </form>
    </div>
  );
}