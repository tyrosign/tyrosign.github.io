import { memo } from 'react';
import { C } from '../../constants/theme';

const SectionTitle = memo(({ icon: Ic, children }) => (
  <h3 style={{
    fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: '0.85rem', fontWeight: 700,
    color: C.primary, marginBottom: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
  }}>
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 26, height: 26, borderRadius: 7,
      background: `linear-gradient(135deg, ${C.accent}18, ${C.accent}08)`,
      border: `1px solid ${C.accent}20`,
    }}>
      <Ic size={13} style={{ color: C.accent }} />
    </span>
    {children}
  </h3>
));

export default SectionTitle;
