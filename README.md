# TYRO Sign Snap — Corporate Signature Studio

**Tiryaki Agro** grubuna ait 23 sirket icin kurumsal e-posta imza olusturma platformu. Calisanlar tek bir arayuzden sirket, ofis, unvan ve iletisim bilgilerini girerek Outlook uyumlu HTML imzalarini olusturur.

![React 18](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=white)
![Vite 5](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![MSAL](https://img.shields.io/badge/Auth-Azure%20AD%20%2F%20MSAL-0078D4?logo=microsoft&logoColor=white)
![Glassmorphism](https://img.shields.io/badge/Design-Glassmorphism-blue)
![License](https://img.shields.io/badge/License-Private-red)

---

## Ozellikler

### Imza Olusturucu
- **Cift Tasarim Modu** — Corporate (Wave Band) ve Classic (sosyal medya bloklu) olmak uzere iki farkli imza tasarimi arasinda gecis
- **23 Sirket Destegi** — Tiryaki Agro grup sirketlerinin tamami, logolari ile birlikte hazir tanimli. Sirket secildiginde logo otomatik degisir
- **7 Ofis** — Istanbul, Gaziantep, Mersin, Ankara, Dubai, Moskova, Shanghai. Ofis secildiginde adres, SDN ve Fax bilgileri otomatik dolar
- **Azure AD Entegrasyonu** — Microsoft Graph API uzerinden tek tikla ad, unvan, e-posta ve GSM bilgilerini cekme
- **Title Case Formatter** — Kucuk harfle yazilan unvanlari kurumsal standartlara gore otomatik duzeltir
- **Canli Onizleme** — Outlook gorunumunu taklit eden gercek zamanli imza onizlemesi
- **Promosyon Banneri** — Imzalarin altina kampanya veya etkinlik gorseli ekleme destegi
- **Iki Dil** — Turkce ve Ingilizce arayuz (i18n)

### Banner Uretici
- **Canvas Motoru** — LinkedIn veya e-posta icin yuksek cozunurluklu bannerlar uretin
- **Hazir Sablonlar** — Classic, Gold Elegance ve Light Modern secenekleri
- **Canli Editor** — Metin, renk ve yerlestirme ayarlari anlik olarak guncellenir

### Disa Aktarma
- **Rich HTML Copy** — `document.createRange` + `execCommand('copy')` ile Outlook Desktop & Web uyumlu zengin metin kopyalama
- **HTML Export** — `Blob` + `URL.createObjectURL` ile `.html` dosya olarak indirme
- **Adim Adim Rehber** — Outlook'a nasil yapistirildigi gorsel olarak anlatilir

---

## Teknoloji ve Mimari

| Katman | Teknoloji |
|---|---|
| Framework | React 18.2 (SPA) |
| Build Tool | Vite 5 |
| Auth | @azure/msal-browser (MSAL.js v2) |
| Ikonlar | lucide-react 0.263.1 |
| Styling | Inline CSS-in-JS (Glassmorphism) |
| Fontlar | Google Fonts — Inter + Plus Jakarta Sans |
| Deploy | GitHub Pages |

### Tasarim Sistemi
- **Primary:** `#1e3a5f` (Navy)
- **Accent:** `#c8922a` (Gold)
- **Divider:** `#0098d4` (Blue)
- **UI:** Glassmorphism — `backdrop-filter: blur`, saydam katmanlar, hafif golge ve yumusak kenarlar
- **Animasyonlar:** `fadeIn`, `slideInLeft`, `slideInRight`, `pulse` keyframes

### Mimari Yaklasim
- **Modular Component Tree** — 15+ bilesen, her biri `memo()` ile optimize
- **Custom Hooks** — `useMsal`, `useToast`, `useBannerCanvas`
- **Centralized Constants** — Tema, ofis, sirket, tasarim ve limit degerleri ayri dosyalarda
- **Derived State** — `useMemo` ile hesaplanan `effectiveStg`, `company`, `progress` degerleri
- **Reusable UI Kit** — `GlassCard`, `FormField`, `SearchableSelect`, `Btn`, `SectionTitle`, `ToggleSwitch`, `ColorPicker`

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
    ├── main.jsx                          # Giris noktasi
    ├── App.jsx                           # Ana uygulama, state yonetimi, routing
    ├── defaultLogo.js                    # Fallback logo (Base64)
    │
    ├── components/
    │   ├── AppHeader.jsx                 # Ust baslik + dil/tema toggle
    │   ├── AppFooter.jsx                 # TTECH copyright footer
    │   ├── SignatureTab.jsx              # Imza olusturma sayfasi (ana sekme)
    │   ├── BannerTab.jsx                 # Banner uretici sayfasi
    │   ├── OutlookPreview.jsx            # Outlook benzeri canli onizleme
    │   ├── ExportSection.jsx             # Kopyala / Indir / Adim-adim rehber
    │   ├── DesignSwitcher.jsx            # Corporate / Classic tasarim gecisi
    │   ├── ProgressBar.jsx               # Form tamamlanma ilerleme cubugu
    │   ├── PromoBannerSection.jsx        # Promosyon banner ekleme alani
    │   ├── SettingsModal.jsx             # Gelismis ayarlar modali
    │   ├── ProfileDropdown.jsx           # Azure AD profil menusu
    │   ├── LoginSplash.jsx               # Giris ekrani animasyonu
    │   ├── ToastContainer.jsx            # Bildirim toast'lari
    │   ├── ErrorBoundary.jsx             # React error boundary
    │   │
    │   └── ui/
    │       ├── SearchableSelect.jsx      # Custom dropdown (gruplu, scroll)
    │       ├── GlassCard.jsx             # Glassmorphic kart bileşeni
    │       ├── FormField.jsx             # Label + input birlesik alan
    │       ├── Btn.jsx                   # Stilize buton
    │       ├── SectionTitle.jsx          # Ikon + baslik
    │       ├── ToggleSwitch.jsx          # Acma/kapama anahtari
    │       ├── ColorPicker.jsx           # Renk secici
    │       ├── TabBtn.jsx                # Sekme butonu
    │       ├── TyroLogo.jsx              # SVG logo bileşeni
    │       └── BannerIcon.jsx            # Banner ikon bileşeni
    │
    ├── constants/
    │   ├── theme.js                      # Renk paleti, golge, border degerleri
    │   ├── offices.js                    # 7 ofis: adres, SDN, Fax
    │   ├── companies.js                  # 23 sirket: logo (Base64), grup
    │   ├── designs.js                    # Tasarim varyantlari
    │   ├── limits.js                     # Karakter ve boyut limitleri
    │   ├── progressFields.js             # Ilerleme cubugu alan eslestirmeleri
    │   └── bannerConfig.js               # Banner sablon konfigurasyonu
    │
    ├── hooks/
    │   ├── useMsal.js                    # Azure AD / MSAL authentication hook
    │   ├── useToast.js                   # Toast bildirim hook'u
    │   └── useBannerCanvas.js            # Canvas tabanli banner uretim hook'u
    │
    ├── i18n/
    │   └── translations.js              # TR/EN ceviri sozlugu
    │
    ├── icons/
    │   └── svgDataUris.js               # Imza icindeki SVG ikonlar (data URI)
    │
    ├── signature/
    │   ├── genSig.js                     # Classic imza HTML uretici
    │   └── genSigCorporate.js            # Corporate (Wave Band) imza HTML uretici
    │
    ├── styles/
    │   └── globalCss.js                  # Global CSS (keyframes, responsive)
    │
    └── utils/
        ├── formatting.js                 # titleCase, telefon formatlama
        └── debouncedColor.js             # Renk secici debounce yardimcisi
```

---

## Kurulum

```bash
# 1. Repoyu klonlayin
git clone https://github.com/djeanker34/TYRO-SignSnap.git
cd TYRO-SignSnap

# 2. Bagimliliklari kurun
npm install

# 3. Ortam degiskenlerini yapilandirin
#    Kok dizine .env dosyasi olusturun:
#    VITE_CLIENT_ID=your-azure-app-client-id
#    VITE_TENANT_ID=your-azure-tenant-id

# 4. Gelistirme sunucusunu baslatın
npm run dev

# 5. Production build
npm run build
```

---

## Imza Yapisi

Her imza 3 bolumden olusur:

```
┌──────────┬───┬────────────────────────────────────────┐
│          │   │ Ad Soyad                               │
│  LOGO    │ | │ Unvan (TR) / Title (EN)                │
│ (sirket) │ | │ Sirket Adi                              │
│          │ | │ SDN: ... | Fax: ...                     │
│          │ | │ GSM: ... | Email: ...                   │
│          │   │ Adres                                   │
├──────────┴───┴────────────────────────────────────────┤
│ [LinkedIn] [Twitter] [Facebook] [Instagram]  website  │
└───────────────────────────────────────────────────────┘
```

- **Sol:** Secilen sirketin logosu (Base64 gomulu)
- **Orta:** Dikey accent cizgi ayirici + calisan bilgileri
- **Alt:** Navy arka planli sosyal medya ikonu gridi + website

---

## Temel Fonksiyonlar

| Fonksiyon | Aciklama |
|---|---|
| `genSig()` | Classic tasarim HTML ciktisi |
| `genSigCorporate()` | Corporate (Wave Band) tasarim HTML ciktisi |
| `titleCase()` | Unvan metnini kurumsal standarda cevirir |
| `useMsal()` | Azure AD ile oturum acma ve Graph API cagrilari |
| `useBannerCanvas()` | Canvas uzerinde banner render + export |
| `useToast()` | Bildirim gosterme/gizleme yonetimi |
| `effectiveStg` | Sirket secimini logo ile birlestiren derived state |
| `doCopy()` | DOM-based rich HTML kopyalama (Outlook uyumlu) |

---

## Desteklenen Sirketler

| Grup | Sirketler |
|---|---|
| Ana Sirket | Tiryaki Agro |
| Tiryaki Anadolu | Pasa Tarim, Ergun Pirinc, Arbel Bakliyat, Mis Gida, Tiryaki Depoculuk |
| Tiryaki Gelisen Pazarlar | Tiryaki Global, Tiryaki Dubai, Tiryaki Shanghai, Tiryaki Moscow |
| Diger Sirketler | Maxigrain, Prograin, Intact |
| Tiryaki Stratejik Hizmetler | TTECH, Tiryaki Inovasyon, Tiryaki Yatirim |
| Tiryaki Surdurulebilir Cozumler | Tiryaki Enerji, Tiryaki Cevre, Tiryaki Sosyal, GreenPulse, AgroVerde, EcoHarvest |

---

## Gelistirici Notlari

- `lucide-react@0.263.1` — Eski versiyon; bazi yeni ikonlar (Wand2, Sparkles, Building2 vb.) mevcut degil
- Imza HTML'i tamamen inline style kullanir (e-posta istemci uyumlulugu icin)
- Logolar Base64 olarak gomulur, harici bagimliligi yoktur
- `ClipboardItem` API desteklenmedigi icin DOM-based (`createRange` + `execCommand`) kopyalama kullanilir
- Dark mode toggle mevcut ancak imza ciktisi her zaman acik tema uzerinedir

---

**Powered by TTECH Business Solutions**
© 2026 Tiryaki Agro — [www.tiryaki.com.tr](https://www.tiryaki.com.tr)
