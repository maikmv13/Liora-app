import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Here you could send error reports to your error tracking service
    // Example: Sentry.captureException(error);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleGoBack = () => {
    window.history.back();
  };

  private toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }));
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 to-purple-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-rose-100 overflow-hidden"
          >
            {/* Error Header */}
            <div className="p-6 bg-gradient-to-r from-rose-500 to-pink-500 text-white">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-1">
                    Algo salió mal
                  </h2>
                  <p className="text-white/80 text-sm">
                    Ha ocurrido un error inesperado. Por favor, intenta una de las siguientes opciones:
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={this.handleReload}
                  className="flex items-center justify-center space-x-2 p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors"
                >
                  <RefreshCw size={18} />
                  <span>Recargar página</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={this.handleGoHome}
                  className="flex items-center justify-center space-x-2 p-3 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-colors"
                >
                  <Home size={18} />
                  <span>Ir al inicio</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={this.handleGoBack}
                  className="flex items-center justify-center space-x-2 p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <ArrowLeft size={18} />
                  <span>Volver atrás</span>
                </motion.button>
              </div>

              {/* Error Details (for developers) */}
              {(this.state.error || this.state.errorInfo) && (
                <div className="mt-6">
                  <button
                    onClick={this.toggleDetails}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {this.state.showDetails ? 'Ocultar' : 'Mostrar'} detalles técnicos
                  </button>

                  <AnimatePresence>
                    {this.state.showDetails && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 space-y-4"
                      >
                        {this.state.error && (
                          <div className="p-4 bg-gray-50 rounded-xl overflow-auto">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Error:</h3>
                            <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                              {this.state.error.toString()}
                            </pre>
                          </div>
                        )}

                        {this.state.errorInfo && (
                          <div className="p-4 bg-gray-50 rounded-xl overflow-auto">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Stack Trace:</h3>
                            <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                              {this.state.errorInfo.componentStack}
                            </pre>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}