<p align="center">
  <img src="https://www.tiryaki.com.tr/Content/images/logo/tiryaki_logo.svg" alt="Tiryaki Agro" width="200" />
</p>

<h1 align="center">TYRO Sign Snap</h1>
<h3 align="center">Corporate Email Signature Studio</h3>

<p align="center">
  <strong>Tiryaki Agro grubuna ait 23 sirket icin kurumsal e-posta imza olusturma platformu.</strong><br/>
  Calisanlar tek bir arayuzden sirket, ofis, unvan ve iletisim bilgilerini girerek<br/>
  Outlook uyumlu HTML imzalarini aninda olusturur, kopyalar ve uygular.
</p>

<p align="center">
  <a href="https://tyrosign.github.io/"><img src="https://img.shields.io/badge/🌐_Live_Demo-tyrosign.github.io-1e3a5f?style=for-the-badge" alt="Live Demo" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React 18" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 5" />
  <img src="https://img.shields.io/badge/Azure_AD-MSAL_v2-0078D4?style=flat-square&logo=microsoftazure&logoColor=white" alt="MSAL" />
  <img src="https://img.shields.io/badge/Microsoft_Graph-API-00BCF2?style=flat-square&logo=microsoft&logoColor=white" alt="Graph API" />
  <img src="https://img.shields.io/badge/QR_vCard-3.0-c8922a?style=flat-square" alt="vCard QR" />
  <img src="https://img.shields.io/badge/Design-Glassmorphism-blue?style=flat-square" alt="Glassmorphism" />
  <img src="https://img.shields.io/badge/i18n-TR_|_EN-green?style=flat-square" alt="i18n" />
  <img src="https://img.shields.io/badge/License-Private-red?style=flat-square" alt="License" />
</p>

---

## Ozellikler

### Imza Olusturucu
- **Cift Tasarim Modu** — Corporate (Wave Band) ve Classic (sosyal medya bloklu) olmak uzere iki farkli imza tasarimi
- **23 Sirket Destegi** — Tiryaki Agro grup sirketlerinin tamami logolari ile hazir tanimli
- **7 Ofis** — Istanbul, Gaziantep, Mersin, Ankara, Dubai, Moskova, Shanghai — ofis secildiginde adres/SDN/Fax otomatik dolar
- **Azure AD Entegrasyonu** — Microsoft hesabiyla giris yaparak ad, unvan, e-posta ve GSM bilgilerini tek tikla cekme
- **Outlook'a Tek Tikla Uygulama** — Microsoft Graph API uzerinden imzayi dogrudan Outlook hesabina yazar
- **Canli Onizleme** — Outlook gorunumunu taklit eden gercek zamanli imza onizlemesi
- **Promosyon Banneri** — Imzalarin altina kampanya veya etkinlik gorseli ekleme
- **Title Case Formatter** — Kucuk/buyuk harfle yazilan isimleri ve unvanlari otomatik duzeltir
- **Iki Dil** — Turkce ve Ingilizce arayuz

### QR Kartvizit
- **vCard 3.0 QR Kodu** — Form bilgilerinden (ad, unvan, sirket, telefon, email, adres, LinkedIn) vCard QR kodu uretir
- **Kartvizit Onizleme** — Glassmorphic modal icinde canli onizleme
- **PNG Indirme** — Profesyonel kartvizit tasarimli PNG olarak indirme
- **Telefonla Okut & Kaydet** — QR kodu telefonla okutularak kisi rehbere kaydedilebilir

### Banner Uretici
- **Canvas Motoru** — LinkedIn veya e-posta icin yuksek cozunurluklu bannerlar
- **Hazir Sablonlar** — Classic, Gold Elegance ve Light Modern secenekleri
- **Canli Editor** — Metin, renk ve yerlestirme ayarlari anlik guncellenir

### Disa Aktarma
- **Rich HTML Kopyalama** — Outlook Desktop & Web uyumlu zengin metin kopyalama
- **Outlook'a Uygula** — Graph API ile imzayi direkt Outlook'a yazma (Azure AD oturumu gerektirir)
- **QR Kartvizit Uret** — vCard QR kodu olustur ve PNG olarak indir
- **Adim Adim Rehber** — Outlook'a nasil yapistirildigi aciklanir

---

## Teknoloji ve Mimari

| Katman | Teknoloji |
|---|---|
| Framework | React 18.2 (SPA) |
| Build Tool | Vite 5 |
| Auth | @azure/msal-browser (MSAL.js v2) |
| API | Microsoft Graph API (MailboxSettings) |
| QR | qrcode (vCard 3.0 encoding) |
| Ikonlar | lucide-react 0.263.1 |
| Styling | Inline CSS-in-JS (Glassmorphism) |
| Fontlar | Google Fonts — Inter + Plus Jakarta Sans |
| Deploy | GitHub Pages + GitHub Actions |

### Tasarim Sistemi
| Renk | Kod | Kullanim |
|---|---|---|
| Navy | `#1e3a5f` | Primary — basliklar, logo, arka plan |
| Gold | `#c8922a` | Accent — butonlar, vurgular |
| Blue | `#0098d4` | Divider — ayirici cizgiler, linkler |

- **UI:** Glassmorphism — `backdrop-filter: blur`, saydam katmanlar, hafif golge
- **Animasyonlar:** `fadeIn`, `slideInLeft`, `slideInRight`, `pulse`, `signing` keyframes
- **Responsive:** 768px ve 480px breakpoint'leri ile tam mobil uyum

### Mimari
- **15+ Modular Bilesen** — Her biri `React.memo()` ile optimize
- **Custom Hooks** — `useMsal`, `useToast`, `useBannerCanvas`
- **Centralized Constants** — Tema, ofis, sirket, tasarim ve limitler ayri dosyalarda
- **Derived State** — `useMemo` ile `effectiveStg`, `company`, `progress`
- **Reusable UI Kit** — `GlassCard`, `FormField`, `SearchableSelect`, `Btn`, `SectionTitle`, `ToggleSwitch`, `ColorPicker`

---

## Hizli Baslangic

```bash
# 1. Repoyu klonlayin
git clone https://github.com/djeanker34/TYRO-SignSnap.git
cd TYRO-SignSnap

# 2. Bagimliliklari kurun
npm install

# 3. Ortam degiskenleri (Azure AD icin)
#    .env dosyasi olusturun:
#    VITE_CLIENT_ID=your-azure-app-client-id
#    VITE_TENANT_ID=your-azure-tenant-id

# 4. Gelistirme sunucusu
npm run dev

# 5. Production build
npm run build
```

> **Not:** Azure AD degiskenleri olmadan uygulama calisir ancak Microsoft hesabi ile giris ve Outlook'a uygulama ozellikleri devre disi kalir.

---

## Proje Yapisi

```
TYRO-SignSnap/
├── index.html
├── package.json
├── vite.config.js
├── CLAUDE.md
├── README.md
│
└── src/
    ├── main.jsx                    # Giris noktasi
    ├── App.jsx                     # Ana uygulama + state yonetimi
    ├── defaultLogo.js              # Fallback logo (Base64)
    │
    ├── components/
    │   ├── AppHeader.jsx           # Ust baslik + dil/tema toggle
    │   ├── AppFooter.jsx           # TTECH copyright footer
    │   ├── SignatureTab.jsx        # Imza olusturma sayfasi
    │   ├── BannerTab.jsx           # Banner uretici
    │   ├── OutlookPreview.jsx      # Outlook benzeri canli onizleme
    │   ├── ExportSection.jsx       # Kopyala / Outlook / QR / Sifirla
    │   ├── QrModal.jsx             # QR kartvizit modal
    │   ├── DesignSwitcher.jsx      # Corporate / Classic gecisi
    │   ├── ProgressBar.jsx         # Form tamamlanma ilerleme cubugu
    │   ├── PromoBannerSection.jsx  # Promosyon banner alani
    │   ├── SettingsModal.jsx       # Gelismis ayarlar modali
    │   ├── ProfileDropdown.jsx     # Azure AD profil menusu
    │   ├── LoginSplash.jsx         # Giris ekrani animasyonu
    │   ├── ToastContainer.jsx      # Bildirim toast'lari
    │   ├── ErrorBoundary.jsx       # React error boundary
    │   └── ui/                     # Reusable UI kit (10+ bilesen)
    │
    ├── constants/                  # Tema, ofis, sirket, tasarim, limitler
    ├── hooks/                      # useMsal, useToast, useBannerCanvas
    ├── i18n/                       # TR/EN ceviri sozlugu
    ├── icons/                      # SVG data URI ikonlar
    ├── signature/                  # Imza HTML ureticileri (Classic + Corporate)
    ├── styles/                     # Global CSS (keyframes, responsive)
    └── utils/                      # Yardimci fonksiyonlar (vCard, titleCase, vb.)
```

---

## Imza Yapisi

```
┌──────────┬───┬────────────────────────────────────────┐
│          │   │ Ad Soyad                               │
│  LOGO    │ | │ Unvan (TR) / Title (EN)                │
│ (sirket) │ | │ Sirket Adi                             │
│          │ | │ SDN: ... | Fax: ...                    │
│          │ | │ GSM: ... | Email: ...                  │
│          │   │ Adres                                  │
├──────────┴───┴────────────────────────────────────────┤
│ [LinkedIn] [Twitter] [Facebook] [Instagram]  website  │
└───────────────────────────────────────────────────────┘
```

---

## Desteklenen Sirketler (23)

| Grup | Sirketler |
|---|---|
| Ana Sirket | Tiryaki Agro |
| Tiryaki Anadolu | Pasa Tarim, Ergun Pirinc, Arbel Bakliyat, Mis Gida, Tiryaki Depoculuk |
| Tiryaki Gelisen Pazarlar | Tiryaki Global, Tiryaki Dubai, Tiryaki Shanghai, Tiryaki Moscow |
| Diger Sirketler | Maxigrain, Prograin, Intact |
| Tiryaki Stratejik Hizmetler | TTECH, Tiryaki Inovasyon, Tiryaki Yatirim |
| Tiryaki Surdurulebilir Cozumler | Tiryaki Enerji, Tiryaki Cevre, Tiryaki Sosyal, GreenPulse, AgroVerde, EcoHarvest |

---

## Linkler

| | Link |
|---|---|
| Live Demo | [tyrosign.github.io](https://tyrosign.github.io/) |
| Source Code | [github.com/djeanker34/TYRO-SignSnap](https://github.com/djeanker34/TYRO-SignSnap) |
| Deploy Repo | [github.com/tyrosign/tyrosign.github.io](https://github.com/tyrosign/tyrosign.github.io) |
| Tiryaki Agro | [www.tiryaki.com.tr](https://www.tiryaki.com.tr) |
| TTECH | [www.ttech.com.tr](https://www.ttech.com.tr) |

---

## Gelistirici Notlari

- Imza HTML'i tamamen **inline style** kullanir (e-posta istemci uyumlulugu)
- Logolar **Base64** olarak gomulur, harici bagimliligi yoktur
- DOM-based kopyalama (`createRange` + `execCommand`) — ClipboardItem destegi olmayan ortamlar icin
- Dark mode toggle mevcut, imza ciktisi her zaman acik tema uzerinedir
- `lucide-react@0.263.1` — Bazi yeni ikonlar (Wand2, Sparkles vb.) bu versiyonda mevcut degil
- QR kartvizit Canvas API ile render edilir, indirilen PNG modal onizleme ile birebir eslesir

---

<p align="center">
  <strong>Powered by TTECH Business Solutions</strong><br/>
  &copy; 2026 Tiryaki Agro
</p>
