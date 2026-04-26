import { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, m } from 'framer-motion'
import { HelmetProvider } from 'react-helmet-async'
import Navbar from './components/shared/Navbar'
import Footer from './components/shared/Footer'
import ErrorBoundary from './components/shared/ErrorBoundary'
import ChatDrawer from './components/Chat/ChatDrawer'
import OfflineBanner from './components/shared/OfflineBanner'
import UpdateNotification from './components/shared/UpdateNotification'
import InstallBanner from './components/shared/InstallBanner'
import PageLoader from './components/shared/PageLoader'
import { MotionProvider } from './components/shared/LazyMotion'
import { PAGE_VARIANTS } from './lib/motionVariants'

const HomePage = lazy(() => import('./pages/HomePage'))
const MapPage = lazy(() => import('./pages/MapPage'))
const EVMPage = lazy(() => import('./pages/EVMPage'))
const LearnPage = lazy(() => import('./pages/LearnPage'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const QuizPage = lazy(() => import('./pages/QuizPage'))

export default function App() {
  const location = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [location])

  return (
    <HelmetProvider>
      <MotionProvider>
        <div className="flex min-h-screen flex-col bg-[#F8F7F4] font-['DM_Sans'] text-[#1A1814]">
          <OfflineBanner />
          <Navbar />
          <main id="main-content" className="flex-1 overflow-hidden">
            <ErrorBoundary>
              <AnimatePresence mode="wait">
                <m.div key={location.pathname} variants={PAGE_VARIANTS} initial="initial" animate="animate" exit="exit" className="w-full">
                  <Suspense fallback={<PageLoader />}>
                    <Routes location={location}>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/map" element={<MapPage />} />
                      <Route path="/evm" element={<EVMPage />} />
                      <Route path="/learn" element={<LearnPage />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/quiz" element={<QuizPage />} />
                    </Routes>
                  </Suspense>
                </m.div>
              </AnimatePresence>
            </ErrorBoundary>
          </main>
          <InstallBanner />
          <UpdateNotification />
          <ChatDrawer />
          <Footer />
        </div>
      </MotionProvider>
    </HelmetProvider>
  )
}