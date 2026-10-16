/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

export interface PBRTextureSet {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
}

export class TextureFactory {
  private static createCanvas(w: number, h: number) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return { canvas: c, ctx: c.getContext('2d')! };
  }

  private static toTexture(canvas: HTMLCanvasElement, repeatX = 1, repeatY = 1, isColor = true): THREE.CanvasTexture {
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
    if (isColor) {
      tex.colorSpace = THREE.SRGBColorSpace;
    }
    tex.generateMipmaps = true;
    tex.needsUpdate = true;
    return tex;
  }

  /**
   * Weathered Roman Travertine with horizontal sedimentary grain & ashlar mortar joints
   */
  public static createTravertine(repeatX = 4, repeatY = 4): PBRTextureSet {
    const W = 512, H = 512;
    const { canvas: diffC, ctx: dCtx } = this.createCanvas(W, H);
    const { canvas: bumpC, ctx: bCtx } = this.createCanvas(W, H);

    dCtx.fillStyle = '#d9c7a7';
    dCtx.fillRect(0, 0, W, H);
    bCtx.fillStyle = '#c0c0c0';
    bCtx.fillRect(0, 0, W, H);

    const rows = 8;
    const rowH = H / rows;

    for (let r = 0; r < rows; r++) {
      const cols = 4;
      const colW = W / cols;
      const offset = (r % 2) * (colW * 0.5);
      for (let c = -1; c <= cols; c++) {
        const x = c * colW + offset;
        const y = r * rowH;

        const v = (Math.sin(r * 17.3 + c * 31.7) * 0.5 + 0.5) * 18 - 9;
        const R = Math.min(255, Math.max(0, 218 + v));
        const G = Math.min(255, Math.max(0, 198 + v * 0.9));
        const B = Math.min(255, Math.max(0, 165 + v * 0.8));

        dCtx.fillStyle = `rgb(${R | 0},${G | 0},${B | 0})`;
        dCtx.fillRect(x + 2, y + 2, colW - 4, rowH - 4);

        bCtx.fillStyle = `rgb(${(195 + v) | 0},${(195 + v) | 0},${(195 + v) | 0})`;
        bCtx.fillRect(x + 2, y + 2, colW - 4, rowH - 4);

        // Sedimentary horizontal pores
        for (let s = 0; s < 18; s++) {
          const sx = x + 6 + Math.random() * (colW - 16);
          const sy = y + 5 + Math.random() * (rowH - 10);
          const sw = 6 + Math.random() * 24;
          const sh = 1 + Math.random() * 2.2;
          dCtx.fillStyle = Math.random() > 0.35 ? 'rgba(135,112,82,0.22)' : 'rgba(245,235,215,0.25)';
          dCtx.fillRect(sx, sy, sw, sh);
          bCtx.fillStyle = 'rgba(70,70,70,0.45)';
          bCtx.fillRect(sx, sy, sw, sh);
        }

        // Ashlar mortar lines
        dCtx.strokeStyle = 'rgba(110, 92, 68, 0.72)';
        dCtx.lineWidth = 3;
        dCtx.strokeRect(x, y, colW, rowH);

        bCtx.strokeStyle = '#282828';
        bCtx.lineWidth = 4;
        bCtx.strokeRect(x, y, colW, rowH);
      }
    }

    return {
      map: this.toTexture(diffC, repeatX, repeatY, true),
      bumpMap: this.toTexture(bumpC, repeatX, repeatY, false)
    };
  }

  /**
   * White/Ivory Carrara Marble with delicate grey/gold veins & optional Corinthian fluting
   */
  public static createMarble(repeatX = 2, repeatY = 2, fluted = false): PBRTextureSet {
    const W = 512, H = 512;
    const { canvas: diffC, ctx: dCtx } = this.createCanvas(W, H);
    const { canvas: bumpC, ctx: bCtx } = this.createCanvas(W, H);

    const grad = dCtx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#ece5d8');
    grad.addColorStop(0.5, '#e4dccb');
    grad.addColorStop(1, '#ece4d5');
    dCtx.fillStyle = grad;
    dCtx.fillRect(0, 0, W, H);

    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, W, H);

    // Marble veins
    for (let v = 0; v < 30; v++) {
      dCtx.beginPath();
      let vx = Math.random() * W;
      let vy = 0;
      dCtx.moveTo(vx, vy);
      for (let step = 0; step < 16; step++) {
        vx += (Math.random() - 0.48) * 45;
        vy += H / 16;
        dCtx.lineTo(vx, vy);
      }
      dCtx.strokeStyle = v % 4 === 0 ? 'rgba(182, 152, 98, 0.16)' : 'rgba(130, 125, 118, 0.18)';
      dCtx.lineWidth = 1 + Math.random() * 3.5;
      dCtx.stroke();
    }

    if (fluted) {
      const flutes = 24;
      const fw = W / flutes;
      for (let i = 0; i < flutes; i++) {
        const fx = i * fw;
        const fGrad = dCtx.createLinearGradient(fx, 0, fx + fw, 0);
        fGrad.addColorStop(0, 'rgba(85, 75, 65, 0.28)');
        fGrad.addColorStop(0.25, 'rgba(255, 250, 240, 0.18)');
        fGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.0)');
        fGrad.addColorStop(0.8, 'rgba(75, 65, 55, 0.22)');
        fGrad.addColorStop(1, 'rgba(60, 50, 42, 0.34)');
        dCtx.fillStyle = fGrad;
        dCtx.fillRect(fx, 0, fw, H);

        const bGrad = bCtx.createLinearGradient(fx, 0, fx + fw, 0);
        bGrad.addColorStop(0, '#353535');
        bGrad.addColorStop(0.5, '#efefef');
        bGrad.addColorStop(1, '#353535');
        bCtx.fillStyle = bGrad;
        bCtx.fillRect(fx, 0, fw, H);
      }
    }

    return {
      map: this.toTexture(diffC, repeatX, repeatY, true),
      bumpMap: this.toTexture(bumpC, repeatX, repeatY, false)
    };
  }

  /**
   * Egyptian Grey or Red Aswan Granite (Pantheon monolithic columns & obelisks)
   */
  public static createGranite(isRed = false): PBRTextureSet {
    const W = 256, H = 256;
    const { canvas: diffC, ctx: dCtx } = this.createCanvas(W, H);
    const { canvas: bumpC, ctx: bCtx } = this.createCanvas(W, H);

    dCtx.fillStyle = isRed ? '#9e5b47' : '#7d7770';
    dCtx.fillRect(0, 0, W, H);
    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, W, H);

    for (let i = 0; i < 3500; i++) {
      const x = Math.random() * W;
      const y = Math.random() * H;
      const sz = 1 + Math.random() * 2.5;
      const r = Math.random();
      if (isRed) {
        dCtx.fillStyle = r > 0.6 ? 'rgba(220,165,140,0.45)' : (r > 0.3 ? 'rgba(60,30,22,0.45)' : 'rgba(180,110,88,0.4)');
      } else {
        dCtx.fillStyle = r > 0.6 ? 'rgba(210,205,198,0.4)' : (r > 0.3 ? 'rgba(45,42,40,0.45)' : 'rgba(145,130,118,0.35)');
      }
      dCtx.fillRect(x, y, sz, sz);
      bCtx.fillStyle = r > 0.5 ? '#a8a8a8' : '#555555';
      bCtx.fillRect(x, y, sz, sz);
    }

    return {
      map: this.toTexture(diffC, 2, 4, true),
      bumpMap: this.toTexture(bumpC, 2, 4, false)
    };
  }

  /**
   * Polygonal Roman Basalt Cobblestone Paving (Silex blocks with chariot ruts)
   */
  public static createCobblestone(repeatX = 6, repeatY = 16): PBRTextureSet {
    const W = 512, H = 512;
    const { canvas: diffC, ctx: dCtx } = this.createCanvas(W, H);
    const { canvas: bumpC, ctx: bCtx } = this.createCanvas(W, H);

    dCtx.fillStyle = '#2c2722';
    dCtx.fillRect(0, 0, W, H);
    bCtx.fillStyle = '#161616';
    bCtx.fillRect(0, 0, W, H);

    const gridN = 8;
    const cell = W / gridN;
    const pts: { x: number; y: number; shade: number }[] = [];

    for (let gy = -1; gy <= gridN + 1; gy++) {
      for (let gx = -1; gx <= gridN + 1; gx++) {
        const wx = ((gx + gridN) % gridN);
        const wy = ((gy + gridN) % gridN);
        const seed = Math.sin(wx * 127.1 + wy * 311.7) * 43758.5453;
        const jx = (seed - Math.floor(seed)) * 0.58 + 0.21;
        const seed2 = Math.sin(wx * 269.5 + wy * 183.3) * 43758.5453;
        const jy = (seed2 - Math.floor(seed2)) * 0.58 + 0.21;
        pts.push({
          x: (gx + jx) * cell,
          y: (gy + jy) * cell,
          shade: ((Math.sin(wx * 41.2 + wy * 93.7) * 0.5 + 0.5) * 38) | 0
        });
      }
    }

    pts.forEach((p, idx) => {
      if (p.x < -cell || p.x > W + cell || p.y < -cell || p.y > H + cell) return;
      const sides = 6;
      const rBase = cell * 0.43;

      dCtx.beginPath();
      bCtx.beginPath();
      for (let s = 0; s < sides; s++) {
        const ang = (s / sides) * Math.PI * 2 + (idx % 3) * 0.2;
        const rad = rBase * (0.84 + 0.26 * Math.sin(idx * 7 + s * 2.3));
        const px = p.x + Math.cos(ang) * rad;
        const py = p.y + Math.sin(ang) * rad;
        if (s === 0) {
          dCtx.moveTo(px, py);
          bCtx.moveTo(px, py);
        } else {
          dCtx.lineTo(px, py);
          bCtx.lineTo(px, py);
        }
      }
      dCtx.closePath();
      bCtx.closePath();

      const baseR = 78 + p.shade;
      const baseG = 74 + ((p.shade * 0.92) | 0);
      const baseB = 68 + ((p.shade * 0.85) | 0);

      const stoneGrad = dCtx.createRadialGradient(p.x - 5, p.y - 5, 2, p.x, p.y, rBase);
      stoneGrad.addColorStop(0, `rgb(${baseR + 22}, ${baseG + 20}, ${baseB + 16})`);
      stoneGrad.addColorStop(0.75, `rgb(${baseR}, ${baseG}, ${baseB})`);
      stoneGrad.addColorStop(1, `rgb(${baseR - 20}, ${baseG - 20}, ${baseB - 18})`);
      dCtx.fillStyle = stoneGrad;
      dCtx.fill();
      dCtx.lineWidth = 3.5;
      dCtx.strokeStyle = '#241f1a';
      dCtx.stroke();

      const bumpGrad = bCtx.createRadialGradient(p.x, p.y, 2, p.x, p.y, rBase);
      bumpGrad.addColorStop(0, '#ffffff');
      bumpGrad.addColorStop(0.75, '#b8b8b8');
      bumpGrad.addColorStop(1, '#202020');
      bCtx.fillStyle = bumpGrad;
      bCtx.fill();
    });

    // Worn chariot ruts running vertically along the avenue
    [W * 0.32, W * 0.68].forEach(rx => {
      dCtx.fillStyle = 'rgba(25, 22, 18, 0.28)';
      dCtx.fillRect(rx - 12, 0, 24, H);
      bCtx.fillStyle = '#303030';
      bCtx.fillRect(rx - 8, 0, 16, H);
    });

    return {
      map: this.toTexture(diffC, repeatX, repeatY, true),
      bumpMap: this.toTexture(bumpC, repeatX, repeatY, false)
    };
  }

  /**
   * Golden Arena Sand with raked chariot grooves & footprints
   */
  public static createArenaSand(): PBRTextureSet {
    const W = 512, H = 512;
    const { canvas: diffC, ctx: dCtx } = this.createCanvas(W, H);
    const { canvas: bumpC, ctx: bCtx } = this.createCanvas(W, H);

    dCtx.fillStyle = '#d8b579';
    dCtx.fillRect(0, 0, W, H);
    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, W, H);

    for (let i = 0; i < 9000; i++) {
      const x = Math.random() * W;
      const y = Math.random() * H;
      const w = 1 + Math.random() * 3;
      dCtx.fillStyle = Math.random() > 0.5 ? 'rgba(238,208,154,0.32)' : 'rgba(168,128,74,0.28)';
      dCtx.fillRect(x, y, w, 1.5);
      bCtx.fillStyle = Math.random() > 0.5 ? '#9c9c9c' : '#646464';
      bCtx.fillRect(x, y, w, 1.5);
    }

    const cx = W / 2, cy = H / 2;
    for (let r = 28; r < W * 0.48; r += 8) {
      dCtx.beginPath();
      dCtx.arc(cx, cy, r, 0, Math.PI * 2);
      dCtx.strokeStyle = r % 24 === 0 ? 'rgba(135, 98, 48, 0.42)' : 'rgba(165, 128, 72, 0.22)';
      dCtx.lineWidth = r % 24 === 0 ? 3.5 : 1.5;
      dCtx.stroke();

      bCtx.beginPath();
      bCtx.arc(cx, cy, r, 0, Math.PI * 2);
      bCtx.strokeStyle = r % 24 === 0 ? '#383838' : '#666666';
      bCtx.lineWidth = r % 24 === 0 ? 4 : 2;
      bCtx.stroke();
    }

    return {
      map: this.toTexture(diffC, 1, 1, true),
      bumpMap: this.toTexture(bumpC, 1, 1, false)
    };
  }

  /**
   * Terracotta roof tiles (Tegulae & Imbrices)
   */
  public static createTerracotta(repeatX = 4, repeatY = 4): PBRTextureSet {
    const W = 256, H = 256;
    const { canvas: diffC, ctx: dCtx } = this.createCanvas(W, H);
    const { canvas: bumpC, ctx: bCtx } = this.createCanvas(W, H);

    dCtx.fillStyle = '#9e472a';
    dCtx.fillRect(0, 0, W, H);
    bCtx.fillStyle = '#707070';
    bCtx.fillRect(0, 0, W, H);

    const cols = 8;
    const rows = 8;
    const cw = W / cols;
    const rh = H / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * cw;
        const y = r * rh;
        const shade = (Math.sin(r * 13 + c * 29) * 12) | 0;

        const g = dCtx.createLinearGradient(x, y, x + cw, y);
        g.addColorStop(0, `rgb(${135 + shade}, ${58 + shade}, ${34 + shade})`);
        g.addColorStop(0.5, `rgb(${182 + shade}, ${84 + shade}, ${52 + shade})`);
        g.addColorStop(1, `rgb(${120 + shade}, ${48 + shade}, ${28 + shade})`);
        dCtx.fillStyle = g;
        dCtx.fillRect(x, y, cw, rh - 2);

        dCtx.fillStyle = 'rgba(55, 20, 10, 0.55)';
        dCtx.fillRect(x, y + rh - 3, cw, 3);

        const bg = bCtx.createLinearGradient(x, y, x + cw, y);
        bg.addColorStop(0, '#404040');
        bg.addColorStop(0.5, '#e8e8e8');
        bg.addColorStop(1, '#404040');
        bCtx.fillStyle = bg;
        bCtx.fillRect(x, y, cw, rh - 2);
      }
    }

    return {
      map: this.toTexture(diffC, repeatX, repeatY, true),
      bumpMap: this.toTexture(bumpC, repeatX, repeatY, false)
    };
  }

  /**
   * Roman fired brick (Opus Latericium)
   */
  public static createRomanBrick(repeatX = 8, repeatY = 6): PBRTextureSet {
    const W = 256, H = 256;
    const { canvas: diffC, ctx: dCtx } = this.createCanvas(W, H);
    const { canvas: bumpC, ctx: bCtx } = this.createCanvas(W, H);

    dCtx.fillStyle = '#9c6e54';
    dCtx.fillRect(0, 0, W, H);
    bCtx.fillStyle = '#909090';
    bCtx.fillRect(0, 0, W, H);

    const rows = 16;
    const rh = H / rows;
    const cols = 6;
    const cw = W / cols;

    for (let r = 0; r < rows; r++) {
      const off = (r % 2) * (cw * 0.5);
      for (let c = -1; c <= cols; c++) {
        const x = c * cw + off;
        const y = r * rh;
        const v = (Math.sin(r * 19 + c * 47) * 14) | 0;
        dCtx.fillStyle = `rgb(${162 + v}, ${112 + v}, ${84 + v})`;
        dCtx.fillRect(x + 1, y + 1, cw - 2, rh - 3);
        bCtx.fillStyle = '#c8c8c8';
        bCtx.fillRect(x + 1, y + 1, cw - 2, rh - 3);
      }
    }

    return {
      map: this.toTexture(diffC, repeatX, repeatY, true),
      bumpMap: this.toTexture(bumpC, repeatX, repeatY, false)
    };
  }

  /**
   * SPQR Banner (Imperial Crimson & Gold)
   */
  public static createSPQRBanner(): THREE.CanvasTexture {
    const W = 256, H = 512;
    const { canvas, ctx } = this.createCanvas(W, H);

    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#7a1414');
    grad.addColorStop(0.5, '#961b1b');
    grad.addColorStop(1, '#5e0e0e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = '#e0b84c';
    ctx.lineWidth = 10;
    ctx.strokeRect(14, 14, W - 28, H - 28);
    ctx.lineWidth = 3;
    ctx.strokeRect(26, 26, W - 52, H - 52);

    // Laurel Wreath
    ctx.save();
    ctx.translate(W / 2, H / 2 - 20);
    ctx.strokeStyle = '#e8c455';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, 0, 68, 0.2, Math.PI * 2 - 0.2);
    ctx.stroke();

    ctx.fillStyle = '#f5d76e';
    ctx.font = 'bold 36px Cinzel, Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SPQR', 0, 2);
    ctx.restore();

    return this.toTexture(canvas, 1, 1, true);
  }

  /**
   * Roman Legionary Scutum Shield texture:
   * Curved vermilion red background with golden winged thunderbolts (fulmen)
   */
  public static createScutumShield(): THREE.CanvasTexture {
    const W = 256, H = 512;
    const { canvas, ctx } = this.createCanvas(W, H);

    // Deep Roman vermilion red
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#8c1c1c');
    grad.addColorStop(0.5, '#ad2424');
    grad.addColorStop(1, '#741414');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Bronze brass edging
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 12;
    ctx.strokeRect(8, 8, W - 16, H - 16);

    ctx.save();
    ctx.translate(W / 2, H / 2);

    // Golden Wings radiating diagonally
    ctx.fillStyle = '#e8c455';
    ctx.strokeStyle = '#f5e492';
    ctx.lineWidth = 2;

    const drawWing = (dirX: number, dirY: number) => {
      ctx.save();
      ctx.scale(dirX, dirY);
      for (let f = 0; f < 5; f++) {
        ctx.beginPath();
        ctx.moveTo(15, 10 + f * 12);
        ctx.quadraticCurveTo(55 + f * 10, 40 + f * 18, 90 + f * 4, 90 + f * 24);
        ctx.lineTo(75 + f * 4, 80 + f * 20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    };

    drawWing(1, 1);
    drawWing(-1, 1);
    drawWing(1, -1);
    drawWing(-1, -1);

    // Central circular bronze umbo rim
    ctx.fillStyle = '#cca033';
    ctx.beginPath();
    ctx.arc(0, 0, 48, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff0a8';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.restore();

    return this.toTexture(canvas, 1, 1, true);
  }

  /**
   * Latin Inscribed Cornice Frieze
   */
  public static createInscribedFrieze(text: string): PBRTextureSet {
    const W = 1024, H = 128;
    const { canvas: diffC, ctx: dCtx } = this.createCanvas(W, H);
    const { canvas: bumpC, ctx: bCtx } = this.createCanvas(W, H);

    dCtx.fillStyle = '#cfc1a9';
    dCtx.fillRect(0, 0, W, H);
    bCtx.fillStyle = '#c0c0c0';
    bCtx.fillRect(0, 0, W, H);

    for (let i = 0; i < 450; i++) {
      dCtx.fillStyle = 'rgba(95,80,62,0.18)';
      dCtx.fillRect(Math.random() * W, Math.random() * H, 8 + Math.random() * 18, 2);
    }

    dCtx.fillStyle = '#9e8d74';
    dCtx.fillRect(0, 0, W, 14);
    dCtx.fillRect(0, H - 14, W, 14);

    dCtx.font = 'bold 42px Cinzel, Georgia, serif';
    dCtx.textAlign = 'center';
    dCtx.textBaseline = 'middle';
    dCtx.fillStyle = '#2d2318';
    dCtx.fillText(text, W / 2, H / 2 + 2);

    bCtx.font = 'bold 42px Cinzel, Georgia, serif';
    bCtx.textAlign = 'center';
    bCtx.textBaseline = 'middle';
    bCtx.fillStyle = '#151515';
    bCtx.fillText(text, W / 2, H / 2 + 2);

    return {
      map: this.toTexture(diffC, 1, 1, true),
      bumpMap: this.toTexture(bumpC, 1, 1, false)
    };
  }

  /**
   * Weathered Pine / Cedar Wood Grain for Market Stalls, Carts, Benches
   */
  public static createWood(repeatX = 2, repeatY = 4): PBRTextureSet {
    const W = 256, H = 256;
    const { canvas: diffC, ctx: dCtx } = this.createCanvas(W, H);
    const { canvas: bumpC, ctx: bCtx } = this.createCanvas(W, H);

    dCtx.fillStyle = '#6b4728';
    dCtx.fillRect(0, 0, W, H);
    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, W, H);

    // Wood fibers
    for (let y = 0; y < H; y++) {
      const v = Math.sin(y * 0.15) * 15 + Math.sin(y * 0.45) * 8;
      dCtx.fillStyle = `rgb(${108 + (v | 0)}, ${72 + ((v * 0.7) | 0)}, ${42 + ((v * 0.5) | 0)})`;
      dCtx.fillRect(0, y, W, 1);

      bCtx.fillStyle = `rgb(${128 + (v | 0)}, ${128 + (v | 0)}, ${128 + (v | 0)})`;
      bCtx.fillRect(0, y, W, 1);
    }

    // Planks seams
    const planks = 4;
    const pw = W / planks;
    for (let p = 0; p <= planks; p++) {
      dCtx.fillStyle = '#341f11';
      dCtx.fillRect(p * pw - 2, 0, 4, H);
      bCtx.fillStyle = '#202020';
      bCtx.fillRect(p * pw - 2, 0, 4, H);
    }

    return {
      map: this.toTexture(diffC, repeatX, repeatY, true),
      bumpMap: this.toTexture(bumpC, repeatX, repeatY, false)
    };
  }

  /**
   * Roman Striped Awning Canvas for Market Stalls
   */
  public static createAwningFabric(color1 = '#942222', color2 = '#e6dcba'): THREE.CanvasTexture {
    const W = 256, H = 256;
    const { canvas, ctx } = this.createCanvas(W, H);

    const stripes = 8;
    const sw = W / stripes;
    for (let i = 0; i < stripes; i++) {
      ctx.fillStyle = i % 2 === 0 ? color1 : color2;
      ctx.fillRect(i * sw, 0, sw, H);
    }

    // Fabric weave texture overlay
    ctx.fillStyle = 'rgba(0,0,0,0.06)';
    for (let y = 0; y < H; y += 4) {
      ctx.fillRect(0, y, W, 2);
    }

    return this.toTexture(canvas, 1, 1, true);
  }
}
