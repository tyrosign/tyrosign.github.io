import { memo, useEffect, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { X, Download } from 'lucide-react';
import { C } from '../constants/theme';
import { generateVCard } from '../utils/generateVCard';
import Btn from './ui/Btn';

const QrModal = memo(({ open, onClose, form, office, stg, company, L }) => {
  const canvasRef = useRef(null);

  // Generate QR code when modal opens or data changes
  useEffect(() => {
    if (!open || !canvasRef.current) return;

    const vcard = generateVCard(form, office, stg, company);

    QRCode.toCanvas(canvasRef.current, vcard, {
      width: 280,
      margin: 2,
      color: { dark: '#1e3a5f', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    }).catch(() => {});
  }, [open, form, office, stg, company]);

  // Download QR as PNG
  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    const name = [form.firstName, form.lastName].filter(Boolean).join('-') || 'qr';
    link.download = name.toLowerCase() + '-qr.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [form]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

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
        {/* Close button */}
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

        {/* Title */}
        <h3 style={{
          fontFamily: 'Plus Jakarta Sans,sans-serif',
          fontSize: '1rem', fontWeight: 700, color: C.primary,
          margin: '0 0 0.3rem',
        }}>
          {L.qrTitle}
        </h3>

        <p style={{ fontSize: '0.7rem', color: C.textM, margin: '0 0 1.2rem' }}>
          {L.qrScan}
        </p>

        {/* QR Canvas */}
        <div style={{
          display: 'inline-flex',
          padding: 16,
          background: '#fff',
          borderRadius: 12,
          border: `1px solid ${C.borderSub}`,
          boxShadow: '0 2px 8px rgba(30,58,95,0.06)',
          marginBottom: '1.2rem',
        }}>
          <canvas ref={canvasRef} style={{ display: 'block' }} />
        </div>

        {/* Name + Company label */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: C.primary }}>
            {[form.firstName, form.lastName].filter(Boolean).join(' ') || '—'}
          </div>
          <div style={{ fontSize: '0.68rem', color: C.textM, marginTop: 2 }}>
            {(company && company.name) || 'Tiryaki Agro'}
          </div>
        </div>

        {/* Download button */}
        <Btn onClick={handleDownload} icon={Download}>{L.qrDl}</Btn>
      </div>
    </div>
  );
});

export default QrModal;
