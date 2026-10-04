// Mobile: every button full column width (no hug-width buttons). Run via Figmosha exec.
const sec = await figma.getNodeByIdAsync('1554:20267');
const log = [];
const ev = (v) => { v = Math.round(v); return v % 2 ? v + 1 : v; };
function widen(b, W) {
  const disc = b.children.find((c) => c.name === 'btn__disc');
  const label = b.children.find((c) => c.name === 'btn__label');
  b.resize(W, b.height);
  if (disc) disc.x = W - 7 - 38;
  else if (label) label.x = ev((W - label.width) / 2);
}
// shift everything in frame below `fromY` (frame coords) by d, grow frame
function shiftFrame(fr, fromY, d, skip) {
  for (const c of fr.children) if (c !== skip && c.y >= fromY) c.y += d;
  fr.resize(fr.width, fr.height + d);
}
for (const fr of sec.children) {
  if (fr.type !== 'FRAME') continue;
  const btns = fr.findAll((n) => n.type === 'FRAME' && n.name === 'btn');
  for (const b of btns) {
    const p = b.parent;
    if (b.width >= 350 || p.name === 'booking-form') continue;
    if (p.name === 'cta-banner') { b.x = 20; widen(b, 310); log.push(fr.name.slice(0, 2) + ' cta'); continue; }
    if (p.name === 'site-footer' || p.name === 'game-hero' || p.name === 'article__body') {
      widen(b, 350); log.push(fr.name.slice(0, 2) + ' ' + p.name); continue;
    }
    if (p.name === 'game-related') {
      const title = p.children.find((c) => c.type === 'TEXT');
      const grid = p.children.find((c) => c.name === 'game-grid');
      const oldH = p.height, top = p.y;
      title.y = 64; grid.y = ev(title.y + title.height) + 40;
      b.x = 20; widen(b, 350); b.y = grid.y + grid.height + 40;
      const newH = b.y + b.height + 64;
      const d = newH - oldH;
      p.resize(p.width, newH);
      shiftFrame(fr, top + oldH, d, p);
      log.push(fr.name.slice(0, 2) + ' related +' + d); continue;
    }
    if (p.name === 'not-found') {
      if (b.x > 20) continue; // handled with the first one
      const second = p.children.find((c) => c.name === 'btn' && c !== b);
      b.x = 20; widen(b, 350);
      if (second) { second.x = 20; second.y = b.y + b.height + 12; widen(second, 350); }
      const bottom = (second || b).y + (second || b).height;
      const oldH = p.height, top = p.y;
      const newH = bottom + 148;
      const d = newH - oldH;
      p.resize(p.width, newH);
      const bg = p.children.find((c) => c.name === 'not-found__bg');
      if (bg) bg.resize(bg.width, newH);
      shiftFrame(fr, top + oldH, d, p);
      log.push(fr.name.slice(0, 2) + ' 404 +' + d); continue;
    }
    log.push('SKIP ' + fr.name.slice(0, 2) + ' ' + p.name + ' ' + b.width);
  }
}
// popup: home indicator dark on the white sheet
const hi = await figma.getNodeByIdAsync('1554:20265');
for (const r of hi.findAll((n) => n.type === 'RECTANGLE')) r.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
return log.join('#');
