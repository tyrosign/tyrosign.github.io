import { escapeHtml, sanitizeUrl, titleCase, formatGSM } from '../utils/formatting';
import { phoneIconSvg, mobileIconSvg, linkedinBlueSvg } from '../icons/svgDataUris';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CLASSIC SIGNATURE GENERATOR
// Corporate tasarımın YATAY + DİKDÖRTGEN (kavissiz) + ESKİ-OUTLOOK UYUMLU versiyonu.
// Word motoru (Outlook 2007-2021) uyumu için:
//   • border-radius YOK   • rgba() YOK (hepsi solid hex)   • SVG YOK (PNG ikon)
//   • yerleşim tablo tabanlı, yazı satırları iç tablo ile (Word-safe boşluk)
// Kurumsal tasarımın eski Outlook fallback'i olarak da bu kullanılır.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const genSig = (f, s, office, sigBanner) => {
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
  const linkedinHandle = linkedinUrl ? linkedinUrl.replace(/https?:\/\/(www\.)?linkedin\.com\/(company\/|in\/)?/i, '').replace(/\/$/, '').replace(/-/g, '') : '';

  // Solid renkler (Outlook-safe — rgba yerine düz hex)
  const cName = '#ffffff';   // isim
  const cSub = '#c9d3df';    // ünvanlar
  const cText = '#e6ebf1';   // adres / telefon / mail

  // ── Bant içi metin satırları (iç tablo → Word'de güvenilir satır boşluğu) ──
  const bandLines = [];
  bandLines.push(`<tr><td style="padding:0 0 1px;font-size:15px;font-weight:bold;color:${cName};font-family:Arial,sans-serif;line-height:1.25;">${name || 'Ad SOYAD'}</td></tr>`);
  if (titleEN) bandLines.push(`<tr><td style="padding:0;font-size:11px;color:${cSub};font-style:italic;font-family:Arial,sans-serif;line-height:1.4;">${titleEN}</td></tr>`);
  if (titleTR) bandLines.push(`<tr><td style="padding:0;font-size:11px;color:${cSub};font-style:italic;font-family:Arial,sans-serif;line-height:1.4;">${titleTR}</td></tr>`);
  bandLines.push(`<tr><td style="font-size:0;line-height:8px;height:8px;">&nbsp;</td></tr>`);
  if (s.showAddress !== false && office) {
    bandLines.push(`<tr><td style="padding:0 0 5px;font-size:11px;color:${cText};font-family:Arial,sans-serif;line-height:1.45;">${escapeHtml(office.address)}, ${escapeHtml(office.city)}</td></tr>`);
  }
  const phones = [];
  if (f.gsm) phones.push(`<img src="${mobileIconSvg}" width="12" height="12" alt="" style="vertical-align:middle;border:0;margin-right:3px;" /><span style="vertical-align:middle;">${escapeHtml(formatGSM(f.gsm))}</span>`);
  if (s.showSDN !== false && office?.sdn) phones.push(`<img src="${phoneIconSvg}" width="12" height="12" alt="" style="vertical-align:middle;border:0;margin-right:3px;" /><span style="vertical-align:middle;">${escapeHtml(office.sdn)}</span>`);
  if (phones.length > 0) {
    bandLines.push(`<tr><td style="padding:0 0 4px;font-size:11px;color:${cText};font-family:Arial,sans-serif;white-space:nowrap;">${phones.join('&nbsp;&nbsp;&nbsp;')}</td></tr>`);
  }
  if (f.email) {
    bandLines.push(`<tr><td style="padding:0;font-size:11px;font-family:Arial,sans-serif;"><a href="mailto:${escapeHtml(f.email)}" style="color:${cName};text-decoration:none;">@&nbsp;${escapeHtml(f.email)}</a></td></tr>`);
  }

  // ── Footer (logonun altı, tam genişlik satırı): web sitesi + LinkedIn ──
  const footerC = s.contactLabelColor || '#808285';
  const websiteDisplay = s.website ? s.website.replace(/^www\./i, '') : '';
  const footerItems = [];
  if (s.showWebsite !== false && websiteDisplay) footerItems.push(`<a href="https://${s.website}" style="color:${footerC};font-size:11px;text-decoration:none;font-style:italic;font-weight:bold;">${websiteDisplay}</a>`);
  if (s.showLinkedin !== false && linkedinUrl) footerItems.push(`<a href="${linkedinUrl}" target="_blank" style="text-decoration:none;"><img src="${linkedinBlueSvg}" width="13" height="13" alt="in" style="vertical-align:-2px;border:0;margin-right:3px;" /><span style="color:${footerC};font-size:11px;font-style:italic;font-weight:bold;">${linkedinHandle || 'LinkedIn'}</span></a>`);
  // Footer içeriği (web + LinkedIn). Corporate gibi banda rowspan ile yaslanıp
  // bandın ALT hizasına oturur (aşağı sarkmaz).
  const hasFooter = footerItems.length > 0;
  const footer = hasFooter
    ? `<tr><td class="sigc-foot" style="vertical-align:bottom;padding:10px 0 2px 4px;line-height:16px;white-space:nowrap;">${footerItems.join('&nbsp;&nbsp;&nbsp;')}</td></tr>`
    : '';

  // Responsive: dar ekranda logo üste, bant tam genişliğe geçer
  const sigCSS = `<style>@media screen and (max-width:480px){.sigc-table{width:100%!important}.sigc-logo,.sigc-band,.sigc-foot{display:block!important;width:100%!important;box-sizing:border-box!important}.sigc-logo{text-align:center!important;padding:0 0 10px 0!important}.sigc-foot{text-align:center!important;padding:10px 0 0 0!important}}</style>`;

  return sigCSS +
    `<table class="sigc-table" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px; max-width:600px; font-family:Arial,sans-serif; border-collapse:collapse;">` +
    `<tr>` +
    `<td class="sigc-logo" style="vertical-align:top;padding:6px 24px 0 4px;">${logo}</td>` +
    `<td class="sigc-band" rowspan="${hasFooter ? '2' : '1'}" style="vertical-align:top;background-color:${rbBg};padding:16px 22px;">` +
      `<table cellpadding="0" cellspacing="0" border="0">${bandLines.join('')}</table>` +
    `</td>` +
    `</tr>` +
    footer +
    (sigBanner?.enabled && sigBanner?.base64
      ? `<tr><td colspan="2" style="padding-top:10px;">` +
        (sigBanner.linkUrl ? `<a href="${sanitizeUrl(sigBanner.linkUrl)}" target="_blank" style="text-decoration:none;">` : '') +
        `<img src="${sigBanner.base64}" width="600" alt="${escapeHtml(sigBanner.alt || 'Banner')}" style="display:block; border:0; width:100%; height:auto;" />` +
        (sigBanner.linkUrl ? '</a>' : '') +
        `</td></tr>`
      : '') +
    `</table>`;
};
