import React, { useState } from 'react';
import { Play, Settings, Shield, Globe, Clock } from 'lucide-react';
import { TestConfiguration, AuthenticationConfig, TestEnvironment } from '../types';
import { AuthenticationConfig as AuthConfigComponent } from './AuthenticationConfig';

interface ConfigurationFormProps {
  onStartTest: (config: TestConfiguration, authConfig: AuthenticationConfig, environment: TestEnvironment) => void;
  isLoading?: boolean;
}

export function ConfigurationForm({ onStartTest, isLoading = false }: ConfigurationFormProps) {
  const [config, setConfig] = useState<TestConfiguration>({
    targetUrl: '',
    authType: 'form',
    testScope: 'full-site',
    analysisDepth: 'standard',
    outputFormat: 'html'
  });

  const [authConfig, setAuthConfig] = useState<AuthenticationConfig>({
    method: '',
    credentials: {},
    sessionTimeout: 1800,
    renewalBehavior: 'auto',
    failureScenarios: []
  });

  const [environment, setEnvironment] = useState<TestEnvironment>({
    browserClean: true,
    networkThrottling: 'none',
    geolocation: 'US-East',
    deviceEmulation: 'desktop',
    proxyEnabled: false
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'auth' | 'environment'>('basic');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (config.targetUrl && !isLoading) {
      onStartTest(config, authConfig, environment);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Settings className="w-7 h-7" />
          Test Configuration
        </h2>
        <p className="text-blue-100 mt-2">Configure your performance and security test parameters</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          {[
            { id: 'basic', label: 'Basic Setup', icon: Globe },
            { id: 'auth', label: 'Authentication', icon: Shield },
            { id: 'environment', label: 'Environment', icon: Clock }
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
                placeholder="https://example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Authentication Type
                </label>
                <select
                  value={config.authType}
                  onChange={(e) => setConfig(prev => ({ ...prev, authType: e.target.value as any }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="form">Form Authentication</option>
                  <option value="token">Token/API Key</option>
                  <option value="cookie">Cookie-based</option>
                  <option value="oauth">OAuth 2.0</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Test Scope
                </label>
                <select
                  value={config.testScope}
                  onChange={(e) => setConfig(prev => ({ ...prev, testScope: e.target.value as any }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="full-site">Full Site Analysis</option>
                  <option value="single-page">Single Page</option>
                  <option value="api-endpoints">API Endpoints Only</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Analysis Depth
                </label>
                <select
                  value={config.analysisDepth}
                  onChange={(e) => setConfig(prev => ({ ...prev, analysisDepth: e.target.value as any }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="basic">Basic (Core metrics only)</option>
                  <option value="standard">Standard (Recommended)</option>
                  <option value="deep">Deep (Comprehensive analysis)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Report Format
                </label>
                <select
                  value={config.outputFormat}
                  onChange={(e) => setConfig(prev => ({ ...prev, outputFormat: e.target.value as any }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="html">HTML Report</option>
                  <option value="json">JSON Data</option>
                  <option value="pdf">PDF Report</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'auth' && (
          <AuthConfigComponent
            authType={config.authType}
            config={authConfig}
            onChange={setAuthConfig}
          />
        )}

        {activeTab === 'environment' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Network Throttling
                </label>
                <select
                  value={environment.networkThrottling}
                  onChange={(e) => setEnvironment(prev => ({ ...prev, networkThrottling: e.target.value as any }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="none">No Throttling</option>
                  <option value="slow-3g">Slow 3G</option>
                  <option value="fast-3g">Fast 3G</option>
                  <option value="4g">4G</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Geographic Location
                </label>
                <select
                  value={environment.geolocation}
                  onChange={(e) => setEnvironment(prev => ({ ...prev, geolocation: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="US-East">US East</option>
                  <option value="US-West">US West</option>
                  <option value="EU-West">Europe West</option>
                  <option value="Asia-Pacific">Asia Pacific</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Device Emulation
                </label>
                <select
                  value={environment.deviceEmulation}
                  onChange={(e) => setEnvironment(prev => ({ ...prev, deviceEmulation: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="desktop">Desktop</option>
                  <option value="mobile">Mobile</option>
                  <option value="tablet">Tablet</option>
                </select>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={environment.browserClean}
                    onChange={(e) => setEnvironment(prev => ({ ...prev, browserClean: e.target.checked }))}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Clean Browser Instance</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={environment.proxyEnabled}
                    onChange={(e) => setEnvironment(prev => ({ ...prev, proxyEnabled: e.target.checked }))}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Enable Proxy</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={!config.targetUrl || isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Running Test...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Start Performance Test
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}