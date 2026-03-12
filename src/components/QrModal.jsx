import { memo, useEffect, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { X, Download } from 'lucide-react';
import { C } from '../constants/theme';
import { generateVCard } from '../utils/generateVCard';
import Btn from './ui/Btn';

const NAVY = '#1e3a5f';
const GOLD = '#c8922a';
const BLUE = '#0098d4';

function titleCase(str) {
  if (!str) return '';
  return str.replace(/\S+/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

function formatName(form) {
  return [titleCase(form.firstName), titleCase(form.lastName)].filter(Boolean).join(' ') || '—';
}

/**
 * Draws a vertical business card: QR top, info below — matches modal preview
 */
async function drawCardCanvas(qrDataUrl, form, stg, company) {
  const W = 420;
  const qrSize = 220;
  const qrPad = 12;
  const qrBoxSize = qrSize + qrPad * 2;

  const fullName = formatName(form);
  const companyName = (company && company.name) || stg.companyName || 'Tiryaki Agro';
  const titleText = [form.titleTR, form.titleEN].filter(Boolean).join(' / ');

  // Height calc — matches modal spacing exactly
  let H = 0;
  H += 6;              // top navy bar
  H += 24;             // padding above QR
  H += qrBoxSize;      // QR + bg padding
  H += 20;             // gap QR → name
  H += 26;             // name line
  H += 4;              // name → divider gap
  H += 3;              // divider
  H += 8;              // divider → company gap
  H += 18;             // company
  if (titleText) H += 18;
  if (form.gsm) H += 18;
  if (form.email) H += 18;
  H += 24;             // bottom hint
  H += 4;              // bottom gold bar

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  // Top navy bar
  ctx.fillStyle = NAVY;
  ctx.fillRect(0, 0, W, 6);

  // Bottom gold accent line
  ctx.fillStyle = GOLD;
  ctx.fillRect(0, H - 4, W, 4);

  ctx.textAlign = 'center';
  let y = 6 + 24; // after top bar + padding

  // QR background box
  const qrBoxX = (W - qrBoxSize) / 2;
  ctx.fillStyle = '#f8f9fc';
  ctx.beginPath();
  roundRect(ctx, qrBoxX, y, qrBoxSize, qrBoxSize, 10);
  ctx.fill();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  roundRect(ctx, qrBoxX, y, qrBoxSize, qrBoxSize, 10);
  ctx.stroke();

  // Draw QR — wait for image to load
  const qrImgX = qrBoxX + qrPad;
  const qrImgY = y + qrPad;
  await new Promise((resolve) => {
    const qrImg = new window.Image();
    qrImg.onload = () => {
      ctx.drawImage(qrImg, qrImgX, qrImgY, qrSize, qrSize);
      resolve();
    };
    qrImg.src = qrDataUrl;
  });

  y += qrBoxSize + 20; // gap after QR box

  // Name
  ctx.fillStyle = NAVY;
  ctx.font = 'bold 20px "Plus Jakarta Sans", "Inter", Arial, sans-serif';
  ctx.fillText(fullName, W / 2, y + 16);
  y += 26 + 4; // name height + gap

  // Divider
  ctx.fillStyle = BLUE;
  ctx.fillRect(W / 2 - 25, y, 50, 3);
  y += 3 + 8; // divider + gap

  // Company
  ctx.fillStyle = NAVY;
  ctx.font = 'bold 13px "Inter", Arial, sans-serif';
  ctx.fillText(companyName, W / 2, y + 12);
  y += 18;

  // Title
  if (titleText) {
    ctx.fillStyle = '#666666';
    ctx.font = '11px "Inter", Arial, sans-serif';
    ctx.fillText(titleText, W / 2, y + 11);
    y += 18;
  }

  // GSM
  if (form.gsm) {
    ctx.fillStyle = '#777777';
    ctx.font = '11px "Inter", Arial, sans-serif';
    ctx.fillText('📱 ' + form.gsm, W / 2, y + 11);
    y += 18;
  }

  // Email
  if (form.email) {
    ctx.fillStyle = '#888888';
    ctx.font = '11px "Inter", Arial, sans-serif';
    ctx.fillText('✉ ' + form.email, W / 2, y + 11);
    y += 18;
  }

  // Bottom hint
  ctx.fillStyle = '#bbbbbb';
  ctx.font = 'italic 9px "Inter", Arial, sans-serif';
  ctx.fillText('Scan QR to save contact', W / 2, H - 12);

  return canvas;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

const QrModal = memo(({ open, onClose, form, office, stg, company, L }) => {
  const canvasRef = useRef(null);

  // Generate QR code
  useEffect(() => {
    if (!open || !canvasRef.current) return;
    const vcard = generateVCard(form, office, stg, company);
    QRCode.toCanvas(canvasRef.current, vcard, {
      width: 280,
      margin: 2,
      color: { dark: NAVY, light: '#ffffff' },
      errorCorrectionLevel: 'M',
    }).catch(() => {});
  }, [open, form, office, stg, company]);

  // Download styled card
  const handleDownload = useCallback(async () => {
    const qrCanvas = canvasRef.current;
    if (!qrCanvas) return;
    const qrDataUrl = qrCanvas.toDataURL('image/png');
    const cardCanvas = await drawCardCanvas(qrDataUrl, form, stg, company);
    const link = document.createElement('a');
    const name = [form.firstName, form.lastName].filter(Boolean).join('-') || 'qr';
    link.download = name.toLowerCase() + '-business-card.png';
    link.href = cardCanvas.toDataURL('image/png');
    link.click();
  }, [form, stg, company]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const fullName = formatName(form);
  const companyName = (company && company.name) || 'Tiryaki Agro';
  const titleText = [form.titleTR, form.titleEN].filter(Boolean).join(' · ');

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(30,58,95,0.35)',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeIn 0.25s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 16,
          border: `1px solid ${C.borderSub}`,
          boxShadow: '0 24px 48px rgba(30,58,95,0.18), 0 8px 16px rgba(30,58,95,0.08)',
          padding: '1.8rem',
          minWidth: 340, maxWidth: 400,
          textAlign: 'center',
          position: 'relative',
          animation: 'slideInUp 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 12, right: 12,
            background: 'none', border: 'none', cursor: 'pointer',
            color: C.textM, padding: 4, borderRadius: 6,
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = C.primary}
          onMouseLeave={e => e.currentTarget.style.color = C.textM}
        >
          <X size={18} />
        </button>

        {/* Modal title */}
        <h3 style={{
          fontFamily: 'Plus Jakarta Sans,sans-serif',
          fontSize: '1rem', fontWeight: 700, color: C.primary,
          margin: '0 0 0.3rem',
        }}>
          {L.qrTitle}
        </h3>
        <p style={{ fontSize: '0.7rem', color: C.textM, margin: '0 0 1rem' }}>
          {L.qrScan}
        </p>

        {/* Card preview — vertical: QR top, info below */}
        <div style={{
          display: 'inline-block',
          padding: '1rem',
          background: '#fff',
          borderRadius: 12,
          border: `1px solid ${C.borderSub}`,
          boxShadow: '0 2px 8px rgba(30,58,95,0.06)',
          marginBottom: '1rem',
          borderTop: `4px solid ${NAVY}`,
        }}>
          {/* QR */}
          <div style={{
            display: 'inline-flex',
            background: '#f8f9fc',
            borderRadius: 8,
            padding: 8,
            border: '1px solid #e2e8f0',
            marginBottom: '0.8rem',
          }}>
            <canvas ref={canvasRef} style={{ display: 'block', width: 160, height: 160 }} />
          </div>

          {/* Name */}
          <div style={{
            fontSize: '0.95rem', fontWeight: 700, color: NAVY,
            fontFamily: 'Plus Jakarta Sans,sans-serif',
            marginBottom: 4,
          }}>
            {fullName || '—'}
          </div>

          {/* Divider */}
          <div style={{ width: 40, height: 2, background: BLUE, borderRadius: 1, margin: '0 auto 6px' }} />

          {/* Company + Title */}
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: NAVY, marginBottom: 2 }}>
            {companyName}
          </div>
          {titleText && (
            <div style={{ fontSize: '0.62rem', color: '#666', marginBottom: 4 }}>
              {titleText}
            </div>
          )}

          {/* GSM */}
          {form.gsm && (
            <div style={{ fontSize: '0.58rem', color: '#777', marginTop: 2 }}>
              📱 {form.gsm}
            </div>
          )}

          {/* Email */}
          {form.email && (
            <div style={{ fontSize: '0.58rem', color: '#888', marginTop: 2 }}>
              ✉ {form.email}
            </div>
          )}
        </div>

        {/* Download */}
        <div>
          <Btn onClick={handleDownload} icon={Download}>{L.qrDl}</Btn>
        </div>
      </div>
    </div>
  );
});

export default QrModal;
