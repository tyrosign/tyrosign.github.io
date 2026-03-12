import { useState, memo } from 'react';
import { C } from '../../constants/theme';

const FormField = memo(({ label, value, onChange, placeholder, required }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: '0.7rem' }}>
      <label style={{
        display: 'flex', alignItems: 'center', gap: '0.35rem',
        fontSize: '0.7rem', fontWeight: 600, color: focused ? C.primary : C.text2,
        marginBottom: '0.25rem', transition: 'color 0.2s',
      }}>
        {label}{required && <span style={{ color: C.err }}>*</span>}
      </label>
      <input
        type="text" value={value} onChange={onChange} placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '0.45rem 0.65rem',
          border: `1px solid ${focused ? C.accent + '60' : C.borderSub}`,
          borderRadius: '8px', fontSize: '0.78rem', fontFamily: 'Inter,sans-serif',
          background: focused ? '#fff' : C.glass, color: C.text1,
          outline: 'none', boxSizing: 'border-box',
          transition: 'all 0.25s ease',
          boxShadow: focused ? `0 0 0 3px ${C.accent}15, ${C.shadow}` : 'none',
          backdropFilter: 'blur(8px)',
        }}
      />
    </div>
  );
});

export default FormField;
