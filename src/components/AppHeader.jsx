import { memo, useRef, useState, useEffect, useCallback } from 'react';
import { Edit3, Settings } from 'lucide-react';
import { C } from '../constants/theme';
import TyroLogo from './ui/TyroLogo';
import TabBtn from './ui/TabBtn';
import LinkedInIcon from './ui/LinkedInIcon';
import ProfileDropdown from './ProfileDropdown';

const TAB_IDS = ['signature', 'banner', 'settings'];

const AppHeader = memo(({ tab, setTab, lang, setLang, L, msalAccount, profileOpen, setProfileOpen, handleLogout }) => {
  const navRef = useRef(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const updateIndicator = useCallback(() => {
    if (!navRef.current) return;
    const idx = TAB_IDS.indexOf(tab);
    const btns = navRef.current.querySelectorAll('.nav-tab-btn');
    if (!btns[idx]) return;
    const btn = btns[idx];
    setIndicator({ left: btn.offsetLeft, width: btn.offsetWidth });
  }, [tab]);

  useEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [updateIndicator]);

  // Re-measure after fonts load
  useEffect(() => {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(updateIndicator);
    }
  }, [updateIndicator]);

  return (
    <header className="app-header" style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: C.glassSolid, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${C.borderSub}`,
      padding: '0 2rem', height: 56,
      display: 'flex', alignItems: 'center', gap: '1rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
        <TyroLogo size={34} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
          <span className="app-header-title" style={{ fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: '1rem', fontWeight: 800, color: C.primary }}>TYRO</span>
          <span className="app-header-title-accent" style={{ fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: '1rem', fontWeight: 800, color: C.accent }}>SignSnap</span>
        </div>
      </div>

      <nav className="app-header-nav" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div ref={navRef} className="nav-tabs-inner" style={{
          position: 'relative', display: 'flex', gap: '2px',
          background: 'transparent', borderRadius: 10, padding: 3, border: 'none',
        }}>
          <span style={{
            position: 'absolute', top: 3, bottom: 3,
            left: indicator.left,
            width: indicator.width,
            background: '#fff', borderRadius: 8,
            boxShadow: '0 1px 3px rgba(30,58,95,0.1), 0 1px 2px rgba(30,58,95,0.06)',
            transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }} />
          <TabBtn active={tab === 'signature'} onClick={() => setTab('signature')} icon={Edit3} label={L.sigTab} />
          <TabBtn active={tab === 'banner'} onClick={() => setTab('banner')} icon={LinkedInIcon} label={L.banTab} />
          <TabBtn active={tab === 'settings'} onClick={() => setTab('settings')} icon={Settings} label={L.setTab} />
        </div>
      </nav>

      <div className="app-header-lang" style={{
        display: 'flex', borderRadius: '20px', overflow: 'hidden',
        border: `1.5px solid ${C.borderSub}`, background: C.glass,
        backdropFilter: 'blur(10px)', boxShadow: '0 1px 4px rgba(30,58,95,0.06)',
      }}>
        <button onClick={() => setLang('tr')} aria-label="Türkçe" style={{
          padding: '0.3rem 0.6rem', border: 'none', cursor: 'pointer',
          fontSize: '0.65rem', fontWeight: 700, fontFamily: 'Inter,sans-serif',
          background: lang === 'tr' ? `linear-gradient(135deg, ${C.accent}, #d4a43a)` : 'transparent',
          color: lang === 'tr' ? '#fff' : C.textM,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>TR</button>
        <button onClick={() => setLang('en')} aria-label="English" style={{
          padding: '0.3rem 0.6rem', border: 'none', cursor: 'pointer',
          fontSize: '0.65rem', fontWeight: 700, fontFamily: 'Inter,sans-serif',
          background: lang === 'en' ? `linear-gradient(135deg, ${C.accent}, #d4a43a)` : 'transparent',
          color: lang === 'en' ? '#fff' : C.textM,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>EN</button>
      </div>

      {msalAccount && (
        <ProfileDropdown
          msalAccount={msalAccount}
          lang={lang}
          profileOpen={profileOpen}
          setProfileOpen={setProfileOpen}
          handleLogout={handleLogout}
        />
      )}
    </header>
  );
});

export default AppHeader;
