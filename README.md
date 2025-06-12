# AuthPerf Pro 🚀

> Comprehensive performance testing for authenticated web applications with native Memberstack support

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)

## 📖 Overview

AuthPerf Pro is a specialized performance testing tool designed for modern web applications that use authentication systems. Unlike traditional performance testing tools that only test public pages, AuthPerf Pro can authenticate with your application and test the actual user experience behind login walls.

### 🎯 Key Features

- **🔐 Memberstack Integration** - Native support for Memberstack authentication with automatic token detection
- **🌐 Real Browser Testing** - Headless browser simulation capturing actual network behavior
- **📊 Comprehensive Analysis** - Detailed performance metrics, waterfall charts, and API analysis
- **🛡️ Security Auditing** - Automated security header validation and vulnerability detection
- **⚡ Core Web Vitals** - LCP, FID, CLS, and TTFB measurements for authenticated pages
- **🔍 Network Monitoring** - Complete request/response analysis with authentication context
- **📈 Asset Optimization** - Identify unoptimized resources and caching opportunities
- **📋 Detailed Reports** - Export comprehensive reports in JSON, PDF, or HTML formats

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Modern web browser

### Installation

```bash
# Clone the repository
git clone https://github.com/gaurang-workshore/AuthPerf-Pro.git

# Navigate to project directory
cd AuthPerf-Pro

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the application.

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

### Project Structure

```
src/
├── components/          # React components
│   ├── ResultsDisplay.tsx
│   ├── TestExecution.tsx
│   └── TestConfigurationForm.tsx
├── services/           # Business logic
│   ├── PerformanceTestService.ts
│   └── AuthenticatedTestService.ts
├── types/              # TypeScript definitions
│   └── index.ts
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

## 🎮 Usage

### Basic Performance Test

1. **Configure Test Settings**
   - Enter the URL of your authenticated application
   - Select authentication method (Cookie, Header, or Memberstack)
   - Provide authentication credentials

2. **Authentication Setup**
   ```javascript
   // Cookie Authentication
   {
     method: 'cookie',
     tokenName: 'session_token',
     tokenValue: 'your-session-token'
   }

   // Header Authentication  
   {
     method: 'header',
     tokenName: 'Authorization',
     tokenValue: 'Bearer your-jwt-token'
   }

   // Memberstack (Automatic)
   {
     method: 'memberstack',
     memberstackId: 'your-memberstack-id'
   }
   ```

3. **Run Test**
   - Click "Start Test" to begin analysis
   - Monitor real-time progress
   - Review comprehensive results

### Advanced Configuration

```typescript
interface TestConfiguration {
  url: string;
  authentication: {
    method: 'cookie' | 'header' | 'memberstack';
    tokenLocation: 'cookie' | 'header' | 'localStorage';
    tokenName: string;
    tokenValue: string;
  };
  options: {
    timeout: number;
    captureScreenshot: boolean;
    analyzeSecurityHeaders: boolean;
    detectGatedContent: boolean;
    performDeepApiAnalysis: boolean;
  };
}
```

## 📊 What Gets Tested

### Performance Metrics
- **Core Web Vitals**: LCP, FID, CLS, TTFB
- **Loading Metrics**: DOM load, complete load, first paint
- **Resource Analysis**: Size, compression, caching effectiveness
- **JavaScript Execution**: Parse and execution times

### Authentication Analysis
- Token injection success/failure
- Memberstack detection and load time
- Gated content accessibility
- Authentication redirect handling

### Security Assessment
- Security headers validation
- Token exposure detection
- SSL/TLS configuration analysis
- Open endpoint identification

### Network Analysis
- Request/response waterfall
- API endpoint performance
- Authentication header presence
- Caching effectiveness

## 🔐 Supported Authentication Methods

### Memberstack
- Automatic detection and integration
- Token extraction and injection
- Gated content identification
- Member-specific performance metrics

### Cookie-based Authentication
- Session cookie injection
- Multi-domain cookie support
- Secure cookie handling

### Header-based Authentication
- JWT token support
- Custom header authentication
- Bearer token handling

### Custom Authentication
- Flexible token configuration
- Multiple authentication methods
- Custom header support

## 📈 Performance Reports

### Metrics Included
- **Performance Score**: Overall grade (A-F)
- **Load Times**: Complete breakdown of loading phases
- **Network Requests**: Detailed analysis of all requests
- **API Performance**: Response times and success rates
- **Asset Analysis**: Size, optimization opportunities
- **Security Score**: Header compliance and vulnerabilities

### Export Formats
- **JSON**: Raw data for further analysis
- **PDF**: Professional reports for stakeholders
- **HTML**: Interactive reports with charts

## 🛠️ Technical Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Linting**: ESLint with TypeScript support
- **Browser Testing**: Headless Chrome simulation

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_APP_NAME=AuthPerf Pro
VITE_DEFAULT_TIMEOUT=30000
VITE_MAX_REQUESTS=1000
```

### Vite Configuration
The project uses Vite with React plugin and optimized dependencies:

```typescript
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
```

## 🤝 Contributing

We welcome contributions! Please see our [Project Instructions](./PROJECT_INSTRUCTIONS.md) for detailed guidelines.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow TypeScript and ESLint guidelines
4. Test your changes thoroughly
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Quality
- Follow TypeScript strict mode
- Use ESLint configuration
- Maintain 100% type coverage
- Write self-documenting code
- Add comments for complex logic

## 📋 Requirements

- Node.js 18.0.0 or higher
- Modern browser with ES2020 support
- Network access for testing external applications
- HTTPS endpoints for security testing

## 🐛 Troubleshooting

### Common Issues

**Authentication Not Working**
```bash
# Check token format and permissions
# Verify CORS settings on target application
# Ensure HTTPS for secure cookies
```

**Performance Test Timeout**
```bash
# Increase timeout in configuration
# Check network connectivity
# Verify application accessibility
```

**Build Errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🙏 Acknowledgments

- [Memberstack](https://memberstack.com) for authentication platform inspiration
- [Webflow](https://webflow.com) for no-code platform integration patterns
- [Core Web Vitals](https://web.dev/vitals/) for performance metrics standards
- [React](https://reactjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling

## 📞 Support

- 📧 Email: gaurang.vasava@workshore.io  
- 🐛 Issues: [GitHub Issues](https://github.com/gaurang-workshore/AuthPerf-Pro/issues)  
- 📖 Documentation: [Wiki](https://github.com/gaurang-workshore/AuthPerf-Pro/wiki)


---

**Crafted from the ashes of 'Can we make it faster? Like, right now?' by Workshore team**
