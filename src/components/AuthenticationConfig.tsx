import React from 'react';
import { Eye, EyeOff, Key, Lock, User, Globe } from 'lucide-react';
import { AuthenticationConfig as AuthConfig } from '../types';

interface AuthenticationConfigProps {
  authType: 'form' | 'token' | 'cookie' | 'oauth';
  config: AuthConfig;
  onChange: (config: AuthConfig) => void;
}

export function AuthenticationConfig({ authType, config, onChange }: AuthenticationConfigProps) {
  const [showPasswords, setShowPasswords] = React.useState<Record<string, boolean>>({});

  const updateCredentials = (key: string, value: string) => {
    onChange({
      ...config,
      credentials: {
        ...config.credentials,
        [key]: value
      }
    });
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const renderFormAuth = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <User className="w-4 h-4 inline mr-2" />
            Username/Email
          </label>
          <input
            type="text"
            value={config.credentials.username || ''}
            onChange={(e) => updateCredentials('username', e.target.value)}
            placeholder="Enter username or email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <Lock className="w-4 h-4 inline mr-2" />
            Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.password ? 'text' : 'password'}
              value={config.credentials.password || ''}
              onChange={(e) => updateCredentials('password', e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('password')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPasswords.password ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Login Endpoint URL
        </label>
        <input
          type="url"
          value={config.credentials.loginEndpoint || ''}
          onChange={(e) => updateCredentials('loginEndpoint', e.target.value)}
          placeholder="https://example.com/api/login"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );

  const renderTokenAuth = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          <Key className="w-4 h-4 inline mr-2" />
          Authentication Token
        </label>
        <div className="relative">
          <input
            type={showPasswords.token ? 'text' : 'password'}
            value={config.credentials.token || ''}
            onChange={(e) => updateCredentials('token', e.target.value)}
            placeholder="Enter your API token or key"
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('token')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPasswords.token ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Token Type
        </label>
        <select
          value={config.credentials.tokenType || 'Bearer'}
          onChange={(e) => updateCredentials('tokenType', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="Bearer">Bearer</option>
          <option value="API-Key">API-Key</option>
          <option value="Token">Token</option>
          <option value="Basic">Basic</option>
        </select>
      </div>
    </div>
  );

  const renderCookieAuth = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Cookie Name
          </label>
          <input
            type="text"
            value={config.credentials.cookieName || ''}
            onChange={(e) => updateCredentials('cookieName', e.target.value)}
            placeholder="session_id"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Cookie Value
          </label>
          <div className="relative">
            <input
              type={showPasswords.cookieValue ? 'text' : 'password'}
              value={config.credentials.cookieValue || ''}
              onChange={(e) => updateCredentials('cookieValue', e.target.value)}
              placeholder="Enter cookie value"
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('cookieValue')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPasswords.cookieValue ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOAuthAuth = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <Globe className="w-4 h-4 inline mr-2" />
            Client ID
          </label>
          <input
            type="text"
            value={config.credentials.clientId || ''}
            onChange={(e) => updateCredentials('clientId', e.target.value)}
            placeholder="Your OAuth client ID"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Client Secret
          </label>
          <div className="relative">
            <input
              type={showPasswords.clientSecret ? 'text' : 'password'}
              value={config.credentials.clientSecret || ''}
              onChange={(e) => updateCredentials('clientSecret', e.target.value)}
              placeholder="Your OAuth client secret"
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('clientSecret')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPasswords.clientSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Scope (optional)
        </label>
        <input
          type="text"
          value={config.credentials.scope || ''}
          onChange={(e) => updateCredentials('scope', e.target.value)}
          placeholder="read write profile"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Authentication Type Specific Fields */}
      {authType === 'form' && renderFormAuth()}
      {authType === 'token' && renderTokenAuth()}
      {authType === 'cookie' && renderCookieAuth()}
      {authType === 'oauth' && renderOAuthAuth()}

      {/* Common Settings */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Session Settings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Session Timeout (seconds)
            </label>
            <input
              type="number"
              value={config.sessionTimeout}
              onChange={(e) => onChange({ ...config, sessionTimeout: parseInt(e.target.value) || 1800 })}
              min="60"
              max="86400"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Renewal Behavior
            </label>
            <select
              value={config.renewalBehavior}
              onChange={(e) => onChange({ ...config, renewalBehavior: e.target.value as 'auto' | 'manual' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="auto">Automatic Renewal</option>
              <option value="manual">Manual Renewal</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}