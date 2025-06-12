import React from 'react';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Key,
  Lock,
  RefreshCw
} from 'lucide-react';
import { AuthenticationAnalysis } from '../types';

interface AuthenticationAnalysisViewProps {
  authAnalysis: AuthenticationAnalysis;
}

export function AuthenticationAnalysisView({ authAnalysis }: AuthenticationAnalysisViewProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'invalid': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'expired': return <Clock className="w-5 h-5 text-orange-500" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A': return 'text-green-600 bg-green-100';
      case 'B': return 'text-blue-600 bg-blue-100';
      case 'C': return 'text-yellow-600 bg-yellow-100';
      case 'D': return 'text-orange-600 bg-orange-100';
      case 'F': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  return (
    <div className="space-y-8">
      {/* Authentication Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`rounded-xl p-6 ${
          authAnalysis.tokenValidation.status === 'valid' ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            {getStatusIcon(authAnalysis.tokenValidation.status)}
            <h4 className="font-semibold text-gray-800">Token Status</h4>
          </div>
          <p className="text-lg font-bold capitalize">{authAnalysis.tokenValidation.status}</p>
          <p className="text-sm text-gray-600">
            Expires in {formatDuration(authAnalysis.tokenValidation.expiresIn)}
          </p>
        </div>

        <div className={`rounded-xl p-6 ${
          authAnalysis.sessionManagement.secure ? 'bg-green-50' : 'bg-orange-50'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            <Lock className={`w-5 h-5 ${
              authAnalysis.sessionManagement.secure ? 'text-green-500' : 'text-orange-500'
            }`} />
            <h4 className="font-semibold text-gray-800">Session Security</h4>
          </div>
          <p className="text-lg font-bold">
            {authAnalysis.sessionManagement.secure ? 'Secure' : 'Insecure'}
          </p>
          <p className="text-sm text-gray-600">
            {authAnalysis.sessionManagement.httpOnly ? 'HttpOnly' : 'Not HttpOnly'}
          </p>
        </div>

        <div className={`rounded-xl p-6 ${getGradeColor(authAnalysis.securityProtocol.grade)}`}>
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-5 h-5" />
            <h4 className="font-semibold">Security Grade</h4>
          </div>
          <p className="text-2xl font-bold">{authAnalysis.securityProtocol.grade}</p>
          <p className="text-sm opacity-80">{authAnalysis.securityProtocol.version}</p>
        </div>

        <div className={`rounded-xl p-6 ${
          authAnalysis.failedAttempts.count === 0 ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className={`w-5 h-5 ${
              authAnalysis.failedAttempts.count === 0 ? 'text-green-500' : 'text-red-500'
            }`} />
            <h4 className="font-semibold text-gray-800">Failed Attempts</h4>
          </div>
          <p className="text-2xl font-bold">{authAnalysis.failedAttempts.count}</p>
          <p className="text-sm text-gray-600">Authentication failures</p>
        </div>
      </div>

      {/* Token Validation Details */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Token Validation</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Token Information</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Status</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(authAnalysis.tokenValidation.status)}
                    <span className="font-medium capitalize">{authAnalysis.tokenValidation.status}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Algorithm</span>
                  <span className="font-medium">{authAnalysis.tokenValidation.algorithm}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Issuer</span>
                  <span className="font-medium">{authAnalysis.tokenValidation.issuer}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Expires In</span>
                  <span className="font-medium">{formatDuration(authAnalysis.tokenValidation.expiresIn)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Authorization Headers</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Present</span>
                  <div className="flex items-center gap-2">
                    {authAnalysis.authorizationHeaders.present ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="font-medium">
                      {authAnalysis.authorizationHeaders.present ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Type</span>
                  <span className="font-medium">{authAnalysis.authorizationHeaders.type}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Format</span>
                  <span className={`font-medium ${
                    authAnalysis.authorizationHeaders.format === 'valid' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {authAnalysis.authorizationHeaders.format}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Encryption</span>
                  <span className="font-medium">{authAnalysis.authorizationHeaders.encryption}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Session Management */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Session Management</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-gray-700 mb-4">Security Settings</h4>
            <div className="space-y-3">
              {[
                { label: 'Secure Flag', value: authAnalysis.sessionManagement.secure },
                { label: 'HttpOnly Flag', value: authAnalysis.sessionManagement.httpOnly }
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">{label}</span>
                  <div className="flex items-center gap-2">
                    {value ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`font-medium ${value ? 'text-green-600' : 'text-red-600'}`}>
                      {value ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">SameSite</span>
                <span className="font-medium">{authAnalysis.sessionManagement.sameSite}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-4">Session Details</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium">{formatDuration(authAnalysis.sessionManagement.duration)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Renewal Attempts</span>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">{authAnalysis.sessionManagement.renewalAttempts}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Protocol Analysis */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Security Protocol Analysis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-gray-700 mb-4">Protocol Details</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Version</span>
                <span className="font-medium">{authAnalysis.securityProtocol.version}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Cipher Suite</span>
                <span className="font-medium">{authAnalysis.securityProtocol.cipher}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Security Grade</span>
                <span className={`px-3 py-1 rounded-lg font-bold ${getGradeColor(authAnalysis.securityProtocol.grade)}`}>
                  {authAnalysis.securityProtocol.grade}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-4">Vulnerabilities</h4>
            {authAnalysis.securityProtocol.vulnerabilities.length > 0 ? (
              <div className="space-y-2">
                {authAnalysis.securityProtocol.vulnerabilities.map((vulnerability, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-red-700">{vulnerability}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-green-700">No vulnerabilities detected</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Failed Authentication Attempts */}
      {authAnalysis.failedAttempts.count > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Failed Authentication Attempts</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Failure Reasons</h4>
                <div className="space-y-2">
                  {authAnalysis.failedAttempts.reasons.map((reason, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span className="text-red-700">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Recent Attempts</h4>
                <div className="space-y-2">
                  {authAnalysis.failedAttempts.timestamps.slice(0, 5).map((timestamp, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{timestamp.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}