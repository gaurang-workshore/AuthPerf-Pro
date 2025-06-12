import { TestConfiguration, TestResult, PerformanceMetrics, TestEnvironment, ApiCall, ApiAnalysis, WaterfallData, WaterfallEntry, AuthenticationAnalysis, PerformanceGrade } from '../types';

export class PerformanceTestService {
  private static instance: PerformanceTestService;
  private activeTests: Map<string, TestResult> = new Map();

  static getInstance(): PerformanceTestService {
    if (!this.instance) {
      this.instance = new PerformanceTestService();
    }
    return this.instance;
  }

  async startTest(config: TestConfiguration, environment: TestEnvironment): Promise<string> {
    const testId = this.generateTestId();
    const testResult: TestResult = {
      id: testId,
      timestamp: new Date(),
      configuration: config,
      performance: {} as PerformanceMetrics,
      security: {} as any,
      status: 'running',
      duration: 0,
      recommendations: []
    };

    this.activeTests.set(testId, testResult);

    // Start the actual test (simulated for demo)
    this.executeTest(testId, config, environment);

    return testId;
  }

  private async executeTest(testId: string, config: TestConfiguration, environment: TestEnvironment) {
    const startTime = Date.now();
    
    try {
      // Simulate test execution with progressive updates
      await this.simulateTestExecution(testId, config);
      
      const testResult = this.activeTests.get(testId)!;
      testResult.status = 'completed';
      testResult.duration = Date.now() - startTime;
      
      // Generate comprehensive performance data
      testResult.performance = this.generateComprehensivePerformanceData(config);
      testResult.recommendations = this.generateEnhancedRecommendations(testResult.performance);
      
    } catch (error) {
      const testResult = this.activeTests.get(testId)!;
      testResult.status = 'failed';
      testResult.duration = Date.now() - startTime;
    }
  }

  private async simulateTestExecution(testId: string, config: TestConfiguration) {
    const steps = [
      'Initializing test environment',
      'Establishing authentication',
      'Measuring TTFB',
      'Analyzing DOM loading',
      'Collecting resource timing',
      'Testing API endpoints',
      'Running security checks',
      'Generating waterfall analysis',
      'Performing authentication audit',
      'Generating report'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      // Update progress if needed
    }
  }

  private generateComprehensivePerformanceData(config: TestConfiguration): PerformanceMetrics {
    const apiAnalysis = this.generateApiAnalysis(config);
    const waterfallData = this.generateWaterfallData();
    const authenticationAnalysis = this.generateAuthenticationAnalysis();
    const performanceGrade = this.calculatePerformanceGrade(apiAnalysis);

    return {
      ttfb: Math.round(200 + Math.random() * 300),
      domInteractive: Math.round(800 + Math.random() * 500),
      fullPageLoad: Math.round(1500 + Math.random() * 1000),
      resourceWaterfall: this.generateMockResourceTiming(),
      apiResponseTimes: this.generateMockApiTiming(),
      assetSizes: this.generateMockAssetInfo(),
      cacheEffectiveness: Math.round(70 + Math.random() * 25),
      jsExecutionTime: Math.round(300 + Math.random() * 200),
      apiAnalysis,
      waterfallData,
      authenticationAnalysis,
      performanceGrade
    };
  }

  private generateApiAnalysis(config: TestConfiguration): ApiAnalysis {
    const calls = this.generateMockApiCalls(config);
    const methodDistribution = this.calculateMethodDistribution(calls);
    
    return {
      totalCalls: calls.length,
      uniqueEndpoints: new Set(calls.map(c => c.endpoint)).size,
      methodDistribution,
      averageResponseTime: calls.reduce((sum, call) => sum + call.responseTime, 0) / calls.length,
      slowestCall: calls.reduce((slowest, call) => call.responseTime > slowest.responseTime ? call : slowest),
      fastestCall: calls.reduce((fastest, call) => call.responseTime < fastest.responseTime ? call : fastest),
      failureRate: calls.filter(call => call.status >= 400).length / calls.length,
      totalDataTransferred: calls.reduce((sum, call) => sum + call.requestSize + call.responseSize, 0),
      cacheHitRatio: calls.filter(call => call.cacheStatus === 'hit').length / calls.length * 100,
      calls
    };
  }

  private generateMockApiCalls(config: TestConfiguration): ApiCall[] {
    // Base endpoints that would be common to most applications
    const baseEndpoints = [
      '/api/auth/login',
      '/api/auth/refresh',
      '/api/user/profile',
      '/api/dashboard/data',
      '/api/analytics/metrics',
      '/api/notifications',
      '/api/settings',
      '/api/search',
      '/api/upload',
      '/api/export'
    ];

    // Add Airtable-specific endpoints if the target URL suggests it's an Airtable integration
    const airtableEndpoints = [
      '/api/airtable/listRecords',
      '/api/airtable/createRecord',
      '/api/airtable/updateRecord',
      '/api/airtable/deleteRecord',
      '/api/airtable/bases',
      '/api/airtable/tables',
      '/api/airtable/fields',
      '/api/airtable/webhooks',
      '/api/airtable/sync',
      '/api/airtable/batch'
    ];

    // Determine which endpoints to use based on the target URL
    let endpoints = [...baseEndpoints];
    if (config.targetUrl.includes('airtable') || config.targetUrl.includes('attribute-analytics')) {
      endpoints = [...endpoints, ...airtableEndpoints];
    }

    const methods: Array<'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'> = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    const cacheStatuses: Array<'hit' | 'miss' | 'revalidated'> = ['hit', 'miss', 'revalidated'];

    return Array.from({ length: 18 + Math.floor(Math.random() * 12) }, (_, index) => {
      const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
      const method = this.getRealisticMethodForEndpoint(endpoint, methods);
      const startTime = Math.random() * 2000;
      const responseTime = this.getRealisticResponseTimeForEndpoint(endpoint);
      const ttfb = Math.round(responseTime * (0.3 + Math.random() * 0.4));
      const status = this.getRealisticStatusForEndpoint(endpoint, method);
      
      return {
        id: `api_${index}_${Date.now()}`,
        endpoint,
        method,
        startTime,
        endTime: startTime + responseTime,
        responseTime,
        status,
        requestSize: this.getRealisticRequestSize(method, endpoint),
        responseSize: this.getRealisticResponseSize(endpoint, status),
        ttfb,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer token',
          'Cache-Control': this.getRealisticCacheControl(endpoint)
        },
        isBlocking: Math.random() > 0.7,
        dependencies: Math.random() > 0.6 ? [`api_${Math.floor(Math.random() * index)}`] : [],
        cacheStatus: this.getRealisticCacheStatus(endpoint, cacheStatuses)
      };
    });
  }

  private getRealisticMethodForEndpoint(endpoint: string, methods: Array<'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'>): 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' {
    // Determine realistic HTTP methods based on endpoint patterns
    if (endpoint.includes('/list') || endpoint.includes('/search') || endpoint.includes('/profile') || endpoint.includes('/dashboard')) {
      return 'GET';
    }
    if (endpoint.includes('/create') || endpoint.includes('/login') || endpoint.includes('/upload')) {
      return 'POST';
    }
    if (endpoint.includes('/update') || endpoint.includes('/settings')) {
      return Math.random() > 0.5 ? 'PUT' : 'PATCH';
    }
    if (endpoint.includes('/delete')) {
      return 'DELETE';
    }
    
    // Default to weighted random selection
    const weights = { GET: 0.4, POST: 0.3, PUT: 0.15, PATCH: 0.1, DELETE: 0.05 };
    const random = Math.random();
    let cumulative = 0;
    
    for (const [method, weight] of Object.entries(weights)) {
      cumulative += weight;
      if (random <= cumulative) {
        return method as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      }
    }
    
    return 'GET';
  }

  private getRealisticResponseTimeForEndpoint(endpoint: string): number {
    // Different endpoints have different typical response times
    if (endpoint.includes('/airtable/listRecords') || endpoint.includes('/search')) {
      return Math.round(150 + Math.random() * 400); // 150-550ms for data-heavy operations
    }
    if (endpoint.includes('/auth/login') || endpoint.includes('/auth/refresh')) {
      return Math.round(200 + Math.random() * 300); // 200-500ms for auth operations
    }
    if (endpoint.includes('/upload') || endpoint.includes('/export')) {
      return Math.round(500 + Math.random() * 1500); // 500-2000ms for file operations
    }
    if (endpoint.includes('/dashboard') || endpoint.includes('/analytics')) {
      return Math.round(100 + Math.random() * 300); // 100-400ms for dashboard data
    }
    
    // Default response time
    return Math.round(50 + Math.random() * 250); // 50-300ms for general API calls
  }

  private getRealisticStatusForEndpoint(endpoint: string, method: string): number {
    // Most calls should be successful, but some realistic failures
    const random = Math.random();
    
    // Auth endpoints might have more failures
    if (endpoint.includes('/auth/')) {
      if (random > 0.85) return Math.random() > 0.5 ? 401 : 403;
    }
    
    // Delete operations might have not found errors
    if (method === 'DELETE' && random > 0.9) {
      return 404;
    }
    
    // Create operations might have validation errors
    if (method === 'POST' && random > 0.88) {
      return Math.random() > 0.5 ? 400 : 422;
    }
    
    // General server errors (rare)
    if (random > 0.95) {
      return Math.random() > 0.5 ? 500 : 503;
    }
    
    // Success responses
    if (method === 'POST') {
      return Math.random() > 0.3 ? 201 : 200;
    }
    
    return 200;
  }

  private getRealisticRequestSize(method: string, endpoint: string): number {
    if (method === 'GET') {
      return Math.round(100 + Math.random() * 300); // Small request headers
    }
    if (endpoint.includes('/upload')) {
      return Math.round(50000 + Math.random() * 200000); // Large file uploads
    }
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      return Math.round(500 + Math.random() * 5000); // JSON payloads
    }
    
    return Math.round(100 + Math.random() * 500);
  }

  private getRealisticResponseSize(endpoint: string, status: number): number {
    if (status >= 400) {
      return Math.round(200 + Math.random() * 800); // Error responses are smaller
    }
    
    if (endpoint.includes('/listRecords') || endpoint.includes('/search')) {
      return Math.round(5000 + Math.random() * 25000); // Large data responses
    }
    if (endpoint.includes('/export')) {
      return Math.round(10000 + Math.random() * 100000); // Export files
    }
    if (endpoint.includes('/dashboard') || endpoint.includes('/analytics')) {
      return Math.round(2000 + Math.random() * 8000); // Dashboard data
    }
    
    return Math.round(500 + Math.random() * 3000); // General API responses
  }

  private getRealisticCacheControl(endpoint: string): string {
    if (endpoint.includes('/auth/') || endpoint.includes('/upload')) {
      return 'no-cache';
    }
    if (endpoint.includes('/profile') || endpoint.includes('/settings')) {
      return 'max-age=300'; // 5 minutes
    }
    if (endpoint.includes('/dashboard') || endpoint.includes('/analytics')) {
      return 'max-age=60'; // 1 minute
    }
    
    return 'max-age=3600'; // 1 hour default
  }

  private getRealisticCacheStatus(endpoint: string, statuses: Array<'hit' | 'miss' | 'revalidated'>): 'hit' | 'miss' | 'revalidated' {
    // Auth and upload endpoints are rarely cached
    if (endpoint.includes('/auth/') || endpoint.includes('/upload')) {
      return 'miss';
    }
    
    // Static-ish data has better cache hit rates
    if (endpoint.includes('/profile') || endpoint.includes('/settings')) {
      const random = Math.random();
      if (random > 0.7) return 'hit';
      if (random > 0.85) return 'revalidated';
      return 'miss';
    }
    
    // Default cache behavior
    const random = Math.random();
    if (random > 0.6) return 'hit';
    if (random > 0.8) return 'revalidated';
    return 'miss';
  }

  private calculateMethodDistribution(calls: ApiCall[]): Record<string, number> {
    return calls.reduce((dist, call) => {
      dist[call.method] = (dist[call.method] || 0) + 1;
      return dist;
    }, {} as Record<string, number>);
  }

  private generateWaterfallData(): WaterfallData {
    const timeline = this.generateWaterfallTimeline();
    const criticalPath = this.identifyCriticalPath(timeline);
    
    return {
      timeline,
      criticalPath,
      totalDuration: Math.max(...timeline.map(entry => entry.startTime + entry.duration)),
      parallelRequests: timeline.filter(entry => 
        timeline.some(other => 
          other.id !== entry.id && 
          other.startTime < entry.startTime + entry.duration &&
          other.startTime + other.duration > entry.startTime
        )
      ).length,
      blockingTime: timeline.filter(entry => entry.blocking).reduce((sum, entry) => sum + entry.duration, 0)
    };
  }

  private generateWaterfallTimeline(): WaterfallEntry[] {
    const entries = [
      'main.html',
      'app.css',
      'app.js',
      'vendor.js',
      'api/auth',
      'api/user',
      'api/dashboard',
      'api/airtable/listRecords',
      'logo.png',
      'hero.jpg',
      'analytics.js'
    ];

    let currentTime = 0;
    
    return entries.map((name, index) => {
      const isBlocking = Math.random() > 0.7;
      const startTime = isBlocking ? currentTime : currentTime + Math.random() * 200;
      const phases = {
        dns: Math.round(Math.random() * 50),
        connect: Math.round(Math.random() * 100),
        ssl: Math.round(Math.random() * 150),
        send: Math.round(Math.random() * 20),
        wait: Math.round(50 + Math.random() * 200),
        receive: Math.round(20 + Math.random() * 100)
      };
      const duration = Object.values(phases).reduce((sum, phase) => sum + phase, 0);
      
      if (isBlocking) {
        currentTime = startTime + duration;
      }

      return {
        id: `waterfall_${index}`,
        name,
        startTime,
        duration,
        phases,
        status: Math.random() > 0.1 ? 200 : (Math.random() > 0.5 ? 404 : 500),
        type: name.includes('api/') ? 'api' : 'resource',
        blocking: isBlocking
      };
    });
  }

  private identifyCriticalPath(timeline: WaterfallEntry[]): string[] {
    return timeline
      .filter(entry => entry.blocking || entry.duration > 300)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 3)
      .map(entry => entry.id);
  }

  private generateAuthenticationAnalysis(): AuthenticationAnalysis {
    return {
      tokenValidation: {
        status: Math.random() > 0.1 ? 'valid' : (Math.random() > 0.5 ? 'expired' : 'invalid'),
        expiresIn: Math.round(1800 + Math.random() * 5400), // 30-120 minutes
        issuer: 'auth.example.com',
        algorithm: 'RS256'
      },
      sessionManagement: {
        secure: Math.random() > 0.2,
        httpOnly: Math.random() > 0.1,
        sameSite: Math.random() > 0.5 ? 'Strict' : 'Lax',
        duration: Math.round(1800 + Math.random() * 5400),
        renewalAttempts: Math.floor(Math.random() * 3)
      },
      authorizationHeaders: {
        present: Math.random() > 0.05,
        type: 'Bearer',
        format: Math.random() > 0.1 ? 'valid' : 'invalid',
        encryption: 'JWT'
      },
      securityProtocol: {
        version: 'TLS 1.3',
        cipher: 'TLS_AES_256_GCM_SHA384',
        grade: ['A+', 'A', 'A-', 'B', 'C'][Math.floor(Math.random() * 5)],
        vulnerabilities: Math.random() > 0.7 ? ['Weak cipher suite detected'] : []
      },
      failedAttempts: {
        count: Math.floor(Math.random() * 3),
        reasons: ['Invalid credentials', 'Token expired'].slice(0, Math.floor(Math.random() * 2) + 1),
        timestamps: Array.from({ length: Math.floor(Math.random() * 3) }, () => 
          new Date(Date.now() - Math.random() * 86400000)
        )
      }
    };
  }

  private calculatePerformanceGrade(apiAnalysis: ApiAnalysis): PerformanceGrade {
    const apiScore = Math.max(0, 100 - (apiAnalysis.averageResponseTime / 10));
    const securityScore = Math.round((1 - apiAnalysis.failureRate) * 100);
    const cachingScore = Math.round(apiAnalysis.cacheHitRatio);
    const overallScore = Math.round((apiScore + securityScore + cachingScore) / 3);

    const getGrade = (score: number) => {
      if (score >= 90) return 'A';
      if (score >= 80) return 'B';
      if (score >= 70) return 'C';
      if (score >= 60) return 'D';
      return 'F';
    };

    return {
      overall: getGrade(overallScore),
      api: getGrade(apiScore),
      security: getGrade(securityScore),
      caching: getGrade(cachingScore),
      score: overallScore
    };
  }

  private generateMockResourceTiming() {
    const resources = ['main.css', 'app.js', 'vendor.js', 'logo.png', 'hero-image.jpg'];
    return resources.map(name => ({
      name,
      startTime: Math.random() * 1000,
      duration: Math.random() * 500,
      size: Math.round(10000 + Math.random() * 100000),
      type: name.split('.').pop() || 'unknown'
    }));
  }

  private generateMockApiTiming() {
    const endpoints = ['/api/users', '/api/dashboard', '/api/analytics'];
    return endpoints.map(endpoint => ({
      endpoint,
      method: 'GET',
      responseTime: Math.round(50 + Math.random() * 200),
      status: Math.random() > 0.1 ? 200 : 500
    }));
  }

  private generateMockAssetInfo() {
    const assets = [
      { name: 'main.css', size: 45000, type: 'css' },
      { name: 'app.js', size: 120000, type: 'js' },
      { name: 'vendor.js', size: 250000, type: 'js' }
    ];
    return assets.map(asset => ({
      ...asset,
      compressedSize: Math.round(asset.size * (0.3 + Math.random() * 0.4))
    }));
  }

  private generateEnhancedRecommendations(metrics: PerformanceMetrics) {
    const recommendations = [];

    // API Performance Recommendations
    if (metrics.apiAnalysis.averageResponseTime > 200) {
      recommendations.push({
        category: 'api' as const,
        priority: 'high' as const,
        title: 'Optimize API Response Times',
        description: `Average API response time is ${Math.round(metrics.apiAnalysis.averageResponseTime)}ms, which exceeds the recommended 200ms threshold`,
        solution: 'Implement database query optimization, add response caching, and consider API endpoint consolidation',
        impact: 'Could improve overall page load time by 25-40%',
        estimatedImprovement: `Reduce API response time to ~150ms`
      });
    }

    // Caching Recommendations
    if (metrics.apiAnalysis.cacheHitRatio < 60) {
      recommendations.push({
        category: 'caching' as const,
        priority: 'medium' as const,
        title: 'Improve Cache Strategy',
        description: `Cache hit ratio is only ${Math.round(metrics.apiAnalysis.cacheHitRatio)}%, indicating poor cache utilization`,
        solution: 'Implement proper cache headers, use CDN for static assets, and add application-level caching',
        impact: 'Could reduce server load by 40-60% and improve response times',
        estimatedImprovement: `Increase cache hit ratio to 80%+`
      });
    }

    // Authentication Security
    if (metrics.authenticationAnalysis.failedAttempts.count > 0) {
      recommendations.push({
        category: 'security' as const,
        priority: 'high' as const,
        title: 'Address Authentication Issues',
        description: `${metrics.authenticationAnalysis.failedAttempts.count} failed authentication attempts detected`,
        solution: 'Review authentication flow, implement proper error handling, and add rate limiting',
        impact: 'Improved security and user experience',
        estimatedImprovement: 'Reduce authentication failures by 90%'
      });
    }

    // Waterfall Optimization
    if (metrics.waterfallData.blockingTime > 500) {
      recommendations.push({
        category: 'performance' as const,
        priority: 'medium' as const,
        title: 'Reduce Blocking Requests',
        description: `${Math.round(metrics.waterfallData.blockingTime)}ms of blocking time detected in request waterfall`,
        solution: 'Implement async loading, defer non-critical resources, and optimize critical rendering path',
        impact: 'Faster perceived load times and better user experience',
        estimatedImprovement: `Reduce blocking time by 60%`
      });
    }

    // Airtable-specific recommendations
    const airtableCalls = metrics.apiAnalysis.calls.filter(call => call.endpoint.includes('/airtable/'));
    if (airtableCalls.length > 0) {
      const avgAirtableResponseTime = airtableCalls.reduce((sum, call) => sum + call.responseTime, 0) / airtableCalls.length;
      
      if (avgAirtableResponseTime > 300) {
        recommendations.push({
          category: 'api' as const,
          priority: 'medium' as const,
          title: 'Optimize Airtable API Calls',
          description: `Airtable API calls averaging ${Math.round(avgAirtableResponseTime)}ms, which is slower than optimal`,
          solution: 'Implement request batching, add local caching for frequently accessed records, and use Airtable webhooks for real-time updates',
          impact: 'Reduce data loading time and improve user experience',
          estimatedImprovement: `Reduce Airtable response time to ~200ms`
        });
      }
    }

    // General Performance
    if (metrics.ttfb > 400) {
      recommendations.push({
        category: 'performance' as const,
        priority: 'high' as const,
        title: 'Optimize Server Response Time',
        description: 'Time to First Byte is higher than recommended',
        solution: 'Consider using a CDN, optimizing database queries, or upgrading server resources',
        impact: 'Could improve page load time by 20-30%',
        estimatedImprovement: 'Reduce TTFB to under 300ms'
      });
    }

    return recommendations;
  }

  getTestResult(testId: string): TestResult | undefined {
    return this.activeTests.get(testId);
  }

  getAllTests(): TestResult[] {
    return Array.from(this.activeTests.values());
  }

  private generateTestId(): string {
    return `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}