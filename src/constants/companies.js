// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMPANIES (Tiryaki Grup Şirketleri)
// Her şirketin logoTR / logoEN alanı public/logos/ altındaki PNG'lere işaret eder.
// Dil seçimine göre doğru logo runtime'da yüklenir.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const BASE = import.meta.env.BASE_URL + 'logos/';

export const COMPANIES = [
  // ── Ana Şirket ──
  { id: 'tiryaki-agro', group: 'Ana Şirket', name: 'Tiryaki Agro', nameEN: 'Tiryaki Agro',
    logoTR: null, logoEN: null },

  // ── Tiryaki Anadolu ──
  { id: 'tiryaki-anadolu', group: 'Tiryaki Anadolu', name: 'Tiryaki Anadolu', nameEN: 'Tiryaki Anadolu',
    logoTR: BASE + 'tiryaki-anadolu-tr.png', logoEN: BASE + 'tiryaki-anadolu-en.png' },
  { id: 'tiryaki-tahil', group: 'Tiryaki Anadolu', name: 'Tiryaki Tahıl', nameEN: 'Tiryaki Grain',
    logoTR: BASE + 'tiryaki-tahil-tr.png', logoEN: BASE + 'tiryaki-tahil-en.png' },
  { id: 'tiryaki-yem', group: 'Tiryaki Anadolu', name: 'Tiryaki Yem', nameEN: 'Tiryaki Feed',
    logoTR: BASE + 'tiryaki-yem-tr.png', logoEN: BASE + 'tiryaki-yem-en.png' },
  { id: 'tiryaki-nuts', group: 'Tiryaki Anadolu', name: 'Tiryaki Nuts', nameEN: 'Tiryaki Nuts',
    logoTR: BASE + 'tiryaki-nuts-tr.png', logoEN: BASE + 'tiryaki-nuts-en.png' },
  { id: 'tiryaki-tarim', group: 'Tiryaki Anadolu', name: 'Tiryaki Tarım', nameEN: 'Tiryaki Farming',
    logoTR: BASE + 'tiryaki-tarim-tr.png', logoEN: BASE + 'tiryaki-tarim-en.png' },
  { id: 'tiryaki-tohum', group: 'Tiryaki Anadolu', name: 'Tiryaki Tohum', nameEN: 'Tiryaki Seed',
    logoTR: BASE + 'tiryaki-tohum-tr.png', logoEN: BASE + 'tiryaki-tohum-en.png' },
  { id: 'tiryaki-lidas', group: 'Tiryaki Anadolu', name: 'Tiryaki Lidaş', nameEN: 'Tiryaki Lidaş',
    logoTR: BASE + 'tiryaki-lidas-tr.png', logoEN: BASE + 'tiryaki-lidas-en.png' },
  { id: 'tiryaki-suriye', group: 'Tiryaki Anadolu', name: 'Tiryaki Suriye', nameEN: 'Tiryaki Syria',
    logoTR: BASE + 'tiryaki-suriye-tr.png', logoEN: BASE + 'tiryaki-suriye-en.png' },
  { id: 'tiryaki-saf', group: 'Tiryaki Anadolu', name: 'Tiryaki SAF', nameEN: 'Tiryaki SAF',
    logoTR: BASE + 'tiryaki-saf-tr.png', logoEN: BASE + 'tiryaki-saf-en.png' },
  { id: 'hasata', group: 'Tiryaki Anadolu', name: 'Hasata', nameEN: 'Hasata',
    logoTR: BASE + 'hasata-tr.png', logoEN: BASE + 'hasata-en.png' },
  { id: 'tiryaki-yudum', group: 'Tiryaki Anadolu', name: 'Tiryaki Yudum', nameEN: 'Tiryaki Yudum',
    logoTR: BASE + 'tiryaki-yudum-tr.png', logoEN: BASE + 'tiryaki-yudum-en.png' },

  // ── Tiryaki Gelişen Pazarlar ──
  { id: 'tiryaki-gp', group: 'Tiryaki Gelişen Pazarlar', name: 'Tiryaki Gelişen Pazarlar', nameEN: 'Tiryaki Emerging Markets',
    logoTR: BASE + 'tiryaki-gp-tr.png', logoEN: BASE + 'tiryaki-gp-en.png' },
  { id: 'tiryaki-irak', group: 'Tiryaki Gelişen Pazarlar', name: 'Tiryaki Irak', nameEN: 'Tiryaki Iraq',
    logoTR: BASE + 'tiryaki-irak-tr.png', logoEN: BASE + 'tiryaki-irak-en.png' },
  { id: 'tiryaki-gana', group: 'Tiryaki Gelişen Pazarlar', name: 'Tiryaki Gana', nameEN: 'Tiryaki Ghana',
    logoTR: BASE + 'tiryaki-gana-tr.png', logoEN: BASE + 'tiryaki-gana-en.png' },
  { id: 'tiryaki-nijerya', group: 'Tiryaki Gelişen Pazarlar', name: 'Tiryaki Nijerya', nameEN: 'Tiryaki Nigeria',
    logoTR: BASE + 'tiryaki-nijerya-tr.png', logoEN: BASE + 'tiryaki-nijerya-en.png' },
  { id: 'tiryaki-venezuela', group: 'Tiryaki Gelişen Pazarlar', name: 'Tiryaki Venezuela', nameEN: 'Tiryaki Venezuela',
    logoTR: BASE + 'tiryaki-venezuela-tr.png', logoEN: BASE + 'tiryaki-venezuela-en.png' },
  { id: 'tiryaki-doguafrika', group: 'Tiryaki Gelişen Pazarlar', name: 'Tiryaki Doğu Afrika', nameEN: 'Tiryaki East Africa',
    logoTR: BASE + 'tiryaki-doguafrika-tr.png', logoEN: BASE + 'tiryaki-doguafrika-en.png' },

  // ── Tiryaki Organik ──
  { id: 'tiryaki-organik', group: 'Tiryaki Organik', name: 'Tiryaki Organik', nameEN: 'Tiryaki Organics',
    logoTR: BASE + 'tiryaki-organik-tr.png', logoEN: BASE + 'tiryaki-organik-en.png' },
  { id: 'sunrise-foods', group: 'Tiryaki Organik', name: 'Sunrise Foods International', nameEN: 'Sunrise Foods International',
    logoTR: BASE + 'sunrise-foods-tr.png', logoEN: BASE + 'sunrise-foods-en.png' },
  { id: 'ozark', group: 'Tiryaki Organik', name: 'Ozark Organics', nameEN: 'Ozark Organics',
    logoTR: BASE + 'ozark-tr.png', logoEN: BASE + 'ozark-en.png' },
  { id: 'giresunport', group: 'Tiryaki Organik', name: 'Giresunport', nameEN: 'Giresunport',
    logoTR: BASE + 'giresunport-tr.png', logoEN: BASE + 'giresunport-en.png' },
  { id: 'tiryaki-tuketici', group: 'Tiryaki Organik', name: 'Tiryaki Tüketici Markaları', nameEN: 'Tiryaki Consumer Brands',
    logoTR: BASE + 'tiryaki-tuketici-tr.png', logoEN: BASE + 'tiryaki-tuketici-en.png' },

  // ── Tiryaki Stratejik Hizmetler ──
  { id: 'tiryaki-stratejik', group: 'Tiryaki Stratejik Hizmetler', name: 'Tiryaki Stratejik Hizmetler', nameEN: 'Tiryaki Strategic Services',
    logoTR: BASE + 'tiryaki-stratejik-tr.png', logoEN: BASE + 'tiryaki-stratejik-en.png' },
  { id: 'tiryaki-denizyolu', group: 'Tiryaki Stratejik Hizmetler', name: 'Tiryaki Deniz Yolu Taşımacılığı', nameEN: 'Tiryaki Maritime Transports',
    logoTR: BASE + 'tiryaki-denizyolu-tr.png', logoEN: BASE + 'tiryaki-denizyolu-en.png' },
  { id: 'tiryaki-gemi-acenteligi', group: 'Tiryaki Stratejik Hizmetler', name: 'Tiryaki Gemi Acenteliği', nameEN: 'Tiryaki Shipping Agency',
    logoTR: BASE + 'tiryaki-gemi-acenteligi-tr.png', logoEN: BASE + 'tiryaki-gemi-acenteligi-en.png' },
  { id: 'tiryaki-ttech', group: 'Tiryaki Stratejik Hizmetler', name: 'Tiryaki T-Tech İş Çözümleri', nameEN: 'T-Tech Business Solutions',
    logoTR: BASE + 'tiryaki-ttech-tr.png', logoEN: BASE + 'tiryaki-ttech-en.png' },

  // ── Tiryaki Sürdürülebilir Çözümler ──
  { id: 'tiryaki-surdurulebilir', group: 'Tiryaki Sürdürülebilir Çözümler', name: 'Tiryaki Sürdürülebilir Çözümler', nameEN: 'Tiryaki Sustainable Solutions',
    logoTR: BASE + 'tiryaki-surdurulebilir-tr.png', logoEN: BASE + 'tiryaki-surdurulebilir-en.png' },
  { id: 'tiryaki-kazakistan', group: 'Tiryaki Sürdürülebilir Çözümler', name: 'Tiryaki Kazakistan', nameEN: 'Tiryaki Kazakhstan',
    logoTR: BASE + 'tiryaki-kazakistan-tr.png', logoEN: BASE + 'tiryaki-kazakistan-en.png' },
  { id: 'tiryaki-bioethanol', group: 'Tiryaki Sürdürülebilir Çözümler', name: 'Tiryaki Bioethanol', nameEN: 'Tiryaki Bioethanol',
    logoTR: null, logoEN: null },
];

export const COMPANY_GROUPS = [
  'Ana Şirket',
  'Tiryaki Anadolu',
  'Tiryaki Gelişen Pazarlar',
  'Tiryaki Organik',
  'Tiryaki Stratejik Hizmetler',
  'Tiryaki Sürdürülebilir Çözümler',
];

export const COMPANY_GROUP_LABELS_EN = {
  'Ana Şirket': 'Main Company',
  'Tiryaki Anadolu': 'Tiryaki Anadolu',
  'Tiryaki Gelişen Pazarlar': 'Tiryaki Emerging Markets',
  'Tiryaki Organik': 'Tiryaki Organics',
  'Tiryaki Stratejik Hizmetler': 'Tiryaki Strategic Services',
  'Tiryaki Sürdürülebilir Çözümler': 'Tiryaki Sustainable Solutions',
};
