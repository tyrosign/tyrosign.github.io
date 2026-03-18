import { useState, memo } from 'react';
import { Check } from 'lucide-react';
import { C } from '../../constants/theme';

const FormField = memo(({ label, value, onChange, placeholder, required, error, success, type }) => {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? C.err + '80'
    : success
      ? C.ok + '60'
      : focused
        ? C.accent + '60'
        : C.borderSub;

  const ringColor = error
    ? `0 0 0 3px ${C.err}12`
    : success
      ? `0 0 0 3px ${C.ok}12`
      : focused
        ? `0 0 0 3px ${C.accent}15, ${C.shadow}`
        : 'none';

  return (
    <div style={{ marginBottom: '0.7rem' }}>
      <label style={{
        display: 'flex', alignItems: 'center', gap: '0.35rem',
        fontSize: '0.7rem', fontWeight: 600,
        color: error ? C.err : focused ? C.primary : C.text2,
        marginBottom: '0.25rem', transition: 'color 0.2s',
      }}>
        {label}
        {required && <span style={{ color: C.err, fontSize: '0.6rem' }}>*</span>}
        {success && !error && value && (
          <Check size={12} style={{ color: C.ok, strokeWidth: 2.5, marginLeft: 'auto' }} />
        )}
      </label>
      <input
        type={type || 'text'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-required={required || undefined}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `err-${label}` : undefined}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '0.45rem 0.65rem',
          border: `1px solid ${borderColor}`,
          borderRadius: '8px', fontSize: '0.78rem', fontFamily: 'Inter,sans-serif',
          background: focused ? '#fff' : C.glass, color: C.text1,
          outline: 'none', boxSizing: 'border-box',
          transition: 'all 0.25s ease',
          boxShadow: ringColor,
          backdropFilter: 'blur(8px)',
        }}
      />
      {error && (
        <p id={`err-${label}`} role="alert" style={{
          fontSize: '0.58rem', color: C.err, marginTop: '0.2rem',
          fontWeight: 500, fontFamily: 'Inter,sans-serif',
          animation: 'fadeIn 0.2s ease',
        }}>
          {error}
        </p>
      )}
    </div>
  );
});

export default FormField;
