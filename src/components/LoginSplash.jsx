import { memo } from 'react';
import { C } from '../constants/theme';

import { GLOBAL_CSS } from '../styles/globalCss';

const SPLASH_CSS = `
  @keyframes liquidA { 0%,100% { transform: translate(0,0) scale(1) rotate(0deg); } 33% { transform: translate(40px,-50px) scale(1.1) rotate(10deg); } 66% { transform: translate(-20px,30px) scale(0.95) rotate(-5deg); } }
  @keyframes liquidB { 0%,100% { transform: translate(0,0) scale(1) rotate(0deg); } 33% { transform: translate(-50px,40px) scale(1.15) rotate(-8deg); } 66% { transform: translate(30px,-20px) scale(0.9) rotate(12deg); } }
  @keyframes liquidC { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(25px,35px) scale(1.08); } }
  @keyframes splashFadeUp { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
  @keyframes splashLogoFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
  @keyframes splashPenWrite { 0% { stroke-dashoffset: 200; opacity: 0; } 30% { opacity: 1; } 100% { stroke-dashoffset: 0; opacity: 1; } }
  .splash-btn-ios:hover { transform: scale(1.02); box-shadow: 0 8px 30px rgba(30,58,95,0.2)!important; }
  .splash-btn-ios:active { transform: scale(0.98); }
`;

const LoginSplash = memo(({ lang, setLang, authLoading, msalReady, handleLogin }) => (
  <div style={{
    fontFamily: 'Inter,sans-serif',
    minHeight: '100vh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    background: '#f5f5f7',
    position: 'relative', overflow: 'hidden',
  }}>
    <style>{GLOBAL_CSS}{SPLASH_CSS}</style>

    {/* Liquid gradient blobs */}
    <div style={{
      position: 'absolute', width: 500, height: 500, borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
      background: 'linear-gradient(135deg, rgba(0,152,212,0.25), rgba(30,58,95,0.15))',
      top: '-15%', right: '-10%', animation: 'liquidA 15s ease-in-out infinite',
      filter: 'blur(60px)',
    }} />
    <div style={{
      position: 'absolute', width: 450, height: 450, borderRadius: '60% 40% 30% 70% / 50% 60% 40% 50%',
      background: 'linear-gradient(135deg, rgba(200,146,42,0.2), rgba(232,197,96,0.12))',
      bottom: '-12%', left: '-8%', animation: 'liquidB 18s ease-in-out infinite',
      filter: 'blur(60px)',
    }} />
    <div style={{
      position: 'absolute', width: 300, height: 300, borderRadius: '50% 60% 40% 70% / 60% 40% 60% 40%',
      background: 'linear-gradient(135deg, rgba(30,58,95,0.08), rgba(0,152,212,0.1))',
      top: '50%', left: '50%', marginLeft: -150, marginTop: -150,
      animation: 'liquidC 12s ease-in-out infinite',
      filter: 'blur(50px)',
    }} />

    {/* Main glass card */}
    <div style={{
      textAlign: 'center', padding: '2.5rem 2.5rem 2rem',
      background: 'rgba(255,255,255,0.55)',
      borderRadius: 28, maxWidth: 420, width: '88%',
      border: '1px solid rgba(255,255,255,0.6)',
      backdropFilter: 'blur(40px) saturate(180%)', WebkitBackdropFilter: 'blur(40px) saturate(180%)',
      boxShadow: '0 20px 60px rgba(30,58,95,0.08), 0 1px 3px rgba(30,58,95,0.05)',
      animation: 'splashFadeUp 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative', zIndex: 2,
    }}>
      {/* Three dots logo with float animation */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '1.2rem',
        animation: 'splashLogoFloat 4s ease-in-out infinite',
      }}>
        <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#1e3a5f', display: 'block' }} />
        <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#0098d4', display: 'block' }} />
        <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#c8922a', display: 'block' }} />
      </div>

      {/* App name */}
      <h1 style={{
        fontSize: '2rem', fontWeight: 800, color: C.primary,
        fontFamily: "'Plus Jakarta Sans',sans-serif", margin: '0 0 0.15rem',
        letterSpacing: '-1px',
      }}>
        <span>tyro</span>
        <span style={{ color: C.accent }}>sign</span>
      </h1>

      <p style={{
        fontSize: '0.78rem', color: '#8e8e93', margin: '0.25rem 0 2rem',
        fontWeight: 400,
      }}>
        {lang === 'tr' ? 'Kurumsal E-Posta İmza Oluşturucu' : 'Corporate Email Signature Studio'}
      </p>

      <button className="splash-btn-ios" onClick={handleLogin} disabled={authLoading || !msalReady} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
        width: '100%', padding: '0.85rem 1.5rem', borderRadius: 14,
        border: 'none',
        cursor: (authLoading || !msalReady) ? 'wait' : 'pointer',
        background: 'linear-gradient(135deg, #1e3a5f, #2a5f9e)',
        color: '#fff', fontSize: '0.88rem', fontWeight: 600,
        fontFamily: 'Inter,sans-serif',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 4px 16px rgba(30,58,95,0.25)',
        opacity: (authLoading || !msalReady) ? 0.6 : 1,
      }}>
        <svg width="18" height="18" viewBox="0 0 21 21" fill="none">
          <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
          <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
          <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
          <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
        </svg>
        {authLoading
          ? (lang === 'tr' ? 'Giriş yapılıyor...' : 'Signing in...')
          : (lang === 'tr' ? 'Microsoft ile Giriş Yap' : 'Sign in with Microsoft')
        }
      </button>

      <div style={{
        marginTop: '1.25rem', display: 'inline-flex',
        background: 'rgba(0,0,0,0.04)', borderRadius: 10, padding: 3,
      }}>
        {['tr', 'en'].map(l => (
          <button key={l} onClick={() => setLang(l)} style={{
            padding: '0.3rem 0.85rem', borderRadius: 8,
            border: 'none', cursor: 'pointer',
            fontSize: '0.65rem', fontWeight: 600,
            fontFamily: 'Inter,sans-serif',
            background: lang === l ? '#fff' : 'transparent',
            color: lang === l ? '#1e3a5f' : '#8e8e93',
            boxShadow: lang === l ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.2s ease',
          }}>{l.toUpperCase()}</button>
        ))}
      </div>
    </div>

    <div style={{
      marginTop: '2rem', textAlign: 'center',
      position: 'relative', zIndex: 2,
    }}>
      <p style={{
        fontSize: '0.7rem', fontWeight: 700, color: 'rgba(30,58,95,0.55)',
        fontFamily: 'Plus Jakarta Sans,sans-serif', letterSpacing: '2px',
        margin: '0 0 0.3rem',
      }}>TTECH BUSINESS SOLUTIONS</p>
      <p style={{
        fontSize: '0.58rem', color: 'rgba(30,58,95,0.35)', margin: 0,
      }}>
        {'© 2026 Tiryaki Agro'}
      </p>
    </div>
  </div>
));

export default LoginSplash;
