import React, { useState } from 'react';
import { Shield, BarChart3, Zap, Globe, Activity } from 'lucide-react';
import { TestConfigurationForm } from './components/TestConfigurationForm';
import { TestExecution } from './components/TestExecution';
import { ResultsDisplay } from './components/ResultsDisplay';
import { AuthenticatedTestService } from './services/AuthenticatedTestService';
import { TestConfiguration, TestResult } from './types';

function App() {
  const [currentTest, setCurrentTest] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testService = AuthenticatedTestService.getInstance();

  const handleStartTest = async (config: TestConfiguration) => {
    setIsLoading(true);
    
    try {
      const testId = await testService.startTest(config);
      const testResult = testService.getTestResult(testId);

      if (testResult) {
        setCurrentTest(testResult);
        
        // Poll for test completion
        const pollInterval = setInterval(() => {
          const updatedResult = testService.getTestResult(testId);
          if (updatedResult) {
            setCurrentTest(updatedResult);
            if (updatedResult.status === 'completed' || updatedResult.status === 'failed') {
              clearInterval(pollInterval);
              setIsLoading(false);
            }
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Test failed:', error);
      setIsLoading(false);
      alert('Test failed to start. Please check your configuration.');
    }
  };

  const handleExportReport = (format: 'json' | 'pdf' | 'html') => {
    if (!currentTest) return;

    const data = {
      testId: currentTest.id,
      timestamp: currentTest.timestamp,
      configuration: currentTest.configuration,
      authentication: currentTest.authentication,
      performance: currentTest.performance,
      networkRequests: currentTest.networkRequests,
      apiCalls: currentTest.apiCalls,
      assets: currentTest.assets,
      security: currentTest.security,
      recommendations: currentTest.recommendations,
      waterfallData: currentTest.waterfallData,
      summary: {
        totalRequests: currentTest.networkRequests?.length || 0,
        authenticatedCalls: currentTest.apiCalls?.filter(api => api.isAuthenticated).length || 0,
        averageResponseTime: currentTest.performance?.apiMetrics?.averageResponseTime || 0,
        securityScore: currentTest.security?.headers?.filter(h => h.present).length || 0,
        duration: currentTest.duration
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `authenticated-performance-test-${currentTest.id}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleNewTest = () => {
    setCurrentTest(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-3 rounded-xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">AuthPerf Pro</h1>
                <p className="text-gray-600">Authenticated Performance Testing for Memberstack & Webflow</p>
              </div>
            </div>
            {currentTest && (
              <button
                onClick={handleNewTest}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-200"
              >
                New Test
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!currentTest ? (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Test Your Authenticated Web Applications
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                Comprehensive performance testing for Memberstack-protected pages with real authentication, 
                detailed network analysis, and security auditing. See what your users actually experience.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
                <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Memberstack Integration</h3>
                <p className="text-gray-600">
                  Native support for Memberstack authentication with automatic token injection and gated content detection.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
                <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Activity className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Real Browser Testing</h3>
                <p className="text-gray-600">
                  Headless browser simulation that captures actual network requests, API calls, and loading behavior.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
                <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Comprehensive Analysis</h3>
                <p className="text-gray-600">
                  Detailed waterfall charts, API performance metrics, asset optimization, and security auditing.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
                <div className="bg-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Actionable Insights</h3>
                <p className="text-gray-600">
                  Specific recommendations for Webflow sites, Memberstack optimization, and performance improvements.
                </p>
              </div>
            </div>

            {/* Key Benefits */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Why AuthPerf Pro?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">Traditional Tools Fall Short</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Get redirected to login pages
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Can't simulate authenticated sessions
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Miss API call latency and token routing
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Don't show the real user experience
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">AuthPerf Pro Delivers</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Injects auth tokens before page load
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Waits for Memberstack and gated content
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Captures all authenticated API calls
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Shows what authenticated users see
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Configuration Form */}
            <TestConfigurationForm 
              onStartTest={handleStartTest}
              isLoading={isLoading}
            />
          </>
        ) : (
          <div className="space-y-8">
            {/* Test Execution */}
            <TestExecution testResult={currentTest} />
            
            {/* Results Display */}
            {currentTest.status === 'completed' && (
              <ResultsDisplay 
                testResult={currentTest}
                onExportReport={handleExportReport}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>© 2025 AuthPerf Pro. Specialized performance testing for authenticated web applications.</p>
            <p className="text-sm mt-2">Built for Memberstack, Webflow, and modern authentication systems.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;