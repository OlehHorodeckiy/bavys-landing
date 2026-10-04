// Home CTA banner → compact horizontal banner (Figma only; logged in pending.md).
const code = `
  for (const s of ['Light', 'Regular', 'Medium', 'Bold']) await figma.loadFontAsync({ family: 'Comfortaa', style: s });
  const N = (id) => figma.getNodeByIdAsync(id);
  const root = await N('1510:32939'), sec = await N('1510:33307'), banner = await N('1510:33308');
  const bg = await N('1510:33309'), media = await N('1510:33310'), img = await N('1510:33311'), shade = await N('1510:33312');
  const pill = await N('1510:33313'), title = await N('1510:33316'), text = await N('1510:33317');
  const btn = await N('1510:33318'), disc = await N('1510:33319'), label = await N('1510:33322'), labelT = await N('1510:33323');
  const btn2 = await N('1510:33324');
  const PAD = 64, W = 1280;
  // copy
  title.textAlignHorizontal = 'LEFT';
  title.characters = 'Плануєте свято?\\nігри беремо на себе';
  const cut = 'Плануєте свято?\\n'.length;
  title.setRangeFontName(0, title.characters.length, { family: 'Comfortaa', style: 'Bold' });
  title.setRangeFills(0, title.characters.length, [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]);
  title.setRangeFontName(cut, title.characters.length, { family: 'Comfortaa', style: 'Light' });
  title.setRangeFills(cut, title.characters.length, [{ type: 'SOLID', color: { r: 0xef / 255, g: 0xc6 / 255, b: 0xa8 / 255 } }]);
  title.resize(640, title.height);
  text.textAlignHorizontal = 'LEFT';
  text.characters = 'Залиште заявку, і ми підберемо ігри під вашу подію та дату.';
  text.resize(640, text.height);
  // one button «Замовити ігри»
  if (btn2) btn2.remove();
  labelT.characters = 'Замовити ігри';
  labelT.textAutoResize = 'WIDTH_AND_HEIGHT';
  labelT.x = 0; labelT.textAlignHorizontal = 'LEFT';
  const tw = Math.ceil(labelT.width / 2) * 2;
  label.resize(tw, label.height);
  disc.x = 23 + tw + 9;
  btn.resize(Math.ceil((disc.x + disc.width + 7) / 2) * 2, btn.height);
  // layout: text column left, button right
  const H = PAD + pill.height + 20 + title.height + 16 + text.height + PAD;
  pill.x = PAD; pill.y = PAD;
  title.x = PAD; title.y = PAD + pill.height + 20;
  text.x = PAD; text.y = title.y + title.height + 16;
  btn.x = W - PAD - btn.width; btn.y = Math.round((H - btn.height) / 4) * 2;
  for (const n of [banner, bg, media, img, shade]) n.resize(W, H);
  // shade: dark on the text side, lighter toward the button
  shade.fills = [{ type: 'GRADIENT_LINEAR', gradientTransform: [[1, 0, 0], [0, 1, 0]], gradientStops: [
    { position: 0, color: { r: 0.169, g: 0.063, b: 0.012, a: 0.86 } },
    { position: 0.6, color: { r: 0.169, g: 0.063, b: 0.012, a: 0.56 } },
    { position: 1, color: { r: 0.169, g: 0.063, b: 0.012, a: 0.32 } } ] }];
  // section and the page below
  const oldH = sec.height, newH = 80 + H + 80;
  sec.resize(sec.width, newH);
  const dy = newH - oldH;
  for (const c of root.children) if (c.y > sec.y) c.y += dy;
  root.resize(root.width, root.height + dy);
  figma.viewport.scrollAndZoomIntoView([sec]);
  return JSON.stringify({ banner: [W, H], section: newH, dy, root: root.height, btn: [btn.x, btn.y, btn.width], title: title.height, text: text.height });
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) })).json();
console.log(j.value ?? JSON.stringify(j));
