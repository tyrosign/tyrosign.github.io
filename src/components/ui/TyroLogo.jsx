import { memo } from 'react';

const TyroLogo = memo(({ size = 36 }) => (
  <svg width={size} height={size * 0.85} viewBox="0 0 56 48" fill="none" style={{ filter: 'drop-shadow(0 1px 4px rgba(30,58,95,0.18))' }}>
    <defs>
      <linearGradient id="penBody" x1="10" y1="40" x2="48" y2="8">
        <stop offset="0%" stopColor="#1a2d47" />
        <stop offset="50%" stopColor="#1e3a5f" />
        <stop offset="100%" stopColor="#152a45" />
      </linearGradient>
      <linearGradient id="penGold" x1="0" y1="0" x2="20" y2="20">
        <stop offset="0%" stopColor="#f0d878" />
        <stop offset="50%" stopColor="#c8922a" />
        <stop offset="100%" stopColor="#a67520" />
      </linearGradient>
      <linearGradient id="sigInk" x1="4" y1="42" x2="32" y2="42" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0" />
        <stop offset="20%" stopColor="#1e3a5f" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#1e3a5f" stopOpacity="0.55" />
      </linearGradient>
    </defs>
    <path d="M4 42 C8 38, 10 45, 15 41 Q18 38, 20 41 C22 44, 25 35, 28 39 Q30 42, 32 37" stroke="url(#sigInk)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    <path d="M32 37 L50 10" stroke="url(#penBody)" strokeWidth="5" strokeLinecap="round" />
    <path d="M33 35 L49.5 11" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M38 28 L39 26.5" stroke="url(#penGold)" strokeWidth="6" strokeLinecap="butt" />
    <path d="M47.5 13.5 C50 12, 51.5 9, 50 7.5" stroke="url(#penGold)" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    <path d="M32 37 L34.5 33 L36 31.5 L34 34 Z" fill="url(#penGold)" />
    <path d="M32.5 36.5 L35 32.5" stroke="#8a6218" strokeWidth="0.5" strokeLinecap="round" opacity="0.5" />
    <circle cx="32" cy="37.5" r="1.2" fill="#1e3a5f" opacity="0.4" />
  </svg>
));

export default TyroLogo;
