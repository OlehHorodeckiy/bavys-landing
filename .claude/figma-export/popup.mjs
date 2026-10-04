// Booking popup (Figma-first): form state + success state over a dimmed home page.
const code = `
  for (const s of ['Light', 'Regular', 'Medium', 'Bold']) await figma.loadFontAsync({ family: 'Comfortaa', style: s });
  const N = (id) => figma.getNodeByIdAsync(id);
  const rgb = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
  const solid = (h, o = 1) => [{ type: 'SOLID', color: rgb(h), opacity: o }];
  const DEEP = '#2b1003', INK = '#6b584e', MUTED = '#9a8a80', ACC = '#c78460', PRI = '#866452', CREAM = '#f9f6f3', STROKE = '#e6dfd8';
  const vsec = await N('1518:1089'), home = await N('1510:32939'), btnSrc = await N('1510:32957');
  for (const n of vsec.children.filter(n => n.getPluginData('bavys-import') === 'popup' || n.getPluginData('bavys-label') === 'popup')) n.remove();
  const text = (parent, chars, size, lh, style, color, x, y, w, align) => {
    const t = figma.createText(); parent.appendChild(t); t.fontName = { family: 'Comfortaa', style }; t.characters = chars;
    t.fontSize = size; t.lineHeight = { unit: 'PIXELS', value: lh }; t.fills = solid(color); if (align) t.textAlignHorizontal = align;
    if (w) { t.textAutoResize = 'HEIGHT'; t.resize(w, t.height); } else t.textAutoResize = 'WIDTH_AND_HEIGHT'; t.x = x; t.y = y; return t;
  };
  const box = (parent, name, w, h, x, y, fill, r) => { const f = figma.createFrame(); parent.appendChild(f); f.name = name; f.resize(w, h); f.x = x; f.y = y; f.fills = fill ? solid(fill) : []; f.cornerRadius = r || 0; return f; };
  const ICON = {
    x: '<path d="M18 6 6 18M6 6l12 12"/>', calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    pin: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    check: '<path d="M20 6 9 17l-5-5"/>', plus: '<path d="M5 12h14M12 5v14"/>',
  };
  const icon = (parent, name, size, color, x, y, sw = 2) => { const n = figma.createNodeFromSvg('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="round">' + ICON[name] + '</svg>');
    n.name = 'icon · ' + name; parent.appendChild(n); n.rescale(size / 24); n.x = x; n.y = y; return n; };
  const field = (parent, label, ph, x, y, w, ic) => {
    text(parent, label, 12, 16, 'Bold', MUTED, x, y);
    const f = box(parent, 'field · ' + label, w, 52, x, y + 24, '#ffffff', 14); f.strokes = solid(STROKE); f.strokeWeight = 1; f.strokeAlign = 'INSIDE';
    let tx = 16; if (ic) { icon(f, ic, 18, ACC, 16, 17); tx = 44; }
    text(f, ph, 16, 24, 'Medium', MUTED, tx, 14); return y + 24 + 52;
  };
  const button = (parent, label, x, y, w) => { const b = btnSrc.clone(); parent.appendChild(b);
    const t = b.findOne(n => n.type === 'TEXT'); t.characters = label; t.textAutoResize = 'WIDTH_AND_HEIGHT'; t.x = 0;
    const lab = b.findOne(n => n.name === 'btn__label'), disc = b.findOne(n => n.name === 'btn__disc');
    b.resize(w, b.height); disc.x = w - 7 - disc.width; lab.resize(Math.ceil(t.width / 2) * 2, lab.height); lab.x = Math.round((w - 38 - lab.width) / 4) * 2; b.x = x; b.y = y; return b; };
  const shadow = [{ type: 'DROP_SHADOW', color: { r: 0.17, g: 0.06, b: 0.01, a: 0.24 }, offset: { x: 0, y: 32 }, radius: 80, spread: 0, visible: true, blendMode: 'NORMAL' }];
  const stage = (name, x) => { const s = figma.createFrame(); vsec.appendChild(s); s.name = name; s.setPluginData('bavys-import', 'popup'); s.resize(1440, 900); s.clipsContent = true; s.x = x; s.y = 866;
    const bg = home.clone(); s.appendChild(bg); bg.x = 0; bg.y = 0;
    const ov = figma.createRectangle(); s.appendChild(ov); ov.name = 'overlay'; ov.resize(1440, 900); ov.fills = solid('#2b1003', 0.48);
    ov.effects = [{ type: 'BACKGROUND_BLUR', radius: 8, visible: true }]; return s; };
  const right = Math.max(...vsec.children.filter(n => n.type === 'FRAME' && n.getPluginData('bavys-import')).map(n => n.x + n.width));

  // form state
  const S1 = stage('Попап бронювання · форма', right + 160);
  const M = box(S1, 'modal', 640, 100, 400, 0, '#ffffff', 32); M.effects = shadow; M.clipsContent = true;
  const close = box(M, 'close', 40, 40, 576, 24, CREAM, 20); icon(close, 'x', 18, DEEP, 11, 11);
  const h = text(M, 'Забронювати ігри', 32, 40, 'Bold', DEEP, 40, 40); h.setRangeFontName('Забронювати '.length, h.characters.length, { family: 'Comfortaa', style: 'Light' }); h.setRangeFills('Забронювати '.length, h.characters.length, solid(PRI));
  text(M, 'Без передоплати. Адміністратор зателефонує протягом доби й уточнить деталі.', 14, 22, 'Medium', INK, 40, 88, 520);
  let y = 164;
  field(M, 'ІМ’Я *', 'Як до вас звертатись', 40, y, 272); y = field(M, 'ТЕЛЕФОН *', '+38 (0__) ___-__-__', 328, y, 272) + 16;
  y = field(M, 'ДАТА ПОДІЇ', 'дд.мм.рррр', 40, y, 560, 'calendar') + 16;
  text(M, 'КОМЕНТАР', 12, 16, 'Bold', MUTED, 40, y);
  const ta = box(M, 'field · КОМЕНТАР', 560, 88, 40, y + 24, '#ffffff', 14); ta.strokes = solid(STROKE); ta.strokeWeight = 1; ta.strokeAlign = 'INSIDE';
  text(ta, 'Які ігри вас цікавлять, формат свята, побажання щодо часу', 16, 24, 'Medium', MUTED, 16, 14, 528); y += 24 + 88 + 32;
  button(M, 'Надіслати заявку', 40, y, 560); y += 52 + 16;
  text(M, 'Натискаючи кнопку, ви погоджуєтесь на обробку контактних даних.', 12, 18, 'Medium', MUTED, 40, y, 560, 'CENTER'); y += 18 + 40;
  M.resize(640, y); M.y = Math.round((900 - y) / 4) * 2;
  if (M.y < 24) { S1.resize(1440, y + 64); S1.children.find(c => c.name === 'overlay').resize(1440, y + 64); M.y = 32; }

  // success state
  const S2 = stage('Попап бронювання · дякуємо', S1.x + 1440 + 160);
  S2.resize(1440, S1.height); S2.children.find(c => c.name === 'overlay').resize(1440, S1.height);
  const M2 = box(S2, 'modal', 520, 100, 460, 0, '#ffffff', 32); M2.effects = shadow;
  const c2 = box(M2, 'close', 40, 40, 456, 24, CREAM, 20); icon(c2, 'x', 18, DEEP, 11, 11);
  const ok = box(M2, 'check', 80, 80, 220, 56, '#e7efe0', 40); icon(ok, 'check', 36, '#5f7a4e', 22, 22, 2.5);
  const t2 = text(M2, 'Дякуємо! Заявку надіслано', 28, 36, 'Bold', DEEP, 40, 160, 440, 'CENTER');
  const t3 = text(M2, 'Адміністратор зателефонує вам протягом доби, щоб уточнити дату й ігри.', 16, 26, 'Medium', INK, 40, t2.y + t2.height + 12, 440, 'CENTER');
  const yb = t3.y + t3.height + 32; const b2 = button(M2, 'Переглянути ігри', 120, yb, 280);
  M2.resize(520, yb + 52 + 48); M2.y = Math.round((S2.height - M2.height) / 4) * 2;

  const lab0 = vsec.children.find(n => n.getPluginData('bavys-label') === 'lab-steps2');
  const lab = lab0.clone(); vsec.appendChild(lab); lab.setPluginData('bavys-label', 'popup'); lab.name = 'Підпис — Попап бронювання';
  const ts = lab.findAll(n => n.type === 'TEXT');
  ts[0].characters = '12  Попап бронювання'; ts[0].setRangeFills(0, ts[0].characters.length, solid(DEEP)); ts[0].setRangeFills(0, 2, solid(ACC));
  ts[1].characters = 'Відкривається з усіх кнопок «Забронювати» / «Замовити ігри»';
  ts[2].characters = 'Форма (ім’я, телефон, дата, коментар) і стан «Дякуємо». Заявка приходить на пошту';
  lab.x = S1.x; lab.y = 866 - 64 - lab.height;
  vsec.resizeWithoutConstraints(S2.x + 1440 + 200, Math.max(vsec.height, 866 + S1.height + 200));
  figma.viewport.scrollAndZoomIntoView([S1, S2]);
  return JSON.stringify({ s1: [S1.id, S1.height, M.height], s2: [S2.id, M2.height] });
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, timeout: 180 }) })).json();
console.log(j.value ?? JSON.stringify(j));
