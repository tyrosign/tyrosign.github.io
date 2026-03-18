import { memo } from 'react';

const TyroLogo = memo(({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 160 160" fill="none" style={{ filter: 'drop-shadow(0 2px 6px rgba(30,58,95,0.22))' }}>
    <defs>
      <linearGradient id="tlPenBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2e4d72" />
        <stop offset="45%" stopColor="#1e3a5f" />
        <stop offset="100%" stopColor="#152d4a" />
      </linearGradient>
      <linearGradient id="tlPenShine" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
        <stop offset="30%" stopColor="rgba(255,255,255,0.08)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
      </linearGradient>
      <linearGradient id="tlGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#e0a832" />
        <stop offset="50%" stopColor="#c8922a" />
        <stop offset="100%" stopColor="#a67820" />
      </linearGradient>
      <linearGradient id="tlGoldSig" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#c8922a" />
        <stop offset="60%" stopColor="#d4a23a" />
        <stop offset="100%" stopColor="#c8922a" />
      </linearGradient>
    </defs>

    {/* Gold signature stroke */}
    <path d="M28 128 C40 110, 48 132, 60 116 S76 104, 88 118 S100 128, 112 112 L118 108"
          fill="none" stroke="url(#tlGoldSig)" strokeWidth="3.5" strokeLinecap="round" />
    <circle cx="122" cy="106" r="2.5" fill="#c8922a" opacity="0.7" />

    {/* 3D Fountain Pen */}
    <g transform="translate(58, 8) rotate(40, 40, 40)">
      {/* Cap */}
      <rect x="34" y="0" width="16" height="14" rx="4" fill="url(#tlPenBody)" />
      <rect x="34" y="0" width="7" height="14" rx="4" fill="url(#tlPenShine)" />
      {/* Cap ring */}
      <rect x="33" y="12" width="18" height="3" rx="1" fill="#c8922a" opacity="0.9" />
      {/* Clip */}
      <rect x="49" y="2" width="3" height="22" rx="1.2" fill="url(#tlGold)" />
      <circle cx="50.5" cy="24" r="2" fill="#c8922a" />

      {/* Barrel */}
      <rect x="35" y="15" width="14" height="48" rx="2.5" fill="url(#tlPenBody)" />
      <rect x="35" y="15" width="6" height="48" rx="2.5" fill="url(#tlPenShine)" />
      {/* Barrel ring */}
      <rect x="34" y="56" width="16" height="3" rx="1" fill="#8a9bb5" opacity="0.5" />

      {/* Grip */}
      <rect x="36" y="60" width="12" height="12" rx="1.5" fill="#2a4d70" />
      <rect x="36" y="60" width="5" height="12" rx="1.5" fill="rgba(255,255,255,0.08)" />
      <line x1="36" y1="63" x2="48" y2="63" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
      <line x1="36" y1="66" x2="48" y2="66" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
      <line x1="36" y1="69" x2="48" y2="69" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />

      {/* Nib */}
      <polygon points="42,72 36,72 42,92 48,72" fill="url(#tlGold)" />
      <line x1="42" y1="74" x2="42" y2="90" stroke="#8a6a18" strokeWidth="0.7" />
      <circle cx="42" cy="91" r="1" fill="#e0b840" opacity="0.8" />
    </g>
  </svg>
));

export default TyroLogo;
