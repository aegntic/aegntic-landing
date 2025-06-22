"use client";

import React, { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("3D Scene Error:", error, errorInfo);

    // Log error details for debugging
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    };

    // Store error in session storage for debugging
    try {
      sessionStorage.setItem("lastSceneError", JSON.stringify(errorDetails));
    } catch (e) {
      // Ignore storage errors
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-black text-white p-8">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">3D Scene Error</h2>
            <p className="text-gray-400 mb-6">
              The 3D scene encountered an error. This might be due to WebGL
              compatibility or graphics driver issues.
            </p>
            <div className="space-y-4">
              <button
                onClick={this.handleRetry}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition-colors ml-4"
              >
                Reload Page
              </button>
            </div>
            {this.state.error && (
              <details className="mt-6 text-left text-sm text-gray-500">
                <summary className="cursor-pointer hover:text-gray-400">
                  Technical Details
                </summary>
                <pre className="mt-2 p-4 bg-gray-900 rounded overflow-auto text-xs">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
