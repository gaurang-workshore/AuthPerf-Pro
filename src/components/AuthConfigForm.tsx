import React, { useState } from 'react';
import { Shield, Key, Cookie, Database, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { TestConfiguration } from '../types';

interface AuthConfigFormProps {
  config: TestConfiguration;
  onChange: (config: TestConfiguration) => void;
}

export function AuthConfigForm({ config, onChange }: AuthConfigFormProps) {
  const [showToken, setShowToken] = useState(false);
  const [tokenValidation, setTokenValidation] = useState<'valid' | 'invalid' | 'unknown'>('unknown');

  const handleAuthMethodChange = (method: TestConfiguration['authMethod']) => {
    onChange({
      ...config,
      authMethod: method,
      tokenName: getDefaultTokenName(method),
      authToken: ''
    });
  };

  const handleTokenChange = (token: string) => {
    onChange({ ...config, authToken: token });
    validateToken(token, config.authMethod);
  };

  const validateToken = (token: string, method: string) => {
    if (!token) {
      setTokenValidation('unknown');
      return;
    }

    // Basic validation based on auth method
    switch (method) {
      case 'memberstack':
        setTokenValidation(token.length > 10 && token.includes('ms_') ? 'valid' : 'invalid');
        break;
      case 'bearer':
        setTokenValidation(token.length > 20 ? 'valid' : 'invalid');
        break;
      case 'cookie':
        setTokenValidation(token.includes('=') && token.length > 5 ? 'valid' : 'invalid');
        break;
      default:
        setTokenValidation(token.length > 5 ? 'valid' : 'invalid');
    }
  };

  const getDefaultTokenName = (method: string): string => {
    switch (method) {
      case 'memberstack': return '_ms-mem';
      case 'cookie': return 'auth_token';
      case 'localStorage': return 'authToken';
      case 'bearer': return 'Authorization';
      default: return 'token';
    }
  };

  const getAuthMethodIcon = (method: string) => {
    switch (method) {
      case 'memberstack': return <Shield className="w-5 h-5" />;
      case 'cookie': return <Cookie className="w-5 h-5" />;
      case 'localStorage': return <Database className="w-5 h-5" />;
      case 'bearer': return <Key className="w-5 h-5" />;
      default: return <Key className="w-5 h-5" />;
    }
  };

  const getTokenValidationIcon = () => {
    switch (tokenValidation) {
      case 'valid': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'invalid': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  const getTokenPlaceholder = (method: string): string => {
    switch (method) {
      case 'memberstack': return 'ms_mem_1234567890abcdef...';
      case 'cookie': return 'session_id=abc123; auth_token=xyz789';
      case 'localStorage': return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
      case 'bearer': return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
      default: return 'Enter your authentication token';
    }
  };

  const getMethodDescription = (method: string): string => {
    switch (method) {
      case 'memberstack': return 'Memberstack authentication token (usually stored in localStorage or cookies)';
      case 'cookie': return 'Cookie-based authentication (format: name=value; name2=value2)';
      case 'localStorage': return 'Token stored in browser localStorage';
      case 'bearer': return 'Bearer token for Authorization header';
      default: return 'Custom authentication method';
    }
  };

  return (
    <div className="space-y-8">
      {/* Authentication Method Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Authentication Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { id: 'memberstack', label: 'Memberstack', recommended: true },
            { id: 'cookie', label: 'Cookie' },
            { id: 'localStorage', label: 'localStorage' },
            { id: 'bearer', label: 'Bearer Token' }
          ].map(({ id, label, recommended }) => (
            <button
              key={id}
              onClick={() => handleAuthMethodChange(id as TestConfiguration['authMethod'])}
              className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                config.authMethod === id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {recommended && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Recommended
                </div>
              )}
              <div className="flex flex-col items-center gap-3">
                {getAuthMethodIcon(id)}
                <span className="font-medium">{label}</span>
              </div>
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-3">
          {getMethodDescription(config.authMethod)}
        </p>
      </div>

      {/* Token Configuration */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Token Name/Key
          </label>
          <input
            type="text"
            value={config.tokenName || ''}
            onChange={(e) => onChange({ ...config, tokenName: e.target.value })}
            placeholder={getDefaultTokenName(config.authMethod)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          <p className="text-xs text-gray-500 mt-1">
            The name of the cookie, localStorage key, or header name
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Authentication Token *
          </label>
          <div className="relative">
            <input
              type={showToken ? 'text' : 'password'}
              value={config.authToken}
              onChange={(e) => handleTokenChange(e.target.value)}
              placeholder={getTokenPlaceholder(config.authMethod)}
              className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              {getTokenValidationIcon()}
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {tokenValidation === 'invalid' && (
            <p className="text-sm text-red-600 mt-1">
              Token format appears invalid for the selected authentication method
            </p>
          )}
          {tokenValidation === 'valid' && (
            <p className="text-sm text-green-600 mt-1">
              Token format looks valid
            </p>
          )}
        </div>
      </div>

      {/* Memberstack-specific options */}
      {config.authMethod === 'memberstack' && (
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Memberstack Integration</h4>
              <div className="space-y-3 text-sm text-blue-700">
                <p>
                  <strong>Finding your Memberstack token:</strong>
                </p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Log into your Webflow site as a member</li>
                  <li>Open browser DevTools (F12)</li>
                  <li>Go to Application → Local Storage or Cookies</li>
                  <li>Look for keys like "_ms-mem" or "memberstack"</li>
                  <li>Copy the token value</li>
                </ol>
                <p className="mt-3">
                  <strong>Note:</strong> The tool will wait for Memberstack scripts to execute and gated content to load before capturing performance data.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Options */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Advanced Options</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Wait for Element (CSS Selector)
            </label>
            <input
              type="text"
              value={config.waitForSelector || ''}
              onChange={(e) => onChange({ ...config, waitForSelector: e.target.value })}
              placeholder=".gated-content, [data-member-content], .dashboard"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional: Wait for specific gated content to appear before completing the test
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="includeScreenshot"
              checked={config.includeScreenshot}
              onChange={(e) => onChange({ ...config, includeScreenshot: e.target.checked })}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="includeScreenshot" className="text-sm font-medium text-gray-700">
              Include screenshot of authenticated page
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}