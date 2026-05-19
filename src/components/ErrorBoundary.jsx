import { Component } from 'react';

/**
 * Catches render-time and lifecycle errors anywhere below it so a single
 * bad component (or a stray Firebase / network error) can never blank the
 * entire app. Shows a readable fallback with the error message + stack so
 * we can actually debug instead of staring at a blue screen.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
    this.setState({ info });
  }

  handleReset = () => {
    this.setState({ error: null, info: null });
  };

  handleHardReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch { /* best-effort cleanup */ }
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((r) => r.unregister());
        window.location.reload();
      });
    } else {
      window.location.reload();
    }
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div
        style={{
          minHeight: '100vh',
          padding: '24px',
          fontFamily: 'Inter, system-ui, sans-serif',
          color: '#fff',
          background: '#1a1f3a',
          overflow: 'auto',
        }}
      >
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h1 style={{ color: '#f4a623', fontSize: 28, marginBottom: 12 }}>
            Something broke 🛠️
          </h1>
          <p style={{ color: '#8892b0', marginBottom: 16 }}>
            The app caught an error before it could render. Details below:
          </p>
          <pre
            style={{
              background: '#0d1124',
              border: '1px solid #2a3158',
              borderRadius: 8,
              padding: 16,
              color: '#ff6b6b',
              fontSize: 13,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {String(this.state.error?.stack || this.state.error)}
          </pre>
          {this.state.info?.componentStack && (
            <pre
              style={{
                background: '#0d1124',
                border: '1px solid #2a3158',
                borderRadius: 8,
                padding: 16,
                marginTop: 12,
                color: '#8892b0',
                fontSize: 12,
                whiteSpace: 'pre-wrap',
              }}
            >
              {this.state.info.componentStack}
            </pre>
          )}
          <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
            <button
              onClick={this.handleReset}
              style={{
                padding: '10px 18px',
                background: '#f4a623',
                color: '#1a1f3a',
                border: 'none',
                borderRadius: 8,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
            <button
              onClick={this.handleHardReset}
              style={{
                padding: '10px 18px',
                background: 'transparent',
                color: '#fff',
                border: '1px solid #2a3158',
                borderRadius: 8,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Hard reset (clear storage)
            </button>
          </div>
        </div>
      </div>
    );
  }
}
