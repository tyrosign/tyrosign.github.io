// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMPANIES (Tiryaki Grup Şirketleri)
// Her şirketin logoBase64 alanı gerçek logolarla güncellenecek.
// Şimdilik tümü varsayılan Tiryaki logosunu kullanır.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import DEFAULT_LOGO_BASE64 from '../defaultLogo.js';

const D = { logoBase64: DEFAULT_LOGO_BASE64, logoW: 140, logoH: 45 };

export const COMPANIES = [
  // Ana Şirket (varsayılan)
  { id: 'tiryaki-agro', group: 'Ana Şirket', name: 'Tiryaki Agro', ...D },

  // Tiryaki Anadolu
  { id: 'tiryaki-tahil', group: 'Tiryaki Anadolu', name: 'Tiryaki Tahıl', ...D },
  { id: 'tiryaki-yem', group: 'Tiryaki Anadolu', name: 'Tiryaki Yem', ...D },
  { id: 'tiryaki-nuts', group: 'Tiryaki Anadolu', name: 'Tiryaki Nuts', ...D },
  { id: 'tiryaki-tarim', group: 'Tiryaki Anadolu', name: 'Tiryaki Tarım', ...D },
  { id: 'tiryaki-tohum', group: 'Tiryaki Anadolu', name: 'Tiryaki Tohum', ...D },
  { id: 'tiryaki-lidas', group: 'Tiryaki Anadolu', name: 'Tiryaki Lidaş', ...D },
  { id: 'tiryaki-suriye', group: 'Tiryaki Anadolu', name: 'Tiryaki Suriye', ...D },
  { id: 'tiryaki-saf', group: 'Tiryaki Anadolu', name: 'Tiryaki SAF', ...D },
  { id: 'hasata', group: 'Tiryaki Anadolu', name: 'Hasata', ...D },

  // Tiryaki Gelişen Pazarlar
  { id: 'tiryaki-irak', group: 'Tiryaki Gelişen Pazarlar', name: 'Tiryaki Irak', ...D },
  { id: 'tiryaki-gana', group: 'Tiryaki Gelişen Pazarlar', name: 'Tiryaki Gana', ...D },
  { id: 'tiryaki-nijerya', group: 'Tiryaki Gelişen Pazarlar', name: 'Tiryaki Nijerya', ...D },
  { id: 'tiryaki-venezuela', group: 'Tiryaki Gelişen Pazarlar', name: 'Tiryaki Venezuela', ...D },

  // Bağımsız Şirketler
  { id: 'tiryaki-organik', group: 'Diğer Şirketler', name: 'Tiryaki Organik', ...D },
  { id: 'sunrise-foods', group: 'Diğer Şirketler', name: 'Sunrise Foods International', ...D },
  { id: 'ozark', group: 'Diğer Şirketler', name: 'Ozark', ...D },
  { id: 'giresunport', group: 'Diğer Şirketler', name: 'Giresunport', ...D },

  // Tiryaki Stratejik Hizmetler
  { id: 'tiryaki-denizcilik', group: 'Tiryaki Stratejik Hizmetler', name: 'Tiryaki Denizcilik Operasyonları', ...D },
  { id: 'tiryaki-denizyolu', group: 'Tiryaki Stratejik Hizmetler', name: 'Tiryaki Deniz Yolu Taşımacılığı', ...D },
  { id: 'tiryaki-ttech', group: 'Tiryaki Stratejik Hizmetler', name: 'Tiryaki T-Tech İş Çözümleri', ...D },

  // Tiryaki Sürdürülebilir Çözümler
  { id: 'tiryaki-kazakistan', group: 'Tiryaki Sürdürülebilir Çözümler', name: 'Tiryaki Kazakistan', ...D },
  { id: 'tiryaki-bioethanol', group: 'Tiryaki Sürdürülebilir Çözümler', name: 'Tiryaki Bioethanol', ...D },
];

export const COMPANY_GROUPS = [
  'Ana Şirket',
  'Tiryaki Anadolu',
  'Tiryaki Gelişen Pazarlar',
  'Diğer Şirketler',
  'Tiryaki Stratejik Hizmetler',
  'Tiryaki Sürdürülebilir Çözümler',
];
