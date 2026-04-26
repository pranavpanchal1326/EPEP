import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10,
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
    },
  },
})

const root = ReactDOM.createRoot(document.getElementById('root'))

if (import.meta.env.DEV) {
  root.render(<React.StrictMode><QueryClientProvider client={queryClient}><BrowserRouter><App /></BrowserRouter></QueryClientProvider></React.StrictMode>)
} else {
  root.render(<QueryClientProvider client={queryClient}><BrowserRouter><App /></BrowserRouter></QueryClientProvider>)
}