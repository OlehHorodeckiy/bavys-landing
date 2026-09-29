/**
 * Illustrated game tiles — flat, wood-toned drawings used wherever a game has
 * no real photograph yet. They are deliberately illustrations, not fake photos:
 * as soon as a photo is added in data/games.js it replaces the tile.
 */
const C = {
  light: '#EDCFA3',
  wood: '#D9A86F',
  mid: '#C38B52',
  dark: '#A2703D',
  brand: '#5E2400',
  terra: '#C78460',
  cream: '#FBF3E8',
  hole: '#8C5A2B',
  grass: '#9DB36A',
};

const Shadow = ({ cx = 200, cy = 252, rx = 135, ry = 12 }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={C.brand} opacity=".12" />
);

const Lawn = () => <ellipse cx="200" cy="244" rx="178" ry="26" fill={C.grass} opacity=".35" />;

/** Maps unit coords on a board to a trapezoid seen in perspective. */
const quad = (tl, tr, bl, br) => (u, v) => {
  const top = [tl[0] + (tr[0] - tl[0]) * u, tl[1] + (tr[1] - tl[1]) * u];
  const bot = [bl[0] + (br[0] - bl[0]) * u, bl[1] + (br[1] - bl[1]) * u];
  return [top[0] + (bot[0] - top[0]) * v, top[1] + (bot[1] - top[1]) * v];
};
const pts = (arr) => arr.map((p) => p.join(',')).join(' ');

function Jenga() {
  const x0 = 150;
  const w = 90;
  const depth = [34, -17];
  const h = 19;
  const layers = 9;
  const base = 246;
  const side = (y, t0, t1) =>
    pts([
      [x0 + w + t0 * depth[0], y + h + t0 * depth[1]],
      [x0 + w + t1 * depth[0], y + h + t1 * depth[1]],
      [x0 + w + t1 * depth[0], y + t1 * depth[1]],
      [x0 + w + t0 * depth[0], y + t0 * depth[1]],
    ]);
  const rows = Array.from({ length: layers }, (_, i) => {
    const y = base - (i + 1) * (h + 2);
    const long = i % 2 === 0;
    return (
      <g key={i}>
        {long ? (
          <rect x={x0} y={y} width={w} height={h} rx="2" fill={C.wood} />
        ) : (
          [0, 1, 2].map((k) => <rect key={k} x={x0 + k * 31} y={y} width="28" height={h} rx="2" fill={C.light} />)
        )}
        {long ? (
          [0, 1, 2].map((k) => <polygon key={k} points={side(y, k / 3 + 0.02, (k + 1) / 3 - 0.02)} fill={C.mid} />)
        ) : (
          <polygon points={side(y, 0, 1)} fill={C.dark} />
        )}
      </g>
    );
  });
  const top = base - layers * (h + 2);
  return (
    <>
      <Shadow cx="215" />
      {rows}
      <polygon
        points={pts([
          [x0, top],
          [x0 + w, top],
          [x0 + w + depth[0], top + depth[1]],
          [x0 + depth[0], top + depth[1]],
        ])}
        fill={C.light}
      />
      <g transform="translate(300 236) rotate(-8)">
        <rect x="-38" y="-10" width="76" height="18" rx="2" fill={C.wood} />
        <rect x="-38" y="-16" width="76" height="6" rx="2" fill={C.light} />
      </g>
    </>
  );
}

function ConnectFour() {
  const cols = [130, 158, 186, 214, 242, 270];
  const rows = [82, 110, 138, 166, 194];
  const filled = {
    '0-4': C.terra, '1-4': C.brand, '2-4': C.terra, '3-4': C.brand, '2-3': C.brand,
    '3-3': C.terra, '3-2': C.brand, '4-4': C.terra, '4-3': C.terra, '1-3': C.terra, '5-4': C.brand,
  };
  return (
    <>
      <Shadow />
      <polygon points="104,248 142,248 134,212 112,212" fill={C.dark} />
      <polygon points="258,248 296,248 288,212 266,212" fill={C.dark} />
      <rect x="106" y="58" width="188" height="160" rx="14" fill={C.wood} />
      <rect x="106" y="210" width="188" height="8" rx="3" fill={C.mid} />
      {cols.map((cx, c) =>
        rows.map((cy, r) => <circle key={`${c}-${r}`} cx={cx} cy={cy} r="10.5" fill={filled[`${c}-${r}`] || C.hole} />),
      )}
      <circle cx="186" cy="34" r="11" fill={C.terra} />
    </>
  );
}

function Kubb() {
  const kubb = (x, y, s = 1, key) => (
    <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="0" y="0" width="18" height="40" rx="2" fill={C.light} />
      <polygon points="18,0 26,-5 26,35 18,40" fill={C.mid} />
      <polygon points="0,0 8,-5 26,-5 18,0" fill="#F4DDB8" />
    </g>
  );
  return (
    <>
      <Lawn />
      <Shadow cy="248" rx="150" />
      {[70, 100, 130].map((x, i) => kubb(x, 188, 0.9, `l${i}`))}
      {[250, 280, 310].map((x, i) => kubb(x, 188, 0.9, `r${i}`))}
      <g transform="translate(186 92)">
        <rect x="0" y="16" width="26" height="128" rx="2" fill={C.wood} />
        <polygon points="26,16 36,10 36,138 26,144" fill={C.dark} />
        <polygon points="0,16 4,4 8,12 13,0 18,12 22,4 26,16" fill={C.terra} />
        <rect x="0" y="34" width="26" height="4" fill={C.mid} opacity=".6" />
      </g>
      <g transform="translate(150 240) rotate(-14)">
        <rect x="-45" y="-6" width="90" height="12" rx="6" fill={C.mid} />
      </g>
      <g transform="translate(262 246) rotate(10)">
        <rect x="-45" y="-6" width="90" height="12" rx="6" fill={C.wood} />
      </g>
    </>
  );
}

function Cornhole() {
  return (
    <>
      <Shadow cy="258" rx="150" />
      <polygon points="110,245 290,245 290,256 110,256" fill={C.dark} />
      <polygon points="110,245 290,245 250,92 150,92" fill={C.wood} />
      <polygon points="122,200 278,200 282,215 118,215" fill={C.terra} />
      <polygon points="136,150 264,150 266,158 134,158" fill={C.brand} opacity=".85" />
      <ellipse cx="200" cy="124" rx="21" ry="11" fill={C.brand} />
      <g transform="translate(184 176) rotate(10)">
        <rect x="-14" y="-11" width="28" height="22" rx="7" fill={C.terra} stroke={C.brand} strokeOpacity=".25" />
      </g>
      <g transform="translate(305 258) rotate(-16)">
        <rect x="-14" y="-11" width="28" height="22" rx="7" fill={C.terra} />
      </g>
      <g transform="translate(86 262) rotate(12)">
        <rect x="-14" y="-11" width="28" height="22" rx="7" fill={C.brand} />
      </g>
    </>
  );
}

function TicTacToe() {
  const X = ({ x, y, r = 0 }) => (
    <g transform={`translate(${x} ${y}) rotate(${45 + r})`}>
      <rect x="-19" y="-5.5" width="38" height="11" rx="5.5" fill={C.terra} />
      <rect x="-5.5" y="-19" width="11" height="38" rx="5.5" fill={C.terra} />
    </g>
  );
  const O = ({ x, y }) => <circle cx={x} cy={y} r="15" fill="none" stroke={C.brand} strokeWidth="9" />;
  return (
    <>
      <Shadow cy="244" rx="120" />
      <rect x="118" y="66" width="164" height="172" rx="16" fill={C.mid} />
      <rect x="118" y="60" width="164" height="164" rx="16" fill={C.wood} />
      <path d="M173 76v132M227 76v132M134 115h132M134 169h132" stroke={C.mid} strokeWidth="5" strokeLinecap="round" />
      <X x={146} y={88} />
      <X x={200} y={142} />
      <O x={254} y={88} />
      <O x={146} y={196} />
      <X x={254} y={196} />
      <X x={326} y={236} r={18} />
    </>
  );
}

function RingToss() {
  const peg = (x, top, bottom) => (
    <g>
      <rect x={x - 6} y={top} width="12" height={bottom - top} rx="6" fill={C.wood} />
      <rect x={x - 6} y={top} width="5" height={bottom - top} rx="2.5" fill={C.light} opacity=".7" />
    </g>
  );
  return (
    <>
      <Shadow cy="248" rx="150" />
      <g transform="translate(200 226) rotate(12)">
        <rect x="-130" y="-11" width="260" height="22" rx="6" fill={C.mid} />
      </g>
      <g transform="translate(200 226) rotate(-12)">
        <rect x="-130" y="-11" width="260" height="22" rx="6" fill={C.wood} />
      </g>
      {peg(85, 150, 206)}
      {peg(315, 150, 206)}
      <ellipse cx="85" cy="196" rx="22" ry="7" fill="none" stroke={C.brand} strokeWidth="7" />
      {peg(200, 110, 226)}
      <ellipse cx="200" cy="206" rx="24" ry="7.5" fill="none" stroke={C.terra} strokeWidth="8" />
      <ellipse cx="200" cy="190" rx="24" ry="7.5" fill="none" stroke={C.brand} strokeWidth="8" />
      {peg(118, 190, 252)}
      {peg(282, 190, 252)}
      <g transform="translate(300 84) rotate(-22)">
        <ellipse rx="26" ry="9" fill="none" stroke={C.terra} strokeWidth="8" />
      </g>
    </>
  );
}

function Mikado() {
  const sticks = [
    { a: -32, dx: -10, dy: 4, c: C.terra },
    { a: -18, dx: 8, dy: -2, c: C.brand },
    { a: -6, dx: -4, dy: 6, c: C.grass },
    { a: 4, dx: 6, dy: 0, c: C.terra },
    { a: 14, dx: -8, dy: -4, c: C.brand },
    { a: 24, dx: 4, dy: 8, c: C.terra },
    { a: 36, dx: 0, dy: 0, c: C.grass },
    { a: 172, dx: 2, dy: 12, c: C.brand },
    { a: 162, dx: -6, dy: 10, c: C.terra },
  ];
  const L = 132;
  return (
    <>
      <Shadow cy="252" rx="160" />
      {sticks.map((s, i) => {
        const rad = (s.a * Math.PI) / 180;
        const cx = 200 + s.dx;
        const cy = 200 + s.dy;
        const ux = Math.cos(rad);
        const uy = Math.sin(rad) * 0.42;
        const at = (t) => [cx + ux * L * t, cy + uy * L * t];
        const band = (t0, t1) => {
          const [x1, y1] = at(t0);
          const [x2, y2] = at(t1);
          return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={s.c} strokeWidth="7" strokeLinecap="butt" />;
        };
        const [x1, y1] = at(-1);
        const [x2, y2] = at(1);
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={i % 2 ? C.wood : C.light} strokeWidth="7" strokeLinecap="round" />
            {band(0.72, 0.84)}
            {band(-0.84, -0.72)}
          </g>
        );
      })}
      <g transform="translate(262 92) rotate(-58)">
        <rect x="-95" y="-4" width="190" height="8" rx="4" fill={C.light} />
        <rect x="52" y="-4" width="18" height="8" fill={C.terra} />
        <rect x="-70" y="-4" width="18" height="8" fill={C.terra} />
      </g>
    </>
  );
}

function Checkers() {
  const q = quad([128, 100], [272, 100], [70, 236], [330, 236]);
  const n = 5;
  const cells = [];
  for (let r = 0; r < 4; r += 1) {
    for (let c = 0; c < n; c += 1) {
      const u0 = c / n;
      const u1 = (c + 1) / n;
      const v0 = r / 4;
      const v1 = (r + 1) / 4;
      cells.push(
        <polygon key={`${r}-${c}`} points={pts([q(u0, v0), q(u1, v0), q(u1, v1), q(u0, v1)])} fill={(r + c) % 2 ? C.dark : C.light} />,
      );
    }
  }
  const piece = (u, v, fill, key) => {
    const [x, y] = q(u, v);
    const s = 0.72 + v * 0.35;
    return (
      <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
        <ellipse cx="0" cy="6" rx="21" ry="10" fill={fill === C.brand ? '#3E1800' : C.mid} />
        <ellipse cx="0" cy="0" rx="21" ry="10" fill={fill} />
        <ellipse cx="0" cy="0" rx="12" ry="5.5" fill="none" stroke={fill === C.brand ? '#7A3A12' : C.wood} strokeWidth="2" />
      </g>
    );
  };
  return (
    <>
      <Shadow cy="248" rx="150" />
      <polygon points={pts([[70, 236], [330, 236], [330, 246], [70, 246]])} fill={C.mid} />
      {cells}
      {piece(0.3, 0.125, C.brand, 'a')}
      {piece(0.7, 0.125, C.brand, 'b')}
      {piece(0.5, 0.375, C.brand, 'c')}
      {piece(0.3, 0.625, '#F4E4CD', 'd')}
      {piece(0.9, 0.625, '#F4E4CD', 'e')}
      {piece(0.1, 0.875, '#F4E4CD', 'f')}
      {piece(0.5, 0.875, '#F4E4CD', 'g')}
    </>
  );
}

function Labyrinth() {
  const q = quad([120, 78], [280, 78], [84, 226], [316, 226]);
  const walls = [
    [[0.08, 0.3], [0.55, 0.3]],
    [[0.55, 0.3], [0.55, 0.12]],
    [[0.75, 0.08], [0.75, 0.55]],
    [[0.3, 0.3], [0.3, 0.72]],
    [[0.3, 0.72], [0.62, 0.72]],
    [[0.45, 0.5], [0.92, 0.5]],
    [[0.62, 0.72], [0.62, 0.92]],
    [[0.8, 0.72], [0.92, 0.72]],
    [[0.12, 0.52], [0.12, 0.92]],
  ];
  const holes = [[0.2, 0.15], [0.44, 0.6], [0.86, 0.3], [0.78, 0.84], [0.45, 0.86]];
  const [bx, by] = q(0.62, 0.18);
  return (
    <>
      <defs>
        <radialGradient id="ball" cx="35%" cy="35%" r="70%">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset=".45" stopColor="#C9C3BC" />
          <stop offset="1" stopColor="#6E655D" />
        </radialGradient>
      </defs>
      <Shadow cy="250" rx="150" />
      <polygon points={pts([[84, 226], [316, 226], [316, 240], [84, 240]])} fill={C.dark} />
      <polygon points={pts([q(0, 0), q(1, 0), q(1, 1), q(0, 1)])} fill={C.wood} stroke={C.mid} strokeWidth="10" strokeLinejoin="round" />
      {holes.map(([u, v], i) => {
        const [x, y] = q(u, v);
        return <ellipse key={i} cx={x} cy={y} rx={9 + v * 3} ry={5 + v * 1.5} fill={C.brand} />;
      })}
      {walls.map(([a, b], i) => {
        const [x1, y1] = q(...a);
        const [x2, y2] = q(...b);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.light} strokeWidth="7" strokeLinecap="round" />;
      })}
      <circle cx={bx} cy={by - 4} r="8" fill="url(#ball)" />
      <circle cx={q(0.06, 0.94)[0] + 8} cy={q(0.06, 0.94)[1] - 4} r="5" fill={C.terra} />
    </>
  );
}

function Croquet() {
  return (
    <>
      <Lawn />
      <Shadow cy="248" rx="150" />
      <path d="M236 244V206a30 30 0 0 1 60 0v38" fill="none" stroke={C.cream} strokeWidth="7" strokeLinecap="round" />
      <path d="M236 244V206a30 30 0 0 1 60 0v38" fill="none" stroke={C.brand} strokeWidth="7" strokeLinecap="round" strokeDasharray="0.1 16" opacity=".25" />
      <line x1="112" y1="46" x2="170" y2="198" stroke={C.wood} strokeWidth="9" strokeLinecap="round" />
      <g transform="translate(170 212) rotate(-21)">
        <rect x="-44" y="-17" width="88" height="34" rx="10" fill={C.mid} />
        <rect x="-44" y="-17" width="14" height="34" rx="6" fill={C.terra} />
        <rect x="30" y="-17" width="14" height="34" rx="6" fill={C.terra} />
      </g>
      <circle cx="232" cy="230" r="19" fill={C.terra} />
      <path d="M215 222c10 6 24 6 34 0" stroke={C.cream} strokeWidth="3" fill="none" />
      <circle cx="330" cy="238" r="15" fill={C.brand} />
      <path d="M317 232c8 5 18 5 26 0" stroke={C.wood} strokeWidth="3" fill="none" />
    </>
  );
}

function Kids() {
  const arcs = [
    { r: 82, c: C.terra },
    { r: 64, c: C.wood },
    { r: 46, c: C.brand },
    { r: 28, c: C.light },
  ];
  const cube = (x, y, face, key, mark) => (
    <g key={key} transform={`translate(${x} ${y})`}>
      <rect x="0" y="0" width="44" height="44" rx="4" fill={face} />
      <polygon points="44,0 56,-8 56,36 44,44" fill={C.dark} />
      <polygon points="0,0 12,-8 56,-8 44,0" fill="#F4DDB8" />
      {mark}
    </g>
  );
  return (
    <>
      <Shadow cy="252" rx="160" />
      {arcs.map(({ r, c }) => (
        <path key={r} d={`M${146 - r} 242A${r} ${r} 0 0 1 ${146 + r} 242`} fill="none" stroke={c} strokeWidth="17" />
      ))}
      {cube(242, 198, C.wood, 'a', <circle cx="22" cy="22" r="9" fill={C.terra} />)}
      {cube(298, 198, C.light, 'b', <rect x="13" y="13" width="18" height="18" rx="3" fill={C.brand} />)}
      {cube(270, 146, C.light, 'c', <polygon points="22,10 34,32 10,32" fill={C.terra} />)}
    </>
  );
}

function Balance() {
  return (
    <>
      <Shadow cy="256" rx="150" />
      <path d="M70 168Q200 318 330 168" fill="none" stroke={C.dark} strokeWidth="30" strokeLinecap="round" />
      <path d="M70 160Q200 310 330 160" fill="none" stroke={C.wood} strokeWidth="26" strokeLinecap="round" />
      <path d="M92 175Q200 296 308 175" fill="none" stroke={C.terra} strokeWidth="6" strokeLinecap="round" opacity=".85" />
      <g transform="translate(92 92)">
        <ellipse cx="0" cy="8" rx="30" ry="12" fill={C.mid} />
        <ellipse cx="0" cy="0" rx="30" ry="12" fill={C.light} />
      </g>
      <g transform="translate(318 84)">
        <ellipse cx="0" cy="7" rx="24" ry="10" fill={C.brand} />
        <ellipse cx="0" cy="0" rx="24" ry="10" fill={C.terra} />
      </g>
    </>
  );
}

const arts = {
  jenga: Jenga,
  connect4: ConnectFour,
  kubb: Kubb,
  cornhole: Cornhole,
  tictactoe: TicTacToe,
  ringtoss: RingToss,
  mikado: Mikado,
  checkers: Checkers,
  labyrinth: Labyrinth,
  croquet: Croquet,
  kids: Kids,
  balance: Balance,
};

export default function GameArt({ name, className = '' }) {
  const Art = arts[name] || Jenga;
  return (
    <div className={`game-art ${className}`}>
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" role="presentation" aria-hidden="true">
        <Art />
      </svg>
    </div>
  );
}
