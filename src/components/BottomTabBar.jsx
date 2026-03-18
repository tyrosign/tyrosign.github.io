import { memo } from 'react';
import { createPortal } from 'react-dom';
import { Edit3, Settings } from 'lucide-react';
import { C } from '../constants/theme';
import LinkedInIcon from './ui/LinkedInIcon';

const LINKEDIN_BLUE = '#0077B5';

const tabs = [
  { id: 'signature', icon: Edit3, color: C.accent },
  { id: 'banner', icon: LinkedInIcon, color: LINKEDIN_BLUE },
  { id: 'settings', icon: Settings, color: '#475569' },
];

const BottomTabBar = memo(({ tab, setTab }) => createPortal(
  <nav className="bottom-tab-bar" style={{
    position: 'fixed', bottom: 0, left: 0, right: 0,
    zIndex: 9999,
    alignItems: 'center', justifyContent: 'space-around',
    transform: 'translateZ(0)',
    padding: '0.55rem 1.5rem env(safe-area-inset-bottom, 0.45rem)',
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
    borderTop: `1px solid ${C.borderSub}`,
    borderRadius: '20px 20px 0 0',
    boxShadow: '0 -4px 20px rgba(30,58,95,0.08)',
  }}>
    {tabs.map(({ id, icon: Ic, color }) => {
      const active = tab === id;
      return (
        <button
          key={id}
          onClick={() => setTab(id)}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
            padding: '0.2rem 1rem',
            border: 'none', cursor: 'pointer',
            background: 'transparent',
          }}
        >
          <Ic
            size={18}
            color={active ? color : C.textM}
            strokeWidth={active ? 2.2 : 1.8}
            style={{
              color: active ? color : C.textM,
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: active ? 'scale(1.1)' : 'scale(1)',
            }}
          />
          {active && (
            <span style={{
              width: 5, height: 5, borderRadius: '50%',
              background: color,
              boxShadow: `0 0 8px ${color}60`,
            }} />
          )}
        </button>
      );
    })}
  </nav>,
  document.body
));

export default BottomTabBar;
