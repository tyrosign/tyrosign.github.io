<p align="center">
  <img src="https://www.tiryaki.com.tr/Content/images/logo/tiryaki_logo.svg" alt="Tiryaki Agro" width="200" />
</p>

<h1 align="center">TYRO Sign Snap</h1>
<h3 align="center">Corporate Email Signature Studio</h3>

<p align="center">
  <a href="https://tyrosign.github.io/"><img src="https://img.shields.io/badge/🌐_Live-tyrosign.github.io-1e3a5f?style=for-the-badge" alt="Live" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Azure_AD-MSAL-0078D4?style=flat-square&logo=microsoftazure&logoColor=white" alt="MSAL" />
  <img src="https://img.shields.io/badge/GitHub_Pages-Deployed-222?style=flat-square&logo=github&logoColor=white" alt="Pages" />
</p>

---

## Nedir?

**TYRO Sign Snap**, Tiryaki Agro grubuna ait **23 sirket** icin kurumsal e-posta imza olusturma platformudur. Calisanlar bu aracla:

- Outlook uyumlu **HTML imza** olusturur ve kopyalar
- **Azure AD** ile giris yaparak bilgilerini otomatik ceker
- **Microsoft Graph API** ile imzayi dogrudan Outlook'a uygular
- **QR Kartvizit** olusturur — telefonla okutularak rehbere kaydedilebilir
- **Banner** tasarlar — LinkedIn ve e-posta icin profesyonel gorsel uretir

## Ozellikler

- 2 imza tasarimi (Corporate Wave Band + Classic)
- 23 sirket logolu secim
- 7 ofis (Istanbul, Gaziantep, Mersin, Ankara, Dubai, Moskova, Shanghai)
- Azure AD / MSAL ile SSO
- Outlook'a tek tikla imza yazma (Graph API)
- vCard 3.0 QR kartvizit (PNG indirme)
- Canvas tabanli banner uretici
- Turkce / Ingilizce arayuz
- Tam mobil uyum (responsive)
- Glassmorphism tasarim sistemi

## Deployment

Bu repo **GitHub Actions** ile otomatik build edilir ve **GitHub Pages** uzerinden yayinlanir.

Her `main` branch'e push yapildiginda:
1. `npm ci` ile bagimliliklar yuklenir
2. `npm run build` ile production build olusturulur
3. `dist/` klasoru GitHub Pages'e deploy edilir

## Linkler

| | |
|---|---|
| Live Site | [tyrosign.github.io](https://tyrosign.github.io/) |
| Source Code | [github.com/djeanker34/TYRO-SignSnap](https://github.com/djeanker34/TYRO-SignSnap) |
| Tiryaki Agro | [www.tiryaki.com.tr](https://www.tiryaki.com.tr) |
| TTECH | [www.ttech.com.tr](https://www.ttech.com.tr) |

---

<p align="center">
  <strong>Powered by TTECH Business Solutions</strong><br/>
  &copy; 2026 Tiryaki Agro
</p>
