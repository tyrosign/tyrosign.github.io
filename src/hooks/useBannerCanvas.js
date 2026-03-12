import { useEffect } from 'react';
import { BANNER_TEMPLATES, BANNER_SIZES } from '../constants/bannerConfig';

export function useBannerCanvas(canvasRef, tab, banner, stg) {
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
}
