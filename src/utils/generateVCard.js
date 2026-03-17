/**
 * vCard 3.0 Generator
 * Form + office + company verilerinden vCard string üretir.
 * QR okutulduğunda telefon rehberine kişi ekleme ekranı açılır.
 */
import { formatGSM } from './formatting';

export function generateVCard(form, office, stg, company, lang) {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
  ];

  // Full Name
  const fn = [form.firstName, form.lastName].filter(Boolean).join(' ');
  if (fn) {
    lines.push('FN:' + fn);
    lines.push('N:' + (form.lastName || '') + ';' + (form.firstName || '') + ';;;');
  }

  // Organization — şirket seçiminden gelir, yoksa ayarlardaki şirket adı
  const orgName = (lang === 'en' && company && company.nameEN) ? company.nameEN : ((company && company.name) || stg.companyName || 'Tiryaki Agro');
  lines.push('ORG:' + orgName);

  // Title (TR + EN)
  const title = [form.titleTR, form.titleEN].filter(Boolean).join(' / ');
  if (title) {
    lines.push('TITLE:' + title);
  }

  // Mobile (GSM)
  if (form.gsm) {
    lines.push('TEL;TYPE=CELL:' + formatGSM(form.gsm).replace(/\s/g, ''));
  }

  // Office phone (SDN)
  if (office && office.sdn) {
    lines.push('TEL;TYPE=WORK:' + office.sdn.replace(/\s/g, ''));
  }

  // Email
  if (form.email) {
    lines.push('EMAIL;TYPE=INTERNET:' + form.email);
  }

  // Address
  if (office) {
    const addr = [office.address, office.city].filter(Boolean).join(', ');
    if (addr) {
      // ADR: PO Box;Extended;Street;City;Region;Postal;Country
      lines.push('ADR;TYPE=WORK:;;' + office.address + ';' + (office.city || '') + ';;;');
    }
  }

  // Website
  if (stg.website) {
    const url = stg.website.startsWith('http') ? stg.website : 'https://' + stg.website;
    lines.push('URL:' + url);
  }

  // LinkedIn (personal or company)
  const linkedin = form.linkedinPersonal || (stg.social && stg.social.linkedin) || '';
  if (linkedin) {
    lines.push('X-SOCIALPROFILE;TYPE=linkedin:' + linkedin);
  }

  lines.push('END:VCARD');

  return lines.join('\r\n');
}
