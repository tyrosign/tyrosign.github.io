import { memo } from 'react';
import { Eye, Image, Download } from 'lucide-react';
import { C } from '../constants/theme';
import { BANNER_TEMPLATES, BANNER_SIZES } from '../constants/bannerConfig';
import GlassCard from './ui/GlassCard';
import SectionTitle from './ui/SectionTitle';
import FormField from './ui/FormField';
import Btn from './ui/Btn';

const BannerTab = memo(({ banner, setBanner, stg, canvasRef, downloadBanner, L }) => (
  <div style={{ animation: 'fadeIn 0.35s cubic-bezier(0.22, 1, 0.36, 1)' }}>
    <div className="sig-layout banner-flex" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
      <div className="banner-left" style={{ flex: '0 0 320px', minWidth: 0, animation: 'slideInLeft 0.4s ease-out' }}>
        <GlassCard accent>
          <SectionTitle icon={Image}>{L.banTab}</SectionTitle>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.7rem', fontWeight: 600, color: C.text2, marginBottom: '0.4rem', display: 'block' }}>{L.banTpl}</label>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {BANNER_TEMPLATES.map(t => (
                <button key={t.id} onClick={() => setBanner(p => ({ ...p, template: t.id }))} style={{
                  flex: 1, padding: '0.5rem', borderRadius: '8px', cursor: 'pointer',
                  border: banner.template === t.id ? `2px solid ${C.accent}` : `1px solid ${C.borderSub}`,
                  background: t.bg, color: t.textColor, fontSize: '0.62rem', fontWeight: 600,
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: banner.template === t.id ? 'scale(1.04)' : 'scale(1)',
                }}>{t.name}</button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.7rem', fontWeight: 600, color: C.text2, marginBottom: '0.4rem', display: 'block' }}>{L.banSize}</label>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {BANNER_SIZES.map(s => (
                <button key={s.id} onClick={() => setBanner(p => ({ ...p, size: s.id }))} style={{
                  flex: 1, padding: '0.45rem 0.6rem', borderRadius: '7px', cursor: 'pointer',
                  border: banner.size === s.id ? `2px solid ${C.accent}` : `1px solid ${C.borderSub}`,
                  background: banner.size === s.id ? C.accentGhost : 'transparent',
                  color: C.text2, fontSize: '0.65rem', fontWeight: 600,
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                }}>
                  <div>{s.label}</div>
                  <div style={{ fontSize: '0.55rem', color: C.textM, marginTop: 2 }}>{s.w}x{s.h}</div>
                </button>
              ))}
            </div>
          </div>
          <FormField label={L.banTitle} value={banner.title} onChange={e => setBanner(p => ({ ...p, title: e.target.value }))} placeholder={stg.companyName} />
          <FormField label={L.banSub} value={banner.subtitle} onChange={e => setBanner(p => ({ ...p, subtitle: e.target.value }))} placeholder={stg.slogan} />
          <Btn onClick={downloadBanner} icon={Download}>{L.banDl}</Btn>
        </GlassCard>
      </div>
      <div className="sig-right" style={{ flex: 1, minWidth: 0, animation: 'slideInRight 0.4s ease-out' }}>
        <GlassCard accent>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.85rem' }}>
            <Eye size={15} style={{ color: C.accent }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: C.primary, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>{L.banPrev}</span>
          </div>
          <canvas ref={canvasRef} style={{ width: '100%', height: 'auto', borderRadius: '8px', border: `1px solid ${C.borderSub}`, display: 'block' }} />
        </GlassCard>
      </div>
    </div>
  </div>
));

export default BannerTab;
