import { memo } from 'react';
import { C } from '../../constants/theme';

const TabBtn = memo(({ active, onClick, icon: Ic, label }) => (
  <button
    className="nav-tab-btn"
    onClick={onClick}
    style={{
      position: 'relative', zIndex: 1,
      display: 'flex', alignItems: 'center', gap: '0.35rem',
      padding: '0.4rem 1rem', borderRadius: '7px',
      border: 'none', cursor: 'pointer',
      background: 'transparent',
      color: active ? C.primary : C.text2,
      fontWeight: active ? 700 : 500, fontSize: '0.76rem', fontFamily: 'Inter,sans-serif',
      transition: 'color 0.25s ease',
    }}
  >
    <Ic size={13} style={{ color: active ? C.accent : C.textM, transition: 'color 0.25s' }} />{label}
  </button>
));

export default TabBtn;
