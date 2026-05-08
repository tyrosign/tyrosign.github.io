# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: TYRO Sign Snap

Tiryaki Agro grubunun (31 şirket / 21 ofis) kurumsal e-posta imza, dijital kartvizit, QR kartvizit ve LinkedIn banner üretici platformu. Çalışanlar Azure AD ile giriş yapar, imzalarını oluşturur, Outlook'a uygular, yöneticisine bildirir.

**Live:** `tyrosign.ttech.business` (custom domain → GitHub Pages)

## Common Commands

```bash
npm install          # bağımlılıklar
npm run dev          # Vite dev server (varsayılan: http://localhost:5173)
npm run build        # production build → dist/
npm run preview      # build edilmiş çıktıyı önizle
```

Test runner / lint config yok — değişikliklerden sonra `npm run build` ile sentaks ve lazy chunk doğrulaması yapılır.

## Deployment (3 Repo Senkronu)

Her canlı çıkışta tüm üç remote'a push gerekir:

```bash
git push origin main         # TYROAIHUB/tyrosign — kaynak repo
git push tyrosign-io main    # tyrosign/tyrosign.github.io — GitHub Pages deploy
git push ghe main            # THUB/tyrosign — kurumsal GHE mirror
```

GitHub Pages CNAME `public/CNAME` → `tyrosign.ttech.business`. Deploy tamamlandığında live site ~1-2 dakika içinde güncellenir; ofis testinde **hard refresh (Ctrl+Shift+R)** gerekir, eski JS chunk cache'lenmiş olabilir.

### Versioning (Semantic)
- **Major (vX.0.0):** Mimari/breaking change
- **Minor (v0.X.0):** Yeni özellik
- **Patch (v0.0.X):** Bug fix

Tag oluştur: `git tag vX.Y.Z && git push origin vX.Y.Z`. Güncel tag: `git tag --sort=-v:refname | head -1`

## Architecture Overview

### Single-Page App, Tab-Based Routing
`App.jsx` root state'i tutar; `tab` state değişkeni hangi sayfanın render edileceğini belirler (`signature`, `banner`, `settings`, `help`, `concepts`, `fonts`, `lab`). Modal'lar yerine tab geçişleri kullanılır — `SettingsModal`, `LogoConceptsPage`, `HelpPage` lazy import edilir.

### State Architecture (App.jsx)
Üç ana state objesi:
- **`form`** — Kullanıcı girişi (firstName, lastName, titleTR/EN, officeId, companyId, gsm, email, linkedinPersonal). MSAL girişi sonrası Azure AD'den autofill.
- **`stg` (settings)** — Görsel ayarlar (logoBase64, social links, dividerColor, designId, headerTheme vb.). `localStorage['tyro-stg']`'ye persist.
- **`banner`** — LinkedIn banner state (template, title, subtitle, webLink, companyId). `localStorage['tyro-banner']`'a persist (customBg hariç — base64 storage'a sığmıyor).

`lang` ayrıca `localStorage['tyro-lang']`'de tutulur; **MSAL loginRedirect öncesi senkron yazma** kritik (private mode dışında).

### Signature Generation Pipeline
1. `form` + `stg` + `office` → `effectiveStg` (useMemo) — şirket logosu lang-aware seçilir (`lang === 'tr' ? logoTR : logoEN`; RU/AR için EN logosu kullanılır)
2. `effectiveStg.designId === 'corporate'` ise `genSigCorporate` (wave band tasarım), değilse `genSig` (classic) — her ikisi de **inline style HTML** üretir (Outlook Word engine uyumu için)
3. Üretilen `sigHTML` clipboard'a kopyalanır VEYA `html2canvas` ile PNG'ye çevrilip mail body'sine gömülür

### Logo Loading & Visual Offset Detection
`loadLogo()` (App.jsx) — şirket logosunu fetch eder, base64'e çevirir, ölçeklendirir, **soldaki transparan/beyaz boşluğu pixel-scan ile ölçer** (`leftOffset`). Bu offset imza HTML'inde sağa hizalama düzeltmesi olarak kullanılır. Cache: `logoCache.current`.

### Clipboard Copy Strategy (Cross-Browser, Corporate-Safe)
`doCopy()` üç katmanlı:
1. **Birincil:** `document.execCommand('copy')` — viewport içinde 1×1 px contenteditable div + Range selection. Kurumsal Chrome (DLP, MDM) ortamlarında ClipboardItem API silent fail olduğunda bu yol çalışır. iOS Safari için `font-size:12pt`, `readonly=false`, viewport içi konum şart.
2. **Fallback:** `navigator.clipboard.write([ClipboardItem({...})])` — modern API, plain text `innerText` ile decode edilir (`&nbsp;` leak önlenir)
3. **Last resort:** `clipboard.writeText` — sadece plain

Kurumsal ortam debugı için: ofiste plain text yapıştığında birincil yol başarısız demektir; browser console'da `document.queryCommandSupported('copy')` kontrol et.

### MSAL / Microsoft Graph
`useMsal` hook (`src/hooks/useMsal.js`):
- Login: `loginRedirect` (popup değil — kurumsal politika uyumu)
- Scopes: `User.Read` (profile + manager lookup), `Mail.Send` (yöneticiye bildir)
- Profile photo: Graph `/me/photo/$value` → blob → base64
- `MSAL_ENABLED` flag: `.env` içindeki `VITE_CLIENT_ID` + `VITE_TENANT_ID` varsa true. Yoksa uygulama auth-free açılır (development).

### i18n (4 Dil)
`src/i18n/translations.js` — `TR`, `EN`, `RU`, `AR` exports. App.jsx içinde:
```js
const L = useMemo(() => ({ tr: TR, en: EN, ru: RU, ar: AR })[lang] || EN, [lang]);
```

**Önemli pattern:** Veri/logo seçimi için `lang === 'tr'` kullan, `lang === 'en'` DEĞİL. RU ve AR için EN logoları/şirket adları/ofis isimleri kullanılır (sadece UI çevriliyor):
```js
const url = lang === 'tr' ? company.logoTR : company.logoEN;  // RU/AR → EN
```
Inline çeviriler için kısa form: `{ tr: 'X', en: 'Y', ru: 'Z', ar: 'W' }[lang] || 'Y'`

## Tech Stack & Constraints

- **React 18 + Vite 5**, no TypeScript, no Tailwind, no CSS modules
- **Inline styles (CSS-in-JS)** her yerde — globalCss.js sadece keyframes ve breakpoint'ler için
- **`lucide-react@0.263.1`** — eski versiyon, **şu ikonlar YOK**: Wand2, Sparkles, Building2, Smartphone, PenTool, Trash2, Languages, RotateCcw. Custom SVG kullan.
- **Email-safe HTML kuralları** (signature/genSig*.js):
  - Sadece inline `style="..."` (`<style>` tag'leri Outlook'ta strip edilir)
  - Logolar Base64, harici URL yok
  - Sosyal medya ikonları **PNG data URI** (`src/icons/svgDataUris.js`) — SVG Outlook desktop'ta render olmuyor
  - `border-top-left-radius:130px` gibi CSS inline yazılmalı

## Design System

| Token | Value | Use |
|---|---|---|
| Navy (primary) | `#1e3a5f` | Logo, başlıklar, header |
| Gold (accent) | `#c8922a` | Vurgular, aktif state |
| Cyan (divider) | `#0098d4` | Ayırıcı, link, Outlook btn |
| Slate | `#475569` | QR butonu |
| Teal | `#0d9488` | Kartvizit butonu |

`src/constants/theme.js` → `C` objesi tüm token'ları export eder. Yeni renk eklerken hem light hem dark theme değerlerini kontrol et.

Fonts: **Inter** (gövde) + **Plus Jakarta Sans** (başlık) — Google Fonts.

## Folder Map

```
src/
├── App.jsx                  # Root state + tab routing
├── main.jsx
├── components/              # ~30 React components (memo'lu)
│   ├── ui/                  # Reusable kit (GlassCard, FormField, Btn, ...)
│   └── *.jsx                # Feature components
├── constants/               # offices, companies, theme, designs, bannerConfig
├── hooks/                   # useMsal, useToast, useBannerCanvas
├── i18n/translations.js     # TR/EN/RU/AR
├── icons/svgDataUris.js     # Email-safe PNG ikonlar
├── signature/               # genSig (classic) + genSigCorporate (wave band)
├── styles/globalCss.js      # Keyframes + responsive breakpoints
└── utils/                   # formatting, generateVCard, debouncedColor
```

## Development Notes

- Yeni şirket eklemek: `src/constants/companies.js` + logoTR/logoEN URL'leri (varsa)
- Yeni ofis eklemek: `src/constants/offices.js` (id, address, sdn, fax, lang-specific name)
- Yeni dil eklemek (örn. DE): `i18n/translations.js`'de `DE` export et + App.jsx'in `L` selector'ünde mapping ekle + AppHeader.jsx LANGS array'ine ekle
- Lazy-loaded modal eklemek: `const X = lazy(() => import('./components/X'))` + `<Suspense fallback={null}><X/></Suspense>` ile sar
- Yeni email-safe component için: `signature/genSig*.js` örneklerine bak — sadece inline style + table-based layout + base64/PNG-data-URI assets
