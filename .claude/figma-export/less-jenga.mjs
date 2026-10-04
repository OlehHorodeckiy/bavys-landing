// Swap Jenga-heavy placeholder photos for other real games/events; turn the Jenga blog post into a Battleship post.
const code = `
  for (const s of ['Regular', 'Medium', 'Bold']) await figma.loadFontAsync({ family: 'Comfortaa', style: s });
  const N = (id) => figma.getNodeByIdAsync(id);
  const site = figma.root.children.find(p => p.name === 'Сайт');
  const home = site.findAll(n => n.type === 'FRAME' && n.getPluginData('bavys-import') === 'home')[0];
  const gal = (start) => home.findOne(n => n.type === 'RECTANGLE' && n.name.startsWith(start)).fills.find(f => f.type === 'IMAGE');
  const card = async (id) => (await N(id)).fills.find(f => f.type === 'IMAGE');
  const SRC = {
    cornhole: gal('Корнхол на газоні'), tent: gal('Гості біля шатра'), festival: gal('Компанія грає за столом'),
    vodni: gal('Партія у «В одні ворота»'), galaktyka: gal('Гра «Галактика»'), c4: gal('«4 в ряд» на столі'),
    battleship: await card('1542:5022'), rybalka: await card('1510:33669'), kiltsekyd: await card('1510:33584'),
  };
  const put = async (id, key) => { const n = await N(id); const f = SRC[key];
    n.fills = [{ type: 'IMAGE', imageHash: f.imageHash, scaleMode: 'FILL' }]; n.name = 'фото · ' + key; };
  const photoInto = async (mediaId, key) => { const m = await N(mediaId);
    const art = m.children.find(c => c.name === 'game-art'); if (!art) return;
    const r = figma.createRectangle(); m.insertChild(m.children.indexOf(art), r); r.resize(m.width, m.height); r.x = 0; r.y = 0; art.remove();
    r.fills = [{ type: 'IMAGE', imageHash: SRC[key].imageHash, scaleMode: 'FILL' }]; r.name = 'фото · ' + key; };
  // blog covers
  await put('1510:34227', 'cornhole');   // Як обрати ігри для весілля
  await put('1510:34246', 'tent');       // Літній корпоратив
  await put('1510:34319', 'vodni');      // За лаштунками
  await photoInto('1510:34336', 'festival'); // Для event-агенцій
  await photoInto('1510:34367', 'rybalka');  // Дитяча зона
  // Jenga post → Battleship post (list + «related» card in the article)
  const T = 'Морський бій: від зошита\\nв клітинку до великого поля', E = 'Звідки взялася гра, в яку всі грали в дитинстві, і як вона виросла до великого дерев’яного формату.';
  const chipSrc = (await N('1510:34244')).children.find(c => c.name === 'chip');
  for (const [tid, eid, mid] of [['1510:34251', '1510:34252', '1510:34263'], ['1518:676', '1518:677', '1518:688']]) {
    (await N(tid)).characters = T; (await N(eid)).characters = E;
    const m = await N(mid); const r = m.children.find(c => c.type === 'RECTANGLE'); r.fills = [{ type: 'IMAGE', imageHash: SRC.battleship.imageHash, scaleMode: 'FILL' }]; r.name = 'фото · battleship';
    if (!m.children.find(c => c.name === 'chip') && mid === '1510:34263') { const ch = chipSrc.clone(); m.appendChild(ch); ch.findOne(n => n.type === 'TEXT').characters = 'Ігри'; ch.x = chipSrc.x; ch.y = chipSrc.y; }
  }
  // article
  await put('1518:839', 'cornhole'); await put('1518:525', 'c4');
  // about
  await put('1511:34826', 'tent'); await put('1511:34542', 'c4'); await put('1511:34545', 'galaktyka'); await put('1511:34548', 'vodni'); await put('1511:34664', 'kiltsekyd');
  // contacts
  await put('1512:35424', 'festival');
  return 'ok';
`;
const j = await (await fetch('http://localhost:8787/exec', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, timeout: 120 }) })).json();
console.log(j.value ?? JSON.stringify(j));
