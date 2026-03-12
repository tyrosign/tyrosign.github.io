export const escapeHtml = (s) => s ? s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') : '';

export const sanitizeUrl = (url) => {
  if (!url) return '';
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    if (!['http:', 'https:'].includes(parsed.protocol)) return '';
    return parsed.href;
  } catch { return ''; }
};

export const titleCase = (str) => {
  if (!str) return '';
  return str.split(' ').map(w => w ? w.charAt(0).toLocaleUpperCase('tr-TR') + w.slice(1).toLocaleLowerCase('tr-TR') : w).join(' ');
};

export const formatGSM = (val) => {
  if (!val) return '';
  let cleaned = val.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('05')) cleaned = '+90' + cleaned;
  else if (cleaned.length === 10 && cleaned.startsWith('5')) cleaned = '+900' + cleaned;
  const match = cleaned.match(/^(\+90)?(0?)(\d{3})(\d{3})(\d{2})(\d{2})$/);
  if (match) return `+90 0${match[3]} ${match[4]} ${match[5]} ${match[6]}`;
  return val;
};
