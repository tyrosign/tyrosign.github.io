import { escapeHtml, sanitizeUrl, titleCase, formatGSM } from '../utils/formatting';
import { phoneIconSvg, mobileIconSvg, linkedinBlueSvg } from '../icons/svgDataUris';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CORPORATE SIGNATURE GENERATOR (PDF design - wave band)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const genSigCorporate = (f, s, office, sigBanner) => {
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

  // Build contact rows inside the band
  let bandRows = '';
  if (s.showAddress !== false && office) {
    bandRows += `<div style="font-size:11px;line-height:1.6;margin-bottom:8px;color:rgba(255,255,255,0.92);"><span style="white-space:nowrap">${escapeHtml(office.address)}</span><br/>${escapeHtml(office.city)}</div>`;
  }
  const phones = [];
  if (f.gsm) phones.push(`<img src="${mobileIconSvg}" width="13" height="13" alt="" style="vertical-align:middle;border:0;margin-right:3px;" /><span style="vertical-align:middle;">${escapeHtml(formatGSM(f.gsm))}</span>`);
  if (s.showSDN !== false && office?.sdn) phones.push(`<img src="${phoneIconSvg}" width="13" height="13" alt="" style="vertical-align:middle;border:0;margin-right:3px;" /><span style="vertical-align:middle;">${escapeHtml(office.sdn)}</span>`);
  if (phones.length > 0) {
    bandRows += `<div style="font-size:11px;margin-bottom:4px;color:rgba(255,255,255,0.92);white-space:nowrap;">${phones.join('&nbsp;&nbsp;&nbsp;')}</div>`;
  }
  if (f.email) {
    bandRows += `<div style="font-size:11px;color:rgba(255,255,255,0.92);"><a href="mailto:${escapeHtml(f.email)}" style="color:#fff;text-decoration:none;">@ ${escapeHtml(f.email)}</a></div>`;
  }

  // Footer: website + LinkedIn
  const footerC = s.contactLabelColor || '#808285';
  const websiteDisplay = s.website ? s.website.replace(/^www\./i, '') : '';
  let footerItems = [];
  if (s.showWebsite !== false && websiteDisplay) footerItems.push(`<a href="https://${s.website}" style="color:${footerC};font-size:11px;text-decoration:none;font-style:italic;font-weight:bold;vertical-align:baseline;">${websiteDisplay}</a>`);
  if (s.showLinkedin !== false && linkedinUrl) footerItems.push(`<a href="${linkedinUrl}" target="_blank" style="text-decoration:none;vertical-align:baseline;"><img src="${linkedinBlueSvg}" width="14" height="14" alt="in" style="vertical-align:-2px;border:0;margin-right:4px;" /><span style="color:${footerC};font-size:11px;font-style:italic;font-weight:bold;vertical-align:baseline;">${linkedinHandle || 'LinkedIn'}</span></a>`);
  const footer = footerItems.length > 0 ? `<div style="line-height:16px;white-space:nowrap;">${footerItems.join('&nbsp;&nbsp;&nbsp;')}</div>` : '';

  return `<table class="sig-corp-table" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px; max-width:600px; font-family:Arial,sans-serif; border-collapse:collapse;">` +
    `<tr>` +
    `<td class="sig-corp-logo" style="vertical-align:top;padding:34px 50px 0 0;">` +
      logo +
    `</td>` +
    `<td class="sig-corp-band" rowspan="${footer ? '2' : '1'}" style="vertical-align:top;background-color:${rbBg};padding:0;border-top-left-radius:130px;">` +
      `<div style="padding:22px 24px 18px 105px;color:#fff;">` +
        `<div style="font-size:16px;font-weight:bold;margin-bottom:1px;color:#fff;">${name || 'Ad SOYAD'}</div>` +
        (titleEN ? `<div style="font-size:12px;margin-bottom:0;color:rgba(255,255,255,0.85);font-style:italic;">${titleEN}</div>` : '') +
        (titleTR ? `<div style="font-size:12px;margin-bottom:10px;color:rgba(255,255,255,0.85);font-style:italic;">${titleTR}</div>` : '<div style="margin-bottom:10px;"></div>') +
        bandRows +
      `</div>` +
    `</td>` +
    `</tr>` +
    (footer ? `<tr><td style="vertical-align:bottom;padding:0 0 18px 0;"><div style="text-align:left;line-height:16px;white-space:nowrap;${(s.logoLeftOffset || 0) + 6 > 0 ? `padding-left:${(s.logoLeftOffset || 0) + 6}px;` : ''}">${footerItems.join('&nbsp;&nbsp;&nbsp;')}</div></td></tr>` : '') +
    (sigBanner?.enabled && sigBanner?.base64
      ? `<tr><td colspan="2" style="padding-top:10px;">` +
        (sigBanner.linkUrl ? `<a href="${sanitizeUrl(sigBanner.linkUrl)}" target="_blank" style="text-decoration:none;">` : '') +
        `<img src="${sigBanner.base64}" width="600" alt="${escapeHtml(sigBanner.alt || 'Banner')}" style="display:block; border:0; width:100%; height:auto;" />` +
        (sigBanner.linkUrl ? '</a>' : '') +
        `</td></tr>`
      : '') +
    `</table>`;
};
