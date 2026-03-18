import { memo } from 'react';
import { Copy, Check, RefreshCw, Info } from 'lucide-react';
import { C } from '../constants/theme';

const QrIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="8" height="8" rx="1" /><rect x="14" y="2" width="8" height="8" rx="1" /><rect x="2" y="14" width="8" height="8" rx="1" />
    <path d="M14 14h2v2h-2zM20 14h2v2h-2zM14 20h2v2h-2zM20 20h2v2h-2zM17 17h2v2h-2z" fill="currentColor" stroke="none" />
  </svg>
);

const OutlookIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <path d="M22 6.5V17.5C22 18.33 21.33 19 20.5 19H8.5C7.67 19 7 18.33 7 17.5V6.5C7 5.67 7.67 5 8.5 5H20.5C21.33 5 22 5.67 22 6.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 8L14.5 13L22 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 7V18C2 18.55 2.45 19 3 19H7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CardIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <circle cx="8" cy="11" r="2" />
    <path d="M14 9h4M14 13h3" />
    <path d="M5 18c0-2 1.5-3 3-3s3 1 3 3" />
  </svg>
);

// Palette-mapped Apple-style solid buttons (uses theme constants)
const PAL = {
  navy:  { solid: C.primary,     shadow: `${C.primary}52`     },
  blue:  { solid: C.divider,     shadow: `${C.divider}52`     },
  gold:  { solid: C.accent,      shadow: `${C.accent}52`      },
  soft:  { solid: C.primarySoft, shadow: `${C.primarySoft}52` },
  gray:  { solid: C.textM,       shadow: `${C.textM}33`       },
  green: { solid: C.ok,          shadow: `${C.ok}52`          },
};

const btnBase = {
  flex: 1,
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.28rem',
  padding: '0.5rem 0.35rem',
  borderRadius: 10,
  border: 'none',
  fontSize: '0.67rem', fontWeight: 600, fontFamily: 'Inter,sans-serif',
  letterSpacing: '-0.15px',
  transition: 'all 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  cursor: 'pointer', whiteSpace: 'nowrap',
  color: '#fff',
};

const mkBtn = (pal, hasData) => ({
  ...btnBase,
  background: pal.solid,
  opacity: hasData ? 1 : 0.38,
  cursor: hasData ? 'pointer' : 'not-allowed',
  boxShadow: hasData
    ? `0 1px 2px rgba(0,0,0,0.08), 0 3px 10px ${pal.shadow}`
    : 'none',
});

const Tip = ({ text, children }) => (
  <div className="tip-wrap" style={{ flex: 1, display: 'flex' }}>
    {children}
    <span className="tip-box">{text}</span>
  </div>
);

const ExportSection = memo(({ hasData, copied, doCopy, doReset, onQrClick, onBcClick, onOutlookOpen, msalAccount, showSteps, setShowSteps, L }) => (
  <>
    <div className="export-btns" style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.6rem' }}>

      {/* 1. İmza Kopyala — Navy */}
      <Tip text={L.tipCopy}>
        <button onClick={doCopy} disabled={!hasData}
          style={{ ...mkBtn(copied ? PAL.green : PAL.navy, hasData), width: '100%' }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? L.cpd : L.cp}
        </button>
      </Tip>

      {/* 2. Outlook — Blue */}
      {msalAccount && (
        <Tip text={L.tipOutlook}>
          <button onClick={onOutlookOpen} disabled={!hasData}
            style={{ ...mkBtn(PAL.blue, hasData), width: '100%' }}
          >
            <OutlookIcon />
            {L.olOpen}
          </button>
        </Tip>
      )}

      {/* 3. QR Kod — Soft Navy */}
      <Tip text={L.tipQr}>
        <button onClick={onQrClick} disabled={!hasData}
          style={{ ...mkBtn(PAL.soft, hasData), width: '100%' }}
        >
          <QrIcon />
          {L.qrGen}
        </button>
      </Tip>

      {/* 4. Kartvizit — Gold */}
      <Tip text={L.tipBc}>
        <button onClick={onBcClick} disabled={!hasData}
          style={{ ...mkBtn(PAL.gold, hasData), width: '100%' }}
        >
          <CardIcon />
          {L.bcGen}
        </button>
      </Tip>

      {/* 5. Temizle — Gray */}
      <Tip text={L.tipReset}>
        <button onClick={doReset}
          style={{ ...mkBtn(PAL.gray, true), width: '100%' }}
        >
          <RefreshCw size={12} />
          {L.rst}
        </button>
      </Tip>
    </div>

    <div style={{ borderTop: `1px solid ${C.borderSub}`, paddingTop: '0.5rem' }}>
      <button
        onClick={() => setShowSteps(!showSteps)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem', width: '100%',
          background: 'none', border: 'none', cursor: 'pointer', padding: '0.15rem 0',
          marginBottom: showSteps ? '0.5rem' : 0,
        }}
      >
        <Info size={14} style={{ color: C.accent }} />
        <span style={{ fontSize: '0.76rem', fontWeight: 700, color: C.primary, fontFamily: 'Plus Jakarta Sans,sans-serif', flex: 1, textAlign: 'left' }}>{L.ht}</span>
        <span style={{
          fontSize: '0.7rem', color: C.textM, transition: 'transform 0.3s ease',
          transform: showSteps ? 'rotate(180deg)' : 'rotate(0deg)',
        }}>&#9662;</span>
      </button>
      {showSteps && (
        <div style={{ animation: 'fadeIn 0.25s ease' }}>
          {L.steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <span style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                width: 18, height: 18, borderRadius: '50%',
                background: `${C.divider}15`, color: C.divider,
                fontSize: '0.58rem', fontWeight: 700,
              }}>{i + 1}</span>
              <span style={{ fontSize: '0.63rem', color: C.text2, lineHeight: 1.5, paddingTop: '0.05rem' }}>{step}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  </>
));

export default ExportSection;
