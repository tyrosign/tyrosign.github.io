import { memo, useEffect, useRef, useCallback, useState } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, Download, FileDown, Share2, Upload } from 'lucide-react';
import { C } from '../constants/theme';
import { generateVCard } from '../utils/generateVCard';
import DEFAULT_LOGO_BASE64 from '../defaultLogo.js';

/** Get QR center logo — only companies whose NAME starts with Tiryaki/T-Tech get default logo */
function getQrLogo(stg, company) {
  const name = (company?.name || stg.companyName || '').toLowerCase().trim();
  if (name.startsWith('tiryaki') || name.startsWith('t-tech')) return DEFAULT_LOGO_BASE64;
  return stg.logoBase64;
}
import { formatGSM, titleCase } from '../utils/formatting';
// Background image lazy-loaded from public/ only when HTML download is triggered (saves ~710KB from bundle)
const BG_CARD_URL = (import.meta.env.BASE_URL || '/') + 'bg-card.jpg';
let _bgBase64Cache = null;
async function getBgBase64() {
  if (_bgBase64Cache) return _bgBase64Cache;
  try {
    const res = await fetch(BG_CARD_URL);
    const blob = await res.blob();
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => { _bgBase64Cache = reader.result; resolve(reader.result); };
      reader.readAsDataURL(blob);
    });
  } catch (e) { return ''; }
}

const NAVY = C.primary;
const GOLD = C.accent;
const BLUE = C.divider;

function formatName(form) {
  return [titleCase(form.firstName), titleCase(form.lastName)].filter(Boolean).join(' ') || '—';
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Draw QR with rounded dots instead of square modules.
 * Uses QRCode.create() for data matrix, then custom-renders circles.
 */
function drawRoundedQr(ctx, qrData, size, margin, darkColor, lightColor) {
  const modules = qrData.modules;
  const moduleCount = modules.size;
  const totalModules = moduleCount + margin * 2;
  const cellSize = size / totalModules;
  const dotRadius = cellSize * 0.42;

  // Fill background with rounded corners
  ctx.fillStyle = lightColor;
  ctx.beginPath();
  roundRect(ctx, 0, 0, size, size, size * 0.06);
  ctx.fill();

  // Navy-to-blue gradient for data dots (kept dark for scanner contrast)
  const dotGrad = ctx.createLinearGradient(0, 0, size, size);
  dotGrad.addColorStop(0, NAVY);
  dotGrad.addColorStop(0.5, '#1a4a6e');
  dotGrad.addColorStop(1, '#15607a');

  function isFinderPattern(row, col) {
    if (row < 7 && col < 7) return true;
    if (row < 7 && col >= moduleCount - 7) return true;
    if (row >= moduleCount - 7 && col < 7) return true;
    return false;
  }

  // Alignment pattern detection
  function isAlignmentCenter(r, c) {
    if (moduleCount < 25) return false;
    const positions = [];
    const ver = Math.floor((moduleCount - 17) / 4) + 1;
    if (ver >= 2) {
      const last = moduleCount - 7;
      const step = ver === 2 ? 0 : Math.round((last - 6) / (Math.ceil(ver / 7) + 1));
      const coords = [6];
      if (step > 0) { for (let p = last; p > 6; p -= step) coords.unshift(p); }
      else coords.push(last);
      for (const ar of coords) for (const ac of coords) {
        if ((ar === 6 && ac === 6) || (ar === 6 && ac === last) || (ar === last && ac === 6)) continue;
        positions.push([ar, ac]);
      }
    }
    return positions.some(([ar, ac]) => r === ar && c === ac);
  }

  function isAlignmentArea(r, c) {
    for (let dr = -2; dr <= 2; dr++) {
      for (let dc = -2; dc <= 2; dc++) {
        if (isAlignmentCenter(r - dr, c - dc)) return true;
      }
    }
    return false;
  }

  // Draw finder patterns with glow + gradient + gold center
  function drawFinderPattern(startRow, startCol) {
    const ox = (startCol + margin) * cellSize;
    const oy = (startRow + margin) * cellSize;
    const outerSize = 7 * cellSize;
    const innerSize = 3 * cellSize;
    const midSize = 5 * cellSize;
    const r = cellSize * 0.8;

    // Shadow glow
    ctx.save();
    ctx.shadowColor = 'rgba(30, 58, 95, 0.25)';
    ctx.shadowBlur = cellSize * 2;
    ctx.fillStyle = NAVY;
    ctx.beginPath();
    roundRect(ctx, ox, oy, outerSize, outerSize, r);
    ctx.fill();
    ctx.restore();

    // Outer ring with gradient
    ctx.fillStyle = dotGrad;
    ctx.beginPath();
    roundRect(ctx, ox, oy, outerSize, outerSize, r);
    ctx.fill();

    // White gap
    ctx.fillStyle = lightColor;
    ctx.beginPath();
    roundRect(ctx, ox + cellSize, oy + cellSize, midSize, midSize, r * 0.6);
    ctx.fill();

    // Inner square with gold accent
    ctx.fillStyle = GOLD;
    ctx.beginPath();
    roundRect(ctx, ox + 2 * cellSize, oy + 2 * cellSize, innerSize, innerSize, r * 0.4);
    ctx.fill();
  }

  drawFinderPattern(0, 0);
  drawFinderPattern(0, moduleCount - 7);
  drawFinderPattern(moduleCount - 7, 0);

  // Draw alignment patterns with matching style
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (isAlignmentCenter(row, col)) {
        const ox = (col - 2 + margin) * cellSize;
        const oy = (row - 2 + margin) * cellSize;
        const s = 5 * cellSize;
        const ar = cellSize * 0.6;
        ctx.fillStyle = dotGrad;
        ctx.beginPath();
        roundRect(ctx, ox, oy, s, s, ar);
        ctx.fill();
        ctx.fillStyle = lightColor;
        ctx.beginPath();
        roundRect(ctx, ox + cellSize, oy + cellSize, 3 * cellSize, 3 * cellSize, ar * 0.5);
        ctx.fill();
        ctx.fillStyle = GOLD;
        ctx.beginPath();
        ctx.arc((col + margin + 0.5) * cellSize, (row + margin + 0.5) * cellSize, cellSize * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Draw data modules as gradient dots with visual rhythm
  ctx.fillStyle = dotGrad;
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (isFinderPattern(row, col)) continue;
      if (isAlignmentArea(row, col)) continue;
      if (modules.get(row, col)) {
        const cx = (col + margin + 0.5) * cellSize;
        const cy = (row + margin + 0.5) * cellSize;
        const dist = Math.sqrt(Math.pow(cx - size / 2, 2) + Math.pow(cy - size / 2, 2)) / (size / 2);
        ctx.beginPath();
        ctx.arc(cx, cy, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

async function drawQrWithLogo(vcard, size, logoBase64) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const qrData = QRCode.create(vcard, { errorCorrectionLevel: 'H' });
  const ctx = canvas.getContext('2d');
  drawRoundedQr(ctx, qrData, size, 2, NAVY, '#ffffff');

  if (logoBase64) {
    const ctx = canvas.getContext('2d');
    try {
      const logoImg = await loadImage(logoBase64);
      const logoSize = Math.round(size * 0.22);
      const x = (size - logoSize) / 2;
      const y = (size - logoSize) / 2;
      const pad = 10;

      // White circle background
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, logoSize / 2 + pad, 0, Math.PI * 2);
      ctx.fill();

      // Draw logo preserving aspect ratio
      const aspect = logoImg.width / logoImg.height;
      let drawW = logoSize;
      let drawH = logoSize;
      if (aspect > 1) { drawH = logoSize / aspect; } else { drawW = logoSize * aspect; }
      const drawX = x + (logoSize - drawW) / 2;
      const drawY = y + (logoSize - drawH) / 2;
      ctx.drawImage(logoImg, drawX, drawY, drawW, drawH);
    } catch (e) { /* logo failed, QR still works */ }
  }

  return canvas;
}

/** Draw the Tiryaki corporate gradient background on canvas */
function drawGradientBg(ctx, W, H, radius) {
  ctx.save();
  ctx.beginPath();
  roundRect(ctx, 0, 0, W, H, radius);
  ctx.clip();

  const grad = ctx.createLinearGradient(0, 0, W * 0.3, H);
  grad.addColorStop(0, '#b8d4de');
  grad.addColorStop(0.25, '#8cc4d0');
  grad.addColorStop(0.5, '#4da8be');
  grad.addColorStop(0.75, '#3695b0');
  grad.addColorStop(1, '#2a7fa0');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  const wave = ctx.createRadialGradient(W * 0.35, H * 0.52, 0, W * 0.35, H * 0.52, W * 0.55);
  wave.addColorStop(0, 'rgba(180,215,80,0.35)');
  wave.addColorStop(0.3, 'rgba(100,210,160,0.2)');
  wave.addColorStop(0.6, 'rgba(60,190,190,0.1)');
  wave.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = wave;
  ctx.fillRect(0, 0, W, H);

  const highlight = ctx.createRadialGradient(W * 0.8, H * 0.15, 0, W * 0.8, H * 0.15, W * 0.4);
  highlight.addColorStop(0, 'rgba(200,230,240,0.2)');
  highlight.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = highlight;
  ctx.fillRect(0, 0, W, H);

  ctx.restore();
}

/** Wrap text to fit within maxWidth, returns array of lines */
function wrapText(ctx, text, maxWidth) {
  // First try measureText, with char-count fallback
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0] || '';
  for (let i = 1; i < words.length; i++) {
    const test = currentLine + ' ' + words[i];
    const measured = ctx.measureText(test).width;
    // Use both pixel measurement AND char-count safety
    if (measured <= maxWidth && test.length <= 45) {
      currentLine = test;
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }
  lines.push(currentLine);
  return lines;
}

/** Ellipsize text to fit within maxWidth on canvas */
function ellipsize(ctx, text, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth && text.length <= 50) return text;
  let t = text;
  while (t.length > 5 && (ctx.measureText(t + '...').width > maxWidth || t.length > 47)) {
    t = t.substring(0, t.length - 1);
  }
  return t + '...';
}

/**
 * Draws a premium digital business card canvas — Figma design
 * Dynamic height based on content
 */
async function drawBusinessCard(qrCanvas, form, stg, office, company, profileBase64, L, lang) {
  const W = 420;
  const RADIUS = 15;
  const PAD = 24; // horizontal padding for text

  const fullName = formatName(form);
  const companyName = (lang === 'en' && company && company.nameEN) ? company.nameEN : ((company && company.name) || stg.companyName || 'Tiryaki Agro');
  const titleText = [form.titleTR, form.titleEN].filter(Boolean).join(' / ');
  const hasTwoLines = !!titleText;

  // Build contact rows (use icon keys for matching, display labels from L)
  const contacts = [];
  if (form.gsm) contacts.push({ key: 'GSM', label: (L && L.bcLabelGSM) || 'GSM', value: formatGSM(form.gsm) });
  if (form.email) contacts.push({ key: 'Email', label: (L && L.bcLabelEmail) || 'E-Posta', value: form.email });
  if (office && office.address && office.city) {
    contacts.push({ key: 'Address', label: (L && L.bcLabelAddress) || 'Adres', value: office.address + ', ' + office.city });
  } else if (office && office.city) {
    contacts.push({ key: 'Location', label: (L && L.bcLabelLocation) || 'Konum', value: office.city });
  }

  // ── Pre-calculate heights to determine canvas size ──
  const logoRadius = 55;
  const logoCY = 120;
  let contentY = logoCY + logoRadius + 40; // after name (extra gap below logo)
  contentY += 26; // company line
  if (hasTwoLines) contentY += 20; // title line
  contentY += 30; // gap before QR
  const qrContainerSize = 220;
  contentY += qrContainerSize; // QR block
  contentY += 25; // gap before panel

  const panelW = 370;
  const rowH = 52;
  const rowHWrap = 68; // taller row for wrapped address text
  // Pre-calc panel height: address rows get extra height
  let panelH = 12;
  contacts.forEach(c => {
    panelH += (c.key === 'Address') ? rowHWrap : rowH;
  });
  contentY += panelH;
  contentY += 40; // bottom padding

  const H = Math.max(780, contentY);

  // 2x resolution for sharp/Retina output
  const SCALE = 2;
  const canvas = document.createElement('canvas');
  canvas.width = W * SCALE;
  canvas.height = H * SCALE;
  const ctx = canvas.getContext('2d');
  ctx.scale(SCALE, SCALE);

  drawGradientBg(ctx, W, H, RADIUS);

  // ── Circular avatar (profile photo or logo) ──
  const avatarSrc = profileBase64 || stg.logoBase64;
  if (avatarSrc) {
    try {
      const avatarImg = await loadImage(avatarSrc);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(W / 2, logoCY, logoRadius + 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.save();
      ctx.beginPath();
      ctx.arc(W / 2, logoCY, logoRadius, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(W / 2 - logoRadius, logoCY - logoRadius, logoRadius * 2, logoRadius * 2);
      if (profileBase64) {
        // Profile photo: cover the entire circle
        const aspect = avatarImg.width / avatarImg.height;
        let drawW, drawH;
        if (aspect > 1) { drawH = logoRadius * 2; drawW = drawH * aspect; }
        else { drawW = logoRadius * 2; drawH = drawW / aspect; }
        ctx.drawImage(avatarImg, W / 2 - drawW / 2, logoCY - drawH / 2, drawW, drawH);
      } else {
        // Logo: contain within circle
        const aspect = avatarImg.width / avatarImg.height;
        let drawW = logoRadius * 1.5;
        let drawH = drawW / aspect;
        if (drawH > logoRadius * 1.5) { drawH = logoRadius * 1.5; drawW = drawH * aspect; }
        ctx.drawImage(avatarImg, W / 2 - drawW / 2, logoCY - drawH / 2, drawW, drawH);
      }
      ctx.restore();
    } catch (e) { /* skip avatar */ }
  }

  // ── Name + LinkedIn icon ──
  let y = logoCY + logoRadius + 40;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px "Plus Jakarta Sans", "Inter", Arial, sans-serif';
  ctx.shadowColor = 'rgba(0,0,0,0.2)';
  ctx.shadowBlur = 6;
  const nameW = ctx.measureText(fullName).width;
  const hasLinkedin = !!form.linkedinPersonal;
  const liIconSize = 18;
  const liGap = 6;
  const totalNameW = nameW + (hasLinkedin ? liGap + liIconSize : 0);
  const nameX = (W - totalNameW) / 2 + nameW / 2;
  ctx.fillText(fullName, nameX, y);
  ctx.shadowBlur = 0;

  // LinkedIn icon next to name (canvas — not clickable but visual)
  if (hasLinkedin) {
    const liX = nameX + nameW / 2 + liGap;
    const liY = y - liIconSize + 3;
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    const p = new Path2D('M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z');
    ctx.translate(liX, liY);
    ctx.scale(liIconSize / 24, liIconSize / 24);
    ctx.fill(p);
    ctx.restore();
  }

  // ── Company name (line 1) ──
  y += 26;
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = '600 16px "Inter", Arial, sans-serif';
  ctx.fillText(companyName, W / 2, y);

  // ── Titles (line 2, wrapped if too long) ──
  if (hasTwoLines) {
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '13px "Inter", Arial, sans-serif';
    const titleLines = wrapText(ctx, titleText, W - PAD * 4);
    for (const line of titleLines) {
      y += 17;
      ctx.fillText(line, W / 2, y);
    }
  }

  // ── QR code ──
  const qrPad = 6;
  const qrContainerX = (W - qrContainerSize) / 2;
  const qrContainerY = y + 25;

  // Glass QR container
  ctx.save();
  ctx.shadowColor = 'rgba(30, 58, 95, 0.18)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.beginPath();
  roundRect(ctx, qrContainerX, qrContainerY, qrContainerSize, qrContainerSize, 18);
  ctx.fill();
  ctx.restore();
  // Glass border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  roundRect(ctx, qrContainerX, qrContainerY, qrContainerSize, qrContainerSize, 18);
  ctx.stroke();

  const qrDrawSize = qrContainerSize - qrPad * 2;
  ctx.drawImage(qrCanvas, qrContainerX + qrPad, qrContainerY + qrPad, qrDrawSize, qrDrawSize);

  // ── Glass info panel (flows after QR, not anchored to bottom) ──
  const panelX = (W - panelW) / 2;
  const panelY = qrContainerY + qrContainerSize + 25;

  ctx.fillStyle = 'rgba(255,255,255,0.28)';
  ctx.beginPath();
  roundRect(ctx, panelX, panelY, panelW, panelH, 12);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  roundRect(ctx, panelX, panelY, panelW, panelH, 12);
  ctx.stroke();

  // Contact row icon paths (matching React preview & HTML)
  const iconPaths = {
    GSM: (ctx, x, y, s) => { ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 1.5; ctx.strokeRect(x + s*0.21, y + s*0.08, s*0.58, s*0.83); ctx.beginPath(); ctx.arc(x + s/2, y + s*0.75, 0.5, 0, Math.PI*2); ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fill(); },
    Email: (ctx, x, y, s) => { ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 1.5; ctx.strokeRect(x + s*0.08, y + s*0.17, s*0.83, s*0.67); ctx.beginPath(); ctx.moveTo(x + s*0.08, y + s*0.17); ctx.lineTo(x + s/2, y + s*0.54); ctx.lineTo(x + s*0.92, y + s*0.17); ctx.stroke(); },
    Address: (ctx, x, y, s) => { ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x + s/2, y + s*0.42, s*0.3, 0, Math.PI*2); ctx.stroke(); ctx.beginPath(); ctx.arc(x + s/2, y + s*0.42, s*0.12, 0, Math.PI*2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x + s/2, y + s*0.72); ctx.lineTo(x + s/2, y + s*0.92); ctx.stroke(); },
    Location: (ctx, x, y, s) => { ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x + s/2, y + s*0.42, s*0.3, 0, Math.PI*2); ctx.stroke(); ctx.beginPath(); ctx.arc(x + s/2, y + s*0.42, s*0.12, 0, Math.PI*2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x + s/2, y + s*0.72); ctx.lineTo(x + s/2, y + s*0.92); ctx.stroke(); },
  };

  let rowY = panelY + 6;
  const iconBoxSize = 26;
  const textOffsetX = 16 + iconBoxSize + 10; // icon box + gap
  const maxTextW = panelW - textOffsetX - 16;
  contacts.forEach((contact, i) => {
    const isAddress = contact.key === 'Address' || contact.key === 'Location';
    const thisRowH = isAddress ? rowHWrap : rowH;

    // Icon background box
    const ibx = panelX + 16;
    const iby = rowY + (isAddress ? 10 : (thisRowH - iconBoxSize) / 2);
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath();
    roundRect(ctx, ibx, iby, iconBoxSize, iconBoxSize, 6);
    ctx.fill();
    // Draw icon
    const drawIcon = iconPaths[contact.key];
    if (drawIcon) {
      ctx.save();
      drawIcon(ctx, ibx + 3, iby + 3, iconBoxSize - 6);
      ctx.restore();
    }

    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.font = '11px "Inter", Arial, sans-serif';
    ctx.fillText(contact.label, panelX + textOffsetX, rowY + 18);

    ctx.fillStyle = '#ffffff';
    ctx.font = '13px "Inter", Arial, sans-serif';
    if (isAddress) {
      // Wrap address text into multiple lines
      const lines = wrapText(ctx, contact.value, maxTextW);
      lines.forEach((line, li) => {
        ctx.fillText(line, panelX + textOffsetX, rowY + 36 + li * 16);
      });
    } else {
      const val = ellipsize(ctx, contact.value, maxTextW);
      ctx.fillText(val, panelX + textOffsetX, rowY + 36);
    }

    rowY += thisRowH;

    if (i < contacts.length - 1) {
      ctx.strokeStyle = 'rgba(231,233,235,0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(panelX + 16, rowY);
      ctx.lineTo(panelX + panelW - 16, rowY);
      ctx.stroke();
    }
  });

  return canvas;
}

const QrCanvasView = memo(({ source, size, sizeH, trigger }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || !source) return;
    const el = ref.current;
    el.width = source.width;
    el.height = source.height;
    el.getContext('2d').drawImage(source, 0, 0);
  }, [source, trigger]);
  return <canvas ref={ref} style={{ display: 'block', width: size, height: sizeH || size }} />;
});

const BG_GRADIENT = 'linear-gradient(160deg, #b8d4de 0%, #6bbac8 25%, #4da8be 45%, #3a9ab0 65%, #2a7fa0 100%)';

function contactHref(key, value) {
  if (key === 'GSM' || key === 'Tel') return 'tel:' + value.replace(/\s/g, '');
  if (key === 'Email') return 'mailto:' + value;
  if (key === 'Web') return value.startsWith('http') ? value : 'https://' + value;
  if (key === 'Address' || key === 'Location') {
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(value);
  }
  return null;
}

const btnGlass = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
  border: '1px solid rgba(255,255,255,0.25)',
  borderRadius: 14, padding: '0.55rem 0.5rem',
  fontFamily: 'Inter,sans-serif', fontSize: '0.65rem', fontWeight: 600,
  letterSpacing: '0.01em',
  color: '#ffffff', cursor: 'pointer',
  transition: 'all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  flex: 1, minWidth: 0, whiteSpace: 'nowrap',
  background: 'rgba(255,255,255,0.12)',
  backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
  boxShadow: '0 2px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.2)',
};

/** Generate QR SVG with modern gradient dots, gold finder centers, and logo overlay */
function generateQrSvg(vcard, logoBase64) {
  const qrData = QRCode.create(vcard, { errorCorrectionLevel: 'H' });
  const modules = qrData.modules;
  const moduleCount = modules.size;
  const svgSize = 260;
  const margin = 2;
  const totalModules = moduleCount + margin * 2;
  const cellSize = svgSize / totalModules;
  const dotR = cellSize * 0.42;
  const finderR = (cellSize * 0.8).toFixed(2);

  function isFinderPattern(row, col) {
    if (row < 7 && col < 7) return true;
    if (row < 7 && col >= moduleCount - 7) return true;
    if (row >= moduleCount - 7 && col < 7) return true;
    return false;
  }

  // Alignment pattern detection
  function isAlignmentCenter(r, c) {
    if (moduleCount < 25) return false;
    const positions = [];
    const ver = Math.floor((moduleCount - 17) / 4) + 1;
    if (ver >= 2) {
      const last = moduleCount - 7;
      const step = ver === 2 ? 0 : Math.round((last - 6) / (Math.ceil(ver / 7) + 1));
      const coords = [6];
      if (step > 0) { for (let p = last; p > 6; p -= step) coords.unshift(p); }
      else coords.push(last);
      for (const ar of coords) for (const ac of coords) {
        if ((ar === 6 && ac === 6) || (ar === 6 && ac === last) || (ar === last && ac === 6)) continue;
        positions.push([ar, ac]);
      }
    }
    return positions.some(([ar, ac]) => r === ar && c === ac);
  }

  function isAlignmentArea(r, c) {
    for (let dr = -2; dr <= 2; dr++) {
      for (let dc = -2; dc <= 2; dc++) {
        if (isAlignmentCenter(r - dr, c - dc)) return true;
      }
    }
    return false;
  }

  function finderPatternSvg(startRow, startCol) {
    const ox = ((startCol + margin) * cellSize).toFixed(2);
    const oy = ((startRow + margin) * cellSize).toFixed(2);
    const outer = (7 * cellSize).toFixed(2);
    const mid = (5 * cellSize).toFixed(2);
    const inner = (3 * cellSize).toFixed(2);
    const midOff = cellSize.toFixed(2);
    const innerOff = (2 * cellSize).toFixed(2);
    const r1 = finderR;
    const r2 = (cellSize * 0.5).toFixed(2);
    const r3 = (cellSize * 0.35).toFixed(2);
    return '<rect x="' + ox + '" y="' + oy + '" width="' + outer + '" height="' + outer + '" rx="' + r1 + '" fill="url(#navyGrad)" filter="url(#glow)"/>' +
      '<rect x="' + (parseFloat(ox) + parseFloat(midOff)).toFixed(2) + '" y="' + (parseFloat(oy) + parseFloat(midOff)).toFixed(2) + '" width="' + mid + '" height="' + mid + '" rx="' + r2 + '" fill="#ffffff"/>' +
      '<rect x="' + (parseFloat(ox) + parseFloat(innerOff)).toFixed(2) + '" y="' + (parseFloat(oy) + parseFloat(innerOff)).toFixed(2) + '" width="' + inner + '" height="' + inner + '" rx="' + r3 + '" fill="' + GOLD + '"/>';
  }

  // Alignment pattern SVGs
  let alignSvg = '';
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (isAlignmentCenter(row, col)) {
        const ox = ((col - 2 + margin) * cellSize).toFixed(2);
        const oy = ((row - 2 + margin) * cellSize).toFixed(2);
        const s = (5 * cellSize).toFixed(2);
        const ar = (cellSize * 0.6).toFixed(2);
        const ar2 = (cellSize * 0.3).toFixed(2);
        const innerS = (3 * cellSize).toFixed(2);
        const innerOff = cellSize.toFixed(2);
        const cx = ((col + margin + 0.5) * cellSize).toFixed(2);
        const cy = ((row + margin + 0.5) * cellSize).toFixed(2);
        alignSvg += '<rect x="' + ox + '" y="' + oy + '" width="' + s + '" height="' + s + '" rx="' + ar + '" fill="url(#navyGrad)"/>';
        alignSvg += '<rect x="' + (parseFloat(ox) + parseFloat(innerOff)).toFixed(2) + '" y="' + (parseFloat(oy) + parseFloat(innerOff)).toFixed(2) + '" width="' + innerS + '" height="' + innerS + '" rx="' + ar2 + '" fill="#ffffff"/>';
        alignSvg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (cellSize * 0.5).toFixed(2) + '" fill="' + GOLD + '"/>';
      }
    }
  }

  let dots = '';
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (isFinderPattern(row, col)) continue;
      if (isAlignmentArea(row, col)) continue;
      if (modules.get(row, col)) {
        const cx = (col + margin + 0.5) * cellSize;
        const cy = (row + margin + 0.5) * cellSize;
        dots += '<circle cx="' + cx.toFixed(2) + '" cy="' + cy.toFixed(2) + '" r="' + dotR.toFixed(2) + '" fill="url(#navyGrad)"/>';
      }
    }
  }

  // SVG with gradient defs and glow filter
  let svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + svgSize + ' ' + svgSize + '" width="' + svgSize + '" height="' + svgSize + '">' +
    '<defs>' +
    '<linearGradient id="navyGrad" x1="0%" y1="0%" x2="100%" y2="100%">' +
    '<stop offset="0%" stop-color="' + NAVY + '"/>' +
    '<stop offset="50%" stop-color="#1a4a6e"/>' +
    '<stop offset="100%" stop-color="#15607a"/>' +
    '</linearGradient>' +
    '<filter id="glow"><feGaussianBlur stdDeviation="' + (cellSize * 0.4).toFixed(1) + '" result="blur"/>' +
    '<feFlood flood-color="' + NAVY + '" flood-opacity="0.2"/>' +
    '<feComposite in2="blur" operator="in"/>' +
    '<feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
    '</defs>' +
    '<rect width="' + svgSize + '" height="' + svgSize + '" rx="' + Math.round(svgSize * 0.06) + '" fill="#ffffff"/>' +
    finderPatternSvg(0, 0) +
    finderPatternSvg(0, moduleCount - 7) +
    finderPatternSvg(moduleCount - 7, 0) +
    alignSvg +
    dots;

  if (logoBase64) {
    const center = svgSize / 2;
    const r = Math.round(center * 0.22);
    const pad = 8;
    const imgSize = Math.round(r * 1.7);
    svg +=
      '<circle cx="' + center + '" cy="' + center + '" r="' + (r + pad) + '" fill="#ffffff"/>' +
      '<clipPath id="logo-clip"><circle cx="' + center + '" cy="' + center + '" r="' + r + '"/></clipPath>' +
      '<image href="' + logoBase64 + '" x="' + (center - imgSize / 2) + '" y="' + (center - imgSize / 2) + '" ' +
      'width="' + imgSize + '" height="' + imgSize + '" preserveAspectRatio="xMidYMid meet" clip-path="url(#logo-clip)"/>';
  }

  svg += '</svg>';
  return svg;
}

function getCompanyName(company, stg, lang) {
  if (!company) return stg.companyName || 'Tiryaki Agro';
  return (lang === 'en' && company.nameEN) ? company.nameEN : company.name;
}

const BusinessCardModal = memo(({ open, onClose, form, office, stg, company, toast, L, lang, profilePhoto }) => {
  const qrCanvasRef = useRef(null);
  const cardRef = useRef(null);
  const profileInputRef = useRef(null);

  const [copyOk, setCopyOk] = useState(false);
  const [qrReady, setQrReady] = useState(0);
  const [profileBase64, setProfileBase64] = useState(profilePhoto || null);

  // Sync Graph photo when it becomes available
  useEffect(() => {
    if (profilePhoto && !profileBase64) setProfileBase64(profilePhoto);
  }, [profilePhoto]);

  useEffect(() => {
    if (!open) return;
    setCopyOk(false);
    setQrReady(0);

    const vcard = generateVCard(form, office, stg, company, lang);

    drawQrWithLogo(vcard, 320, getQrLogo(stg, company)).then(qrCanvas => {
      qrCanvasRef.current = qrCanvas;
      setQrReady(r => r + 1);

      drawBusinessCard(qrCanvas, form, stg, office, company, profileBase64, L, lang).then(card => {
        cardRef.current = card;
      });
    });
  }, [open, form, office, stg, company, profileBase64, L, lang]);

  const handleDownload = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    const link = document.createElement('a');
    const name = [form.firstName, form.lastName].filter(Boolean).join('-') || 'card';
    link.download = name.toLowerCase() + '-business-card.png';
    link.href = card.toDataURL('image/png');
    link.click();
  }, [form]);

  const handleCopy = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    try {
      const item = new ClipboardItem({
        'image/png': new Promise((resolve, reject) => {
          card.toBlob(blob => {
            if (blob) resolve(blob); else reject(new Error('toBlob failed'));
          }, 'image/png');
        }),
      });
      navigator.clipboard.write([item]).then(() => {
        setCopyOk(true);
        if (toast) toast(L.bcCopied);
        setTimeout(() => setCopyOk(false), 2500);
      }).catch(() => { if (toast) toast(L.bcCopyFail || 'Copy failed'); });
    } catch (e) { if (toast) toast(L.bcCopyUnsupported || 'Copy not supported'); }
  }, [toast, L]);

  /** Share via Web Share API */
  const handleShare = useCallback(async () => {
    const card = cardRef.current;
    if (!card) return;

    try {
      const blob = await new Promise(resolve => card.toBlob(resolve, 'image/png'));
      const name = formatName(form);
      const cardSuffix = L.bcCardSuffix || 'Business Card';
      const file = new File([blob], name + ' - ' + cardSuffix + '.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: name + ' - ' + cardSuffix,
          text: name + ' ' + (L.bcDigitalCardText || 'digital business card'),
          files: [file],
        });
      } else if (navigator.share) {
        await navigator.share({
          title: name + ' - ' + cardSuffix,
          text: name + ' ' + (L.bcDigitalCardText || 'digital business card'),
        });
      } else {
        if (toast) toast(L.bcShareFail || 'Sharing not supported');
      }
    } catch (e) {
      if (e.name !== 'AbortError' && toast) toast(L.bcShareFail || 'Sharing not supported');
    }
  }, [form, toast, L]);

  /** Generate & download standalone interactive HTML business card */
  const handleHtmlDownload = useCallback(async () => {
    const bgDataUri = await getBgBase64();
    const vcard = generateVCard(form, office, stg, company, lang);
    const fullName = formatName(form);
    const companyName = getCompanyName(company, stg, lang);
    const titleText = [form.titleTR, form.titleEN].filter(Boolean).join(' / ');
    const hasTwoLines = !!titleText;

    // Build contact rows
    const rows = [];
    if (form.gsm) { const g = formatGSM(form.gsm); rows.push({ key: 'GSM', label: L.bcLabelGSM || 'Phone', value: g, href: 'tel:' + g.replace(/\s/g, '') }); }
    if (form.email) rows.push({ key: 'Email', label: L.bcLabelEmail || 'Email', value: form.email, href: 'mailto:' + form.email });
    if (office && office.address && office.city) {
      const addr = office.address + ', ' + office.city;
      rows.push({ key: 'Address', label: L.bcLabelAddress || 'Address', value: addr, href: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(addr) });
    } else if (office && office.city) {
      rows.push({ key: 'Location', label: L.bcLabelLocation || 'Location', value: office.city, href: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(office.city) });
    }

    // Generate QR SVG with centered logo
    let qrSvg = '';
    try {
      qrSvg = await generateQrSvg(vcard, getQrLogo(stg, company));
    } catch (e) { /* QR generation failed */ }

    // Avatar HTML (profile photo or logo)
    const avatarSrc = profileBase64 || stg.logoBase64;
    const avatarStyle = profileBase64
      ? 'width:100%;height:100%;object-fit:cover'
      : 'max-width:70%;max-height:70%;object-fit:contain';
    const avatarAlt = profileBase64 ? 'Profile' : 'Logo';
    const logoHtml = avatarSrc
      ? '<div style="margin:28px auto 0;width:100px;height:100px;border-radius:50%;border:3px solid rgba(255,255,255,0.9);background:#fff;display:flex;align-items:center;justify-content:center;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.15)">' +
        '<img src="' + avatarSrc + '" alt="' + avatarAlt + '" style="' + avatarStyle + '"/>' +
        '</div>'
      : '';

    // Subtitle HTML — company line 1 (clickable to website), titles line 2
    const websiteUrl = stg.website ? (stg.website.startsWith('http') ? stg.website : 'https://' + stg.website) : '';
    const companyHtml = websiteUrl
      ? '<a href="' + websiteUrl + '" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">' + companyName + '</a>'
      : companyName;
    const hasAvatar = !!(profileBase64 || stg.logoBase64);
    const subtitleHtml = hasTwoLines
      ? '<div class="subtitle" style="margin-top:' + (hasAvatar ? '14px' : '36px') + '">' + companyHtml + '</div>\n' +
        '<div class="subtitle2">' + titleText + '</div>'
      : '<div class="subtitle" style="margin-top:' + (hasAvatar ? '14px' : '36px') + '">' + companyHtml + '</div>';

    // Contact row icon SVGs (keyed by internal key, not display label)
    const rowIcons = {
      GSM: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
      Email: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
      Address: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
      Location: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    };

    // Contact rows HTML with icons
    const rowsHtml = rows.map((r, i) => {
      const divider = i < rows.length - 1 ? '<div style="height:1px;background:rgba(231,233,235,0.3)"></div>' : '';
      const icon = rowIcons[r.key] || '';
      const iconHtml = icon ? '<div style="flex-shrink:0;display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:8px;background:rgba(255,255,255,0.12)">' + icon + '</div>' : '';
      return '<a href="' + r.href + '" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:12px;padding:10px 16px;text-decoration:none;transition:background 0.15s" onmouseover="this.style.background=\'rgba(255,255,255,0.12)\'" onmouseout="this.style.background=\'transparent\'">' +
        iconHtml +
        '<div style="flex:1;min-width:0">' +
        '<div style="font-size:10px;color:rgba(255,255,255,0.5);font-family:Inter,sans-serif;letter-spacing:0.4px;text-transform:uppercase">' + r.label + '</div>' +
        '<div style="font-size:13px;color:#fff;font-family:Inter,sans-serif;margin-top:2px;text-shadow:0 1px 3px rgba(0,0,0,0.1)">' + r.value + '</div>' +
        '</div>' +
        '</a>' + divider;
    }).join('');

    const html = '<!DOCTYPE html>\n<html lang="tr">\n<head>\n' +
      '<meta charset="UTF-8">\n' +
      '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n' +
      '<meta name="apple-mobile-web-app-capable" content="yes">\n' +
      '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n' +
      '<meta name="mobile-web-app-capable" content="yes">\n' +
      '<title>' + fullName + ' - ' + (L.bcCardSuffix || 'Business Card') + '</title>\n' +
      '<link rel="preconnect" href="https://fonts.googleapis.com">\n' +
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
      '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700&display=swap" rel="stylesheet">\n' +
      '<style>\n' +
      '*{margin:0;padding:0;box-sizing:border-box}\n' +
      'html,body{min-height:100vh;font-family:Inter,system-ui,sans-serif}\n' +
      'body{display:flex;align-items:center;justify-content:center;' +
      'background:url(' + bgDataUri + ') center/cover no-repeat fixed;background-color:#1e3a5f;padding:20px}\n' +
      '.card{width:100%;max-width:390px;position:relative;overflow:hidden;border-radius:20px;' +
      'background:linear-gradient(160deg,#b8d4de 0%,#6bbac8 25%,#4da8be 45%,#3a9ab0 65%,#2a7fa0 100%);' +
      'box-shadow:0 24px 48px rgba(0,0,0,0.3);padding:0 0 24px}\n' +
      '.wave{position:absolute;inset:0;pointer-events:none;' +
      'background:radial-gradient(ellipse at 35% 55%,rgba(180,215,80,0.25) 0%,rgba(60,190,190,0.08) 50%,transparent 80%)}\n' +
      '.name{text-align:center;font-family:"Plus Jakarta Sans",sans-serif;font-size:1.4rem;font-weight:700;' +
      'color:#fff;text-shadow:0 2px 8px rgba(0,0,0,0.15);position:relative;z-index:1}\n' +
      '.subtitle{text-align:center;font-size:0.92rem;font-weight:600;color:rgba(255,255,255,0.9);' +
      'font-family:Inter,sans-serif;margin-top:6px;position:relative;z-index:1}\n' +
      '.subtitle2{text-align:center;font-size:0.78rem;color:rgba(255,255,255,0.8);' +
      'font-family:Inter,sans-serif;margin-top:3px;position:relative;z-index:1}\n' +
      '.qr-wrap{margin:20px auto 0;width:200px;height:200px;background:rgba(255,255,255,0.55);' +
      'backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-radius:18px;' +
      'box-shadow:0 8px 32px rgba(30,58,95,0.18),inset 0 1px 0 rgba(255,255,255,0.4);' +
      'border:1.5px solid rgba(255,255,255,0.5);' +
      'display:flex;align-items:center;justify-content:center;' +
      'position:relative;z-index:1;padding:6px}\n' +
      '.qr-wrap svg{width:100%;height:100%}\n' +
      '.glass{margin:20px auto 0;width:calc(100% - 36px);background:rgba(255,255,255,0.28);' +
      'backdrop-filter:blur(40px);-webkit-backdrop-filter:blur(40px);border-radius:12px;' +
      'padding:4px 0;position:relative;z-index:1}\n' +
      '.scan{display:flex;align-items:center;justify-content:center;gap:6px;text-align:center;color:rgba(255,255,255,0.5);font-size:0.7rem;' +
      'font-family:Inter,sans-serif;margin-top:20px;position:relative;z-index:1}\n' +
      '</style>\n</head>\n<body>\n' +
      '<div class="card">\n' +
      '<div class="wave"></div>\n' +
      logoHtml + '\n' +
      '<div class="name" style="margin-top:' + (hasAvatar ? '14px' : '36px') + ';display:flex;align-items:center;justify-content:center;gap:6px">' + fullName +
      (form.linkedinPersonal
        ? ' <a href="' + (form.linkedinPersonal.startsWith('http') ? form.linkedinPersonal : 'https://' + form.linkedinPersonal) + '" target="_blank" rel="noopener" style="display:inline-flex;opacity:0.85"><svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>'
        : '') +
      '</div>\n' +
      subtitleHtml + '\n' +
      '<div class="qr-wrap">' + qrSvg + '</div>\n' +
      '<div class="glass">' + rowsHtml + '</div>\n' +
      '<div class="scan"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> ' + (L.bcScan || 'Taratarak rehbere ekleyin') + '</div>\n' +
      '</div>\n' +
      '</body>\n</html>';

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const cardSuffix = L.bcCardSuffix || 'Business Card';
    const fname = [titleCase(form.firstName), titleCase(form.lastName)].filter(Boolean).join(' ') || cardSuffix;
    a.download = fname + ' - ' + cardSuffix + '.html';
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  }, [form, office, stg, company, L, profileBase64]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const fullName = formatName(form);
  const companyName = getCompanyName(company, stg, lang);
  const titleText = [form.titleTR, form.titleEN].filter(Boolean).join(' / ');
  const hasTwoLines = !!titleText;

  // Contact info rows (key for icon matching, label for display)
  const contactRows = [];
  if (form.gsm) contactRows.push({ key: 'GSM', label: L.bcLabelGSM || 'Phone', value: formatGSM(form.gsm) });
  if (form.email) contactRows.push({ key: 'Email', label: L.bcLabelEmail || 'Email', value: form.email });
  if (office && office.address && office.city) {
    contactRows.push({ key: 'Address', label: L.bcLabelAddress || 'Address', value: office.address + ', ' + office.city });
  } else if (office && office.city) {
    contactRows.push({ key: 'Location', label: L.bcLabelLocation || 'Location', value: office.city });
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(30,58,95,0.35)',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeIn 0.25s ease',
        padding: '1rem',
      }}
    >
      <div
        className="bc-modal"
        onClick={e => e.stopPropagation()}
        style={{
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 20,
          border: `1px solid ${C.borderSub}`,
          boxShadow: '0 24px 48px rgba(30,58,95,0.18), 0 8px 16px rgba(30,58,95,0.08)',
          padding: '1.5rem',
          width: '100%', maxWidth: 420,
          textAlign: 'center',
          position: 'relative',
          animation: 'slideInUp 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
          maxHeight: '92vh',
          overflowY: 'auto',
        }}
      >
        {/* Hidden profile photo input */}
        <input
          ref={profileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => setProfileBase64(ev.target.result);
            reader.readAsDataURL(file);
            e.target.value = '';
          }}
        />

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 12, right: 12, zIndex: 2,
            background: 'rgba(255,255,255,0.8)', border: 'none', cursor: 'pointer',
            color: C.textM, padding: 4, borderRadius: 8,
            transition: 'all 0.2s', backdropFilter: 'blur(4px)',
          }}
          onMouseEnter={e => e.currentTarget.style.color = C.primary}
          onMouseLeave={e => e.currentTarget.style.color = C.textM}
        >
          <X size={18} />
        </button>

        {/* Card Preview */}
        <div style={{
          borderRadius: 15,
          overflow: 'hidden',
          background: BG_GRADIENT,
          position: 'relative',
          padding: '0 0 20px',
          marginBottom: '1rem',
          boxShadow: '0 8px 32px rgba(30,58,95,0.15)',
        }}>
          {/* Wave overlay */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse at 35% 55%, rgba(180,215,80,0.25) 0%, rgba(60,190,190,0.08) 50%, transparent 80%)',
          }} />

          {/* Avatar: Profile photo or Logo */}
          {(profileBase64 || stg.logoBase64) && (
            <div style={{
              marginTop: 28,
              display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 1,
            }}>
              {/* Wrapper for circle + badge (position:relative so badge can overflow) */}
              <div style={{ position: 'relative', width: 100, height: 100 }}>
                <div
                  style={{
                    width: 100, height: 100, borderRadius: '50%',
                    border: '3px solid rgba(255,255,255,0.9)',
                    background: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    cursor: 'pointer',
                  }}
                  onClick={() => profileInputRef.current && profileInputRef.current.click()}
                  title={L.bcProfileTitle || 'Click on the photo to upload a profile picture'}
                >
                  {profileBase64 ? (
                    <img
                      src={profileBase64} alt="Profile"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <img
                      src={stg.logoBase64} alt="Logo"
                      style={{ maxWidth: '70%', maxHeight: '70%', objectFit: 'contain' }}
                    />
                  )}
                  {/* Upload overlay */}
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    background: 'rgba(0,0,0,0.35)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: 0, transition: 'opacity 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                  >
                    <Upload size={22} color="#fff" />
                  </div>
                </div>
                {/* Remove profile badge — outside overflow:hidden circle */}
                {profileBase64 && (
                  <div
                    onClick={(e) => { e.stopPropagation(); setProfileBase64(null); }}
                    title={L.bcRemoveProfile || 'Remove profile'}
                    style={{
                      position: 'absolute', top: 0, right: -4, zIndex: 3,
                      width: 24, height: 24, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                      border: '2.5px solid #fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(239,68,68,0.4)',
                      transition: 'transform 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <X size={12} color="#fff" strokeWidth={3} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Name + LinkedIn icon */}
          <div style={{
            marginTop: (profileBase64 || stg.logoBase64) ? 14 : 36,
            fontSize: '1.3rem', fontWeight: 700, color: '#ffffff',
            fontFamily: 'Plus Jakarta Sans,sans-serif',
            textShadow: '0 2px 8px rgba(0,0,0,0.15)',
            position: 'relative', zIndex: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            {fullName}
            {form.linkedinPersonal && (
              <a href={form.linkedinPersonal.startsWith('http') ? form.linkedinPersonal : 'https://' + form.linkedinPersonal}
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', opacity: 0.85, transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0.85'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            )}
          </div>

          {/* Company name (line 1) — clickable to website */}
          <div style={{
            marginTop: 6,
            fontSize: '0.92rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)',
            fontFamily: 'Inter,sans-serif',
            position: 'relative', zIndex: 1,
          }}>
            {stg.website ? (
              <a
                href={stg.website.startsWith('http') ? stg.website : 'https://' + stg.website}
                target="_blank" rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
              >
                {companyName}
              </a>
            ) : companyName}
          </div>

          {/* Titles (line 2) */}
          {hasTwoLines && (
            <div style={{
              marginTop: 3,
              fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)',
              fontFamily: 'Inter,sans-serif',
              position: 'relative', zIndex: 1,
            }}>
              {titleText}
            </div>
          )}

          {/* QR */}
          <div className="bc-qr-wrap" style={{
            margin: '20px auto 0',
            width: 190, height: 190,
            background: 'rgba(255, 255, 255, 0.55)',
            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 18,
            boxShadow: '0 8px 32px rgba(30, 58, 95, 0.18), inset 0 1px 0 rgba(255,255,255,0.4)',
            border: '1.5px solid rgba(255, 255, 255, 0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', zIndex: 1,
            padding: 6,
          }}>
            <QrCanvasView source={qrCanvasRef.current} size={178} trigger={qrReady} />
          </div>

          {/* Glass info panel */}
          {contactRows.length > 0 && (
            <div style={{
              margin: '20px auto 0',
              width: 'calc(100% - 36px)',
              background: 'rgba(255,255,255,0.28)',
              backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
              borderRadius: 12,
              padding: '4px 0',
              position: 'relative', zIndex: 1,
            }}>
              {contactRows.map((row, i) => {
                const href = contactHref(row.key, row.value);
                const iconSvg = row.key === 'GSM'
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                  : row.key === 'Email'
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  : (row.key === 'Address' || row.key === 'Location')
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  : null;
                const content = (
                  <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    {iconSvg && (
                      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.12)' }}>
                        {iconSvg}
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)',
                        fontFamily: 'Inter,sans-serif', textAlign: 'left',
                        letterSpacing: '0.4px', textTransform: 'uppercase',
                      }}>
                        {row.label}
                      </div>
                      <div style={{
                        fontSize: '0.78rem', color: '#ffffff',
                        fontFamily: 'Inter,sans-serif', textAlign: 'left',
                        marginTop: 2,
                        textShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      }}>
                        {row.value}
                      </div>
                    </div>
                  </div>
                );
                return (
                  <div key={i}>
                    {href ? (
                      <a
                        href={href}
                        target={row.key === 'Web' || row.key === 'Address' || row.key === 'Location' ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        style={{
                          display: 'block', textDecoration: 'none',
                          transition: 'background 0.15s',
                          borderRadius: i === 0 ? '12px 12px 0 0' : i === contactRows.length - 1 ? '0 0 12px 12px' : 0,
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        {content}
                      </a>
                    ) : content}
                    {i < contactRows.length - 1 && (
                      <div style={{ height: 1, background: 'rgba(231,233,235,0.3)', margin: '0' }} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions — Apple glass buttons */}
        <div className="bc-actions" style={{
          display: 'flex', flexWrap: 'wrap', gap: '0.35rem', justifyContent: 'center',
          background: 'rgba(0,0,0,0.04)', borderRadius: 16, padding: '0.35rem',
        }}>
          {/* Kopyala — hover: gold */}
          <button
            onClick={handleCopy}
            style={{
              ...btnGlass,
              background: copyOk ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.12)',
              borderColor: copyOk ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.18)',
              color: copyOk ? '#16a34a' : C.textM,
            }}
            onMouseEnter={e => { if (!copyOk) { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(200,146,42,0.18), rgba(200,146,42,0.1))'; e.currentTarget.style.borderColor = 'rgba(200,146,42,0.35)'; e.currentTarget.style.color = '#b07d1e'; } e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { if (!copyOk) { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.color = C.textM; } e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {copyOk ? <Check size={14} /> : <Copy size={14} />}
            {copyOk ? '✓' : (L.bcCopy || 'Copy')}
          </button>

          {/* İndir — hover: navy */}
          <button
            onClick={handleDownload}
            style={{ ...btnGlass, color: C.textM }}
            onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(30,58,95,0.15), rgba(30,58,95,0.08))'; e.currentTarget.style.borderColor = 'rgba(30,58,95,0.3)'; e.currentTarget.style.color = '#1e3a5f'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.color = C.textM; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <Download size={14} />
            {L.bcDownload || 'Download'}
          </button>

          {/* Paylaş — hover: green */}
          <button
            onClick={handleShare}
            style={{ ...btnGlass, color: C.textM }}
            onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(37,211,102,0.15), rgba(37,211,102,0.08))'; e.currentTarget.style.borderColor = 'rgba(37,211,102,0.35)'; e.currentTarget.style.color = '#128C7E'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.color = C.textM; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <Share2 size={14} />
            {L.bcShare || 'Share'}
          </button>

          {/* Dijital Kart — hover: blue */}
          <button
            onClick={handleHtmlDownload}
            style={{
              ...btnGlass,
              background: 'rgba(0,152,212,0.1)',
              borderColor: 'rgba(0,152,212,0.2)',
              color: '#0088c0',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,152,212,0.22), rgba(0,152,212,0.12))'; e.currentTarget.style.borderColor = 'rgba(0,152,212,0.4)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,152,212,0.1)'; e.currentTarget.style.borderColor = 'rgba(0,152,212,0.2)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <FileDown size={14} />
            {L.bcDigitalCard || 'Digital Card'}
          </button>
        </div>

        {/* Hint */}
        <div style={{
          marginTop: '0.6rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem',
          fontSize: '0.65rem', color: C.text2 || '#4a5568',
          fontFamily: 'Inter,sans-serif',
          textAlign: 'center', lineHeight: 1.4,
          opacity: 0.55,
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          {L.bcProfileHint || 'Click on the logo to upload your profile photo'}
        </div>
      </div>
    </div>
  );
});

export default BusinessCardModal;
