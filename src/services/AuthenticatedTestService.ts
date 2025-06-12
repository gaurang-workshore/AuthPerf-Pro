import { TestConfiguration, TestResult, NetworkRequest, ApiCall, PerformanceMetrics, AuthenticationDetails, AssetAnalysis, SecurityAnalysis, WaterfallData, WaterfallEntry } from '../types';

export class AuthenticatedTestService {
  private static instance: AuthenticatedTestService;
  private activeTests: Map<string, TestResult> = new Map();

  static getInstance(): AuthenticatedTestService {
    if (!this.instance) {
      this.instance = new AuthenticatedTestService();
    }
    return this.instance;
  }

  async startTest(config: TestConfiguration): Promise<string> {
    const testId = this.generateTestId();
    const testResult: TestResult = {
      id: testId,
      timestamp: new Date(),
      configuration: config,
      authentication: {} as AuthenticationDetails,
      performance: {} as PerformanceMetrics,
      networkRequests: [],
      apiCalls: [],
      assets: {} as AssetAnalysis,
      security: {
        headers: [],
        tokenExposure: [],
        openEndpoints: [],
        sslAnalysis: {
          grade: 'F',
          protocol: '',
          cipher: '',
          issues: []
        }
      },
      status: 'running',
      duration: 0,
      recommendations: [],
      waterfallData: {} as WaterfallData
    };

    this.activeTests.set(testId, testResult);
    this.executeAuthenticatedTest(testId, config);
    return testId;
  }

  private async executeAuthenticatedTest(testId: string, config: TestConfiguration) {
    const startTime = Date.now();
    
    try {
      // Simulate headless browser test execution
      await this.simulateHeadlessBrowserTest(testId, config);
      
      const testResult = this.activeTests.get(testId)!;
      testResult.status = 'completed';
      testResult.duration = Date.now() - startTime;
      
    } catch (error) {
      const testResult = this.activeTests.get(testId)!;
      testResult.status = 'failed';
      testResult.duration = Date.now() - startTime;
    }
  }

  private async simulateHeadlessBrowserTest(testId: string, config: TestConfiguration) {
    const testResult = this.activeTests.get(testId)!;
    
    // Step 1: Simulate authentication injection
    await this.simulateAuthenticationInjection(testResult, config);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Step 2: Simulate page navigation with auth
    await this.simulateAuthenticatedPageLoad(testResult, config);
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Step 3: Wait for Memberstack and gated content
    await this.simulateMemberstackExecution(testResult, config);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Step 4: Capture network requests and API calls
    await this.captureNetworkActivity(testResult, config);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Step 5: Analyze assets and security
    await this.performAssetAndSecurityAnalysis(testResult, config);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Step 6: Generate recommendations
    testResult.recommendations = this.generateMemberstackRecommendations(testResult);
  }

  private async simulateAuthenticationInjection(testResult: TestResult, config: TestConfiguration) {
    const authDetails: AuthenticationDetails = {
      method: config.authMethod,
      tokenLocation: this.getTokenLocation(config.authMethod),
      tokenName: config.tokenName || this.getDefaultTokenName(config.authMethod),
      tokenValue: config.authToken,
      injectionSuccess: true,
      memberstackDetected: config.authMethod === 'memberstack' || Math.random() > 0.3,
      gatedContentLoaded: false,
      redirectsHandled: 0
    };

    // Simulate potential auth issues
    if (config.authToken.length < 10) {
      authDetails.injectionSuccess = false;
    }

    testResult.authentication = authDetails;
  }

  private async simulateAuthenticatedPageLoad(testResult: TestResult, config: TestConfiguration) {
    // Simulate handling redirects for unauthenticated users
    if (!testResult.authentication.injectionSuccess) {
      testResult.authentication.redirectsHandled = Math.floor(Math.random() * 3) + 1;
    }

    // Generate realistic performance metrics for authenticated session
    const performance: PerformanceMetrics = {
      coreWebVitals: {
        fcp: Math.round(800 + Math.random() * 1200), // Slower due to auth checks
        lcp: Math.round(1200 + Math.random() * 1800),
        fid: Math.round(50 + Math.random() * 150),
        cls: Math.round((Math.random() * 0.25) * 100) / 100,
        ttfb: Math.round(200 + Math.random() * 400)
      },
      loadingMetrics: {
        domContentLoaded: Math.round(1000 + Math.random() * 800),
        loadComplete: Math.round(2000 + Math.random() * 1500),
        firstPaint: Math.round(600 + Math.random() * 400),
        memberstackReady: Math.round(800 + Math.random() * 600),
        gatedContentVisible: Math.round(1200 + Math.random() * 800)
      },
      resourceMetrics: {
        totalRequests: 0,
        totalSize: 0,
        cachedRequests: 0,
        failedRequests: 0,
        slowestRequest: {} as NetworkRequest,
        largestRequest: {} as NetworkRequest
      },
      apiMetrics: {
        totalApiCalls: 0,
        averageResponseTime: 0,
        slowestApi: {} as ApiCall,
        fastestApi: {} as ApiCall,
        failedApiCalls: 0,
        authenticatedCalls: 0
      }
    };

    testResult.performance = performance;
  }

  private async simulateMemberstackExecution(testResult: TestResult, config: TestConfiguration) {
    if (testResult.authentication.memberstackDetected) {
      // Simulate Memberstack script execution time
      const memberstackLoadTime = Math.round(300 + Math.random() * 500);
      testResult.performance.loadingMetrics.memberstackReady = memberstackLoadTime;
      
      // Simulate gated content becoming visible
      testResult.authentication.gatedContentLoaded = testResult.authentication.injectionSuccess;
      
      if (testResult.authentication.gatedContentLoaded) {
        testResult.performance.loadingMetrics.gatedContentVisible = 
          memberstackLoadTime + Math.round(200 + Math.random() * 400);
      }
    }
  }

  private async captureNetworkActivity(testResult: TestResult, config: TestConfiguration) {
    // Generate realistic network requests for a Webflow + Memberstack site
    const networkRequests = this.generateRealisticNetworkRequests(config);
    const apiCalls = this.extractApiCalls(networkRequests, testResult.authentication);
    
    testResult.networkRequests = networkRequests;
    testResult.apiCalls = apiCalls;
    
    // Update performance metrics
    testResult.performance.resourceMetrics = {
      totalRequests: networkRequests.length,
      totalSize: networkRequests.reduce((sum, req) => sum + req.responseSize, 0),
      cachedRequests: networkRequests.filter(req => req.fromCache).length,
      failedRequests: networkRequests.filter(req => req.failed).length,
      slowestRequest: networkRequests.reduce((slowest, req) => 
        req.duration > slowest.duration ? req : slowest, networkRequests[0]),
      largestRequest: networkRequests.reduce((largest, req) => 
        req.responseSize > largest.responseSize ? req : largest, networkRequests[0])
    };

    testResult.performance.apiMetrics = {
      totalApiCalls: apiCalls.length,
      averageResponseTime: apiCalls.length > 0 ? 
        apiCalls.reduce((sum, api) => sum + api.duration, 0) / apiCalls.length : 0,
      slowestApi: apiCalls.length > 0 ? 
        apiCalls.reduce((slowest, api) => api.duration > slowest.duration ? api : slowest, apiCalls[0]) : {} as ApiCall,
      fastestApi: apiCalls.length > 0 ? 
        apiCalls.reduce((fastest, api) => api.duration < fastest.duration ? api : fastest, apiCalls[0]) : {} as ApiCall,
      failedApiCalls: apiCalls.filter(api => api.failed).length,
      authenticatedCalls: apiCalls.filter(api => api.isAuthenticated).length
    };

    // Generate waterfall data
    testResult.waterfallData = this.generateWaterfallData(networkRequests, testResult.authentication);
  }

  private generateRealisticNetworkRequests(config: TestConfiguration): NetworkRequest[] {
    const requests: NetworkRequest[] = [];
    let currentTime = 0;

    // Main document
    requests.push(this.createNetworkRequest({
      url: config.targetUrl,
      method: 'GET',
      type: 'document',
      startTime: currentTime,
      duration: 300 + Math.random() * 400,
      status: 200,
      size: 15000 + Math.random() * 25000,
      priority: 'VeryHigh'
    }));

    currentTime += 50;

    // Webflow CSS
    requests.push(this.createNetworkRequest({
      url: `${new URL(config.targetUrl).origin}/css/webflow.css`,
      method: 'GET',
      type: 'stylesheet',
      startTime: currentTime,
      duration: 150 + Math.random() * 200,
      status: 200,
      size: 45000 + Math.random() * 35000,
      priority: 'VeryHigh'
    }));

    // Site-specific CSS
    requests.push(this.createNetworkRequest({
      url: `${new URL(config.targetUrl).origin}/css/site.css`,
      method: 'GET',
      type: 'stylesheet',
      startTime: currentTime + 20,
      duration: 100 + Math.random() * 150,
      status: 200,
      size: 25000 + Math.random() * 20000,
      priority: 'High'
    }));

    currentTime += 200;

    // Memberstack script
    if (config.authMethod === 'memberstack') {
      requests.push(this.createNetworkRequest({
        url: 'https://api.memberstack.com/static/memberstack.js',
        method: 'GET',
        type: 'script',
        startTime: currentTime,
        duration: 200 + Math.random() * 300,
        status: 200,
        size: 85000 + Math.random() * 15000,
        priority: 'High',
        isMemberstack: true
      }));

      // Memberstack API calls
      requests.push(this.createNetworkRequest({
        url: 'https://api.memberstack.com/v1/auth/me',
        method: 'GET',
        type: 'xhr',
        startTime: currentTime + 250,
        duration: 150 + Math.random() * 250,
        status: 200,
        size: 2000 + Math.random() * 3000,
        priority: 'High',
        isAuthenticated: true,
        isMemberstack: true
      }));

      requests.push(this.createNetworkRequest({
        url: 'https://api.memberstack.com/v1/members/permissions',
        method: 'GET',
        type: 'xhr',
        startTime: currentTime + 400,
        duration: 100 + Math.random() * 200,
        status: 200,
        size: 1500 + Math.random() * 2000,
        priority: 'Medium',
        isAuthenticated: true,
        isMemberstack: true
      }));
    }

    currentTime += 500;

    // Webflow JavaScript
    requests.push(this.createNetworkRequest({
      url: `${new URL(config.targetUrl).origin}/js/webflow.js`,
      method: 'GET',
      type: 'script',
      startTime: currentTime,
      duration: 180 + Math.random() * 220,
      status: 200,
      size: 95000 + Math.random() * 25000,
      priority: 'Medium'
    }));

    // Custom site JavaScript
    requests.push(this.createNetworkRequest({
      url: `${new URL(config.targetUrl).origin}/js/site.js`,
      method: 'GET',
      type: 'script',
      startTime: currentTime + 50,
      duration: 120 + Math.random() * 180,
      status: 200,
      size: 35000 + Math.random() * 15000,
      priority: 'Medium'
    }));

    currentTime += 300;

    // API calls to your backend
    const apiEndpoints = [
      '/api/user/profile',
      '/api/dashboard/data',
      '/api/courses/enrolled',
      '/api/progress/current',
      '/api/notifications',
      '/api/analytics/track'
    ];

    apiEndpoints.forEach((endpoint, index) => {
      requests.push(this.createNetworkRequest({
        url: `${new URL(config.targetUrl).origin}${endpoint}`,
        method: index < 2 ? 'GET' : (Math.random() > 0.7 ? 'POST' : 'GET'),
        type: 'fetch',
        startTime: currentTime + (index * 100) + Math.random() * 200,
        duration: 150 + Math.random() * 350,
        status: Math.random() > 0.05 ? 200 : (Math.random() > 0.5 ? 401 : 500),
        size: 3000 + Math.random() * 8000,
        priority: 'Medium',
        isAuthenticated: true
      }));
    });

    currentTime += 800;

    // Images and assets
    const imageTypes = ['hero.jpg', 'logo.png', 'course-thumb-1.jpg', 'course-thumb-2.jpg', 'avatar.png'];
    imageTypes.forEach((image, index) => {
      requests.push(this.createNetworkRequest({
        url: `${new URL(config.targetUrl).origin}/images/${image}`,
        method: 'GET',
        type: 'image',
        startTime: currentTime + (index * 50),
        duration: 200 + Math.random() * 400,
        status: 200,
        size: 25000 + Math.random() * 150000,
        priority: 'Low'
      }));
    });

    // Fonts
    requests.push(this.createNetworkRequest({
      url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
      method: 'GET',
      type: 'stylesheet',
      startTime: currentTime + 100,
      duration: 120 + Math.random() * 180,
      status: 200,
      size: 2500 + Math.random() * 1500,
      priority: 'Medium'
    }));

    requests.push(this.createNetworkRequest({
      url: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
      method: 'GET',
      type: 'font',
      startTime: currentTime + 200,
      duration: 150 + Math.random() * 200,
      status: 200,
      size: 45000 + Math.random() * 15000,
      priority: 'Medium'
    }));

    return requests.sort((a, b) => a.startTime - b.startTime);
  }

  private createNetworkRequest(params: {
    url: string;
    method: string;
    type: string;
    startTime: number;
    duration: number;
    status: number;
    size: number;
    priority: string;
    isAuthenticated?: boolean;
    isMemberstack?: boolean;
    isGatedContent?: boolean;
  }): NetworkRequest {
    const timing = this.generateRealisticTiming(params.duration);
    
    return {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      url: params.url,
      method: params.method,
      type: params.type as any,
      startTime: params.startTime,
      endTime: params.startTime + params.duration,
      duration: params.duration,
      status: params.status,
      requestSize: Math.round(500 + Math.random() * 2000),
      responseSize: params.size,
      fromCache: Math.random() > 0.6,
      blocked: Math.random() > 0.9,
      failed: params.status >= 400,
      timing,
      headers: {
        request: this.generateRequestHeaders(params.isAuthenticated),
        response: this.generateResponseHeaders(params.type)
      },
      initiator: params.type === 'document' ? 'navigation' : 'script',
      priority: params.priority
    };
  }

  private generateRealisticTiming(totalDuration: number) {
    const dns = Math.round(Math.random() * 50);
    const connect = Math.round(Math.random() * 100);
    const ssl = Math.round(Math.random() * 150);
    const send = Math.round(Math.random() * 20);
    const remaining = totalDuration - dns - connect - ssl - send;
    const wait = Math.round(remaining * (0.4 + Math.random() * 0.4));
    const receive = remaining - wait;

    return { dns, connect, ssl, send, wait, receive };
  }

  private generateRequestHeaders(isAuthenticated?: boolean): Record<string, string> {
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br'
    };

    if (isAuthenticated) {
      headers['Authorization'] = 'Bearer ms_token_' + Math.random().toString(36).substr(2, 20);
      headers['X-Memberstack-Token'] = 'ms_' + Math.random().toString(36).substr(2, 25);
    }

    return headers;
  }

  private generateResponseHeaders(type: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': this.getContentType(type),
      'Cache-Control': this.getCacheControl(type),
      'Server': 'nginx/1.18.0'
    };

    if (Math.random() > 0.7) {
      headers['X-Frame-Options'] = 'SAMEORIGIN';
    }
    if (Math.random() > 0.6) {
      headers['X-Content-Type-Options'] = 'nosniff';
    }

    return headers;
  }

  private getContentType(type: string): string {
    const types: Record<string, string> = {
      'document': 'text/html; charset=utf-8',
      'stylesheet': 'text/css',
      'script': 'application/javascript',
      'image': 'image/jpeg',
      'font': 'font/woff2',
      'xhr': 'application/json',
      'fetch': 'application/json'
    };
    return types[type] || 'text/plain';
  }

  private getCacheControl(type: string): string {
    const cacheControls: Record<string, string> = {
      'document': 'no-cache',
      'stylesheet': 'max-age=31536000',
      'script': 'max-age=31536000',
      'image': 'max-age=31536000',
      'font': 'max-age=31536000',
      'xhr': 'no-cache',
      'fetch': 'no-cache'
    };
    return cacheControls[type] || 'max-age=3600';
  }

  private extractApiCalls(networkRequests: NetworkRequest[], auth: AuthenticationDetails): ApiCall[] {
    return networkRequests
      .filter(req => req.type === 'xhr' || req.type === 'fetch' || req.url.includes('/api/'))
      .map(req => ({
        ...req,
        endpoint: new URL(req.url).pathname,
        payload: req.method !== 'GET' ? { data: 'sample_payload' } : undefined,
        responseData: req.status === 200 ? { result: 'sample_response' } : undefined,
        isAuthenticated: req.headers.request['Authorization'] !== undefined || req.headers.request['X-Memberstack-Token'] !== undefined,
        tokenUsed: auth.injectionSuccess && (req.headers.request['Authorization'] !== undefined || req.headers.request['X-Memberstack-Token'] !== undefined),
        errorMessage: req.status >= 400 ? `HTTP ${req.status} Error` : undefined
      }));
  }

  private async performAssetAndSecurityAnalysis(testResult: TestResult, config: TestConfiguration) {
    // Asset analysis
    const assets = testResult.networkRequests.filter(req => 
      ['stylesheet', 'script', 'image', 'font'].includes(req.type)
    );

    testResult.assets = {
      totalSize: assets.reduce((sum, asset) => sum + asset.responseSize, 0),
      compressedSize: assets.reduce((sum, asset) => sum + (asset.responseSize * 0.7), 0),
      unoptimizedAssets: assets
        .filter(asset => asset.responseSize > 100000)
        .map(asset => ({
          url: asset.url,
          type: asset.type,
          size: asset.responseSize,
          recommendations: this.getAssetRecommendations(asset)
        })),
      largestAssets: assets
        .sort((a, b) => b.responseSize - a.responseSize)
        .slice(0, 5)
        .map(asset => ({
          url: asset.url,
          type: asset.type,
          size: asset.responseSize
        })),
      cacheableAssets: assets.map(asset => ({
        url: asset.url,
        cacheable: asset.headers.response['Cache-Control'] !== 'no-cache',
        cacheHeaders: Object.keys(asset.headers.response).filter(h => 
          h.toLowerCase().includes('cache') || h.toLowerCase().includes('expires')
        )
      }))
    };

    // Security analysis
    testResult.security = this.performSecurityAnalysis(testResult);
  }

  private getAssetRecommendations(asset: NetworkRequest): string[] {
    const recommendations = [];
    
    if (asset.responseSize > 200000) {
      recommendations.push('Consider compressing or optimizing this large asset');
    }
    if (asset.type === 'image' && asset.responseSize > 100000) {
      recommendations.push('Use WebP format or compress images');
    }
    if (asset.type === 'script' && asset.responseSize > 150000) {
      recommendations.push('Consider code splitting or minification');
    }
    if (!asset.fromCache && asset.headers.response['Cache-Control'] === 'no-cache') {
      recommendations.push('Enable caching for better performance');
    }

    return recommendations;
  }

  private performSecurityAnalysis(testResult: TestResult): SecurityAnalysis {
    const documentRequest = testResult.networkRequests.find(req => req.type === 'document');
    const responseHeaders = documentRequest?.headers.response || {};

    return {
      headers: [
        {
          name: 'Content-Security-Policy',
          present: 'content-security-policy' in responseHeaders,
          value: responseHeaders['content-security-policy'],
          recommendation: 'Implement CSP to prevent XSS attacks',
          severity: 'high'
        },
        {
          name: 'X-Frame-Options',
          present: 'x-frame-options' in responseHeaders,
          value: responseHeaders['x-frame-options'],
          recommendation: 'Prevent clickjacking attacks',
          severity: 'medium'
        },
        {
          name: 'Strict-Transport-Security',
          present: 'strict-transport-security' in responseHeaders,
          value: responseHeaders['strict-transport-security'],
          recommendation: 'Enforce HTTPS connections',
          severity: 'high'
        }
      ],
      tokenExposure: this.analyzeTokenExposure(testResult),
      openEndpoints: this.analyzeOpenEndpoints(testResult),
      sslAnalysis: {
        grade: testResult.configuration.targetUrl.startsWith('https://') ? 'A' : 'F',
        protocol: 'TLS 1.3',
        cipher: 'TLS_AES_256_GCM_SHA384',
        issues: testResult.configuration.targetUrl.startsWith('https://') ? [] : ['Site not using HTTPS']
      }
    };
  }

  private analyzeTokenExposure(testResult: TestResult): SecurityAnalysis['tokenExposure'] {
    const exposures = [];

    // Check if tokens are in URL parameters
    const hasTokenInUrl = testResult.networkRequests.some(req => 
      req.url.includes('token=') || req.url.includes('auth=')
    );
    
    if (hasTokenInUrl) {
      exposures.push({
        location: 'URL Parameters',
        exposed: true,
        risk: 'critical' as const,
        details: 'Authentication tokens found in URL parameters'
      });
    }

    // Check for potential localStorage exposure (simulated)
    if (testResult.authentication.tokenLocation === 'localStorage') {
      exposures.push({
        location: 'localStorage',
        exposed: Math.random() > 0.8,
        risk: 'medium' as const,
        details: 'Tokens stored in localStorage are accessible via JavaScript'
      });
    }

    return exposures;
  }

  private analyzeOpenEndpoints(testResult: TestResult): SecurityAnalysis['openEndpoints'] {
    return testResult.apiCalls.map(api => ({
      url: api.url,
      method: api.method,
      requiresAuth: api.url.includes('/api/'),
      accessible: api.status === 200
    }));
  }

  private generateWaterfallData(networkRequests: NetworkRequest[], auth: AuthenticationDetails): WaterfallData {
    const timeline: WaterfallEntry[] = networkRequests.map(req => ({
      id: req.id,
      name: new URL(req.url).pathname.split('/').pop() || req.url,
      url: req.url,
      type: req.type,
      startTime: req.startTime,
      duration: req.duration,
      phases: req.timing,
      status: req.status,
      size: req.responseSize,
      fromCache: req.fromCache,
      blocking: req.type === 'document' || req.type === 'stylesheet',
      isMemberstack: req.url.includes('memberstack'),
      isGatedContent: req.headers.request['Authorization'] !== undefined
    }));

    const criticalPath = timeline
      .filter(entry => entry.blocking || entry.isMemberstack)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 3)
      .map(entry => entry.id);

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
      blockingTime: timeline.filter(entry => entry.blocking).reduce((sum, entry) => sum + entry.duration, 0),
      memberstackLoadTime: timeline
        .filter(entry => entry.isMemberstack)
        .reduce((sum, entry) => sum + entry.duration, 0)
    };
  }

  private generateMemberstackRecommendations(testResult: TestResult): any[] {
    const recommendations = [];

    // Memberstack-specific recommendations
    if (testResult.authentication.memberstackDetected) {
      if (testResult.waterfallData.memberstackLoadTime > 500) {
        recommendations.push({
          category: 'authentication',
          priority: 'medium',
          title: 'Optimize Memberstack Loading Time',
          description: `Memberstack scripts are taking ${Math.round(testResult.waterfallData.memberstackLoadTime)}ms to load`,
          solution: 'Consider lazy loading Memberstack or implementing async loading patterns',
          impact: 'Faster authentication and gated content display',
          estimatedImprovement: 'Reduce auth load time by 30-40%',
          memberStackSpecific: true
        });
      }

      if (!testResult.authentication.gatedContentLoaded) {
        recommendations.push({
          category: 'authentication',
          priority: 'critical',
          title: 'Gated Content Not Loading',
          description: 'Authentication succeeded but gated content is not visible',
          solution: 'Check Memberstack configuration and ensure proper token injection',
          impact: 'Users can access protected content',
          estimatedImprovement: 'Fix content accessibility issues',
          memberStackSpecific: true
        });
      }
    }

    // API performance recommendations
    if (testResult.performance.apiMetrics.averageResponseTime > 300) {
      recommendations.push({
        category: 'api',
        priority: 'high',
        title: 'Slow API Response Times',
        description: `Average API response time is ${Math.round(testResult.performance.apiMetrics.averageResponseTime)}ms`,
        solution: 'Optimize database queries, implement caching, or use a CDN',
        impact: 'Faster data loading and better user experience',
        estimatedImprovement: 'Reduce API response time by 40-60%'
      });
    }

    // Asset optimization
    if (testResult.assets.unoptimizedAssets.length > 0) {
      recommendations.push({
        category: 'assets',
        priority: 'medium',
        title: 'Large Unoptimized Assets Detected',
        description: `${testResult.assets.unoptimizedAssets.length} large assets found`,
        solution: 'Compress images, minify CSS/JS, and implement lazy loading',
        impact: 'Faster page load times and reduced bandwidth usage',
        estimatedImprovement: 'Reduce total page size by 30-50%'
      });
    }

    // Security recommendations
    const criticalSecurityIssues = testResult.security.headers.filter(h => 
      !h.present && h.severity === 'critical'
    );
    
    if (criticalSecurityIssues.length > 0) {
      recommendations.push({
        category: 'security',
        priority: 'critical',
        title: 'Critical Security Headers Missing',
        description: `${criticalSecurityIssues.length} critical security headers are missing`,
        solution: 'Implement proper security headers in your server configuration',
        impact: 'Improved security against XSS, clickjacking, and other attacks',
        estimatedImprovement: 'Significantly improve security posture'
      });
    }

    return recommendations;
  }

  private getTokenLocation(authMethod: string): 'cookie' | 'localStorage' | 'header' {
    switch (authMethod) {
      case 'memberstack': return Math.random() > 0.5 ? 'localStorage' : 'cookie';
      case 'cookie': return 'cookie';
      case 'localStorage': return 'localStorage';
      case 'bearer': return 'header';
      default: return 'cookie';
    }
  }

  private getDefaultTokenName(authMethod: string): string {
    switch (authMethod) {
      case 'memberstack': return '_ms-mem';
      case 'cookie': return 'auth_token';
      case 'localStorage': return 'authToken';
      case 'bearer': return 'Authorization';
      default: return 'token';
    }
  }

  getTestResult(testId: string): TestResult | undefined {
    return this.activeTests.get(testId);
  }

  private generateTestId(): string {
    return `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}