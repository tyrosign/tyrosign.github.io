import { memo } from 'react';
import { Upload, Trash, Image } from 'lucide-react';
import { C } from '../constants/theme';
import { sanitizeUrl } from '../utils/formatting';
import GlassCard from './ui/GlassCard';
import SectionTitle from './ui/SectionTitle';
import FormField from './ui/FormField';
import ToggleSwitch from './ui/ToggleSwitch';

const PromoBannerSection = memo(({ sigBanner, setSigBanner, bannerFileRef, procBanner, lang, L }) => (
  <div className="sig-sec-banner" style={{ gridColumn: '1 / -1', animation: 'fadeIn 0.4s ease-out' }}>
    <GlassCard accent>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: sigBanner.enabled ? '0.75rem' : 0 }}>
        <div>
          <SectionTitle icon={Image}>{L.proBanner}</SectionTitle>
          <p style={{ fontSize: '0.62rem', color: C.textM, marginTop: '-0.4rem', marginBottom: '0.2rem' }}>{L.proBannerDesc}</p>
        </div>
        <div style={{ paddingTop: '0.2rem' }}>
          <ToggleSwitch label="" checked={sigBanner.enabled} onChange={(v) => setSigBanner(p => ({ ...p, enabled: v }))} />
        </div>
      </div>

      {sigBanner.enabled && (
        <div style={{ animation: 'fadeIn 0.25s ease' }}>
          {sigBanner.base64 ? (
            <div>
              <div style={{
                padding: '0.75rem', background: C.primaryGhost, borderRadius: 10,
                border: `1px solid ${C.borderSub}`, marginBottom: '0.75rem',
              }}>
                <div style={{ borderRadius: 8, overflow: 'hidden', border: `1px solid ${C.borderSub}`, background: '#fff' }}>
                  {sigBanner.linkUrl ? (
                    <a href={sanitizeUrl(sigBanner.linkUrl)} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                      <img src={sigBanner.base64} alt={sigBanner.alt || 'Banner'} style={{ display: 'block', maxWidth: '100%', height: 'auto' }} />
                    </a>
                  ) : (
                    <img src={sigBanner.base64} alt={sigBanner.alt || 'Banner'} style={{ display: 'block', maxWidth: '100%', height: 'auto' }} />
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.6rem', color: C.textM }}>{sigBanner.width}x{sigBanner.height}px</span>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button onClick={() => bannerFileRef.current?.click()} style={{
                      padding: '0.3rem 0.55rem', borderRadius: 6, border: `1px solid ${C.borderSub}`,
                      background: '#fff', cursor: 'pointer', fontSize: '0.6rem', color: C.text2,
                      display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Inter,sans-serif',
                    }}>
                      <Upload size={10} /> {lang === 'tr' ? 'Değiştir' : 'Change'}
                    </button>
                    <button onClick={() => setSigBanner(p => ({ ...p, base64: '', width: 0, height: 0 }))} style={{
                      padding: '0.3rem 0.55rem', borderRadius: 6, border: `1px solid ${C.borderSub}`,
                      background: 'transparent', cursor: 'pointer', fontSize: '0.6rem', color: C.err,
                      display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Inter,sans-serif',
                    }}>
                      <Trash size={10} /> {L.proBannerRemove}
                    </button>
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.5rem' }}>
                <FormField label={L.proBannerLink} value={sigBanner.linkUrl}
                  onChange={e => setSigBanner(p => ({ ...p, linkUrl: e.target.value }))}
                  placeholder="https://tiryaki.com.tr/fuar" />
                <FormField label={L.proBannerAlt} value={sigBanner.alt}
                  onChange={e => setSigBanner(p => ({ ...p, alt: e.target.value }))}
                  placeholder={lang === 'tr' ? 'Fuar 2026' : 'Fair 2026'} />
              </div>
            </div>
          ) : (
            <div
              onClick={() => bannerFileRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); if (e.dataTransfer.files?.[0]) procBanner(e.dataTransfer.files[0]); }}
              style={{
                border: `2px dashed ${C.accent}50`, borderRadius: 12, padding: '1.8rem 1rem',
                textAlign: 'center', cursor: 'pointer', background: C.accentGhost,
                transition: 'all 0.25s ease',
              }}
            >
              <Upload size={26} style={{ color: C.accent, marginBottom: '0.4rem', opacity: 0.7 }} />
              <p style={{ fontSize: '0.78rem', fontWeight: 700, color: C.text1 }}>{L.proBannerUpload}</p>
              <p style={{ fontSize: '0.58rem', color: C.textM, marginTop: '0.15rem' }}>{L.proBannerHint}</p>
            </div>
          )}
          <input ref={bannerFileRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={e => { if (e.target.files?.[0]) procBanner(e.target.files[0]); }} />
        </div>
      )}
    </GlassCard>
  </div>
));

export default PromoBannerSection;
