# 🖋️ TYRO Sign Snap

**Tiryaki Sign Artist** — Tiryaki Agro için özel olarak geliştirilmiş, premium ve kullanıcı dostu kurumsal e-posta imza oluşturma platformu.

![Premium Design](https://img.shields.io/badge/Design-Glassmorphism-blue)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![Azure AD](https://img.shields.io/badge/Auth-Azure%20AD-0078D4?logo=microsoft)

---

## ✨ Özellikler

### 🛡️ Kurumsal Kimlik & Tasarım
- **Çift Tasarım Modu:**
  - **Corporate (Kurumsal):** Modern "Wave Band" (dalga bantlı) tasarım.
  - **Classic (Klasik):** Sosyal medya bloklu geleneksel kurumsal yapı.
- **Glassmorphism UI:** En son tasarım trendlerine uygun, Apple/iOS esintili şeffaf ve şık arayüz.
- **Dinamik Animasyonlar:** Akıcı geçişler, imza atma animasyonlu splash screen ve hover efektleri.

### 🪄 Akıllı Fonksiyonlar
- **Otomatik Veri Çekme:** Azure AD (Microsoft Graph API) entegrasyonu ile kullanıcı bilgilerini (ad, ünvan, e-posta, gsm) tek tıkla otomatik doldurma.
- **Akıllı Ofis Yönetimi:** Ofis seçildiğinde adres, SDN ve Fax bilgileri anında güncellenir.
- **Title Case Formatter:** Ünvanlardaki büyük-küçük harf hatalarını kurumsal standartlara göre otomatik düzeltir.
- **Özelleştirilebilir Banner:** İmzaların altına kampanya veya etkinlik görseli (Promosyon Bannerı) ekleme desteği.

### 📊 Banner Üretici
- **Canvas Motoru:** LinkedIn veya e-posta için yüksek çözünürlüklü banner'lar üretin.
- **Hazır Şablonlar:** Classic, Gold Elegance ve Light Modern seçenekleri.

### 📤 Outlook Entegrasyonu
- **Rich HTML Copy:** Outlook (Desktop & Web) ile tam uyumlu zengin metin kopyalama.
- **HTML Export:** Çevrimdışı kullanım için `.html` olarak indirme imkanı.

---

## 🛠️ Kurulum & Çalıştırma

### 1. Depoyu Klonlayın
```bash
git clone [repository-url]
cd TYRO-SignSnap
```

### 2. Bağımlılıkları Kurun
```bash
npm install
```

### 3. Ortam Değişkenlerini Yapılandırın
Azure AD entegrasyonu için kök dizine bir `.env` dosyası oluşturun:
```env
VITE_CLIENT_ID=your-azure-app-client-id
VITE_TENANT_ID=your-azure-tenant-id
```

### 4. Geliştirme Modunda Çalıştırın
```bash
npm run dev
```

---

## 🏗️ Proje Yapısı

- `src/App.jsx`: Ana uygulama mantığı, tasarımlar ve durum yönetimi (Single-file Component).
- `src/main.jsx`: Giriş noktası.
- `src/defaultLogo.js`: Şirket logosu (Base64).
- `vite.config.js`: Derleme ve sunucu yapılandırması.

---

**Powered by TTECH Business Solutions**  
© 2026 Tiryaki Agro - [www.tiryaki.com.tr](https://www.tiryaki.com.tr)
