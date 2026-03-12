import { memo } from 'react';
import { C } from '../../constants/theme';

const GlassCard = memo(({ children, style = {}, accent = false }) => (
  <div className="glass-card" style={{
    background: C.surface, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
    borderRadius: '14px', border: `1px solid ${C.border}`,
    boxShadow: C.shadow, overflow: 'hidden',
    ...style,
  }}>
    {accent && <div style={{ height: 2.5, background: `linear-gradient(90deg, ${C.primary}, ${C.divider}, ${C.accent})` }} />}
    <div className="glass-card-inner" style={{ padding: '1rem 1.25rem' }}>{children}</div>
  </div>
));

export default GlassCard;
