import { memo } from 'react';
import { Edit3, Settings } from 'lucide-react';
import { C } from '../constants/theme';
import TyroLogo from './ui/TyroLogo';
import TabBtn from './ui/TabBtn';
import LinkedInIcon from './ui/LinkedInIcon';
import ProfileDropdown from './ProfileDropdown';

/* Pill Slider — iOS style language toggle */
const LangToggle = memo(({ lang, setLang }) => (
  <div className="lang-toggle" style={{
    position: 'relative', display: 'flex',
    padding: 3, borderRadius: 20,
    background: `${C.primaryGhost}`,
    width: 76, height: 30, flexShrink: 0,
  }}>
    <span style={{
      position: 'absolute', top: 3, left: lang === 'tr' ? 3 : 38,
      width: 35, height: 24, borderRadius: 17,
      background: '#fff',
      boxShadow: '0 1px 4px rgba(30,58,95,0.15)',
      transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }} />
    {['tr', 'en'].map(l => (
      <button key={l} onClick={() => setLang(l)} aria-label={l === 'tr' ? 'Türkçe' : 'English'} style={{
        position: 'relative', zIndex: 1, flex: 1,
        background: 'none', border: 'none', cursor: 'pointer',
        fontSize: '0.62rem', fontWeight: 700, fontFamily: 'Inter,sans-serif',
        color: lang === l ? C.primary : C.textM,
        transition: 'color 0.25s',
      }}>{l.toUpperCase()}</button>
    ))}
  </div>
));

const AppHeader = memo(({ tab, setTab, lang, setLang, L, msalAccount, profileOpen, setProfileOpen, handleLogout, profilePhoto }) => (
    <header className="app-header" style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: C.glassSolid, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${C.borderSub}`,
      padding: '0 2rem', height: 56,
      display: 'flex', alignItems: 'center', gap: '1rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        {/* Three dots logo — optically centered with text */}
        <div style={{ display: 'flex', gap: '3.5px', alignItems: 'center', marginTop: '1px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1e3a5f', display: 'block' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0098d4', display: 'block' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#c8922a', display: 'block' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <span className="app-header-title" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '1.25rem', fontWeight: 800, color: C.primary, letterSpacing: '-0.5px' }}>tyro</span>
          <span className="app-header-title-accent" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '1.25rem', fontWeight: 800, color: C.accent, letterSpacing: '-0.5px' }}>sign</span>
        </div>
      </div>

      <nav className="app-header-nav" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div className="nav-tabs-inner" style={{
          display: 'flex', gap: '2px',
          padding: 3, borderRadius: 11,
          background: `${C.primaryGhost}`,
        }}>
          <TabBtn active={tab === 'signature'} onClick={() => setTab('signature')} icon={Edit3} label={L.sigTab} />
          <TabBtn active={tab === 'banner'} onClick={() => setTab('banner')} icon={LinkedInIcon} label={L.banTab} />
          <TabBtn active={tab === 'settings'} onClick={() => setTab('settings')} icon={Settings} label={L.setTab} />
        </div>
      </nav>

      <LangToggle lang={lang} setLang={setLang} />

      {msalAccount && (
        <ProfileDropdown
          msalAccount={msalAccount}
          lang={lang}
          profileOpen={profileOpen}
          setProfileOpen={setProfileOpen}
          handleLogout={handleLogout}
          profilePhoto={profilePhoto}
        />
      )}
    </header>
));

export default AppHeader;
