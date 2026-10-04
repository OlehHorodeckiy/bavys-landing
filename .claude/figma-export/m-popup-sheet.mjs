// Mobile booking popup as a bottom sheet: full width, top corners 32, 20px sides, one-line title,
// fields 350, date with icon + placeholder, wrapped comment hint, full-width button, consent above the home indicator.
const code = `
  for (const s of ['Light', 'Medium', 'Bold']) await figma.loadFontAsync({ family: 'Comfortaa', style: s });
  const N = (id) => figma.getNodeByIdAsync(id);
  const fr = await N('1554:19634'), modal = fr.children.find(x => x.name === 'modal'), card = modal.findOne(n => n.name === 'modal__card');
  const bf = card.findOne(n => n.name === 'booking-form'), close = card.findOne(n => n.name === 'modal__close');
  const T = (id) => N(id);
  const title = await T('1554:20215'), lead = await T('1554:20216');
  const labels = [await T('1554:20217'), await T('1554:20218'), await T('1554:20219'), await T('1554:20220')];
  const inputs = [await T('1554:20228'), await T('1554:20230'), await T('1554:20235'), await T('1554:20236')];
  const btn = await T('1554:20221'), note = await T('1554:20227'), icon = await T('1554:20232');
  const W = 350;
  // title in one line, 28/36
  title.fontSize = 28; title.lineHeight = { unit: 'PIXELS', value: 36 }; title.characters = 'Забронювати ігри';
  title.textAutoResize = 'WIDTH_AND_HEIGHT';
  let y = 0; title.x = 0; title.y = y; y += title.height + 12;
  lead.textAutoResize = 'HEIGHT'; lead.resize(W, lead.height); lead.x = 0; lead.y = y; y += lead.height + 24;
  for (let i = 0; i < 4; i++) {
    const l = labels[i], inp = inputs[i];
    l.x = 0; l.y = y; y += l.height + 8;
    inp.resize(W, i === 3 ? 96 : 52); inp.x = 0; inp.y = y; y += inp.height + (i < 3 ? 16 : 0);
  }
  // date field: icon + placeholder inside
  const date = inputs[2]; date.appendChild(icon); icon.x = 16; icon.y = 17;
  for (const v of icon.findAll(n => n.type === 'VECTOR')) if (v.strokes.length) v.strokes = [{ type: 'SOLID', color: { r: 0xc7 / 255, g: 0x84 / 255, b: 0x60 / 255 } }];
  for (const t of date.findAll(n => n.type === 'TEXT')) t.remove();
  const ph = inputs[0].findOne(n => n.type === 'TEXT').clone(); date.appendChild(ph); ph.characters = 'дд.мм.рррр'; ph.x = 44; ph.y = 15;
  const hint = inputs[3].findOne(n => n.type === 'TEXT'); hint.textAutoResize = 'HEIGHT'; hint.resize(W - 34, hint.height); hint.x = 17; hint.y = 14;
  // full-width button
  y += 32; btn.resize(W, 52); btn.x = 0; btn.y = y; const disc = btn.findOne(n => n.name === 'btn__disc'); disc.x = W - 7 - disc.width;
  const lab = btn.findOne(n => n.name === 'btn__label'); lab.x = 24; y += 52 + 16;
  note.textAutoResize = 'HEIGHT'; note.resize(W, note.height); note.textAlignHorizontal = 'CENTER'; note.x = 0; note.y = y; y += note.height;
  bf.resize(W, y);
  // sheet: full width, bottom aligned, top corners 32
  const PADT = 28, PADB = 34 + 16;
  card.x = 0; card.resize(390, PADT + y + PADB); card.topLeftRadius = 32; card.topRightRadius = 32; card.bottomLeftRadius = 0; card.bottomRightRadius = 0;
  bf.x = 20; bf.y = PADT;
  close.x = 390 - 20 - 40; close.y = PADT - 2;
  card.y = modal.height - card.height; card.clipsContent = true;
  // grabber
  for (const o of card.children.filter(c => c.name === 'grabber')) o.remove();
  const g = figma.createRectangle(); card.appendChild(g); g.name = 'grabber'; g.resize(40, 4); g.cornerRadius = 2; g.x = 175; g.y = 10; g.fills = [{ type: 'SOLID', color: { r: 0xe6 / 255, g: 0xdf / 255, b: 0xd8 / 255 } }];
  return JSON.stringify({ form: y, card: [card.y, card.height] });
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, timeout: 120 }) })).json();
console.log(j.value ?? JSON.stringify(j).slice(0, 400));
