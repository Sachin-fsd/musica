// Lightweight album-art color extraction + color helpers.
// No external dependency (colorthief adds ~7 KB to the client bundle).
// Strategy: draw the artwork onto a tiny canvas, then average the most
// "vivid" mid-tone pixels. This yields a lively accent color instead of a
// muddy average.

export function rgbToHex(r, g, b) {
    const to2 = (n) => n.toString(16).padStart(2, '0');
    return `#${to2(r)}${to2(g)}${to2(b)}`;
}

export function hexToRgb(hex) {
    const h = hex.replace('#', '');
    const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    const num = parseInt(full, 16);
    if (Number.isNaN(num)) return null;
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

export function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    const d = max - min;
    if (d === 0) return [0, 0, l];
    let h;
    switch (max) {
        case r: h = ((g - b) / d) % 6; break;
        case g: h = (b - r) / d + 2; break;
        default: h = (r - g) / d + 4;
    }
    h = (h * 60 + 360) % 360;
    const s = d / (1 - Math.abs(2 * l - 1));
    return [h, s, l];
}

// rgba() string from a hex color + alpha (0..1)
export function withAlpha(hex, alpha) {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    const a = Math.max(0, Math.min(1, alpha));
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`;
}

// Mix two hex colors — ratio 0..1 moves from A toward B
export function mixColor(hexA, hexB, ratio) {
    const a = hexToRgb(hexA);
    const b = hexToRgb(hexB);
    if (!a || !b) return hexA;
    const t = Math.max(0, Math.min(1, ratio));
    const mix = (x, y) => Math.round(x + (y - x) * t);
    return rgbToHex(mix(a.r, b.r), mix(a.g, b.g), mix(a.b, b.b));
}

/**
 * Extract a vibrant accent color from a loaded <img> element.
 * @param {HTMLImageElement} imgEl - fully loaded image (use crossOrigin="anonymous")
 * @param {number} size - sampling grid (default 10x10)
 * @returns {string|null} hex color, or null if no vivid pixel was found
 */
export function extractThemeColor(imgEl, size = 10) {
    if (!imgEl || typeof document === 'undefined' || !imgEl.naturalWidth) return null;

    try {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(imgEl, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);

        const candidates = [];
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];
            if (a < 128) continue;

            const [, s, l] = rgbToHsl(r, g, b);
            // Skip near-grays and extremes — we want something vivid but usable
            if (s < 0.18 || l < 0.08 || l > 0.9) continue;
            const vividness = s * (1 - Math.abs(l - 0.5) * 2);
            candidates.push({ r, g, b, vividness });
        }

        if (!candidates.length) return null;

        candidates.sort((x, y) => y.vividness - x.vividness);
        const keep = Math.max(1, Math.floor(candidates.length * 0.2));
        const top = candidates.slice(0, keep);

        const r = Math.round(top.reduce((sum, p) => sum + p.r, 0) / top.length);
        const g = Math.round(top.reduce((sum, p) => sum + p.g, 0) / top.length);
        const b = Math.round(top.reduce((sum, p) => sum + p.b, 0) / top.length);

        return rgbToHex(r, g, b);
    } catch {
        return null; // tainted canvas (no CORS) — caller keeps previous color
    }
}
