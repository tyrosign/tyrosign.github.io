import { memo } from 'react';
import { C } from '../../constants/theme';

const ToggleSwitch = memo(({ checked, onChange, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.45rem 0', borderBottom: `1px solid ${C.borderSub}` }}>
    <span style={{ fontSize: '0.76rem', fontWeight: 600, color: C.text1 }}>{label}</span>
    <div
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onChange(!checked); } }}
      style={{
        width: 42, height: 24, borderRadius: 12, cursor: 'pointer',
        background: checked ? C.ok : '#cbd5e1',
        position: 'relative', transition: 'background 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{
        width: 20, height: 20, borderRadius: '50%', background: '#fff',
        position: 'absolute', top: 2, left: checked ? 20 : 2,
        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
      }} />
    </div>
  </div>
));

export default ToggleSwitch;
