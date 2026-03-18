import { memo, useState, useCallback, useMemo, lazy, Suspense } from 'react';
import { User, Phone, Eye, Download } from 'lucide-react';
import { C } from '../constants/theme';
import { OFFICES, OFFICE_GROUPS } from '../constants/offices';
import { COMPANIES, COMPANY_GROUPS, COMPANY_GROUP_LABELS_EN } from '../constants/companies';
import GlassCard from './ui/GlassCard';
import SectionTitle from './ui/SectionTitle';
import FormField from './ui/FormField';
import SearchableSelect from './ui/SearchableSelect';
import ProgressBar from './ProgressBar';
import DesignSwitcher from './DesignSwitcher';
import OutlookPreview from './OutlookPreview';
import ExportSection from './ExportSection';
import PromoBannerSection from './PromoBannerSection';

// Lazy-load heavy modals (QR + BusinessCard contain qrcode lib)
const QrModal = lazy(() => import('./QrModal'));
const BusinessCardModal = lazy(() => import('./BusinessCardModal'));
const NotifyManagerModal = lazy(() => import('./NotifyManagerModal'));

const SignatureTab = memo(({
  form, uf, stg, effectiveStg, setStg, office, company, sigHTML, hasData, progress, L, lang,
  copied, doCopy, doReset, showSteps, setShowSteps,
  designOpen, setDesignOpen,
  sigBanner, setSigBanner, bannerFileRef, procBanner,
  msalAccount, toast, fetchManager, sendMail,
}) => {
  const [qrOpen, setQrOpen] = useState(false);
  const [bcOpen, setBcOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);

  // ─── Form Validation ───
  const v = useMemo(() => {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const e = form.email.trim();
    const g = form.gsm.trim();
    return {
      email: !e ? null : emailRe.test(e) ? { ok: true } : { err: lang === 'tr' ? 'Geçersiz e-posta formatı' : 'Invalid email format' },
      gsm: !g ? null : g.replace(/\D/g, '').length >= 10 ? { ok: true } : { err: lang === 'tr' ? 'En az 10 haneli olmalıdır' : 'Must be at least 10 digits' },
      firstName: form.firstName.trim().length > 0 ? { ok: true } : null,
      lastName: form.lastName.trim().length > 0 ? { ok: true } : null,
    };
  }, [form.email, form.gsm, form.firstName, form.lastName, lang]);

  const handleOutlookOpen = useCallback(() => {
    doCopy();
    window.open('https://outlook.office.com/mail/options/accounts-category/signatures-subcategory', '_blank');
    toast(lang === 'tr' ? 'İmza kopyalandı — Outlook ayarlarına yapıştırın' : 'Signature copied — paste it in Outlook settings');
  }, [doCopy, toast, lang]);

  return (
    <div style={{ animation: 'fadeIn 0.35s cubic-bezier(0.22, 1, 0.36, 1)' }}>
      <ProgressBar progress={progress} L={L} />

      <div className="sig-layout sig-grid" style={{
        display: 'grid', gridTemplateColumns: 'minmax(0, 480px) 1fr',
        gap: '1rem', alignItems: 'stretch',
      }}>
        {/* LEFT: Kişisel Bilgiler + İletişim (tek kart) */}
        <div className="sig-sec-personal" style={{ animation: 'slideInLeft 0.4s ease-out' }}>
          <GlassCard accent style={{ height: '100%' }}>
            <SectionTitle icon={User}>{L.pi}</SectionTitle>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ flex: 1 }}><FormField label={L.fn} value={form.firstName} onChange={e => uf('firstName', e.target.value)} placeholder="Cenk" required success={!!v.firstName?.ok} /></div>
              <div style={{ flex: 1 }}><FormField label={L.ln} value={form.lastName} onChange={e => uf('lastName', e.target.value)} placeholder="Şaylı" required success={!!v.lastName?.ok} /></div>
            </div>
            <FormField label={L.ttr} value={form.titleTR} onChange={e => uf('titleTR', e.target.value)} placeholder="Kurumsal Sistemler Yöneticisi" />
            <FormField label={L.ten} value={form.titleEN} onChange={e => uf('titleEN', e.target.value)} placeholder="Enterprise Systems Executive" />
            <SearchableSelect
              label={L.ofc}
              value={form.officeId}
              onChange={v => uf('officeId', v)}
              placeholder={L.so}
              clearLabel={L.so}
              options={OFFICES}
              groups={OFFICE_GROUPS}
              groupLabels={lang === 'en' ? { 'Türkiye': L.grpTR, 'Uluslararası': L.grpIntl } : undefined}
            />
            <SearchableSelect
              label={L.sc}
              required
              value={form.companyId}
              onChange={v => uf('companyId', v)}
              placeholder={L.sco}
              options={COMPANIES}
              groups={COMPANY_GROUPS}
              nameKey={lang === 'en' ? 'nameEN' : undefined}
              groupLabels={lang === 'en' ? COMPANY_GROUP_LABELS_EN : undefined}
            />

            <div style={{ height: 1, background: C.borderSub, margin: '0.5rem 0 0.6rem' }} />

            <SectionTitle icon={Phone}>{L.ci}</SectionTitle>
            <FormField label={L.gsm} value={form.gsm} onChange={e => uf('gsm', e.target.value)} placeholder="0530 914 45 91" error={v.gsm?.err} success={!!v.gsm?.ok} />
            <FormField label={L.email} value={form.email} onChange={e => uf('email', e.target.value)} placeholder="cenk.sayli@tiryaki.com.tr" required error={v.email?.err} success={!!v.email?.ok} type="email" />
            <div style={{ marginBottom: '0.4rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem', fontWeight: 600, color: C.text2, marginBottom: '0.25rem' }}>
                LinkedIn
              </label>
              <input
                type="text" value={form.linkedinPersonal} onChange={e => uf('linkedinPersonal', e.target.value)}
                placeholder="https://linkedin.com/in/cenksayli"
                style={{
                  width: '100%', padding: '0.45rem 0.65rem',
                  border: `1px solid ${C.borderSub}`, borderRadius: '8px',
                  fontSize: '0.78rem', fontFamily: 'Inter,sans-serif',
                  background: C.glass, color: C.text1,
                  outline: 'none', boxSizing: 'border-box',
                  transition: 'all 0.25s ease', backdropFilter: 'blur(8px)',
                }}
              />
              <p style={{ fontSize: '0.52rem', color: C.textM, marginTop: '0.15rem', fontStyle: 'italic' }}>
                {lang === 'tr' ? 'Boş bırakılırsa şirket LinkedIn adresi kullanılır' : 'If left empty, company LinkedIn URL will be used'}
              </p>
            </div>
          </GlassCard>
        </div>

        {/* RIGHT: Canlı Önizleme + İmzayı Dışa Aktar */}
        <div className="sig-sec-preview" style={{ animation: 'slideInRight 0.4s ease-out', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <GlassCard accent style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
              <Eye size={15} style={{ color: C.accent }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: C.primary, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>{L.lv}</span>
              {hasData && <span style={{
                display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
                background: C.ok, marginLeft: '0.3rem',
                boxShadow: `0 0 0 3px ${C.ok}20`,
                animation: 'pulse 2s infinite',
              }} />}
              <DesignSwitcher stg={stg} setStg={setStg} designOpen={designOpen} setDesignOpen={setDesignOpen} L={L} />
            </div>
            <OutlookPreview hasData={hasData} sigHTML={sigHTML} L={L} lang={lang} />
            <p style={{ fontSize: '0.55rem', color: C.textM, marginTop: '0.5rem', textAlign: 'center' }}>
              {lang === 'tr' ? 'E-posta istemcilerinde bu şekilde görünecek' : 'This is how it will appear in email clients'}
            </p>
          </GlassCard>

          <div className="sig-sec-export">
          <GlassCard accent>
            <SectionTitle icon={Download}>{L.exportTitle}</SectionTitle>
            <ExportSection
              hasData={hasData} copied={copied} doCopy={doCopy} doReset={doReset}
              onQrClick={() => setQrOpen(true)}
              onBcClick={() => setBcOpen(true)}
              onNotifyClick={() => setNotifyOpen(true)}
              onOutlookOpen={handleOutlookOpen}
              msalAccount={msalAccount}
              showSteps={showSteps} setShowSteps={setShowSteps} L={L}
            />
          </GlassCard>
          </div>
        </div>

        {/* FULL-WIDTH: Promosyon Banner */}
        <PromoBannerSection sigBanner={sigBanner} setSigBanner={setSigBanner} bannerFileRef={bannerFileRef} procBanner={procBanner} lang={lang} L={L} />
      </div>

      {/* QR Modal (lazy-loaded) */}
      {qrOpen && (
        <Suspense fallback={null}>
          <QrModal
            open={qrOpen}
            onClose={() => setQrOpen(false)}
            form={form}
            office={office}
            stg={effectiveStg}
            company={company}
            toast={toast}
            L={L}
            lang={lang}
          />
        </Suspense>
      )}

      {/* Business Card Modal (lazy-loaded) */}
      {bcOpen && (
        <Suspense fallback={null}>
          <BusinessCardModal
            open={bcOpen}
            onClose={() => setBcOpen(false)}
            form={form}
            office={office}
            stg={effectiveStg}
            company={company}
            toast={toast}
            L={L}
            lang={lang}
          />
        </Suspense>
      )}

      {/* Notify Manager Modal (lazy-loaded) */}
      {notifyOpen && (
        <Suspense fallback={null}>
          <NotifyManagerModal
            open={notifyOpen}
            onClose={() => setNotifyOpen(false)}
            form={form}
            sigHTML={sigHTML}
            toast={toast}
            L={L}
            lang={lang}
            fetchManager={fetchManager}
            sendMail={sendMail}
          />
        </Suspense>
      )}
    </div>
  );
});

export default SignatureTab;
