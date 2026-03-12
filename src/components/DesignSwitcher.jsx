import { memo } from 'react';
import { C } from '../constants/theme';
import { DESIGNS } from '../constants/designs';

const renderMiniPreview = (designId, stg, size = 1) => {
  const w = 40 * size, h = 24 * size;
  return (
    <div style={{ width: w, height: h, borderRadius: 4, overflow: 'hidden', border: `1px solid ${C.borderSub}`, background: '#fff', display: 'flex', position: 'relative', flexShrink: 0 }}>
      {designId === 'classic' ? (<>
        <div style={{ width: 10 * size, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 6 * size, height: 8 * size, borderRadius: 1, background: C.primary + '40' }} />
        </div>
        <div style={{ width: 1, background: C.divider, flexShrink: 0 }} />
        <div style={{ flex: 1, padding: `${3 * size}px ${2 * size}px`, display: 'flex', flexDirection: 'column', gap: size }}>
          <div style={{ height: 1.5 * size, width: '80%', background: C.primary + '50', borderRadius: 1 }} />
          <div style={{ height: size, width: '60%', background: C.accent + '40', borderRadius: 1 }} />
          <div style={{ height: size, width: '90%', background: '#ddd', borderRadius: 1 }} />
        </div>
        <div style={{ width: 9 * size, background: C.primary, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: size }}>
          <div style={{ width: 3 * size, height: 3 * size, borderRadius: 1, background: 'rgba(255,255,255,0.4)' }} />
          <div style={{ width: 3 * size, height: 3 * size, borderRadius: 1, background: 'rgba(255,255,255,0.4)' }} />
        </div>
      </>) : (<>
        <div style={{ width: 14 * size, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: `${2 * size}px ${size}px` }}>
          <div style={{ width: 8 * size, height: 9 * size, borderRadius: 1, background: C.primary + '30', marginBottom: size }} />
          <div style={{ height: size, width: 10 * size, background: C.accent + '40', borderRadius: 1 }} />
        </div>
        <div style={{ flex: 1, background: stg.rightBlockBg || C.primary, borderRadius: `${6 * size}px 0 0 ${3 * size}px`, display: 'flex', flexDirection: 'column', padding: `${3 * size}px`, gap: size }}>
          <div style={{ height: 1.5 * size, width: '85%', background: 'rgba(255,255,255,0.7)', borderRadius: 1 }} />
          <div style={{ height: size, width: '55%', background: 'rgba(255,255,255,0.4)', borderRadius: 1 }} />
          <div style={{ height: size, width: '75%', background: 'rgba(255,255,255,0.3)', borderRadius: 1, marginTop: size }} />
        </div>
      </>)}
    </div>
  );
};

const DesignSwitcher = memo(({ stg, setStg, designOpen, setDesignOpen, L }) => {
  const curDesign = DESIGNS.find(d => d.id === stg.designId) || DESIGNS[0];
  return (
    <div style={{ marginLeft: 'auto', position: 'relative' }}>
      <button
        onClick={() => setDesignOpen(p => !p)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          padding: '0.25rem 0.5rem 0.25rem 0.3rem',
          background: designOpen ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.55)',
          backdropFilter: 'blur(12px) saturate(180%)', WebkitBackdropFilter: 'blur(12px) saturate(180%)',
          borderRadius: 20, border: `1.5px solid ${designOpen ? C.primary + '30' : 'rgba(255,255,255,0.6)'}`,
          boxShadow: designOpen ? '0 4px 16px rgba(30,58,95,0.12)' : '0 2px 8px rgba(30,58,95,0.08)',
          cursor: 'pointer', transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => { if (!designOpen) { e.currentTarget.style.background = 'rgba(255,255,255,0.75)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(30,58,95,0.12)'; } }}
        onMouseLeave={e => { if (!designOpen) { e.currentTarget.style.background = 'rgba(255,255,255,0.55)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(30,58,95,0.08)'; } }}
      >
        <span className="design-mini-preview">{renderMiniPreview(curDesign.id, stg)}</span>
        <span style={{ fontSize: '0.68rem', fontWeight: 600, color: C.text1, fontFamily: 'Plus Jakarta Sans,sans-serif', whiteSpace: 'nowrap' }}>
          {L[curDesign.nameKey]}
        </span>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{
          transition: 'transform 0.2s ease',
          transform: designOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        }}>
          <path d="M1 1L5 5L9 1" stroke={C.textM} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {designOpen && (
        <>
          <div onClick={() => setDesignOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 199 }} />
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', right: 0,
            minWidth: 200, background: C.surface,
            borderRadius: 14, border: `1px solid ${C.borderSub}`,
            boxShadow: '0 12px 40px rgba(30,58,95,0.15), 0 4px 12px rgba(30,58,95,0.08)',
            zIndex: 200, overflow: 'hidden',
            animation: 'fadeSlideDown 0.2s ease',
          }}>
            <div style={{ padding: '0.5rem 0.6rem 0.35rem', borderBottom: `1px solid ${C.borderSub}` }}>
              <span style={{ fontSize: '0.6rem', fontWeight: 600, color: C.textM, fontFamily: 'Plus Jakarta Sans,sans-serif', letterSpacing: '0.5px' }}>
                {L.designSelect}
              </span>
            </div>
            <div style={{ padding: '0.3rem' }}>
              {DESIGNS.map(d => {
                const isActive = d.id === stg.designId;
                return (
                  <button
                    key={d.id}
                    onClick={() => { setStg(p => ({ ...p, designId: d.id })); setDesignOpen(false); }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem',
                      padding: '0.5rem 0.55rem', borderRadius: 10,
                      border: 'none', background: isActive ? `${C.primary}0a` : 'transparent',
                      cursor: 'pointer', transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = `${C.primary}06`; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {renderMiniPreview(d.id, stg)}
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 600, color: C.text1, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>
                        {L[d.nameKey]}
                      </div>
                      <div style={{ fontSize: '0.6rem', color: C.textM, marginTop: 1 }}>
                        {L[d.nameKey + 'Desc']}
                      </div>
                    </div>
                    {isActive && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
});

export default DesignSwitcher;
