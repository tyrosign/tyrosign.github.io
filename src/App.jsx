import { useState, useRef, useEffect, useMemo, useCallback, memo } from "react";
import {
  User, Phone, Globe, Copy, Check, Settings, Eye,
  Download, Linkedin, Twitter, Facebook, Instagram,
  Home, Info, RefreshCw, Upload, Image, Trash,
  Edit3, Star, X
} from "lucide-react";
import { PublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser';
import DEFAULT_LOGO_BASE64 from './defaultLogo.js';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MSAL CONFIGURATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const MSAL_ENABLED = !!(import.meta.env.VITE_CLIENT_ID && import.meta.env.VITE_TENANT_ID);

const msalInstance = MSAL_ENABLED ? new PublicClientApplication({
  auth: {
    clientId: import.meta.env.VITE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_TENANT_ID}`,
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: { cacheLocation: 'sessionStorage', storeAuthStateInCookie: false },
}) : null;

const msalLoginRequest = { scopes: ['User.Read'] };

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// THEME (Light-only premium glass)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const C = {
  primary: '#1e3a5f',
  primarySoft: '#2c5282',
  primaryGhost: 'rgba(30,58,95,0.06)',
  primaryLight: '#e8f0fe',
  accent: '#c8922a',
  accentSoft: '#d4a84b',
  accentGhost: 'rgba(200,146,42,0.08)',
  accentLight: '#faf3e6',
  divider: '#0098d4',
  bg: 'linear-gradient(160deg, #f0f4f8 0%, #e8edf4 40%, #f5f0eb 100%)',
  bgFlat: '#f2f5f9',
  glass: 'rgba(255,255,255,0.55)',
  glassSolid: 'rgba(255,255,255,0.82)',
  surface: 'rgba(255,255,255,0.72)',
  surfaceSolid: '#ffffff',
  border: 'rgba(255,255,255,0.85)',
  borderSub: 'rgba(30,58,95,0.08)',
  text1: '#1a202c',
  text2: '#4a5568',
  textM: '#94a3b8',
  ok: '#16a34a',
  err: '#dc2626',
  info: '#2563eb',
  shadow: '0 1px 2px rgba(30,58,95,0.04), 0 4px 16px rgba(30,58,95,0.06)',
  shadowLg: '0 8px 40px rgba(30,58,95,0.10)',
  shadowXl: '0 20px 60px rgba(30,58,95,0.12)',
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// OFFICES (from tiryaki.com.tr/iletisim)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const OFFICES = [
  // Türkiye
  { id: 'ist-merkez', group: 'Türkiye', name: 'Merkez Ofis - İstanbul', address: 'Beylerbeyi Mah. Şemsi Efendi Sok. No:16', city: 'Üsküdar, İstanbul 34676, Türkiye', sdn: '+90 216 333 20 00', fax: '' },
  { id: 'ist-altunizade', group: 'Türkiye', name: 'Altunizade Ofis - İstanbul', address: 'Mahir İz Cad. No:41/2', city: 'Üsküdar, İstanbul, Türkiye', sdn: '+90 216 333 20 11', fax: '' },
  { id: 'ist-kupluce', group: 'Türkiye', name: 'Küplüce Ofis - İstanbul', address: 'Yeniyol Sok. No:4', city: 'Üsküdar, İstanbul, Türkiye', sdn: '+90 216 333 20 00', fax: '' },
  { id: 'ist-atasehir', group: 'Türkiye', name: 'Ataşehir Ofis - İstanbul', address: 'Barbaros Mah. Şebboy Sok. No:4/1', city: 'Ataşehir, İstanbul, Türkiye', sdn: '+90 216 333 20 00', fax: '' },
  { id: 'gaziantep', group: 'Türkiye', name: 'Gaziantep', address: 'Başpınar OSB, 83313 Cad. No:6', city: 'Şehitkamil, Gaziantep, Türkiye', sdn: '+90 342 211 97 00', fax: '' },
  { id: 'mersin', group: 'Türkiye', name: 'Mersin', address: 'Tarsus OSB, Kadri Şaman Bulvarı No:5', city: 'Akdeniz, Mersin, Türkiye', sdn: '+90 324 241 53 00', fax: '' },
  { id: 'corum', group: 'Türkiye', name: 'Çorum', address: 'OSB, 5. Cadde No:3', city: 'Çorum, Türkiye', sdn: '+90 364 240 15 15', fax: '' },
  { id: 'giresun', group: 'Türkiye', name: 'Giresun', address: 'Sultan Selim, GMK Bulvarı No:9', city: 'Merkez, Giresun, Türkiye', sdn: '+90 454 216 23 82', fax: '' },
  { id: 'bandirma', group: 'Türkiye', name: 'Bandırma', address: 'Edincik, Küçükkoru Cad. No:143', city: 'Balıkesir, Türkiye', sdn: '+90 266 727 27 00', fax: '' },
  { id: 'karacabey', group: 'Türkiye', name: 'Karacabey', address: 'Canbalı, Çakıllı Kuyu Mevki', city: 'Bursa, Türkiye', sdn: '+90 216 333 20 00', fax: '' },
  { id: 'konya', group: 'Türkiye', name: 'Konya', address: 'Tatlıcak, Ereğli Cad. No:67/1', city: 'Karatay, Konya, Türkiye', sdn: '+90 216 333 20 00', fax: '' },
  { id: 'mus', group: 'Türkiye', name: 'Muş', address: 'Alparslan Üniversitesi Kampüsü', city: 'Merkez, Muş, Türkiye', sdn: '+90 216 333 20 00', fax: '' },
  // Uluslararası
  { id: 'uae', group: 'Uluslararası', name: 'Mezopotamya FZE - UAE', address: 'Jebel Ali Free Zone, LB21006', city: 'Dubai, UAE', sdn: '', fax: '' },
  { id: 'canada', group: 'Uluslararası', name: 'Sunrise Foods - Canada', address: '306 Queen Street, Suite 200', city: 'Saskatoon, SK, Canada', sdn: '', fax: '' },
  { id: 'usa-chicago', group: 'Uluslararası', name: 'Sunrise Foods USA', address: '227 W Monroe Street', city: 'Chicago, IL 60606, USA', sdn: '+1 417 345 43 00', fax: '' },
  { id: 'netherlands', group: 'Uluslararası', name: 'Sunrise Foods BV', address: 'Piet Heinkade 55, 11th Floor', city: 'Amsterdam 1019 GM, Netherlands', sdn: '', fax: '' },
  { id: 'ghana', group: 'Uluslararası', name: 'Tiryaki West Africa - Ghana', address: 'One Airport Square, South Liberation Link', city: 'Accra, Ghana', sdn: '', fax: '' },
  { id: 'venezuela', group: 'Uluslararası', name: 'Tiryaki Venezuela', address: 'El Rosal', city: 'Caracas, Venezuela', sdn: '', fax: '' },
  { id: 'nigeria', group: 'Uluslararası', name: 'Tiryaki Nijerya', address: 'Suleja (Dikko)', city: 'Niger State, Nigeria', sdn: '', fax: '' },
  { id: 'syria', group: 'Uluslararası', name: 'Tiryaki Suriye', address: 'Western Mezzeh, Building 303/B', city: 'Damascus, Syria', sdn: '', fax: '' },
  { id: 'kazakhstan', group: 'Uluslararası', name: 'Tiryaki Kazakistan', address: 'Syganak Street No:60/4, Office A803', city: 'Astana, Kazakhstan', sdn: '', fax: '' },
  { id: 'iraq', group: 'Uluslararası', name: 'Sama Al-Manar - Iraq', address: 'Amirat Street 601, Alley 11', city: 'Baghdad, Iraq', sdn: '+964 770 90 55 593', fax: '' },
  { id: 'romania', group: 'Uluslararası', name: 'Tiryaki Romania', address: 'Calea Campulung 579A', city: 'Maracineni, Argeş, Romania', sdn: '', fax: '' },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BANNER TEMPLATES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const BANNER_SIZES = [
  { id: 'linkedin', label: 'LinkedIn Banner', w: 1584, h: 396, scale: 2 },
  { id: 'email', label: 'Email Banner', w: 600, h: 200, scale: 3 },
];
const BANNER_TEMPLATES = [
  { id: 'classic', name: 'Classic', bg: 'linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)', textColor: '#fff', accentBar: '#c8922a' },
  { id: 'gold', name: 'Gold Elegance', bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', textColor: '#fff', accentBar: '#e8b84b' },
  { id: 'light', name: 'Light Modern', bg: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', textColor: '#1e3a5f', accentBar: '#0098d4' },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UTILITIES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const escapeHtml = (s) => s ? s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') : '';
const sanitizeUrl = (url) => {
  if (!url) return '';
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    if (!['http:', 'https:'].includes(parsed.protocol)) return '';
    return parsed.href;
  } catch { return ''; }
};
const titleCase = (str) => {
  if (!str) return '';
  return str.split(' ').map(w => w ? w.charAt(0).toLocaleUpperCase('tr-TR') + w.slice(1).toLocaleLowerCase('tr-TR') : w).join(' ');
};
const PROGRESS_FIELDS = ['firstName', 'lastName', 'titleTR', 'titleEN', 'officeId', 'gsm', 'email'];
const OFFICE_GROUPS = ['Türkiye', 'Uluslararası'];
let _toastId = 0;
const _colorTimers = {};
const debouncedColor = (key, value, setter) => {
  clearTimeout(_colorTimers[key]);
  _colorTimers[key] = setTimeout(() => setter(p => ({ ...p, [key]: value })), 80);
};
const DESIGNS = [
  { id: 'corporate', nameKey: 'designCorporate' },
  { id: 'classic', nameKey: 'designClassic' },
];

// Instagram camera icon as inline SVG data URI (for email signature)
const igIcon = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='2' y='2' width='20' height='20' rx='5'/%3E%3Ccircle cx='12' cy='12' r='5'/%3E%3Ccircle cx='17.5' cy='6.5' r='1.5' fill='white' stroke='none'/%3E%3C/svg%3E`;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SIGNATURE GENERATOR (parametric)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const genSig = (f, s, office) => {
  const firstName = escapeHtml(titleCase(f.firstName));
  const lastName = f.lastName ? escapeHtml(f.lastName.toLocaleUpperCase('tr-TR')) : '';
  const name = [firstName, lastName].filter(Boolean).join(' ');
  const title = [escapeHtml(titleCase(f.titleEN)), escapeHtml(titleCase(f.titleTR))].filter(Boolean).join(' | ');
  const company = [escapeHtml(s.companyName), escapeHtml(office?.name)].filter(Boolean).join(' | ');

  const logo = s.logoBase64
    ? `<img src="${s.logoBase64}" width="${s.logoW}" height="${s.logoH}" alt="Logo" style="display:block;border:0;" />`
    : `<table cellpadding="0" cellspacing="0" border="0"><tr><td style="vertical-align:middle;padding-right:6px;"><div style="width:40px;height:40px;background:${s.logoColor};border-radius:8px;text-align:center;line-height:40px;"><span style="font-family:Georgia,serif;font-size:26px;font-weight:bold;color:#c8922a;">T</span></div></td><td style="vertical-align:middle;"><span style="font-family:Georgia,serif;font-size:20px;font-weight:bold;color:${s.logoColor};letter-spacing:1.5px;">tiryaki</span><br/><span style="font-size:7px;color:#999;">${s.slogan}</span></td></tr></table>`;

  const lblC = s.contactLabelColor || '#888';
  const valC = s.contactValueColor || '#555';
  const mkRow = (label, value) => `<tr><td style="padding:2px 0;font-size:12px;color:${lblC};font-family:Arial,sans-serif;white-space:nowrap;vertical-align:top;width:42px;font-weight:600;">${label}</td><td style="padding:2px 4px;font-size:12px;color:${lblC};font-family:Arial,sans-serif;vertical-align:top;">:</td><td style="padding:2px 0;font-size:12px;color:${valC};font-family:Arial,sans-serif;vertical-align:top;">${value}</td></tr>`;

  const rows = [];
  if (s.showSDN && office?.sdn) {
    let sdnVal = office.sdn;
    if (s.showFax && office.fax) sdnVal += `&nbsp;&nbsp;&nbsp;Fax : ${office.fax}`;
    rows.push(mkRow('SDN', sdnVal));
  }
  if (f.gsm) rows.push(mkRow('GSM', escapeHtml(f.gsm)));
  if (f.email) rows.push(mkRow('Mail', `<a href="mailto:${escapeHtml(f.email)}" style="color:${s.accentColor};text-decoration:none;">${escapeHtml(f.email)}</a>`));
  if (s.showAddress && office) rows.push(mkRow('Adres', `<span style="white-space:nowrap">${escapeHtml(office.address)}</span><br/>${escapeHtml(office.city)}`));

  const rbBg = s.rightBlockBg || s.logoColor;
  const rbR = s.rightBlockRadius != null ? s.rightBlockRadius : 6;
  const divC = s.dividerColor || s.accentColor;
  const divW = s.dividerWidth || 3;

  // Social icons (respect toggles)
  const mkI = (url, txt, isIg) => {
    if (!url) return '';
    const content = isIg
      ? `<img src="${igIcon}" width="14" height="14" alt="IG" style="vertical-align:middle;border:0;" />`
      : txt;
    return `<a href="${url}" target="_blank" style="display:inline-block;width:28px;height:28px;background:rgba(255,255,255,0.2);border-radius:6px;text-align:center;line-height:28px;font-size:13px;font-weight:bold;color:#fff;text-decoration:none;margin:2px 3px;">${content}</a>`;
  };
  const linkedinUrl = sanitizeUrl((f.linkedinPersonal && f.linkedinPersonal.trim()) || s.social.linkedin);
  const icons = [];
  if (s.showLinkedin !== false) { const ic = mkI(linkedinUrl, 'in'); if (ic) icons.push(ic); }
  if (s.showInstagram !== false) { const ic = mkI(sanitizeUrl(s.social.instagram), '', true); if (ic) icons.push(ic); }
  if (s.showTwitter !== false) { const ic = mkI(sanitizeUrl(s.social.twitter), 'X'); if (ic) icons.push(ic); }
  if (s.showFacebook !== false) { const ic = mkI(sanitizeUrl(s.social.facebook), 'f'); if (ic) icons.push(ic); }

  // Build social rows (2 per row)
  let socialRows = '';
  for (let i = 0; i < icons.length; i += 2) {
    socialRows += `<tr><td style="text-align:center;">${icons[i]}${icons[i + 1] || ''}</td></tr>`;
  }
  const socialTable = icons.length > 0 ? `<table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">${socialRows}</table>` : '';
  const websiteHtml = (s.showWebsite !== false && s.website) ? `<div style="${icons.length > 0 ? 'padding-top:8px;' : ''}text-align:center;"><a href="https://${s.website}" style="font-size:11px;color:#fff;text-decoration:none;font-weight:bold;">${s.website}</a></div>` : '';
  const socialContent = socialTable + websiteHtml;

  const showRB = s.showRightBlock !== false && socialContent.length > 0;

  // Responsive email signature CSS
  const sigCSS = `<style>@media screen and (max-width:480px){.sig-table{width:100%!important}.sig-logo,.sig-divider,.sig-info,.sig-spacer,.sig-social{display:block!important;width:100%!important;text-align:center!important;padding:4px 0!important}.sig-logo{padding-bottom:8px!important}.sig-divider{height:2px!important;width:50%!important;margin:4px auto!important;background:${divC}!important}.sig-info{padding:8px 0!important}.sig-info table{margin:0 auto!important}.sig-spacer{display:none!important}.sig-social{border-radius:${rbR}px!important;margin-top:8px!important;padding:12px!important}}</style>`;

  return sigCSS +
    `<table class="sig-table" cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,sans-serif;border-collapse:collapse;max-width:680px;"><tr>` +
    `<td class="sig-logo" style="vertical-align:middle;padding:8px 14px 8px 0;">${logo}</td>` +
    `<td class="sig-divider" style="width:${divW}px;background:${divC};font-size:0;">&nbsp;</td>` +
    `<td class="sig-info" style="vertical-align:top;padding:6px 14px;">` +
      `<table cellpadding="0" cellspacing="0" border="0">` +
        `<tr><td colspan="3" style="padding:0 0 1px;"><strong style="font-size:15px;color:${s.nameColor || s.logoColor};">${name || 'Ad SOYAD'}</strong></td></tr>` +
        (title ? `<tr><td colspan="3" style="padding:0 0 4px;"><span style="font-size:12px;color:${s.titleColor || s.accentColor};font-style:italic;">${title}</span></td></tr>` : '') +
        `<tr><td colspan="3" style="padding:0 0 7px;"><strong style="font-size:12px;color:${s.companyTextColor || '#333'};">${company}</strong></td></tr>` +
        rows.join('') +
      `</table>` +
    `</td>` +
    (showRB
      ? `<td class="sig-spacer" style="width:12px;font-size:0;">&nbsp;</td>` +
        `<td class="sig-social" style="vertical-align:middle;padding:0;background-color:${rbBg};border-radius:0 ${rbR}px ${rbR}px 0;"><div style="padding:14px 18px;text-align:center;">${socialContent}</div></td>`
      : '') +
    `</tr></table>`;
};

// Phone icons for corporate template (data URI SVGs)
const phoneIconSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z'/%3E%3C/svg%3E`;
const mobileIconSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='5' y='2' width='14' height='20' rx='2'/%3E%3Cline x1='12' y1='18' x2='12.01' y2='18'/%3E%3C/svg%3E`;
const linkedinBlueSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 382 382'%3E%3Cpath fill='%230077B7' d='M347.445,0H34.555C15.471,0,0,15.471,0,34.555v312.889C0,366.529,15.471,382,34.555,382h312.889C366.529,382,382,366.529,382,347.444V34.555C382,15.471,366.529,0,347.445,0z M118.207,329.844c0,5.554-4.502,10.056-10.056,10.056H65.345c-5.554,0-10.056-4.502-10.056-10.056V150.403c0-5.554,4.502-10.056,10.056-10.056h42.806c5.554,0,10.056,4.502,10.056,10.056V329.844z M86.748,123.432c-22.459,0-40.666-18.207-40.666-40.666S64.289,42.1,86.748,42.1s40.666,18.207,40.666,40.666S109.208,123.432,86.748,123.432z M341.91,330.654c0,5.106-4.14,9.246-9.246,9.246H286.73c-5.106,0-9.246-4.14-9.246-9.246v-84.168c0-12.556,3.683-55.021-32.813-55.021c-28.309,0-34.051,29.066-35.204,42.11v97.079c0,5.106-4.139,9.246-9.246,9.246h-44.426c-5.106,0-9.246-4.14-9.246-9.246V149.593c0-5.106,4.14-9.246,9.246-9.246h44.426c5.106,0,9.246,4.14,9.246,9.246v15.655c10.497-15.753,26.097-27.912,59.312-27.912c73.552,0,73.131,68.716,73.131,106.472L341.91,330.654L341.91,330.654z'/%3E%3C/svg%3E`;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CORPORATE SIGNATURE GENERATOR (PDF design - wave band)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const genSigCorporate = (f, s, office) => {
  const firstName = escapeHtml(titleCase(f.firstName));
  const lastName = f.lastName ? escapeHtml(f.lastName.toLocaleUpperCase('tr-TR')) : '';
  const name = [firstName, lastName].filter(Boolean).join(' ');
  const titleEN = escapeHtml(titleCase(f.titleEN));
  const titleTR = escapeHtml(titleCase(f.titleTR));

  const logo = s.logoBase64
    ? `<img src="${s.logoBase64}" width="${s.logoW}" height="${s.logoH}" alt="Logo" style="display:block;border:0;" />`
    : `<table cellpadding="0" cellspacing="0" border="0"><tr><td style="vertical-align:middle;padding-right:6px;"><div style="width:40px;height:40px;background:${s.logoColor};border-radius:8px;text-align:center;line-height:40px;"><span style="font-family:Georgia,serif;font-size:26px;font-weight:bold;color:#c8922a;">T</span></div></td><td style="vertical-align:middle;"><span style="font-family:Georgia,serif;font-size:20px;font-weight:bold;color:${s.logoColor};letter-spacing:1.5px;">tiryaki</span><br/><span style="font-size:7px;color:#999;">${s.slogan}</span></td></tr></table>`;

  const rbBg = s.rightBlockBg || s.logoColor;
  const linkedinUrl = sanitizeUrl((f.linkedinPersonal && f.linkedinPersonal.trim()) || s.social.linkedin);
  // Clean handle: strip URL parts and remove hyphens for display
  const linkedinHandle = linkedinUrl ? linkedinUrl.replace(/https?:\/\/(www\.)?linkedin\.com\/(company\/|in\/)?/i, '').replace(/\/$/, '').replace(/-/g, '') : '';

  // Build contact rows inside the band
  let bandRows = '';
  if (s.showAddress !== false && office) {
    bandRows += `<div style="font-size:11px;line-height:1.6;margin-bottom:8px;color:rgba(255,255,255,0.92);"><span style="white-space:nowrap">${escapeHtml(office.address)}</span><br/>${escapeHtml(office.city)}</div>`;
  }
  const phones = [];
  if (f.gsm) phones.push(`<img src="${mobileIconSvg}" width="13" height="13" alt="" style="vertical-align:middle;border:0;margin-right:3px;" /><span style="vertical-align:middle;">${escapeHtml(f.gsm)}</span>`);
  if (s.showSDN !== false && office?.sdn) phones.push(`<img src="${phoneIconSvg}" width="13" height="13" alt="" style="vertical-align:middle;border:0;margin-right:3px;" /><span style="vertical-align:middle;">${escapeHtml(office.sdn)}</span>`);
  if (phones.length > 0) {
    bandRows += `<div style="font-size:11px;margin-bottom:4px;color:rgba(255,255,255,0.92);white-space:nowrap;">${phones.join('&nbsp;&nbsp;&nbsp;')}</div>`;
  }
  if (f.email) {
    bandRows += `<div style="font-size:11px;color:rgba(255,255,255,0.92);"><a href="mailto:${escapeHtml(f.email)}" style="color:#fff;text-decoration:none;">@ ${escapeHtml(f.email)}</a></div>`;
  }

  // Footer: website + LinkedIn (below logo, bottom-aligned with band's last line)
  const footerC = s.contactLabelColor || '#808285';
  const websiteDisplay = s.website ? s.website.replace(/^www\./i, '') : '';
  let footerItems = [];
  if (s.showWebsite !== false && websiteDisplay) footerItems.push(`<a href="https://${s.website}" style="color:${footerC};font-size:11px;text-decoration:none;font-style:italic;font-weight:bold;vertical-align:baseline;">${websiteDisplay}</a>`);
  if (s.showLinkedin !== false && linkedinUrl) footerItems.push(`<a href="${linkedinUrl}" target="_blank" style="text-decoration:none;vertical-align:baseline;"><img src="${linkedinBlueSvg}" width="14" height="14" alt="in" style="vertical-align:-2px;border:0;margin-right:4px;" /><span style="color:${footerC};font-size:11px;font-style:italic;font-weight:bold;vertical-align:baseline;">${linkedinHandle || 'LinkedIn'}</span></a>`);
  const footer = footerItems.length > 0 ? `<div style="line-height:16px;white-space:nowrap;">${footerItems.join('&nbsp;&nbsp;&nbsp;')}</div>` : '';

  // Responsive CSS
  const sigCSS = `<style>@media screen and (max-width:480px){.sig-corp-table{width:100%!important}.sig-corp-logo,.sig-corp-band{display:block!important;width:100%!important;text-align:center!important}.sig-corp-logo{padding:0 0 8px 0!important}.sig-corp-logo img{margin:0 auto!important}.sig-corp-logo table{margin:0 auto!important}.sig-corp-band{border-radius:12px!important;margin-top:6px!important}.sig-corp-band>div{padding:16px 20px!important;text-align:center!important}}</style>`;

  return sigCSS +
    `<table class="sig-corp-table" cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,sans-serif;border-collapse:collapse;width:100%;max-width:600px;">` +
    // Row 1: logo + band (band spans 2 rows)
    `<tr>` +
    `<td class="sig-corp-logo" style="vertical-align:top;padding:34px 50px 0 0;">` +
      logo +
    `</td>` +
    `<td class="sig-corp-band" rowspan="${footer ? '2' : '1'}" style="vertical-align:top;background-color:${rbBg};border-radius:130px 0 0 0;padding:0;">` +
      `<div style="padding:22px 24px 18px 130px;color:#fff;">` +
        `<div style="font-size:16px;font-weight:bold;margin-bottom:1px;color:#fff;">${name || 'Ad SOYAD'}</div>` +
        (titleEN ? `<div style="font-size:12px;margin-bottom:0;color:rgba(255,255,255,0.85);font-style:italic;">${titleEN}</div>` : '') +
        (titleTR ? `<div style="font-size:12px;margin-bottom:10px;color:rgba(255,255,255,0.85);font-style:italic;">${titleTR}</div>` : '<div style="margin-bottom:10px;"></div>') +
        bandRows +
      `</div>` +
    `</td>` +
    `</tr>` +
    // Row 2: footer left-aligned with logo's first text character (~30% of logo width)
    (footer ? `<tr><td style="vertical-align:bottom;padding:0 50px 18px ${s.logoBase64 ? Math.round(s.logoW * 0.3) : 46}px;">${footer}</td></tr>` : '') +
    `</table>`;
};

// Banner icon (rectangle with content lines)
const BannerIcon = memo(({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="18" rx="2" />
    <line x1="6" y1="8" x2="18" y2="8" />
    <line x1="6" y1="12" x2="14" y2="12" />
  </svg>
));

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// APP LOGO - Stylish fountain pen mid-signature (no background)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const TyroLogo = memo(({ size = 36 }) => (
  <svg width={size} height={size * 0.85} viewBox="0 0 56 48" fill="none" style={{ filter: 'drop-shadow(0 1px 4px rgba(30,58,95,0.18))' }}>
    <defs>
      <linearGradient id="penBody" x1="10" y1="40" x2="48" y2="8">
        <stop offset="0%" stopColor="#1a2d47" />
        <stop offset="50%" stopColor="#1e3a5f" />
        <stop offset="100%" stopColor="#152a45" />
      </linearGradient>
      <linearGradient id="penGold" x1="0" y1="0" x2="20" y2="20">
        <stop offset="0%" stopColor="#f0d878" />
        <stop offset="50%" stopColor="#c8922a" />
        <stop offset="100%" stopColor="#a67520" />
      </linearGradient>
      <linearGradient id="sigInk" x1="4" y1="42" x2="32" y2="42" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0" />
        <stop offset="20%" stopColor="#1e3a5f" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#1e3a5f" stopOpacity="0.55" />
      </linearGradient>
    </defs>
    {/* Signature trail — smooth flowing cursive */}
    <path d="M4 42 C8 38, 10 45, 15 41 Q18 38, 20 41 C22 44, 25 35, 28 39 Q30 42, 32 37" stroke="url(#sigInk)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    {/* Pen barrel — thick visible stroke */}
    <path d="M32 37 L50 10" stroke="url(#penBody)" strokeWidth="5" strokeLinecap="round" />
    {/* Barrel highlight — shine */}
    <path d="M33 35 L49.5 11" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" />
    {/* Gold band */}
    <path d="M38 28 L39 26.5" stroke="url(#penGold)" strokeWidth="6" strokeLinecap="butt" />
    {/* Pen clip — clearly visible */}
    <path d="M47.5 13.5 C50 12, 51.5 9, 50 7.5" stroke="url(#penGold)" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    {/* Nib — gold triangle tip */}
    <path d="M32 37 L34.5 33 L36 31.5 L34 34 Z" fill="url(#penGold)" />
    {/* Nib split line */}
    <path d="M32.5 36.5 L35 32.5" stroke="#8a6218" strokeWidth="0.5" strokeLinecap="round" opacity="0.5" />
    {/* Ink dot at tip */}
    <circle cx="32" cy="37.5" r="1.2" fill="#1e3a5f" opacity="0.4" />
  </svg>
));

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GLASS FORM FIELD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const FormField = memo(({ label, value, onChange, placeholder, required }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: '0.7rem' }}>
      <label style={{
        display: 'flex', alignItems: 'center', gap: '0.35rem',
        fontSize: '0.7rem', fontWeight: 600, color: focused ? C.primary : C.text2,
        marginBottom: '0.25rem', transition: 'color 0.2s',
      }}>
        {label}{required && <span style={{ color: C.err }}>*</span>}
      </label>
      <input
        type="text" value={value} onChange={onChange} placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '0.45rem 0.65rem',
          border: `1px solid ${focused ? C.accent + '60' : C.borderSub}`,
          borderRadius: '8px', fontSize: '0.78rem', fontFamily: 'Inter,sans-serif',
          background: focused ? '#fff' : C.glass, color: C.text1,
          outline: 'none', boxSizing: 'border-box',
          transition: 'all 0.25s ease',
          boxShadow: focused ? `0 0 0 3px ${C.accent}15, ${C.shadow}` : 'none',
          backdropFilter: 'blur(8px)',
        }}
      />
    </div>
  );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TOGGLE SWITCH
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const ToggleSwitch = memo(({ checked, onChange, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.45rem 0', borderBottom: `1px solid ${C.borderSub}` }}>
    <span style={{ fontSize: '0.76rem', fontWeight: 600, color: C.text1 }}>{label}</span>
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 42, height: 24, borderRadius: 12, cursor: 'pointer',
        background: checked ? C.ok : '#cbd5e1',
        position: 'relative', transition: 'background 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{
        width: 20, height: 20, borderRadius: '50%', background: '#fff',
        position: 'absolute', top: 2, left: checked ? 20 : 2,
        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
      }} />
    </div>
  </div>
));

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GLASS CARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const GlassCard = memo(({ children, style = {}, accent = false }) => (
    <div className="glass-card" style={{
        background: C.surface, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '14px', border: `1px solid ${C.border}`,
        boxShadow: C.shadow, overflow: 'hidden',
        ...style,
      }}>
      {accent && <div style={{ height: 2.5, background: `linear-gradient(90deg, ${C.primary}, ${C.divider}, ${C.accent})` }} />}
      <div className="glass-card-inner" style={{ padding: '1rem 1.25rem' }}>{children}</div>
    </div>
  ));

const SectionTitle = memo(({ icon: Ic, children }) => (
  <h3 style={{
    fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: '0.85rem', fontWeight: 700,
    color: C.primary, marginBottom: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
  }}>
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 26, height: 26, borderRadius: 7,
      background: `linear-gradient(135deg, ${C.accent}18, ${C.accent}08)`,
      border: `1px solid ${C.accent}20`,
    }}>
      <Ic size={13} style={{ color: C.accent }} />
    </span>
    {children}
  </h3>
));

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GLOBAL CSS (module-level constant for performance)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const GLOBAL_CSS = `
  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap");
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { overflow-y: scroll; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes toastIn { from { opacity: 0; transform: translateX(80px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  @keyframes slideInLeft { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes scaleIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
  @keyframes ripple { 0% { box-shadow: 0 0 0 0 rgba(200,146,42,0.35); } 100% { box-shadow: 0 0 0 14px rgba(200,146,42,0); } }
  @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
  @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
  @keyframes fadeSlideDown { from { opacity: 0; transform: translateY(-6px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
  @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03); } }
  @keyframes progressFlow { 0% { background-position: 0% 50%; } 100% { background-position: 300% 50%; } }
  @keyframes progressGlow { 0%, 100% { box-shadow: 0 0 4px rgba(0,152,212,0.3), 0 0 8px rgba(0,152,212,0.1); } 50% { box-shadow: 0 0 8px rgba(0,152,212,0.5), 0 0 16px rgba(0,152,212,0.2); } }
  @keyframes progressComplete { 0%, 100% { box-shadow: 0 0 6px rgba(22,163,74,0.4), 0 0 12px rgba(22,163,74,0.15); } 50% { box-shadow: 0 0 10px rgba(22,163,74,0.6), 0 0 20px rgba(22,163,74,0.25); } }
  @keyframes countPop { 0% { transform: scale(1); } 50% { transform: scale(1.25); } 100% { transform: scale(1); } }
  @keyframes completeBounce { 0% { transform: scale(0.8); opacity: 0; } 50% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
  @keyframes barShine { 0% { left: -40%; } 100% { left: 140%; } }
  @keyframes signing {
    0%   { transform: translate(0, 0) rotate(0deg); }
    8%   { transform: translate(6px, -3px) rotate(2deg); }
    16%  { transform: translate(14px, 1px) rotate(-1deg); }
    24%  { transform: translate(20px, -4px) rotate(3deg); }
    32%  { transform: translate(28px, 0px) rotate(-2deg); }
    40%  { transform: translate(34px, -5px) rotate(4deg); }
    48%  { transform: translate(26px, -2px) rotate(-1deg); }
    56%  { transform: translate(18px, 2px) rotate(2deg); }
    64%  { transform: translate(10px, -3px) rotate(-3deg); }
    72%  { transform: translate(4px, 1px) rotate(1deg); }
    80%  { transform: translate(0, -2px) rotate(-1deg); }
    90%  { transform: translate(0, 0) rotate(0deg); }
    100% { transform: translate(0, 0) rotate(0deg); }
  }
  @keyframes signLine {
    0%   { width: 0; opacity: 0; }
    5%   { opacity: 1; }
    80%  { width: 100%; opacity: 1; }
    90%  { width: 100%; opacity: 0.3; }
    100% { width: 0; opacity: 0; }
  }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(30,58,95,0.12); border-radius: 3px; }
  ::selection { background: ${C.accent}30; }

  /* ═══ GLASS CARD HOVER (CSS-only, no React re-render) ═══ */
  .glass-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
  .glass-card:hover { box-shadow: ${C.shadowLg}; transform: translateY(-1px); border-color: ${C.accent}25; }

  /* ═══ RESPONSIVE ═══ */
  @media(max-width:900px) {
    .sig-layout { flex-direction: column!important; }
    .sig-right { position: relative!important; top: auto!important; }
  }
  @media(max-width:768px) {
    .app-header { padding: 0 0.75rem!important; height: auto!important; min-height: 48px!important; flex-wrap: wrap!important; gap: 0.4rem!important; padding-top: 0.4rem!important; padding-bottom: 0.4rem!important; }
    .app-header-logo { display: none!important; }
    .app-header-title { font-size: 0.85rem!important; }
    .app-header-title-accent { font-size: 0.85rem!important; }
    .app-header-nav { order: 3!important; width: 100%!important; justify-content: center!important; }
    .app-header-lang { order: 2!important; margin-left: auto!important; }
    .app-header-auth { order: 3!important; }
    .app-header-lang button { padding: 0.25rem 0.5rem!important; font-size: 0.6rem!important; min-height: 28px!important; }
    .app-main { padding: 0.65rem 0.75rem!important; }
    .sig-grid { grid-template-columns: 1fr!important; gap: 0.75rem!important; }
    .sig-grid > div { animation: fadeIn 0.3s ease-out!important; }
    .sig-sec-personal { order: 1!important; }
    .sig-sec-contact { order: 2!important; }
    .sig-sec-preview { order: 3!important; }
    .sig-sec-export { order: 4!important; }
    .banner-flex { flex-direction: column!important; }
    .banner-left { flex: 1!important; min-width: 0!important; }
    .settings-modal { width: 100vw!important; max-width: 100vw!important; height: 100vh!important; max-height: 100vh!important; border-radius: 0!important; top: 0!important; left: 0!important; transform: none!important; }
    .settings-tabs-inner { gap: 0!important; }
    .settings-tab-btn { font-size: 0.6rem!important; padding: 0.38rem 0.3rem!important; gap: 0.15rem!important; min-height: 32px!important; }
    .settings-content { padding: 0.85rem!important; }
    .settings-color-grid-3 { grid-template-columns: 1fr 1fr!important; }
    .social-grid { grid-template-columns: 1fr!important; }
    .progress-bar { padding: 0.5rem 0.65rem!important; gap: 0.5rem!important; }
    .glass-card-inner { padding: 0.75rem 0.85rem!important; }
    .export-btns { flex-direction: column!important; }
    .export-btns button { width: 100%!important; justify-content: center!important; }
  }
  @media(max-width:480px) {
    .app-header-nav .nav-tabs-inner { gap: 0!important; }
    .nav-tab-btn { padding: 0.35rem 0.6rem!important; font-size: 0.68rem!important; }
    .app-main { padding: 0.5rem 0.5rem!important; }
    .settings-color-grid-2 { grid-template-columns: 1fr!important; }
    .company-grid { grid-template-columns: 1fr!important; }
    .design-mini-preview { display: none!important; }
  }
  @media(max-width:360px) {
    .nav-tab-btn { padding: 0.3rem 0.45rem!important; font-size: 0.62rem!important; }
  }
`;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BUTTON with glow + top indicator line
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const Btn = memo(({ icon: Ic, onClick, disabled, isGreen, hoverColor, children }) => {
  const [hov, setHov] = useState(false);
  const [clicked, setClicked] = useState(false);
  const hc = hoverColor || C.primary;
  const handleClick = (e) => {
    if (disabled) return;
    setClicked(true);
    setTimeout(() => setClicked(false), 400);
    onClick?.(e);
  };
  return (
    <button
      onClick={handleClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative', overflow: 'hidden',
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.65rem 1.3rem',
        borderRadius: '10px',
        border: `1px solid ${hov && !disabled ? hc + '35' : C.borderSub}`,
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: isGreen ? `linear-gradient(135deg, ${C.ok}, #15803d)` : 'rgba(255,255,255,0.7)',
        color: isGreen ? '#fff' : C.text1,
        fontWeight: 600, fontSize: '0.78rem', fontFamily: 'Inter,sans-serif',
        opacity: disabled ? 0.4 : 1,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: hov && !disabled ? 'translateY(-2px)' : 'none',
        boxShadow: hov && !disabled
          ? `0 4px 18px ${hc}22, 0 0 12px ${hc}10`
          : C.shadow,
        backdropFilter: 'blur(10px)',
        animation: clicked ? 'ripple 0.4s ease-out' : 'scaleIn 0.3s ease-out',
        letterSpacing: '0.01em',
      }}
    >
      <span style={{
        position: 'absolute', top: 0, left: '10%', right: '10%', height: hov && !disabled ? 2.5 : 0,
        background: `linear-gradient(90deg, transparent, ${hc}, transparent)`,
        borderRadius: '0 0 2px 2px',
        transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }} />
      <Ic size={14} style={{ color: hov && !disabled ? hc : C.text2, transition: 'color 0.3s' }} />
      {children}
    </button>
  );
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TAB BUTTON — Apple Segment Control
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const TabBtn = memo(({ active, onClick, icon: Ic, label }) => (
  <button
    className="nav-tab-btn"
    onClick={onClick}
    style={{
      position: 'relative', zIndex: 1,
      display: 'flex', alignItems: 'center', gap: '0.35rem',
      padding: '0.4rem 1rem', borderRadius: '7px',
      border: 'none', cursor: 'pointer',
      background: 'transparent',
      color: active ? C.primary : C.text2,
      fontWeight: active ? 700 : 500, fontSize: '0.76rem', fontFamily: 'Inter,sans-serif',
      transition: 'color 0.25s ease',
    }}
  >
    <Ic size={13} style={{ color: active ? C.accent : C.textM, transition: 'color 0.25s' }} />{label}
  </button>
));

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// APP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function App() {
  const [lang, setLang] = useState('tr');
  const [tab, setTab] = useState('signature');
  const [copied, setCopied] = useState(false);
  const [showSteps, setShowSteps] = useState(true);
  const [settingsTab, setSettingsTab] = useState('logo');
  const [form, setForm] = useState({ firstName: '', lastName: '', titleTR: '', titleEN: '', officeId: '', gsm: '', email: '', linkedinPersonal: '' });
  const [stg, setStg] = useState({
    companyName: 'Tiryaki Agro Gida San. ve Tic. A.S.', website: 'www.tiryaki.com.tr',
    slogan: 'Good people. Good earth.', logoColor: '#1e3a5f', accentColor: '#0098d4',
    logoBase64: DEFAULT_LOGO_BASE64, logoW: 140, logoH: 45,
    social: { linkedin: 'https://www.linkedin.com/company/tiryaki-agro/', twitter: 'https://x.com/tiryakiagro', facebook: 'https://www.facebook.com/tiryakiagro', instagram: 'https://www.instagram.com/tiryakiagro/' },
    // Parametric toggles
    showSDN: true, showFax: true, showAddress: true,
    showRightBlock: true, showLinkedin: true, showTwitter: true, showFacebook: true, showInstagram: true, showWebsite: true,
    // Signature style
    dividerColor: '#0098d4', dividerWidth: 3,
    rightBlockBg: '#024d7e', rightBlockRadius: 6,
    // Signature text colors
    nameColor: '#1e3a5f', titleColor: '#0098d4',
    companyTextColor: '#333333', contactLabelColor: '#888888', contactValueColor: '#555555',
    // Banner
    bannerAccentColor: '',
    // Design template
    designId: 'corporate',
  });
  const [banner, setBanner] = useState({ template: 'classic', size: 'linkedin', title: '', subtitle: '', customBg: '' });
  const [toasts, setToasts] = useState([]);
  const [msalReady, setMsalReady] = useState(false);
  const [msalAccount, setMsalAccount] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [designOpen, setDesignOpen] = useState(false);
  const fRef = useRef(null);
  const canvasRef = useRef(null);

  const L = useMemo(() => lang === 'tr' ? {
    sigTab: 'İmza', banTab: 'Banner', setTab: 'Ayarlar',
    fn: 'Ad', ln: 'Soyad', ttr: 'Ünvan (TR)', ten: 'Ünvan (EN)',
    ofc: 'Ofis Seçimi', gsm: 'GSM', email: 'E-Posta',
    cp: 'İmzayı Kopyala', cpd: 'Kopyalandı!', dl: 'HTML İndir', rst: 'Sıfırla',
    pi: 'Kişisel Bilgiler', ci: 'İletişim',
    coi: 'Şirket Bilgileri', cn: 'Şirket Adı', ws: 'Web Sitesi', sl: 'Slogan',
    lc: 'Metin Rengi', ac: 'Aksan Rengi', sm: 'Sosyal Medya',
    lu: 'Şirket Logosu', lub: 'Logo Yükle', lr: 'Varsayılan', lh: 'PNG/JPG max 200x80px',
    lw: 'Genişlik', llh: 'Yükseklik', lch: 'Değiştir', so: 'Ofis seçiniz...',
    lv: 'Canlı Önizleme', prog: 'Tamamlanan', of: '/',
    ht: 'Outlook\'a Nasıl Eklenir?',
    steps: [
      'Yukarıdaki "İmzayı Kopyala" butonuna tıklayın.',
      'Outlook\'u açın ve Dosya > Seçenekler > Posta > İmzalar yolunu izleyin.',
      'Yeni bir imza oluşturun ve imzayı yapıştırın (Ctrl+V).',
      'Varsayılan imza olarak seçin ve kaydedin.',
    ],
    banTitle: 'Banner Başlığı', banSub: 'Alt Başlık', banTpl: 'Şablon', banSize: 'Boyut',
    banDl: 'Banner İndir', banPrev: 'Banner Önizleme',
    emptySig: 'İmza önizlemeniz burada görünecek',
    fillForm: 'Formu doldurmaya başlayın',
    mockSubject: 'Konu:', mockTo: 'Kime:', mockBody: 'Merhaba,',
    mockBodyLine: 'Bilgi amaçlı iletmek istedim...',
    mockTitle: 'Yeni İleti — Mail',
    exportTitle: 'İmzayı Dışa Aktar', exportSub: 'Outlook\'a yapıştırmak için imza kodunu alın',
    outlookWebTip: 'Yeni Outlook için: Ayarlar → Posta → E-posta imzası → HTML düzenleyicide yapıştırın.',
    sigOpts: 'İmza Seçenekleri', sigStyle: 'İmza Stili',
    designSelect: 'Tasarım Seç', designClassic: 'Klasik', designCorporate: 'Kurumsal',
    designClassicDesc: 'Sosyal medya bloklu', designCorporateDesc: 'Dalga bantlı kurumsal',
    showSDN: 'SDN (Sabit Telefon) Göster', showFax: 'Fax Göster', showAddr: 'Adres Göster',
    showRB: 'Sağ Blok (Sosyal Medya)', showLi: 'LinkedIn', showTw: 'X (Twitter)', showFb: 'Facebook', showIg: 'Instagram', showWs: 'Web Sitesi',
    divColor: 'Ayırıcı Rengi', divWidth: 'Ayırıcı Kalınlığı',
    rbBg: 'Sağ Blok Arka Plan', rbRadius: 'Sağ Blok Köşe',
    grpTR: 'Türkiye', grpIntl: 'Uluslararası',
    sTabLogo: 'Logo', sTabCompany: 'Şirket', sTabSig: 'İmza', sTabStyle: 'Stil', sTabSocial: 'Sosyal',
    nameColorL: 'Ad Soyad Rengi', titleColorL: 'Ünvan Rengi',
    companyColorL: 'Şirket Adı Rengi', labelColorL: 'Etiket Rengi', valueColorL: 'Değer Rengi',
    bannerAccentL: 'Banner Aksan Rengi', textColorsTitle: 'İmza Metin Renkleri', bannerColorsTitle: 'Banner Renkleri',
    msLogin: 'Microsoft Giriş', msLogging: 'Giriş yapılıyor...', msLogout: 'Çıkış',
    msLoginOk: 'Giriş başarılı', msLoginFail: 'Giriş başarısız', msProfileFail: 'Profil alınamadı',
  } : {
    sigTab: 'Signature', banTab: 'Banner', setTab: 'Settings',
    fn: 'First Name', ln: 'Last Name', ttr: 'Title (TR)', ten: 'Title (EN)',
    ofc: 'Select Office', gsm: 'GSM', email: 'Email',
    cp: 'Copy Signature', cpd: 'Copied!', dl: 'Download HTML', rst: 'Reset',
    pi: 'Personal Info', ci: 'Contact',
    coi: 'Company Info', cn: 'Company Name', ws: 'Website', sl: 'Slogan',
    lc: 'Text Color', ac: 'Accent Color', sm: 'Social Media',
    lu: 'Company Logo', lub: 'Upload Logo', lr: 'Default', lh: 'PNG/JPG max 200x80px',
    lw: 'Width', llh: 'Height', lch: 'Change', so: 'Select office...',
    lv: 'Live Preview', prog: 'Completed', of: '/',
    ht: 'How to Add to Outlook?',
    steps: [
      'Click the "Copy Signature" button above.',
      'Open Outlook and go to File > Options > Mail > Signatures.',
      'Create a new signature and paste it (Ctrl+V).',
      'Set it as default and save.',
    ],
    banTitle: 'Banner Title', banSub: 'Subtitle', banTpl: 'Template', banSize: 'Size',
    banDl: 'Download Banner', banPrev: 'Banner Preview',
    emptySig: 'Your signature preview will appear here',
    fillForm: 'Start filling the form',
    mockSubject: 'Subject:', mockTo: 'To:', mockBody: 'Hello,',
    mockBodyLine: 'I wanted to share this information...',
    mockTitle: 'New Message — Mail',
    exportTitle: 'Export Signature', exportSub: 'Get the signature code to paste into Outlook',
    outlookWebTip: 'For New Outlook: Settings → Mail → Email signature → Paste in HTML editor.',
    sigOpts: 'Signature Options', sigStyle: 'Signature Style',
    designSelect: 'Select Design', designClassic: 'Classic', designCorporate: 'Corporate',
    designClassicDesc: 'Social media block', designCorporateDesc: 'Wave band corporate',
    showSDN: 'Show SDN (Phone)', showFax: 'Show Fax', showAddr: 'Show Address',
    showRB: 'Right Block (Social Media)', showLi: 'LinkedIn', showTw: 'X (Twitter)', showFb: 'Facebook', showIg: 'Instagram', showWs: 'Website',
    divColor: 'Divider Color', divWidth: 'Divider Width',
    rbBg: 'Right Block Background', rbRadius: 'Right Block Radius',
    grpTR: 'Turkey', grpIntl: 'International',
    sTabLogo: 'Logo', sTabCompany: 'Company', sTabSig: 'Signature', sTabStyle: 'Style', sTabSocial: 'Social',
    nameColorL: 'Name Color', titleColorL: 'Title Color',
    companyColorL: 'Company Text Color', labelColorL: 'Label Color', valueColorL: 'Value Color',
    bannerAccentL: 'Banner Accent Color', textColorsTitle: 'Signature Text Colors', bannerColorsTitle: 'Banner Colors',
    msLogin: 'Microsoft Sign In', msLogging: 'Signing in...', msLogout: 'Sign out',
    msLoginOk: 'Login successful', msLoginFail: 'Login failed', msProfileFail: 'Could not fetch profile',
  }, [lang]);

  const hasData = form.firstName.trim().length > 0;
  const office = OFFICES.find(o => o.id === form.officeId) || null;
  const sigHTML = useMemo(() => {
    if (stg.designId === 'corporate') return genSigCorporate(form, stg, office);
    return genSig(form, stg, office);
  }, [form, stg, office]);

  const progress = useMemo(() => {
    const filled = PROGRESS_FIELDS.filter(k => form[k].trim().length > 0).length;
    return { filled, total: PROGRESS_FIELDS.length, pct: Math.round((filled / PROGRESS_FIELDS.length) * 100) };
  }, [form]);

  const toast = useCallback((msg, type = 'success') => {
    const id = ++_toastId;
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  // ─── MSAL Authentication ───
  const fetchGraphProfile = useCallback(async (account) => {
    try {
      const tokenResponse = await msalInstance.acquireTokenSilent({ ...msalLoginRequest, account });
      const res = await fetch('https://graph.microsoft.com/v1.0/me?$select=givenName,surname,mail,jobTitle,mobilePhone', {
        headers: { Authorization: `Bearer ${tokenResponse.accessToken}` },
      });
      if (!res.ok) throw new Error(`Graph API ${res.status}`);
      const p = await res.json();
      setForm(prev => ({
        ...prev,
        firstName: p.givenName || prev.firstName,
        lastName: p.surname || prev.lastName,
        email: p.mail || prev.email,
        titleTR: p.jobTitle || prev.titleTR,
        gsm: p.mobilePhone || prev.gsm,
      }));
    } catch (err) {
      if (err instanceof InteractionRequiredAuthError) {
        try {
          // Redirect will navigate away; this catch only runs on failure
          await msalInstance.acquireTokenRedirect(msalLoginRequest);
        } catch (_) { toast('Profile unavailable', 'err'); }
      } else {
        console.error('Graph API error:', err.message);
        toast('Profile unavailable', 'err');
      }
    }
  }, [toast]);

  const handleLogin = useCallback(async () => {
    if (!msalReady || !msalInstance) return;
    setAuthLoading(true);
    try {
      await msalInstance.loginRedirect(msalLoginRequest);
    } catch (err) {
      if (err.errorCode !== 'user_cancelled') {
        console.error('Login error:', err);
        toast(lang === 'tr' ? 'Giriş başarısız' : 'Login failed', 'err');
      }
      setAuthLoading(false);
    }
  }, [msalReady, lang, toast]);

  const handleLogout = useCallback(async () => {
    try {
      await msalInstance.logoutRedirect({ account: msalAccount, postLogoutRedirectUri: window.location.origin });
    } catch (err) { console.error('Logout error:', err); }
    setMsalAccount(null);
  }, [msalAccount]);

  useEffect(() => {
    if (!MSAL_ENABLED || !msalInstance) return;
    let isMounted = true;
    msalInstance.initialize().then(async () => {
      if (!isMounted) return;
      let redirectAccount = null;
      try {
        const redirectResponse = await msalInstance.handleRedirectPromise();
        if (redirectResponse?.account) redirectAccount = redirectResponse.account;
      } catch (err) {
        console.error('Redirect error:', err);
      }
      if (!isMounted) return;
      setMsalReady(true);
      setAuthLoading(false);
      const account = redirectAccount || msalInstance.getAllAccounts()[0] || null;
      if (account) {
        setMsalAccount(account);
        fetchGraphProfile(account);
      }
    }).catch(err => {
      console.error('MSAL init failed:', err);
      if (isMounted) { setMsalReady(true); setAuthLoading(false); }
    });
    return () => { isMounted = false; };
  }, []);

  const procLogo = useCallback((file) => {
    if (!file) return;
    if (file.size > 512000) { toast('Max 500KB', 'err'); return; }
    if (!file.type.startsWith('image/')) { toast('Invalid file type', 'err'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;
      const img = new window.Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > 200) { const r = 200 / w; w = 200; h = Math.round(h * r); }
        if (h > 80) { const r = 80 / h; h = Math.round(h * r); w = Math.round(w * r); }
        setStg(p => ({ ...p, logoBase64: base64, logoW: w, logoH: h }));
        toast('Logo OK');
      };
      img.onerror = () => toast('Geçersiz görsel', 'err');
      img.src = base64;
    };
    reader.onerror = () => toast('Dosya okunamadı', 'err');
    reader.readAsDataURL(file);
  }, [toast]);

  const doCopy = useCallback(async () => {
    // Try modern Clipboard API first, fallback to execCommand
    try {
      if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': new Blob([sigHTML], { type: 'text/html' }),
            'text/plain': new Blob([sigHTML.replace(/<[^>]*>/g, '')], { type: 'text/plain' }),
          }),
        ]);
        setCopied(true);
        toast(L.cpd);
        setTimeout(() => setCopied(false), 2500);
        return;
      }
    } catch { /* fallback below */ }
    // Fallback: DOM-based copy
    const div = document.createElement('div');
    div.innerHTML = sigHTML;
    div.style.position = 'fixed';
    div.style.left = '-9999px';
    document.body.appendChild(div);
    const range = document.createRange();
    range.selectNodeContents(div);
    const sel = window.getSelection();
    if (!sel) { document.body.removeChild(div); return; }
    sel.removeAllRanges();
    sel.addRange(range);
    try {
      document.execCommand('copy');
      setCopied(true);
      toast(L.cpd);
      setTimeout(() => setCopied(false), 2500);
    } catch { toast('Error', 'err'); }
    sel.removeAllRanges();
    document.body.removeChild(div);
  }, [sigHTML, L, toast]);

  const doDown = useCallback(() => {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:20px;">${sigHTML}</body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'imza.html';
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast(L.dl);
  }, [sigHTML, L, toast]);

  const doReset = useCallback(() => {
    setForm({ firstName: '', lastName: '', titleTR: '', titleEN: '', officeId: '', gsm: '', email: '', linkedinPersonal: '' });
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

  // Draw banner
  useEffect(() => {
    if (tab !== 'banner') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    let isMounted = true;
    const tpl = BANNER_TEMPLATES.find(t => t.id === banner.template) || BANNER_TEMPLATES[0];
    const sz = BANNER_SIZES.find(s => s.id === banner.size) || BANNER_SIZES[0];
    const sc = sz.scale || 2;
    canvas.width = sz.w * sc; canvas.height = sz.h * sc;
    const ctx = canvas.getContext('2d');
    ctx.scale(sc, sc);
    const grad = ctx.createLinearGradient(0, 0, sz.w, sz.h);
    if (tpl.id === 'classic') { grad.addColorStop(0, '#1e3a5f'); grad.addColorStop(1, '#2c5282'); }
    else if (tpl.id === 'gold') { grad.addColorStop(0, '#1a1a2e'); grad.addColorStop(0.5, '#16213e'); grad.addColorStop(1, '#0f3460'); }
    else { grad.addColorStop(0, '#f8f9fa'); grad.addColorStop(1, '#e9ecef'); }
    ctx.fillStyle = grad; ctx.fillRect(0, 0, sz.w, sz.h);
    const acBar = stg.bannerAccentColor || tpl.accentBar;
    ctx.fillStyle = acBar; ctx.fillRect(0, sz.h - 6, sz.w, 6);
    ctx.fillStyle = acBar; ctx.fillRect(sz.w * 0.06, sz.h * 0.25, 4, sz.h * 0.5);
    const textX = sz.w * 0.06 + 24;
    ctx.fillStyle = tpl.textColor; ctx.textBaseline = 'middle';
    ctx.font = `bold ${Math.round(sz.h * 0.13)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(banner.title || stg.companyName, textX, sz.h * 0.42);
    ctx.font = `${Math.round(sz.h * 0.07)}px "Inter", sans-serif`;
    ctx.globalAlpha = 0.75;
    ctx.fillText(banner.subtitle || stg.slogan, textX, sz.h * 0.62);
    ctx.globalAlpha = 1;
    ctx.font = `bold ${Math.round(sz.h * 0.05)}px "Inter", sans-serif`;
    ctx.fillStyle = acBar; ctx.textAlign = 'right';
    ctx.fillText(stg.website, sz.w * 0.94, sz.h * 0.85);
    ctx.textAlign = 'left';
    let logoImg = null;
    if (stg.logoBase64) {
      logoImg = new window.Image();
      logoImg.onload = () => {
        if (!isMounted) return;
        const maxH = sz.h * 0.35, maxW = sz.w * 0.15;
        let dw = logoImg.width, dh = logoImg.height;
        if (dw > maxW) { const r = maxW / dw; dw = maxW; dh *= r; }
        if (dh > maxH) { const r = maxH / dh; dh = maxH; dw *= r; }
        ctx.drawImage(logoImg, sz.w * 0.94 - dw, sz.h * 0.15, dw, dh);
      };
      logoImg.src = stg.logoBase64;
    }
    return () => { isMounted = false; if (logoImg) logoImg.src = ''; };
  }, [tab, banner, stg]);

  const uf = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const tabIds = ['signature', 'banner', 'settings'];

  // ─── Login Splash Screen (Apple iOS Glassmorphism Light) ───
  if (MSAL_ENABLED && !msalAccount) {
    return (
      <div style={{
        fontFamily: 'Inter,sans-serif',
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: '#f5f5f7',
        position: 'relative', overflow: 'hidden',
      }}>
        <style>{GLOBAL_CSS}{`
          @keyframes liquidA { 0%,100% { transform: translate(0,0) scale(1) rotate(0deg); } 33% { transform: translate(40px,-50px) scale(1.1) rotate(10deg); } 66% { transform: translate(-20px,30px) scale(0.95) rotate(-5deg); } }
          @keyframes liquidB { 0%,100% { transform: translate(0,0) scale(1) rotate(0deg); } 33% { transform: translate(-50px,40px) scale(1.15) rotate(-8deg); } 66% { transform: translate(30px,-20px) scale(0.9) rotate(12deg); } }
          @keyframes liquidC { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(25px,35px) scale(1.08); } }
          @keyframes splashFadeUp { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
          .splash-btn-ios:hover { transform: scale(1.02); box-shadow: 0 8px 30px rgba(30,58,95,0.2)!important; }
          .splash-btn-ios:active { transform: scale(0.98); }
        `}</style>

        {/* Liquid gradient blobs — iOS style */}
        <div style={{
          position: 'absolute', width: 500, height: 500, borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
          background: 'linear-gradient(135deg, rgba(0,152,212,0.25), rgba(30,58,95,0.15))',
          top: '-15%', right: '-10%', animation: 'liquidA 15s ease-in-out infinite',
          filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute', width: 450, height: 450, borderRadius: '60% 40% 30% 70% / 50% 60% 40% 50%',
          background: 'linear-gradient(135deg, rgba(200,146,42,0.2), rgba(232,197,96,0.12))',
          bottom: '-12%', left: '-8%', animation: 'liquidB 18s ease-in-out infinite',
          filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute', width: 300, height: 300, borderRadius: '50% 60% 40% 70% / 60% 40% 60% 40%',
          background: 'linear-gradient(135deg, rgba(30,58,95,0.08), rgba(0,152,212,0.1))',
          top: '50%', left: '50%', marginLeft: -150, marginTop: -150,
          animation: 'liquidC 12s ease-in-out infinite',
          filter: 'blur(50px)',
        }} />

        {/* Main glass card */}
        <div style={{
          textAlign: 'center', padding: '2.5rem 2.5rem 2rem',
          background: 'rgba(255,255,255,0.55)',
          borderRadius: 28, maxWidth: 400, width: '88%',
          border: '1px solid rgba(255,255,255,0.6)',
          backdropFilter: 'blur(40px) saturate(180%)', WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          boxShadow: '0 20px 60px rgba(30,58,95,0.08), 0 1px 3px rgba(30,58,95,0.05)',
          animation: 'splashFadeUp 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative', zIndex: 2,
        }}>

          {/* Title with inline pen logo */}
          <h1 style={{
            fontSize: '1.6rem', fontWeight: 800, color: '#1e3a5f',
            fontFamily: 'Plus Jakarta Sans,sans-serif', margin: '0 0 0.1rem',
            letterSpacing: '-0.5px', wordSpacing: '0.15rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem',
            paddingLeft: '1rem',
          }}>
            <span>TYRO</span>{' '}
            <span style={{ color: '#c8922a', letterSpacing: '-0.3px', wordSpacing: '0.15rem' }}>Sign Snap</span>
            <span style={{ display: 'inline-flex', alignItems: 'flex-end', marginLeft: '-0.5rem', marginBottom: '0.15rem' }}>
              <TyroLogo size={44} />
            </span>
          </h1>

          <p style={{
            fontSize: '0.78rem', color: '#8e8e93', margin: '0.25rem 0 2rem',
            fontWeight: 400,
          }}>
            {lang === 'tr' ? 'Kurumsal E-Posta İmza Oluşturucu' : 'Corporate Email Signature Studio'}
          </p>

          {/* Microsoft Login Button — iOS style */}
          <button className="splash-btn-ios" onClick={handleLogin} disabled={authLoading || !msalReady} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
            width: '100%', padding: '0.85rem 1.5rem', borderRadius: 14,
            border: 'none',
            cursor: (authLoading || !msalReady) ? 'wait' : 'pointer',
            background: 'linear-gradient(135deg, #1e3a5f, #2a5f9e)',
            color: '#fff', fontSize: '0.88rem', fontWeight: 600,
            fontFamily: 'Inter,sans-serif',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 4px 16px rgba(30,58,95,0.25)',
            opacity: (authLoading || !msalReady) ? 0.6 : 1,
          }}>
            <svg width="18" height="18" viewBox="0 0 21 21" fill="none">
              <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
              <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
              <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
              <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
            </svg>
            {authLoading
              ? (lang === 'tr' ? 'Giriş yapılıyor...' : 'Signing in...')
              : (lang === 'tr' ? 'Microsoft ile Giriş Yap' : 'Sign in with Microsoft')
            }
          </button>

          {/* Language toggle — pill style */}
          <div style={{
            marginTop: '1.25rem', display: 'inline-flex',
            background: 'rgba(0,0,0,0.04)', borderRadius: 10, padding: 3,
          }}>
            {['tr', 'en'].map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                padding: '0.3rem 0.85rem', borderRadius: 8,
                border: 'none', cursor: 'pointer',
                fontSize: '0.65rem', fontWeight: 600,
                fontFamily: 'Inter,sans-serif',
                background: lang === l ? '#fff' : 'transparent',
                color: lang === l ? '#1e3a5f' : '#8e8e93',
                boxShadow: lang === l ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s ease',
              }}>{l.toUpperCase()}</button>
            ))}
          </div>
        </div>

        {/* TTECH Footer */}
        <div style={{
          marginTop: '2rem', textAlign: 'center',
          position: 'relative', zIndex: 2,
        }}>
          <p style={{
            fontSize: '0.7rem', fontWeight: 700, color: 'rgba(30,58,95,0.55)',
            fontFamily: 'Plus Jakarta Sans,sans-serif', letterSpacing: '2px',
            margin: '0 0 0.3rem',
          }}>TTECH BUSINESS SOLUTIONS</p>
          <p style={{
            fontSize: '0.58rem', color: 'rgba(30,58,95,0.35)', margin: 0,
          }}>
            {'© 2026 Tiryaki Agro'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Inter,sans-serif', background: C.bg, color: C.text1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{GLOBAL_CSS}</style>

      {/* ═══════ HEADER ═══════ */}
      <header className="app-header" style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: C.glassSolid, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${C.borderSub}`,
        padding: '0 2rem', height: 56,
        display: 'flex', alignItems: 'center', gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          <span className="app-header-title" style={{ fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: '1rem', fontWeight: 800, color: C.primary }}>TYRO</span>
          <span className="app-header-title-accent" style={{ fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: '1rem', fontWeight: 800, color: C.accent }}>Sign Snap</span>
          <span style={{ display: 'inline-flex', alignItems: 'flex-end', marginLeft: '-0.35rem', marginBottom: '0.05rem' }}>
            <TyroLogo size={30} />
          </span>
        </div>

        <nav className="app-header-nav" style={{
          flex: 1, display: 'flex', justifyContent: 'center',
        }}>
          <div className="nav-tabs-inner" style={{
            position: 'relative', display: 'flex', gap: '2px',
            background: 'transparent', borderRadius: 10,
            padding: 3, border: 'none',
          }}>
            {/* Sliding highlight */}
            <span style={{
              position: 'absolute', top: 3, bottom: 3,
              left: `calc(${tabIds.indexOf(tab)} * 33.333% + 3px)`,
              width: 'calc(33.333% - 2px)',
              background: '#fff', borderRadius: 8,
              boxShadow: '0 1px 3px rgba(30,58,95,0.1), 0 1px 2px rgba(30,58,95,0.06)',
              transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }} />
            <TabBtn active={tab === 'signature'} onClick={() => setTab('signature')} icon={Edit3} label={L.sigTab} />
            <TabBtn active={tab === 'banner'} onClick={() => setTab('banner')} icon={BannerIcon} label={L.banTab} />
            <TabBtn active={tab === 'settings'} onClick={() => setTab('settings')} icon={Settings} label={L.setTab} />
          </div>
        </nav>

        {/* ─── Language Toggle ─── */}
        <div className="app-header-lang" style={{
          display: 'flex', borderRadius: '20px', overflow: 'hidden',
          border: `1.5px solid ${C.borderSub}`, background: C.glass,
          backdropFilter: 'blur(10px)', boxShadow: '0 1px 4px rgba(30,58,95,0.06)',
        }}>
          <button onClick={() => setLang('tr')} style={{
            padding: '0.3rem 0.6rem', border: 'none', cursor: 'pointer',
            fontSize: '0.65rem', fontWeight: 700, fontFamily: 'Inter,sans-serif',
            background: lang === 'tr' ? `linear-gradient(135deg, ${C.accent}, #d4a43a)` : 'transparent',
            color: lang === 'tr' ? '#fff' : C.textM,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>TR</button>
          <button onClick={() => setLang('en')} style={{
            padding: '0.3rem 0.6rem', border: 'none', cursor: 'pointer',
            fontSize: '0.65rem', fontWeight: 700, fontFamily: 'Inter,sans-serif',
            background: lang === 'en' ? `linear-gradient(135deg, ${C.accent}, #d4a43a)` : 'transparent',
            color: lang === 'en' ? '#fff' : C.textM,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>EN</button>
        </div>

        {/* ─── Profile Section (far right) ─── */}
        {msalAccount && (
          <div className="app-header-auth" style={{ position: 'relative' }}>
            <button
              onClick={() => setProfileOpen(p => !p)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.2rem 0.5rem 0.2rem 0.2rem',
                background: profileOpen ? `${C.primary}0c` : 'transparent',
                borderRadius: 24, border: `1.5px solid ${profileOpen ? C.primary + '30' : C.borderSub}`,
                cursor: 'pointer', transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { if (!profileOpen) { e.currentTarget.style.background = `${C.primary}08`; e.currentTarget.style.borderColor = C.primary + '20'; } }}
              onMouseLeave={e => { if (!profileOpen) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = C.borderSub; } }}
            >
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: `linear-gradient(135deg, ${C.primary}, #2a5f9e)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '0.6rem', fontWeight: 700,
                fontFamily: 'Plus Jakarta Sans,sans-serif',
                letterSpacing: '0.5px',
                boxShadow: '0 2px 8px rgba(30,58,95,0.25)',
              }}>
                {(msalAccount.name || '').split(' ').map(n => n?.[0] || '').join('').slice(0, 2).toLocaleUpperCase('tr-TR')}
              </div>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{
                transition: 'transform 0.2s ease',
                transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}>
                <path d="M1 1L5 5L9 1" stroke={C.textM} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Dropdown menu */}
            {profileOpen && (
              <>
                <div onClick={() => setProfileOpen(false)} style={{
                  position: 'fixed', inset: 0, zIndex: 199,
                }} />
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  minWidth: 220, background: C.surface,
                  borderRadius: 14, border: `1px solid ${C.borderSub}`,
                  boxShadow: '0 12px 40px rgba(30,58,95,0.15), 0 4px 12px rgba(30,58,95,0.08)',
                  zIndex: 200, overflow: 'hidden',
                  animation: 'fadeSlideDown 0.2s ease',
                }}>
                  {/* User info section */}
                  <div style={{
                    padding: '1rem 1rem 0.75rem',
                    borderBottom: `1px solid ${C.borderSub}`,
                    background: `${C.primary}04`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: '50%',
                        background: `linear-gradient(135deg, ${C.primary}, #2a5f9e)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: '0.75rem', fontWeight: 700,
                        fontFamily: 'Plus Jakarta Sans,sans-serif',
                        letterSpacing: '0.5px',
                        boxShadow: '0 2px 8px rgba(30,58,95,0.25)',
                        flexShrink: 0,
                      }}>
                        {(msalAccount.name || '').split(' ').map(n => n?.[0] || '').join('').slice(0, 2).toLocaleUpperCase('tr-TR')}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{
                          fontSize: '0.78rem', fontWeight: 700, color: C.text1,
                          fontFamily: 'Plus Jakarta Sans,sans-serif',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                          {msalAccount.name || msalAccount.username}
                        </div>
                        <div style={{
                          fontSize: '0.65rem', color: C.textM, marginTop: 2,
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                          {msalAccount.username}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Logout button */}
                  <div style={{ padding: '0.4rem' }}>
                    <button onClick={() => { setProfileOpen(false); handleLogout(); }} style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem',
                      padding: '0.55rem 0.7rem', borderRadius: 10,
                      border: 'none', background: 'transparent', cursor: 'pointer',
                      fontSize: '0.72rem', fontWeight: 500, color: '#dc2626',
                      fontFamily: 'Inter,sans-serif',
                      transition: 'background 0.15s ease',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(220,38,38,0.06)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      {lang === 'tr' ? 'Çıkış Yap' : 'Sign Out'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </header>

      {/* Animated gradient accent line */}
      <div style={{
        height: 2,
        backgroundImage: `linear-gradient(90deg, ${C.primary}, ${C.divider}, ${C.accent}, ${C.primary})`,
        backgroundSize: '300% 100%',
        animation: 'gradientShift 4s ease infinite',
        opacity: 0.7,
      }} />

      {/* ═══════ MAIN ═══════ */}
      <main className="app-main" style={{ flex: 1, padding: '1rem 2rem', maxWidth: 1400, width: '100%', margin: '0 auto' }}>

        {/* ═══ SIGNATURE ═══ */}
        {tab === 'signature' && (
          <div style={{ animation: 'fadeIn 0.35s cubic-bezier(0.22, 1, 0.36, 1)' }}>
            {/* Progress */}
            <div className="progress-bar" style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem',
              background: C.surface, backdropFilter: 'blur(12px)', borderRadius: 12,
              padding: '0.65rem 1rem', border: `1px solid ${C.border}`,
              transition: 'all 0.4s ease',
              boxShadow: progress.pct === 100 ? `0 2px 16px ${C.ok}15` : C.shadow,
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                background: progress.pct === 100
                  ? `linear-gradient(135deg, ${C.ok}12, ${C.ok}06)`
                  : `linear-gradient(135deg, ${C.primary}10, ${C.divider}08)`,
                border: `1px solid ${progress.pct === 100 ? C.ok + '25' : C.primary + '15'}`,
                borderRadius: 8, padding: '0.3rem 0.6rem',
                transition: 'all 0.4s ease',
                animation: progress.pct === 100 ? 'completeBounce 0.5s ease' : 'none',
              }}>
                {progress.pct === 100 ? (
                  <Check size={12} style={{ color: C.ok }} />
                ) : (
                  <span style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${C.primary}, ${C.divider})`,
                    animation: 'pulse 2s infinite',
                  }} />
                )}
                <span style={{
                  fontSize: '0.63rem', fontWeight: 700,
                  color: progress.pct === 100 ? C.ok : C.primary,
                  fontFamily: 'Plus Jakarta Sans,sans-serif',
                }}>{L.prog}</span>
                <span style={{
                  fontSize: '0.72rem', fontWeight: 800,
                  color: progress.pct === 100 ? C.ok : C.accent,
                  fontFamily: 'Plus Jakarta Sans,sans-serif',
                  fontVariantNumeric: 'tabular-nums',
                  animation: 'countPop 0.3s ease',
                  key: progress.filled,
                }}>{progress.filled}{L.of}{progress.total}</span>
              </div>
              <div style={{
                flex: 1, height: 6, borderRadius: 4, overflow: 'hidden', position: 'relative',
                background: progress.pct === 100
                  ? `${C.ok}12`
                  : `linear-gradient(90deg, ${C.primaryGhost}, ${C.primary}08)`,
                transition: 'background 0.4s ease',
              }}>
                <div style={{
                  height: '100%', width: `${progress.pct}%`,
                  backgroundImage: progress.pct === 100
                    ? `linear-gradient(90deg, ${C.ok}, #22c55e, #4ade80, #22c55e, ${C.ok})`
                    : `linear-gradient(90deg, ${C.primary}, ${C.divider}, ${C.primary}, ${C.divider})`,
                  backgroundSize: '300% 100%',
                  borderRadius: 4,
                  transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  animation: progress.pct > 0
                    ? `progressFlow 3s linear infinite${progress.pct === 100 ? ', progressComplete 2s ease infinite' : ', progressGlow 2s ease infinite'}`
                    : 'none',
                  position: 'relative', overflow: 'hidden',
                }}>
                  {progress.pct > 0 && <span style={{
                    position: 'absolute', top: 0, bottom: 0, width: '30%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                    animation: 'barShine 2.5s ease-in-out infinite',
                  }} />}
                </div>
              </div>
              <span style={{
                fontSize: '0.7rem', fontWeight: 800,
                fontFamily: 'Plus Jakarta Sans,sans-serif',
                fontVariantNumeric: 'tabular-nums',
                color: progress.pct === 100 ? C.ok : C.accent,
                background: progress.pct === 100 ? `${C.ok}10` : `${C.accent}10`,
                padding: '0.2rem 0.45rem', borderRadius: 6,
                transition: 'all 0.4s ease',
                animation: progress.pct === 100 ? 'completeBounce 0.5s ease' : 'none',
              }}>
                {progress.pct}%
              </span>
            </div>

            <div className="sig-layout sig-grid" style={{
              display: 'grid', gridTemplateColumns: 'minmax(0, 480px) 1fr',
              gap: '1rem', alignItems: 'stretch',
            }}>
              {/* ROW 1 LEFT: Kişisel Bilgiler */}
              <div className="sig-sec-personal" style={{ animation: 'slideInLeft 0.4s ease-out' }}>
                <GlassCard accent style={{ height: '100%' }}>
                  <SectionTitle icon={User}>{L.pi}</SectionTitle>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div style={{ flex: 1 }}><FormField label={L.fn} value={form.firstName} onChange={e => uf('firstName', e.target.value)} placeholder="Cenk" required /></div>
                    <div style={{ flex: 1 }}><FormField label={L.ln} value={form.lastName} onChange={e => uf('lastName', e.target.value)} placeholder="Şaylı" required /></div>
                  </div>
                  <FormField label={L.ttr} value={form.titleTR} onChange={e => uf('titleTR', e.target.value)} placeholder="Kurumsal Sistemler Yöneticisi" />
                  <FormField label={L.ten} value={form.titleEN} onChange={e => uf('titleEN', e.target.value)} placeholder="Enterprise Systems Executive" />
                  <div style={{ marginBottom: '0.7rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem', fontWeight: 600, color: C.text2, marginBottom: '0.25rem' }}>
                      {L.ofc}<span style={{ color: C.err }}>*</span>
                    </label>
                    <select
                      value={form.officeId} onChange={e => uf('officeId', e.target.value)}
                      style={{
                        width: '100%', padding: '0.45rem 0.65rem',
                        border: `1px solid ${C.borderSub}`, borderRadius: '8px',
                        fontSize: '0.78rem', fontFamily: 'Inter,sans-serif',
                        background: C.glass, color: C.text1, cursor: 'pointer',
                        boxSizing: 'border-box', outline: 'none', backdropFilter: 'blur(8px)',
                      }}
                    >
                      <option value="">{L.so}</option>
                      {OFFICE_GROUPS.map(group => (
                        <optgroup key={group} label={lang === 'en' ? (group === 'Türkiye' ? L.grpTR : L.grpIntl) : group}>
                          {OFFICES.filter(o => o.group === group).map(o => (
                            <option key={o.id} value={o.id}>{o.name}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    {office && (
                      <div style={{
                        marginTop: '0.35rem', padding: '0.35rem 0.6rem',
                        background: C.primaryGhost, borderRadius: '7px', border: `1px solid ${C.borderSub}`,
                        fontSize: '0.6rem', color: C.text2, lineHeight: 1.4, animation: 'fadeIn 0.25s',
                      }}>
                        <div>{office.address}, {office.city}</div>
                        {office.sdn && <div style={{ marginTop: 2 }}>SDN: {office.sdn}{office.fax ? ` | Fax: ${office.fax}` : ''}</div>}
                      </div>
                    )}
                  </div>
                </GlassCard>
              </div>

              {/* ROW 1 RIGHT: Canlı Önizleme */}
              <div className="sig-sec-preview" style={{ animation: 'slideInRight 0.4s ease-out' }}>
                <GlassCard accent style={{ height: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                    <Eye size={15} style={{ color: C.accent }} />
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: C.primary, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>{L.lv}</span>
                    {hasData && <span style={{
                      display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
                      background: C.ok, marginLeft: '0.3rem',
                      boxShadow: `0 0 0 3px ${C.ok}20`,
                      animation: 'pulse 2s infinite',
                    }} />}

                    {/* ─── Design Switcher Dropdown ─── */}
                    {(() => {
                      const dIdx = DESIGNS.findIndex(d => d.id === stg.designId);
                      const curDesign = DESIGNS[dIdx] || DESIGNS[0];
                      const renderMiniPreview = (designId, size = 1) => {
                        const w = 40 * size, h = 24 * size;
                        return (
                          <div style={{ width: w, height: h, borderRadius: 4, overflow: 'hidden', border: `1px solid ${C.borderSub}`, background: '#fff', display: 'flex', position: 'relative', flexShrink: 0 }}>
                            {designId === 'classic' ? (<>
                              <div style={{ width: 10 * size, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: 6 * size, height: 8 * size, borderRadius: 1, background: C.primary + '40' }} />
                              </div>
                              <div style={{ width: 1, background: C.divider, flexShrink: 0 }} />
                              <div style={{ flex: 1, padding: `${3 * size}px ${2 * size}px`, display: 'flex', flexDirection: 'column', gap: size }}>
                                <div style={{ height: 1.5 * size, width: '80%', background: C.primary + '50', borderRadius: 1 }} />
                                <div style={{ height: size, width: '60%', background: C.accent + '40', borderRadius: 1 }} />
                                <div style={{ height: size, width: '90%', background: '#ddd', borderRadius: 1 }} />
                              </div>
                              <div style={{ width: 9 * size, background: C.primary, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: size }}>
                                <div style={{ width: 3 * size, height: 3 * size, borderRadius: 1, background: 'rgba(255,255,255,0.4)' }} />
                                <div style={{ width: 3 * size, height: 3 * size, borderRadius: 1, background: 'rgba(255,255,255,0.4)' }} />
                              </div>
                            </>) : (<>
                              <div style={{ width: 14 * size, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: `${2 * size}px ${size}px` }}>
                                <div style={{ width: 8 * size, height: 9 * size, borderRadius: 1, background: C.primary + '30', marginBottom: size }} />
                                <div style={{ height: size, width: 10 * size, background: C.accent + '40', borderRadius: 1 }} />
                              </div>
                              <div style={{ flex: 1, background: stg.rightBlockBg || C.primary, borderRadius: `${6 * size}px 0 0 ${3 * size}px`, display: 'flex', flexDirection: 'column', padding: `${3 * size}px`, gap: size }}>
                                <div style={{ height: 1.5 * size, width: '85%', background: 'rgba(255,255,255,0.7)', borderRadius: 1 }} />
                                <div style={{ height: size, width: '55%', background: 'rgba(255,255,255,0.4)', borderRadius: 1 }} />
                                <div style={{ height: size, width: '75%', background: 'rgba(255,255,255,0.3)', borderRadius: 1, marginTop: size }} />
                              </div>
                            </>)}
                          </div>
                        );
                      };
                      return (
                        <div style={{ marginLeft: 'auto', position: 'relative' }}>
                          <button
                            onClick={() => setDesignOpen(p => !p)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '0.4rem',
                              padding: '0.25rem 0.5rem 0.25rem 0.3rem',
                              background: designOpen ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.55)',
                              backdropFilter: 'blur(12px) saturate(180%)', WebkitBackdropFilter: 'blur(12px) saturate(180%)',
                              borderRadius: 20, border: `1.5px solid ${designOpen ? C.primary + '30' : 'rgba(255,255,255,0.6)'}`,
                              boxShadow: designOpen ? '0 4px 16px rgba(30,58,95,0.12)' : '0 2px 8px rgba(30,58,95,0.08)',
                              cursor: 'pointer', transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={e => { if (!designOpen) { e.currentTarget.style.background = 'rgba(255,255,255,0.75)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(30,58,95,0.12)'; } }}
                            onMouseLeave={e => { if (!designOpen) { e.currentTarget.style.background = 'rgba(255,255,255,0.55)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(30,58,95,0.08)'; } }}
                          >
                            <span className="design-mini-preview">{renderMiniPreview(curDesign.id)}</span>
                            <span style={{ fontSize: '0.68rem', fontWeight: 600, color: C.text1, fontFamily: 'Plus Jakarta Sans,sans-serif', whiteSpace: 'nowrap' }}>
                              {L[curDesign.nameKey]}
                            </span>
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{
                              transition: 'transform 0.2s ease',
                              transform: designOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            }}>
                              <path d="M1 1L5 5L9 1" stroke={C.textM} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>

                          {designOpen && (
                            <>
                              <div onClick={() => setDesignOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 199 }} />
                              <div style={{
                                position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                                minWidth: 200, background: C.surface,
                                borderRadius: 14, border: `1px solid ${C.borderSub}`,
                                boxShadow: '0 12px 40px rgba(30,58,95,0.15), 0 4px 12px rgba(30,58,95,0.08)',
                                zIndex: 200, overflow: 'hidden',
                                animation: 'fadeSlideDown 0.2s ease',
                              }}>
                                <div style={{ padding: '0.5rem 0.6rem 0.35rem', borderBottom: `1px solid ${C.borderSub}` }}>
                                  <span style={{ fontSize: '0.6rem', fontWeight: 600, color: C.textM, fontFamily: 'Plus Jakarta Sans,sans-serif', letterSpacing: '0.5px' }}>
                                    {L.designSelect}
                                  </span>
                                </div>
                                <div style={{ padding: '0.3rem' }}>
                                  {DESIGNS.map(d => {
                                    const isActive = d.id === stg.designId;
                                    return (
                                      <button
                                        key={d.id}
                                        onClick={() => { setStg(p => ({ ...p, designId: d.id })); setDesignOpen(false); }}
                                        style={{
                                          width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem',
                                          padding: '0.5rem 0.55rem', borderRadius: 10,
                                          border: 'none', background: isActive ? `${C.primary}0a` : 'transparent',
                                          cursor: 'pointer', transition: 'background 0.15s ease',
                                        }}
                                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = `${C.primary}06`; }}
                                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                                      >
                                        {renderMiniPreview(d.id)}
                                        <div style={{ flex: 1, textAlign: 'left' }}>
                                          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: C.text1, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>
                                            {L[d.nameKey]}
                                          </div>
                                          <div style={{ fontSize: '0.6rem', color: C.textM, marginTop: 1 }}>
                                            {L[d.nameKey + 'Desc']}
                                          </div>
                                        </div>
                                        {isActive && (
                                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                          </svg>
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                  {/* Outlook window frame */}
                  <div style={{
                    border: '1px solid #d0d5dd', borderRadius: 10, overflow: 'hidden',
                    background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', padding: '0.4rem 0.7rem',
                      background: 'linear-gradient(180deg, #f8f9fa, #eef0f2)',
                      borderBottom: '1px solid #e0e3e8',
                    }}>
                      <div style={{ display: 'flex', gap: 5 }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
                      </div>
                      <span style={{ flex: 1, textAlign: 'center', fontSize: '0.65rem', color: C.text2, fontWeight: 500 }}>{L.mockTitle}</span>
                    </div>
                    <div style={{ borderBottom: '1px solid #e8eaed', padding: '0.4rem 0.8rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.68rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 600, color: C.text1, minWidth: 38 }}>{L.mockSubject}</span>
                        <span style={{ color: C.text2 }}>{lang === 'tr' ? 'Toplantı Daveti' : 'Meeting Invitation'}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.68rem' }}>
                        <span style={{ fontWeight: 600, color: C.text1, minWidth: 38 }}>{L.mockTo}</span>
                        <span style={{ color: C.text2 }}>ali.yilmaz@tiryaki.com.tr</span>
                      </div>
                    </div>
                    <div style={{ padding: '0.8rem 1rem' }}>
                      {hasData && (
                        <div style={{ marginBottom: '1rem', fontSize: '0.75rem', color: C.text1, lineHeight: 1.6 }}>
                          <p>{L.mockBody}</p>
                          <p style={{ color: C.text2, marginTop: '0.2rem' }}>{L.mockBodyLine}</p>
                        </div>
                      )}
                      <div style={{ minHeight: 80, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                        {hasData ? (
                          <div dangerouslySetInnerHTML={{ __html: sigHTML }} />
                        ) : (
                          <div style={{ textAlign: 'center', padding: '2rem 1rem 1.5rem' }}>
                            <div style={{ display: 'inline-block', position: 'relative', marginBottom: '0.7rem' }}>
                              <div style={{ animation: 'signing 3.5s ease-in-out infinite' }}>
                                <TyroLogo size={40} />
                              </div>
                              {/* Signature trail line */}
                              <div style={{
                                position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)',
                                height: 2, maxWidth: 80, overflow: 'hidden',
                              }}>
                                <div style={{
                                  height: '100%',
                                  background: `linear-gradient(90deg, transparent, ${C.accent}, ${C.primary}, ${C.accent}, transparent)`,
                                  borderRadius: 2,
                                  animation: 'signLine 3.5s ease-in-out infinite',
                                }} />
                              </div>
                            </div>
                            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: C.text2 }}>{L.emptySig}</p>
                            <p style={{ fontSize: '0.62rem', color: C.textM, marginTop: '0.2rem' }}>{L.fillForm}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.55rem', color: C.textM, marginTop: '0.5rem', textAlign: 'center' }}>
                    {lang === 'tr' ? 'E-posta istemcilerinde bu şekilde görünecek' : 'This is how it will appear in email clients'}
                  </p>
                </GlassCard>
              </div>

              {/* ROW 2 LEFT: İletişim */}
              <div className="sig-sec-contact" style={{ animation: 'slideInLeft 0.4s ease-out' }}>
                <GlassCard accent style={{ height: '100%' }}>
                  <SectionTitle icon={Phone}>{L.ci}</SectionTitle>
                  <FormField label={L.gsm} value={form.gsm} onChange={e => uf('gsm', e.target.value)} placeholder="0545 821 38 08" />
                  <FormField label={L.email} value={form.email} onChange={e => uf('email', e.target.value)} placeholder="cenk.sayli@tiryaki.com.tr" required />
                  <div style={{ marginBottom: '0.4rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem', fontWeight: 600, color: C.text2, marginBottom: '0.25rem' }}>
                      LinkedIn
                    </label>
                    <input
                      type="text" value={form.linkedinPersonal} onChange={e => uf('linkedinPersonal', e.target.value)}
                      placeholder="https://linkedin.com/in/cenksayli"
                      style={{
                        width: '100%', padding: '0.45rem 0.65rem',
                        border: `1px solid ${C.borderSub}`, borderRadius: '8px',
                        fontSize: '0.78rem', fontFamily: 'Inter,sans-serif',
                        background: C.glass, color: C.text1,
                        outline: 'none', boxSizing: 'border-box',
                        transition: 'all 0.25s ease', backdropFilter: 'blur(8px)',
                      }}
                    />
                    <p style={{ fontSize: '0.52rem', color: C.textM, marginTop: '0.15rem', fontStyle: 'italic' }}>
                      {lang === 'tr' ? 'Boş bırakılırsa şirket LinkedIn adresi kullanılır' : 'If left empty, company LinkedIn URL will be used'}
                    </p>
                  </div>
                </GlassCard>
              </div>

              {/* ROW 2 RIGHT: İmzayı Dışa Aktar */}
              <div className="sig-sec-export" style={{ animation: 'slideInRight 0.4s ease-out' }}>
                <GlassCard accent style={{ height: '100%' }}>
                  {/* Header — matching SectionTitle style */}
                  <SectionTitle icon={Download}>{L.exportTitle}</SectionTitle>

                  {/* Copy Button — full width navy */}
                  <div className="export-btns" style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
                    <button
                      onClick={doCopy} disabled={!hasData}
                      style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        padding: '0.55rem 1rem', borderRadius: 10, border: 'none', cursor: hasData ? 'pointer' : 'not-allowed',
                        background: copied ? `linear-gradient(135deg, ${C.ok}, #22c55e)` : `linear-gradient(135deg, ${C.primary}, ${C.primarySoft})`,
                        color: '#fff', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'Inter,sans-serif',
                        opacity: hasData ? 1 : 0.5, transition: 'all 0.3s ease',
                        boxShadow: hasData ? `0 4px 16px ${C.primary}30` : 'none',
                      }}
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      {copied ? L.cpd : L.cp}
                    </button>
                    <button
                      onClick={doReset}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem',
                        padding: '0.55rem 1rem', borderRadius: 10,
                        border: `1px solid ${C.borderSub}`, cursor: 'pointer',
                        background: C.glass, color: C.text2, fontSize: '0.75rem', fontWeight: 600,
                        fontFamily: 'Inter,sans-serif', transition: 'all 0.3s ease',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <RefreshCw size={14} />
                      {L.rst}
                    </button>
                  </div>

                  {/* Collapsible Outlook Steps */}
                  <div style={{ borderTop: `1px solid ${C.borderSub}`, paddingTop: '0.5rem' }}>
                    <button
                      onClick={() => setShowSteps(!showSteps)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.4rem', width: '100%',
                        background: 'none', border: 'none', cursor: 'pointer', padding: '0.15rem 0',
                        marginBottom: showSteps ? '0.5rem' : 0,
                      }}
                    >
                      <Info size={14} style={{ color: C.accent }} />
                      <span style={{ fontSize: '0.76rem', fontWeight: 700, color: C.primary, fontFamily: 'Plus Jakarta Sans,sans-serif', flex: 1, textAlign: 'left' }}>{L.ht}</span>
                      <span style={{
                        fontSize: '0.7rem', color: C.textM, transition: 'transform 0.3s ease',
                        transform: showSteps ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}>&#9662;</span>
                    </button>
                    {showSteps && (
                      <div style={{ animation: 'fadeIn 0.25s ease' }}>
                        {L.steps.map((step, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.3rem' }}>
                            <span style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                              width: 18, height: 18, borderRadius: '50%',
                              background: `${C.divider}15`, color: C.divider,
                              fontSize: '0.58rem', fontWeight: 700,
                            }}>{i + 1}</span>
                            <span style={{ fontSize: '0.63rem', color: C.text2, lineHeight: 1.5, paddingTop: '0.05rem' }}>{step}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        )}

        {/* ═══ BANNER ═══ */}
        {tab === 'banner' && (
          <div style={{ animation: 'fadeIn 0.35s cubic-bezier(0.22, 1, 0.36, 1)' }}>
            <div className="sig-layout banner-flex" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div className="banner-left" style={{ flex: '0 0 320px', minWidth: 0, animation: 'slideInLeft 0.4s ease-out' }}>
                <GlassCard accent>
                  <SectionTitle icon={Image}>{L.banTab}</SectionTitle>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.7rem', fontWeight: 600, color: C.text2, marginBottom: '0.4rem', display: 'block' }}>{L.banTpl}</label>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {BANNER_TEMPLATES.map(t => (
                        <button key={t.id} onClick={() => setBanner(p => ({ ...p, template: t.id }))} style={{
                          flex: 1, padding: '0.5rem', borderRadius: '8px', cursor: 'pointer',
                          border: banner.template === t.id ? `2px solid ${C.accent}` : `1px solid ${C.borderSub}`,
                          background: t.bg, color: t.textColor, fontSize: '0.62rem', fontWeight: 600,
                          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                          transform: banner.template === t.id ? 'scale(1.04)' : 'scale(1)',
                        }}>{t.name}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.7rem', fontWeight: 600, color: C.text2, marginBottom: '0.4rem', display: 'block' }}>{L.banSize}</label>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {BANNER_SIZES.map(s => (
                        <button key={s.id} onClick={() => setBanner(p => ({ ...p, size: s.id }))} style={{
                          flex: 1, padding: '0.45rem 0.6rem', borderRadius: '7px', cursor: 'pointer',
                          border: banner.size === s.id ? `2px solid ${C.accent}` : `1px solid ${C.borderSub}`,
                          background: banner.size === s.id ? C.accentGhost : 'transparent',
                          color: C.text2, fontSize: '0.65rem', fontWeight: 600,
                          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}>
                          <div>{s.label}</div>
                          <div style={{ fontSize: '0.55rem', color: C.textM, marginTop: 2 }}>{s.w}x{s.h}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <FormField label={L.banTitle} value={banner.title} onChange={e => setBanner(p => ({ ...p, title: e.target.value }))} placeholder={stg.companyName} />
                  <FormField label={L.banSub} value={banner.subtitle} onChange={e => setBanner(p => ({ ...p, subtitle: e.target.value }))} placeholder={stg.slogan} />
                  <Btn onClick={downloadBanner} primary icon={Download}>{L.banDl}</Btn>
                </GlassCard>
              </div>
              <div className="sig-right" style={{ flex: 1, minWidth: 0, animation: 'slideInRight 0.4s ease-out' }}>
                <GlassCard accent>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.85rem' }}>
                    <Eye size={15} style={{ color: C.accent }} />
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: C.primary, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>{L.banPrev}</span>
                  </div>
                  <canvas ref={canvasRef} style={{ width: '100%', height: 'auto', borderRadius: '8px', border: `1px solid ${C.borderSub}`, display: 'block' }} />
                </GlassCard>
              </div>
            </div>
          </div>
        )}

        {/* ═══ SETTINGS MODAL ═══ */}
        {tab === 'settings' && (<>
          {/* Backdrop */}
          <div onClick={() => setTab('signature')} style={{
            position: 'fixed', inset: 0, zIndex: 900,
            background: 'rgba(15,25,40,0.35)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.25s ease',
          }} />
          {/* Modal */}
          <div className="settings-modal" style={{
            position: 'fixed', zIndex: 901, top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '92vw', maxWidth: 720, height: '70vh',
            background: C.surfaceSolid, borderRadius: 18,
            boxShadow: '0 24px 80px rgba(15,25,40,0.25), 0 8px 24px rgba(15,25,40,0.12)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            animation: 'fadeIn 0.2s ease',
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex', alignItems: 'center', padding: '1rem 1.25rem',
              borderBottom: `1px solid ${C.borderSub}`,
              background: `linear-gradient(180deg, #fff, ${C.bgFlat})`,
            }}>
              <Settings size={16} style={{ color: C.accent, marginRight: '0.5rem' }} />
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: C.primary, fontFamily: 'Plus Jakarta Sans,sans-serif', flex: 1 }}>{L.setTab}</span>
              <button onClick={() => setTab('signature')} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 28, height: 28, borderRadius: 8, border: `1px solid ${C.borderSub}`,
                background: 'transparent', cursor: 'pointer', color: C.textM,
                transition: 'all 0.2s',
              }}><X size={14} /></button>
            </div>

            {/* Modal Tabs — Apple Segment Control */}
            {(() => {
              const stIds = ['logo', 'company', 'signature', 'style', 'social'];
              const stItems = [
                { id: 'logo', icon: Image, label: L.sTabLogo },
                { id: 'company', icon: Home, label: L.sTabCompany },
                { id: 'signature', icon: Eye, label: L.sTabSig },
                { id: 'style', icon: Star, label: L.sTabStyle },
                { id: 'social', icon: Globe, label: L.sTabSocial },
              ];
              return (
                <div style={{
                  padding: '0.6rem 1.25rem', borderBottom: `1px solid ${C.borderSub}`,
                }}>
                  <div className="settings-tabs-inner" style={{
                    position: 'relative', display: 'flex', gap: '2px',
                    background: 'transparent', borderRadius: 10, padding: 3,
                  }}>
                    {/* Sliding highlight */}
                    <span style={{
                      position: 'absolute', top: 3, bottom: 3,
                      left: `calc(${stIds.indexOf(settingsTab)} * 20% + 3px)`,
                      width: 'calc(20% - 2px)',
                      background: '#fff', borderRadius: 8,
                      boxShadow: '0 1px 3px rgba(30,58,95,0.1), 0 1px 2px rgba(30,58,95,0.06)',
                      transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }} />
                    {stItems.map(t => {
                      const act = settingsTab === t.id;
                      return (
                        <button className="settings-tab-btn" key={t.id} onClick={() => setSettingsTab(t.id)} style={{
                          position: 'relative', zIndex: 1, flex: 1,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
                          padding: '0.38rem 0.4rem', borderRadius: 7, border: 'none', cursor: 'pointer',
                          background: 'transparent',
                          color: act ? C.primary : C.text2,
                          fontSize: '0.66rem', fontWeight: act ? 700 : 500, fontFamily: 'Inter,sans-serif',
                          transition: 'color 0.25s ease',
                        }}>
                          <t.icon size={11} style={{ color: act ? C.accent : C.textM, transition: 'color 0.25s' }} />{t.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Modal Content — flex fills remaining height, no resize on tab switch */}
            <div className="settings-content" style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>

              {/* ── LOGO TAB ── */}
              {settingsTab === 'logo' && (
                <div style={{ animation: 'fadeIn 0.2s ease' }}>
                  {stg.logoBase64 ? (
                    <div style={{
                      display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '0.9rem',
                      background: C.primaryGhost, borderRadius: '10px', border: `1px solid ${C.borderSub}`, flexWrap: 'wrap',
                    }}>
                      <div style={{ padding: '0.5rem', borderRadius: '8px', border: `1px solid ${C.borderSub}`, background: '#fff' }}>
                        <img src={stg.logoBase64} alt="Logo" style={{ maxWidth: 160, maxHeight: 60, display: 'block' }} />
                      </div>
                      <div>
                        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: C.text1, marginBottom: '0.4rem' }}>{stg.logoW}x{stg.logoH}px</p>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                          {[{ label: L.lw, value: stg.logoW, key: 'logoW', min: 20, max: 300 }, { label: L.llh, value: stg.logoH, key: 'logoH', min: 10, max: 150 }].map(({ label, value, key, min, max }) => (
                            <div key={key}>
                              <label style={{ fontSize: '0.55rem', color: C.textM, display: 'block', marginBottom: 2 }}>{label}</label>
                              <input type="number" value={value} min={min} max={max}
                                onChange={e => { const v = parseInt(e.target.value) || (key === 'logoW' ? 100 : 50); setStg(p => ({ ...p, [key]: v })); }}
                                style={{ width: 64, padding: '0.25rem 0.4rem', border: `1px solid ${C.borderSub}`, borderRadius: '6px', fontSize: '0.72rem', boxSizing: 'border-box', background: '#fff', color: C.text1 }}
                              />
                            </div>
                          ))}
                        </div>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button onClick={() => fRef.current?.click()} style={{ padding: '0.35rem 0.6rem', borderRadius: '6px', border: `1px solid ${C.borderSub}`, background: '#fff', cursor: 'pointer', fontSize: '0.62rem', color: C.text2, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Upload size={10} /> {L.lch}
                          </button>
                          <button onClick={() => { setStg(p => ({ ...p, logoBase64: DEFAULT_LOGO_BASE64, logoW: 140, logoH: 45 })); toast(L.lr, 'info'); }} style={{ padding: '0.35rem 0.6rem', borderRadius: '6px', border: `1px solid ${C.borderSub}`, background: 'transparent', cursor: 'pointer', fontSize: '0.62rem', color: C.text2, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <RefreshCw size={10} /> {L.lr}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div onClick={() => fRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); if (e.dataTransfer.files?.[0]) procLogo(e.dataTransfer.files[0]); }}
                      style={{ border: `2px dashed ${C.accent}50`, borderRadius: '12px', padding: '2.5rem', textAlign: 'center', cursor: 'pointer', background: C.accentGhost }}>
                      <Upload size={28} style={{ color: C.accent, marginBottom: '0.5rem', opacity: 0.7 }} />
                      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: C.text1 }}>{L.lub}</p>
                      <p style={{ fontSize: '0.62rem', color: C.textM, marginTop: '0.2rem' }}>{L.lh}</p>
                    </div>
                  )}
                  <input ref={fRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) procLogo(e.target.files[0]); }} />
                </div>
              )}

              {/* ── COMPANY TAB ── */}
              {settingsTab === 'company' && (
                <div style={{ animation: 'fadeIn 0.2s ease' }}>
                  <FormField label={L.cn} value={stg.companyName} onChange={e => setStg(p => ({ ...p, companyName: e.target.value }))} />
                  <div className="company-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <FormField label={L.ws} value={stg.website} onChange={e => setStg(p => ({ ...p, website: e.target.value }))} />
                    <FormField label={L.sl} value={stg.slogan} onChange={e => setStg(p => ({ ...p, slogan: e.target.value }))} />
                  </div>
                  <div className="settings-color-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
                    {[{ label: L.lc, key: 'logoColor', value: stg.logoColor }, { label: L.ac, key: 'accentColor', value: stg.accentColor }].map(({ label, key, value }) => (
                      <div key={key}>
                        <label style={{ fontSize: '0.7rem', fontWeight: 600, color: C.text2, marginBottom: '0.3rem', display: 'block' }}>{label}</label>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <div style={{ width: 28, height: 28, borderRadius: 6, overflow: 'hidden', border: `2px solid ${C.borderSub}`, position: 'relative' }}>
                            <input type="color" value={value} onChange={e => debouncedColor(key, e.target.value, setStg)}
                              style={{ width: 44, height: 44, border: 'none', cursor: 'pointer', position: 'absolute', top: -7, left: -7 }} />
                          </div>
                          <span style={{ fontSize: '0.72rem', color: C.text2, fontFamily: 'monospace' }}>{value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── SIGNATURE OPTIONS TAB ── */}
              {settingsTab === 'signature' && (
                <div style={{ animation: 'fadeIn 0.2s ease' }}>
                  <ToggleSwitch label={L.showSDN} checked={stg.showSDN} onChange={v => setStg(p => ({ ...p, showSDN: v }))} />
                  <ToggleSwitch label={L.showFax} checked={stg.showFax} onChange={v => setStg(p => ({ ...p, showFax: v }))} />
                  <ToggleSwitch label={L.showAddr} checked={stg.showAddress} onChange={v => setStg(p => ({ ...p, showAddress: v }))} />

                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: `1px solid ${C.borderSub}` }}>
                    <ToggleSwitch label={L.showRB} checked={stg.showRightBlock} onChange={v => setStg(p => ({ ...p, showRightBlock: v }))} />
                    {stg.showRightBlock && (
                      <div style={{ paddingLeft: '1rem', borderLeft: `2px solid ${C.accent}30`, marginLeft: '0.25rem', marginTop: '0.25rem', animation: 'fadeIn 0.2s ease' }}>
                        <ToggleSwitch label={L.showLi} checked={stg.showLinkedin} onChange={v => setStg(p => ({ ...p, showLinkedin: v }))} />
                        <ToggleSwitch label={L.showTw} checked={stg.showTwitter} onChange={v => setStg(p => ({ ...p, showTwitter: v }))} />
                        <ToggleSwitch label={L.showFb} checked={stg.showFacebook} onChange={v => setStg(p => ({ ...p, showFacebook: v }))} />
                        <ToggleSwitch label={L.showIg} checked={stg.showInstagram} onChange={v => setStg(p => ({ ...p, showInstagram: v }))} />
                        <ToggleSwitch label={L.showWs} checked={stg.showWebsite} onChange={v => setStg(p => ({ ...p, showWebsite: v }))} />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── STYLE TAB (expanded with new color pickers) ── */}
              {settingsTab === 'style' && (
                <div style={{ animation: 'fadeIn 0.2s ease' }}>
                  {/* Existing: Divider & Right Block */}
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: C.primary, marginBottom: '0.6rem' }}>{L.sigStyle}</p>
                  <div className="settings-color-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.2rem' }}>
                    {[
                      { label: L.divColor, key: 'dividerColor', value: stg.dividerColor },
                      { label: L.rbBg, key: 'rightBlockBg', value: stg.rightBlockBg },
                    ].map(({ label, key, value }) => (
                      <div key={key}>
                        <label style={{ fontSize: '0.67rem', fontWeight: 600, color: C.text2, marginBottom: '0.3rem', display: 'block' }}>{label}</label>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <div style={{ width: 28, height: 28, borderRadius: 6, overflow: 'hidden', border: `2px solid ${C.borderSub}`, position: 'relative' }}>
                            <input type="color" value={value} onChange={e => debouncedColor(key, e.target.value, setStg)}
                              style={{ width: 42, height: 42, border: 'none', cursor: 'pointer', position: 'absolute', top: -7, left: -7 }} />
                          </div>
                          <span style={{ fontSize: '0.65rem', color: C.text2, fontFamily: 'monospace' }}>{value}</span>
                        </div>
                      </div>
                    ))}
                    <div>
                      <label style={{ fontSize: '0.67rem', fontWeight: 600, color: C.text2, marginBottom: '0.4rem', display: 'block' }}>{L.divWidth}: {stg.dividerWidth}px</label>
                      <input type="range" min={1} max={5} value={stg.dividerWidth}
                        onChange={e => setStg(p => ({ ...p, dividerWidth: parseInt(e.target.value) }))}
                        style={{ width: '100%', accentColor: C.accent, cursor: 'pointer' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.67rem', fontWeight: 600, color: C.text2, marginBottom: '0.4rem', display: 'block' }}>{L.rbRadius}: {stg.rightBlockRadius}px</label>
                      <input type="range" min={0} max={12} value={stg.rightBlockRadius}
                        onChange={e => setStg(p => ({ ...p, rightBlockRadius: parseInt(e.target.value) }))}
                        style={{ width: '100%', accentColor: C.accent, cursor: 'pointer' }} />
                    </div>
                  </div>

                  {/* NEW: Signature Text Colors */}
                  <div style={{ borderTop: `1px solid ${C.borderSub}`, paddingTop: '1rem', marginBottom: '1.2rem' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, color: C.primary, marginBottom: '0.6rem' }}>{L.textColorsTitle}</p>
                    <div className="settings-color-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.85rem' }}>
                      {[
                        { label: L.nameColorL, key: 'nameColor', value: stg.nameColor },
                        { label: L.titleColorL, key: 'titleColor', value: stg.titleColor },
                        { label: L.companyColorL, key: 'companyTextColor', value: stg.companyTextColor },
                        { label: L.labelColorL, key: 'contactLabelColor', value: stg.contactLabelColor },
                        { label: L.valueColorL, key: 'contactValueColor', value: stg.contactValueColor },
                      ].map(({ label, key, value }) => (
                        <div key={key}>
                          <label style={{ fontSize: '0.63rem', fontWeight: 600, color: C.text2, marginBottom: '0.3rem', display: 'block' }}>{label}</label>
                          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                            <div style={{ width: 28, height: 28, borderRadius: 6, overflow: 'hidden', border: `2px solid ${C.borderSub}`, position: 'relative' }}>
                              <input type="color" value={value} onChange={e => debouncedColor(key, e.target.value, setStg)}
                                style={{ width: 40, height: 40, border: 'none', cursor: 'pointer', position: 'absolute', top: -7, left: -7 }} />
                            </div>
                            <span style={{ fontSize: '0.6rem', color: C.text2, fontFamily: 'monospace' }}>{value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* NEW: Banner Colors */}
                  <div style={{ borderTop: `1px solid ${C.borderSub}`, paddingTop: '1rem' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, color: C.primary, marginBottom: '0.6rem' }}>{L.bannerColorsTitle}</p>
                    <div>
                      <label style={{ fontSize: '0.63rem', fontWeight: 600, color: C.text2, marginBottom: '0.3rem', display: 'block' }}>{L.bannerAccentL}</label>
                      <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                        <div style={{ width: 28, height: 28, borderRadius: 6, overflow: 'hidden', border: `2px solid ${C.borderSub}`, position: 'relative' }}>
                          <input type="color" value={stg.bannerAccentColor || '#c8922a'} onChange={e => debouncedColor('bannerAccentColor', e.target.value, setStg)}
                            style={{ width: 40, height: 40, border: 'none', cursor: 'pointer', position: 'absolute', top: -7, left: -7 }} />
                        </div>
                        <span style={{ fontSize: '0.6rem', color: C.text2, fontFamily: 'monospace' }}>{stg.bannerAccentColor || 'auto'}</span>
                        {stg.bannerAccentColor && (
                          <button onClick={() => setStg(p => ({ ...p, bannerAccentColor: '' }))} style={{
                            fontSize: '0.55rem', color: C.textM, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline',
                          }}>reset</button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── SOCIAL TAB ── */}
              {settingsTab === 'social' && (
                <div style={{ animation: 'fadeIn 0.2s ease' }}>
                  <div className="social-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.75rem' }}>
                    {[
                      { icon: Linkedin, label: 'LinkedIn', key: 'linkedin' },
                      { icon: Twitter, label: 'X (Twitter)', key: 'twitter' },
                      { icon: Facebook, label: 'Facebook', key: 'facebook' },
                      { icon: Instagram, label: 'Instagram', key: 'instagram' },
                    ].map(({ icon, label, key }) => (
                      <FormField key={key} label={label} value={stg.social[key]}
                        onChange={e => setStg(p => ({ ...p, social: { ...p.social, [key]: e.target.value } }))} />
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </>)}
      </main>

      {/* ═══════ FOOTER ═══════ */}
      <footer style={{ textAlign: 'center', padding: '0.6rem 2rem', borderTop: `1px solid ${C.borderSub}`, background: C.glassSolid }}>
        <p style={{ fontSize: '0.6rem', color: C.textM, margin: 0 }}>
          Powered by <span style={{ fontWeight: 700, color: C.text2 }}>TTECH Business Solutions</span>
          {' '}&middot;{' '}&copy; {new Date().getFullYear()} Tiryaki Agro
        </p>
      </footer>

      {/* ═══════ TOASTS ═══════ */}
      <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            animation: 'toastIn 0.25s ease-out',
            padding: '0.55rem 1rem', borderRadius: '9px',
            background: t.type === 'success' ? C.ok : t.type === 'err' ? C.err : C.info,
            color: '#fff', fontSize: '0.72rem', fontWeight: 600,
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', gap: '0.4rem',
          }}>
            <Check size={13} />{t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
