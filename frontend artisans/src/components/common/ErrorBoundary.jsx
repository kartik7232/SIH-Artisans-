import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught an error]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    try {
      localStorage.removeItem('karigar_auth_user');
      window.location.hash = '#/auth';
      window.location.reload();
    } catch {
      window.location.href = '/';
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FAF7F2',
          padding: '24px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#2D2825'
        }}>
          <div style={{
            maxWidth: '560px',
            width: '100%',
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '36px',
            boxShadow: '0 12px 32px rgba(169, 84, 58, 0.08)',
            border: '1px solid rgba(169, 84, 58, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(169, 84, 58, 0.1)',
              color: '#A9543A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '28px'
            }}>
              ✨
            </div>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              marginBottom: '10px',
              color: '#2D2825'
            }}>
              Session Refresh Required
            </h2>

            <p style={{
              fontSize: '0.94rem',
              color: '#665C54',
              lineHeight: 1.6,
              marginBottom: '24px'
            }}>
              The workspace encountered a state refresh mismatch. Click below to return safely to the secure entry portal.
            </p>

            {this.state.error && (
              <div style={{
                background: '#F5EFEB',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '0.82rem',
                color: '#8C3D2B',
                textAlign: 'left',
                marginBottom: '24px',
                overflowX: 'auto',
                fontFamily: 'monospace'
              }}>
                {this.state.error.toString()}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={this.handleReset}
                style={{
                  background: '#A9543A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 24px',
                  fontWeight: '600',
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(169, 84, 58, 0.25)'
                }}
              >
                Go to Secure Login Portal →
              </button>

              <button
                onClick={() => window.location.reload()}
                style={{
                  background: '#FAF7F2',
                  color: '#2D2825',
                  border: '1px solid #D8CFC4',
                  borderRadius: '10px',
                  padding: '12px 20px',
                  fontWeight: '600',
                  fontSize: '0.92rem',
                  cursor: 'pointer'
                }}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
