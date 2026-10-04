// «Як замовити» in the reference style: 4 light square tiles with small UI illustrations, title + text under each.
const code = `
  for (const s of ['Light', 'Regular', 'Medium', 'Bold']) await figma.loadFontAsync({ family: 'Comfortaa', style: s });
  const N = (id) => figma.getNodeByIdAsync(id);
  const rgb = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
  const solid = (h, o = 1) => [{ type: 'SOLID', color: rgb(h), opacity: o }];
  const DEEP = '#2b1003', INK = '#6b584e', MUTED = '#9a8a80', ACC = '#c78460', PRI = '#866452', TILE = '#f6f2ee';
  const shadow = [{ type: 'DROP_SHADOW', color: { r: 0.17, g: 0.06, b: 0.01, a: 0.08 }, offset: { x: 0, y: 8 }, radius: 24, spread: 0, visible: true, blendMode: 'NORMAL' }];
  const vsec = await N('1518:1089');
  for (const n of vsec.children.filter(n => n.getPluginData('bavys-import') === 'steps-tiles' || n.getPluginData('bavys-label') === 'steps-tiles')) n.remove();
  const photoJ = (await N('1510:32977')).fills, photoK = (await N('1510:32971')).fills;
  const ICON = {
    calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    pin: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
    plus: '<path d="M5 12h14M12 5v14"/>',
  };
  const icon = (parent, name, size, color, x, y, sw = 2) => {
    const n = figma.createNodeFromSvg('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="round">' + ICON[name] + '</svg>');
    n.name = 'icon · ' + name; parent.appendChild(n); n.rescale(size / 24); n.x = x; n.y = y; return n;
  };
  const text = (parent, chars, size, lh, style, color, x, y, w) => {
    const t = figma.createText(); parent.appendChild(t);
    t.fontName = { family: 'Comfortaa', style }; t.characters = chars; t.fontSize = size; t.lineHeight = { unit: 'PIXELS', value: lh };
    t.fills = solid(color); if (w) { t.textAutoResize = 'HEIGHT'; t.resize(w, t.height); } else t.textAutoResize = 'WIDTH_AND_HEIGHT';
    t.x = x; t.y = y; return t;
  };
  const box = (parent, name, w, h, x, y, fill, r, sh) => {
    const f = figma.createFrame(); parent.appendChild(f); f.name = name; f.resize(w, h); f.x = x; f.y = y;
    f.fills = fill ? solid(fill) : []; f.cornerRadius = r || 0; if (sh) f.effects = shadow; f.clipsContent = false; return f;
  };

  const W = 1440;
  const sec = figma.createFrame(); vsec.appendChild(sec);
  sec.name = 'Як замовити — картки з ілюстраціями'; sec.setPluginData('bavys-import', 'steps-tiles'); sec.fills = solid('#ffffff');
  sec.resize(W, 700);
  // heading
  const h = text(sec, 'Як замовити ігри?', 48, 56, 'Bold', DEEP, 0, 80);
  h.setRangeFills('Як замовити '.length, 'Як замовити ігри'.length, solid(ACC));
  h.x = Math.round((W - h.width) / 4) * 2;
  const STEPS = [
    ['Оберіть ігри', 'Перегляньте каталог і додайте ігри, що пасують вашій події.'],
    ['Надішліть заявку', 'Вкажіть дату, локацію та кількість гостей. Без передоплати.'],
    ['Підтверджуємо наявність', 'Адміністратор зателефонує, уточнить деталі й зафіксує бронь.'],
    ['Привозимо й встановлюємо', 'Доставляємо, розставляємо, пояснюємо правила і забираємо після свята.'],
  ];
  const TW = 302, GAP = 24, TY = 184;
  let bottom = 0;
  STEPS.forEach(([title, body], i) => {
    const x = 80 + i * (TW + GAP);
    const tile = box(sec, 'tile · ' + title, TW, TW, x, TY, TILE, 24); tile.clipsContent = true;
    if (i === 0) {
      // two game cards and a plus badge
      const c1 = box(tile, 'card · Велика Дженга', 104, 104, 39, 99, '#ffffff', 20, true);
      const p1 = figma.createRectangle(); c1.appendChild(p1); p1.resize(80, 80); p1.x = 12; p1.y = 12; p1.cornerRadius = 12; p1.fills = photoJ;
      const c2 = box(tile, 'card · Корнхол', 104, 104, 159, 99, '#ffffff', 20, true);
      const p2 = figma.createRectangle(); c2.appendChild(p2); p2.resize(80, 80); p2.x = 12; p2.y = 12; p2.cornerRadius = 12; p2.fills = photoK;
      const plus = box(tile, 'badge · додати', 32, 32, 247, 83, ACC, 16, true);
      icon(plus, 'plus', 16, '#ffffff', 8, 8, 2.5);
    }
    if (i === 1) {
      // mini booking form
      const card = box(tile, 'form', 208, 176, 47, 63, '#ffffff', 20, true);
      [['calendar', '12 липня'], ['pin', 'Львів'], ['users', '60 гостей']].forEach(([ic, val], k) => {
        const y = 16 + k * 36;
        const row = box(card, 'field · ' + val, 176, 28, 16, y, '#f9f6f3', 8);
        icon(row, ic, 14, PRI, 10, 7);
        text(row, val, 12, 16, 'Medium', DEEP, 32, 6);
      });
      const btn = box(card, 'btn', 176, 32, 16, 128, PRI, 16);
      const bt = text(btn, 'Надіслати заявку', 12, 16, 'Bold', '#ffffff', 0, 8); bt.x = Math.round((176 - bt.width) / 4) * 2;
    }
    if (i === 2) {
      // confirmation message + call badge
      const msg = box(tile, 'message', 224, 72, 38, 107, '#ffffff', 20, true);
      const ok = box(msg, 'check', 32, 32, 16, 20, '#e7efe0', 16);
      icon(ok, 'check', 16, '#5f7a4e', 8, 8, 2.5);
      text(msg, 'Бронь підтверджено', 12, 16, 'Bold', DEEP, 60, 18);
      text(msg, 'сьогодні о 14:20', 12, 16, 'Medium', MUTED, 60, 38);
      const call = box(tile, 'call', 48, 48, 230, 159, ACC, 24, true);
      call.strokes = solid('#ffffff'); call.strokeWeight = 4; call.strokeAlign = 'OUTSIDE';
      icon(call, 'phone', 20, '#ffffff', 14, 14);
    }
    if (i === 3) {
      // progress ring around a truck
      const ring = figma.createEllipse(); tile.appendChild(ring); ring.name = 'ring';
      ring.resize(176, 176); ring.x = 63; ring.y = 63; ring.fills = [];
      ring.strokes = [{ type: 'GRADIENT_LINEAR', gradientTransform: [[1, 0, 0], [0, 1, 0]], gradientStops: [{ position: 0, color: { ...rgb(ACC), a: 0.15 } }, { position: 1, color: { ...rgb(ACC), a: 1 } }] }];
      ring.strokeWeight = 6; ring.strokeCap = 'ROUND';
      ring.arcData = { startingAngle: -Math.PI / 2, endingAngle: Math.PI, innerRadius: 0.93 };
      ring.strokes = []; ring.fills = [{ type: 'GRADIENT_ANGULAR', gradientTransform: [[1, 0, 0], [0, 1, 0]], gradientStops: [{ position: 0, color: { ...rgb(ACC), a: 0.1 } }, { position: 0.75, color: { ...rgb(ACC), a: 1 } }] }];
      const disc = box(tile, 'disc', 112, 112, 95, 95, '#ffffff', 56, true);
      icon(disc, 'truck', 36, ACC, 38, 38);
    }
    const t = text(sec, title, 20, 28, 'Bold', DEEP, x, TY + TW + 24, TW);
    const b = text(sec, body, 14, 24, 'Medium', INK, x, t.y + t.height + 8, TW);
    bottom = Math.max(bottom, b.y + b.height);
  });
  sec.resize(W, Math.ceil((bottom + 80) / 2) * 2);
  // place in «Варіанти на вибір» next to the other studies, with a caption
  const right = Math.max(...vsec.children.filter(n => n.type === 'FRAME' && n.getPluginData('bavys-import')).map(n => n.x + n.width));
  sec.x = right + 160; sec.y = 866;
  const lab0 = vsec.children.find(n => n.getPluginData('bavys-label') === 'lab-steps2');
  const lab = lab0.clone(); vsec.appendChild(lab); lab.setPluginData('bavys-label', 'steps-tiles'); lab.name = 'Підпис — Як замовити, картки з ілюстраціями';
  const ts = lab.findAll(n => n.type === 'TEXT');
  ts[0].characters = '05  Як замовити — картки з ілюстраціями';
  ts[0].setRangeFills(0, ts[0].characters.length, solid(DEEP)); ts[0].setRangeFills(0, 2, solid(ACC));
  ts[1].characters = 'Варіант секції «Як це працює» (тільки у Фігмі)';
  ts[2].characters = '4 світлі плитки 302×302 з міні-ілюстраціями інтерфейсу, під ними заголовок і текст. За референсом «How Oxinix works?»';
  lab.x = sec.x; lab.y = 866 - 64 - lab.height;
  vsec.resizeWithoutConstraints(sec.x + W + 200, vsec.height);
  figma.viewport.scrollAndZoomIntoView([sec]);
  return JSON.stringify({ id: sec.id, x: sec.x, h: sec.height });
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, timeout: 120 }) })).json();
console.log(j.value ?? JSON.stringify(j));
