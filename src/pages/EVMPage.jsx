import { useSEO } from '../hooks/useSEO';
import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import EVMSimulator from '@/components/EVM/EVMSimulator';
import EVMHeader from '@/components/EVM/EVMHeader';

const EVMErrorFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
    <div className="bg-white p-10 rounded-2xl border border-[#E8E4DC] shadow-card max-w-[480px]">
      <AlertCircle size={32} className="text-[#C0392B] mx-auto mb-4" />
      <h2 className="font-display text-2xl font-bold text-[#1A1814] mb-2">EVM Simulator Unavailable</h2>
      <p className="font-body text-base text-[#6B6560] mb-6">Please refresh the page or try again later.</p>
      <button 
        onClick={() => window.location.reload()}
        className="btn btn-filled"
      >
        Refresh Page
      </button>
    </div>
  </div>
);

const EVMPage = () => {
  useSEO({ title: 'EVM Simulator — Practice Voting | EPEP', description: 'Realistic Electronic Voting Machine simulator. Learn how EVM and VVPAT work.' });
  useEffect(() => {
    document.title = "EVM Simulator · EPEP";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <EVMHeader />
      <main>
        <ErrorBoundary fallback={<EVMErrorFallback />}>
          <EVMSimulator />
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default EVMPage;
