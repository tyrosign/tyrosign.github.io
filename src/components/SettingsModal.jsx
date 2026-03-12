import { memo } from 'react';
import {
  Settings, X, Image, Home, Eye, Star, Globe,
  Upload, RefreshCw, Linkedin, Twitter, Facebook, Instagram,
} from 'lucide-react';
import { C } from '../constants/theme';
import { debouncedColor } from '../utils/debouncedColor';
import FormField from './ui/FormField';
import ToggleSwitch from './ui/ToggleSwitch';
import ColorPicker from './ui/ColorPicker';

const SETTINGS_TABS = [
  { id: 'logo', icon: Image, labelKey: 'sTabLogo' },
  { id: 'company', icon: Home, labelKey: 'sTabCompany' },
  { id: 'signature', icon: Eye, labelKey: 'sTabSig' },
  { id: 'style', icon: Star, labelKey: 'sTabStyle' },
  { id: 'social', icon: Globe, labelKey: 'sTabSocial' },
];

const SettingsModal = memo(({
  setTab, settingsTab, setSettingsTab, stg, setStg, fRef, procLogo, toast, lang, L,
  DEFAULT_LOGO_BASE64,
}) => (
  <>
    {/* Backdrop */}
    <div onClick={() => setTab('signature')} style={{
      position: 'fixed', inset: 0, zIndex: 900,
      background: 'rgba(15,25,40,0.35)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
      animation: 'fadeIn 0.25s ease',
    }} />
    {/* Modal */}
    <div className="settings-modal" role="dialog" aria-modal="true" style={{
      position: 'fixed', zIndex: 901, top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '92vw', maxWidth: 720, height: '70vh',
      background: C.surfaceSolid, borderRadius: 18,
      boxShadow: '0 24px 80px rgba(15,25,40,0.25), 0 8px 24px rgba(15,25,40,0.12)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      animation: 'fadeIn 0.2s ease',
    }}>
      {/* Modal Header */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '1rem 1.25rem',
        borderBottom: `1px solid ${C.borderSub}`,
        background: `linear-gradient(180deg, #fff, ${C.bgFlat})`,
      }}>
        <Settings size={16} style={{ color: C.accent, marginRight: '0.5rem' }} />
        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: C.primary, fontFamily: 'Plus Jakarta Sans,sans-serif', flex: 1 }}>{L.setTab}</span>
        <button onClick={() => setTab('signature')} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 28, height: 28, borderRadius: 8, border: `1px solid ${C.borderSub}`,
          background: 'transparent', cursor: 'pointer', color: C.textM,
          transition: 'all 0.2s',
        }}><X size={14} /></button>
      </div>

      {/* Modal Tabs */}
      <div style={{ padding: '0.6rem 1.25rem', borderBottom: `1px solid ${C.borderSub}` }}>
        <div className="settings-tabs-inner" style={{
          position: 'relative', display: 'flex', gap: '2px',
          background: 'transparent', borderRadius: 10, padding: 3,
        }}>
          <span style={{
            position: 'absolute', top: 3, bottom: 3,
            left: `calc(${SETTINGS_TABS.findIndex(t => t.id === settingsTab)} * 20% + 3px)`,
            width: 'calc(20% - 2px)',
            background: '#fff', borderRadius: 8,
            boxShadow: '0 1px 3px rgba(30,58,95,0.1), 0 1px 2px rgba(30,58,95,0.06)',
            transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }} />
          {SETTINGS_TABS.map(t => {
            const act = settingsTab === t.id;
            return (
              <button className="settings-tab-btn" key={t.id} onClick={() => setSettingsTab(t.id)} style={{
                position: 'relative', zIndex: 1, flex: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
                padding: '0.38rem 0.4rem', borderRadius: 7, border: 'none', cursor: 'pointer',
                background: 'transparent',
                color: act ? C.primary : C.text2,
                fontSize: '0.66rem', fontWeight: act ? 700 : 500, fontFamily: 'Inter,sans-serif',
                transition: 'color 0.25s ease',
              }}>
                <t.icon size={11} style={{ color: act ? C.accent : C.textM, transition: 'color 0.25s' }} />{L[t.labelKey]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal Content */}
      <div className="settings-content" style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>

        {/* LOGO TAB */}
        {settingsTab === 'logo' && (
          <div style={{ animation: 'fadeIn 0.2s ease' }}>
            {stg.logoBase64 ? (
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '0.9rem',
                background: C.primaryGhost, borderRadius: '10px', border: `1px solid ${C.borderSub}`, flexWrap: 'wrap',
              }}>
                <div style={{ padding: '0.5rem', borderRadius: '8px', border: `1px solid ${C.borderSub}`, background: '#fff' }}>
                  <img src={stg.logoBase64} alt="Logo" style={{ maxWidth: 160, maxHeight: 60, display: 'block' }} />
                </div>
                <div>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: C.text1, marginBottom: '0.4rem' }}>{stg.logoW}x{stg.logoH}px</p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    {[{ label: L.lw, value: stg.logoW, key: 'logoW', min: 20, max: 300 }, { label: L.llh, value: stg.logoH, key: 'logoH', min: 10, max: 150 }].map(({ label, value, key, min, max }) => (
                      <div key={key}>
                        <label style={{ fontSize: '0.55rem', color: C.textM, display: 'block', marginBottom: 2 }}>{label}</label>
                        <input type="number" value={value} min={min} max={max}
                          onChange={e => { const v = parseInt(e.target.value) || (key === 'logoW' ? 100 : 50); setStg(p => ({ ...p, [key]: v })); }}
                          style={{ width: 64, padding: '0.25rem 0.4rem', border: `1px solid ${C.borderSub}`, borderRadius: '6px', fontSize: '0.72rem', boxSizing: 'border-box', background: '#fff', color: C.text1 }}
                        />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button onClick={() => fRef.current?.click()} style={{ padding: '0.35rem 0.6rem', borderRadius: '6px', border: `1px solid ${C.borderSub}`, background: '#fff', cursor: 'pointer', fontSize: '0.62rem', color: C.text2, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Upload size={10} /> {L.lch}
                    </button>
                    <button onClick={() => { setStg(p => ({ ...p, logoBase64: DEFAULT_LOGO_BASE64, logoW: 140, logoH: 45 })); toast(L.lr, 'info'); }} style={{ padding: '0.35rem 0.6rem', borderRadius: '6px', border: `1px solid ${C.borderSub}`, background: 'transparent', cursor: 'pointer', fontSize: '0.62rem', color: C.text2, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <RefreshCw size={10} /> {L.lr}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div onClick={() => fRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); if (e.dataTransfer.files?.[0]) procLogo(e.dataTransfer.files[0]); }}
                style={{ border: `2px dashed ${C.accent}50`, borderRadius: '12px', padding: '2.5rem', textAlign: 'center', cursor: 'pointer', background: C.accentGhost }}>
                <Upload size={28} style={{ color: C.accent, marginBottom: '0.5rem', opacity: 0.7 }} />
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: C.text1 }}>{L.lub}</p>
                <p style={{ fontSize: '0.62rem', color: C.textM, marginTop: '0.2rem' }}>{L.lh}</p>
              </div>
            )}
            <input ref={fRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) procLogo(e.target.files[0]); }} />
          </div>
        )}

        {/* COMPANY TAB */}
        {settingsTab === 'company' && (
          <div style={{ animation: 'fadeIn 0.2s ease' }}>
            <FormField label={L.cn} value={stg.companyName} onChange={e => setStg(p => ({ ...p, companyName: e.target.value }))} />
            <div className="company-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <FormField label={L.ws} value={stg.website} onChange={e => setStg(p => ({ ...p, website: e.target.value }))} />
              <FormField label={L.sl} value={stg.slogan} onChange={e => setStg(p => ({ ...p, slogan: e.target.value }))} />
            </div>
            <div className="settings-color-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
              <ColorPicker label={L.lc} value={stg.logoColor} onChange={e => debouncedColor('logoColor', e.target.value, setStg)} />
              <ColorPicker label={L.ac} value={stg.accentColor} onChange={e => debouncedColor('accentColor', e.target.value, setStg)} />
            </div>
          </div>
        )}

        {/* SIGNATURE OPTIONS TAB */}
        {settingsTab === 'signature' && (
          <div style={{ animation: 'fadeIn 0.2s ease' }}>
            <ToggleSwitch label={L.showSDN} checked={stg.showSDN} onChange={v => setStg(p => ({ ...p, showSDN: v }))} />
            <ToggleSwitch label={L.showFax} checked={stg.showFax} onChange={v => setStg(p => ({ ...p, showFax: v }))} />
            <ToggleSwitch label={L.showAddr} checked={stg.showAddress} onChange={v => setStg(p => ({ ...p, showAddress: v }))} />
            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: `1px solid ${C.borderSub}` }}>
              <ToggleSwitch label={L.showRB} checked={stg.showRightBlock} onChange={v => setStg(p => ({ ...p, showRightBlock: v }))} />
              {stg.showRightBlock && (
                <div style={{ paddingLeft: '1rem', borderLeft: `2px solid ${C.accent}30`, marginLeft: '0.25rem', marginTop: '0.25rem', animation: 'fadeIn 0.2s ease' }}>
                  <ToggleSwitch label={L.showLi} checked={stg.showLinkedin} onChange={v => setStg(p => ({ ...p, showLinkedin: v }))} />
                  <ToggleSwitch label={L.showTw} checked={stg.showTwitter} onChange={v => setStg(p => ({ ...p, showTwitter: v }))} />
                  <ToggleSwitch label={L.showFb} checked={stg.showFacebook} onChange={v => setStg(p => ({ ...p, showFacebook: v }))} />
                  <ToggleSwitch label={L.showIg} checked={stg.showInstagram} onChange={v => setStg(p => ({ ...p, showInstagram: v }))} />
                  <ToggleSwitch label={L.showWs} checked={stg.showWebsite} onChange={v => setStg(p => ({ ...p, showWebsite: v }))} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* STYLE TAB */}
        {settingsTab === 'style' && (
          <div style={{ animation: 'fadeIn 0.2s ease' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: C.primary, marginBottom: '0.6rem' }}>{L.sigStyle}</p>
            <div className="settings-color-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.2rem' }}>
              <ColorPicker label={L.divColor} value={stg.dividerColor} onChange={e => debouncedColor('dividerColor', e.target.value, setStg)} />
              <ColorPicker label={L.rbBg} value={stg.rightBlockBg} onChange={e => debouncedColor('rightBlockBg', e.target.value, setStg)} />
              <div>
                <label style={{ fontSize: '0.67rem', fontWeight: 600, color: C.text2, marginBottom: '0.4rem', display: 'block' }}>{L.divWidth}: {stg.dividerWidth}px</label>
                <input type="range" min={1} max={5} value={stg.dividerWidth}
                  onChange={e => setStg(p => ({ ...p, dividerWidth: parseInt(e.target.value) }))}
                  style={{ width: '100%', accentColor: C.accent, cursor: 'pointer' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.67rem', fontWeight: 600, color: C.text2, marginBottom: '0.4rem', display: 'block' }}>{L.rbRadius}: {stg.rightBlockRadius}px</label>
                <input type="range" min={0} max={12} value={stg.rightBlockRadius}
                  onChange={e => setStg(p => ({ ...p, rightBlockRadius: parseInt(e.target.value) }))}
                  style={{ width: '100%', accentColor: C.accent, cursor: 'pointer' }} />
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${C.borderSub}`, paddingTop: '1rem', marginBottom: '1.2rem' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, color: C.primary, marginBottom: '0.6rem' }}>{L.textColorsTitle}</p>
              <div className="settings-color-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.85rem' }}>
                <ColorPicker label={L.nameColorL} value={stg.nameColor} onChange={e => debouncedColor('nameColor', e.target.value, setStg)} />
                <ColorPicker label={L.titleColorL} value={stg.titleColor} onChange={e => debouncedColor('titleColor', e.target.value, setStg)} />
                <ColorPicker label={L.companyColorL} value={stg.companyTextColor} onChange={e => debouncedColor('companyTextColor', e.target.value, setStg)} />
                <ColorPicker label={L.labelColorL} value={stg.contactLabelColor} onChange={e => debouncedColor('contactLabelColor', e.target.value, setStg)} />
                <ColorPicker label={L.valueColorL} value={stg.contactValueColor} onChange={e => debouncedColor('contactValueColor', e.target.value, setStg)} />
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${C.borderSub}`, paddingTop: '1rem' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, color: C.primary, marginBottom: '0.6rem' }}>{L.bannerColorsTitle}</p>
              <div>
                <ColorPicker label={L.bannerAccentL} value={stg.bannerAccentColor || '#c8922a'} onChange={e => debouncedColor('bannerAccentColor', e.target.value, setStg)} />
                {stg.bannerAccentColor && (
                  <button onClick={() => setStg(p => ({ ...p, bannerAccentColor: '' }))} style={{
                    fontSize: '0.55rem', color: C.textM, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', marginTop: '0.3rem',
                  }}>reset</button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SOCIAL TAB */}
        {settingsTab === 'social' && (
          <div style={{ animation: 'fadeIn 0.2s ease' }}>
            <div className="social-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.75rem' }}>
              {[
                { icon: Linkedin, label: 'LinkedIn', key: 'linkedin' },
                { icon: Twitter, label: 'X (Twitter)', key: 'twitter' },
                { icon: Facebook, label: 'Facebook', key: 'facebook' },
                { icon: Instagram, label: 'Instagram', key: 'instagram' },
              ].map(({ label, key }) => (
                <FormField key={key} label={label} value={stg.social[key]}
                  onChange={e => setStg(p => ({ ...p, social: { ...p.social, [key]: e.target.value } }))} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </>
));

export default SettingsModal;
