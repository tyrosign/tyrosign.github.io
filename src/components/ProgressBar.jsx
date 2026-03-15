import { memo } from 'react';
import { Check } from 'lucide-react';
import { C } from '../constants/theme';

const ProgressBar = memo(({ progress, L }) => (
  <div className="progress-bar" style={{
    display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem',
    background: C.surface, backdropFilter: 'blur(12px)', borderRadius: 12,
    padding: '0.65rem 1rem', border: `1px solid ${C.border}`,
    transition: 'all 0.4s ease',
    boxShadow: progress.pct === 100 ? `0 2px 16px ${C.ok}15` : C.shadow,
  }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.4rem',
      background: progress.pct === 100
        ? `linear-gradient(135deg, ${C.ok}12, ${C.ok}06)`
        : `linear-gradient(135deg, ${C.primary}10, ${C.divider}08)`,
      border: `1px solid ${progress.pct === 100 ? C.ok + '25' : C.primary + '15'}`,
      borderRadius: 8, padding: '0.3rem 0.6rem',
      transition: 'all 0.4s ease',
      animation: progress.pct === 100 ? 'completeBounce 0.5s ease' : 'none',
    }}>
      {progress.pct === 100 ? (
        <Check size={12} style={{ color: C.ok }} />
      ) : (
        <span style={{
          width: 7, height: 7, borderRadius: '50%',
          background: `linear-gradient(135deg, ${C.primary}, ${C.divider})`,
          animation: 'pulse 2s infinite',
        }} />
      )}
      <span style={{
        fontSize: '0.63rem', fontWeight: 700,
        color: progress.pct === 100 ? C.ok : C.primary,
        fontFamily: 'Plus Jakarta Sans,sans-serif',
      }}>{L.prog}</span>
      <span style={{
        fontSize: '0.72rem', fontWeight: 800,
        color: progress.pct === 100 ? C.ok : C.accent,
        fontFamily: 'Plus Jakarta Sans,sans-serif',
        fontVariantNumeric: 'tabular-nums',
        animation: 'countPop 0.3s ease',
      }}>{progress.filled}{L.of}{progress.total}</span>
    </div>
    <div style={{
      flex: 1, height: 6, borderRadius: 4, overflow: 'hidden', position: 'relative',
      background: progress.pct === 100
        ? `${C.ok}12`
        : `linear-gradient(90deg, ${C.primaryGhost}, ${C.primary}08)`,
      transition: 'background 0.4s ease',
    }}>
      <div style={{
        height: '100%', width: `${progress.pct}%`,
        backgroundImage: progress.pct === 100
          ? `linear-gradient(90deg, ${C.ok}, #22c55e, #4ade80, #22c55e, ${C.ok})`
          : `linear-gradient(90deg, ${C.primary}, ${C.divider}, ${C.primary}, ${C.divider})`,
        backgroundSize: '300% 100%',
        borderRadius: 4,
        transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        animation: progress.pct > 0
          ? `progressFlow 3s linear infinite${progress.pct === 100 ? ', progressComplete 2s ease infinite' : ', progressGlow 2s ease infinite'}`
          : 'none',
        position: 'relative', overflow: 'hidden',
      }}>
        {progress.pct > 0 && <span style={{
          position: 'absolute', top: 0, bottom: 0, width: '30%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          animation: 'barShine 2.5s ease-in-out infinite',
        }} />}
      </div>
    </div>
    <span style={{
      fontSize: '0.7rem', fontWeight: 800,
      fontFamily: 'Plus Jakarta Sans,sans-serif',
      fontVariantNumeric: 'tabular-nums',
      color: progress.pct === 100 ? C.ok : C.accent,
      background: progress.pct === 100 ? `${C.ok}10` : `${C.accent}10`,
      padding: '0.2rem 0.45rem', borderRadius: 6,
      transition: 'all 0.4s ease',
      animation: progress.pct === 100 ? 'completeBounce 0.5s ease' : 'none',
    }}>
      {progress.pct}%
    </span>
  </div>
));

export default ProgressBar;
