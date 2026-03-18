<p align="center">
  <img src="https://www.tiryaki.com.tr/Content/images/logo/tiryaki_logo.svg" alt="Tiryaki Agro" width="200" />
</p>

<h1 align="center">TYRO Sign Snap</h1>
<h3 align="center">Corporate Email Signature & Digital Identity Platform</h3>

<p align="center">
  <strong>Tiryaki Agro grubuna ait 23 sirket icin kurumsal e-posta imza, dijital kartvizit ve LinkedIn banner olusturma platformu.</strong><br/>
  Calisanlar Azure AD ile giris yaparak imza olusturur, Outlook'a uygular, yoneticisine bildirir, QR kartvizit ve banner uretir.
</p>

<p align="center">
  <a href="https://tyrosign.github.io/"><img src="https://img.shields.io/badge/🌐_Live_App-tyrosign.github.io-1e3a5f?style=for-the-badge" alt="Live App" /></a>
  <a href="https://github.com/djeanker34/TYRO-SignSnap/releases"><img src="https://img.shields.io/badge/Latest-v2.6.0-c8922a?style=for-the-badge" alt="Version" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React 18" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 5" />
  <img src="https://img.shields.io/badge/Azure_AD-MSAL_v5-0078D4?style=flat-square&logo=microsoftazure&logoColor=white" alt="MSAL" />
  <img src="https://img.shields.io/badge/Microsoft_Graph-Mail.Send-00BCF2?style=flat-square&logo=microsoft&logoColor=white" alt="Graph API" />
  <img src="https://img.shields.io/badge/Canvas-2D_Render-FF6B35?style=flat-square" alt="Canvas" />
  <img src="https://img.shields.io/badge/QR-vCard_3.0-c8922a?style=flat-square" alt="vCard QR" />
  <img src="https://img.shields.io/badge/UI-Glassmorphism_+_iOS-blue?style=flat-square" alt="Glassmorphism" />
  <img src="https://img.shields.io/badge/i18n-TR_|_EN-green?style=flat-square" alt="i18n" />
  <img src="https://img.shields.io/badge/License-Private-red?style=flat-square" alt="License" />
</p>

---

## Ozellikler

### 📝 Imza Olusturucu
- **Cift Tasarim** — Corporate (Wave Band, yuvarlatilmis navy blok) ve Classic (sosyal medya + dikey ayirici)
- **23 Sirket** — Tiryaki Agro grup sirketleri logolari ile hazir
- **7 Ofis** — Istanbul, Gaziantep, Mersin, Ankara, Dubai, Moskova, Shanghai — otomatik adres/SDN/Fax
- **Canli Onizleme** — Outlook gorunumunu taklit eden gercek zamanli preview (konu, alici, imza)
- **Promosyon Banneri** — Imza altina kampanya/etkinlik gorseli ekleme (toggle ile acilir)
- **Title Case** — Kucuk/buyuk harf duzeltmesi (turkceye ozel kurallar)
- **Form Ilerleme** — Doldurulan alanlarin yuzdesi gosterilir

### 🔐 Azure AD Entegrasyonu
- **Microsoft SSO** — Azure AD ile giris, profil bilgileri (ad, unvan, GSM, foto) otomatik cekilir
- **Profil Fotografi** — Graph API'den cekilen foto, profil butonunda ve kartvizitte kullanilir
- **Yoneticiye Bildir** — `User.Read` ile yonetici bilgisi bulunur, imza onizlemeli mail gonderilir (Graph `Mail.Send`)
- **Imza PNG Gonderimi** — Outlook'un HTML kisitlamalari icin imza `html2canvas` ile PNG'ye cevrilerek maile gomulur

### 💳 Dijital Kartvizit
- **Canvas PNG** — 2x Retina cozunurluklu profesyonel kartvizit gorseli
- **Profil Fotografi** — Graph'dan gelen foto veya sirket logosu
- **HTML Kart** — Indirilebilir interaktif HTML kartvizit
- **Web Share API** — Mobilde yerel paylasim
- **QR Kod** — Kartvizit uzerinde vCard QR

### 📱 QR Kartvizit
- **vCard 3.0** — Ad, unvan, sirket, telefon, email, adres, LinkedIn bilgilerinden QR uretir
- **Glassmorphic Modal** — Canli onizleme + PNG indirme
- **Telefonla Okut** — QR okutularak kisi rehbere kaydedilebilir

### 🎨 LinkedIn Banner Uretici
- **Canvas Motoru** — Yuksek cozunurluklu LinkedIn ve e-posta bannerlari
- **3 Sablon** — Classic, Gold Elegance, Light Modern
- **Canli Editor** — Metin, renk, yerlestirme anlik guncelleme

### 📤 Imzayi Yonet (Export)
- **Kopyala** — Rich HTML kopyalama (Outlook Desktop & Web uyumlu, `ClipboardItem` + DOM fallback)
- **Outlook'a Uygula** — Graph API ile imzayi Outlook'a yazma (MSAL oturumu gerektirir)
- **Yoneticiye Bildir** — Imza onizlemeli mail taslagi, duzenlenebilir, onay ile gonderim
- **QR Uret** — vCard QR kodu PNG olarak indir
- **Kartvizit** — Canvas PNG, HTML kart, paylasim secenekleri
- **Tooltip Rehberi** — Her butonun islevini aciklayan bilgi baloncugu
- **Adim Adim Rehber** — Outlook'a yapistirma talimatlari (acilir kapanir)

### 🎨 Tasarim & UX
- **Apple iOS Tasarim Dili** — Pill toggle, segmented controls, grouped inputs, iOS tab bar
- **Glassmorphism** — `backdrop-filter: blur(40px)`, saydam katmanlar, hafif golge
- **Dark Mode** — Tema toggle ile karanlik mod
- **Responsive** — Masaustu + tablet + mobil tam uyum
- **iOS Bottom Tab Bar** — Mobilde frosted glass tab bar (safe area destegi)
- **Animasyonlar** — fadeIn, slideIn, pulse, hover scale, icon bounce etkisilmleri
- **Dil Toggle** — Premium pill slider (TR/EN)

---

## Teknoloji Yigini

| Katman | Teknoloji |
|---|---|
| Framework | React 18.2 (SPA, `React.memo`, `useMemo`, `useCallback`) |
| Build | Vite 5 (`manualChunks` vendor splitting) |
| Auth | `@azure/msal-browser` v5 (Azure AD SSO, Popup) |
| API | Microsoft Graph — `User.Read`, `Mail.Send` |
| QR | `qrcode` (vCard 3.0 encoding) |
| Screenshot | `html2canvas` (imza PNG render) |
| Icons | `lucide-react` 0.263.1 + custom SVG |
| Styling | Inline CSS-in-JS (Glassmorphism + iOS design system) |
| Fonts | Google Fonts — Inter + Plus Jakarta Sans |
| Deploy | GitHub Pages + GitHub Actions (auto) |

### Azure AD Permissions

| Permission | Type | Purpose |
|---|---|---|
| `User.Read` | Delegated | Profil bilgileri + yonetici lookup |
| `Mail.Send` | Delegated | Yoneticiye bildirim maili gonderimi |

### Tasarim Sistemi

| Renk | Kod | Kullanim |
|---|---|---|
| Navy | `#1e3a5f` | Primary — basliklar, logo, arka plan |
| Gold | `#c8922a` | Accent — vurgular, aktif durumlar |
| Blue | `#0098d4` | Divider — ayirici, linkler, Outlook butonu |
| Slate | `#475569` | QR butonu |
| Teal | `#0d9488` | Kartvizit butonu |

---

## Mimari

### 31 Modular Bilesen

```
src/
├── main.jsx                       # Entry point
├── App.jsx                        # Root + state management
├── defaultLogo.js                 # Fallback logo (Base64)
│
├── components/                    # 31 React bileşen
│   ├── AppHeader.jsx              # Sticky header + pill lang toggle + segmented nav
│   ├── AppFooter.jsx              # TTECH copyright footer
│   ├── SignatureTab.jsx           # Imza olusturma (form + preview + export)
│   ├── BannerTab.jsx              # LinkedIn banner uretici
│   ├── SettingsModal.jsx          # Inline ayarlar sayfasi (logo, renk, sosyal medya)
│   ├── OutlookPreview.jsx         # Outlook benzeri canli onizleme
│   ├── ExportSection.jsx          # Segmented export butonlari (5 aksiyon)
│   ├── NotifyManagerModal.jsx     # Yoneticiye bildir mail taslagi popup
│   ├── QrModal.jsx                # QR kartvizit modal
│   ├── BusinessCardModal.jsx      # Dijital kartvizit (Canvas + HTML)
│   ├── DesignSwitcher.jsx         # Corporate / Classic gecisi
│   ├── ProgressBar.jsx            # Form tamamlanma yuzdesi
│   ├── PromoBannerSection.jsx     # Promosyon banner toggle + upload
│   ├── ProfileDropdown.jsx        # Azure AD profil menusu + foto
│   ├── BottomTabBar.jsx           # iOS frosted glass bottom tab (mobil)
│   ├── LoginSplash.jsx            # Giris ekrani animasyonu
│   ├── OnboardingGuide.jsx        # Ilk kullanim rehberi
│   ├── CopySuccess.jsx            # Kopyalama basari animasyonu
│   ├── ToastContainer.jsx         # Bildirim toast'lari
│   ├── ErrorBoundary.jsx          # React error boundary
│   └── ui/                        # Reusable UI Kit
│       ├── GlassCard.jsx          # Glassmorphic container
│       ├── FormField.jsx          # iOS grouped input
│       ├── SearchableSelect.jsx   # Filtrelenebilir dropdown
│       ├── Btn.jsx                # Unified button
│       ├── SectionTitle.jsx       # Section baslik + ikon
│       ├── TabBtn.jsx             # Header tab butonu
│       ├── ToggleSwitch.jsx       # iOS toggle switch
│       ├── ColorPicker.jsx        # Renk secici
│       ├── TyroLogo.jsx           # Animated pen+signature logo
│       ├── LinkedInIcon.jsx       # LinkedIn marka ikonu
│       └── BannerIcon.jsx         # Banner tab ikonu
│
├── constants/                     # Merkezi konfigurasyonlar
│   ├── theme.js                   # Renk paleti, glassmorphism tokenlari
│   ├── offices.js                 # 7 ofis (adres, SDN, fax)
│   ├── companies.js               # 23 sirket (ad, logo, website)
│   ├── designs.js                 # Tasarim varyantlari
│   ├── bannerConfig.js            # Banner sablonlari
│   ├── limits.js                  # Karakter limitleri
│   └── progressFields.js          # Form ilerleme alan tanimlari
│
├── hooks/                         # Custom React Hooks
│   ├── useMsal.js                 # Azure AD auth + token + profil foto
│   ├── useToast.js                # Toast bildirim yonetimi
│   └── useBannerCanvas.js         # Canvas banner render hook
│
├── i18n/
│   └── translations.js            # TR/EN ceviri sozlugu
│
├── icons/
│   └── svgDataUris.js             # SVG data URI ikonlar (email-safe PNG fallback)
│
├── signature/                     # Imza HTML ureticileri
│   ├── genSig.js                  # Classic tasarim (dikey ayirici + sosyal blok)
│   └── genSigCorporate.js         # Corporate tasarim (wave band + yuvarlatilmis kose)
│
├── styles/
│   └── globalCss.js               # Keyframes, responsive breakpoints, tooltip, tab bar CSS
│
└── utils/                         # Yardimci fonksiyonlar
    ├── formatting.js              # titleCase, telefon formatlama
    ├── generateVCard.js           # vCard 3.0 string uretici
    └── debouncedColor.js          # Renk secici debounce
```

### Performans Optimizasyonlari

- **React.memo** — Tum bilesenler memo ile sarili, gereksiz re-render onlenir
- **Lazy Loading** — QR, Kartvizit, Ayarlar modalleri `React.lazy()` + `Suspense`
- **Code Splitting** — Vite `manualChunks` (react, qrcode ayri bundle)
- **useMemo** — `effectiveStg`, `sigHTML`, `company`, `progress` derived state
- **Debounced Color** — Renk secicide performans icin debounce
- **Lazy Image** — Kartvizit arka plani (`bg-card.jpg`) lazy load — 710KB tasarruf

---

## Hizli Baslangic

```bash
# 1. Klonla
git clone https://github.com/djeanker34/TYRO-SignSnap.git
cd TYRO-SignSnap

# 2. Bagimliliklari kur
npm install

# 3. Azure AD (opsiyonel)
#    .env dosyasi olustur:
#    VITE_CLIENT_ID=your-azure-app-client-id
#    VITE_TENANT_ID=your-azure-tenant-id

# 4. Gelistirme sunucusu
npm run dev

# 5. Production build
npm run build
```

> **Not:** Azure AD degiskenleri olmadan uygulama calisir. Microsoft giris, Outlook uygulama ve yoneticiye bildir ozellikleri devre disi kalir.

---

## Desteklenen Sirketler (23)

| Grup | Sirketler |
|---|---|
| Ana Sirket | Tiryaki Agro |
| Tiryaki Anadolu | Pasa Tarim, Ergun Pirinc, Arbel Bakliyat, Mis Gida, Tiryaki Depoculuk |
| Tiryaki Gelisen Pazarlar | Tiryaki Global, Tiryaki Dubai, Tiryaki Shanghai, Tiryaki Moscow |
| Diger | Maxigrain, Prograin, Intact |
| Tiryaki Stratejik Hizmetler | TTECH, Tiryaki Inovasyon, Tiryaki Yatirim |
| Tiryaki Surdurulebilir Cozumler | Tiryaki Enerji, Tiryaki Cevre, Tiryaki Sosyal, GreenPulse, AgroVerde, EcoHarvest |

---

## Imza Yapilari

### Corporate (Wave Band)
```
┌──────────┬──────────────────────────────────────┐
│          │  ╭─────────────────────────────────╮  │
│  LOGO    │  │  Ad SOYAD          (navy arka   │  │
│ (sirket) │  │  Unvan              plan, sol    │  │
│          │  │  Adres              ust kose     │  │
│          │  │  SDN  GSM           yuvarlatilmis│  │
│          │  │  Email              130px)       │  │
├──────────┤  ╰─────────────────────────────────╯  │
│ site  in │                                       │
└──────────┴──────────────────────────────────────┘
```

### Classic (Sosyal Medya Blok)
```
┌──────────┬───┬──────────────────────────────────┐
│          │   │ Ad Soyad                          │
│  LOGO    │ | │ Unvan (TR) / Title (EN)           │
│ (sirket) │ | │ Sirket Adi                        │
│          │ | │ SDN | Fax | GSM                   │
│          │ | │ Email                             │
│          │   │ Adres                             │
├──────────┴───┴──────────────────────────────────┤
│ [in] [tw] [fb] [ig]                    website  │
└─────────────────────────────────────────────────┘
```

---

## Gelistirici Notlari

- Imza HTML'i tamamen **inline style** — e-posta istemci uyumlulugu (Outlook Word engine)
- Logolar **Base64** olarak gomulu, harici bagimliligi yok
- Corporate tasarimda `border-top-left-radius:130px` **inline** — `<style>` tag email'de strip ediliyor
- LinkedIn/telefon ikonlari email icin **PNG data URI** — SVG Outlook'ta desteklenmiyor
- Kopyalama: `ClipboardItem` API + `createRange`/`execCommand` DOM fallback
- Yoneticiye bildir: Imza `html2canvas` ile **PNG**'ye cevriliyor, `<img>` olarak mail body'sine gomulu
- Dark mode toggle mevcut, imza ciktisi her zaman acik tema
- `lucide-react@0.263.1` — Eski versiyon, bazi yeni ikonlar yok
- QR + Kartvizit Canvas API ile render

---

## Versiyonlama

[Semantic Versioning](https://semver.org/) kullanilir.

| Seviye | Aciklama | Ornek |
|---|---|---|
| Major (vX.0.0) | Mimari degisiklik, breaking change | Auth sistemi degisimi |
| Minor (v0.X.0) | Yeni ozellik | QR, Banner, Notify Manager |
| Patch (v0.0.X) | Bug fix, kucuk duzeltme | Responsive fix, renk duzeltme |

**Son Surum:** `v2.6.0`

---

## Linkler

| | Link |
|---|---|
| 🌐 Live App | [tyrosign.github.io](https://tyrosign.github.io/) |
| 📦 Source Code | [github.com/djeanker34/TYRO-SignSnap](https://github.com/djeanker34/TYRO-SignSnap) |
| 🚀 Deploy Repo | [github.com/tyrosign/tyrosign.github.io](https://github.com/tyrosign/tyrosign.github.io) |
| 🏢 Tiryaki Agro | [www.tiryaki.com.tr](https://www.tiryaki.com.tr) |
| 💻 TTECH | [www.ttech.com.tr](https://www.ttech.com.tr) |

---

<p align="center">
  <strong>Powered by TTECH Business Solutions</strong><br/>
  &copy; 2026 Tiryaki Agro
</p>
