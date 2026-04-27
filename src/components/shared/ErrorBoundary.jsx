import { Component } from 'react'
import PropTypes from 'prop-types'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
    this.handleReset = this.handleReset.bind(this)
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error(
      `[EPEP ErrorBoundary] "${this.props.feature ?? 'Component'}" crashed:`,
      error,
      info?.componentStack
    )
  }

  handleReset() {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (!this.state.hasError) return this.props.children
    if (this.props.fallback) return this.props.fallback

    const { feature } = this.props

    return (
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={{
          padding: '32px 24px',
          background: '#FFFFFF',
          border: '1px solid #E8E4DC',
          borderRadius: '16px',
          textAlign: 'center',
          margin: '24px auto',
          maxWidth: '480px',
          fontFamily: '"DM Sans", sans-serif',
        }}
      >
        <div style={{ fontSize: '40px', marginBottom: '12px' }} aria-hidden="true">
          !
        </div>

        <h3
          style={{
            color: '#1A1814',
            fontSize: '18px',
            fontWeight: 600,
            marginBottom: '8px',
            fontFamily: '"DM Sans", sans-serif',
          }}
        >
          {feature ? `${feature} could not load` : 'Something went wrong'}
        </h3>

        <p
          style={{
            color: '#6B6560',
            fontSize: '14px',
            lineHeight: 1.6,
            marginBottom: '20px',
          }}
        >
          The rest of EPEP is working normally.{' '}
          <a
            href="https://eci.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#2D5A3D', textDecoration: 'underline' }}
          >
            Visit eci.gov.in
          </a>{' '}
          for official election information.
        </p>

        <button
          type="button"
          onClick={this.handleReset}
          aria-label={`Reload ${feature ?? 'this section'}`}
          style={{
            background: '#2D5A3D',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 24px',
            cursor: 'pointer',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          Try Again
        </button>
      </div>
    )
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
  feature: PropTypes.string,
}

ErrorBoundary.defaultProps = {
  fallback: null,
  feature: null,
}

export default ErrorBoundary