import { useSEO } from '../hooks/useSEO';
import { Suspense, lazy } from 'react'
import { useEPEPStore } from '@/store'

const IndiaMap = lazy(() => import('@/components/Map/IndiaMap'))

const MapPage = () => {
  useSEO({ title: 'India Election Map — Explore Constituencies | EPEP', description: 'Interactive map of India\'s 543 constituencies. Click states to see MP data.' });
  const selectedState = useEPEPStore((s) => s.selectedState)

  return (
    <div
      style={{
        display:   'flex',
        height:    'calc(100vh - 88px)',
        marginTop: '88px',
        overflow:  'hidden',
        background: 'var(--color-bg-base)',
      }}
    >
      <div
        style={{
          flex:     '1 1 65%',
          position: 'relative',
          minWidth: '0',
        }}
      >
        <Suspense
          fallback={
            <div
              style={{
                width:           '100%',
                height:          '100%',
                background:      'var(--color-bg-base)',
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'center',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize:   '14px',
                  color:      'var(--color-text-secondary)',
                }}
              >
                Loading map…
              </div>
            </div>
          }
        >
          <IndiaMap />
        </Suspense>
      </div>

      <div
        style={{
          flex:          '0 0 35%',
          maxWidth:      '420px',
          borderLeft:    '1px solid var(--color-border-soft)',
          background:    'var(--color-surface)',
          overflowY:     'auto',
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'center',
          justifyContent: selectedState ? 'flex-start' : 'center',
          padding:       '32px 24px',
        }}
      >
        {selectedState ? (
          <div style={{ width: '100%' }}>
            <p
              style={{
                fontFamily:   'var(--font-body)',
                fontSize:     '12px',
                fontWeight:   '600',
                color:        'var(--color-accent)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              Selected State
            </p>
            <h2
              style={{
                fontFamily:   'var(--font-display)',
                fontSize:     '28px',
                fontWeight:   '700',
                color:        'var(--color-text-primary)',
                marginBottom: '24px',
                lineHeight:   '1.2',
              }}
            >
              {selectedState}
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize:   '14px',
                color:      'var(--color-text-secondary)',
                lineHeight: '1.6',
              }}
            >
              Detailed constituency data, MP profiles, and
              election history will appear here in Phase 2.3.
            </p>
          </div>
        ) : (
          <div style={{ textAlign: 'center', maxWidth: '240px' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>
              🗺️
            </div>
            <p
              style={{
                fontFamily:  'var(--font-body)',
                fontSize:    '15px',
                fontWeight:  '500',
                color:       'var(--color-text-primary)',
                marginBottom: '8px',
              }}
            >
              Click any state
            </p>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize:   '13px',
                color:      'var(--color-text-secondary)',
                lineHeight: '1.5',
              }}
            >
              Select a state on the map to see its Lok Sabha
              seats, election phase, and voter data.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MapPage
