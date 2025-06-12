import { SecurityFindings } from '../types';

export class SecurityAuditService {
  static async performSecurityAudit(url: string, authToken?: string): Promise<SecurityFindings> {
    // Simulate security audit
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      headers: this.auditSecurityHeaders(),
      sslValidation: this.validateSSL(url),
      tokenExposure: this.checkTokenExposure(authToken),
      sessionManagement: this.auditSessionManagement(),
      corsPolicy: this.auditCORSPolicy()
    };
  }

  private static auditSecurityHeaders() {
    const requiredHeaders = [
      {
        header: 'Content-Security-Policy',
        present: Math.random() > 0.3,
        recommendation: 'Implement CSP to prevent XSS attacks',
        severity: 'high' as const
      },
      {
        header: 'X-Frame-Options',
        present: Math.random() > 0.2,
        recommendation: 'Prevent clickjacking attacks',
        severity: 'medium' as const
      },
      {
        header: 'X-Content-Type-Options',
        present: Math.random() > 0.1,
        value: 'nosniff',
        recommendation: 'Prevent MIME type sniffing',
        severity: 'medium' as const
      },
      {
        header: 'Strict-Transport-Security',
        present: Math.random() > 0.4,
        recommendation: 'Enforce HTTPS connections',
        severity: 'high' as const
      },
      {
        header: 'X-XSS-Protection',
        present: Math.random() > 0.2,
        value: '1; mode=block',
        recommendation: 'Enable XSS protection',
        severity: 'medium' as const
      }
    ];

    return requiredHeaders;
  }

  private static validateSSL(url: string) {
    const isHttps = url.startsWith('https://');
    const grades = ['A+', 'A', 'A-', 'B', 'C', 'D', 'F'];
    const grade = grades[Math.floor(Math.random() * (isHttps ? 3 : 7))];
    
    const issues = [];
    if (!isHttps) {
      issues.push('Website not using HTTPS');
    }
    if (grade === 'F') {
      issues.push('SSL certificate expired or invalid');
    }
    if (['C', 'D', 'F'].includes(grade)) {
      issues.push('Weak cipher suites detected');
    }

    return {
      valid: isHttps && grade !== 'F',
      grade,
      issues
    };
  }

  private static checkTokenExposure(authToken?: string) {
    if (!authToken) return [];

    const exposureChecks = [
      {
        location: 'URL Parameters',
        exposed: Math.random() > 0.9,
        type: 'Authentication Token',
        risk: 'critical' as const
      },
      {
        location: 'Local Storage',
        exposed: Math.random() > 0.7,
        type: 'Session Token',
        risk: 'high' as const
      },
      {
        location: 'JavaScript Variables',
        exposed: Math.random() > 0.8,
        type: 'API Key',
        risk: 'medium' as const
      }
    ];

    return exposureChecks.filter(check => check.exposed);
  }

  private static auditSessionManagement() {
    return {
      secure: Math.random() > 0.2,
      httpOnly: Math.random() > 0.3,
      sameSite: Math.random() > 0.5 ? 'Strict' : 'Lax',
      timeout: Math.floor(1800 + Math.random() * 1800) // 30-60 minutes
    };
  }

  private static auditCORSPolicy() {
    const configured = Math.random() > 0.4;
    const issues = [];
    
    if (!configured) {
      issues.push('CORS policy not configured');
    } else if (Math.random() > 0.7) {
      issues.push('Wildcard origin (*) allows all domains');
    }

    return {
      configured,
      allowedOrigins: configured ? ['https://example.com', 'https://app.example.com'] : [],
      issues
    };
  }
}