import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(error, info) { console.error('EPEP Error:', error, info) }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center bg-[#F8F7F4]">
          <h2 className="font-['Playfair_Display'] text-2xl font-bold mb-4">Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })} className="bg-[#2D5A3D] text-white px-6 py-2 rounded-lg">Try Again</button>
        </div>
      )
    }
    return this.props.children
  }
}
export default ErrorBoundary