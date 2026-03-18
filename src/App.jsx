import { useState, useRef, useMemo, useCallback, useEffect, lazy, Suspense } from 'react';
import DEFAULT_LOGO_BASE64 from './defaultLogo.js';
import { C } from './constants/theme';
import { OFFICES } from './constants/offices';
import { COMPANIES } from './constants/companies';
import { PROGRESS_FIELDS } from './constants/progressFields';
import { MAX_LOGO_SIZE, MAX_BANNER_SIZE, MAX_LOGO_W, MAX_LOGO_H, DEFAULT_LOGO_W, DEFAULT_LOGO_H, SIG_WIDTH } from './constants/limits';
import { TR, EN } from './i18n/translations';
import { genSig } from './signature/genSig';
import { genSigCorporate } from './signature/genSigCorporate';
import { GLOBAL_CSS } from './styles/globalCss';
import { useToast } from './hooks/useToast';
import { useMsal } from './hooks/useMsal';
import { useBannerCanvas } from './hooks/useBannerCanvas';
import LoginSplash from './components/LoginSplash';
import AppHeader from './components/AppHeader';
import SignatureTab from './components/SignatureTab';
import BannerTab from './components/BannerTab';
const SettingsModal = lazy(() => import('./components/SettingsModal'));
import AppFooter from './components/AppFooter';
import ToastContainer from './components/ToastContainer';
import CopySuccess from './components/CopySuccess';
import OnboardingGuide from './components/OnboardingGuide';

export default function App() {
  // ─── State ───
  const [lang, _setLang] = useState(() => { try { return localStorage.getItem('tyro-lang') || 'tr'; } catch { return 'tr'; } });
  // Synchronous localStorage write — prevents loss during MSAL loginRedirect
  const setLang = useCallback((l) => { try { localStorage.setItem('tyro-lang', l); } catch { /* private mode */ } _setLang(l); }, []);
  const [tab, setTab] = useState('signature');
  const [copied, setCopied] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [settingsTab, setSettingsTab] = useState('logo');
  const [form, setForm] = useState({
    firstName: '', lastName: '', titleTR: '', titleEN: '',
    officeId: '', companyId: 'tiryaki-agro', gsm: '', email: '', linkedinPersonal: '',
  });
  const [stg, setStg] = useState({
    companyName: 'Tiryaki Agro', website: 'www.tiryaki.com.tr',
    slogan: 'Good people. Good earth.', logoColor: '#1e3a5f', accentColor: '#0098d4',
    logoBase64: DEFAULT_LOGO_BASE64, logoW: 140, logoH: 45,
    social: { linkedin: 'https://www.linkedin.com/company/tiryaki-agro/', twitter: 'https://x.com/tiryakiagro', facebook: 'https://www.facebook.com/tiryakiagro', instagram: 'https://www.instagram.com/tiryakiagro/' },
    showSDN: true, showFax: true, showAddress: true,
    showRightBlock: true, showLinkedin: true, showTwitter: true, showFacebook: true, showInstagram: true, showWebsite: true,
    dividerColor: '#0098d4', dividerWidth: 3,
    rightBlockBg: '#024d7e', rightBlockRadius: 6,
    nameColor: '#1e3a5f', titleColor: '#0098d4',
    companyTextColor: '#333333', contactLabelColor: '#888888', contactValueColor: '#555555',
    bannerAccentColor: '',
    designId: 'corporate',
  });
  const [banner, setBanner] = useState({ template: 'classic', size: 'linkedin', title: '', subtitle: '', customBg: '', companyId: 'tiryaki-agro', logoPosition: 'top-right', showLogo: true });
  const [sigBanner, setSigBanner] = useState({ enabled: false, base64: '', width: 0, height: 0, linkUrl: '', alt: '' });
  const [profileOpen, setProfileOpen] = useState(false);
  const [designOpen, setDesignOpen] = useState(false);

  const [showCelebration, setShowCelebration] = useState(false);
  const fRef = useRef(null);
  const canvasRef = useRef(null);
  const bannerFileRef = useRef(null);

  // ─── Persist lang ───
  useEffect(() => { try { localStorage.setItem('tyro-lang', lang); } catch { /* private mode */ } }, [lang]);

  // ─── Hooks ───
  const { toasts, toast } = useToast();
  const { MSAL_ENABLED, msalReady, msalAccount, authLoading, handleLogin, handleLogout, fetchManager, sendMail } = useMsal({ toast, lang, setForm });

  // ─── Logo loader (PNG → base64, kalite kaybı yok) ───
  const logoCache = useRef({});
  const loadLogo = useCallback((url) => {
    if (!url) return Promise.resolve(null);
    if (logoCache.current[url]) return Promise.resolve(logoCache.current[url]);
    return fetch(url)
      .then(r => { if (!r.ok) throw new Error(r.status); return r.blob(); })
      .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result;
          const img = new window.Image();
          img.onload = () => {
            let w = img.width, h = img.height;
            if (w > MAX_LOGO_W) { const ratio = MAX_LOGO_W / w; w = MAX_LOGO_W; h = Math.round(h * ratio); }
            if (h > MAX_LOGO_H) { const ratio = MAX_LOGO_H / h; h = Math.round(h * ratio); w = Math.round(w * ratio); }
            // Measure left visual offset: how many px of whitespace/transparency before visible content
            let leftOffset = 0;
            try {
              const cvs = document.createElement('canvas');
              const sc = 0.25; // scan at 25% for speed
              cvs.width = Math.round(img.naturalWidth * sc);
              cvs.height = Math.round(img.naturalHeight * sc);
              const cx = cvs.getContext('2d');
              cx.drawImage(img, 0, 0, cvs.width, cvs.height);
              const px = cx.getImageData(0, 0, cvs.width, cvs.height).data;
              const W = cvs.width, H = cvs.height;
              outer: for (let x = 0; x < W; x++) {
                for (let y = 0; y < H; y++) {
                  const i = (y * W + x) * 4;
                  if (px[i + 3] > 30 && !(px[i] > 240 && px[i+1] > 240 && px[i+2] > 240)) {
                    // Convert scaled px back to rendered pixels
                    leftOffset = Math.round(x / sc * (w / img.naturalWidth));
                    break outer;
                  }
                }
              }
            } catch (_) { leftOffset = 0; }
            const result = { base64, w, h, leftOffset };
            logoCache.current[url] = result;
            resolve(result);
          };
          img.onerror = () => reject(new Error('img'));
          img.src = base64;
        };
        reader.onerror = () => reject(new Error('read'));
        reader.readAsDataURL(blob);
      }))
      .catch(() => null);
  }, []);

  // ─── Derived ───
  const L = useMemo(() => lang === 'tr' ? TR : EN, [lang]);
  const hasData = form.firstName.trim().length > 0;
  const office = OFFICES.find(o => o.id === form.officeId) || null;
  const company = useMemo(() => COMPANIES.find(c => c.id === form.companyId) || COMPANIES[0], [form.companyId]);

  // ─── Dynamic company logo (lang-aware) ───
  const [companyLogo, setCompanyLogo] = useState({ base64: DEFAULT_LOGO_BASE64, w: DEFAULT_LOGO_W, h: DEFAULT_LOGO_H });
  useEffect(() => {
    const url = lang === 'tr' ? company.logoTR : company.logoEN;
    if (!url) { setCompanyLogo({ base64: DEFAULT_LOGO_BASE64, w: DEFAULT_LOGO_W, h: DEFAULT_LOGO_H }); return; }
    let cancelled = false;
    loadLogo(url).then(result => {
      if (cancelled) return;
      if (result) setCompanyLogo(result);
      else setCompanyLogo({ base64: DEFAULT_LOGO_BASE64, w: DEFAULT_LOGO_W, h: DEFAULT_LOGO_H });
    });
    return () => { cancelled = true; };
  }, [company, lang, loadLogo]);

  const effectiveStg = useMemo(() => ({
    ...stg,
    logoBase64: companyLogo.base64,
    logoW: companyLogo.w,
    logoH: companyLogo.h,
    logoLeftOffset: companyLogo.leftOffset || 0,
  }), [stg, companyLogo]);

  // ─── Dynamic banner logo (lang-aware) ───
  const bannerCompany = useMemo(() => COMPANIES.find(c => c.id === banner.companyId) || COMPANIES[0], [banner.companyId]);
  const [bannerLogo, setBannerLogo] = useState({ base64: DEFAULT_LOGO_BASE64, w: DEFAULT_LOGO_W, h: DEFAULT_LOGO_H });
  useEffect(() => {
    const url = lang === 'tr' ? bannerCompany.logoTR : bannerCompany.logoEN;
    if (!url) { setBannerLogo({ base64: DEFAULT_LOGO_BASE64, w: DEFAULT_LOGO_W, h: DEFAULT_LOGO_H }); return; }
    let cancelled = false;
    loadLogo(url).then(result => {
      if (cancelled) return;
      if (result) setBannerLogo(result);
      else setBannerLogo({ base64: DEFAULT_LOGO_BASE64, w: DEFAULT_LOGO_W, h: DEFAULT_LOGO_H });
    });
    return () => { cancelled = true; };
  }, [bannerCompany, lang, loadLogo]);

  const bannerStg = useMemo(() => ({
    ...stg,
    logoBase64: bannerLogo.base64,
    logoW: bannerLogo.w,
    logoH: bannerLogo.h,
  }), [stg, bannerLogo]);

  useBannerCanvas(canvasRef, tab, banner, bannerStg);

  const sigHTML = useMemo(() => {
    if (effectiveStg.designId === 'corporate') return genSigCorporate(form, effectiveStg, office, sigBanner);
    return genSig(form, effectiveStg, office, sigBanner);
  }, [form, effectiveStg, office, sigBanner]);

  const progress = useMemo(() => {
    const filled = PROGRESS_FIELDS.filter(k => form[k].trim().length > 0).length;
    return { filled, total: PROGRESS_FIELDS.length, pct: Math.round((filled / PROGRESS_FIELDS.length) * 100) };
  }, [form]);

  // ─── Handlers ───
  const uf = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const procLogo = useCallback((file) => {
    if (!file) return;
    if (file.size > MAX_LOGO_SIZE) { toast('Max 500KB', 'err'); return; }
    if (!file.type.startsWith('image/')) { toast('Invalid file type', 'err'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;
      const img = new window.Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > MAX_LOGO_W) { const r = MAX_LOGO_W / w; w = MAX_LOGO_W; h = Math.round(h * r); }
        if (h > MAX_LOGO_H) { const r = MAX_LOGO_H / h; h = Math.round(h * r); w = Math.round(w * r); }
        setStg(p => ({ ...p, logoBase64: base64, logoW: w, logoH: h }));
        toast('Logo OK');
      };
      img.onerror = () => toast('Ge\u00e7ersiz g\u00f6rsel', 'err');
      img.src = base64;
    };
    reader.onerror = () => toast('Dosya okunamad\u0131', 'err');
    reader.readAsDataURL(file);
  }, [toast]);

  const procBanner = useCallback((file) => {
    if (!file) return;
    if (file.size > MAX_BANNER_SIZE) { toast('Max 2MB', 'err'); return; }
    if (!file.type.startsWith('image/')) { toast('Invalid file type', 'err'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;
      const img = new window.Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > SIG_WIDTH) { const r = SIG_WIDTH / w; w = SIG_WIDTH; h = Math.round(h * r); }
        setSigBanner(p => ({ ...p, base64, width: w, height: h, enabled: true }));
        toast('Banner OK');
      };
      img.onerror = () => toast(lang === 'tr' ? 'Ge\u00e7ersiz g\u00f6rsel' : 'Invalid image', 'err');
      img.src = base64;
    };
    reader.onerror = () => toast(lang === 'tr' ? 'Dosya okunamad\u0131' : 'File read error', 'err');
    reader.readAsDataURL(file);
  }, [toast, lang]);

  const doCopy = useCallback(async () => {
    const onSuccess = () => {
      setCopied(true); setShowCelebration(true); toast(L.cpd);
      setTimeout(() => setCopied(false), 2500);
      setTimeout(() => setShowCelebration(false), 1800);
    };
    try {
      if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': new Blob([sigHTML], { type: 'text/html' }),
            'text/plain': new Blob([sigHTML.replace(/<[^>]*>/g, '')], { type: 'text/plain' }),
          }),
        ]);
        onSuccess();
        return;
      }
    } catch { /* fallback below */ }
    const div = document.createElement('div');
    div.innerHTML = sigHTML;
    div.style.position = 'fixed'; div.style.left = '-9999px';
    document.body.appendChild(div);
    const range = document.createRange();
    range.selectNodeContents(div);
    const sel = window.getSelection();
    if (!sel) { document.body.removeChild(div); return; }
    sel.removeAllRanges(); sel.addRange(range);
    try {
      document.execCommand('copy');
      onSuccess();
    } catch { toast('Error', 'err'); }
    sel.removeAllRanges(); document.body.removeChild(div);
  }, [sigHTML, L, toast]);

  // ─── Keyboard Shortcuts ───
  useEffect(() => {
    const handler = (e) => {
      // Ctrl+C (not in input/textarea) → copy signature
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && hasData) {
        const tag = document.activeElement?.tagName;
        const sel = window.getSelection();
        if (tag === 'INPUT' || tag === 'TEXTAREA' || (sel && sel.toString().length > 0)) return;
        e.preventDefault();
        doCopy();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [hasData, doCopy]);

  const doReset = useCallback(() => {
    setForm({ firstName: '', lastName: '', titleTR: '', titleEN: '', officeId: '', companyId: 'tiryaki-agro', gsm: '', email: '', linkedinPersonal: '' });
    toast(L.rst, 'info');
  }, [L, toast]);

  const downloadBanner = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'banner.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast(L.banDl);
  }, [L, toast]);

  // ─── Login Splash ───
  if (MSAL_ENABLED && !msalAccount) {
    return <LoginSplash lang={lang} setLang={setLang} authLoading={authLoading} msalReady={msalReady} handleLogin={handleLogin} />;
  }

  // ─── Main App ───
  return (
    <div style={{ fontFamily: 'Inter,sans-serif', background: C.bg, color: C.text1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{GLOBAL_CSS}</style>
      <a href="#main-content" className="skip-link">{lang === 'tr' ? 'İçeriğe geç' : 'Skip to content'}</a>

      <AppHeader
        tab={tab} setTab={setTab}
        lang={lang} setLang={setLang} L={L}
        msalAccount={msalAccount} profileOpen={profileOpen} setProfileOpen={setProfileOpen}
        handleLogout={handleLogout}
      />

      {/* Animated gradient accent line */}
      <div style={{
        height: 2,
        backgroundImage: `linear-gradient(90deg, ${C.primary}, ${C.divider}, ${C.accent}, ${C.primary})`,
        backgroundSize: '300% 100%',
        animation: 'gradientShift 4s ease infinite',
        opacity: 0.7,
      }} />

      <main id="main-content" className="app-main" role="main" style={{ flex: 1, padding: '1rem 2rem', maxWidth: 1400, width: '100%', margin: '0 auto' }}>

        {tab === 'signature' && (
          <SignatureTab
            form={form} uf={uf} stg={stg} effectiveStg={effectiveStg} setStg={setStg} office={office} company={company}
            sigHTML={sigHTML} hasData={hasData} progress={progress} L={L} lang={lang}
            copied={copied} doCopy={doCopy} doReset={doReset}
            showSteps={showSteps} setShowSteps={setShowSteps}
            designOpen={designOpen} setDesignOpen={setDesignOpen}
            sigBanner={sigBanner} setSigBanner={setSigBanner}
            bannerFileRef={bannerFileRef} procBanner={procBanner}
            msalAccount={msalAccount} toast={toast}
            fetchManager={fetchManager} sendMail={sendMail}
          />
        )}

        {tab === 'banner' && (
          <BannerTab
            banner={banner} setBanner={setBanner} stg={bannerStg}
            canvasRef={canvasRef} downloadBanner={downloadBanner} L={L} lang={lang}
          />
        )}

        {tab === 'settings' && (
          <Suspense fallback={null}>
            <SettingsModal
              setTab={setTab} settingsTab={settingsTab} setSettingsTab={setSettingsTab}
              stg={stg} setStg={setStg} fRef={fRef} procLogo={procLogo}
              toast={toast} L={L} lang={lang}
              DEFAULT_LOGO_BASE64={DEFAULT_LOGO_BASE64}
            />
          </Suspense>
        )}

      </main>

      <AppFooter />
      <CopySuccess show={showCelebration} />
      {tab === 'signature' && <OnboardingGuide L={L} />}
      <ToastContainer toasts={toasts} />
    </div>
  );
}
