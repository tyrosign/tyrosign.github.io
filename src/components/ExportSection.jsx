import { memo, useState } from 'react';
import { Copy, Check, RefreshCw, Info } from 'lucide-react';
import { C } from '../constants/theme';

const ExportSection = memo(({ hasData, copied, doCopy, doReset, showSteps, setShowSteps, L }) => (
  <>
    <div className="export-btns" style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
      <button
        onClick={doCopy} disabled={!hasData}
        style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          padding: '0.55rem 1rem', borderRadius: 10, border: 'none', cursor: hasData ? 'pointer' : 'not-allowed',
          background: copied ? `linear-gradient(135deg, ${C.ok}, #22c55e)` : `linear-gradient(135deg, ${C.primary}, ${C.primarySoft})`,
          color: '#fff', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'Inter,sans-serif',
          opacity: hasData ? 1 : 0.5, transition: 'all 0.3s ease',
          boxShadow: hasData ? `0 4px 16px ${C.primary}30` : 'none',
        }}
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? L.cpd : L.cp}
      </button>
      <button
        onClick={doReset}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem',
          padding: '0.55rem 1rem', borderRadius: 10,
          border: `1px solid ${C.borderSub}`, cursor: 'pointer',
          background: C.glass, color: C.text2, fontSize: '0.75rem', fontWeight: 600,
          fontFamily: 'Inter,sans-serif', transition: 'all 0.3s ease',
          backdropFilter: 'blur(8px)',
        }}
      >
        <RefreshCw size={14} />
        {L.rst}
      </button>
    </div>

    <div style={{ borderTop: `1px solid ${C.borderSub}`, paddingTop: '0.5rem' }}>
      <button
        onClick={() => setShowSteps(!showSteps)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem', width: '100%',
          background: 'none', border: 'none', cursor: 'pointer', padding: '0.15rem 0',
          marginBottom: showSteps ? '0.5rem' : 0,
        }}
      >
        <Info size={14} style={{ color: C.accent }} />
        <span style={{ fontSize: '0.76rem', fontWeight: 700, color: C.primary, fontFamily: 'Plus Jakarta Sans,sans-serif', flex: 1, textAlign: 'left' }}>{L.ht}</span>
        <span style={{
          fontSize: '0.7rem', color: C.textM, transition: 'transform 0.3s ease',
          transform: showSteps ? 'rotate(180deg)' : 'rotate(0deg)',
        }}>&#9662;</span>
      </button>
      {showSteps && (
        <div style={{ animation: 'fadeIn 0.25s ease' }}>
          {L.steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <span style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                width: 18, height: 18, borderRadius: '50%',
                background: `${C.divider}15`, color: C.divider,
                fontSize: '0.58rem', fontWeight: 700,
              }}>{i + 1}</span>
              <span style={{ fontSize: '0.63rem', color: C.text2, lineHeight: 1.5, paddingTop: '0.05rem' }}>{step}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  </>
));

export default ExportSection;
