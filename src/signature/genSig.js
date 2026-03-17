import { escapeHtml, sanitizeUrl, titleCase, formatGSM } from '../utils/formatting';
import { linkedinBlueSvg } from '../icons/svgDataUris';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CLASSIC SIGNATURE GENERATOR (parametric)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const genSig = (f, s, office, sigBanner) => {
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
  if (f.gsm) rows.push(mkRow('GSM', escapeHtml(formatGSM(f.gsm))));
  if (f.email) rows.push(mkRow('Mail', `<a href="mailto:${escapeHtml(f.email)}" style="color:${s.accentColor};text-decoration:none;">${escapeHtml(f.email)}</a>`));
  if (s.showAddress && office) rows.push(mkRow('Adres', `<span style="white-space:nowrap">${escapeHtml(office.address)}</span><br/>${escapeHtml(office.city)}`));

  const divC = s.dividerColor || s.accentColor;
  const divW = s.dividerWidth || 3;

  // Footer links: website + LinkedIn (plain text, left-aligned below logo)
  const linkedinUrl = sanitizeUrl((f.linkedinPersonal && f.linkedinPersonal.trim()) || s.social.linkedin);
  const linkedinHandle = linkedinUrl ? linkedinUrl.replace(/https?:\/\/(www\.)?linkedin\.com\/(company\/|in\/)?/i, '').replace(/\/$/, '') : '';
  const footerLinkC = s.contactLabelColor || '#808285';

  const footerLinks = [];
  if (s.showWebsite !== false && s.website) {
    const displayUrl = s.website.replace(/^www\./i, '');
    footerLinks.push(`<a href="https://${s.website}" style="color:${footerLinkC};font-size:11px;text-decoration:none;font-style:italic;font-weight:bold;vertical-align:baseline;">${displayUrl}</a>`);
  }
  if (s.showLinkedin !== false && linkedinUrl) {
    footerLinks.push(`<a href="${linkedinUrl}" target="_blank" style="text-decoration:none;vertical-align:baseline;"><img src="${linkedinBlueSvg}" width="14" height="14" alt="in" style="vertical-align:-2px;border:0;margin-right:3px;" /><span style="color:${footerLinkC};font-size:11px;font-style:italic;font-weight:bold;vertical-align:baseline;">${linkedinHandle || 'LinkedIn'}</span></a>`);
  }

  const logoOffset = (s.logoLeftOffset || 0) + 6;
  const socialBlock = footerLinks.length > 0
    ? `<div style="margin-top:8px;line-height:18px;white-space:nowrap;${logoOffset > 0 ? `padding-left:${logoOffset}px;` : ''}">${footerLinks.join('&nbsp;&nbsp;&nbsp;')}</div>`
    : '';

  // Responsive email signature CSS
  const sigCSS = `<style>@media screen and (max-width:480px){.sig-table{width:100%!important}.sig-logo,.sig-divider,.sig-info{display:block!important;width:100%!important;text-align:center!important;padding:4px 0!important}.sig-logo{padding-bottom:8px!important}.sig-divider{height:2px!important;width:50%!important;margin:4px auto!important;background:${divC}!important}.sig-info{padding:8px 0!important}.sig-info table{margin:0 auto!important}}</style>`;

  return sigCSS +
    `<table class="sig-table" cellpadding="0" cellspacing="0" border="0" width="680" style="width:100%; max-width:680px; font-family:Arial,sans-serif; border-collapse:collapse;"><tr>` +
    `<td class="sig-logo" style="vertical-align:top;padding:8px 14px 8px 0;white-space:nowrap;">${logo}${socialBlock}</td>` +
    `<td class="sig-divider" style="width:${divW}px;background:${divC};font-size:0;">&nbsp;</td>` +
    `<td class="sig-info" width="100%" style="width:100%; vertical-align:top; padding:6px 14px;">` +
      `<table cellpadding="0" cellspacing="0" border="0">` +
        `<tr><td colspan="3" style="padding:0 0 1px;"><strong style="font-size:15px;color:${s.nameColor || s.logoColor};">${name || 'Ad SOYAD'}</strong></td></tr>` +
        (title ? `<tr><td colspan="3" style="padding:0 0 4px;"><span style="font-size:12px;color:${s.titleColor || s.accentColor};font-style:italic;">${title}</span></td></tr>` : '') +
        `<tr><td colspan="3" style="padding:0 0 7px;"><strong style="font-size:12px;color:${s.companyTextColor || '#333'};">${company}</strong></td></tr>` +
        rows.join('') +
      `</table>` +
    `</td>` +
    `</tr>` +
    (sigBanner?.enabled && sigBanner?.base64
      ? `<tr><td colspan="3" style="padding-top:10px;">` +
        (sigBanner.linkUrl ? `<a href="${sanitizeUrl(sigBanner.linkUrl)}" target="_blank" style="text-decoration:none;">` : '') +
        `<img src="${sigBanner.base64}" width="680" alt="${escapeHtml(sigBanner.alt || 'Banner')}" style="display:block; border:0; width:100%; height:auto;" />` +
        (sigBanner.linkUrl ? '</a>' : '') +
        `</td></tr>`
      : '') +
    `</table>`;
};
