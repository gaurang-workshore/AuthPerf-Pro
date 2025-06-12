import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Activity, Shield, Zap, Database } from 'lucide-react';
import { TestResult } from '../types';

interface TestExecutionProps {
  testResult: TestResult;
}

export function TestExecution({ testResult }: TestExecutionProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Initializing...');

  const steps = [
    'Launching headless browser',
    'Injecting authentication token',
    'Navigating to target URL',
    'Waiting for Memberstack scripts',
    'Loading gated content',
    'Capturing network requests',
    'Analyzing API calls',
    'Performing security audit',
    'Generating waterfall chart',
    'Compiling recommendations'
  ];

  useEffect(() => {
    if (testResult.status === 'running') {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.min(prev + Math.random() * 12, 95);
          const stepIndex = Math.floor((newProgress / 100) * steps.length);
          setCurrentStep(steps[stepIndex] || steps[steps.length - 1]);
          return newProgress;
        });
      }, 800);

      return () => clearInterval(interval);
    } else if (testResult.status === 'completed') {
      setProgress(100);
      setCurrentStep('Test completed successfully');
    } else if (testResult.status === 'failed') {
      setCurrentStep('Test failed');
    }
  }, [testResult.status]);

  const getStatusIcon = () => {
    switch (testResult.status) {
      case 'running':
        return <Activity className="w-6 h-6 text-blue-500 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'failed':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Clock className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (testResult.status) {
      case 'running':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          {getStatusIcon()}
          <div>
            <h3 className="text-xl font-bold text-gray-800">Authenticated Test Execution</h3>
            <p className="text-gray-600">ID: {testResult.id}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Started</p>
          <p className="font-semibold">{testResult.timestamp.toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-700">{currentStep}</span>
          <span className="text-sm font-semibold text-gray-900">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${getStatusColor()}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Test Configuration Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
        <h4 className="font-semibold text-gray-800 mb-4">Test Configuration</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Target URL</p>
            <p className="font-medium text-gray-800 truncate" title={testResult.configuration.targetUrl}>
              {testResult.configuration.targetUrl}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Auth Method</p>
            <p className="font-medium text-gray-800 capitalize">{testResult.configuration.authMethod}</p>
          </div>
          <div>
            <p className="text-gray-500">Test Scope</p>
            <p className="font-medium text-gray-800 capitalize">
              {testResult.configuration.testScope.replace('-', ' ')}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Screenshot</p>
            <p className="font-medium text-gray-800">
              {testResult.configuration.includeScreenshot ? 'Enabled' : 'Disabled'}
            </p>
          </div>
        </div>
      </div>

      {/* Live Status Cards (if test is running) */}
      {testResult.status === 'running' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <Shield className="w-5 h-5 text-blue-600" />
              <h5 className="font-semibold text-blue-800">Authentication</h5>
            </div>
            <p className="text-sm text-blue-600">
              {progress < 30 ? 'Injecting token...' : 
               progress < 50 ? 'Validating session...' : 
               'Authentication verified'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <Zap className="w-5 h-5 text-purple-600" />
              <h5 className="font-semibold text-purple-800">Page Loading</h5>
            </div>
            <p className="text-sm text-purple-600">
              {progress < 40 ? 'Loading page...' : 
               progress < 70 ? 'Waiting for content...' : 
               'Content loaded'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <Database className="w-5 h-5 text-emerald-600" />
              <h5 className="font-semibold text-emerald-800">Network Analysis</h5>
            </div>
            <p className="text-sm text-emerald-600">
              {progress < 60 ? 'Capturing requests...' : 
               progress < 85 ? 'Analyzing APIs...' : 
               'Analysis complete'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              <Shield className="w-5 h-5 text-orange-600" />
              <h5 className="font-semibold text-orange-800">Security Audit</h5>
            </div>
            <p className="text-sm text-orange-600">
              {progress < 75 ? 'Scanning headers...' : 
               progress < 90 ? 'Checking tokens...' : 
               'Security verified'}
            </p>
          </div>
        </div>
      )}

      {/* Authentication Status (if available) */}
      {testResult.authentication && Object.keys(testResult.authentication).length > 0 && (
        <div className="mt-6 bg-gray-50 rounded-xl p-6">
          <h4 className="font-semibold text-gray-800 mb-4">Authentication Status</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              {testResult.authentication.injectionSuccess ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-gray-700">
                Token Injection: {testResult.authentication.injectionSuccess ? 'Success' : 'Failed'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {testResult.authentication.memberstackDetected ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-yellow-500" />
              )}
              <span className="text-gray-700">
                Memberstack: {testResult.authentication.memberstackDetected ? 'Detected' : 'Not Found'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {testResult.authentication.gatedContentLoaded ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <Clock className="w-4 h-4 text-blue-500" />
              )}
              <span className="text-gray-700">
                Gated Content: {testResult.authentication.gatedContentLoaded ? 'Loaded' : 'Loading...'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Error Message (if failed) */}
      {testResult.status === 'failed' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <h5 className="font-semibold text-red-800">Test Failed</h5>
          </div>
          <p className="text-sm text-red-600">
            The authenticated test encountered an error. This could be due to invalid authentication tokens, 
            network issues, or the target page being inaccessible.
          </p>
        </div>
      )}
    </div>
  );
}