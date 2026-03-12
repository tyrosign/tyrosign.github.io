import { memo, useState, useRef, useEffect, useMemo } from 'react';
import { C } from '../../constants/theme';

const ChevronIcon = ({ open }) => (
  <svg width="12" height="7" viewBox="0 0 12 7" fill="none" style={{
    transition: 'transform 0.2s ease',
    transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
    flexShrink: 0,
  }}>
    <path d="M1 1L6 6L11 1" stroke={C.textM} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SearchableSelect = memo(({
  value, onChange, placeholder, label, required,
  options, groups, groupLabels,
}) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const listRef = useRef(null);

  const selected = useMemo(() => options.find(o => o.id === value) || null, [options, value]);

  /* close on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  /* scroll selected into view on open */
  useEffect(() => {
    if (open && listRef.current) {
      const active = listRef.current.querySelector('[data-active="true"]');
      if (active) active.scrollIntoView({ block: 'nearest' });
    }
  }, [open]);

  const renderRows = () => {
    if (!groups) {
      return options.map(o => row(o));
    }
    const out = [];
    groups.forEach(g => {
      const items = options.filter(o => o.group === g);
      if (!items.length) return;
      const gLabel = groupLabels?.[g] || g;
      out.push(
        <div key={'g-' + g} style={{
          padding: '0.3rem 0.55rem 0.15rem', fontSize: '0.55rem', fontWeight: 700,
          color: C.textM, textTransform: 'uppercase', letterSpacing: '0.5px',
          fontFamily: 'Plus Jakarta Sans,sans-serif',
          position: 'sticky', top: 0, background: '#fff', zIndex: 1,
        }}>
          {gLabel}
        </div>
      );
      items.forEach(o => out.push(row(o)));
    });
    return out;
  };

  const row = (o) => {
    const active = value === o.id;
    return (
      <div
        key={o.id}
        data-active={active ? 'true' : undefined}
        onClick={() => { onChange(o.id); setOpen(false); }}
        style={{
          padding: '0.4rem 0.55rem',
          fontSize: '0.75rem', fontFamily: 'Inter,sans-serif',
          color: active ? C.primary : C.text1,
          fontWeight: active ? 600 : 400,
          cursor: 'pointer',
          background: active ? `${C.primary}08` : 'transparent',
          borderLeft: active ? `2.5px solid ${C.accent}` : '2.5px solid transparent',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}
        onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#f5f7fa'; }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
      >
        {o.name}
      </div>
    );
  };

  return (
    <div style={{ marginBottom: '0.7rem', position: 'relative' }} ref={wrapRef}>
      {label && (
        <label style={{
          display: 'flex', alignItems: 'center', gap: '0.35rem',
          fontSize: '0.7rem', fontWeight: 600, color: C.text2, marginBottom: '0.25rem',
        }}>
          {label}
          {required && <span style={{ color: C.err }}>*</span>}
        </label>
      )}

      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.45rem 0.65rem',
          background: '#fff',
          border: `1.5px solid ${open ? C.accent + '60' : C.borderSub}`,
          borderRadius: 8,
          cursor: 'pointer', transition: 'border-color 0.15s',
          fontFamily: 'Inter,sans-serif', fontSize: '0.78rem', color: C.text1,
          boxSizing: 'border-box', outline: 'none', textAlign: 'left',
        }}
      >
        <span style={{
          flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          color: selected ? C.text1 : C.textM,
          fontWeight: selected ? 500 : 400,
        }}>
          {selected ? selected.name : placeholder}
        </span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div ref={listRef} style={{
          position: 'absolute', left: 0, right: 0,
          top: 'calc(100% + 4px)',
          maxHeight: 240,
          overflowY: 'auto',
          background: '#fff',
          border: `1px solid ${C.borderSub}`,
          borderRadius: 8,
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          zIndex: 200,
          padding: '0.2rem 0',
          scrollbarWidth: 'thin',
        }}>
          {renderRows()}
        </div>
      )}
    </div>
  );
});

export default SearchableSelect;
