import { memo } from 'react';
import { C } from '../constants/theme';
/* StreamLogo — same as AppHeader */
const StreamLogoLogin = () => (
  <svg viewBox="0 0 150 150" fill="none" width={52} height={52}>
    <defs>
      <linearGradient id="slGoldL" x1="61.29" y1="33.97" x2="14.04" y2="103.35" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#e0a832" />
        <stop offset="1" stopColor="#a67820" />
      </linearGradient>
    </defs>
    <path fill="url(#slGoldL)" d="M14.52,68.93v33.41s-.28,6.49,3.59,4.28c10.49-6.21,21.95-12.7,26.51-15.05,9.39-4.69,8.01-10.49,8.01-10.49V48.77c0-8.42-5.8-4.69-5.8-4.69l-28.16,16.15s-4.14,2.35-4.14,8.7Z" />
    <path fill="#1e3a5f" d="M97.77,70.17v40.31s1.52,10.91-7.45,15.88l-25.68,15.19s-6.9,3.31-6.49-2.76l1.66-48.73,37.96-19.88Z" />
    <path fill="#0098d4" d="M58.15,137.95V66.72s-1.52-13.67,18.5-24.99l54.94-31.61s5.8-3.59,5.8,4.69V47.12s1.52,5.8-8.01,10.49c-9.53,4.69-47.9,27.61-47.9,27.61,0,0-23.33,11.87-23.33,52.74Z" />
    <path fill="#152d4a" d="M84.52,91.98s5.52-3.31,13.25-7.87v-8.28c-9.11,5.25-16.43,9.66-16.43,9.66,0,0-20.29,10.35-22.92,45.14v1.1c7.32-30.23,26.09-39.76,26.09-39.76Z" />
  </svg>
);

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
      {/* Stream Logo + tyrosign */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
        <StreamLogoLogin />
        <span style={{
          fontFamily: "'Baloo 2', 'Plus Jakarta Sans', Inter, sans-serif",
          fontSize: 32, fontWeight: 700, letterSpacing: -1.5, lineHeight: 1,
        }}>
          <span style={{ color: '#1e3a5f' }}>tyro</span>
          <span style={{ color: '#c8922a' }}>sign</span>
        </span>
      </div>

      <p style={{
        fontSize: '0.78rem', color: '#8e8e93', margin: '0.25rem 0 2rem',
        fontWeight: 400,
      }}>
        {lang === 'tr' ? 'Kurumsal Mail İmza & Kart Yönetimi' : 'Corporate Email Signature & Card Management'}
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
