import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('WishCraft ErrorBoundary caught an exception:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return typeof this.props.fallback === 'function'
          ? this.props.fallback({
              error: this.state.error,
              reset: this.handleReset,
              reload: this.handleReload,
            })
          : this.props.fallback;
      }

      return (
        <div className="w-full min-h-[240px] flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md bg-white rounded-2xl border border-rose-100 shadow-xl shadow-rose-950/5 p-6 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shadow-2xs">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-800">
                Something went wrong while rendering this section.
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {this.state.error?.message || 'An unexpected rendering error occurred. Please try again.'}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500 text-white hover:bg-rose-600 active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
