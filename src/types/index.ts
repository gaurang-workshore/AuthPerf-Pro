export interface TestConfiguration {
  targetUrl: string;
  authMethod: 'memberstack' | 'cookie' | 'localStorage' | 'bearer' | 'custom';
  authToken: string;
  tokenName?: string;
  waitForSelector?: string;
  testScope: 'full-page' | 'api-only' | 'assets-only';
  includeScreenshot: boolean;
  performanceThresholds: {
    ttfb: number;
    fcp: number;
    lcp: number;
    apiResponse: number;
  };
}

export interface AuthenticationDetails {
  method: string;
  tokenLocation: 'cookie' | 'localStorage' | 'header';
  tokenName: string;
  tokenValue: string;
  injectionSuccess: boolean;
  memberstackDetected: boolean;
  gatedContentLoaded: boolean;
  redirectsHandled: number;
}

export interface NetworkRequest {
  id: string;
  url: string;
  method: string;
  type: 'document' | 'stylesheet' | 'script' | 'image' | 'font' | 'xhr' | 'fetch' | 'other';
  startTime: number;
  endTime: number;
  duration: number;
  status: number;
  requestSize: number;
  responseSize: number;
  fromCache: boolean;
  blocked: boolean;
  failed: boolean;
  timing: {
    dns: number;
    connect: number;
    ssl: number;
    send: number;
    wait: number;
    receive: number;
  };
  headers: {
    request: Record<string, string>;
    response: Record<string, string>;
  };
  initiator: string;
  priority: string;
}

export interface ApiCall extends NetworkRequest {
  endpoint: string;
  payload?: any;
  responseData?: any;
  isAuthenticated: boolean;
  tokenUsed: boolean;
  errorMessage?: string;
}

export interface AssetAnalysis {
  totalSize: number;
  compressedSize: number;
  unoptimizedAssets: {
    url: string;
    type: string;
    size: number;
    recommendations: string[];
  }[];
  largestAssets: {
    url: string;
    type: string;
    size: number;
  }[];
  cacheableAssets: {
    url: string;
    cacheable: boolean;
    cacheHeaders: string[];
  }[];
}

export interface SecurityAnalysis {
  headers: {
    name: string;
    present: boolean;
    value?: string;
    recommendation: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }[];
  tokenExposure: {
    location: string;
    exposed: boolean;
    risk: 'low' | 'medium' | 'high' | 'critical';
    details: string;
  }[];
  openEndpoints: {
    url: string;
    method: string;
    requiresAuth: boolean;
    accessible: boolean;
  }[];
  sslAnalysis: {
    grade: string;
    protocol: string;
    cipher: string;
    issues: string[];
  };
}

export interface PerformanceMetrics {
  coreWebVitals: {
    fcp: number; // First Contentful Paint
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
    ttfb: number; // Time to First Byte
  };
  loadingMetrics: {
    domContentLoaded: number;
    loadComplete: number;
    firstPaint: number;
    memberstackReady: number;
    gatedContentVisible: number;
  };
  resourceMetrics: {
    totalRequests: number;
    totalSize: number;
    cachedRequests: number;
    failedRequests: number;
    slowestRequest: NetworkRequest;
    largestRequest: NetworkRequest;
  };
  apiMetrics: {
    totalApiCalls: number;
    averageResponseTime: number;
    slowestApi: ApiCall;
    fastestApi: ApiCall;
    failedApiCalls: number;
    authenticatedCalls: number;
  };
}

export interface TestResult {
  id: string;
  timestamp: Date;
  configuration: TestConfiguration;
  authentication: AuthenticationDetails;
  performance: PerformanceMetrics;
  networkRequests: NetworkRequest[];
  apiCalls: ApiCall[];
  assets: AssetAnalysis;
  security: SecurityAnalysis;
  screenshot?: string;
  status: 'running' | 'completed' | 'failed';
  duration: number;
  recommendations: Recommendation[];
  waterfallData: WaterfallData;
}

export interface Recommendation {
  category: 'performance' | 'security' | 'authentication' | 'assets' | 'api';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  solution: string;
  impact: string;
  estimatedImprovement: string;
  memberStackSpecific?: boolean;
}

export interface WaterfallData {
  timeline: WaterfallEntry[];
  criticalPath: string[];
  totalDuration: number;
  parallelRequests: number;
  blockingTime: number;
  memberstackLoadTime: number;
}

export interface WaterfallEntry {
  id: string;
  name: string;
  url: string;
  type: string;
  startTime: number;
  duration: number;
  phases: {
    dns: number;
    connect: number;
    ssl: number;
    send: number;
    wait: number;
    receive: number;
  };
  status: number;
  size: number;
  fromCache: boolean;
  blocking: boolean;
  isMemberstack: boolean;
  isGatedContent: boolean;
}