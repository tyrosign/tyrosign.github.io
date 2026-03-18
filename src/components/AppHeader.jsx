import { memo } from 'react';
import { Edit3, Settings } from 'lucide-react';
import { C } from '../constants/theme';
import TabBtn from './ui/TabBtn';
import LinkedInIcon from './ui/LinkedInIcon';
import ProfileDropdown from './ProfileDropdown';

/* ── Header Theme Configs ── */
const THEMES = {
  'navy-dots': {
    bg: '#1e3a5f',
    tyroColor: '#fff',
    signColor: '#c8922a',
    tabBg: 'rgba(255,255,255,0.1)',
    tabActive: 'rgba(255,255,255,0.2)',
    tabText: 'rgba(255,255,255,0.6)',
    tabActiveText: '#fff',
    tabActiveIcon: '#c8922a',
    border: 'rgba(255,255,255,0.08)',
    langBg: 'rgba(255,255,255,0.1)',
    langSlider: 'rgba(255,255,255,0.2)',
    langActive: '#fff',
    langInactive: 'rgba(255,255,255,0.45)',
    showDots: true,
  },
  gradient: {
    bg: 'linear-gradient(135deg, #1e3a5f 0%, #0098d4 100%)',
    tyroColor: '#fff',
    signColor: '#c8922a',
    tabBg: 'rgba(255,255,255,0.1)',
    tabActive: 'rgba(255,255,255,0.2)',
    tabText: 'rgba(255,255,255,0.6)',
    tabActiveText: '#fff',
    tabActiveIcon: '#c8922a',
    border: 'rgba(255,255,255,0.1)',
    langBg: 'rgba(255,255,255,0.1)',
    langSlider: 'rgba(255,255,255,0.2)',
    langActive: '#fff',
    langInactive: 'rgba(255,255,255,0.45)',
    showDots: false,
  },
  charcoal: {
    bg: '#0f172a',
    tyroColor: '#fff',
    signColor: '#c8922a',
    tabBg: 'rgba(255,255,255,0.06)',
    tabActive: 'rgba(255,255,255,0.14)',
    tabText: 'rgba(255,255,255,0.5)',
    tabActiveText: '#fff',
    tabActiveIcon: '#c8922a',
    border: 'rgba(255,255,255,0.06)',
    langBg: 'rgba(255,255,255,0.06)',
    langSlider: 'rgba(255,255,255,0.14)',
    langActive: '#fff',
    langInactive: 'rgba(255,255,255,0.4)',
    showDots: false,
  },
};

/* ── Pill Slider — themed language toggle ── */
const LangToggle = memo(({ lang, setLang, theme }) => (
  <div className="lang-toggle" style={{
    position: 'relative', display: 'flex',
    padding: 3, borderRadius: 20,
    background: theme.langBg,
    width: 76, height: 30, flexShrink: 0,
  }}>
    <span style={{
      position: 'absolute', top: 3, left: lang === 'tr' ? 3 : 38,
      width: 35, height: 24, borderRadius: 17,
      background: theme.langSlider,
      boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
      transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }} />
    {['tr', 'en'].map(l => (
      <button key={l} onClick={() => setLang(l)} aria-label={l === 'tr' ? 'Türkçe' : 'English'} style={{
        position: 'relative', zIndex: 1, flex: 1,
        background: 'none', border: 'none', cursor: 'pointer',
        fontSize: '0.62rem', fontWeight: 700, fontFamily: 'Inter,sans-serif',
        color: lang === l ? theme.langActive : theme.langInactive,
        transition: 'color 0.25s',
      }}>{l.toUpperCase()}</button>
    ))}
  </div>
));

/* ── Themed Tab Button ── */
const ThemedTabBtn = memo(({ active, onClick, icon: Icon, label, theme }) => (
  <button onClick={onClick} style={{
    position: 'relative', zIndex: 1,
    display: 'flex', alignItems: 'center', gap: '0.35rem',
    padding: '0.38rem 0.75rem', borderRadius: 8, border: 'none', cursor: 'pointer',
    background: active ? theme.tabActive : 'transparent',
    color: active ? theme.tabActiveText : theme.tabText,
    fontSize: '0.72rem', fontWeight: active ? 700 : 500,
    fontFamily: 'Inter, sans-serif',
    transition: 'all 0.25s ease',
  }}>
    <Icon size={13} style={{ color: active ? theme.tabActiveIcon : theme.tabText, transition: 'color 0.25s' }} />
    {label}
  </button>
));

const AppHeader = memo(({ tab, setTab, lang, setLang, L, msalAccount, profileOpen, setProfileOpen, handleLogout, profilePhoto, headerTheme = 'navy-dots' }) => {
  const theme = THEMES[headerTheme] || THEMES['navy-dots'];
  const isGradient = headerTheme === 'gradient';

  return (
    <header className="app-header" style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: theme.bg,
      borderBottom: `1px solid ${theme.border}`,
      padding: '0 2rem', height: 56,
      display: 'flex', alignItems: 'center', gap: '1rem',
    }}>
      {/* Logo — tyrosign text only */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
        {theme.showDots && (
          <div style={{ display: 'flex', gap: 4, marginRight: 2 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff', opacity: 0.6 }} />
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#0098d4' }} />
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#c8922a' }} />
          </div>
        )}
        <span style={{
          fontFamily: "'Baloo 2', 'Plus Jakarta Sans', Inter, sans-serif",
          fontSize: 27, fontWeight: 700, letterSpacing: -1, lineHeight: 1,
          cursor: 'pointer',
        }} onClick={() => setTab('signature')}>
          <span style={{ color: theme.tyroColor }}>tyro</span>
          <span style={{ color: theme.signColor }}>sign</span>
        </span>
      </div>

      {/* Nav tabs */}
      <nav className="app-header-nav" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div className="nav-tabs-inner" style={{
          display: 'flex', gap: '2px',
          padding: 3, borderRadius: 11,
          background: theme.tabBg,
        }}>
          <ThemedTabBtn active={tab === 'signature'} onClick={() => setTab('signature')} icon={Edit3} label={L.sigTab} theme={theme} />
          <ThemedTabBtn active={tab === 'banner'} onClick={() => setTab('banner')} icon={LinkedInIcon} label={L.banTab} theme={theme} />
          <ThemedTabBtn active={tab === 'settings'} onClick={() => setTab('settings')} icon={Settings} label={L.setTab} theme={theme} />
        </div>
      </nav>

      {/* Right side */}
      <LangToggle lang={lang} setLang={setLang} theme={theme} />

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
  );
});

export default AppHeader;
