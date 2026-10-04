// Exit non-zero unless the Figma import frame still matches the dump it was
// built from (same top-level blocks, same texts) — i.e. nobody edited it by hand.
import { execFileSync } from 'child_process';
const out = execFileSync('node', [new URL('./compare.mjs', import.meta.url).pathname], { encoding: 'utf8' });
const v = JSON.parse(out);
const vals = Object.values(v.out);
const ok = v.children === v.wantChildren && vals.every((x) => x === 'texts same');
if (!ok) {
  console.error('FIGMA FRAME WAS EDITED — not rebuilding.', JSON.stringify(v.out), `children ${v.children}/${v.wantChildren}`);
  process.exit(1);
}
console.log('figma frame untouched — ok to rebuild');
